<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\ConsoleUI\tests\Unit;

use PHPUnit\Framework\TestCase;
use Piwik\Plugins\ConsoleUI\Console\AnsiParser;

/**
 * @group ConsoleUI
 * @group AnsiParserTest
 * @group Plugins
 */
class AnsiParserTest extends TestCase
{
    public function testPlainTextIsOneUnstyledSegment()
    {
        $this->assertSame(
            [['text' => "Done\n", 'style' => '']],
            (new AnsiParser())->parse("Done\n")
        );
    }

    public function testColorsAndReset()
    {
        $segments = (new AnsiParser())->parse("\e[32mINFO\e[39m archived \e[1;37;41m error \e[0m.");

        $this->assertSame([
            ['text' => 'INFO', 'style' => 'fg-green'],
            ['text' => ' archived ', 'style' => ''],
            ['text' => ' error ', 'style' => 'fg-white bg-red bold'],
            ['text' => '.', 'style' => ''],
        ], $segments);
    }

    public function testBrightColorsAndUnderline()
    {
        $segments = (new AnsiParser())->parse("\e[94;4mlink\e[24;22m");

        $this->assertSame([['text' => 'link', 'style' => 'fg-bright-blue underline']], $segments);
    }

    public function testStyleCarriesOverToTheNextChunk()
    {
        $parser = new AnsiParser();
        $parser->parse("\e[33mwarn");

        $this->assertSame([['text' => 'ing', 'style' => 'fg-yellow']], $parser->parse('ing'));
    }

    public function testSequenceCutBetweenTwoChunks()
    {
        $parser = new AnsiParser();

        $this->assertSame([['text' => 'a', 'style' => '']], $parser->parse("a\e[3"));
        $this->assertSame([['text' => 'b', 'style' => 'fg-red']], $parser->parse('1mb'));
    }

    public function testCursorSequencesAreDropped()
    {
        $segments = (new AnsiParser())->parse("\e[1G\e[2K 50%\e[?25l");

        $this->assertSame([['text' => ' 50%', 'style' => '']], $segments);
    }

    public function testExtendedColorsAreSkippedWithTheirParameters()
    {
        $segments = (new AnsiParser())->parse("\e[38;5;208;1mA\e[38;2;10;20;30mB");

        $this->assertSame([['text' => 'AB', 'style' => 'bold']], $segments);
    }

    public function testMarkupIsKeptAsText()
    {
        $segments = (new AnsiParser())->parse('<script>alert(1)</script>');

        $this->assertSame([['text' => '<script>alert(1)</script>', 'style' => '']], $segments);
    }

    public function testLoneEscapeCharacterIsRemoved()
    {
        $this->assertSame([['text' => 'ab', 'style' => '']], (new AnsiParser())->parse("a\eb"));
    }
}
