import { test } from '@playwright/test';

test.describe('Compare GitHub Pages vs Local Deployment', () => {
  test('Visual comparison of both deployments', async ({ page }) => {
    // Test 1: GitHub Pages Version
    console.log('📸 Capturing GitHub Pages version...');
    await page.goto('https://chudeemeke.github.io/stealth-learning/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for page to fully load
    await page.waitForTimeout(3000);

    // Capture GitHub Pages screenshot
    await page.screenshot({
      path: 'e2e/screenshots/comparison-github-pages.png',
      fullPage: true
    });

    // Check for any error messages or issues
    const githubErrors = await page.locator('.error, [class*="error"]').count();
    const githubTitle = await page.title();
    const githubContent = await page.locator('body').textContent();

    console.log('GitHub Pages Title:', githubTitle);
    console.log('GitHub Pages has errors:', githubErrors > 0);
    console.log('GitHub Pages content preview:', githubContent?.substring(0, 200));

    // Test parent login on GitHub Pages
    const githubParentButton = await page.locator('text=/parent/i').first();
    if (await githubParentButton.isVisible()) {
      await githubParentButton.click();
      await page.waitForTimeout(2000);
      await page.screenshot({
        path: 'e2e/screenshots/comparison-github-pages-parent.png',
        fullPage: true
      });
    }

    // Test 2: Local Development Version
    console.log('📸 Capturing Local Dev version...');
    await page.goto('http://localhost:3000/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for page to fully load
    await page.waitForTimeout(3000);

    // Capture Local screenshot
    await page.screenshot({
      path: 'e2e/screenshots/comparison-local-dev.png',
      fullPage: true
    });

    // Check local version
    const localErrors = await page.locator('.error, [class*="error"]').count();
    const localTitle = await page.title();
    const localContent = await page.locator('body').textContent();

    console.log('Local Dev Title:', localTitle);
    console.log('Local Dev has errors:', localErrors > 0);
    console.log('Local Dev content preview:', localContent?.substring(0, 200));

    // Test parent login on Local
    const localParentButton = await page.locator('text=/parent/i').first();
    if (await localParentButton.isVisible()) {
      await localParentButton.click();
      await page.waitForTimeout(2000);
      await page.screenshot({
        path: 'e2e/screenshots/comparison-local-dev-parent.png',
        fullPage: true
      });
    }

    // Compare results
    console.log('\n🔍 COMPARISON RESULTS:');
    console.log('=======================');
    console.log('Titles match:', githubTitle === localTitle);
    console.log('Error count match:', githubErrors === localErrors);
    console.log('Content length difference:', Math.abs((githubContent?.length || 0) - (localContent?.length || 0)));

    // Test authentication on both
    console.log('\n🔐 Testing Authentication...');

    // Test GitHub Pages authentication
    await page.goto('https://chudeemeke.github.io/stealth-learning/');
    await page.waitForTimeout(2000);
    const githubHasParent = await page.locator('text=/parent/i').first().isVisible();

    if (githubHasParent) {
      await page.locator('text=/parent/i').first().click();
      await page.waitForTimeout(2000);

      // Try to login with invalid credentials
      if (await page.locator('input[type="email"]').isVisible()) {
        await page.fill('input[type="email"]', 'test@test.com');
        await page.fill('input[type="password"]', 'testpassword');
        await page.locator('button[type="submit"]').click();
        await page.waitForTimeout(2000);

        // Check if we got past login (should NOT happen)
        const githubDashboardVisible = await page.locator('text=/dashboard/i').isVisible();
        console.log('GitHub Pages - Unauthorized access allowed:', githubDashboardVisible);
      }
    }

    // Test Local authentication
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(2000);
    const localHasParent = await page.locator('text=/parent/i').first().isVisible();

    if (localHasParent) {
      await page.locator('text=/parent/i').first().click();
      await page.waitForTimeout(2000);

      // Try to login with invalid credentials
      if (await page.locator('input[type="email"]').isVisible()) {
        await page.fill('input[type="email"]', 'test@test.com');
        await page.fill('input[type="password"]', 'testpassword');
        await page.locator('button[type="submit"]').click();
        await page.waitForTimeout(2000);

        // Check if we got past login (should NOT happen)
        const localDashboardVisible = await page.locator('text=/dashboard/i').isVisible();
        console.log('Local Dev - Unauthorized access allowed:', localDashboardVisible);
      }
    }

    console.log('\n📊 Screenshots saved to e2e/screenshots/');
    console.log('Please review the screenshots to see the differences.');
  });
});