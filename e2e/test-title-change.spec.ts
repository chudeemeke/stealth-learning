import { test } from '@playwright/test';

test('Check if title change appears', async ({ page }) => {
  // Quick login
  await page.goto('http://localhost:3000');
  await page.locator('button:has-text("I\'m a Kid")').click();
  await page.locator('button').filter({ hasText: /6-8/i }).click();
  await page.locator('input[placeholder*="name" i]').fill('TestPlayer');
  await page.locator('text="🦁"').first().click();
  await page.locator('button').filter({ hasText: /Let's Play/i }).click();
  await page.locator('button').filter({ hasText: /Start Playing|Begin Your Quest/i }).click();

  await page.waitForTimeout(2000);

  console.log('Checking for title change...');
  await page.screenshot({ path: 'e2e/screenshots/title-change-test.png', fullPage: true });

  // Check if new title is present
  const pageText = await page.locator('body').textContent();
  console.log('Page contains "DEBUG TEST":', pageText?.includes('DEBUG TEST') ? 'YES' : 'NO');
  console.log('Page contains "Choose Your Adventure":', pageText?.includes('Choose Your Adventure') ? 'YES' : 'NO');
});