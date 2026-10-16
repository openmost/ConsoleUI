/*!
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

import {
  CommandCatalog,
  CommandOption,
  ConsoleCommand,
  Suggestion,
} from './types';

export const MAX_SUGGESTIONS = 8;

interface TokenAtCaret {
  /** Every token before the one being typed */
  previous: string[];
  current: string;
  start: number;
}

export function tokenAtCaret(line: string, caret: number): TokenAtCaret {
  const before = line.slice(0, caret);
  const start = Math.max(before.lastIndexOf(' '), before.lastIndexOf('\t')) + 1;
  const previous = before.slice(0, start).split(/\s+/).filter((token) => token !== '');

  return { previous, current: before.slice(start), start };
}

export function findCommand(catalog: CommandCatalog, name: string): ConsoleCommand|undefined {
  const lower = name.toLowerCase();

  return catalog.commands.find(
    (command) => command.name.toLowerCase() === lower
      || command.aliases.some((alias) => alias.toLowerCase() === lower),
  );
}

/**
 * Commands whose name starts with the query come first, then those containing it anywhere
 */
export function suggestCommands(catalog: CommandCatalog, query: string): Suggestion[] {
  const lower = query.toLowerCase();
  // A complete command name needs no suggestion, the next useful step is its options
  if (findCommand(catalog, query)) {
    return [];
  }

  const startsWith: ConsoleCommand[] = [];
  const contains: ConsoleCommand[] = [];

  catalog.commands.forEach((command) => {
    const name = command.name.toLowerCase();
    if (name.startsWith(lower)) {
      startsWith.push(command);
    } else if (lower !== '' && name.includes(lower)) {
      contains.push(command);
    }
  });

  return startsWith.concat(contains)
    .filter((command) => command.name.toLowerCase() !== lower)
    .slice(0, MAX_SUGGESTIONS)
    .map((command) => ({ kind: 'command', value: command.name, description: command.description }));
}

function optionName(token: string): string {
  return token.split('=')[0];
}

export function suggestOptions(
  options: CommandOption[],
  query: string,
  alreadyUsed: string[],
): Suggestion[] {
  const used = alreadyUsed.map(optionName);
  const lower = query.toLowerCase();

  return options
    .filter((option) => option.name.toLowerCase().startsWith(lower) && option.name !== query)
    .filter((option) => option.multiple || !used.includes(option.name))
    .slice(0, MAX_SUGGESTIONS)
    .map((option) => ({ kind: 'option', value: option.name, description: option.description }));
}

/**
 * What to suggest for the token under the caret: a command name while typing the first word,
 * the options of the command afterwards, once the token is empty or starts with a dash.
 */
export function getSuggestions(catalog: CommandCatalog, line: string, caret: number): Suggestion[] {
  const { previous, current } = tokenAtCaret(line, caret);

  if (previous.length === 0) {
    return current === '' ? [] : suggestCommands(catalog, current);
  }

  if (current !== '' && !current.startsWith('-')) {
    return [];
  }

  // A value is expected after an option written as "--option value"
  const last = previous[previous.length - 1];
  const command = findCommand(catalog, previous[0]);
  const options = (command ? command.options : []).concat(catalog.globalOptions);
  const lastOption = options.find((option) => option.name === last);
  if (current === '' && lastOption && lastOption.valueRequired) {
    return [];
  }

  if (!command && current === '') {
    return [];
  }

  return suggestOptions(options, current === '' ? '--' : current, previous.slice(1));
}

/**
 * Replaces the token under the caret with the suggestion, and places the caret where the next
 * input goes
 */
export function applySuggestion(
  catalog: CommandCatalog,
  line: string,
  caret: number,
  suggestion: Suggestion,
): { line: string, caret: number } {
  const { previous, start } = tokenAtCaret(line, caret);
  let end = caret;
  while (end < line.length && !/\s/.test(line[end])) {
    end += 1;
  }

  let suffix = ' ';
  if (suggestion.kind === 'option') {
    const command = previous.length ? findCommand(catalog, previous[0]) : undefined;
    const option = (command ? command.options : [])
      .concat(catalog.globalOptions)
      .find((candidate) => candidate.name === suggestion.value);
    if (option && option.acceptValue) {
      suffix = '=';
    }
  }

  const rest = line.slice(end).replace(/^\s+/, '');
  const inserted = `${suggestion.value}${suffix}`;
  const newLine = `${line.slice(0, start)}${inserted}${rest}`;

  return { line: newLine, caret: start + inserted.length };
}
