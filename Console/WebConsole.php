<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\ConsoleUI\Console;

use Piwik\Config;
use Piwik\Console;
use Piwik\SettingsPiwik;
use Piwik\UrlHelper;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * The Matomo console, run inside the current web request.
 *
 * It reuses the environment, the host and the authenticated super user of the request instead of booting a CLI
 * environment. A command the policy refuses is never registered, and every command is checked again once Symfony
 * resolved its real name and parsed its input, so an abbreviation, an alias or quoting cannot slip past the policy.
 */
class WebConsole extends Console
{
    /** @var CommandPolicy */
    private $policy;

    public function __construct(CommandPolicy $policy)
    {
        parent::__construct();

        $this->policy = $policy;

        $this->setAutoExit(false);
        $this->setCatchExceptions(true);
    }

    protected function initEnvironment(OutputInterface $output)
    {
        return Config::getInstance();
    }

    protected function initMatomoHost(InputInterface $input)
    {
        // The host of the web request is already the right one
    }

    /**
     * A command the policy refuses is never registered: it is missing from `list`, from the suggestions and
     * from the abbreviations Symfony resolves.
     */
    public function add(Command $command)
    {
        if (!$this->policy->isCommandAllowed((string) $command->getName())) {
            return null;
        }

        return parent::add($command);
    }

    protected function doRunCommand(Command $command, InputInterface $input, OutputInterface $output)
    {
        $name = (string) $command->getName();
        $this->policy->assertCanRun($name);

        // Parsed now to inspect the values, Symfony parses the input again when it runs the command
        $command->mergeApplicationDefinition();
        $input->bind($command->getDefinition());

        if (CommandPolicy::isConfigWriter($name)) {
            $this->policy->assertConfigWritesAllowed($name, self::configSettings($input));
        }

        // core:archive sends a super user token to this URL, it must stay this Matomo
        if ($command->getDefinition()->hasOption('url')) {
            self::assertIsMatomoUrl($name, (string) $input->getOption('url'));
        }

        return parent::doRunCommand($command, $input, $output);
    }

    /**
     * Settings a config:set or config:delete is about to change, from its options and its assignment arguments
     *
     * @return array<int, array{section: string, key: string}>
     */
    private static function configSettings(InputInterface $input): array
    {
        $settings = [];

        $section = $input->hasOption('section') ? (string) $input->getOption('section') : '';
        if ($section !== '') {
            $key = $input->hasOption('key') ? (string) $input->getOption('key') : '';
            $settings[] = ['section' => $section, 'key' => $key];
        }

        foreach (['assignment', 'argument'] as $argumentName) {
            if (!$input->hasArgument($argumentName)) {
                continue;
            }
            foreach ((array) $input->getArgument($argumentName) as $assignment) {
                if ((string) $assignment !== '') {
                    $settings[] = CommandPolicy::parseConfigAssignment((string) $assignment);
                }
            }
        }

        return $settings;
    }

    private static function assertIsMatomoUrl(string $commandName, string $url): void
    {
        if ($url === '') {
            return;
        }

        $matomoHost = UrlHelper::getHostFromUrl((string) SettingsPiwik::getPiwikUrl());
        $host = UrlHelper::getHostFromUrl($url);
        if (!$matomoHost || !$host || strcasecmp($host, $matomoHost) !== 0) {
            throw new CommandNotAllowedException($commandName . ' --url');
        }
    }
}
