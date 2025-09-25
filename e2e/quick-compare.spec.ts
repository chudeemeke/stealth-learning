import { test } from '@playwright/test';

test.describe('Quick Visual Comparison', () => {
  test('Capture both versions for comparison', async ({ page }) => {
    // GitHub Pages Version
    console.log('📸 Capturing GitHub Pages...');
    await page.goto('https://chudeemeke.github.io/stealth-learning/', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    await page.waitForTimeout(5000); // Wait for full load

    await page.screenshot({
      path: 'e2e/screenshots/final-github-pages.png',
      fullPage: true
    });

    const githubVisible = await page.locator('text=/Play Games/i').first().isVisible().catch(() => false);
    console.log('GitHub Pages - Play Games button visible:', githubVisible);

    // Local Development Version
    console.log('📸 Capturing Local Dev...');
    await page.goto('http://localhost:3000/', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    await page.waitForTimeout(5000); // Wait for full load

    await page.screenshot({
      path: 'e2e/screenshots/final-local-dev.png',
      fullPage: true
    });

    const localVisible = await page.locator('text=/Play Games/i').first().isVisible().catch(() => false);
    console.log('Local Dev - Play Games button visible:', localVisible);

    console.log('\n✅ Screenshots saved to e2e/screenshots/');
    console.log('Both versions have main UI visible:', githubVisible && localVisible);
  });
});