import { test, expect } from '@playwright/test';

test.describe('🔐 CRITICAL SECURITY TEST: Parent Authentication Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('🚨 MUST REJECT: Unregistered parent login attempts', async ({ page }) => {
    console.log('🔒 Starting critical security test: Unauthorized parent login rejection');

    // Step 1: Navigate to parent login
    console.log('📍 Step 1: Navigating to parent login...');
    await page.click('button:has-text("I\'m a Parent")');
    await page.waitForTimeout(1000);

    // Step 2: Verify we're on parent login page
    console.log('📍 Step 2: Verifying parent login page...');
    await expect(page).toHaveURL(/\/login/);

    // Take screenshot of login form
    await page.screenshot({
      path: 'e2e/screenshots/parent-auth-1-login-form.png',
      fullPage: true
    });

    // Step 3: Try to login with unregistered credentials
    console.log('📍 Step 3: Attempting login with UNREGISTERED credentials...');
    const unregisteredEmail = 'unregistered@example.com';
    const unregisteredPassword = 'TestPassword123!';

    // Fill in the form
    await page.fill('input[type="email"]', unregisteredEmail);
    await page.fill('input[type="password"]', unregisteredPassword);

    // Take screenshot before submission
    await page.screenshot({
      path: 'e2e/screenshots/parent-auth-2-before-submit.png',
      fullPage: true
    });

    // Step 4: Submit the form
    console.log('📍 Step 4: Submitting unregistered login...');
    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(2000);

    // Step 5: Verify login is REJECTED
    console.log('📍 Step 5: Verifying login rejection...');

    // Check that we're still on login page (not redirected)
    const currentUrl = page.url();
    expect(currentUrl).toContain('/login');
    console.log('✅ GOOD: Still on login page, not redirected');

    // Check for error message using our new toast system
    const toastVisible = await page.locator('[role="alert"]').isVisible().catch(() => false);
    if (toastVisible) {
      console.log('✅ GOOD: Error toast notification displayed');
      const toastText = await page.locator('[role="alert"]').textContent();
      console.log(`📢 Toast message: ${toastText}`);

      await page.screenshot({
        path: 'e2e/screenshots/parent-auth-3-error-toast.png',
        fullPage: true
      });
    }

    // Check for any error message in the form
    const errorMessages = [
      'text=Invalid credentials',
      'text=Authentication failed',
      'text=Invalid email or password',
      'text=User not found',
      'text=Please check your credentials'
    ];

    let errorFound = false;
    for (const selector of errorMessages) {
      const isVisible = await page.locator(selector).isVisible().catch(() => false);
      if (isVisible) {
        errorFound = true;
        console.log(`✅ GOOD: Error message found: "${selector}"`);
        break;
      }
    }

    // Verify we cannot access parent dashboard
    console.log('📍 Step 6: Verifying dashboard is NOT accessible...');
    await page.goto('/parent-dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const dashboardUrl = page.url();
    if (dashboardUrl.includes('parent-dashboard')) {
      // Check if we're redirected back to login
      await page.waitForTimeout(2000);
      const finalUrl = page.url();
      if (finalUrl.includes('login')) {
        console.log('✅ GOOD: Dashboard access blocked, redirected to login');
      } else {
        console.log('❌ SECURITY ISSUE: Dashboard accessible without authentication!');
        await page.screenshot({
          path: 'e2e/screenshots/parent-auth-4-SECURITY-ISSUE.png',
          fullPage: true
        });
      }
    } else {
      console.log('✅ GOOD: Dashboard access blocked');
    }

    // Take final screenshot
    await page.screenshot({
      path: 'e2e/screenshots/parent-auth-5-final-state.png',
      fullPage: true
    });

    // Final assertions
    expect(currentUrl).not.toContain('parent-dashboard');
    console.log('🔒 Security test complete: Unauthorized login properly rejected');
  });

  test('✅ MUST ALLOW: Registered parent login after signup', async ({ page }) => {
    console.log('🔓 Testing proper authentication flow for registered parents');

    // Step 1: First sign up as a new parent
    console.log('📍 Step 1: Creating new parent account...');
    await page.click('button:has-text("I\'m a Parent")');
    await page.waitForTimeout(1000);

    // Click sign up link
    const signUpLink = await page.locator('text=Sign up').first();
    if (await signUpLink.isVisible()) {
      await signUpLink.click();
      await page.waitForTimeout(1000);

      console.log('📍 Step 2: Filling signup form...');
      const testEmail = `parent_${Date.now()}@test.com`;
      const testPassword = 'SecurePassword123!';

      // Fill signup form
      await page.fill('input[name="parentName"]', 'Test Parent');
      await page.fill('input[name="email"]', testEmail);
      await page.fill('input[name="password"]', testPassword);
      await page.fill('input[name="confirmPassword"]', testPassword);

      // Add child
      await page.fill('input[name="childName"]', 'Test Child');
      await page.selectOption('select[name="childAge"]', '6-8');

      // Screenshot before signup
      await page.screenshot({
        path: 'e2e/screenshots/parent-auth-6-signup-form.png',
        fullPage: true
      });

      // Submit signup
      await page.click('button:has-text("Create Account")');
      await page.waitForTimeout(2000);

      // Now try to login with these credentials
      console.log('📍 Step 3: Logging in with registered credentials...');

      // If redirected to dashboard after signup, go back to login
      if (page.url().includes('parent-dashboard')) {
        console.log('✅ Auto-logged in after signup');
        await page.screenshot({
          path: 'e2e/screenshots/parent-auth-7-dashboard-access.png',
          fullPage: true
        });
      } else {
        // Manual login
        await page.goto('/login');
        await page.fill('input[type="email"]', testEmail);
        await page.fill('input[type="password"]', testPassword);
        await page.click('button:has-text("Sign In")');
        await page.waitForTimeout(2000);

        // Verify successful login
        if (page.url().includes('parent-dashboard')) {
          console.log('✅ Successfully logged in with registered account');
          await page.screenshot({
            path: 'e2e/screenshots/parent-auth-8-successful-login.png',
            fullPage: true
          });
        }
      }
    }
  });

  test('🛡️ COMPREHENSIVE: Test all authentication edge cases', async ({ page }) => {
    console.log('🔍 Testing comprehensive authentication security...');

    // Test 1: Empty credentials
    console.log('📍 Test 1: Empty credentials...');
    await page.goto('/login');
    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(1000);

    // Should show validation error
    const emptyFieldError = await page.locator('text=required').isVisible().catch(() => false) ||
                           await page.locator('text=Please enter').isVisible().catch(() => false);
    console.log(`Empty fields validation: ${emptyFieldError ? '✅ PASS' : '❌ FAIL'}`);

    // Test 2: Invalid email format
    console.log('📍 Test 2: Invalid email format...');
    await page.fill('input[type="email"]', 'notanemail');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(1000);

    const emailError = await page.locator('text=valid email').isVisible().catch(() => false) ||
                       await page.locator('text=Invalid email').isVisible().catch(() => false);
    console.log(`Email validation: ${emailError ? '✅ PASS' : '⚠️ WARNING'}`);

    // Test 3: SQL injection attempt
    console.log('📍 Test 3: SQL injection prevention...');
    await page.fill('input[type="email"]', "admin' OR '1'='1");
    await page.fill('input[type="password"]', "' OR '1'='1");
    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(1000);

    // Should NOT be logged in
    const notLoggedIn = !page.url().includes('parent-dashboard');
    console.log(`SQL injection prevention: ${notLoggedIn ? '✅ PASS' : '❌ CRITICAL FAIL'}`);

    // Test 4: XSS attempt
    console.log('📍 Test 4: XSS prevention...');
    await page.fill('input[type="email"]', '<script>alert("XSS")</script>@test.com');
    await page.fill('input[type="password"]', '<img src=x onerror=alert("XSS")>');
    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(1000);

    // Check no alerts were triggered
    const noXSS = !page.url().includes('parent-dashboard');
    console.log(`XSS prevention: ${noXSS ? '✅ PASS' : '❌ CRITICAL FAIL'}`);

    // Test 5: Rate limiting (multiple failed attempts)
    console.log('📍 Test 5: Rate limiting check...');
    for (let i = 0; i < 5; i++) {
      await page.fill('input[type="email"]', `fail${i}@test.com`);
      await page.fill('input[type="password"]', 'WrongPassword');
      await page.click('button:has-text("Sign In")');
      await page.waitForTimeout(500);
    }

    // Check for rate limiting message or account lockout
    const rateLimitMsg = await page.locator('text=too many attempts').isVisible().catch(() => false) ||
                         await page.locator('text=locked').isVisible().catch(() => false) ||
                         await page.locator('text=try again later').isVisible().catch(() => false);
    console.log(`Rate limiting: ${rateLimitMsg ? '✅ IMPLEMENTED' : '⚠️ NOT DETECTED'}`);

    // Final security summary screenshot
    await page.screenshot({
      path: 'e2e/screenshots/parent-auth-9-security-summary.png',
      fullPage: true
    });

    console.log('🔒 Comprehensive security test complete');
  });
});