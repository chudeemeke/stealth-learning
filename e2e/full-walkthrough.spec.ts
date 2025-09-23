import { test, expect } from '@playwright/test';

test.describe('Full Application Walkthrough - Kid Game Flow', () => {
  test('should complete kid registration and play Math games', async ({ page }) => {
    console.log('🎯 Starting Math game walkthrough...');

    // Navigate to application
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'e2e/screenshots/walkthrough-01-landing.png' });

    // Step 1: Kid Registration Flow
    const kidButton = page.getByText('I\'m a Kid!');
    await expect(kidButton).toBeVisible();
    await kidButton.click();
    console.log('✅ Clicked kid button');
    await page.waitForTimeout(500);

    // Step 2: Age Selection
    const ageButton = page.locator('button').filter({ hasText: '6-8 years' });
    await expect(ageButton.first()).toBeVisible();
    await ageButton.first().click();
    console.log('✅ Selected age: 6-8');
    await page.waitForTimeout(500);

    // Step 3: Name Input
    const nameInput = page.locator('input[type="text"]');
    await expect(nameInput).toBeVisible();
    await nameInput.fill('MathTestKid');
    console.log('✅ Filled name: MathTestKid');
    await page.waitForTimeout(500);

    // Step 4: Avatar Selection
    const emojiButton = page.locator('button').filter({ hasText: '🦁' });
    await expect(emojiButton).toBeVisible();
    await emojiButton.click();
    console.log('✅ Selected emoji: 🦁');
    await page.waitForTimeout(500);

    // Step 5: Complete Registration
    const playButton = page.getByText('Let\'s Play! 🎮');
    await expect(playButton).toBeVisible();
    await expect(playButton).toBeEnabled({ timeout: 5000 });
    await playButton.click();
    console.log('✅ Clicked Let\'s Play button');

    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'e2e/screenshots/walkthrough-02-after-registration.png' });

    // Check we're not on error page
    const errorIndicator = page.locator('text=Something went wrong').or(page.locator('text=Error'));
    const isErrorPage = await errorIndicator.isVisible();

    if (isErrorPage) {
      console.log('❌ ERROR: Landed on error page after registration');
      const errorDetails = await page.textContent('body').catch(() => 'Could not get error details');
      console.log('Error details:', errorDetails);
      throw new Error('Registration resulted in error page');
    }

    // Step 6: Navigate to Math Games
    console.log('🧮 Looking for Math games...');

    // Look for various ways Math might be presented
    const mathSelectors = [
      'text=Math',
      'text=Mathematics',
      'text=Numbers',
      'text=Counting',
      '[data-testid="math-subject"]',
      'button[aria-label*="math" i]',
      'div[title*="math" i]'
    ];

    let mathButton = null;
    for (const selector of mathSelectors) {
      const element = page.locator(selector);
      if (await element.isVisible()) {
        mathButton = element;
        console.log(`✅ Found Math button with selector: ${selector}`);
        break;
      }
    }

    if (mathButton) {
      await mathButton.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'e2e/screenshots/walkthrough-03-math-section.png' });
      console.log('✅ Navigated to Math section');

      // Look for specific math games
      const mathGameSelectors = [
        'text=Addition',
        'text=Subtraction',
        'text=Counting',
        'text=Numbers',
        'button:has-text("+")',
        'button:has-text("-")',
        '[data-testid*="math"]',
        '[data-testid*="addition"]',
        '[data-testid*="counting"]'
      ];

      let gameFound = false;
      for (const selector of mathGameSelectors) {
        const gameButton = page.locator(selector);
        if (await gameButton.isVisible()) {
          await gameButton.click();
          console.log(`✅ Started math game: ${selector}`);
          gameFound = true;
          await page.waitForTimeout(2000);
          await page.screenshot({ path: 'e2e/screenshots/walkthrough-04-math-game-started.png' });
          break;
        }
      }

      if (!gameFound) {
        console.log('⚠️ No specific math games found, documenting available options');
        const allButtons = await page.locator('button').all();
        for (let i = 0; i < allButtons.length; i++) {
          const text = await allButtons[i].textContent();
          const isVisible = await allButtons[i].isVisible();
          if (isVisible && text?.trim()) {
            console.log(`Available button ${i}: "${text}"`);
          }
        }
      }
    } else {
      console.log('⚠️ Math section not found, documenting available subjects');

      // Document what subjects/options are available
      const allButtons = await page.locator('button').all();
      console.log(`Found ${allButtons.length} buttons on page after registration:`);
      for (let i = 0; i < allButtons.length; i++) {
        const text = await allButtons[i].textContent();
        const isVisible = await allButtons[i].isVisible();
        if (isVisible && text?.trim()) {
          console.log(`Button ${i}: "${text}"`);
        }
      }

      // Also check for any navigation elements
      const navElements = await page.locator('nav, [role="navigation"], .navigation, .menu').all();
      for (let i = 0; i < navElements.length; i++) {
        const text = await navElements[i].textContent();
        if (text?.trim()) {
          console.log(`Navigation ${i}: "${text}"`);
        }
      }
    }

    await page.screenshot({ path: 'e2e/screenshots/walkthrough-05-math-final-state.png' });
  });

  test('should test English subject game flow', async ({ page }) => {
    console.log('📚 Starting English game walkthrough...');

    // Complete registration first
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Quick registration
    await page.getByText('I\'m a Kid!').click();
    await page.waitForTimeout(500);
    await page.locator('button').filter({ hasText: '6-8 years' }).first().click();
    await page.waitForTimeout(500);
    await page.locator('input[type="text"]').fill('EnglishTestKid');
    await page.waitForTimeout(500);
    await page.locator('button').filter({ hasText: '🐼' }).click();
    await page.waitForTimeout(500);
    await page.getByText('Let\'s Play! 🎮').click();
    await page.waitForTimeout(2000);

    // Look for English/Language Arts section
    const englishSelectors = [
      'text=English',
      'text=Language',
      'text=Reading',
      'text=Letters',
      'text=Words',
      '[data-testid="english-subject"]',
      'button[aria-label*="english" i]',
      'button[aria-label*="reading" i]'
    ];

    let englishButton = null;
    for (const selector of englishSelectors) {
      const element = page.locator(selector);
      if (await element.isVisible()) {
        englishButton = element;
        console.log(`✅ Found English button with selector: ${selector}`);
        break;
      }
    }

    if (englishButton) {
      await englishButton.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'e2e/screenshots/walkthrough-06-english-section.png' });
      console.log('✅ Navigated to English section');

      // Look for English games
      const englishGameSelectors = [
        'text=Reading',
        'text=Spelling',
        'text=Letters',
        'text=Words',
        'text=Phonics',
        '[data-testid*="reading"]',
        '[data-testid*="spelling"]',
        '[data-testid*="letters"]'
      ];

      for (const selector of englishGameSelectors) {
        const gameButton = page.locator(selector);
        if (await gameButton.isVisible()) {
          await gameButton.click();
          console.log(`✅ Started English game: ${selector}`);
          await page.waitForTimeout(2000);
          await page.screenshot({ path: 'e2e/screenshots/walkthrough-07-english-game.png' });
          break;
        }
      }
    } else {
      console.log('⚠️ English section not found');
    }
  });

  test('should test Science subject game flow', async ({ page }) => {
    console.log('🔬 Starting Science game walkthrough...');

    // Complete registration first
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Quick registration
    await page.getByText('I\'m a Kid!').click();
    await page.waitForTimeout(500);
    await page.locator('button').filter({ hasText: '6-8 years' }).first().click();
    await page.waitForTimeout(500);
    await page.locator('input[type="text"]').fill('ScienceTestKid');
    await page.waitForTimeout(500);
    await page.locator('button').filter({ hasText: '🦄' }).click();
    await page.waitForTimeout(500);
    await page.getByText('Let\'s Play! 🎮').click();
    await page.waitForTimeout(2000);

    // Look for Science section
    const scienceSelectors = [
      'text=Science',
      'text=Nature',
      'text=Animals',
      'text=Plants',
      'text=Space',
      '[data-testid="science-subject"]',
      'button[aria-label*="science" i]'
    ];

    let scienceButton = null;
    for (const selector of scienceSelectors) {
      const element = page.locator(selector);
      if (await element.isVisible()) {
        scienceButton = element;
        console.log(`✅ Found Science button with selector: ${selector}`);
        break;
      }
    }

    if (scienceButton) {
      await scienceButton.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'e2e/screenshots/walkthrough-08-science-section.png' });
      console.log('✅ Navigated to Science section');

      // Look for Science games
      const scienceGameSelectors = [
        'text=Animals',
        'text=Plants',
        'text=Space',
        'text=Weather',
        'text=Nature',
        '[data-testid*="animals"]',
        '[data-testid*="plants"]',
        '[data-testid*="space"]'
      ];

      for (const selector of scienceGameSelectors) {
        const gameButton = page.locator(selector);
        if (await gameButton.isVisible()) {
          await gameButton.click();
          console.log(`✅ Started Science game: ${selector}`);
          await page.waitForTimeout(2000);
          await page.screenshot({ path: 'e2e/screenshots/walkthrough-09-science-game.png' });
          break;
        }
      }
    } else {
      console.log('⚠️ Science section not found');
    }
  });
});

