import { chromium, FullConfig } from '@playwright/test';

/**
 * Global Setup for Playwright Tests
 * Sets up console error logging and browser debugging features
 */
async function globalSetup(config: FullConfig) {
  console.log('🎭 Setting up Playwright with visual/optical mode...');
  console.log('🔍 Browser will be visible for human-like testing');
  console.log('⚠️  Console errors will be captured for debugging');

  // Test browser launch to ensure configuration works
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // Set up console error capture for debugging
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log('🔴 Browser Console Error:', msg.text());
    } else if (msg.type() === 'warning') {
      console.log('🟡 Browser Console Warning:', msg.text());
    }
  });

  // Set up page error capture
  page.on('pageerror', (error) => {
    console.log('💥 Page Error:', error.message);
  });

  // Set up request failure capture
  page.on('requestfailed', (request) => {
    console.log('🌐 Request Failed:', request.url(), request.failure()?.errorText);
  });

  await browser.close();
  console.log('✅ Playwright setup complete - ready for visual testing!');
}

export default globalSetup;