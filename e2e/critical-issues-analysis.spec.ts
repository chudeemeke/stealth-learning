import { test, expect } from '@playwright/test';

test.describe('Critical Issues Analysis - Complete Application Audit', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('CRITICAL: Parent Signup Functionality Missing', async ({ page }) => {
    console.log('🚨 Testing parent signup functionality...');

    // Navigate to parent login
    await page.click('text=I\'m a Parent');
    await page.waitForSelector('text=Parent Dashboard');

    // Find the signup link
    const signupLink = page.locator('text=Sign up');
    await expect(signupLink).toBeVisible();

    // Test if signup link actually works
    await signupLink.click();

    // Should navigate to signup page or show signup form - but it doesn't!
    // This will FAIL because signup functionality is missing
    await page.waitForTimeout(2000);

    // Check if we're still on the same page (indicating broken signup)
    const currentUrl = page.url();
    console.log(`Current URL after signup click: ${currentUrl}`);

    // Verify signup functionality is missing
    await expect(page.locator('text=Create Account')).not.toBeVisible();
    await expect(page.locator('text=Register')).not.toBeVisible();

    await page.screenshot({ path: 'e2e/screenshots/issue-parent-signup-missing.png' });
  });

  test('CRITICAL: Parent Signin Accepts Any Credentials', async ({ page }) => {
    console.log('🚨 Testing parent signin validation...');

    // Navigate to parent login
    await page.click('text=I\'m a Parent');
    await page.waitForSelector('input[type="email"]');

    // Test with completely invalid credentials
    await page.fill('input[type="email"]', 'totally-fake-email@fake.com');
    await page.fill('input[type="password"]', 'wrongpassword123');

    await page.screenshot({ path: 'e2e/screenshots/issue-before-fake-login.png' });

    // Click signin - this SHOULD fail but won't because it's mocked
    await page.click('text=Sign In');
    await page.waitForTimeout(3000);

    // Check if it actually logged in (indicating broken validation)
    const currentUrl = page.url();
    console.log(`URL after fake login: ${currentUrl}`);

    if (currentUrl.includes('parent-dashboard')) {
      console.log('🚨 CRITICAL ISSUE: Fake credentials were accepted!');
      await page.screenshot({ path: 'e2e/screenshots/issue-fake-login-succeeded.png' });
    }

    // Verify we're in the dashboard (this should NOT happen with real auth)
    await expect(page.locator('text=Analytics Dashboard')).toBeVisible({ timeout: 5000 });
  });

  test('CRITICAL: Text Visibility Issues - Input Fields', async ({ page }) => {
    console.log('🚨 Testing text visibility in input fields...');

    // Test child name input visibility
    await page.click('text=I\'m a Kid!');
    await page.click('text=6-8 years'); // Select age

    const nameInput = page.locator('input[placeholder="Enter your name..."]');
    await expect(nameInput).toBeVisible();

    // Type text and check if it's visible
    await nameInput.fill('TestKidName');
    await page.screenshot({ path: 'e2e/screenshots/issue-kid-name-input.png' });

    // Get computed styles to check text color
    const textColor = await nameInput.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    console.log(`Kid name input text color: ${textColor}`);

    // Go back and test parent inputs
    await page.click('text=← Back');
    await page.click('text=← Back');
    await page.click('text=I\'m a Parent');

    // Test parent email input visibility
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('test@example.com');
    await page.screenshot({ path: 'e2e/screenshots/issue-parent-email-input.png' });

    const emailTextColor = await emailInput.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    console.log(`Parent email input text color: ${emailTextColor}`);

    // Test parent password input visibility
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill('testpassword');
    await page.screenshot({ path: 'e2e/screenshots/issue-parent-password-input.png' });

    const passwordTextColor = await passwordInput.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    console.log(`Parent password input text color: ${passwordTextColor}`);
  });

  test('CRITICAL: Complete Kid Flow with Text Visibility Check', async ({ page }) => {
    console.log('🚨 Testing complete kid flow for text visibility...');

    await page.click('text=I\'m a Kid!');
    await page.click('text=3-5 years');

    // Test name input
    const nameInput = page.locator('input[placeholder="Enter your name..."]');
    await nameInput.fill('Little Johnny');

    // Take screenshot to visually inspect text
    await page.screenshot({ path: 'e2e/screenshots/kid-name-input-filled.png' });

    // Verify the text is actually there in the input
    const inputValue = await nameInput.inputValue();
    expect(inputValue).toBe('Little Johnny');

    // Check if the text is visible by examining styles
    const styles = await nameInput.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        fontSize: computed.fontSize,
        opacity: computed.opacity,
        visibility: computed.visibility,
        display: computed.display
      };
    });

    console.log('Kid name input styles:', styles);

    // Select avatar and continue
    await page.click('.grid.grid-cols-4 button:nth-child(1)'); // Click first avatar
    await page.click('text=Let\'s Play!');

    // Verify successful navigation
    await expect(page.locator('text=Welcome back')).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: 'e2e/screenshots/kid-login-success.png' });
  });

  test('UI/UX Issues: Button States and Interactions', async ({ page }) => {
    console.log('🚨 Testing button states and interactions...');

    // Test disabled states
    await page.click('text=I\'m a Kid!');
    await page.click('text=6-8 years');

    // Test if "Let's Play!" button is properly disabled when name is empty
    const playButton = page.locator('text=Let\'s Play!');
    const isDisabled = await playButton.evaluate((btn) => (btn as HTMLButtonElement).disabled);
    console.log(`Play button disabled when name empty: ${isDisabled}`);

    await page.screenshot({ path: 'e2e/screenshots/play-button-disabled-state.png' });

    // Fill name and check button enabled
    await page.fill('input[placeholder="Enter your name..."]', 'Test');
    const isEnabledAfterName = await playButton.evaluate((btn) => !(btn as HTMLButtonElement).disabled);
    console.log(`Play button enabled after name: ${isEnabledAfterName}`);

    await page.screenshot({ path: 'e2e/screenshots/play-button-enabled-state.png' });
  });

  test('Navigation Flow Issues', async ({ page }) => {
    console.log('🚨 Testing navigation flow issues...');

    // Test back button functionality
    await page.click('text=I\'m a Kid!');
    await page.screenshot({ path: 'e2e/screenshots/nav-kid-age-selection.png' });

    await page.click('text=← Back');
    await expect(page.locator('text=Who\'s playing today?')).toBeVisible();
    await page.screenshot({ path: 'e2e/screenshots/nav-back-to-start.png' });

    // Test parent flow navigation
    await page.click('text=I\'m a Parent');
    await page.screenshot({ path: 'e2e/screenshots/nav-parent-login.png' });

    await page.click('text=← Back');
    await expect(page.locator('text=Who\'s playing today?')).toBeVisible();
    await page.screenshot({ path: 'e2e/screenshots/nav-parent-back-to-start.png' });
  });

  test('Complete Application State Management Issues', async ({ page }) => {
    console.log('🚨 Testing application state management...');

    // Test if state persists correctly during navigation
    await page.click('text=I\'m a Kid!');
    await page.click('text=9+ years');
    await page.fill('input[placeholder="Enter your name..."]', 'StateTestKid');

    // Navigate away and back to see if state persists (it shouldn't in current impl)
    await page.click('text=← Back');
    await page.click('text=9+ years');

    const nameValue = await page.locator('input[placeholder="Enter your name..."]').inputValue();
    console.log(`Name value after navigation: "${nameValue}"`);

    if (nameValue === '') {
      console.log('✅ State correctly cleared on navigation');
    } else {
      console.log('❌ State incorrectly persisted');
    }

    await page.screenshot({ path: 'e2e/screenshots/state-management-test.png' });
  });

  test('Comprehensive Error Handling Test', async ({ page }) => {
    console.log('🚨 Testing error handling across the application...');

    // Test what happens with extremely long names
    await page.click('text=I\'m a Kid!');
    await page.click('text=6-8 years');

    const veryLongName = 'a'.repeat(100); // 100 character name
    await page.fill('input[placeholder="Enter your name..."]', veryLongName);

    const actualValue = await page.locator('input[placeholder="Enter your name..."]').inputValue();
    console.log(`Long name test - entered: ${veryLongName.length} chars, actual: ${actualValue.length} chars`);

    await page.screenshot({ path: 'e2e/screenshots/long-name-test.png' });

    // Test special characters in name
    await page.fill('input[placeholder="Enter your name..."]', '🎮💀<script>alert()</script>');
    const specialCharsValue = await page.locator('input[placeholder="Enter your name..."]').inputValue();
    console.log(`Special characters test - value: "${specialCharsValue}"`);

    await page.screenshot({ path: 'e2e/screenshots/special-chars-test.png' });
  });
});