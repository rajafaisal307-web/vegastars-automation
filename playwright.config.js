// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Directory where your test files live
  testDir: './tests',

  // Run tests in parallel
  fullyParallel: false,

  // Retry failed tests once (good for flaky network)
  retries: 1,

  // Increase global test timeout to 90 seconds for CI
  timeout: 90000,

  // Show detailed output in terminal
  reporter: 'html',

  use: {
    // Base URL of the app
    baseURL: 'https://www.vegastars5.com',

    // Mobile viewport — iPhone 13
    viewport: { width: 390, height: 844 },

    // Real mobile user agent — works in both local and CI
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',

    // Take screenshot on failure automatically
    screenshot: 'only-on-failure',

    // Record video on failure
    video: 'retain-on-failure',

    // Action timeout increased for CI
    actionTimeout: 30000,

    // Headless in CI, headed locally
    headless: process.env.CI ? true : false,
  },

  projects: [
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        channel: 'chromium',
        // Override with real mobile user agent
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
      },
    },
  ],
});