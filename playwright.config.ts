import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Stealth Learning
 * Features:
 * - Visual/optical mode (headed by default)
 * - Human-like browser emulation
 * - Console error capture
 * - Screenshots on failure
 * - Slower action timing for more realistic interaction
 */
export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['list'],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  /* Shared settings for all the projects below. */
  use: {
    /* VISUAL/OPTICAL MODE - Human-like browser emulation */
    headless: false, // Always show browser (visual mode)

    /* Slower, more human-like actions */
    actionTimeout: 10000,
    navigationTimeout: 30000,

    /* Human-like delays */
    launchOptions: {
      slowMo: 500, // 500ms delay between actions (more human-like)
    },

    /* Base URL */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',

    /* Screenshots on failure */
    screenshot: 'only-on-failure',

    /* Video recording */
    video: 'retain-on-failure',

    /* Console and page error handling */
    ignoreHTTPSErrors: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Human-like viewport
        viewport: { width: 1280, height: 720 },
        // Human-like user agent and settings
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        // Permissions for realistic testing
        permissions: ['notifications'],
        // Locale and timezone
        locale: 'en-US',
        timezoneId: 'America/New_York',
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
    },

    /* Test against mobile viewports for responsive testing */
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        // Slower mobile interaction
        launchOptions: {
          slowMo: 750,
        },
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12'],
        launchOptions: {
          slowMo: 750,
        },
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  /* Global setup for debugging */
  // globalSetup: './e2e/global-setup.ts', // Temporarily disabled due to ES module issue
});