class LoginPage {
  constructor(page) {
    this.page = page;

    // ── Selectors (100% real from DevTools) ──────────────────

    // Login button on homepage — opens the modal
    this.loginButton   = page.locator('#login-popup-button');

    // Email/Username input inside modal
    this.emailInput    = page.locator('input[name="username"]');

    // Password input inside modal
    this.passwordInput = page.locator('input[name="password"]');

    // Submit button inside modal — XPath used (duplicate text issue)
    this.submitButton  = page.locator('xpath=//*[@id="popup"]/div[3]/div/div/div[2]/form/div/div[3]/button[2]');

    // Error message after failed login
    this.errorMessage  = page.locator('[class*="error"], [class*="alert"], [class*="message"]').first();

    // Avatar icon — using aria-describedby which is unique and stable
    this.userAvatar = page.locator('#__next > header > div > div > div.css-fb76oj > span.MuiBadge-root.css-1rzb3uu > button');
  }

  // ── Actions ───────────────────────────────────────────────

  async navigate() {
    await this.page.goto('https://www.vegastars5.com');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async openLoginModal() {
    await this.loginButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.loginButton.click();
    await this.page.waitForURL(/overlay=login/, { timeout: 10000 });
  }

  async enterEmail(email) {
    await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.emailInput.fill(email);
  }

  async enterPassword(password) {
    await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.passwordInput.fill(password);
  }

  async clickSubmit() {
    await this.submitButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.submitButton.click();
  }

  async login(email, password) {
    await this.openLoginModal();
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickSubmit();
    // Only wait for page to settle — no avatar check here
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Separate method only used for successful login assertion
  async waitForLoginSuccess() {
    await this.page.locator('#__next > header > div > div > div.css-fb76oj > span.MuiBadge-root.css-1rzb3uu > button')
      .waitFor({ state: 'visible', timeout: 15000 });
  }

  // ── Assertions ────────────────────────────────────────────

  async isLoggedIn() {
    try {
      // Wait up to 15 seconds for avatar to appear after login
      await this.userAvatar.waitFor({ state: 'visible', timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  async getErrorMessage() {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 8000 });
    return await this.errorMessage.textContent();
  }
}

module.exports = LoginPage;