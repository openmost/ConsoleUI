<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\ConsoleUI\Console;

use Piwik\Container\StaticContainer;
use Piwik\Log\Logger;
use Piwik\Piwik;
use Piwik\Plugins\Monolog\Formatter\ConsoleFormatter;
use Symfony\Bridge\Monolog\Handler\ConsoleHandler;
use Symfony\Component\Console\Formatter\OutputFormatter;
use Symfony\Component\Console\Input\StringInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Runs Matomo console commands in-process, without `exec()` or `proc_open()`, so it works on hostings where they are
 * disabled. The few Matomo commands that call system tools through a shell are blocked by the policy.
 */
class CommandRunner
{
    /** Terminal size the commands see, fixed as the browser has no terminal */
    private const TERMINAL_COLUMNS = 120;
    private const TERMINAL_LINES = 50;

    /** Environment variables Symfony sets while running, restored afterwards as a PHP-FPM worker serves other requests */
    private const ENVIRONMENT_VARIABLES = ['COLUMNS', 'LINES', 'SHELL_VERBOSITY'];

    /** Script name the help of the commands shows, as on the command line */
    private const SCRIPT_NAME = 'console';

    /** @var CommandPolicy */
    private $policy;

    public function __construct(CommandPolicy $policy)
    {
        $this->policy = $policy;
    }

    public function getPolicy(): CommandPolicy
    {
        return $this->policy;
    }

    /**
     * Runs a command line and hands its output, logs included, to $onOutput while it runs.
     *
     * @param callable(string): void $onOutput Receives raw output, ANSI colors included
     * @param StopSignal|null $stopSignal Interrupts the command when the user stops it
     * @return int The exit code
     * @throws \InvalidArgumentException When the command line is invalid
     * @throws CommandNotAllowedException When the console is disabled
     */
    public function run(string $commandLine, callable $onOutput, ?StopSignal $stopSignal = null): int
    {
        if (!$this->policy->isEnabled()) {
            throw new CommandNotAllowedException('*');
        }

        $commandLine = CommandLine::normalize($commandLine);
        if ($commandLine === '') {
            $commandLine = 'list';
        }

        // Matomo acts on these before resolving the command, the policy would come too late
        if ((new StringInput($commandLine))->hasParameterOption(CommandPolicy::FORBIDDEN_GLOBAL_OPTIONS, true)) {
            throw new \InvalidArgumentException(Piwik::translate(
                'ConsoleUI_OptionNotAllowed',
                [implode(', ', CommandPolicy::FORBIDDEN_GLOBAL_OPTIONS)]
            ));
        }

        $logger = StaticContainer::get(Logger::class);
        $login = Piwik::getCurrentUserLogin();
        $loggedLine = CommandLine::redact($commandLine);

        // A warning so the default log level keeps it: running commands from the browser is worth an audit trail
        $logger->warning('ConsoleUI: {login} started "{command}"', ['login' => $login, 'command' => $loggedLine]);

        $output = new StreamedOutput(static function (string $text) use ($onOutput, $stopSignal) {
            // Output is where a command can be interrupted safely, as with Ctrl+C on the command line
            if ($stopSignal) {
                $stopSignal->throwIfRequested();
            }
            $onOutput($text);
        });
        $logHandler = $this->createLogHandler($output);
        $logger->pushHandler($logHandler);

        try {
            $exitCode = $this->withConsoleEnvironment(function () use ($commandLine, $output) {
                try {
                    return $this->runConsole($commandLine, $output);
                } catch (\Throwable $e) {
                    // Symfony only catches exceptions, a PHP error raised by a command, or the stop thrown while
                    // Symfony renders an exception, lands here
                    $output->writeln('<error>' . OutputFormatter::escape($e->getMessage()) . '</error>');
                    return 1;
                }
            });
        } finally {
            $handlers = $logger->getHandlers();
            if (isset($handlers[0]) && $handlers[0] === $logHandler) {
                $logger->popHandler();
            }
        }

        if ($stopSignal && $stopSignal->wasStopped()) {
            $exitCode = StopSignal::EXIT_CODE;
        }

        $logger->warning('ConsoleUI: {login} ran "{command}", exit code {exitCode}', [
            'login' => $login,
            'command' => $loggedLine,
            'exitCode' => $exitCode,
        ]);

        /**
         * Triggered after a console command ran from the Console page, for audit purposes.
         *
         * @param string $commandLine The command line, with the values of secret options masked
         * @param int $exitCode
         * @param string $login The super user who ran it
         */
        Piwik::postEvent('ConsoleUI.commandExecuted', [$loggedLine, $exitCode, $login]);

        return $exitCode;
    }

