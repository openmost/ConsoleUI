<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\ConsoleUI\tests\Integration;

use Piwik\Config;
use Piwik\Container\StaticContainer;
use Piwik\Log\Logger;
use Piwik\Piwik;
use Piwik\Plugins\ConsoleUI\Console\CommandNotAllowedException;
use Piwik\Plugins\ConsoleUI\Console\CommandPolicy;
use Piwik\Plugins\ConsoleUI\Console\CommandRunner;
use Piwik\Plugins\ConsoleUI\Console\StopSignal;
use Piwik\Tests\Framework\Fixture;
use Piwik\Tests\Framework\Mock\FakeAccess;
use Piwik\Tests\Framework\TestCase\IntegrationTestCase;

/**
 * Runs real Matomo commands in-process, as the Console page does
 *
 * @group ConsoleUI
 * @group CommandRunnerTest
 * @group Plugins
 */
class CommandRunnerTest extends IntegrationTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        Fixture::createSuperUser();
        FakeAccess::clearAccess(true);

        // the test environment only loads the translations of the core plugins
        StaticContainer::get('Piwik\Translation\Translator')->addDirectory(__DIR__ . '/../../lang');
    }

    public function provideContainerConfig()
    {
        return [
            'Piwik\Access' => new FakeAccess(),
        ];
    }

    /**
     * @return array{0: int, 1: string}
     */
    private function runCommand(string $commandLine, ?CommandPolicy $policy = null): array
    {
        $output = '';
        $exitCode = (new CommandRunner($policy ?: new CommandPolicy()))->run(
            $commandLine,
            function (string $text) use (&$output) {
                $output .= $text;
            }
        );

        // Compared without colors
        return [$exitCode, (string) preg_replace('/\x1B\[[0-9;]*m/', '', $output)];
    }

    public function testRunsACommandAndReturnsItsOutput()
    {
        [$exitCode, $output] = $this->runCommand('list');

        $this->assertSame(0, $exitCode);
        $this->assertStringContainsString('core:archive', $output);
        $this->assertStringContainsString('Available commands', $output);
    }

    public function testEmptyLineListsTheCommands()
    {
        [$exitCode, $output] = $this->runCommand('   ');

        $this->assertSame(0, $exitCode);
        $this->assertStringContainsString('Available commands', $output);
    }

    public function testConsolePrefixIsIgnored()
    {
        [$exitCode, $output] = $this->runCommand('./console help list');

        $this->assertSame(0, $exitCode);
        $this->assertStringContainsString('list [options]', $output);
    }

    public function testOutputIsColoredForTheBrowser()
    {
        $output = '';
        (new CommandRunner(new CommandPolicy()))->run('list', function (string $text) use (&$output) {
            $output .= $text;
        });

        $this->assertRegExp('/\x1B\[[0-9;]*m/', $output);
    }

    public function testBlockedCommandsDoNotExist()
    {
        [$exitCode, $output] = $this->runCommand('development:enable');

        $this->assertNotSame(0, $exitCode);
        $this->assertStringContainsString('no commands defined in the "development" namespace', $output);
    }

    public function testBlockedCommandsAreMissingFromTheList()
    {
        [, $output] = $this->runCommand('list', new CommandPolicy(true, ['core:*']));

        $this->assertStringNotContainsString('core:archive', $output);
        $this->assertStringNotContainsString('development:enable', $output);
        $this->assertStringContainsString('plugin:list', $output);
    }

    public function testAbbreviationsCannotReachABlockedCommand()
    {
        [$exitCode, $output] = $this->runCommand('core:arch', new CommandPolicy(true, ['core:archive']));

        $this->assertNotSame(0, $exitCode);
        $this->assertStringNotContainsString('Starting Matomo reports archiving', $output);
    }

    public function testAllowListRestrictsTheCommands()
    {
        [$exitCode, $output] = $this->runCommand('plugin:list', new CommandPolicy(true, [], ['core:archive']));

        $this->assertNotSame(0, $exitCode);
        $this->assertStringContainsString('no commands defined in the "plugin" namespace', $output);
    }

    public function testConfigSectionOfTheConsoleCannotBeChanged()
    {
        [$exitCode, $output] = $this->runCommand('config:set --section=ConsoleUI --key=enabled --value=1');

        $this->assertSame(1, $exitCode);
        $this->assertStringContainsString('cannot be run from the browser', $output);
    }

    /**
     * Symfony unescapes and joins quoted pieces, the guard reads the parsed values so none of these slip through
     *
     * @dataProvider getDisguisedProtectedConfigWrites
     */
    public function testProtectedConfigCannotBeChangedWithQuotingTricks(string $commandLine)
    {
        [$exitCode, $output] = $this->runCommand($commandLine);

        $this->assertSame(1, $exitCode);
        $this->assertStringContainsString('cannot be run from the browser', $output);
        $this->assertNotSame('1', (string) (Config::getInstance()->Development['enabled'] ?? ''));
    }

    public function getDisguisedProtectedConfigWrites(): array
    {
        return [
            ['config:set --section=Console\\UI --key=enabled --value=1'],
            ['config:set --section=Console"UI" --key=enabled --value=1'],
            ['config:set "Console\\x55I.enabled=1"'],
            ["config:delete --section=Console''UI --key=blocked_commands"],
            ['config:set Development.enabled=1'],
            ['config:set General.enable_plugin_upload=1'],
            ['config:set --section=general --key=ENABLE_PLUGINS_ADMIN --value=1'],
            ['config:s General.always_load_commands_from_plugin=Foo'],
        ];
    }

    /**
     * @dataProvider getShellCommands
     */
    public function testCommandsCallingAShellDoNotExist(string $commandLine)
    {
        [$exitCode, $output] = $this->runCommand($commandLine);

        $this->assertNotSame(0, $exitCode);
        $this->assertMatchesNotDefined($output);
    }

    public function getShellCommands(): array
    {
        return [
            ['git:commit -m \'x"; id; echo "\''],
            ['git:pull'],
            ['log:watch'],
        ];
    }

    private function assertMatchesNotDefined(string $output): void
    {
        $this->assertRegExp('/is not defined|no commands defined/', $output);
    }

    /**
     * @dataProvider getForbiddenGlobalOptions
     */
    public function testForbiddenGlobalOptionsAreRefused(string $commandLine)
    {
        $this->expectException(\InvalidArgumentException::class);

        $this->runCommand($commandLine);
    }

    public function getForbiddenGlobalOptions(): array
    {
        return [
            ['list --xhprof'],
            ['core:archive --matomo-domain=evil.example'],
            ['list --matomo-domain evil.example'],
        ];
    }

    public function testArchivingCannotTargetAnotherHost()
    {
        [$exitCode, $output] = $this->runCommand('core:archive --url=https://evil.example/');

        $this->assertSame(1, $exitCode);
        $this->assertStringContainsString('cannot be run from the browser', $output);
    }

    public function testStoppedCommandEndsWithTheInterruptExitCode()
    {
        $directory = sys_get_temp_dir() . '/consoleui-stop-' . uniqid();
        $stopSignal = new StopSignal('0123456789abcdef', $directory);
        $stopSignal->start(Piwik::getCurrentUserLogin());
        (new StopSignal('0123456789abcdef', $directory))->request(Piwik::getCurrentUserLogin());

        $output = '';
        $exitCode = (new CommandRunner(new CommandPolicy()))->run('list', function (string $text) use (&$output) {
            $output .= $text;
        }, $stopSignal);
        $stopSignal->finish();
        @rmdir($directory);

        $this->assertSame(StopSignal::EXIT_CODE, $exitCode);
        $this->assertStringContainsString('stopped', $output);
        $this->assertStringNotContainsString('Available commands', $output);
    }

    public function testDisabledConsoleRefusesToRun()
    {
        $this->expectException(CommandNotAllowedException::class);

        $this->runCommand('list', new CommandPolicy(false));
    }

    public function testInvalidCommandLineIsRefused()
    {
        $this->expectException(\InvalidArgumentException::class);

        $this->runCommand("list\ncore:archive");
    }

    public function testInvalidOptionIsReportedAsAnError()
    {
        [$exitCode, $output] = $this->runCommand('list --this-option-does-not-exist');

        $this->assertNotSame(0, $exitCode);
        $this->assertStringContainsString('does not exist', $output);
    }

    public function testLogHandlerIsRemovedAfterTheRun()
    {
        $logger = StaticContainer::get(Logger::class);
        $handlers = $logger->getHandlers();

        $this->runCommand('list');

        $this->assertSame($handlers, $logger->getHandlers());
    }

    public function testEnvironmentIsRestoredAfterTheRun()
    {
        putenv('COLUMNS=33');
        putenv('SHELL_VERBOSITY');

        $this->runCommand('list -v');

        $this->assertSame('33', getenv('COLUMNS'));
        $this->assertFalse(getenv('SHELL_VERBOSITY'));
        $this->assertArrayNotHasKey('SHELL_VERBOSITY', $_SERVER);

        putenv('COLUMNS');
    }

    public function testCatalogListsTheAllowedCommands()
    {
        $catalog = (new CommandRunner(new CommandPolicy(true, ['plugin:*'])))->getCatalog();
        $names = array_column($catalog['commands'], 'name');

        $this->assertContains('core:archive', $names);
        $this->assertNotContains('plugin:list', $names);
        $this->assertNotContains('development:enable', $names);
        $this->assertContains('--help', array_column($catalog['globalOptions'], 'name'));
        $this->assertNotContains('--xhprof', array_column($catalog['globalOptions'], 'name'));
    }

    public function testCatalogIsEmptyWhenTheConsoleIsDisabled()
    {
        $catalog = (new CommandRunner(new CommandPolicy(false)))->getCatalog();

        $this->assertSame(['commands' => [], 'globalOptions' => []], $catalog);
    }
}
