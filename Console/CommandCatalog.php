<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\ConsoleUI\Console;

/**
 * Compacts the output of `console list --format=json` into what the command library and the autocompletion need.
 */
class CommandCatalog
{
    /**
     * @param array<string, mixed> $list The decoded output of `list --format=json`
     * @param string[] $hiddenGlobalOptions
     * @return array{commands: array<int, array<string, mixed>>, globalOptions: array<int, array<string, mixed>>}
     */
    public static function fromListOutput(array $list, array $hiddenGlobalOptions = []): array
    {
        $rawCommands = array_values(array_filter((array) ($list['commands'] ?? []), static function ($command) {
            return is_array($command) && !empty($command['name']) && empty($command['hidden']);
        }));

        // Options every command shares are the application ones (--help, --verbose...), listed once
        $globalNames = null;
        foreach ($rawCommands as $command) {
            $names = array_keys((array) ($command['definition']['options'] ?? []));
            $globalNames = $globalNames === null ? $names : array_values(array_intersect($globalNames, $names));
        }
        $globalNames = $globalNames ?: [];

        $commands = [];
        $globalOptions = [];
        foreach ($rawCommands as $command) {
            $options = [];
            foreach ((array) ($command['definition']['options'] ?? []) as $key => $option) {
                $compact = self::compactOption((array) $option);
                if (in_array($compact['name'], $hiddenGlobalOptions, true)) {
                    continue;
                }
                if (in_array($key, $globalNames, true)) {
                    $globalOptions[$compact['name']] = $compact;
                } else {
                    $options[] = $compact;
                }
            }

            $arguments = [];
            foreach ((array) ($command['definition']['arguments'] ?? []) as $argument) {
                $argument = (array) $argument;
                $arguments[] = [
                    'name' => (string) ($argument['name'] ?? ''),
                    'required' => !empty($argument['is_required']),
                    'array' => !empty($argument['is_array']),
                    'description' => (string) ($argument['description'] ?? ''),
                ];
            }

            $name = (string) $command['name'];
            $commands[] = [
                'name' => $name,
                'namespace' => strpos($name, ':') !== false ? substr($name, 0, (int) strpos($name, ':')) : '',
                'description' => (string) ($command['description'] ?? ''),
                'help' => (string) ($command['help'] ?? ''),
                'usage' => array_values(array_map('strval', (array) ($command['usage'] ?? []))),
                'aliases' => array_values(array_map('strval', (array) ($command['aliases'] ?? []))),
                'arguments' => $arguments,
                'options' => $options,
            ];
        }

        usort($commands, static function (array $a, array $b) {
            return strcmp($a['name'], $b['name']);
        });

        return ['commands' => $commands, 'globalOptions' => array_values($globalOptions)];
    }

    /**
     * @param array<string, mixed> $option
     * @return array{name: string, shortcut: string, acceptValue: bool, valueRequired: bool, multiple: bool, description: string}
     */
    private static function compactOption(array $option): array
    {
        return [
            'name' => (string) ($option['name'] ?? ''),
            'shortcut' => (string) ($option['shortcut'] ?? ''),
            'acceptValue' => !empty($option['accept_value']),
            'valueRequired' => !empty($option['is_value_required']),
            'multiple' => !empty($option['is_multiple']),
            'description' => (string) ($option['description'] ?? ''),
        ];
    }
}
