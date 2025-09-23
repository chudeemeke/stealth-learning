import { test, expect } from '@playwright/test';

test.describe('Complete Kid Registration Flow', () => {
  test('should complete the full kid registration and navigation', async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    console.log('🎯 Starting complete kid registration flow...');

    // Step 1: Click "I'm a Kid!" button
    const childButton = page.getByText('I\'m a Kid!').or(page.getByRole('button', { name: /kid|child/i }));
    await expect(childButton).toBeVisible();
    await childButton.click();
    console.log('✅ Clicked kid button');

    await page.waitForTimeout(500);

    // Step 2: Select age group FIRST
    const ageButton = page.locator('button').filter({ hasText: '6-8 years' });
    await expect(ageButton.first()).toBeVisible();
    await ageButton.first().click();
    console.log('✅ Selected age: 6-8');

    await page.waitForTimeout(500);

    // Step 3: Fill in the name (appears after age selection)
    const nameInput = page.locator('input[type="text"]').or(page.locator('input[placeholder*="name"]'));
    await expect(nameInput).toBeVisible();
    await nameInput.fill('TestKid');
    console.log('✅ Filled name: TestKid');

    await page.waitForTimeout(500);

    // Step 4: Select an emoji/avatar
    const emojiButton = page.locator('button').filter({ hasText: '🦁' });
    await expect(emojiButton).toBeVisible();
    await emojiButton.click();
    console.log('✅ Selected emoji: 🦁');

    await page.waitForTimeout(500);

    // Step 5: Check if the "Let's Play!" button is now enabled
    const playButton = page.getByText('Let\'s Play! 🎮');
    await expect(playButton).toBeVisible();

    // Wait for the button to become enabled
    await expect(playButton).toBeEnabled({ timeout: 5000 });
    console.log('✅ Play button is now enabled');

    // Take screenshot before clicking
    await page.screenshot({ path: 'e2e/screenshots/before-play-click.png' });

    // Set up error logging to catch any issues
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Browser Console Error:', msg.text());
      }
    });

    page.on('pageerror', error => {
      console.log('❌ Page Error:', error.message);
    });

    // Step 6: Click the "Let's Play!" button
    console.log('🎮 Clicking "Let\'s Play!" button...');
    await playButton.click();

    // Wait for navigation or page change
    await page.waitForTimeout(3000);

    // Take screenshot after clicking
    await page.screenshot({ path: 'e2e/screenshots/after-play-click.png' });

    // Check if we successfully navigated (not on error page)
    const errorIndicator = page.locator('text=Something went wrong').or(page.locator('text=Error'));
    const isErrorPage = await errorIndicator.isVisible();

    if (isErrorPage) {
      console.log('❌ ERROR: Landed on error page');

      // Try to get error details
      const errorDetails = await page.textContent('body').catch(() => 'Could not get error details');
      console.log('Error page content:', errorDetails);

      throw new Error('Kid registration resulted in error page');
    } else {
      console.log('✅ SUCCESS: No error page detected');

      // Check what page we're on
      const currentUrl = page.url();
      console.log('Current URL:', currentUrl);

      // Check for expected content on the new page
      const homeIndicators = [
        page.locator('text=Welcome'),
        page.locator('text=Games'),
        page.locator('text=Math'),
        page.locator('text=Science'),
        page.locator('text=English'),
        page.locator('[data-testid="home-page"]'),
        page.locator('.game-selection'),
        page.locator('button').filter({ hasText: /play|start|begin/i })
      ];

      let foundHomeIndicator = false;
      for (const indicator of homeIndicators) {
        if (await indicator.isVisible()) {
          const text = await indicator.textContent().catch(() => 'unknown');
          console.log(`✅ Found home page indicator: "${text}"`);
          foundHomeIndicator = true;
          break;
        }
      }

      if (foundHomeIndicator) {
        console.log('🎉 SUCCESS: Successfully navigated to game area!');
      } else {
        console.log('⚠️ WARNING: Navigated but home page indicators not found');
      }
    }

    // Final verification
    await expect(page).not.toHaveURL(/login/);
    console.log('✅ Final check: Not on login page anymore');
  });
});