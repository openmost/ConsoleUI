/*!
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

import { parseEventBuffer } from './readEventStream';

describe('ConsoleUI/readEventStream', () => {
  it('parses complete events and keeps the incomplete one', () => {
    const buffer = 'data: {"type":"output","segments":[]}\n\ndata: {"type":"exit","exitCode":0}\n\ndata: {"ty';

    const { events, rest } = parseEventBuffer(buffer);

    expect(events).toEqual([
      { type: 'output', segments: [] },
      { type: 'exit', exitCode: 0 },
    ]);
    expect(rest).toBe('data: {"ty');
  });

  it('ignores comments sent to open the stream', () => {
    const { events } = parseEventBuffer(': stream\n\ndata: {"type":"done"}\n\n');

    expect(events).toEqual([{ type: 'done' }]);
  });

  it('skips an event that is not valid JSON', () => {
    const { events } = parseEventBuffer('data: {oops\n\ndata: {"type":"done"}\n\n');

    expect(events).toEqual([{ type: 'done' }]);
  });

  it('returns nothing until an event is complete', () => {
    expect(parseEventBuffer('data: {"type":"done"}')).toEqual({ events: [], rest: 'data: {"type":"done"}' });
  });
});
