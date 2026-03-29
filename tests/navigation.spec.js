const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const LobbyPage = require('../pages/LobbyPage');
const testData  = require('../utils/testData');

test.describe('Navigation Regression — Mobile', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(
      testData.validUser.email,
      testData.validUser.password
    );
    await loginPage.waitForLoginSuccess();
  });

  // ── TEST 1: Mobile Bottom Nav Items Visible ───────────────
  test('TC10 — All main navigation items are visible on mobile', async ({ page }) => {
    const lobbyPage = new LobbyPage(page);
    await lobbyPage.waitForLobbyToLoad();

    // Assert bottom nav links visible on mobile
    await expect(lobbyPage.lobbyTab).toBeVisible();
    await expect(lobbyPage.referralsTab).toBeVisible();

    // Assert casino category tabs visible in tablist
    await expect(lobbyPage.pokiesTab).toBeVisible();
    await expect(lobbyPage.liveCasinoTab).toBeVisible();
  });

  // ── TEST 2: Pokies Tab Navigates ─────────────────────────
  test('TC11 — Pokies tab navigates to pokies page', async ({ page }) => {
    const lobbyPage = new LobbyPage(page);
    await lobbyPage.waitForLobbyToLoad();

    await lobbyPage.pokiesTab.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Assert URL changed to pokies page
    await expect(page).toHaveURL(/pokies/, { timeout: 10000 });
  });

  // ── TEST 3: Live Casino Tab Navigates ────────────────────
  test('TC12 — Live Casino tab navigates correctly', async ({ page }) => {
    const lobbyPage = new LobbyPage(page);
    await lobbyPage.waitForLobbyToLoad();

    await lobbyPage.liveCasinoTab.click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Assert URL changed to live casino page
    await expect(page).toHaveURL(/live-casino/, { timeout: 10000 });
  });

});