    /**
     * The commands the policy allows, with their arguments and options, for the command library and the autocompletion.
     *
     * @return array{commands: array<int, array<string, mixed>>, globalOptions: array<int, array<string, mixed>>}
     */
    public function getCatalog(): array
    {
        if (!$this->policy->isEnabled()) {
            return ['commands' => [], 'globalOptions' => []];
        }

        $output = new BufferedOutput(OutputInterface::VERBOSITY_NORMAL, false);
        $this->withConsoleEnvironment(function () use ($output) {
            return $this->runConsole('list --format=json', $output);
        });

        $list = json_decode($output->fetch(), true);
        if (!is_array($list) || empty($list['commands'])) {
            return ['commands' => [], 'globalOptions' => []];
        }

        return CommandCatalog::fromListOutput($list, CommandPolicy::FORBIDDEN_GLOBAL_OPTIONS);
    }

    private function runConsole(string $commandLine, OutputInterface $output): int
    {
        $console = new WebConsole($this->policy);

        $input = new StringInput($commandLine);
        $input->setInteractive(false);

        return (int) $console->run($input, $output);
    }

    /**
     * @template T
     * @param callable(): T $callback
     * @return T
     */
    private function withConsoleEnvironment(callable $callback)
    {
        $previous = [];
        foreach (self::ENVIRONMENT_VARIABLES as $name) {
            $previous[$name] = getenv($name);
        }
        $previousServer = [];
        foreach (['SHELL_VERBOSITY', 'PHP_SELF', 'argv'] as $name) {
            $previousServer[$name] = $_SERVER[$name] ?? null;
        }
        $previousEnvVerbosity = $_ENV['SHELL_VERBOSITY'] ?? null;

        // Symfony names the script after PHP_SELF in the help of the commands
        $_SERVER['PHP_SELF'] = self::SCRIPT_NAME;

        if (function_exists('putenv')) {
            @putenv('COLUMNS=' . self::TERMINAL_COLUMNS);
            @putenv('LINES=' . self::TERMINAL_LINES);
        }

        try {
            return $callback();
        } finally {
            if (function_exists('putenv')) {
                foreach ($previous as $name => $value) {
                    @putenv($value === false ? $name : $name . '=' . $value);
                }
            }
            // argv is rebuilt from the query string by the Matomo console on CGI hostings
            foreach ($previousServer as $name => $value) {
                self::restoreSuperglobal($_SERVER, $name, $value);
            }
            self::restoreSuperglobal($_ENV, 'SHELL_VERBOSITY', $previousEnvVerbosity);
        }
    }

    /**
     * @param array<string, mixed> $superglobal
     * @param mixed $value
     */
    private static function restoreSuperglobal(array &$superglobal, string $name, $value): void
    {
        if ($value === null) {
            unset($superglobal[$name]);
        } else {
            $superglobal[$name] = $value;
        }
    }

    /**
     * The same console log handler as the Matomo CLI: most commands, core:archive first, report progress in the logs
     */
    private function createLogHandler(OutputInterface $output): ConsoleHandler
    {
        $handler = new ConsoleHandler($output, true, [
            OutputInterface::VERBOSITY_NORMAL => Logger::INFO,
            OutputInterface::VERBOSITY_VERBOSE => Logger::DEBUG,
            OutputInterface::VERBOSITY_VERY_VERBOSE => Logger::DEBUG,
            OutputInterface::VERBOSITY_DEBUG => Logger::DEBUG,
            OutputInterface::VERBOSITY_QUIET => Logger::ERROR,
        ]);
        $handler->setFormatter(new ConsoleFormatter([
            'date_format' => 'Y-m-d H:i:s',
            'format' => '%start_tag%%level_name% [%datetime%] %end_tag% %message%' . PHP_EOL,
            'multiline' => true,
        ]));

        return $handler;
    }
}
