import { test } from '@playwright/test';

test('Check if PLAY button is visible', async ({ page }) => {
  // Quick login
  await page.goto('http://localhost:3000');
  await page.locator('button:has-text("I\'m a Kid")').click();
  await page.locator('button').filter({ hasText: /6-8/i }).click();
  await page.locator('input[placeholder*="name" i]').fill('TestPlayer');
  await page.locator('text="🦁"').first().click();
  await page.locator('button').filter({ hasText: /Let's Play/i }).click();
  await page.locator('button').filter({ hasText: /Start Playing|Begin Your Quest/i }).click();

  await page.waitForTimeout(2000);

  console.log('Taking screenshot of current games page...');
  await page.screenshot({ path: 'e2e/screenshots/debug-play-button-check.png', fullPage: true });

  // Check if PLAY button exists
  const playButtons = await page.locator('button:has-text("PLAY")').count();
  console.log(`Found ${playButtons} PLAY buttons`);

  // Check page content
  const pageText = await page.locator('body').textContent();
  console.log('Page contains "PLAY":', pageText?.includes('PLAY') ? 'YES' : 'NO');
  console.log('Page contains "Mathematics":', pageText?.includes('Mathematics') ? 'YES' : 'NO');
});