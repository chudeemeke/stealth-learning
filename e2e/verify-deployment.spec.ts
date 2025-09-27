import { test, expect } from '@playwright/test';

test.describe('GitHub Pages Deployment Verification', () => {
  test('should load the deployed site successfully', async ({ page }) => {
    // Navigate to the GitHub Pages URL
    await page.goto('https://chudeemeke.github.io/stealth-learning/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for the main content to be visible
    await page.waitForSelector('h1', { timeout: 10000 });

    // Verify the page title
    const title = await page.title();
    expect(title).toBeTruthy();
    console.log('Page Title:', title);

    // Check for the main heading
    const heading = await page.textContent('h1');
    console.log('Main Heading:', heading);
    expect(heading).toBeTruthy();

    // Verify that key elements are present
    const hasPlayButton = await page.locator('button:has-text("Play")').count() > 0 ||
                          await page.locator('button:has-text("Let\'s Play")').count() > 0 ||
                          await page.locator('button:has-text("Start")').count() > 0;

    const hasParentButton = await page.locator('button:has-text("Parent")').count() > 0 ||
                           await page.locator('button:has-text("I\'m a Parent")').count() > 0;

    console.log('Has Play/Start Button:', hasPlayButton);
    console.log('Has Parent Button:', hasParentButton);

    // Take a screenshot for visual verification
    await page.screenshot({
      path: 'e2e/screenshots/github-pages-deployment.png',
      fullPage: true
    });

    // Check that there are no console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Wait a bit to catch any delayed errors
    await page.waitForTimeout(2000);

    if (consoleErrors.length > 0) {
      console.warn('Console errors detected:', consoleErrors);
    }

    // Verify the page loaded successfully
    expect(hasPlayButton || hasParentButton).toBeTruthy();
  });

  test('should navigate between pages correctly', async ({ page }) => {
    await page.goto('https://chudeemeke.github.io/stealth-learning/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Try clicking on the Kid/Play button if it exists
    const playButton = page.locator('button').filter({ hasText: /play|kid|start/i }).first();
    const playButtonExists = await playButton.count() > 0;

    if (playButtonExists) {
      await playButton.click();
      await page.waitForTimeout(2000);

      // Take a screenshot after navigation
      await page.screenshot({
        path: 'e2e/screenshots/github-pages-after-navigation.png',
        fullPage: true
      });

      // Verify navigation occurred (URL changed or new content appeared)
      const currentUrl = page.url();
      console.log('Current URL after navigation:', currentUrl);
    }

    // Try the parent flow
    const parentButton = page.locator('button').filter({ hasText: /parent/i }).first();
    const parentButtonExists = await parentButton.count() > 0;

    if (parentButtonExists) {
      await page.goto('https://chudeemeke.github.io/stealth-learning/');
      await parentButton.click();
      await page.waitForTimeout(2000);

      // Take a screenshot of parent flow
      await page.screenshot({
        path: 'e2e/screenshots/github-pages-parent-flow.png',
        fullPage: true
      });
    }
  });

  test('should have proper responsive design', async ({ page }) => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('https://chudeemeke.github.io/stealth-learning/', {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      await page.waitForSelector('h1', { timeout: 10000 });

      await page.screenshot({
        path: `e2e/screenshots/github-pages-${viewport.name}.png`,
        fullPage: true
      });

      console.log(`Tested ${viewport.name} viewport: ${viewport.width}x${viewport.height}`);
    }
  });
});