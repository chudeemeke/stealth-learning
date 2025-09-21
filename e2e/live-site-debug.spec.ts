import { test, expect } from '@playwright/test';

test('Debug live site landing page error', async ({ page }) => {
  // Navigate to the live site
  await page.goto('https://chudeemeke.github.io/stealth-learning');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Take a screenshot of initial state
  await page.screenshot({ path: 'e2e/debug-initial.png', fullPage: true });

  // Check for any console errors
  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Check for page errors
  const pageErrors: string[] = [];
  page.on('pageerror', err => {
    pageErrors.push(err.message);
  });

  // Try to interact with the site like in your screenshot
  // Look for name input or kid selection
  const nameInput = page.locator('input[type="text"]').first();
  if (await nameInput.isVisible()) {
    await nameInput.fill('TestKid');
    await page.screenshot({ path: 'e2e/debug-after-name.png', fullPage: true });
  }

  // Look for emoji selection or submit button
  const emojiButtons = page.locator('[role="button"]').filter({ hasText: /[😀😊🎮👦👧]/ });
  if (await emojiButtons.first().isVisible()) {
    await emojiButtons.first().click();
    await page.screenshot({ path: 'e2e/debug-after-emoji.png', fullPage: true });
  }

  // Look for any submit or continue button
  const submitButton = page.locator('button').filter({ hasText: /continue|start|submit|next/i });
  if (await submitButton.isVisible()) {
    await submitButton.click();
    await page.waitForTimeout(2000); // Wait for navigation/error
    await page.screenshot({ path: 'e2e/debug-after-submit.png', fullPage: true });
  }

  // Report any errors found
  if (consoleErrors.length > 0) {
    console.log('Console Errors:', consoleErrors);
  }

  if (pageErrors.length > 0) {
    console.log('Page Errors:', pageErrors);
  }

  // Check final page state
  const currentUrl = page.url();
  const pageTitle = await page.title();
  const hasErrorMessage = await page.locator('text=/error|fail|crash/i').count() > 0;

  console.log('Final URL:', currentUrl);
  console.log('Page Title:', pageTitle);
  console.log('Has Error Message:', hasErrorMessage);

  // This test is for debugging, so we don't fail it
  expect(true).toBe(true);
});