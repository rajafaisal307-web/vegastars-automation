const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const LobbyPage = require('../pages/LobbyPage');
const GamePage = require('../pages/GamePage');
const testData = require('../utils/testData');

test.describe('Game Launch — Mobile', () => {

  // Collect console errors during test
  let consoleErrors = [];

  test.beforeEach(async ({ page }) => {
    consoleErrors = [];

    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Login first
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(
      testData.validUser.email,
      testData.validUser.password
    );
  });

  // ── TEST 1: Game Launches Successfully ───────────────────
  test('TC08 — First game in lobby launches on mobile', async ({ page }) => {
    const lobbyPage = new LobbyPage(page);
    const gamePage  = new GamePage(page);

    // Wait for lobby then click first game
    await lobbyPage.waitForLobbyToLoad();
    await gamePage.clickFirstGame();

    // Click Play if a Play button appears
    try {
      await gamePage.clickPlayButton();
    } catch {
      // Play button may not exist on some games — that's okay
    }

    // Wait for game to load
    await gamePage.waitForGameToLoad();

    // Assert game container or iframe is visible
    const isLoaded = await gamePage.isGameLoaded();
    expect(isLoaded).toBeTruthy();
  });

  // ── TEST 2: No Critical Console Errors on Launch ─────────
  test('TC09 — No critical console errors during game launch', async ({ page }) => {
    const lobbyPage = new LobbyPage(page);
    const gamePage  = new GamePage(page);

    await lobbyPage.waitForLobbyToLoad();
    await gamePage.clickFirstGame();

    try {
      await gamePage.clickPlayButton();
    } catch {
      // Play button optional
    }

    await gamePage.waitForGameToLoad();

    // Filter out known non-critical third-party errors
    // Filter out known third-party and non-critical errors
    // Casino sites always have errors from game providers, tracking scripts etc.
    const criticalErrors = consoleErrors.filter(err =>
      !err.includes('favicon') &&
      !err.includes('analytics') &&
      !err.includes('google-analytics') &&
      !err.includes('gtm') &&
      !err.includes('intercom') &&
      !err.includes('hotjar') &&
      !err.includes('facebook') &&
      !err.includes('cdn') &&
      !err.includes('stripe') &&
      !err.includes('Failed to load resource') &&
      !err.includes('net::ERR') &&
      !err.includes('404') &&
      !err.includes('ipapi.co') && // Third-party IP geolocation service — outside app control
      !err.includes('CORS')        // CORS errors from third-party services — not app bugs
    );

    // Log what errors remain so we can see them
    if (criticalErrors.length > 0) {
      console.log('Critical errors found:', criticalErrors);
    }

    // Assert no critical app errors
    expect(criticalErrors.length).toBe(0);
  });

});