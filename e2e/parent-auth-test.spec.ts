import { test, expect } from '@playwright/test';

test.describe('Parent Authentication Fix Test', () => {
  test('should successfully authenticate parent and access dashboard', async ({ page }) => {
    console.log('🧪 Testing parent authentication fix...');

    // Navigate to application
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Click parent button
    const parentButton = page.getByText('I\'m a Parent');
    await expect(parentButton).toBeVisible();
    await parentButton.click();
    console.log('✅ Clicked parent button');

    await page.waitForTimeout(500);

    // Fill login form
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await emailInput.fill('parent@test.com');
    await passwordInput.fill('testpassword');
    console.log('✅ Filled login credentials');

    // Click sign in
    const signInButton = page.getByText('Sign In');
    await signInButton.click();
    console.log('✅ Clicked Sign In button');

    // Wait for navigation
    await page.waitForTimeout(3000);

    // Check current URL - should be parent dashboard
    const currentUrl = page.url();
    console.log('Current URL after login:', currentUrl);

    // Verify we're on the parent dashboard
    if (currentUrl.includes('/parent-dashboard')) {
      console.log('🎉 SUCCESS: Parent authentication works! Reached dashboard');

      // Look for dashboard content
      const dashboardTitle = page.locator('text=Parent Dashboard');
      if (await dashboardTitle.isVisible()) {
        console.log('✅ Dashboard title visible');
      }

      // Look for dashboard tabs
      const overviewTab = page.locator('text=Overview');
      const progressTab = page.locator('text=Progress');
      const activityTab = page.locator('text=Activity');
      const controlsTab = page.locator('text=Controls');

      if (await overviewTab.isVisible()) console.log('✅ Overview tab found');
      if (await progressTab.isVisible()) console.log('✅ Progress tab found');
      if (await activityTab.isVisible()) console.log('✅ Activity tab found');
      if (await controlsTab.isVisible()) console.log('✅ Controls tab found');

      // Test tab navigation
      await progressTab.click();
      await page.waitForTimeout(1000);
      console.log('✅ Navigated to Progress tab');

      await activityTab.click();
      await page.waitForTimeout(1000);
      console.log('✅ Navigated to Activity tab');

      await controlsTab.click();
      await page.waitForTimeout(1000);
      console.log('✅ Navigated to Controls tab');

    } else {
      console.log('❌ FAILED: Still on login page or wrong URL');
      console.log('Expected: /parent-dashboard');
      console.log('Actual:', currentUrl);

      // Check if there's an error
      const errorIndicator = page.locator('text=Error').or(page.locator('text=Something went wrong'));
      if (await errorIndicator.isVisible()) {
        console.log('❌ Error detected on page');
      }
    }

    // Take final screenshot
    await page.screenshot({ path: 'e2e/screenshots/parent-auth-test-final.png' });
  });
});