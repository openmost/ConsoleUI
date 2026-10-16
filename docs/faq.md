## FAQ

__How do I install this plugin?__

Install it from the Matomo Marketplace like any other plugin:

- Go to Administration > Platform > Marketplace
- Search for "**Console UI**", install and activate the plugin.
- Go to __Administration > Platform > Console__.

__Who can use the console?__

Super users only, after confirming their password. Other users do not see the menu entry, and the page and the command endpoint refuse them.

__Does it need `exec()`, `proc_open()` or SSH?__

No. Commands run inside Matomo, the same way the `console` script runs them, so the console works on shared hostings where these functions are disabled. Nothing typed in the page is handed to a shell.

__Why is a command missing?__

Development commands are never available from the browser. The server administrator may also have restricted the console with `allowed_commands` or `blocked_commands` in the `[ConsoleUI]` section of `config/config.ini.php`.

__A command asks a question in a terminal, what happens here?__

Commands run without interaction, as with `--no-interaction`: a question gets its default answer. Check the options of the command with `--help` to answer it on the command line instead, for example with `--force` or `--yes` when the command offers one.

__The connection was lost during a long command, is it stopped?__

No, the command keeps running on the server until it ends. Some hostings cut requests that send nothing for a minute or more. Follow the command in the Matomo logs.

__Are the commands I run recorded?__

Yes. Each command is written to the Matomo logs with the login of the super user who ran it, with the values of password, token or key options masked.

__How do I turn the console off?__

Add `enabled = 0` under a `[ConsoleUI]` section of `config/config.ini.php`, or deactivate the plugin.
