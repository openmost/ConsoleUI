<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\ConsoleUI\tests\Unit;

use PHPUnit\Framework\TestCase;
use Piwik\Plugins\ConsoleUI\Console\CommandNotAllowedException;
use Piwik\Plugins\ConsoleUI\Console\CommandPolicy;

/**
 * @group ConsoleUI
 * @group CommandPolicyTest
 * @group Plugins
 */
class CommandPolicyTest extends TestCase
{
    public function testAllowsRegularCommandsByDefault()
    {
        $policy = new CommandPolicy();

        $this->assertTrue($policy->isCommandAllowed('core:archive'));
        $this->assertTrue($policy->isCommandAllowed('cache:clear'));
        $this->assertTrue($policy->isCommandAllowed('config:set'));
    }

    /**
     * @dataProvider getAlwaysBlockedCommands
     */
    public function testAlwaysBlocksDevelopmentCommands(string $command)
    {
        $policy = new CommandPolicy(true, [], ['*']);

        $this->assertFalse($policy->isCommandAllowed($command));
    }

    public function getAlwaysBlockedCommands(): array
    {
        return [
            ['development:enable'],
            ['generate:plugin'],
            ['tests:run'],
            ['vue:build'],
            ['translations:update'],
            ['githooks:install'],
            ['climulti:request'],
            ['completion'],
            ['_complete'],
            ['DEVELOPMENT:ENABLE'],
        ];
    }

    public function testBlocksConfiguredPatterns()
    {
        $policy = new CommandPolicy(true, ['user:*', ' core:archive ', '']);

        $this->assertFalse($policy->isCommandAllowed('user:reset-password'));
        $this->assertFalse($policy->isCommandAllowed('core:archive'));
        $this->assertTrue($policy->isCommandAllowed('core:update'));
    }

    public function testAllowListOnlyLetsListedCommandsRun()
    {
        $policy = new CommandPolicy(true, [], ['core:archive', 'cache:*']);

        $this->assertTrue($policy->isCommandAllowed('core:archive'));
        $this->assertTrue($policy->isCommandAllowed('cache:clear'));
        $this->assertFalse($policy->isCommandAllowed('core:update'));
    }

    public function testListAndHelpStayAvailableWithAnAllowList()
    {
        $policy = new CommandPolicy(true, [], ['core:archive']);

        $this->assertTrue($policy->isCommandAllowed('list'));
        $this->assertTrue($policy->isCommandAllowed('help'));
    }

    public function testBlockListWinsOverAllowList()
    {
        $policy = new CommandPolicy(true, ['core:archive'], ['core:*']);

        $this->assertFalse($policy->isCommandAllowed('core:archive'));
        $this->assertTrue($policy->isCommandAllowed('core:update'));
    }

    public function testPatternsAreNotRegularExpressions()
    {
        $policy = new CommandPolicy(true, ['core.archive']);

        $this->assertTrue($policy->isCommandAllowed('core:archive'));
    }

    public function testDisabledPolicyRefusesEverything()
    {
        $policy = new CommandPolicy(false);

        $this->assertFalse($policy->isEnabled());
        $this->assertFalse($policy->isCommandAllowed('list'));
        $this->assertFalse($policy->isCommandAllowed('core:archive'));
    }

    public function testAssertCanRunAcceptsAllowedCommand()
    {
        (new CommandPolicy())->assertCanRun('core:archive');

        $this->addToAssertionCount(1);
    }

    public function testAssertCanRunRefusesBlockedCommand()
    {
        $this->expectException(CommandNotAllowedException::class);

        (new CommandPolicy())->assertCanRun('development:enable');
    }

    /**
     * @dataProvider getShellAndNeverEndingCommands
     */
    public function testBlocksCommandsCallingAShellOrNeverEnding(string $command)
    {
        $this->assertFalse((new CommandPolicy(true, [], ['*']))->isCommandAllowed($command));
    }

    public function getShellAndNeverEndingCommands(): array
    {
        return [['git:commit'], ['git:pull'], ['git:push'], ['log:watch'], ['visitorgenerator:generate-visits']];
    }

    /**
     * @dataProvider getProtectedSettings
     */
    public function testConfigWritesToProtectedSettingsAreRefused(string $section, string $key)
    {
        $this->expectException(CommandNotAllowedException::class);

        (new CommandPolicy())->assertConfigWritesAllowed('config:set', [['section' => $section, 'key' => $key]]);
    }

    public function getProtectedSettings(): array
    {
        return [
            ['ConsoleUI', 'enabled'],
            ['consoleui', 'blocked_commands'],
            [' ConsoleUI ', ''],
            ['Development', 'enabled'],
            ['General', 'enable_plugin_upload'],
            ['GENERAL', 'Enable_Plugins_Admin'],
            ['General', 'always_load_commands_from_plugin'],
            ['General', ''],
        ];
    }

    public function testConfigWritesToOtherSettingsAreAllowed()
    {
        (new CommandPolicy())->assertConfigWritesAllowed('config:set', [
            ['section' => 'General', 'key' => 'enable_browser_archiving_triggering'],
            ['section' => 'database', 'key' => 'host'],
            ['section' => 'mail', 'key' => 'transport'],
        ]);

        $this->addToAssertionCount(1);
    }

    /**
     * @dataProvider getAssignments
     */
    public function testParseConfigAssignment(string $assignment, string $section, string $key)
    {
        $this->assertSame(['section' => $section, 'key' => $key], CommandPolicy::parseConfigAssignment($assignment));
    }

    public function getAssignments(): array
    {
        return [
            ['General.enable_plugin_upload=1', 'General', 'enable_plugin_upload'],
            ['ConsoleUI.allowed_commands[]=*', 'ConsoleUI', 'allowed_commands'],
            ['Database.username', 'Database', 'username'],
            ['General.key=a.b=c', 'General', 'key'],
            ['ConsoleUI', 'ConsoleUI', ''],
        ];
    }

    public function testConfigWriters()
    {
        $this->assertTrue(CommandPolicy::isConfigWriter('config:set'));
        $this->assertTrue(CommandPolicy::isConfigWriter('CONFIG:DELETE'));
        $this->assertFalse(CommandPolicy::isConfigWriter('config:get'));
    }
}
