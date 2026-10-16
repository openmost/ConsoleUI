<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\ConsoleUI\tests\Unit;

use PHPUnit\Framework\TestCase;
use Piwik\Plugins\ConsoleUI\Console\CommandLine;

/**
 * @group ConsoleUI
 * @group CommandLineTest
 * @group Plugins
 */
class CommandLineTest extends TestCase
{
    /**
     * @dataProvider getLinesToNormalize
     */
    public function testNormalizeDropsTheConsolePrefix(string $line, string $expected)
    {
        $this->assertSame($expected, CommandLine::normalize($line));
    }

    public function getLinesToNormalize(): array
    {
        return [
            ['core:archive', 'core:archive'],
            ['  core:archive --force-all-websites  ', 'core:archive --force-all-websites'],
            ['./console core:archive', 'core:archive'],
            ['php console core:archive', 'core:archive'],
            ['php8.2 ./console cache:clear', 'cache:clear'],
            ['console', ''],
            ['CONSOLE list', 'list'],
            ['consolelist', 'consolelist'],
            ["core:archive\t--url=https://example.org", "core:archive\t--url=https://example.org"],
            ['plugin:activate console', 'plugin:activate console'],
        ];
    }

    /**
     * @dataProvider getInvalidLines
     */
    public function testNormalizeRefusesMultilineAndControlCharacters(string $line)
    {
        $this->expectException(\InvalidArgumentException::class);

        CommandLine::normalize($line);
    }

    public function getInvalidLines(): array
    {
        return [
            ["list\ncore:archive"],
            ["list\rcore:archive"],
            ["list\0"],
            ["list\x1B[2J"],
            ["list\u{2028}core:archive"],
            ["list\u{0085}core:archive"],
        ];
    }

    public function testNormalizeRefusesTooLongLines()
    {
        $this->expectException(\InvalidArgumentException::class);

        CommandLine::normalize('list ' . str_repeat('a', CommandLine::MAX_LENGTH));
    }

    /**
     * @dataProvider getLinesToRedact
     */
    public function testRedactMasksSecretOptions(string $line, string $expected)
    {
        $this->assertSame($expected, CommandLine::redact($line));
    }

    public function getLinesToRedact(): array
    {
        return [
            [
                'user:reset-password --login=admin --new-password=S3cret!',
                'user:reset-password --login=admin --new-password=***',
            ],
            ['user:reset-password --new-password "my secret"', 'user:reset-password --new-password ***'],
            ["foo --api-key='abc def' --token-auth abc", 'foo --api-key=*** --token-auth ***'],
            ['config:set --section=database --key=password --value=s3cret', 'config:set --section=database --key=password --value=***'],
            ['config:set --section=mail --key=password --value "a b"', 'config:set --section=mail --key=password --value ***'],
            ['config:set database.password=s3cret General.x=1', 'config:set database.password=*** General.x=***'],
            ['marketplace:set-license-key --license-key=ABCD', 'marketplace:set-license-key --license-key=***'],
            ['core:archive --url=https://example.org', 'core:archive --url=https://example.org'],
        ];
    }
}
