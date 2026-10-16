<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\ConsoleUI\Console;

use Piwik\Piwik;

class CommandStoppedException extends \RuntimeException
{
    public function __construct()
    {
        parent::__construct(Piwik::translate('ConsoleUI_StoppedByUser'), StopSignal::EXIT_CODE);
    }
}
