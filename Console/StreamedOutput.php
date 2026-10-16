<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\ConsoleUI\Console;

use Symfony\Component\Console\Formatter\OutputFormatterInterface;
use Symfony\Component\Console\Output\Output;

/**
 * Console output handed to a callback as soon as the command writes it, so the browser sees it live.
 */
class StreamedOutput extends Output
{
    /** @var callable(string): void */
    private $writer;

    /**
     * @param callable(string): void $writer
     */
    public function __construct(
        callable $writer,
        int $verbosity = self::VERBOSITY_NORMAL,
        bool $decorated = true,
        ?OutputFormatterInterface $formatter = null
    ) {
        parent::__construct($verbosity, $decorated, $formatter);
        $this->writer = $writer;
    }

    protected function doWrite(string $message, bool $newline)
    {
        ($this->writer)($newline ? $message . "\n" : $message);
    }
}
