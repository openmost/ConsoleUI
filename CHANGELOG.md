## Changelog

### v5.0.5

- Fix: the Stopping and Stopped labels of the console are translated instead of showing a missing translation message.

### v5.0.4

- Request parameters are read with `Piwik\Request` instead of the deprecated `Common::getRequestVar`, ready for the next Matomo versions.

### v5.0.3

- Fix the missing translation of the Stop button

### v5.0.2

- Accessibility improvements in the console (command suggestions, reload link)

### v5.0.1

- Requires Matomo 5.0.0 or later (`>=5.0.0,<6.0.0-b1`)

### v5.0.0

- Console page under Administration > Platform > Console, for super users, behind a password confirmation
- Commands run in-process, without shell, with their output and logs streamed live and colored
- Autocompletion of command names and options
- Command library with the description, usage, arguments and options of every command
- Development commands are never available, `[ConsoleUI]` settings in `config/config.ini.php` restrict or turn off the console
- Every command is written to the Matomo logs, with secret option values masked
- Translated into 12 languages
