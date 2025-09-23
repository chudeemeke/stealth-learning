import { test, expect } from '@playwright/test';

test('Ultra simple page load test', async ({ page }) => {
  console.log('🔍 Testing ultra simple page load...');

  // Set a very long timeout
  test.setTimeout(60000);

  try {
    // Go to the page
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });

    console.log('✅ Page loaded successfully');

    // Take a screenshot immediately
    await page.screenshot({ path: 'e2e/screenshots/simple-load.png' });

    console.log('✅ Screenshot taken');

  } catch (error) {
    console.log('❌ Error:', error);

    // Take screenshot of error state
    try {
      await page.screenshot({ path: 'e2e/screenshots/error-state.png' });
    } catch (e) {
      console.log('❌ Could not take error screenshot:', e);
    }

    throw error;
  }
});