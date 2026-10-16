<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\ConsoleUI\tests\Unit;

use PHPUnit\Framework\TestCase;
use Piwik\Plugins\ConsoleUI\EventStream;

/**
 * @group ConsoleUI
 * @group EventStreamTest
 * @group Plugins
 */
class EventStreamTest extends TestCase
{
    /** @var string[] */
    private $written = [];

    private function createStream(): EventStream
    {
        $this->written = [];

        return new EventStream(function (string $event) {
            $this->written[] = $event;
        });
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function decodedEvents(): array
    {
        return array_map(function (string $event) {
            $this->assertStringStartsWith('data: ', $event);
            $this->assertStringEndsWith("\n\n", $event);

            return json_decode(substr($event, 6), true);
        }, $this->written);
    }

    public function testOutputIsSentAsStyledSegments()
    {
        $stream = $this->createStream();
        $stream->output("\e[32mOK\e[39m\n");

        $this->assertSame([[
            'type' => 'output',
            'segments' => [['text' => 'OK', 'style' => 'fg-green'], ['text' => "\n", 'style' => '']],
        ]], $this->decodedEvents());
    }

    public function testEmptyOutputSendsNothing()
    {
        $stream = $this->createStream();
        $stream->output('');
        $stream->output("\e[32m");

        $this->assertSame([], $this->written);
    }

    public function testEmit()
    {
        $stream = $this->createStream();
        $stream->emit('exit', ['exitCode' => 0]);

        $this->assertSame([['type' => 'exit', 'exitCode' => 0]], $this->decodedEvents());
    }

    public function testOutputIsTruncatedOnceTooLong()
    {
        $stream = $this->createStream();
        $stream->output(str_repeat('a', EventStream::MAX_OUTPUT_BYTES));
        $stream->output('b');
        $stream->output('c');

        $this->assertSame(['output', 'truncated'], array_column($this->decodedEvents(), 'type'));
        $this->assertTrue($stream->isTruncated());
    }

    public function testStrayOutputIsWrappedAsAnEvent()
    {
        $stream = $this->createStream();
        $event = $stream->captureStrayOutput("data: fake\n\n");

        $this->assertSame(
            ['type' => 'output', 'segments' => [['text' => "data: fake\n\n", 'style' => '']]],
            json_decode(substr($event, 6), true)
        );
    }

    public function testInvalidUtf8DoesNotBreakTheStream()
    {
        $stream = $this->createStream();
        $stream->output("caf\xE9\n");

        $this->assertSame('output', $this->decodedEvents()[0]['type']);
    }

    public function testCloseSignalsTheEnd()
    {
        $stream = $this->createStream();
        $stream->close();

        $this->assertSame([['type' => 'done', 'truncated' => false]], $this->decodedEvents());
    }
}
