import { test, expect } from '@playwright/test';

test.describe('Debug Kid Flow - Console Error Capture', () => {

  test('Capture exact error during kid flow', async ({ page }) => {
    console.log('🔍 Debug test: Capturing kid flow errors...');

    // Capture all console messages
    const consoleMessages: string[] = [];
    const pageErrors: string[] = [];

    page.on('console', (msg) => {
      const message = `[${msg.type().toUpperCase()}] ${msg.text()}`;
      consoleMessages.push(message);
      console.log('🎯 Console:', message);
    });

    page.on('pageerror', (error) => {
      const errorMsg = `Page Error: ${error.message}\nStack: ${error.stack}`;
      pageErrors.push(errorMsg);
      console.log('💥 Page Error:', errorMsg);
    });

    // Set longer timeout
    test.setTimeout(60000);

    try {
      // Navigate to application
      console.log('📍 Step 1: Navigating to app...');
      await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      // Check initial page state
      console.log('📍 Step 2: Checking initial page...');
      const initialContent = await page.locator('body').textContent();
      console.log('Initial page content preview:', initialContent?.substring(0, 200));

      // Click "I'm a Kid!"
      console.log('📍 Step 3: Clicking "I\'m a Kid!"...');
      await page.click('text="I\'m a Kid!"');
      await page.waitForTimeout(2000);

      // Check page after kid selection
      console.log('📍 Step 4: Checking after kid selection...');
      const afterKidContent = await page.locator('body').textContent();
      console.log('After kid selection preview:', afterKidContent?.substring(0, 200));

      // Click "6-8 years"
      console.log('📍 Step 5: Clicking "6-8 years"...');
      await page.click('text=6-8 years');
      await page.waitForTimeout(2000);

      // Check page after age selection
      console.log('📍 Step 6: Checking after age selection...');
      const afterAgeContent = await page.locator('body').textContent();
      console.log('After age selection preview:', afterAgeContent?.substring(0, 200));

      // Fill in name
      console.log('📍 Step 7: Filling name...');
      await page.fill('input[placeholder="Enter your name..."]', 'Debug Kid');
      await page.waitForTimeout(1000);

      // Select first avatar
      console.log('📍 Step 8: Selecting avatar...');
      await page.click('.grid.grid-cols-4 button:first-child');
      await page.waitForTimeout(1000);

      // Click "Let's Play!" - THIS IS WHERE THE ERROR OCCURS
      console.log('📍 Step 9: Clicking "Let\'s Play!" (critical step)...');
      await page.click('text="Let\'s Play!"');

      // Wait and monitor for errors
      console.log('📍 Step 10: Waiting for navigation/error...');
      await page.waitForTimeout(5000);

      // Check final state
      const currentUrl = page.url();
      const finalContent = await page.locator('body').textContent();

      console.log('🎯 Final URL:', currentUrl);
      console.log('🎯 Final content preview:', finalContent?.substring(0, 300));

      // Check for error indicators
      const hasErrorText = await page.locator('text=Error').isVisible().catch(() => false);
      const hasOopsText = await page.locator('text=Oops').isVisible().catch(() => false);
      const hasErrorBoundary = await page.locator('text=Something went wrong').isVisible().catch(() => false);

      console.log('🎯 Error indicators:');
      console.log('  - Error text visible:', hasErrorText);
      console.log('  - Oops text visible:', hasOopsText);
      console.log('  - Error boundary visible:', hasErrorBoundary);

      // Log all captured errors
      console.log('\n📋 CAPTURED CONSOLE MESSAGES:');
      consoleMessages.forEach((msg, i) => {
        console.log(`  ${i + 1}. ${msg}`);
      });

      console.log('\n💥 CAPTURED PAGE ERRORS:');
      pageErrors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error}`);
      });

      // Take a final screenshot
      await page.screenshot({ path: 'e2e/screenshots/debug-final-state.png' });

      if (hasErrorText || hasOopsText || hasErrorBoundary) {
        console.log('❌ Kid flow leads to error page - captured debugging info above');
      } else {
        console.log('✅ Kid flow completed without visible errors');
      }

    } catch (error) {
      console.log('💥 Test error:', error);
      await page.screenshot({ path: 'e2e/screenshots/debug-test-error.png' });

      // Still log captured messages even if test fails
      console.log('\n📋 CAPTURED CONSOLE MESSAGES (during error):');
      consoleMessages.forEach((msg, i) => {
        console.log(`  ${i + 1}. ${msg}`);
      });

      console.log('\n💥 CAPTURED PAGE ERRORS (during error):');
      pageErrors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error}`);
      });

      throw error;
    }
  });
});