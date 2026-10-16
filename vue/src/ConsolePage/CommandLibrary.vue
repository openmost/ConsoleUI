<!--
  Matomo - free/libre analytics platform

  @link    https://matomo.org
  @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
-->

<template>
  <ContentBlock :content-title="translate('ConsoleUI_Library')" class="consoleUiLibrary">
    <div class="consoleUiLibrary__toolbar">
      <Field
        uicontrol="text"
        name="consoleUiLibrarySearch"
        v-model="search"
        :title="translate('ConsoleUI_LibrarySearch')"
        :full-width="true"
      />
      <span class="consoleUiLibrary__count">
        {{ translate('ConsoleUI_LibraryCount', `${filteredCommands.length}`) }}
      </span>
    </div>

    <p v-if="!filteredCommands.length" class="consoleUiLibrary__empty">
      {{ translate('ConsoleUI_LibraryEmpty') }}
    </p>

    <div v-else class="consoleUiLibrary__layout">
      <div
        class="consoleUiLibrary__list"
        role="navigation"
        :aria-label="translate('ConsoleUI_Library')"
      >
        <div v-for="group in groups" :key="group.namespace" class="consoleUiLibrary__group">
          <h3 v-if="group.namespace" class="consoleUiLibrary__namespace">{{ group.namespace }}</h3>
          <ul>
            <li v-for="command in group.commands" :key="command.name">
              <button
                type="button"
                :class="[
                  'consoleUiLibrary__command',
                  { 'is-selected': command.name === selectedName },
                ]"
                :aria-pressed="command.name === selectedName ? 'true' : 'false'"
                @click="selectedName = command.name"
                @dblclick="$emit('use', command.name)"
              >
                <span class="consoleUiLibrary__name">{{ command.name }}</span>
                <span class="consoleUiLibrary__description">
                  {{ command.description || translate('ConsoleUI_NoDescription') }}
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <section v-if="selected" class="consoleUiLibrary__detail" aria-live="polite">
        <div class="consoleUiLibrary__header">
          <h3 class="consoleUiLibrary__title">{{ selected.name }}</h3>
          <button type="button" class="btn" @click="$emit('use', selected.name)">
            {{ translate('ConsoleUI_InsertCommand') }}
          </button>
        </div>
        <p>{{ selected.description || translate('ConsoleUI_NoDescription') }}</p>

        <template v-if="selected.usage.length">
          <h4>{{ translate('ConsoleUI_Usage') }}</h4>
          <pre class="consoleUiLibrary__code"><code
            v-for="usage in selected.usage"
            :key="usage"
          >{{ selected.name }} {{ stripName(usage, selected.name) }}
</code></pre>
        </template>

        <template v-if="selected.aliases.length">
          <h4>{{ translate('ConsoleUI_Aliases') }}</h4>
          <p><code v-for="alias in selected.aliases" :key="alias">{{ alias }} </code></p>
        </template>

        <template v-if="selected.arguments.length">
          <h4>{{ translate('ConsoleUI_Arguments') }}</h4>
          <dl class="consoleUiLibrary__definitions">
            <template v-for="argument in selected.arguments" :key="argument.name">
              <dt>
                <code>{{ argument.name }}</code>
                <span class="consoleUiLibrary__badge">
                  {{ translate(argument.required ? 'ConsoleUI_Required' : 'ConsoleUI_Optional') }}
                </span>
              </dt>
              <dd>{{ argument.description || translate('ConsoleUI_NoDescription') }}</dd>
            </template>
          </dl>
        </template>

        <template v-if="selected.options.length">
          <h4>{{ translate('ConsoleUI_Options') }}</h4>
          <dl class="consoleUiLibrary__definitions">
            <template v-for="option in selected.options" :key="option.name">
              <dt>
                <code>{{ formatOption(option) }}</code>
                <span v-if="option.valueRequired" class="consoleUiLibrary__badge">
                  {{ translate('ConsoleUI_Required') }}
                </span>
              </dt>
              <dd>{{ option.description || translate('ConsoleUI_NoDescription') }}</dd>
            </template>
          </dl>
        </template>

        <details v-if="catalog.globalOptions.length" class="consoleUiLibrary__global">
          <summary>{{ translate('ConsoleUI_GlobalOptions') }}</summary>
          <dl class="consoleUiLibrary__definitions">
            <template v-for="option in catalog.globalOptions" :key="option.name">
              <dt><code>{{ formatOption(option) }}</code></dt>
              <dd>{{ option.description || translate('ConsoleUI_NoDescription') }}</dd>
            </template>
          </dl>
        </details>
      </section>
    </div>
  </ContentBlock>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ContentBlock } from 'CoreHome';
import { Field } from 'CorePluginsAdmin';
import {
  CommandCatalog,
  CommandGroup,
  CommandLibraryState,
  CommandOption,
  ConsoleCommand,
} from './types';

export default defineComponent({
  props: {
    catalog: {
      type: Object as PropType<CommandCatalog>,
      required: true,
    },
  },
  components: {
    ContentBlock,
    Field,
  },
  emits: ['use'],
  data(): CommandLibraryState {
    return {
      search: '',
      selectedName: '',
    };
  },
  computed: {
    filteredCommands(): ConsoleCommand[] {
      const terms = this.search.toLowerCase().split(/\s+/).filter((term) => term !== '');

      return this.catalog.commands.filter((command) => {
        const haystack = `${command.name} ${command.description} ${command.aliases.join(' ')}`.toLowerCase();
        return terms.every((term) => haystack.includes(term));
      });
    },
    groups(): CommandGroup[] {
      const groups: CommandGroup[] = [];
      this.filteredCommands.forEach((command) => {
        let group = groups.find((candidate) => candidate.namespace === command.namespace);
        if (!group) {
          group = { namespace: command.namespace, commands: [] };
          groups.push(group);
        }
        group.commands.push(command);
      });

      // Commands without a namespace (help, list) come first, like in `console list`
      return groups.sort((a, b) => a.namespace.localeCompare(b.namespace));
    },
    selected(): ConsoleCommand|undefined {
      const selected = this.filteredCommands.find((command) => command.name === this.selectedName);
      // By default the first command as displayed (help), not the first in alphabetical order
      return selected || this.groups[0]?.commands[0];
    },
  },
  methods: {
    formatOption(option: CommandOption): string {
      const shortcut = option.shortcut ? `${option.shortcut}, ` : '';
      let value = '';
      if (option.acceptValue) {
        value = option.valueRequired ? '=VALUE' : '[=VALUE]';
      }
      return `${shortcut}${option.name}${value}`;
    },
    stripName(usage: string, name: string): string {
      return usage.startsWith(name) ? usage.slice(name.length).trim() : usage;
    },
  },
});
</script>
