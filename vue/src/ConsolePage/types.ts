/*!
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

export interface CommandArgument {
  name: string;
  required: boolean;
  array: boolean;
  description: string;
}

export interface CommandOption {
  name: string;
  shortcut: string;
  acceptValue: boolean;
  valueRequired: boolean;
  multiple: boolean;
  description: string;
}

export interface ConsoleCommand {
  name: string;
  namespace: string;
  description: string;
  help: string;
  usage: string[];
  aliases: string[];
  arguments: CommandArgument[];
  options: CommandOption[];
}

export interface CommandCatalog {
  commands: ConsoleCommand[];
  globalOptions: CommandOption[];
}

export interface OutputSegment {
  text: string;
  style: string;
}

export interface ConsoleRun {
  id: number;
  command: string;
  segments: OutputSegment[];
  status: 'running'|'done'|'error';
  exitCode: number|null;
  durationMs: number|null;
  stopped: boolean;
  truncated: boolean;
  error: string;
  reload: boolean;
}

export interface Suggestion {
  kind: 'command'|'option';
  value: string;
  description: string;
}

export interface StreamEvent {
  type: 'output'|'exit'|'error'|'truncated'|'done';
  segments?: OutputSegment[];
  exitCode?: number;
  durationMs?: number;
  stopped?: boolean;
  message?: string;
  reload?: boolean;
  truncated?: boolean;
}
