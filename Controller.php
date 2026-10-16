<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\ConsoleUI;

use Piwik\Common;
use Piwik\Container\StaticContainer;
use Piwik\Log\LoggerInterface;
use Piwik\Piwik;
use Piwik\Plugins\ConsoleUI\Console\CommandNotAllowedException;
use Piwik\Plugins\ConsoleUI\Console\CommandRunner;
use Piwik\Plugins\ConsoleUI\Console\StopSignal;
use Piwik\Plugins\Login\PasswordVerifier;
use Piwik\Request;
use Piwik\Session;

class Controller extends \Piwik\Plugin\ControllerAdmin
{
    private const EMPTY_CATALOG = ['commands' => [], 'globalOptions' => []];

    /** @var PasswordVerifier */
    private $passwordVerify;

    /** @var CommandRunner */
    private $runner;

    public function __construct(PasswordVerifier $passwordVerify, CommandRunner $runner)
    {
        $this->passwordVerify = $passwordVerify;
        $this->runner = $runner;

        parent::__construct();
    }

    /**
     * The Console page. Like installing a plugin, it asks the super user to confirm their password first.
     */
    public function index()
    {
        Piwik::checkUserHasSuperUserAccess();

        if (!$this->runner->getPolicy()->isEnabled()) {
            return $this->renderTemplate('index', ['enabled' => false, 'catalog' => self::EMPTY_CATALOG]);
        }

        $redirectParams = ['module' => 'ConsoleUI', 'action' => 'index'];
        if (
            $this->requiresPasswordConfirmation()
            && !$this->passwordVerify->requirePasswordVerifiedRecently($redirectParams)
        ) {
            return '';
        }

        try {
            $catalog = $this->runner->getCatalog();
        } catch (\Throwable $e) {
            // The console stays usable without the library, a plugin shipping a broken command must not hide it
            StaticContainer::get(LoggerInterface::class)->error('ConsoleUI: cannot list the commands: {message}', [
                'message' => $e->getMessage(),
                'exception' => $e,
            ]);
            $catalog = self::EMPTY_CATALOG;
        }

        return $this->renderTemplate('index', ['enabled' => true, 'catalog' => $catalog]);
    }

    /**
     * Runs a command and streams its output as Server-Sent Events.
     *
     * A controller action and not an API method on purpose: it is only reachable from a logged in browser session
     * (token of the session, POST only, recently confirmed password), never with a token_auth alone.
     */
    public function execute(): void
    {
        $this->checkSessionPost();

        $request = Request::fromPost();
        $commandLine = $request->getStringParameter('command', '');
        $runId = $request->getStringParameter('runId', '');
        $passwordConfirmed = !$this->requiresPasswordConfirmation() || $this->passwordVerify->hasBeenVerified();

        // The command may run for a while, the other requests of the user must not wait for the session lock
        Session::close();

        @set_time_limit(0);
        // Closing the tab must not stop a command halfway, an interrupted core:update would leave Matomo broken
        ignore_user_abort(true);

        $stream = new EventStream();
        $stream->open();

        if (!$passwordConfirmed) {
            $stream->emit('error', [
                'message' => Piwik::translate('ConsoleUI_PasswordConfirmationExpired'),
                'reload' => true,
            ]);
            $stream->close();
            return;
        }

        $start = microtime(true);
        $stopSignal = null;
        try {
            $stopSignal = new StopSignal($runId);
            $stopSignal->start(Piwik::getCurrentUserLogin());

            $exitCode = $this->runner->run($commandLine, [$stream, 'output'], $stopSignal);
            $stream->emit('exit', [
                'exitCode' => $exitCode,
                'durationMs' => (int) round((microtime(true) - $start) * 1000),
                'stopped' => $stopSignal->wasStopped(),
            ]);
        } catch (\InvalidArgumentException | CommandNotAllowedException $e) {
            $stream->emit('error', ['message' => $e->getMessage()]);
        } catch (\Throwable $e) {
            StaticContainer::get(LoggerInterface::class)->error('ConsoleUI: command failed: {message}', [
                'message' => $e->getMessage(),
                'exception' => $e,
            ]);
            $stream->emit('error', ['message' => Piwik::translate('ConsoleUI_UnexpectedError')]);
        } finally {
            if ($stopSignal) {
                $stopSignal->finish();
            }
        }

        $stream->close();
    }

    /**
     * Asks the command a user started to stop, see StopSignal
     */
    public function stop(): string
    {
        $this->checkSessionPost();

        Common::sendHeader('Content-Type: application/json; charset=utf-8');

        $runId = Request::fromPost()->getStringParameter('runId', '');
        $requested = StopSignal::isValidRunId($runId)
            && (new StopSignal($runId))->request(Piwik::getCurrentUserLogin());

        return (string) json_encode(['requested' => $requested]);
    }

    /**
     * Super user, POST and token of the session: a command never runs, nor stops, from a link or a token_auth alone
     */
    private function checkSessionPost(): void
    {
        Piwik::checkUserHasSuperUserAccess();

        if (strtoupper($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
            throw new \Exception(Piwik::translate('ConsoleUI_PostRequired'));
        }

        $this->checkTokenInUrl();
    }

    private function requiresPasswordConfirmation(): bool
    {
        return Piwik::doesUserRequirePasswordConfirmation(Piwik::getCurrentUserLogin());
    }
}
