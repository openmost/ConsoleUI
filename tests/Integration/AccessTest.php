<?php

/**
 * Matomo - free/libre analytics platform
 *
 * @link    https://matomo.org
 * @license https://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

namespace Piwik\Plugins\ConsoleUI\tests\Integration;

use Piwik\Config;
use Piwik\Container\StaticContainer;
use Piwik\Menu\MenuAdmin;
use Piwik\NoAccessException;
use Piwik\Plugins\ConsoleUI\Console\CommandPolicy;
use Piwik\Plugins\ConsoleUI\Controller;
use Piwik\Tests\Framework\Fixture;
use Piwik\Tests\Framework\Mock\FakeAccess;
use Piwik\Tests\Framework\TestCase\IntegrationTestCase;

/**
 * Only super users reach the Console, and only through a POST of their session
 *
 * @group ConsoleUI
 * @group AccessTest
 * @group Plugins
 */
class AccessTest extends IntegrationTestCase
{
    /** @var array<string, mixed> */
    private $originalServer;

    public function setUp(): void
    {
        parent::setUp();

        Fixture::createWebsite('2024-01-01 00:00:00');
        StaticContainer::get('Piwik\Translation\Translator')->addDirectory(__DIR__ . '/../../lang');

        $this->originalServer = $_SERVER;
    }

    public function tearDown(): void
    {
        $_SERVER = $this->originalServer;
        Config::getInstance()->ConsoleUI = [];

        parent::tearDown();
    }

    public function provideContainerConfig()
    {
        return [
            'Piwik\Access' => new FakeAccess(),
        ];
    }

    private function controller(): Controller
    {
        return StaticContainer::get(Controller::class);
    }

    private function setAdminOfSite(): void
    {
        FakeAccess::clearAccess(false, [1], [1], 'admin');
    }

    public function testPageRefusesUsersWhoAreNotSuperUsers()
    {
        $this->setAdminOfSite();
        $this->expectException(NoAccessException::class);

        $this->controller()->index();
    }

    public function testExecuteRefusesUsersWhoAreNotSuperUsers()
    {
        $this->setAdminOfSite();
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $this->expectException(NoAccessException::class);

        $this->controller()->execute();
    }

    public function testExecuteRefusesGetRequests()
    {
        FakeAccess::clearAccess(true);
        $_SERVER['REQUEST_METHOD'] = 'GET';
        $this->expectExceptionMessage('POST');

        $this->controller()->execute();
    }

    public function testMenuItemIsForSuperUsersOnly()
    {
        $this->setAdminOfSite();
        $this->assertNull($this->findMenuItem());

        FakeAccess::clearAccess(true);
        $this->assertNotNull($this->findMenuItem());
    }

    public function testPolicyFollowsTheConfigFile()
    {
        Config::getInstance()->ConsoleUI = [
            'enabled' => 1,
            'blocked_commands' => ['core:archive'],
            'allowed_commands' => ['core:*'],
        ];
        $policy = CommandPolicy::fromConfig();

        $this->assertTrue($policy->isEnabled());
        $this->assertFalse($policy->isCommandAllowed('core:archive'));
        $this->assertTrue($policy->isCommandAllowed('core:update'));
        $this->assertFalse($policy->isCommandAllowed('plugin:list'));
    }

    public function testConsoleCanBeDisabledInTheConfigFile()
    {
        Config::getInstance()->ConsoleUI = ['enabled' => 0];

        $this->assertFalse(CommandPolicy::fromConfig()->isEnabled());
        $this->assertFalse(StaticContainer::get(CommandPolicy::class)->isEnabled());
    }

    public function testConsoleIsEnabledWithoutConfiguration()
    {
        $this->assertTrue(CommandPolicy::fromConfig()->isEnabled());
    }

    /**
     * @return mixed
     */
    private function findMenuItem()
    {
        MenuAdmin::unsetInstance();

        foreach (MenuAdmin::getInstance()->getMenu() ?: [] as $category) {
            foreach ($category as $name => $item) {
                if ($name === 'ConsoleUI_Console' || (is_array($item) && isset($item['ConsoleUI_Console']))) {
                    return $item;
                }
            }
        }

        return null;
    }
}
