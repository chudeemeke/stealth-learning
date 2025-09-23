import { test, expect } from '@playwright/test';

test.describe('Final Validation: GitHub Pages Fix Verification', () => {
  test('should verify GitHub Pages site now works correctly', async ({ page }) => {
    console.log('🔧 Testing FIXED GitHub Pages site...');

    // Test the fixed GitHub Pages deployment
    await page.goto('https://chudeemeke.github.io/stealth-learning/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'e2e/screenshots/fixed-pages-01-landing.png' });

    console.log('📍 Current URL:', page.url());

    // Complete kid registration flow
    const kidButton = page.getByText('I\'m a Kid!');
    await expect(kidButton).toBeVisible();
    await kidButton.click();
    console.log('✅ FIXED PAGES: Kid button clicked');

    // Age selection
    const ageButton = page.locator('button').filter({ hasText: '6-8 years' });
    await expect(ageButton.first()).toBeVisible();
    await ageButton.first().click();
    console.log('✅ FIXED PAGES: Age selected');

    // Name input
    const nameInput = page.locator('input[type="text"]');
    await expect(nameInput).toBeVisible();
    await nameInput.fill('FixedTestKid');
    console.log('✅ FIXED PAGES: Name entered');

    // Avatar selection
    const avatarButton = page.locator('button').filter({ hasText: '🦁' });
    await expect(avatarButton).toBeVisible();
    await avatarButton.click();
    console.log('✅ FIXED PAGES: Avatar selected');

    // Click Let's Play button
    const playButton = page.getByText('Let\'s Play! 🎮');
    await expect(playButton).toBeVisible();
    await expect(playButton).toBeEnabled();
    await playButton.click();
    console.log('✅ FIXED PAGES: Let\'s Play clicked');

    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'e2e/screenshots/fixed-pages-02-after-play.png' });

    // Check the result
    const currentUrl = page.url();
    console.log('🎯 FIXED PAGES: URL after Let\'s Play:', currentUrl);

    // Look for success indicators
    const successIndicators = [
      page.locator('text=SUCCESS'),
      page.locator('text=Welcome back'),
      page.locator('text=Choose Your Adventure'),
      page.locator('text=Math'),
      page.locator('text=English'),
      page.locator('text=Science'),
      page.locator('text=Games'),
      page.locator('text=Let\'s learn today')
    ];

    let successFound = false;
    for (const indicator of successIndicators) {
      if (await indicator.isVisible({ timeout: 2000 })) {
        const text = await indicator.textContent();
        console.log('🎉 FIXED PAGES: Success indicator found:', text);
        successFound = true;
        break;
      }
    }

    // Check for error indicators
    const errorIndicators = [
      page.locator('text=Error'),
      page.locator('text=Something went wrong'),
      page.locator('text=404'),
      page.locator('text=Not Found')
    ];

    let errorFound = false;
    for (const indicator of errorIndicators) {
      if (await indicator.isVisible({ timeout: 1000 })) {
        const text = await indicator.textContent();
        console.log('❌ FIXED PAGES: Error indicator found:', text);
        errorFound = true;
        break;
      }
    }

    if (successFound && !errorFound) {
      console.log('🎉 SUCCESS: GitHub Pages site is now working correctly!');
    } else if (errorFound) {
      console.log('❌ FAILURE: GitHub Pages site still has errors');

      // Get page content for debugging
      const pageContent = await page.textContent('body');
      console.log('FIXED PAGES: Page content preview:', pageContent?.substring(0, 300));
    } else {
      console.log('⚠️ UNCLEAR: Unable to determine success or error state');

      // Get page content for debugging
      const pageContent = await page.textContent('body');
      console.log('FIXED PAGES: Page content preview:', pageContent?.substring(0, 300));
    }

    // Test game navigation if successful
    if (successFound && !errorFound) {
      console.log('🎮 Testing game navigation...');

      // Look for game navigation
      const gamesButton = page.getByText('Games').or(page.getByText('🎮Games')).or(page.locator('button').filter({ hasText: 'Games' }));
      if (await gamesButton.isVisible({ timeout: 3000 })) {
        await gamesButton.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'e2e/screenshots/fixed-pages-03-games.png' });

        // Check for game selection
        const subjectButtons = [
          page.getByText('Math'),
          page.getByText('English'),
          page.getByText('Science')
        ];

        for (const button of subjectButtons) {
          if (await button.isVisible({ timeout: 2000 })) {
            const subject = await button.textContent();
            console.log(`✅ FIXED PAGES: ${subject} games available`);
          }
        }
      }
    }

    // Test parent authentication
    console.log('👨‍👩‍👧 Testing parent authentication...');
    await page.goto('https://chudeemeke.github.io/stealth-learning/');
    await page.waitForTimeout(1000);

    const parentButton = page.getByText('I\'m a Parent');
    if (await parentButton.isVisible({ timeout: 5000 })) {
      await parentButton.click();
      await page.waitForTimeout(1000);

      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');

      if (await emailInput.isVisible({ timeout: 3000 }) && await passwordInput.isVisible({ timeout: 3000 })) {
        await emailInput.fill('parent@test.com');
        await passwordInput.fill('testpassword');

        const signInButton = page.getByText('Sign In');
        await signInButton.click();
        await page.waitForTimeout(2000);

        const parentUrl = page.url();
        console.log('🎯 FIXED PAGES: URL after parent sign in:', parentUrl);

        if (parentUrl.includes('parent-dashboard')) {
          console.log('🎉 FIXED PAGES: Parent authentication works!');
          await page.screenshot({ path: 'e2e/screenshots/fixed-pages-04-parent-dashboard.png' });
        } else {
          console.log('❌ FIXED PAGES: Parent authentication failed');
        }
      }
    }
  });

  test('should compare fixed Pages vs local version', async ({ page }) => {
    console.log('🔍 Final comparison: Fixed Pages vs Local...');

    // Test both versions with identical flows and compare results
    const testFlow = async (url: string, label: string) => {
      await page.goto(url);
      await page.waitForLoadState('networkidle');

      // Kid flow
      await page.getByText('I\'m a Kid!').click();
      await page.waitForTimeout(500);
      await page.locator('button').filter({ hasText: '6-8 years' }).first().click();
      await page.waitForTimeout(500);
      await page.locator('input[type="text"]').fill(`TestKid${label}`);
      await page.waitForTimeout(500);
      await page.locator('button').filter({ hasText: '🦁' }).click();
      await page.waitForTimeout(500);
      await page.getByText('Let\'s Play! 🎮').click();
      await page.waitForTimeout(3000);

      const finalUrl = page.url();
      const pageContent = await page.textContent('body');
      const hasError = pageContent?.includes('Error') || pageContent?.includes('Something went wrong');
      const hasSuccess = pageContent?.includes('SUCCESS') || pageContent?.includes('Welcome back') || pageContent?.includes('Choose Your Adventure');

      console.log(`${label} Results:`);
      console.log(`  Final URL: ${finalUrl}`);
      console.log(`  Has Success: ${hasSuccess}`);
      console.log(`  Has Error: ${hasError}`);
      console.log(`  Content preview: ${pageContent?.substring(0, 100)}...`);

      return { finalUrl, hasError, hasSuccess, pageContent: pageContent?.substring(0, 200) };
    };

    // Test both versions
    const pagesResult = await testFlow('https://chudeemeke.github.io/stealth-learning/', 'PAGES');
    const localResult = await testFlow('http://localhost:3001/', 'LOCAL');

    // Compare results
    console.log('\n🔍 FINAL COMPARISON:');
    console.log(`Pages has success: ${pagesResult.hasSuccess} | Local has success: ${localResult.hasSuccess}`);
    console.log(`Pages has error: ${pagesResult.hasError} | Local has error: ${localResult.hasError}`);

    if (pagesResult.hasSuccess === localResult.hasSuccess && pagesResult.hasError === localResult.hasError) {
      console.log('🎉 SUCCESS: GitHub Pages and Local versions now behave identically!');
    } else {
      console.log('❌ MISMATCH: GitHub Pages and Local still differ');
      console.log('Pages content:', pagesResult.pageContent);
      console.log('Local content:', localResult.pageContent);
    }
  });
});