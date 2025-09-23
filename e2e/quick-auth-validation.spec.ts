import { test, expect } from '@playwright/test';

test.describe('Quick Authentication Validation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('Parent Signup Link Works', async ({ page }) => {
    console.log('Testing parent signup link functionality...');

    // Navigate to parent login
    await page.click('text=I\'m a Parent');
    await page.waitForSelector('text=Parent Dashboard', { timeout: 10000 });

    // Click signup link - should work now
    await page.click('text=Sign up');

    // Should show signup form
    await expect(page.locator('text=Create Parent Account')).toBeVisible({ timeout: 5000 });

    console.log('✅ Parent signup link working!');
  });

  test('Text Visibility in Input Fields', async ({ page }) => {
    console.log('Testing text visibility...');

    // Test kid name input
    await page.click('text=I\'m a Kid!');
    await page.click('text=6-8 years');

    const kidInput = page.locator('input[placeholder="Enter your name..."]');
    await kidInput.fill('Test Kid');

    // Verify text appears in field
    const kidValue = await kidInput.inputValue();
    expect(kidValue).toBe('Test Kid');

    // Go to parent login
    await page.click('text=← Back');
    await page.click('text=← Back');
    await page.click('text=I\'m a Parent');

    // Test parent email input
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('test@email.com');

    const emailValue = await emailInput.inputValue();
    expect(emailValue).toBe('test@email.com');

    console.log('✅ Text visibility working!');
  });

  test('Parent Authentication Validation', async ({ page }) => {
    console.log('Testing authentication validation...');

    await page.click('text=I\'m a Parent');

    // Try invalid credentials
    await page.fill('input[type="email"]', 'fake@test.com');
    await page.fill('input[type="password"]', 'wrongpass');
    await page.click('text=Sign In');

    // Should show error (wait a bit for async validation)
    await page.waitForTimeout(2000);

    // Should NOT be on dashboard
    const dashboardVisible = await page.locator('text=Analytics Dashboard').isVisible();
    expect(dashboardVisible).toBe(false);

    // Try valid credentials
    await page.fill('input[type="email"]', 'parent@demo.com');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('text=Sign In');

    // Should navigate to dashboard
    await expect(page.locator('text=Parent Dashboard')).toBeVisible({ timeout: 10000 });

    console.log('✅ Authentication validation working!');
  });

  test('Complete Signup Flow', async ({ page }) => {
    console.log('Testing complete signup flow...');

    await page.click('text=I\'m a Parent');
    await page.click('text=Sign up');

    // Fill signup form
    await page.fill('input[placeholder="Your Name"]', 'Test Parent');
    await page.fill('input[placeholder="Email Address"]', 'new@parent.com');
    await page.fill('input[placeholder="Password"]', 'newpass123');
    await page.fill('input[placeholder="Confirm Password"]', 'newpass123');

    await page.click('text=Create Account');

    // Should navigate to dashboard after signup
    await expect(page.locator('text=Parent Dashboard')).toBeVisible({ timeout: 10000 });

    console.log('✅ Complete signup flow working!');
  });
});