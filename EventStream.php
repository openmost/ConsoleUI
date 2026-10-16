<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\ConsoleUI;

use Piwik\Plugins\ConsoleUI\Console\AnsiParser;

/**
 * Server-Sent Events stream carrying the output of a command to the browser while it runs.
 *
 * Output is sent as style segments (see AnsiParser), never as HTML. Text a command echoes directly instead of
 * writing to its output is captured by an output buffer and sent the same way, so it cannot break the stream.
 */
class EventStream
{
    /** Beyond this, output is dropped so a verbose command cannot freeze the browser */
    public const MAX_OUTPUT_BYTES = 2000000;

    /** @var callable(string): void */
    private $writer;

    /** @var AnsiParser */
    private $parser;

    /** @var int */
    private $outputBytes = 0;

    /** @var bool */
    private $truncated = false;

    /** @var bool True while the stream writes its own events, which the output buffer lets through */
    private $writing = false;

    /** @var bool */
    private $buffering = false;

    /**
     * @param callable(string): void|null $writer Receives the raw event text, echoes it by default
     */
    public function __construct(?callable $writer = null)
    {
        $this->parser = new AnsiParser();
        $this->writer = $writer ?: function (string $event): void {
            $this->writing = true;
            echo $event;
            $this->writing = false;
            flush();
        };
    }

    public function open(): void
    {
        while (ob_get_level()) {
            ob_end_clean();
        }

        header('Content-Type: text/event-stream; charset=utf-8');
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
        header('X-Accel-Buffering: no'); // Nginx
        header('X-Content-Type-Options: nosniff');

        // Sends the headers right away: a command calling header() itself (plugin:list does) must not replace them
        echo ": stream\n\n";
        flush();

        // A chunk size of 1 hands every echo to the handler right away
        ob_start([$this, 'captureStrayOutput'], 1);
        $this->buffering = true;
    }

    public function close(): void
    {
        $this->emit('done', ['truncated' => $this->truncated]);

        if ($this->buffering) {
            $this->buffering = false;
            ob_end_flush();
        }
    }

    public function output(string $text): void
    {
        $event = $this->formatOutput($text);
        if ($event !== '') {
            ($this->writer)($event);
        }
    }

    /**
     * @param array<string, mixed> $data
     */
    public function emit(string $type, array $data = []): void
    {
        ($this->writer)(self::format($type, $data));
    }

    /**
     * Output buffer handler: lets the events of the stream through, wraps anything else as command output.
     *
     * @internal
     */
    public function captureStrayOutput(string $buffer): string
    {
        if ($this->writing || $buffer === '') {
            return $buffer;
        }

        return $this->formatOutput($buffer);
    }

    public function isTruncated(): bool
    {
        return $this->truncated;
    }

    private function formatOutput(string $text): string
    {
        if ($this->truncated || $text === '') {
            return '';
        }

        $this->outputBytes += strlen($text);
        if ($this->outputBytes > self::MAX_OUTPUT_BYTES) {
            $this->truncated = true;
            return self::format('truncated');
        }

        $segments = $this->parser->parse($text);
        if (empty($segments)) {
            return '';
        }

        return self::format('output', ['segments' => $segments]);
    }

    /**
     * @param array<string, mixed> $data
     */
    private static function format(string $type, array $data = []): string
    {
        return 'data: ' . json_encode(['type' => $type] + $data, JSON_INVALID_UTF8_SUBSTITUTE) . "\n\n";
    }
}
