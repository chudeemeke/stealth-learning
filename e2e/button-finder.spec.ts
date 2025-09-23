import { test, expect } from '@playwright/test';

test.describe('Button Finder', () => {
  test('should find all buttons after kid selection', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Click child/kid button
    const childButton = page.getByText('I\'m a Kid!').or(page.getByRole('button', { name: /kid|child/i }));
    if (await childButton.isVisible()) {
      await childButton.click();
      await page.waitForTimeout(500);
    }

    // Fill name
    const nameInput = page.locator('input[type="text"]').or(page.locator('input[placeholder*="name"]'));
    if (await nameInput.isVisible()) {
      await nameInput.fill('TestKid');
    }

    // Select age
    const ageButtons = page.locator('button').filter({ hasText: /6-8/ });
    if (await ageButtons.first().isVisible()) {
      await ageButtons.first().click();
    }

    // Select emoji
    const emojiButtons = page.locator('button').filter({ hasText: /🦁|🐼|🦄|🐸|🦊|🐧|🦋|🐢/ });
    if (await emojiButtons.first().isVisible()) {
      await emojiButtons.first().click();
    }

    await page.waitForTimeout(1000);

    // Find ALL buttons on the page
    const allButtons = await page.locator('button').all();
    console.log(`\n=== FOUND ${allButtons.length} BUTTONS ===`);

    for (let i = 0; i < allButtons.length; i++) {
      const buttonText = await allButtons[i].textContent();
      const isVisible = await allButtons[i].isVisible();
      const isEnabled = await allButtons[i].isEnabled();

      console.log(`Button ${i}: "${buttonText}" (visible: ${isVisible}, enabled: ${isEnabled})`);
    }

    // Take final screenshot
    await page.screenshot({ path: 'e2e/screenshots/all-buttons-state.png' });
  });
});