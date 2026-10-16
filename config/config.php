<?php

use Piwik\Plugins\ConsoleUI\Console\CommandPolicy;

return [
    // Autowiring would build a policy with its defaults and ignore the [ConsoleUI] section of the config file
    CommandPolicy::class => Piwik\DI::factory(function () {
        return CommandPolicy::fromConfig();
    }),
];
