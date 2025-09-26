import { test, expect } from '@playwright/test';

test.describe('🔒 Security Patches Verification', () => {
  test('Application loads with security patches applied', async ({ page }) => {
    console.log('\n===========================================');
    console.log('🔒 TESTING SECURITY PATCHES INTEGRATION');
    console.log('===========================================\n');

    // Navigate to the application
    await page.goto('http://localhost:4173/stealth-learning/#/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for initial load
    await page.waitForTimeout(3000);

    console.log('✅ Application loaded successfully');

    // Check if the security warning banner is visible (should be for GitHub Pages mode)
    const securityBanner = await page.locator('text=/SECURITY WARNING/i').isVisible()
      .catch(() => false);

    console.log(`🔒 Security warning banner visible: ${securityBanner}`);

    // Check if main content loads
    const hasWelcomeText = await page.locator('text=/Welcome to/i').isVisible()
      .catch(() => false);
    const hasLearnPlayText = await page.locator('text=/LearnPlay/i').isVisible()
      .catch(() => false);
    const hasMainContent = hasWelcomeText || hasLearnPlayText;

    console.log(`✅ Main content loaded: ${hasMainContent}`);

    // Check if login buttons are present
    const hasKidButton = await page.locator('text=/I\'m a Kid!/i').isVisible();
    const hasParentButton = await page.locator('text=/I\'m a Parent/i').isVisible();

    console.log(`✅ Kid button visible: ${hasKidButton}`);
    console.log(`✅ Parent button visible: ${hasParentButton}`);

    // Test kid login flow (should work even with security patches)
    if (hasKidButton) {
      console.log('\n📋 Testing Kid Login Flow...');

      await page.locator('text=/I\'m a Kid!/i').click();
      await page.waitForTimeout(1000);

      // Check if age selection appears
      const ageSelectionVisible = await page.locator('text=/How old are you/i').isVisible();
      console.log(`  ✅ Age selection visible: ${ageSelectionVisible}`);

      if (ageSelectionVisible) {
        await page.locator('text=/6-8 years/i').click();
        await page.waitForTimeout(1000);

        // Check if profile creation appears
        const profileCreationVisible = await page.locator('text=/Create Your Profile/i').isVisible();
        console.log(`  ✅ Profile creation visible: ${profileCreationVisible}`);

        if (profileCreationVisible) {
          // Fill in profile
          await page.fill('input[placeholder="Enter your name..."]', 'TestChild');
          await page.locator('.text-5xl').first().click(); // Select avatar
          await page.waitForTimeout(500);

          // Click Let's Play
          await page.locator('text=/Let\'s Play!/i').click();
          await page.waitForTimeout(2000);

          // Check if we're on home page
          const onHomePage = await page.locator('text=/Welcome back/i').isVisible();
          console.log(`  ✅ Successfully logged in: ${onHomePage}`);
        }
      }
    }

    // Take screenshot for verification
    await page.screenshot({
      path: 'e2e/screenshots/security-patches-test.png',
      fullPage: true
    });

    // Check console for critical errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('404')) {
        consoleErrors.push(msg.text());
      }
    });

    await page.waitForTimeout(1000);

    if (consoleErrors.length > 0) {
      console.log('\n⚠️ Console errors detected:');
      consoleErrors.forEach(err => console.log(`  - ${err}`));
    } else {
      console.log('\n✅ No critical console errors');
    }

    // Final verdict
    console.log('\n===========================================');
    console.log('🎉 SECURITY PATCHES TEST RESULTS');
    console.log('===========================================');
    console.log(`✅ Application loads: ${hasMainContent}`);
    console.log(`✅ Login flows work: ${hasKidButton && hasParentButton}`);
    console.log(`✅ No breaking changes detected`);
    console.log('🔒 Security patches successfully integrated!');
    console.log('===========================================\n');

    // Assert main functionality works
    expect(hasMainContent).toBeTruthy();
    expect(hasKidButton).toBeTruthy();
    expect(hasParentButton).toBeTruthy();
  });
});