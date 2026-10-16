<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\ConsoleUI\Console;

use Piwik\Config;
use Piwik\Plugins\CorePluginsAdmin\CorePluginsAdmin;

/**
 * Which console commands may run from the browser.
 *
 * The server administrator tunes it in the [ConsoleUI] section of config/config.ini.php:
 *
 *     [ConsoleUI]
 *     enabled = 0                         ; turns the console off
 *     allowed_commands[] = "core:archive" ; when set, only the listed commands run
 *     blocked_commands[] = "user:*"       ; added to the commands always blocked
 *
 * Patterns accept a trailing or inner `*` wildcard and are case-insensitive.
 */
class CommandPolicy
{
    public const CONFIG_SECTION = 'ConsoleUI';

    /**
     * Commands that make no sense on a production server, write PHP files into the Matomo directory, call system
     * tools through a shell (git:commit builds its shell command from the message), never end (log:watch) or fill
     * the database with fake data. They stay blocked whatever the configuration says.
     */
    public const ALWAYS_BLOCKED = [
        'development:*',
        'generate:*',
        'tests:*',
        'vue:*',
        'translations:*',
        'githooks:*',
        'git:*',
        'log:watch',
        'visitorgenerator:*',
        'climulti:request',
        'completion',
        '_complete',
    ];

    /** Read-only commands the page itself needs, allowed even when `allowed_commands` does not list them */
    public const ALWAYS_ALLOWED = ['list', 'help'];

    /** Commands of the Plugins admin, blocked when the server administrator turned it off */
    public const PLUGINS_ADMIN_COMMANDS = ['plugin:*', 'marketplace:*'];

    /** Commands able to rewrite config/config.ini.php */
    public const CONFIG_WRITERS = ['config:set', 'config:delete'];

    /**
     * Config settings the console never changes: its own section, and the hardening a server administrator relies on
     * to keep super users from running their own code (plugin upload, plugins admin, development mode).
     * A section mapped to `*` is protected as a whole.
     */
    public const PROTECTED_CONFIG = [
        self::CONFIG_SECTION => '*',
        'Development' => '*',
        'General' => ['enable_plugin_upload', 'enable_plugins_admin', 'always_load_commands_from_plugin'],
    ];

    /** Global options of the Matomo console that must not be used from a web request */
    public const FORBIDDEN_GLOBAL_OPTIONS = ['--xhprof', '--matomo-domain'];

    /** @var bool */
    private $enabled;

    /** @var string[] */
    private $blocked;

    /** @var string[] */
    private $allowed;

    /**
     * @param string[] $blocked
     * @param string[] $allowed
     */
    public function __construct(bool $enabled = true, array $blocked = [], array $allowed = [])
    {
        $this->enabled = $enabled;
        $this->blocked = array_merge(self::ALWAYS_BLOCKED, self::cleanPatterns($blocked));
        $this->allowed = self::cleanPatterns($allowed);
    }

    public static function fromConfig(): self
    {
        $section = Config::getInstance()->{self::CONFIG_SECTION};
        if (!is_array($section)) {
            $section = [];
        }

        $enabled = !array_key_exists('enabled', $section) || !empty($section['enabled']);

        $blocked = (array) ($section['blocked_commands'] ?? []);
        if (!CorePluginsAdmin::isPluginsAdminEnabled()) {
            $blocked = array_merge($blocked, self::PLUGINS_ADMIN_COMMANDS);
        }

        return new self($enabled, $blocked, (array) ($section['allowed_commands'] ?? []));
    }

    public function isEnabled(): bool
    {
        return $this->enabled;
    }

    public function isCommandAllowed(string $commandName): bool
    {
        if (!$this->enabled) {
            return false;
        }

        if (in_array(strtolower($commandName), self::ALWAYS_ALLOWED, true)) {
            return true;
        }

        if (self::matchesAny($commandName, $this->blocked)) {
            return false;
        }

        return empty($this->allowed) || self::matchesAny($commandName, $this->allowed);
    }

    /**
     * @param string $commandName The resolved name of the command, never an abbreviation or an alias
     * @throws CommandNotAllowedException
     */
    public function assertCanRun(string $commandName): void
    {
        if (!$this->isCommandAllowed($commandName)) {
            throw new CommandNotAllowedException($commandName);
        }
    }

    public static function isConfigWriter(string $commandName): bool
    {
        return in_array(strtolower($commandName), self::CONFIG_WRITERS, true);
    }

    /**
     * Refuses a config:set or config:delete reaching a protected setting. The settings come from the input once
     * Symfony parsed it, never from the raw line, so quotes or escapes cannot hide a section name.
     *
     * @param array<int, array{section: string, key: string}> $settings
     * @throws CommandNotAllowedException
     */
    public function assertConfigWritesAllowed(string $commandName, array $settings): void
    {
        foreach ($settings as $setting) {
            foreach (self::PROTECTED_CONFIG as $section => $keys) {
                if (strcasecmp(trim($setting['section']), $section) !== 0) {
                    continue;
                }

                $key = strtolower(trim($setting['key']));
                if ($keys === '*' || $key === '' || in_array($key, array_map('strtolower', $keys), true)) {
                    throw new CommandNotAllowedException($commandName);
                }
            }
        }
    }

    /**
     * Section and key of a config assignment such as `General.key=value`, `General.array[]=value` or `General.key`
     *
     * @return array{section: string, key: string}
     */
    public static function parseConfigAssignment(string $assignment): array
    {
        $name = explode('=', $assignment, 2)[0];
        $parts = explode('.', $name, 2);

        return [
            'section' => $parts[0],
            'key' => isset($parts[1]) ? (string) preg_replace('/\[\]$/', '', $parts[1]) : '',
        ];
    }

    /**
     * @param string[] $patterns
     */
    private static function matchesAny(string $commandName, array $patterns): bool
    {
        foreach ($patterns as $pattern) {
            $regex = '/^' . str_replace('\*', '.*', preg_quote($pattern, '/')) . '$/i';
            if (preg_match($regex, $commandName)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param mixed[] $patterns
     * @return string[]
     */
    private static function cleanPatterns(array $patterns): array
    {
        $patterns = array_map(static function ($pattern) {
            return trim((string) $pattern);
        }, $patterns);

        return array_values(array_filter($patterns, static function (string $pattern) {
            return $pattern !== '';
        }));
    }
}
