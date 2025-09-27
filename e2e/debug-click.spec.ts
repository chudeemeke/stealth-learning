import { test } from '@playwright/test';

test('Debug click handler', async ({ page }) => {
  // Capture browser console
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    consoleMessages.push(msg.text());
  });

  // Quick login
  await page.goto('http://localhost:3000');
  await page.locator('button:has-text("I\'m a Kid")').click();
  await page.locator('button').filter({ hasText: /6-8/i }).click();
  await page.locator('input[placeholder*="name" i]').fill('TestPlayer');
  await page.locator('text="🦁"').first().click();
  await page.locator('button').filter({ hasText: /Let's Play/i }).click();
  await page.locator('button').filter({ hasText: /Start Playing|Begin Your Quest/i }).click();

  await page.waitForTimeout(1000);

  console.log('Clicking Mathematics PLAY button...');
  await page.locator('button:has-text("PLAY")').first().click();
  await page.waitForTimeout(1000);

  console.log('Console messages:', consoleMessages);
  console.log('Current URL:', page.url());
});