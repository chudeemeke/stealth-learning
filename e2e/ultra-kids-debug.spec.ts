import { test, expect } from '@playwright/test';

test.describe('Ultra Kids Debug', () => {
  test('check if ultra landing page loads', async ({ page }) => {
    // Enable console logging
    page.on('console', msg => console.log('Browser console:', msg.text()));
    page.on('pageerror', error => console.log('Page error:', error));

    // Navigate to the ultra landing page
    await page.goto('http://localhost:3000/ultra-landing');

    // Wait for the page to load
    await page.waitForTimeout(3000);

    // Check what's on the page
    const pageContent = await page.content();
    console.log('Page URL:', page.url());
    console.log('Page title:', await page.title());

    // Check if our ultra components are present
    const hasUltraBackground = pageContent.includes('UltraKidsBackground') ||
                               pageContent.includes('clouds') ||
                               pageContent.includes('Welcome to');

    console.log('Has ultra content:', hasUltraBackground);

    // Check for specific elements
    const welcomeText = await page.locator('text=Welcome to').isVisible();
    console.log('Welcome text visible:', welcomeText);

    const kidButton = await page.locator('text=I\'m a Kid').isVisible();
    console.log('Kid button visible:', kidButton);

    // Take a screenshot
    await page.screenshot({
      path: 'e2e/screenshots/ultra-debug.png',
      fullPage: true
    });

    console.log('Screenshot saved to e2e/screenshots/ultra-debug.png');
  });
});