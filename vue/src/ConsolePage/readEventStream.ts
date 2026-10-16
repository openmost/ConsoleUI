/*!
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

import { StreamEvent } from './types';

/**
 * Extracts the complete Server-Sent Events of a buffer, returns them with what is left for the
 * next chunk
 */
export function parseEventBuffer(buffer: string): { events: StreamEvent[], rest: string } {
  const blocks = buffer.split('\n\n');
  const rest = blocks.pop() || '';
  const events: StreamEvent[] = [];

  blocks.forEach((block) => {
    const data = block
      .split('\n')
      .filter((line) => line.startsWith('data: '))
      .map((line) => line.slice(6))
      .join('\n');

    if (data === '') {
      return;
    }

    try {
      events.push(JSON.parse(data) as StreamEvent);
    } catch {
      // An event the stream could not encode is skipped, the next ones still arrive
    }
  });

  return { events, rest };
}

export async function readEventStream(
  body: ReadableStream<Uint8Array>,
  onEvent: (event: StreamEvent) => void,
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const { done, value } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });

    const parsed = parseEventBuffer(done ? `${buffer}\n\n` : buffer);
    buffer = parsed.rest;
    parsed.events.forEach(onEvent);

    if (done) {
      return;
    }
  }
}
