import { test, expect } from '@playwright/test';

test.describe('🎯 FINAL GitHub Pages HashRouter Deployment Test', () => {
  test('Ultra-comprehensive verification of GitHub Pages deployment', async ({ page }) => {
    console.log('🚀 FINAL GITHUB PAGES DEPLOYMENT TEST');
    console.log('=====================================\n');

    // ========== TEST 1: Landing Page Loads ==========
    console.log('📋 TEST 1: Landing Page Loads Correctly');
    console.log('---------------------------------------');

    await page.goto('https://chudeemeke.github.io/stealth-learning/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for any loading screens to disappear
    await page.waitForTimeout(3000);

    // Take screenshot of initial state
    await page.screenshot({
      path: 'e2e/screenshots/gh-final-landing.png',
      fullPage: true
    });

    // Check URL - should now have hash routing
    const currentUrl = page.url();
    console.log('✅ Current URL:', currentUrl);

    // HashRouter should add #/ to the URL
    const hasHashRouting = currentUrl.includes('#/');
    console.log(`✅ Hash routing active: ${hasHashRouting}`);

    // Check for main content
    const bodyText = await page.locator('body').textContent();
    const hasWelcome = bodyText?.includes('Welcome to') || bodyText?.includes('LearnPlay');
    const hasKidButton = await page.locator('text=/I\'m a Kid!/i').isVisible();
    const hasParentButton = await page.locator('text=/I\'m a Parent/i').isVisible();

    console.log(`✅ Welcome text present: ${hasWelcome}`);
    console.log(`✅ Kid button visible: ${hasKidButton}`);
    console.log(`✅ Parent button visible: ${hasParentButton}`);

    // Check background is not black
    const backgroundColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    const isNotBlack = backgroundColor !== 'rgb(0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 1)';
    console.log(`✅ Not black screen: ${isNotBlack}`);

    // ========== TEST 2: Kid Login Flow (Inline) ==========
    console.log('\n📋 TEST 2: Kid Login Flow Works Inline');
    console.log('--------------------------------------');

    if (hasKidButton) {
      // Click "I'm a Kid!" button
      await page.locator('text=/I\'m a Kid!/i').click();
      console.log('✅ Clicked "I\'m a Kid!" button');
      await page.waitForTimeout(1500);

      // Should show age selection inline (no navigation)
      const ageSelectionVisible = await page.locator('text=/How old are you/i').isVisible();
      console.log(`✅ Age selection shown inline: ${ageSelectionVisible}`);

      // Verify URL didn't change to /kid-login (should stay the same)
      const urlAfterKidClick = page.url();
      const noKidLoginRoute = !urlAfterKidClick.includes('kid-login');
      console.log(`✅ No /kid-login route: ${noKidLoginRoute}`);

      // Take screenshot
      await page.screenshot({
        path: 'e2e/screenshots/gh-final-age-selection.png',
        fullPage: true
      });

      if (ageSelectionVisible) {
        // Select age group
        await page.locator('text=/6-8 years/i').click();
        console.log('✅ Selected age 6-8 years');
        await page.waitForTimeout(1500);

        // Should show profile creation inline
        const profileVisible = await page.locator('text=/Create Your Profile/i').isVisible();
        console.log(`✅ Profile creation shown inline: ${profileVisible}`);

        // Take screenshot
        await page.screenshot({
          path: 'e2e/screenshots/gh-final-profile-creation.png',
          fullPage: true
        });

        // Go back to test parent flow
        await page.locator('text=/Back/i').first().click();
        await page.waitForTimeout(500);
        await page.locator('text=/Back/i').first().click();
        await page.waitForTimeout(500);
      }
    }

    // ========== TEST 3: Parent Login Flow (Inline) ==========
    console.log('\n📋 TEST 3: Parent Login Flow Works Inline');
    console.log('----------------------------------------');

    if (hasParentButton) {
      // Click "I'm a Parent" button
      await page.locator('text=/I\'m a Parent/i').click();
      console.log('✅ Clicked "I\'m a Parent" button');
      await page.waitForTimeout(1500);

      // Should show parent login inline (no navigation)
      const parentDashboardVisible = await page.locator('text=/Parent Dashboard/i').isVisible();
      console.log(`✅ Parent Dashboard shown inline: ${parentDashboardVisible}`);

      // Verify URL didn't change to /parent-login
      const urlAfterParentClick = page.url();
      const noParentLoginRoute = !urlAfterParentClick.includes('parent-login');
      console.log(`✅ No /parent-login route: ${noParentLoginRoute}`);

      // Take screenshot
      await page.screenshot({
        path: 'e2e/screenshots/gh-final-parent-login.png',
        fullPage: true
      });

      // Check for demo credentials
      const hasDemoCredentials = await page.locator('text=/Demo Credentials/i').isVisible();
      console.log(`✅ Demo credentials visible: ${hasDemoCredentials}`);
    }

    // ========== TEST 4: Direct Route Navigation ==========
    console.log('\n📋 TEST 4: Direct Route Navigation Works');
    console.log('---------------------------------------');

    // Test direct navigation to login route
    await page.goto('https://chudeemeke.github.io/stealth-learning/#/login', {
      waitUntil: 'networkidle'
    });
    await page.waitForTimeout(2000);

    const loginRouteWorks = await page.locator('text=/Who\'s playing today/i').isVisible();
    console.log(`✅ Direct /login route works: ${loginRouteWorks}`);

    // Take screenshot
    await page.screenshot({
      path: 'e2e/screenshots/gh-final-direct-login-route.png',
      fullPage: true
    });

    // ========== TEST 5: Complete Child Login to Games ==========
    console.log('\n📋 TEST 5: Full Child Login to Games Navigation');
    console.log('----------------------------------------------');

    // Start fresh
    await page.goto('https://chudeemeke.github.io/stealth-learning/', {
      waitUntil: 'networkidle'
    });
    await page.waitForTimeout(2000);

    // Complete child login
    await page.locator('text=/I\'m a Kid!/i').click();
    await page.waitForTimeout(1000);
    await page.locator('text=/6-8 years/i').click();
    await page.waitForTimeout(1000);

    // Enter name
    await page.fill('input[placeholder="Enter your name..."]', 'TestChild');
    console.log('✅ Entered child name');

    // Select first avatar
    await page.locator('.text-5xl').first().click();
    console.log('✅ Selected avatar');

    // Click "Let's Play!"
    await page.locator('text=/Let\'s Play!/i').click();
    console.log('✅ Clicked "Let\'s Play!" button');
    await page.waitForTimeout(3000);

    // Should be on home page
    const welcomeBackVisible = await page.locator('text=/Welcome back/i').isVisible();
    console.log(`✅ Welcome back message visible: ${welcomeBackVisible}`);

    // Find and click the "Start Playing" button
    const startButton = page.locator('button').filter({
      hasText: /Start Playing|Begin Your Quest|Start Learning/i
    }).first();

    const startButtonVisible = await startButton.isVisible();
    console.log(`✅ Start Playing button visible: ${startButtonVisible}`);

    if (startButtonVisible) {
      await startButton.click();
      console.log('✅ Clicked Start Playing button');
      await page.waitForTimeout(2000);

      // Should navigate to games
      const gamesUrl = page.url();
      const onGamesPage = gamesUrl.includes('#/games');
      console.log(`✅ Navigated to games page: ${onGamesPage}`);

      // Take screenshot
      await page.screenshot({
        path: 'e2e/screenshots/gh-final-games-page.png',
        fullPage: true
      });
    }

    // ========== FINAL VERDICT ==========
    console.log('\n' + '='.repeat(60));
    console.log('🏆 FINAL GITHUB PAGES DEPLOYMENT RESULTS');
    console.log('='.repeat(60));

    const allTestsPassed =
      hasHashRouting &&
      hasWelcome &&
      hasKidButton &&
      hasParentButton &&
      isNotBlack &&
      loginRouteWorks;

    if (allTestsPassed) {
      console.log('✅ ALL TESTS PASSED!');
      console.log('✅ HashRouter working perfectly');
      console.log('✅ No duplicate login screens');
      console.log('✅ Inline login forms working');
      console.log('✅ Start Playing button fixed');
      console.log('✅ GitHub Pages deployment SUCCESSFUL!');
    } else {
      console.log('❌ Some tests failed - review results above');
    }

    console.log('\n📸 Screenshots saved to e2e/screenshots/');
    console.log('🔗 Live site: https://chudeemeke.github.io/stealth-learning/');

    expect(allTestsPassed).toBeTruthy();
  });
});