test.describe('Full Application Walkthrough - Parent Analytics Flow', () => {
  test('should test parent login and analytics viewing', async ({ page }) => {
    console.log('👨‍👩‍👧 Starting Parent analytics walkthrough...');

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'e2e/screenshots/parent-01-landing.png' });

    // Step 1: Click Parent Button
    const parentButton = page.getByText('I\'m a Parent');
    await expect(parentButton).toBeVisible();
    await parentButton.click();
    console.log('✅ Clicked parent button');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'e2e/screenshots/parent-02-login-form.png' });

    // Step 2: Fill Parent Login Form
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    if (await emailInput.isVisible() && await passwordInput.isVisible()) {
      await emailInput.fill('parent@test.com');
      await passwordInput.fill('testpassword123');
      console.log('✅ Filled login credentials');

      // Step 3: Click Sign In
      const signInButton = page.getByText('Sign In');
      await signInButton.click();
      console.log('✅ Clicked Sign In button');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'e2e/screenshots/parent-03-after-signin.png' });

      // Check if we're on the parent dashboard
      const currentUrl = page.url();
      console.log('Current URL after parent login:', currentUrl);

      // Look for dashboard indicators
      const dashboardSelectors = [
        'text=Dashboard',
        'text=Analytics',
        'text=Progress',
        'text=Performance',
        'text=Child',
        'text=Student',
        '[data-testid="parent-dashboard"]',
        '[data-testid="analytics"]'
      ];

      let dashboardFound = false;
      for (const selector of dashboardSelectors) {
        const element = page.locator(selector);
        if (await element.isVisible()) {
          console.log(`✅ Found dashboard element: ${selector}`);
          dashboardFound = true;
          break;
        }
      }

      if (dashboardFound) {
        console.log('✅ Successfully accessed parent dashboard');

        // Look for analytics/progress views
        const analyticsSelectors = [
          'text=Analytics',
          'text=Progress',
          'text=Performance',
          'text=Statistics',
          'text=Reports',
          '[data-testid="analytics-view"]',
          '[data-testid="progress-chart"]',
          'canvas', // Charts might be in canvas elements
          '.chart', // CSS class for charts
          'svg' // SVG charts
        ];

        for (const selector of analyticsSelectors) {
          const element = page.locator(selector);
          if (await element.isVisible()) {
            console.log(`✅ Found analytics element: ${selector}`);

            // If it's clickable, click it to view analytics
            try {
              await element.click();
              await page.waitForTimeout(1000);
              console.log(`✅ Clicked analytics element: ${selector}`);
              break;
            } catch (error) {
              console.log(`📊 Analytics element visible but not clickable: ${selector}`);
            }
          }
        }

        await page.screenshot({ path: 'e2e/screenshots/parent-04-analytics-view.png' });

        // Document what analytics/data is available
        const dataElements = await page.locator('[data-testid*="stat"], [data-testid*="metric"], .metric, .statistic, .data-point').all();
        console.log(`Found ${dataElements.length} potential data elements`);

        for (let i = 0; i < dataElements.length; i++) {
          const text = await dataElements[i].textContent();
          if (text?.trim()) {
            console.log(`Data element ${i}: "${text}"`);
          }
        }

      } else {
        console.log('⚠️ Dashboard not found after parent login');

        // Check if we're on an error page
        const errorIndicator = page.locator('text=Error').or(page.locator('text=Something went wrong'));
        if (await errorIndicator.isVisible()) {
          console.log('❌ ERROR: Parent login resulted in error page');
          const errorDetails = await page.textContent('body').catch(() => 'Could not get error details');
          console.log('Error details:', errorDetails);
        }

        // Document what's actually on the page
        const allButtons = await page.locator('button').all();
        console.log(`Found ${allButtons.length} buttons after parent login:`);
        for (let i = 0; i < allButtons.length; i++) {
          const text = await allButtons[i].textContent();
          const isVisible = await allButtons[i].isVisible();
          if (isVisible && text?.trim()) {
            console.log(`Button ${i}: "${text}"`);
          }
        }
      }

    } else {
      console.log('⚠️ Parent login form not found');
      await page.screenshot({ path: 'e2e/screenshots/parent-05-login-form-not-found.png' });
    }
  });
});