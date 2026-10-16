<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\ConsoleUI\Console;

use Piwik\Piwik;

/**
 * The command line typed in the browser. It is never handed to a shell: Symfony parses it in-process.
 */
class CommandLine
{
    public const MAX_LENGTH = 4096;

    /** Value of an option whose name looks like a secret, in both `--opt=value` and `--opt value` forms */
    private const SECRET_OPTION = '/(--[a-z0-9_-]*(?:pass|secret|token|api-?key|credential|license)[a-z0-9_-]*)(=|\s+)("[^"]*"|\'[^\']*\'|\S+)/i';

    /** Value given to config:set, as an option or as a `Section.key=value` assignment: any setting may be a secret */
    private const CONFIG_VALUE = '/(--value(?:=|\s+)|\b[a-z0-9_]+\.[a-z0-9_\[\]-]+=)("[^"]*"|\'[^\']*\'|\S+)/i';

    /**
     * Trims the line and drops the `php console`, `./console` or `console` prefix pasted from a documentation.
     *
     * @throws \InvalidArgumentException
     */
    public static function normalize(string $commandLine): string
    {
        if (strlen($commandLine) > self::MAX_LENGTH) {
            throw new \InvalidArgumentException(Piwik::translate('ConsoleUI_CommandTooLong', [self::MAX_LENGTH]));
        }

        // A single line only: a line break would hide what really runs, in the page and in the logs
        if (
            preg_match('/[\x00-\x08\x0A-\x1F\x7F]/', $commandLine)
            || preg_match('/[\x{0085}\x{2028}\x{2029}]/u', $commandLine)
        ) {
            throw new \InvalidArgumentException(Piwik::translate('ConsoleUI_CommandInvalidCharacters'));
        }

        $commandLine = trim($commandLine);
        $commandLine = (string) preg_replace('/^(?:php(?:\d[\d.]*)?\s+)?(?:\.\/)?console(?:\s+|$)/i', '', $commandLine);

        return trim($commandLine);
    }

    /**
     * The line as it may be written to the logs, with the values of password, token, key or config options masked.
     */
    public static function redact(string $commandLine): string
    {
        $commandLine = (string) preg_replace(self::SECRET_OPTION, '$1$2***', $commandLine);

        return (string) preg_replace(self::CONFIG_VALUE, '$1***', $commandLine);
    }
}
