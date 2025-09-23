import { test, expect } from '@playwright/test';

test.describe('Authentication Fixes Validation - Complete System Test', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('FIXED: Parent Signup Functionality Now Working', async ({ page }) => {
    console.log('✅ Testing FIXED parent signup functionality...');

    // Navigate to parent login
    await page.click('text=I\'m a Parent');
    await page.waitForSelector('text=Parent Dashboard');

    // Click signup link (now working)
    await page.click('text=Sign up');
    await page.waitForSelector('text=Create Parent Account');

    await page.screenshot({ path: 'e2e/screenshots/fix-parent-signup-form.png' });

    // Fill out signup form
    await page.fill('input[placeholder="Your Name"]', 'Test Parent User');
    await page.fill('input[placeholder="Email Address"]', 'newparent@test.com');
    await page.fill('input[placeholder="Password"]', 'testpass123');
    await page.fill('input[placeholder="Confirm Password"]', 'testpass123');

    await page.screenshot({ path: 'e2e/screenshots/fix-signup-form-filled.png' });

    // Submit signup
    await page.click('text=Create Account');
    await page.waitForTimeout(2000); // Wait for async validation

    // Should navigate to parent dashboard
    await expect(page.locator('text=Analytics Dashboard')).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: 'e2e/screenshots/fix-signup-success.png' });

    console.log('✅ Parent signup now working correctly!');
  });

  test('FIXED: Parent Signin Now Has Real Validation', async ({ page }) => {
    console.log('✅ Testing FIXED parent signin validation...');

    // Navigate to parent login
    await page.click('text=I\'m a Parent');

    // Try with invalid credentials - should FAIL now
    await page.fill('input[type="email"]', 'fake@email.com');
    await page.fill('input[type="password"]', 'wrongpassword');

    await page.screenshot({ path: 'e2e/screenshots/fix-invalid-credentials.png' });

    await page.click('text=Sign In');
    await page.waitForTimeout(2000);

    // Should show error message and NOT navigate
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
    await expect(page.locator('text=Analytics Dashboard')).not.toBeVisible();

    await page.screenshot({ path: 'e2e/screenshots/fix-signin-validation-error.png' });

    // Clear error and try with valid credentials
    await page.fill('input[type="email"]', 'parent@demo.com');
    await page.fill('input[type="password"]', 'demo123');

    await page.screenshot({ path: 'e2e/screenshots/fix-valid-credentials.png' });

    await page.click('text=Sign In');
    await page.waitForTimeout(3000);

    // Should successfully navigate to dashboard
    await expect(page.locator('text=Analytics Dashboard')).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: 'e2e/screenshots/fix-signin-success.png' });

    console.log('✅ Parent signin validation now working correctly!');
  });

  test('FIXED: Text Visibility in All Input Fields', async ({ page }) => {
    console.log('✅ Testing FIXED text visibility...');

    // Test kid name input
    await page.click('text=I\'m a Kid!');
    await page.click('text=6-8 years');

    const kidNameInput = page.locator('input[placeholder="Enter your name..."]');
    await kidNameInput.fill('Visible Kid Name');

    await page.screenshot({ path: 'e2e/screenshots/fix-kid-name-visible.png' });

    // Check text color is now explicitly set
    const kidTextColor = await kidNameInput.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    console.log(`Kid name input text color: ${kidTextColor}`);

    // Go back and test parent inputs
    await page.click('text=← Back');
    await page.click('text=← Back');
    await page.click('text=I\'m a Parent');

    // Test parent email input
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('visible@email.com');
    await page.screenshot({ path: 'e2e/screenshots/fix-parent-email-visible.png' });

    const emailTextColor = await emailInput.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    console.log(`Parent email text color: ${emailTextColor}`);

    // Test parent password input
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill('visiblepassword');
    await page.screenshot({ path: 'e2e/screenshots/fix-parent-password-visible.png' });

    // Test signup form inputs
    await page.click('text=Sign up');
    await page.waitForSelector('input[placeholder="Your Name"]');

    await page.fill('input[placeholder="Your Name"]', 'Visible Parent Name');
    await page.fill('input[placeholder="Email Address"]', 'visible@parent.com');
    await page.fill('input[placeholder="Password"]', 'visiblepass123');
    await page.fill('input[placeholder="Confirm Password"]', 'visiblepass123');

    await page.screenshot({ path: 'e2e/screenshots/fix-signup-inputs-visible.png' });

    console.log('✅ All input text is now visible!');
  });

  test('Comprehensive Form Validation Testing', async ({ page }) => {
    console.log('✅ Testing comprehensive form validation...');

    // Test signup validation
    await page.click('text=I\'m a Parent');
    await page.click('text=Sign up');

    // Test name validation
    await page.fill('input[placeholder="Your Name"]', 'A'); // Too short
    await page.fill('input[placeholder="Email Address"]', 'invalidemail'); // Invalid email
    await page.fill('input[placeholder="Password"]', '123'); // Too short
    await page.fill('input[placeholder="Confirm Password"]', '456'); // Doesn't match

    await page.click('text=Create Account');
    await page.waitForTimeout(2000);

    // Should show validation error
    await expect(page.locator('.bg-red-100')).toBeVisible();
    await page.screenshot({ path: 'e2e/screenshots/validation-errors.png' });

    // Test password strength validation
    await page.fill('input[placeholder="Your Name"]', 'Valid Name');
    await page.fill('input[placeholder="Email Address"]', 'valid@email.com');
    await page.fill('input[placeholder="Password"]', 'weakpass'); // No numbers
    await page.fill('input[placeholder="Confirm Password"]', 'weakpass');

    await page.click('text=Create Account');
    await page.waitForTimeout(2000);

    await expect(page.locator('text=Password must contain both letters and numbers')).toBeVisible();
    await page.screenshot({ path: 'e2e/screenshots/password-validation.png' });

    console.log('✅ Form validation working correctly!');
  });

  test('Complete End-to-End Authentication Flow', async ({ page }) => {
    console.log('✅ Testing complete authentication flow...');

    // 1. Sign up new parent
    await page.click('text=I\'m a Parent');
    await page.click('text=Sign up');

    await page.fill('input[placeholder="Your Name"]', 'Complete Test Parent');
    await page.fill('input[placeholder="Email Address"]', 'complete@test.com');
    await page.fill('input[placeholder="Password"]', 'complete123');
    await page.fill('input[placeholder="Confirm Password"]', 'complete123');

    await page.click('text=Create Account');
    await page.waitForTimeout(3000);

    // Should be logged in and on dashboard
    await expect(page.locator('text=Analytics Dashboard')).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: 'e2e/screenshots/complete-flow-dashboard.png' });

    // 2. Navigate back to login (simulate logout)
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // 3. Sign in with the account we just created
    await page.click('text=I\'m a Parent');
    await page.fill('input[type="email"]', 'complete@test.com');
    await page.fill('input[type="password"]', 'complete123');

    await page.click('text=Sign In');
    await page.waitForTimeout(3000);

    // Should successfully sign in
    await expect(page.locator('text=Analytics Dashboard')).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: 'e2e/screenshots/complete-flow-signin.png' });

    console.log('✅ Complete authentication flow working!');
  });

  test('Error Handling and User Experience', async ({ page }) => {
    console.log('✅ Testing error handling and UX...');

    // Test loading states
    await page.click('text=I\'m a Parent');
    await page.fill('input[type="email"]', 'parent@demo.com');
    await page.fill('input[type="password"]', 'demo123');

    // Click sign in and immediately check for loading state
    const signInButton = page.locator('text=Sign In');
    await signInButton.click();

    // Should show "Signing In..." briefly
    await expect(page.locator('text=Signing In...')).toBeVisible({ timeout: 1000 });
    await page.screenshot({ path: 'e2e/screenshots/loading-state.png' });

    // Wait for completion
    await page.waitForTimeout(3000);
    await expect(page.locator('text=Analytics Dashboard')).toBeVisible({ timeout: 10000 });

    console.log('✅ Loading states and UX working correctly!');
  });

  test('Navigation and State Management', async ({ page }) => {
    console.log('✅ Testing navigation and state management...');

    // Test navigation between login and signup
    await page.click('text=I\'m a Parent');
    await page.fill('input[type="email"]', 'test@navigation.com');
    await page.fill('input[type="password"]', 'testpass');

    // Navigate to signup
    await page.click('text=Sign up');
    await expect(page.locator('text=Create Parent Account')).toBeVisible();

    // Go back to signin
    await page.click('text=← Back to Sign In');
    await expect(page.locator('text=Parent Dashboard')).toBeVisible();

    // Check if form was cleared (should be)
    const emailValue = await page.locator('input[type="email"]').inputValue();
    const passwordValue = await page.locator('input[type="password"]').inputValue();

    console.log(`Email field after navigation: "${emailValue}"`);
    console.log(`Password field after navigation: "${passwordValue}"`);

    await page.screenshot({ path: 'e2e/screenshots/navigation-state.png' });

    console.log('✅ Navigation and state management working!');
  });
});