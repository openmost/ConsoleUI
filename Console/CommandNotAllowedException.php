<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\ConsoleUI\Console;

use Piwik\Piwik;

class CommandNotAllowedException extends \RuntimeException
{
    public function __construct(string $commandName)
    {
        parent::__construct(Piwik::translate('ConsoleUI_CommandNotAllowed', [$commandName]));
    }
}
