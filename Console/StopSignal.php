<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\ConsoleUI\Console;

use Piwik\Container\StaticContainer;

/**
 * Lets the Stop button interrupt a command running in another request.
 *
 * The running request and the stop request share a marker file in the Matomo tmp directory, which works on any
 * hosting. The command is interrupted the next time it writes output or a log line, like Ctrl+C would, so a command
 * that writes nothing for a while stops only when it writes again.
 */
class StopSignal
{
    /** Exit code of a command interrupted by Ctrl+C on the command line */
    public const EXIT_CODE = 130;

    /** Seconds between two checks of the marker, the file system is not hit on every write */
    private const CHECK_INTERVAL = 0.25;

    /** Markers older than this are left behind by a request that died, they are removed */
    private const STALE_AFTER = 86400;

    /** @var string */
    private $directory;

    /** @var string */
    private $runId;

    /** @var float */
    private $lastCheck = 0.0;

    /** @var bool */
    private $stopped = false;

    public function __construct(string $runId, ?string $directory = null)
    {
        if (!self::isValidRunId($runId)) {
            throw new \InvalidArgumentException('Invalid run id');
        }

        $this->runId = $runId;
        $this->directory = $directory ?: StaticContainer::get('path.tmp') . '/ConsoleUI';
    }

    public static function isValidRunId(string $runId): bool
    {
        return (bool) preg_match('/^[a-f0-9]{16,64}$/', $runId);
    }

    /**
     * Marks the run as started by this user, only them may stop it
     */
    public function start(string $login): void
    {
        if (!is_dir($this->directory)) {
            @mkdir($this->directory, 0755, true);
        }
        $this->removeStaleMarkers();

        @file_put_contents($this->path('run'), $login);
    }

    /**
     * @return bool False when no run of this user has this id
     */
    public function request(string $login): bool
    {
        $owner = @file_get_contents($this->path('run'));
        if ($owner === false || !hash_equals($owner, $login)) {
            return false;
        }

        return @touch($this->path('stop'));
    }

    /**
     * Interrupts the command once a stop was requested. It throws only once, so the command can still report
     * how it ended.
     *
     * @throws CommandStoppedException
     */
    public function throwIfRequested(): void
    {
        if ($this->stopped) {
            return;
        }

        $now = microtime(true);
        if ($now - $this->lastCheck < self::CHECK_INTERVAL) {
            return;
        }
        $this->lastCheck = $now;

        clearstatcache(true, $this->path('stop'));
        if (file_exists($this->path('stop'))) {
            $this->stopped = true;
            throw new CommandStoppedException();
        }
    }

    public function wasStopped(): bool
    {
        return $this->stopped;
    }

    public function finish(): void
    {
        @unlink($this->path('stop'));
        @unlink($this->path('run'));
    }

    private function path(string $type): string
    {
        return $this->directory . '/' . $this->runId . '.' . $type;
    }

    private function removeStaleMarkers(): void
    {
        foreach (glob($this->directory . '/*.{run,stop}', GLOB_BRACE) ?: [] as $file) {
            if (@filemtime($file) < time() - self::STALE_AFTER) {
                @unlink($file);
            }
        }
    }
}
