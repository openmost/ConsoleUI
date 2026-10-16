<!--
  Matomo - free/libre analytics platform

  @link    https://matomo.org
  @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
-->

<template>
  <ContentBlock v-if="!enabled" :content-title="translate('ConsoleUI_Console')">
    <p>{{ translate('ConsoleUI_Disabled') }}</p>
  </ContentBlock>
  <div v-else class="consoleUi">
    <div class="consoleUiTerminal" @click="focusInput">
      <div class="consoleUiTerminal__bar">
        <span class="consoleUiTerminal__title">{{ translate('ConsoleUI_OutputLabel') }}</span>
        <span class="consoleUiTerminal__actions">
          <button
            type="button"
            class="consoleUiTerminal__action"
            :disabled="!runs.length"
            @click.stop="copyOutput"
          >{{ translate('ConsoleUI_Copy') }}</button>
          <button
            type="button"
            class="consoleUiTerminal__action"
            :disabled="!runs.length || isRunning"
            @click.stop="clearOutput"
          >{{ translate('ConsoleUI_Clear') }}</button>
        </span>
      </div>

      <div
        ref="output"
        class="consoleUiTerminal__output"
        role="log"
        aria-live="polite"
        :aria-label="translate('ConsoleUI_OutputLabel')"
        tabindex="0"
        @scroll="onOutputScroll"
      >
        <p v-if="!runs.length" class="consoleUiTerminal__empty">
          {{ translate('ConsoleUI_OutputEmpty') }}
        </p>
        <div v-for="run in runs" :key="run.id" class="consoleUiRun">
          <div class="consoleUiRun__command">
            <span class="consoleUiPrompt">$</span> ./console {{ run.command }}
          </div>
          <pre
            v-if="run.segments.length"
            class="consoleUiRun__output"
          ><span
            v-for="(segment, index) in run.segments"
            :key="index"
            :class="segmentClasses(segment)"
          >{{ segment.text }}</span></pre>
          <div v-if="run.truncated" class="consoleUiRun__notice">
            {{ translate('ConsoleUI_OutputTruncated') }}
          </div>
          <div v-if="run.error" class="consoleUiRun__error">
            {{ run.error }}
            <a v-if="run.reload" href="" @click.prevent="reloadPage">
              {{ translate('ConsoleUI_ReloadPage') }}
            </a>
          </div>
          <div v-if="run.status === 'running'" class="consoleUiRun__running">
            <span class="consoleUiCursor" />
          </div>
          <div
            v-else-if="run.exitCode !== null"
            :class="['consoleUiRun__status', run.exitCode === 0 ? 'is-success' : 'is-failure']"
          >
            {{ statusLine(run) }}
          </div>
        </div>
      </div>

      <form class="consoleUiTerminal__input" @submit.prevent="submit">
        <label :for="inputId" class="consoleUiPrompt">$ ./console</label>
        <div class="consoleUiTerminal__field">
          <ul
            v-if="showSuggestions"
            :id="listboxId"
            class="consoleUiSuggestions"
            role="listbox"
            :aria-label="translate('ConsoleUI_Suggestions')"
          >
            <li
              v-for="(suggestion, index) in suggestions"
              :id="`${listboxId}-${index}`"
              :key="suggestion.value"
              role="option"
              :aria-selected="index === activeSuggestion ? 'true' : 'false'"
              :class="['consoleUiSuggestions__item', { 'is-active': index === activeSuggestion }]"
              @mousedown.prevent="acceptSuggestion(suggestion)"
              @mouseenter="activeSuggestion = index"
            >
              <span class="consoleUiSuggestions__value">{{ suggestion.value }}</span>
              <span class="consoleUiSuggestions__description">{{ suggestion.description }}</span>
            </li>
          </ul>
          <input
            :id="inputId"
            ref="input"
            v-model="line"
            type="text"
            class="consoleUiTerminal__text browser-default"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
            role="combobox"
            aria-autocomplete="list"
            :aria-label="translate('ConsoleUI_InputLabel')"
            :aria-expanded="showSuggestions ? 'true' : 'false'"
            :aria-controls="listboxId"
            :aria-activedescendant="activeDescendant"
            :placeholder="translate('ConsoleUI_InputPlaceholder')"
            @keydown="onKeydown"
            @input="refreshSuggestions"
            @click="refreshSuggestions"
            @blur="suggestions = []"
          />
        </div>
        <button
          v-if="isRunning"
          type="button"
          class="consoleUiTerminal__run consoleUiTerminal__run--stop"
          :disabled="isStopping"
          @click.stop="stopRun"
        >{{ isStopping ? translate('ConsoleUI_Stopping') : translate('ConsoleUI_Stop') }}</button>
        <button
          v-else
          type="submit"
          class="consoleUiTerminal__run"
          :disabled="!line.trim()"
        >{{ translate('ConsoleUI_Run') }}</button>
      </form>
    </div>

    <p class="consoleUiHints">
      {{ translate('ConsoleUI_KeyboardHints') }} {{ translate('ConsoleUI_SecurityNotice') }}
    </p>

    <CommandLibrary
      :catalog="catalog"
      @use="useCommand"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import {
  ContentBlock,
  Matomo,
  NotificationsStore,
  translate,
} from 'CoreHome';
import CommandLibrary from './CommandLibrary.vue';
import { applySuggestion, getSuggestions } from './autocomplete';
import { readEventStream } from './readEventStream';
import {
  CommandCatalog,
  ConsoleRun,
  OutputSegment,
  StreamEvent,
  Suggestion,
} from './types';

