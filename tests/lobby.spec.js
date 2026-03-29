const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const LobbyPage = require('../pages/LobbyPage');
const testData = require('../utils/testData');

test.describe('Lobby Page Load — Mobile', () => {

  // Login once before all lobby tests
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(
      testData.validUser.email,
      testData.validUser.password
    );
  });

  // ── TEST 1: Lobby Loads ──────────────────────────────────
  test('TC04 — Lobby section is visible after login', async ({ page }) => {
    const lobbyPage = new LobbyPage(page);

    await lobbyPage.waitForLobbyToLoad();

    // Assert lobby is visible
    const isVisible = await lobbyPage.isLobbyVisible();
    expect(isVisible).toBeTruthy();
  });

  // ── TEST 2: Game Cards Load ──────────────────────────────
  test('TC05 — Game cards are displayed in lobby', async ({ page }) => {
    const lobbyPage = new LobbyPage(page);

    await lobbyPage.waitForLobbyToLoad();

    // Assert at least 1 game card is visible
    const hasGames = await lobbyPage.areGameCardsVisible();
    expect(hasGames).toBeTruthy();

    // Assert there are multiple games (not just 1)
    const count = await lobbyPage.getGameCardCount();
    expect(count).toBeGreaterThan(1);
  });

  // ── TEST 3: Pokies Tab Works ─────────────────────────────
  test('TC06 — Pokies category tab loads games', async ({ page }) => {
    const lobbyPage = new LobbyPage(page);

    await lobbyPage.waitForLobbyToLoad();
    await lobbyPage.clickPokiesTab();

    // Assert games still visible after tab switch
    const hasGames = await lobbyPage.areGameCardsVisible();
    expect(hasGames).toBeTruthy();
  });

  // ── TEST 4: Viewport Check ───────────────────────────────
  test('TC07 — Lobby layout fits mobile viewport (no horizontal scroll)', async ({ page }) => {
    const lobbyPage = new LobbyPage(page);
    await lobbyPage.waitForLobbyToLoad();

    // Assert page width does not exceed viewport width
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize().width;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5); // 5px tolerance
  });

});