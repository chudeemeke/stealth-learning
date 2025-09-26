import { test, expect } from '@playwright/test';

test.describe('Test Start Playing Button Fix', () => {
  test('Verify Start Playing button navigates to games', async ({ page }) => {
    console.log('🔍 Testing Start Playing button fix...\n');

    // First, we need to login as a child
    console.log('📋 Step 1: Login as child');
    console.log('========================');

    await page.goto('http://localhost:4173/stealth-learning/#/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Click "I'm a Kid!"
    await page.locator('text=/I\'m a Kid!/i').click();
    await page.waitForTimeout(1000);

    // Select age
    await page.locator('text=/6-8 years/i').click();
    await page.waitForTimeout(1000);

    // Enter name
    await page.fill('input[placeholder="Enter your name..."]', 'TestKid');

    // Select avatar (first one)
    await page.locator('.text-5xl').first().click();
    await page.waitForTimeout(500);

    // Click "Let's Play!"
    await page.locator('text=/Let\'s Play!/i').click();
    console.log('✅ Child login completed');

    // Wait for navigation to home page
    await page.waitForTimeout(2000);

    // Take screenshot of home page
    await page.screenshot({
      path: 'e2e/screenshots/home-page-with-button.png',
      fullPage: true
    });

    console.log('\n📋 Step 2: Test Start Playing Button');
    console.log('====================================');

    // Check if we're on the home page
    const hasWelcome = await page.locator('text=/Welcome back/i').isVisible();
    console.log(`  - Welcome message visible: ${hasWelcome}`);

    // Look for the button (text varies by age group)
    const playButton = page.locator('button').filter({
      hasText: /Start Playing|Begin Your Quest|Start Learning/i
    }).first();

    const buttonVisible = await playButton.isVisible();
    console.log(`  - Play button visible: ${buttonVisible}`);

    if (buttonVisible) {
      // Get current URL
      const urlBefore = page.url();
      console.log(`  - URL before click: ${urlBefore}`);

      // Click the button
      await playButton.click();
      console.log('  - Clicked play button');

      // Wait for navigation
      await page.waitForTimeout(2000);

      // Get new URL
      const urlAfter = page.url();
      console.log(`  - URL after click: ${urlAfter}`);

      // Take screenshot of games page
      await page.screenshot({
        path: 'e2e/screenshots/games-page-after-button-click.png',
        fullPage: true
      });

      // Verify we navigated to games
      const navigatedToGames = urlAfter.includes('#/games');
      console.log(`  - Navigated to games: ${navigatedToGames}`);

      // Check for games page content
      const hasGamesContent = await page.locator('text=/Select a Game|Choose.*Game|Game.*Select/i').isVisible().catch(() => false);
      console.log(`  - Games page content visible: ${hasGamesContent}`);

      // Final verdict
      console.log('\n' + '='.repeat(50));
      console.log('🎯 BUTTON FIX TEST RESULTS:');
      console.log('='.repeat(50));

      if (navigatedToGames) {
        console.log('✅ Start Playing button WORKS!');
        console.log('✅ Successfully navigates to games page');
      } else {
        console.log('❌ Button still not working');
        console.log('   Current URL:', urlAfter);
      }

      expect(navigatedToGames).toBeTruthy();
    } else {
      console.log('❌ ERROR: Play button not found on home page');
      expect(buttonVisible).toBeTruthy();
    }
  });
});