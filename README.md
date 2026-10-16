# Console UI

## Description

Run Matomo console commands from the browser, with autocompletion and a library of every available command, when you have no SSH access to the server: shared hosting, managed platforms, locked down servers.

### Features

- **A console in Matomo**: Administration > Platform > Console, for super users only. Type a command, its output appears as it runs, with the colors of a real terminal.
- **Autocompletion**: command names while you type the first word, then the options of the command, with their descriptions. Tab accepts a suggestion, Up and Down browse the suggestions or the commands you ran.
- **Command library**: every command of your Matomo, core and plugins, grouped by namespace and searchable, with its description, usage, arguments and options. One click inserts it in the console.
- **Live output**: the output is streamed while the command runs, logs included, so long commands such as `core:archive` show their progress. A Stop button (or Ctrl+C) interrupts the running command, and it keeps running if you only close the page.
- **No shell needed**: commands run inside Matomo, the same way the `console` script runs them. It works on hostings where `exec()`, `proc_open()` or SSH are disabled.
- Translated into 12 languages.

### Security

- Super users only, the page and the command endpoint both check it.
- The page asks the super user to confirm their password first, like installing a plugin does, and asks again once the confirmation expires.
- Commands only run from a logged in browser session (session token, POST only). The endpoint is not part of the HTTP API, a `token_auth` alone cannot run a command.
- Development commands (`development:*`, `generate:*`, `tests:*`, `vue:*`, `translations:*`...), commands calling system tools through a shell (`git:*`, `log:watch`) and fake data generators (`visitorgenerator:*`) are never available. Plugin and Marketplace commands follow the `enable_plugins_admin` setting.
- `config:set` and `config:delete` cannot change the `[ConsoleUI]` and `[Development]` sections, nor `enable_plugin_upload`, `enable_plugins_admin` and `always_load_commands_from_plugin`. `core:archive --url` only accepts the URL of this Matomo, `--xhprof` and `--matomo-domain` are refused.
- Every command is written to the Matomo logs with the login of the super user, values of password, token, key and config options masked. The `ConsoleUI.commandExecuted` event lets an audit plugin record it too.
- The server administrator can restrict or turn off the console in `config/config.ini.php`, and the console cannot change that section itself:

```ini
[ConsoleUI]
; turns the console off
enabled = 0
; when set, only these commands are available
allowed_commands[] = "core:archive"
allowed_commands[] = "core:clear-caches"
; commands removed from the console, on top of the development ones
blocked_commands[] = "user:*"
```

### Requirements

- Matomo 6 (`>=6.0.0-b1,<7.0.0-b1`)
- PHP 8.1 or later
- On Matomo 5, install Console UI 5.x instead.

### Installation / Configuration

1. Install Console UI from the Marketplace (Administration > Platform > Marketplace) and activate it.
2. Go to Administration > Platform > Console and confirm your password.
3. Type a command, for example `core:archive` or `core:clear-caches`, or pick one in the command library.

### Privacy and data

The plugin stores nothing: the commands you type stay in the page and are forgotten when you leave it. Each command run is written to the Matomo logs. The plugin sends no data to third parties.

### Need help with Matomo?

Openmost is an official Matomo Implementation Partner. When the console is not enough, we [install, upgrade and maintain Matomo](https://openmost.com/matomo/services/integration?utm_source=matomo_marketplace&utm_medium=referral&utm_campaign=services&utm_content=consoleui) on any hosting, archiving and performance tuning included.

## Support

- Email: ronan@openmost.com
- Homepage: https://openmost.com/matomo/extensions/console-ui
- Issues: https://github.com/openmost/ConsoleUI/issues

## Screenshots

Screenshots of the console and the command library are available in the `screenshots` folder and on the Marketplace.

## License

GPL v3 or later
