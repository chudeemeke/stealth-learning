import { test } from '@playwright/test';

test('capture ultra-engaging UI', async ({ page }) => {
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  await page.screenshot({
    path: 'e2e/screenshots/ULTRA-FINAL-landing.png',
    fullPage: true
  });

  console.log('✨ Ultra-engaging UI captured! Check e2e/screenshots/ULTRA-FINAL-landing.png');
});