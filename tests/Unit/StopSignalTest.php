<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\ConsoleUI\tests\Unit;

use PHPUnit\Framework\TestCase;
use Piwik\Plugins\ConsoleUI\Console\CommandStoppedException;
use Piwik\Plugins\ConsoleUI\Console\StopSignal;

/**
 * @group ConsoleUI
 * @group StopSignalTest
 * @group Plugins
 */
class StopSignalTest extends TestCase
{
    private const RUN_ID = 'a1b2c3d4e5f60718';

    /** @var string */
    private $directory;

    public function setUp(): void
    {
        parent::setUp();

        $this->directory = sys_get_temp_dir() . '/consoleui-test-' . uniqid();
    }

    public function tearDown(): void
    {
        foreach (glob($this->directory . '/*') ?: [] as $file) {
            @unlink($file);
        }
        @rmdir($this->directory);

        parent::tearDown();
    }

    private function signal(): StopSignal
    {
        return new StopSignal(self::RUN_ID, $this->directory);
    }

    /**
     * @dataProvider getRunIds
     */
    public function testRunIdFormat(string $runId, bool $valid)
    {
        $this->assertSame($valid, StopSignal::isValidRunId($runId));
    }

    public function getRunIds(): array
    {
        return [
            [self::RUN_ID, true],
            [str_repeat('f', 64), true],
            ['abc', false],
            ['../../etc/passwd0000', false],
            ['A1B2C3D4E5F60718', false],
            [str_repeat('f', 65), false],
        ];
    }

    public function testInvalidRunIdIsRefused()
    {
        $this->expectException(\InvalidArgumentException::class);

        new StopSignal('../evil', $this->directory);
    }

    public function testNothingHappensWithoutAStopRequest()
    {
        $signal = $this->signal();
        $signal->start('admin');
        $signal->throwIfRequested();

        $this->assertFalse($signal->wasStopped());
    }

    public function testStopRequestInterruptsTheRunOnce()
    {
        $running = $this->signal();
        $running->start('admin');

        $this->assertTrue($this->signal()->request('admin'));

        try {
            $running->throwIfRequested();
            $this->fail('The run should have been interrupted');
        } catch (CommandStoppedException $e) {
            $this->assertSame(StopSignal::EXIT_CODE, $e->getCode());
        }

        $running->throwIfRequested();
        $this->assertTrue($running->wasStopped());
    }

    public function testOnlyTheUserWhoStartedTheRunCanStopIt()
    {
        $this->signal()->start('admin');

        $this->assertFalse($this->signal()->request('someone-else'));
    }

    public function testUnknownRunCannotBeStopped()
    {
        $this->assertFalse($this->signal()->request('admin'));
    }

    public function testFinishRemovesTheMarkers()
    {
        $signal = $this->signal();
        $signal->start('admin');
        $this->signal()->request('admin');
        $signal->finish();

        $this->assertSame([], glob($this->directory . '/*') ?: []);
    }
}
