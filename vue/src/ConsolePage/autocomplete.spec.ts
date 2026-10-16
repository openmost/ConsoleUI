/*!
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

import { describe, expect, it } from 'vitest';
import {
  applySuggestion,
  findCommand,
  getSuggestions,
  MAX_SUGGESTIONS,
  tokenAtCaret,
} from './autocomplete';
import { CommandCatalog, CommandOption, ConsoleCommand } from './types';

function option(name: string, acceptValue = false, multiple = false): CommandOption {
  return {
    name,
    shortcut: '',
    acceptValue,
    valueRequired: acceptValue,
    multiple,
    description: `Description of ${name}`,
  };
}

function command(
  name: string,
  options: CommandOption[] = [],
  aliases: string[] = [],
): ConsoleCommand {
  return {
    name,
    namespace: name.includes(':') ? name.split(':')[0] : '',
    description: `Description of ${name}`,
    help: '',
    usage: [name],
    aliases,
    arguments: [],
    options,
  };
}

const catalog: CommandCatalog = {
  commands: [
    command('core:archive', [option('--url', true), option('--force-idsites', true), option('--skip-all-segments')]),
    command('core:clear-caches', [], ['cache:clear']),
    command('core:update', [option('--yes')]),
    command('list'),
    command('plugin:activate', [option('--plugin', true, true)]),
    command('plugin:list'),
  ],
  globalOptions: [option('--help'), option('--verbose')],
};

describe('ConsoleUI/autocomplete', () => {
  it('splits the line at the caret', () => {
    expect(tokenAtCaret('core:archive --ur', 17)).toEqual({ previous: ['core:archive'], current: '--ur', start: 13 });
    expect(tokenAtCaret('core:archive --url=x', 4)).toEqual({ previous: [], current: 'core', start: 0 });
  });

  it('finds a command by name or alias, whatever the case', () => {
    expect(findCommand(catalog, 'CORE:ARCHIVE')?.name).toBe('core:archive');
    expect(findCommand(catalog, 'cache:clear')?.name).toBe('core:clear-caches');
    expect(findCommand(catalog, 'nope')).toBeUndefined();
  });

  it('suggests nothing on an empty line', () => {
    expect(getSuggestions(catalog, '', 0)).toEqual([]);
  });

  it('suggests commands starting with the query first, then those containing it', () => {
    const values = getSuggestions(catalog, 'li', 2).map((suggestion) => suggestion.value);

    expect(values).toEqual(['list', 'plugin:list']);
  });

  it('does not suggest the command already typed in full', () => {
    expect(getSuggestions(catalog, 'list', 4)).toEqual([]);
  });

  it('caps the number of suggestions', () => {
    const many: CommandCatalog = {
      commands: Array.from({ length: 20 }, (unused, index) => command(`core:command${index}`)),
      globalOptions: [],
    };

    expect(getSuggestions(many, 'core', 4)).toHaveLength(MAX_SUGGESTIONS);
  });

  it('suggests the options of the command, then the global ones', () => {
    const values = getSuggestions(catalog, 'core:archive --', 15).map((suggestion) => suggestion.value);

    expect(values).toEqual(['--url', '--force-idsites', '--skip-all-segments', '--help', '--verbose']);
  });

  it('suggests options after a space', () => {
    const values = getSuggestions(catalog, 'core:update ', 12).map((suggestion) => suggestion.value);

    expect(values).toEqual(['--yes', '--help', '--verbose']);
  });

  it('does not suggest an option already used, unless it may be repeated', () => {
    expect(getSuggestions(catalog, 'core:update --yes --', 20).map((s) => s.value)).toEqual(['--help', '--verbose']);
    expect(getSuggestions(catalog, 'plugin:activate --plugin=A --p', 30).map((s) => s.value)).toEqual(['--plugin']);
  });

  it('waits for the value of an option written with a space', () => {
    expect(getSuggestions(catalog, 'core:archive --url ', 19)).toEqual([]);
  });

  it('suggests nothing while typing an argument', () => {
    expect(getSuggestions(catalog, 'plugin:activate Goa', 19)).toEqual([]);
  });

  it('suggests nothing after an unknown command until a dash is typed', () => {
    expect(getSuggestions(catalog, 'unknown ', 8)).toEqual([]);
    expect(getSuggestions(catalog, 'unknown --h', 11).map((s) => s.value)).toEqual(['--help']);
  });

  it('completes a command name with a space', () => {
    const result = applySuggestion(catalog, 'core:ar', 7, { kind: 'command', value: 'core:archive', description: '' });

    expect(result).toEqual({ line: 'core:archive ', caret: 13 });
  });

  it('completes an option expecting a value with an equal sign', () => {
    const result = applySuggestion(catalog, 'core:archive --u', 16, { kind: 'option', value: '--url', description: '' });

    expect(result).toEqual({ line: 'core:archive --url=', caret: 19 });
  });

  it('completes a flag with a space', () => {
    const result = applySuggestion(catalog, 'core:update --y', 15, { kind: 'option', value: '--yes', description: '' });

    expect(result).toEqual({ line: 'core:update --yes ', caret: 18 });
  });

  it('replaces the whole token under the caret and keeps the rest of the line', () => {
    const result = applySuggestion(catalog, 'core:ar --url=x', 4, { kind: 'command', value: 'core:archive', description: '' });

    expect(result).toEqual({ line: 'core:archive --url=x', caret: 13 });
  });
});