/** Older runs are dropped beyond this, to keep the page light */
const MAX_RUNS = 50;
const MAX_HISTORY = 100;

let instanceCount = 0;

/** Identifies a run, so the Stop button reaches the request running it */
function createRunId(): string {
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

interface ConsolePageState {
  line: string;
  runs: ConsoleRun[];
  isRunning: boolean;
  suggestions: Suggestion[];
  activeSuggestion: number;
  history: string[];
  historyIndex: number;
  draft: string;
  stickToBottom: boolean;
  nextRunId: number;
  runId: string;
  isStopping: boolean;
  inputId: string;
  listboxId: string;
}

export default defineComponent({
  props: {
    enabled: {
      type: Boolean,
      default: true,
    },
    catalog: {
      type: Object as PropType<CommandCatalog>,
      default: () => ({ commands: [], globalOptions: [] }),
    },
  },
  components: {
    ContentBlock,
    CommandLibrary,
  },
  data(): ConsolePageState {
    instanceCount += 1;

    return {
      line: '',
      runs: [],
      isRunning: false,
      suggestions: [],
      activeSuggestion: -1,
      // Kept in memory only: a command line may carry a password, it must not outlive the page
      history: [],
      historyIndex: -1,
      draft: '',
      stickToBottom: true,
      nextRunId: 1,
      runId: '',
      isStopping: false,
      inputId: `consoleUiInput${instanceCount}`,
      listboxId: `consoleUiSuggestions${instanceCount}`,
    };
  },
  mounted() {
    this.focusInput();
  },
  computed: {
    showSuggestions(): boolean {
      return this.suggestions.length > 0;
    },
    activeDescendant(): string {
      return this.activeSuggestion >= 0 ? `${this.listboxId}-${this.activeSuggestion}` : '';
    },
  },
  methods: {
    focusInput() {
      const selection = window.getSelection();
      // Selecting output text to copy it must not be cancelled by the focus
      if (selection && selection.toString() !== '') {
        return;
      }
      const input = this.$refs.input as HTMLInputElement|undefined;
      if (input) {
        input.focus({ preventScroll: true });
      }
    },
    inputElement(): HTMLInputElement {
      return this.$refs.input as HTMLInputElement;
    },
    refreshSuggestions() {
      const input = this.inputElement();
      const caret = input.selectionStart === null ? this.line.length : input.selectionStart;
      this.suggestions = getSuggestions(this.catalog, this.line, caret);
      this.activeSuggestion = -1;
    },
    acceptSuggestion(suggestion: Suggestion) {
      const input = this.inputElement();
      const caret = input.selectionStart === null ? this.line.length : input.selectionStart;
      const result = applySuggestion(this.catalog, this.line, caret, suggestion);

      this.line = result.line;
      this.$nextTick(() => {
        input.focus();
        input.setSelectionRange(result.caret, result.caret);
        this.refreshSuggestions();
      });
    },
    onKeydown(event: KeyboardEvent) {
      // Ctrl+C stops the running command as in a terminal, unless text is selected to be copied
      const input = event.target as HTMLInputElement;
      if (
        event.ctrlKey && event.key.toLowerCase() === 'c' && this.isRunning
        && input.selectionStart === input.selectionEnd
      ) {
        event.preventDefault();
        this.stopRun();
        return;
      }

      if (event.ctrlKey && event.key.toLowerCase() === 'l') {
        event.preventDefault();
        this.clearOutput();
        return;
      }

      if (this.showSuggestions) {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          const step = event.key === 'ArrowDown' ? 1 : -1;
          const count = this.suggestions.length;
          this.activeSuggestion = (this.activeSuggestion + step + count) % count;
          return;
        }
        if (event.key === 'Tab' || (event.key === 'Enter' && this.activeSuggestion >= 0)) {
          event.preventDefault();
          const index = this.activeSuggestion >= 0 ? this.activeSuggestion : 0;
          this.acceptSuggestion(this.suggestions[index]);
          return;
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          this.suggestions = [];
          return;
        }
      }

      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        this.browseHistory(event);
      }
    },
    browseHistory(event: KeyboardEvent) {
      if (!this.history.length) {
        return;
      }
      event.preventDefault();

      if (event.key === 'ArrowUp') {
        if (this.historyIndex === -1) {
          this.draft = this.line;
          this.historyIndex = this.history.length - 1;
        } else if (this.historyIndex > 0) {
          this.historyIndex -= 1;
        }
        this.line = this.history[this.historyIndex];
      } else if (this.historyIndex !== -1) {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex += 1;
          this.line = this.history[this.historyIndex];
        } else {
          this.historyIndex = -1;
          this.line = this.draft;
        }
      }
    },
    submit() {
      const command = this.line.trim();
      if (!command || this.isRunning) {
        return;
      }

      if (this.history[this.history.length - 1] !== command) {
        this.history.push(command);
        this.history = this.history.slice(-MAX_HISTORY);
      }
      this.historyIndex = -1;
      this.draft = '';
      this.line = '';
      this.suggestions = [];

      this.execute(command);
    },
    useCommand(name: string) {
      this.line = `${name} `;
      this.$nextTick(() => {
        const input = this.inputElement();
        input.focus();
        input.setSelectionRange(this.line.length, this.line.length);
        this.refreshSuggestions();
      });
    },
    async execute(command: string) {
      this.runs.push({
        id: this.nextRunId,
        command,
        segments: [],
        status: 'running',
        exitCode: null,
        durationMs: null,
        stopped: false,
        truncated: false,
        error: '',
        reload: false,
      });
      this.nextRunId += 1;
      if (this.runs.length > MAX_RUNS) {
        this.runs.splice(0, this.runs.length - MAX_RUNS);
      }
      // Read back through the reactive array, mutating the pushed literal would not update the view
      const run = this.runs[this.runs.length - 1];

      this.isRunning = true;
      this.isStopping = false;
      this.runId = createRunId();
      this.stickToBottom = true;
      this.scrollToBottom();

      try {
        const response = await fetch('index.php?module=ConsoleUI&action=execute', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            command,
            runId: this.runId,
            token_auth: Matomo.token_auth as string,
            force_api_session: '1',
          }),
        });

        const contentType = response.headers.get('Content-Type') || '';
        if (!response.ok || !response.body || !contentType.includes('text/event-stream')) {
          throw new Error(translate('ConsoleUI_UnexpectedError'));
        }

        await readEventStream(response.body, (event) => this.handleEvent(run, event));

        if (run.status === 'running') {
          run.status = 'error';
          run.error = translate('ConsoleUI_ConnectionLost');
        }
      } catch (error) {
        run.status = 'error';
        run.error = error instanceof Error && error.message
          ? error.message
          : translate('ConsoleUI_UnexpectedError');
      } finally {
        this.isRunning = false;
        this.isStopping = false;
        this.runId = '';
        this.scrollToBottom();
        this.$nextTick(() => this.focusInput());
      }
    },
    handleEvent(run: ConsoleRun, event: StreamEvent) {
      if (event.type === 'output' && event.segments) {
        this.appendSegments(run, event.segments);
      } else if (event.type === 'truncated') {
        run.truncated = true;
      } else if (event.type === 'exit') {
        run.status = 'done';
        run.exitCode = typeof event.exitCode === 'number' ? event.exitCode : null;
        run.durationMs = typeof event.durationMs === 'number' ? event.durationMs : null;
        run.stopped = !!event.stopped;
      } else if (event.type === 'error') {
        run.status = 'error';
        run.error = event.message || translate('ConsoleUI_UnexpectedError');
        run.reload = !!event.reload;
      }

      this.scrollToBottom();
    },
    appendSegments(run: ConsoleRun, segments: OutputSegment[]) {
      segments.forEach((segment) => {
        const last = run.segments[run.segments.length - 1];
        if (last && last.style === segment.style) {
          last.text += segment.text;
        } else {
          run.segments.push({ text: segment.text, style: segment.style });
        }
      });
    },
    segmentClasses(segment: OutputSegment): string[] {
      return segment.style.split(' ').filter((token) => token !== '').map((token) => `ansi-${token}`);
    },
    formatDuration(durationMs: number): string {
      return (durationMs / 1000).toFixed(durationMs < 10000 ? 2 : 1);
    },
    async stopRun() {
      if (!this.isRunning || this.isStopping || !this.runId) {
        return;
      }
      this.isStopping = true;

      try {
        await fetch('index.php?module=ConsoleUI&action=stop', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            runId: this.runId,
            token_auth: Matomo.token_auth as string,
            force_api_session: '1',
          }),
        });
      } catch {
        // The command then simply runs to its end
        this.isStopping = false;
      }
    },
    statusLine(run: ConsoleRun): string {
      let exitCode = translate('ConsoleUI_ExitCode', `${run.exitCode}`);
      if (run.stopped) {
        exitCode = `${translate('ConsoleUI_Stopped')}, ${exitCode.charAt(0).toLowerCase()}${exitCode.slice(1)}`;
      }
      if (run.durationMs === null) {
        return exitCode;
      }
      return `${exitCode}, ${translate('ConsoleUI_Duration', this.formatDuration(run.durationMs))}`;
    },
    onOutputScroll() {
      const output = this.$refs.output as HTMLElement;
      this.stickToBottom = output.scrollHeight - output.scrollTop - output.clientHeight < 24;
    },
    scrollToBottom() {
      if (!this.stickToBottom) {
        return;
      }
      this.$nextTick(() => {
        const output = this.$refs.output as HTMLElement|undefined;
        if (output) {
          output.scrollTop = output.scrollHeight;
        }
      });
    },
    clearOutput() {
      if (!this.isRunning) {
        this.runs = [];
      }
    },
    outputAsText(): string {
      return this.runs.map((run) => {
        const output = run.segments.map((segment) => segment.text).join('');
        const lines = [`$ ./console ${run.command}`, output.replace(/\n$/, '')];
        if (run.error) {
          lines.push(run.error);
        }
        if (run.exitCode !== null) {
          lines.push(translate('ConsoleUI_ExitCode', `${run.exitCode}`));
        }
        return lines.filter((text) => text !== '').join('\n');
      }).join('\n\n');
    },
    async copyOutput() {
      try {
        await navigator.clipboard.writeText(this.outputAsText());
        NotificationsStore.show({
          message: translate('ConsoleUI_Copied'),
          context: 'success',
          type: 'transient',
          id: 'consoleUiCopied',
        });
      } catch {
        // The clipboard may be refused outside HTTPS, the output can still be selected by hand
      }
    },
    reloadPage() {
      window.location.reload();
    },
  },
});
</script>
