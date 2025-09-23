import { test, expect } from '@playwright/test';

test.describe('Simple Navigation Test - Debug', () => {

  test('Basic page load and navigation', async ({ page }) => {
    console.log('🔍 Testing basic page load...');

    // Go to the page
    await page.goto('http://localhost:3000');

    // Take screenshot of landing page
    await page.screenshot({ path: 'e2e/screenshots/debug-landing.png' });

    // Wait for page to load
    await page.waitForTimeout(3000);

    // Check if basic elements are there
    const hasKidButton = await page.locator('text=I\'m a Kid!').isVisible();
    const hasParentButton = await page.locator('text=I\'m a Parent').isVisible();

    console.log('Has kid button:', hasKidButton);
    console.log('Has parent button:', hasParentButton);

    if (!hasKidButton || !hasParentButton) {
      throw new Error('Basic buttons not found on landing page');
    }

    // Try clicking kid button
    await page.click('text=I\'m a Kid!');
    await page.waitForTimeout(2000);

    // Take screenshot after clicking
    await page.screenshot({ path: 'e2e/screenshots/debug-after-kid-click.png' });

    // Get current URL
    const url = page.url();
    console.log('Current URL after kid click:', url);

    // Check what's actually on the page
    const pageContent = await page.locator('body').textContent();
    console.log('Page content preview:', pageContent?.substring(0, 200));

    console.log('✅ Basic navigation test completed');
  });
});