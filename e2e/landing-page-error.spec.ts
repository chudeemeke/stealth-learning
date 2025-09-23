import { test, expect } from '@playwright/test';

test.describe('Landing Page Error Investigation', () => {
  test('should reproduce and capture the kid name/emoji selection error', async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Take a screenshot of the initial state
    await page.screenshot({ path: 'e2e/screenshots/01-initial-page.png' });

    // Look for child login option
    const childButton = page.getByText('I\'m a Kid!').or(page.getByText('Child')).or(page.getByRole('button', { name: /kid|child/i }));

    if (await childButton.isVisible()) {
      console.log('Found child/kid button, clicking...');
      await childButton.click();
    } else {
      // Try to find any buttons on the page
      const buttons = await page.locator('button').all();
      console.log(`Found ${buttons.length} buttons on page`);

      for (let i = 0; i < buttons.length; i++) {
        const buttonText = await buttons[i].textContent();
        console.log(`Button ${i}: "${buttonText}"`);
      }
    }

    // Wait a bit and take screenshot
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'e2e/screenshots/02-after-first-click.png' });

    // Look for name input
    const nameInput = page.locator('input[type="text"]').or(page.locator('input[placeholder*="name"]'));
    if (await nameInput.isVisible()) {
      console.log('Found name input, entering test name...');
      await nameInput.fill('TestKid');
    }

    // Look for age selection
    const ageButtons = page.locator('button').filter({ hasText: /3-5|6-8|9/ });
    if (await ageButtons.first().isVisible()) {
      console.log('Found age buttons, selecting 6-8...');
      await ageButtons.filter({ hasText: '6-8' }).click();
    }

    // Look for emoji/avatar selection
    const emojiButtons = page.locator('button').filter({ hasText: /🦁|🐼|🦄|🐸|🦊|🐧|🦋|🐢/ });
    if (await emojiButtons.first().isVisible()) {
      console.log('Found emoji buttons, selecting first emoji...');
      await emojiButtons.first().click();
    }

    // Take screenshot before the problematic action
    await page.screenshot({ path: 'e2e/screenshots/03-before-final-click.png' });

    // Look for "Start Playing" or similar button - try various text patterns
    const startButton = page.getByText('Start Playing')
      .or(page.getByText('Let\'s Go'))
      .or(page.getByText('Continue'))
      .or(page.getByText('Play'))
      .or(page.getByText('Begin'))
      .or(page.getByRole('button').filter({ hasText: /start|play|go|continue|begin/i }));

    // Set up error logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Browser Console Error:', msg.text());
      }
    });

    page.on('pageerror', error => {
      console.log('Page Error:', error.message);
    });

    if (await startButton.isVisible()) {
      console.log('Found start button, clicking...');
      try {
        await startButton.click();

        // Wait for navigation or error
        await page.waitForTimeout(2000);

        // Take final screenshot
        await page.screenshot({ path: 'e2e/screenshots/04-after-final-click.png' });

      } catch (error) {
        console.log('Error occurred during final click:', error);
        await page.screenshot({ path: 'e2e/screenshots/05-error-state.png' });
      }
    } else {
      console.log('Start button not found');
    }

    // Check if we're on an error page
    const errorText = await page.locator('text=Something went wrong').isVisible();
    if (errorText) {
      console.log('ERROR: Found error page!');

      // Capture the error details
      const errorDetails = await page.locator('[data-testid="error-details"]').or(page.locator('pre')).textContent();
      if (errorDetails) {
        console.log('Error Details:', errorDetails);
      }
    }
  });
});