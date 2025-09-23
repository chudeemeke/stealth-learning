import { test, expect } from '@playwright/test';

test.describe('EMERGENCY: Kid Flow Testing - All Permutations', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('Kid Flow: 3-5 years old', async ({ page }) => {
    console.log('🧒 Testing 3-5 years kid flow...');

    // Click "I'm a Kid!"
    await page.click('text=I\'m a Kid!');
    await page.waitForSelector('text=How old are you?', { timeout: 10000 });

    // Select 3-5 years
    await page.click('text=3-5 years');
    await page.waitForSelector('text=Create Your Profile!', { timeout: 10000 });

    // Fill name
    await page.fill('input[placeholder="Enter your name..."]', 'Test Kid 3-5');

    // Select avatar (first one)
    await page.click('.grid.grid-cols-4 button:first-child');

    // Click Let's Play
    await page.click('text=Let\'s Play!');

    // Should navigate to homepage successfully
    await expect(page.locator('text=Welcome to Stealth Learning')).toBeVisible({ timeout: 15000 });

    await page.screenshot({ path: 'e2e/screenshots/kid-3-5-success.png' });
    console.log('✅ 3-5 years flow working!');
  });

  test('Kid Flow: 6-8 years old', async ({ page }) => {
    console.log('🧒 Testing 6-8 years kid flow...');

    // Click "I'm a Kid!"
    await page.click('text=I\'m a Kid!');
    await page.waitForSelector('text=How old are you?', { timeout: 10000 });

    // Select 6-8 years
    await page.click('text=6-8 years');
    await page.waitForSelector('text=Create Your Profile!', { timeout: 10000 });

    // Fill name
    await page.fill('input[placeholder="Enter your name..."]', 'Test Kid 6-8');

    // Select avatar (second one)
    await page.click('.grid.grid-cols-4 button:nth-child(2)');

    // Click Let's Play
    await page.click('text=Let\'s Play!');

    // Should navigate to homepage successfully
    await expect(page.locator('text=Welcome to Stealth Learning')).toBeVisible({ timeout: 15000 });

    await page.screenshot({ path: 'e2e/screenshots/kid-6-8-success.png' });
    console.log('✅ 6-8 years flow working!');
  });

  test('Kid Flow: 9+ years old', async ({ page }) => {
    console.log('🧒 Testing 9+ years kid flow...');

    // Click "I'm a Kid!"
    await page.click('text=I\'m a Kid!');
    await page.waitForSelector('text=How old are you?', { timeout: 10000 });

    // Select 9+ years
    await page.click('text=9+ years');
    await page.waitForSelector('text=Create Your Profile!', { timeout: 10000 });

    // Fill name
    await page.fill('input[placeholder="Enter your name..."]', 'Test Kid 9+');

    // Select avatar (third one)
    await page.click('.grid.grid-cols-4 button:nth-child(3)');

    // Click Let's Play
    await page.click('text=Let\'s Play!');

    // Should navigate to homepage successfully
    await expect(page.locator('text=Welcome to Stealth Learning')).toBeVisible({ timeout: 15000 });

    await page.screenshot({ path: 'e2e/screenshots/kid-9plus-success.png' });
    console.log('✅ 9+ years flow working!');
  });

  test('Kid Flow: Test All Avatar Selections', async ({ page }) => {
    console.log('🧒 Testing all avatar selections...');

    await page.click('text=I\'m a Kid!');
    await page.click('text=6-8 years');
    await page.fill('input[placeholder="Enter your name..."]', 'Avatar Test Kid');

    // Test each avatar (there should be 8 based on the code)
    for (let i = 1; i <= 8; i++) {
      await page.click(`.grid.grid-cols-4 button:nth-child(${i})`);
      await page.waitForTimeout(500); // Brief pause to see selection
    }

    // Keep the last one selected and continue
    await page.click('text=Let\'s Play!');
    await expect(page.locator('text=Welcome to Stealth Learning')).toBeVisible({ timeout: 15000 });

    await page.screenshot({ path: 'e2e/screenshots/kid-avatar-test.png' });
    console.log('✅ All avatars working!');
  });

  test('CRITICAL: Check for Console Errors', async ({ page }) => {
    console.log('🔍 Checking for JavaScript errors...');

    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
        console.log('❌ Console Error:', msg.text());
      }
    });

    page.on('pageerror', (error) => {
      errors.push(error.message);
      console.log('❌ Page Error:', error.message);
    });

    // Go through the kid flow
    await page.click('text=I\'m a Kid!');
    await page.click('text=6-8 years');
    await page.fill('input[placeholder="Enter your name..."]', 'Error Test Kid');
    await page.click('.grid.grid-cols-4 button:first-child');
    await page.click('text=Let\'s Play!');

    // Wait for potential navigation
    await page.waitForTimeout(5000);

    if (errors.length > 0) {
      console.log('🚨 ERRORS FOUND:', errors);
      throw new Error(`Found ${errors.length} JavaScript errors: ${errors.join(', ')}`);
    }

    console.log('✅ No JavaScript errors found!');
  });

  test('Check Current Page State After Kid Login', async ({ page }) => {
    console.log('🔍 Checking what page we actually land on...');

    await page.click('text=I\'m a Kid!');
    await page.click('text=6-8 years');
    await page.fill('input[placeholder="Enter your name..."]', 'Debug Kid');
    await page.click('.grid.grid-cols-4 button:first-child');
    await page.click('text=Let\'s Play!');

    // Wait for navigation
    await page.waitForTimeout(5000);

    // Take screenshot to see what's actually on the page
    await page.screenshot({ path: 'e2e/screenshots/kid-actual-landing.png' });

    // Get current URL
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);

    // Get page title
    const title = await page.title();
    console.log('Page title:', title);

    // Get main content
    const bodyText = await page.locator('body').textContent();
    console.log('Page content (first 500 chars):', bodyText?.substring(0, 500));

    // Check for error indicators
    const hasErrorText = await page.locator('text=Error').isVisible().catch(() => false);
    const has404Text = await page.locator('text=404').isVisible().catch(() => false);
    const hasNotFoundText = await page.locator('text=Not Found').isVisible().catch(() => false);

    console.log('Has error text:', hasErrorText);
    console.log('Has 404 text:', has404Text);
    console.log('Has not found text:', hasNotFoundText);

    if (hasErrorText || has404Text || hasNotFoundText) {
      throw new Error('Kid flow leads to error page!');
    }
  });
});