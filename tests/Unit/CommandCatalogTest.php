<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\ConsoleUI\tests\Unit;

use PHPUnit\Framework\TestCase;
use Piwik\Plugins\ConsoleUI\Console\CommandCatalog;

/**
 * @group ConsoleUI
 * @group CommandCatalogTest
 * @group Plugins
 */
class CommandCatalogTest extends TestCase
{
    private function option(string $name, bool $acceptValue = false, string $shortcut = ''): array
    {
        return [
            'name' => $name,
            'shortcut' => $shortcut,
            'accept_value' => $acceptValue,
            'is_value_required' => $acceptValue,
            'is_multiple' => false,
            'description' => 'Description of ' . $name,
            'default' => false,
        ];
    }

    private function listOutput(): array
    {
        $global = [
            'help' => $this->option('--help', false, '-h'),
            'xhprof' => $this->option('--xhprof'),
        ];

        return [
            'commands' => [
                [
                    'name' => 'core:archive',
                    'hidden' => false,
                    'usage' => ['core:archive [--url URL]'],
                    'description' => 'Runs the archiving',
                    'help' => 'Long help',
                    'aliases' => [],
                    'definition' => [
                        'arguments' => [],
                        'options' => $global + ['url' => $this->option('--url', true)],
                    ],
                ],
                [
                    'name' => 'cache:clear',
                    'hidden' => false,
                    'usage' => ['cache:clear'],
                    'description' => 'Clears the caches',
                    'help' => '',
                    'aliases' => ['clear-cache'],
                    'definition' => [
                        'arguments' => [
                            'name' => ['name' => 'name', 'is_required' => true, 'is_array' => false, 'description' => 'A name'],
                        ],
                        'options' => $global,
                    ],
                ],
                [
                    'name' => 'secret:command',
                    'hidden' => true,
                    'definition' => ['arguments' => [], 'options' => $global],
                ],
            ],
        ];
    }

    public function testCompactsAndSortsCommands()
    {
        $catalog = CommandCatalog::fromListOutput($this->listOutput(), ['--xhprof']);

        $this->assertSame(['cache:clear', 'core:archive'], array_column($catalog['commands'], 'name'));

        $archive = $catalog['commands'][1];
        $this->assertSame('core', $archive['namespace']);
        $this->assertSame('Runs the archiving', $archive['description']);
        $this->assertSame(['--url'], array_column($archive['options'], 'name'));
        $this->assertTrue($archive['options'][0]['acceptValue']);

        $clear = $catalog['commands'][0];
        $this->assertSame(['clear-cache'], $clear['aliases']);
        $this->assertSame(
            [['name' => 'name', 'required' => true, 'array' => false, 'description' => 'A name']],
            $clear['arguments']
        );
    }

    public function testSharedOptionsAreListedOnceAsGlobalOptions()
    {
        $catalog = CommandCatalog::fromListOutput($this->listOutput(), ['--xhprof']);

        $this->assertSame(['--help'], array_column($catalog['globalOptions'], 'name'));
        $this->assertSame('-h', $catalog['globalOptions'][0]['shortcut']);
    }

    public function testHiddenCommandsAreLeftOut()
    {
        $catalog = CommandCatalog::fromListOutput($this->listOutput());

        $this->assertNotContains('secret:command', array_column($catalog['commands'], 'name'));
    }

    public function testEmptyList()
    {
        $this->assertSame(['commands' => [], 'globalOptions' => []], CommandCatalog::fromListOutput([]));
    }
}
