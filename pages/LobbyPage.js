class LobbyPage {
  constructor(page) {
    this.page = page;

    // ── Selectors (real from page inspection) ─────────────────

    // Main lobby section
    this.lobbySection  = page.locator('main').first();

    // Game cards — links pointing to /casino-game/ URLs (stable href selector)
    this.gameCards     = page.locator('a[href*="casino-game"]');

    // Mobile bottom navigation — real links visible on mobile viewport
this.lobbyTab      = page.locator('a[href="/"]').first();
this.referralsTab  = page.locator('a[href="/referral/"]').first();

// Category tabs — visible in the tablist on the main page
this.pokiesTab     = page.locator('a[href="/casino/pokies/"]').first();
this.liveCasinoTab = page.locator('a[href="/casino/live-casino/"]').first();
this.tournamentTab = page.locator('a[href="/tournaments/"]').first();
this.promotionsTab = page.locator('a[href="/casino/new-releases/"]').first();

    // Search input
    this.searchInput   = page.locator('input[placeholder*="search" i], input[type="search"]').first();
  }

  // ── Actions ───────────────────────────────────────────────

  async navigate() {
    await this.page.goto('https://www.vegastars5.com');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForLobbyToLoad() {
    await this.lobbySection.waitFor({ state: 'visible', timeout: 15000 });
    // Give the page extra time to load game cards
    await this.page.waitForTimeout(2000);
  }

  async getGameCardCount() {
    await this.gameCards.first().waitFor({ state: 'visible', timeout: 15000 });
    return await this.gameCards.count();
  }

  async clickPokiesTab() {
    await this.pokiesTab.waitFor({ state: 'visible', timeout: 10000 });
    await this.pokiesTab.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
  }

  async clickLiveCasinoTab() {
    await this.liveCasinoTab.waitFor({ state: 'visible', timeout: 10000 });
    await this.liveCasinoTab.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
  }

  async searchGame(gameName) {
    await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchInput.fill(gameName);
    await this.page.waitForLoadState('networkidle');
  }

  // ── Assertions ────────────────────────────────────────────

  async isLobbyVisible() {
    return await this.lobbySection.isVisible();
  }

  async areGameCardsVisible() {
    const count = await this.getGameCardCount();
    return count > 0;
  }
}

module.exports = LobbyPage;