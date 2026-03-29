class GamePage {
  constructor(page) {
    this.page = page;

    // ── Selectors (real from page inspection) ─────────────────

    // First game card — same stable href selector we used in LobbyPage
    this.firstGameCard  = page.locator('a[href*="casino-game"]').first();

    // Play button that appears after clicking a game
    this.playButton     = page.locator('button:has-text("Play"), a:has-text("Play Now"), button:has-text("Play Now")').first();

    // Game iframe — appears after game launches
    this.gameFrame      = page.locator('iframe').first();

    // Game container
    this.gameContainer  = page.locator('[class*="game-container"], [class*="gameContainer"], #game-container').first();

    // Loading spinner
    this.loadingSpinner = page.locator('[class*="loading"], [class*="spinner"]').first();
  }

  // ── Actions ───────────────────────────────────────────────

  async clickFirstGame() {
    await this.firstGameCard.waitFor({ state: 'visible', timeout: 15000 });
    // Scroll element into view first
    await this.firstGameCard.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
    // Use force click to bypass any overlapping elements
    await this.firstGameCard.click({ force: true });
    // Wait for page to respond after click
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
  }

  async clickPlayButton() {
    await this.playButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.playButton.click();
  }

  async waitForGameToLoad() {
    // Wait for loading spinner to disappear first
    try {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    } catch {
      // Spinner may not exist — that's fine
    }
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000);
  }

  // ── Assertions ────────────────────────────────────────────

  async isGameLoaded() {
    // Check if URL changed to a game page
    const url = this.page.url();
    const isGameURL = url.includes('/casino-game/');

    // Also check if iframe exists anywhere on page
    const iframeCount = await this.page.locator('iframe').count();

    return isGameURL || iframeCount > 0;
  }

  async hasNoConsoleErrors(consoleErrors) {
    return consoleErrors.length === 0;
  }
}

module.exports = GamePage;