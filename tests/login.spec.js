const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const testData = require('../utils/testData');

test.describe('Login Flow — Mobile', () => {

  // This runs before EACH test — opens a fresh browser
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  // ── TEST 1: Successful Login ─────────────────────────────
  test('TC01 — Valid login with correct credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Action
    await loginPage.login(
      testData.validUser.email,
      testData.validUser.password
    );

    // Wait for avatar to confirm login completed
    await loginPage.waitForLoginSuccess();

    // Assertions
    await expect(page).not.toHaveURL(/overlay=login/, { timeout: 15000 });
    const loggedIn = await loginPage.isLoggedIn();
    expect(loggedIn).toBeTruthy();
    await expect(page).toHaveTitle(/Vegas/i, { timeout: 5000 });
  });

  // ── TEST 2: Failed Login ─────────────────────────────────
  test('TC02 — Invalid login with wrong credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Action
    await loginPage.login(
      testData.invalidUser.email,
      testData.invalidUser.password
    );

    // Assertions — error message should appear
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toBeTruthy();
    expect(page.url()).toContain(testData.baseURL);
  });

  // ── TEST 3: Empty Fields ─────────────────────────────────
  test('TC03 — Login blocked when fields are empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Open login modal but submit without filling anything
    await loginPage.openLoginModal();
    await loginPage.clickSubmit();

    // Should still be on same page / show validation
    await expect(page.locator(
      'input:invalid, [class*="error"], [class*="required"]'
    ).first()).toBeVisible();
  });

});