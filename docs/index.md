## Documentation

Console UI brings the Matomo `console` to the administration of Matomo, for the instances you cannot reach with SSH.

### Running a command

Go to **Administration > Platform > Console**. Matomo asks for your password first, then shows the console.

Type a command and press Enter. You can paste a command from the Matomo documentation as is: the `./console`, `console` or `php console` prefix is ignored. The output appears while the command runs, and the last line gives the exit code and the duration.

Commands never ask questions: they run as with the `--no-interaction` option, so a command expecting a confirmation uses its default answer. Add `--help` to a command to read its options first.

### Autocompletion and history

- While you type the first word, the console suggests the matching commands.
- After the command name, it suggests its options. An option expecting a value is completed with `=`.
- **Tab** accepts the selected suggestion, **Up** and **Down** browse the suggestions, or the commands you ran when no suggestion is open.
- **Ctrl+C** or the **Stop** button stops the running command, **Ctrl+L** clears the output, **Copy** copies it to the clipboard.

The history stays in the page and is forgotten when you leave it, as a command line may contain a password.

### Command library

Below the console, the library lists every command of your Matomo, core and plugins, grouped by namespace. Search by name or description, select a command to read its usage, arguments and options, then click **Use this command** to insert it in the console.

### Restricting the console

The server administrator controls the console in `config/config.ini.php`:

```ini
[ConsoleUI]
enabled = 0                          ; turns the console off
allowed_commands[] = "core:archive"  ; when set, only these commands are available
blocked_commands[] = "user:*"        ; commands removed from the console
```

Patterns accept `*` wildcards. `list` and `help` stay available. Development commands, `git:*`, `log:watch` and `visitorgenerator:*` are always removed, and plugin commands follow `enable_plugins_admin`. `config:set` and `config:delete` cannot change the `[ConsoleUI]` and `[Development]` sections, nor the plugin upload and plugins admin settings.

### Stopping a command

While a command runs, the **Run** button becomes **Stop**. The command is interrupted the next time it writes output or a log line, like Ctrl+C on the command line, and ends with the exit code 130. A command that writes nothing for a while stops when it writes again.

### Long commands

The output is streamed while the command runs, and the command keeps running if you close the page or lose the connection. Some hostings cut a request that sends nothing for a while (often 60 to 100 seconds): the console then reports a lost connection, check the Matomo logs to follow the command.
