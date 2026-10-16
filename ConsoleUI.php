<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\ConsoleUI;

class ConsoleUI extends \Piwik\Plugin
{
    public function registerEvents()
    {
        return [
            'Template.afterEventsReport' => 'renderOpenmostCommunicationAfterEvents',
            'Widget.filterWidgets' => 'addOpenmostCommunicationWidgets',
            'Template.beforeContent' => 'renderOpenmostCommunication',
            'AssetManager.getStylesheetFiles' => 'getStylesheetFiles',
            'Translate.getClientSideTranslationKeys' => 'getClientSideTranslationKeys',
        ];
    }

    public function getStylesheetFiles(&$stylesheets)
    {
        $stylesheets[] = 'plugins/ConsoleUI/vue/src/ConsolePage/ConsolePage.less';
    }

    public function getClientSideTranslationKeys(&$translationKeys)
    {
        $keys = [
            'Console', 'Disabled', 'SecurityNotice', 'InputLabel', 'InputPlaceholder', 'Run', 'Running', 'Clear',
            'Copy', 'Copied', 'OutputLabel', 'OutputEmpty', 'ExitCode', 'Duration', 'OutputTruncated',
            'ConnectionLost', 'UnexpectedError', 'ReloadPage', 'Library', 'LibrarySearch', 'LibraryEmpty',
            'LibraryCount', 'Arguments', 'Options', 'GlobalOptions', 'Required', 'Optional', 'Usage',
            'InsertCommand', 'KeyboardHints', 'NoDescription', 'Suggestions', 'Aliases',
        ];

        foreach ($keys as $key) {
            $translationKeys[] = 'ConsoleUI_' . $key;
        }
    }

    public function renderOpenmostCommunication(&$out, $layout, $module = '', $action = '')
    {
        OpenmostCommunication::beforeContent($out, (string) $layout, (string) $module, (string) $action, $this->getPluginName());
    }

    public function addOpenmostCommunicationWidgets($list)
    {
        OpenmostCommunication::filterWidgets($list, $this->getPluginName());
    }

    public function renderOpenmostCommunicationAfterEvents(&$out, $dataTable = null)
    {
        OpenmostCommunication::afterEventsReport($out, $this->getPluginName());
    }
}
