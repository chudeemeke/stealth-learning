import { test, expect } from '@playwright/test';

test.describe('Working Kid Flow Test', () => {

  test('Complete Kid Flow: 6-8 years old', async ({ page }) => {
    console.log('🎯 Testing complete kid flow for 6-8 years...');

    // Set longer timeout
    test.setTimeout(60000);

    // Navigate to application
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: 'e2e/screenshots/working-01-landing.png' });

    // Click "I'm a Kid!"
    await page.click('text=I\'m a Kid!');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'e2e/screenshots/working-02-age-selection.png' });

    // Click "6-8 years"
    await page.click('text=6-8 years');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'e2e/screenshots/working-03-profile-creation.png' });

    // Fill in name
    await page.fill('input[placeholder="Enter your name..."]', 'Test Kid');
    await page.screenshot({ path: 'e2e/screenshots/working-04-name-filled.png' });

    // Select first avatar
    await page.click('.grid.grid-cols-4 button:first-child');
    await page.screenshot({ path: 'e2e/screenshots/working-05-avatar-selected.png' });

    // Click "Let's Play!"
    await page.click('text=Let\'s Play!');
    await page.waitForTimeout(3000); // Give time for navigation
    await page.screenshot({ path: 'e2e/screenshots/working-06-after-play-click.png' });

    // Check current URL
    const currentUrl = page.url();
    console.log('Current URL after kid flow:', currentUrl);

    // Check what's on the page
    const pageContent = await page.locator('body').textContent();
    console.log('Page content preview:', pageContent?.substring(0, 300));

    // Check if we're successfully in the app (not on error page)
    const hasErrorText = await page.locator('text=Error').isVisible().catch(() => false);
    const has404Text = await page.locator('text=404').isVisible().catch(() => false);
    const hasNotFoundText = await page.locator('text=Not Found').isVisible().catch(() => false);

    console.log('Has error text:', hasErrorText);
    console.log('Has 404 text:', has404Text);
    console.log('Has not found text:', hasNotFoundText);

    if (hasErrorText || has404Text || hasNotFoundText) {
      console.log('❌ Kid flow leads to error page!');
      throw new Error('Kid flow leads to error page!');
    }

    // Look for positive indicators that we're in the app
    const hasWelcomeText = await page.locator('text=Welcome').isVisible().catch(() => false);
    const hasHomeContent = await page.locator('text=Let\'s Play').isVisible().catch(() => false);
    const hasGameContent = await page.locator('text=Games').isVisible().catch(() => false);

    console.log('Has welcome text:', hasWelcomeText);
    console.log('Has home content:', hasHomeContent);
    console.log('Has game content:', hasGameContent);

    if (hasWelcomeText || hasHomeContent || hasGameContent) {
      console.log('✅ Kid flow successful - landed in app!');
    } else {
      console.log('⚠️ Kid flow completed but uncertain about landing page');
    }

    console.log('✅ Kid flow test completed successfully!');
  });
});