<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\ConsoleUI\Console;

/**
 * Turns the ANSI colored output of a command into plain text segments carrying a style.
 *
 * The browser renders the segments as text nodes, never as HTML, so a command printing markup cannot inject it into
 * the page. Escape sequences other than colors (cursor moves of progress bars, line erasing) are dropped. The parser
 * keeps its state between chunks, as a stream may cut a sequence or a style in two.
 */
class AnsiParser
{
    private const COLORS = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];

    /** @var string|null */
    private $foreground = null;

    /** @var string|null */
    private $background = null;

    /** @var bool */
    private $bold = false;

    /** @var bool */
    private $underline = false;

    /** @var string Start of an escape sequence left at the end of the previous chunk */
    private $pending = '';

    /**
     * @return array<int, array{text: string, style: string}>
     */
    public function parse(string $chunk): array
    {
        $chunk = $this->pending . $chunk;
        $this->pending = '';

        // Keeps an unterminated escape sequence for the next chunk
        if (preg_match('/\x1B(?:\[[0-9;?]*)?$/', $chunk, $match)) {
            $this->pending = $match[0];
            $chunk = substr($chunk, 0, -strlen($match[0]));
        }

        $segments = [];
        $parts = preg_split('/(\x1B\[[0-9;?]*[A-Za-z])/', $chunk, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);

        foreach ($parts ?: [] as $part) {
            if ($part[0] === "\x1B") {
                if (substr($part, -1) === 'm') {
                    $this->applySgr(substr($part, 2, -1));
                }
                continue;
            }

            $text = str_replace("\x1B", '', $part);
            if ($text === '') {
                continue;
            }

            $style = $this->currentStyle();
            $last = count($segments) - 1;
            if ($last >= 0 && $segments[$last]['style'] === $style) {
                $segments[$last]['text'] .= $text;
            } else {
                $segments[] = ['text' => $text, 'style' => $style];
            }
        }

        return $segments;
    }

    private function applySgr(string $parameters): void
    {
        $codes = $parameters === '' ? [0] : array_map('intval', explode(';', $parameters));

        for ($i = 0, $count = count($codes); $i < $count; $i++) {
            $code = $codes[$i];

            if ($code === 0) {
                $this->foreground = null;
                $this->background = null;
                $this->bold = false;
                $this->underline = false;
            } elseif ($code === 1) {
                $this->bold = true;
            } elseif ($code === 22) {
                $this->bold = false;
            } elseif ($code === 4) {
                $this->underline = true;
            } elseif ($code === 24) {
                $this->underline = false;
            } elseif ($code >= 30 && $code <= 37) {
                $this->foreground = self::COLORS[$code - 30];
            } elseif ($code >= 90 && $code <= 97) {
                $this->foreground = 'bright-' . self::COLORS[$code - 90];
            } elseif ($code === 39) {
                $this->foreground = null;
            } elseif ($code >= 40 && $code <= 47) {
                $this->background = self::COLORS[$code - 40];
            } elseif ($code >= 100 && $code <= 107) {
                $this->background = 'bright-' . self::COLORS[$code - 100];
            } elseif ($code === 49) {
                $this->background = null;
            } elseif ($code === 38 || $code === 48) {
                // 256 colors and true colors are not rendered, their parameters are skipped
                $i += (($codes[$i + 1] ?? 0) === 2) ? 4 : 2;
            }
        }
    }

    /**
     * Space separated style tokens, from a closed list, that the browser maps to CSS classes
     */
    private function currentStyle(): string
    {
        $tokens = [];
        if ($this->foreground !== null) {
            $tokens[] = 'fg-' . $this->foreground;
        }
        if ($this->background !== null) {
            $tokens[] = 'bg-' . $this->background;
        }
        if ($this->bold) {
            $tokens[] = 'bold';
        }
        if ($this->underline) {
            $tokens[] = 'underline';
        }

        return implode(' ', $tokens);
    }
}
