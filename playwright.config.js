// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Directory where your test files live
  testDir: './tests',

  // Run tests in parallel
  fullyParallel: false,

  // Retry failed tests once (good for flaky network)
  retries: 1,

  // Increase global test timeout to 60 seconds
  timeout: 60000,

  // Show detailed output in terminal
  reporter: 'html',

  use: {
    // Base URL of the app
    baseURL: 'https://www.vegastars5.com',

    // Mobile viewport — iPhone 13
    viewport: { width: 390, height: 844 },

    // Emulate mobile device
    userAgent: devices['iPhone 13'].userAgent,

    // Take screenshot on failure automatically
    screenshot: 'only-on-failure',

    // Record video on failure
    video: 'retain-on-failure',

    // Action timeout
    actionTimeout: 15000,

    // Headless in CI, headed locally
headless: process.env.CI ? true : false,
  },

  projects: [
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        channel: 'chromium',
      },
    },
  ],
});