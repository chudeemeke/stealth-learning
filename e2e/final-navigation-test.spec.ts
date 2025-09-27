import { test, expect } from '@playwright/test';

test.describe('✅ Final Navigation Verification', () => {
  test('Complete user flow: Landing → Games → Mathematics Game', async ({ page }) => {
    console.log('🎯 Final Navigation Test\n');

    // Complete kid login flow
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.locator('button:has-text("I\'m a Kid")').click();
    await page.locator('button').filter({ hasText: /6-8/i }).click();
    await page.locator('input[placeholder*="name" i]').fill('TestPlayer');
    await page.locator('text="🦁"').first().click();
    await page.locator('button').filter({ hasText: /Let's Play/i }).click();

    // Navigate to games
    await page.locator('button').filter({ hasText: /Start Playing|Begin Your Quest/i }).click();
    await page.waitForTimeout(1000);

    const gamesPageUrl = page.url();
    console.log(`✅ Reached games page: ${gamesPageUrl}`);

    // Click Mathematics game
    const beforeUrl = page.url();
    await page.locator('div:has-text("Mathematics")').first().click();
    await page.waitForTimeout(2000);

    const afterUrl = page.url();

    // Verify navigation worked
    expect(afterUrl).toContain('/games/mathematics');
    expect(afterUrl).not.toBe(beforeUrl);

    console.log(`✅ Navigation successful!`);
    console.log(`   From: ${beforeUrl}`);
    console.log(`   To:   ${afterUrl}`);

    // Take final screenshot
    await page.screenshot({ path: 'e2e/screenshots/final-navigation-success.png', fullPage: true });
  });

  test('Test multiple subject navigation', async ({ page }) => {
    console.log('🎮 Testing all subject navigation\n');

    // Quick login
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.locator('button:has-text("I\'m a Kid")').click();
    await page.locator('button').filter({ hasText: /6-8/i }).click();
    await page.locator('input[placeholder*="name" i]').fill('TestPlayer');
    await page.locator('text="🦁"').first().click();
    await page.locator('button').filter({ hasText: /Let's Play/i }).click();
    await page.locator('button').filter({ hasText: /Start Playing|Begin Your Quest/i }).click();

    // Test each subject
    const subjects = ['Mathematics', 'English', 'Science'];

    for (const subject of subjects) {
      console.log(`Testing ${subject}...`);

      // Go back to games if needed
      if (!page.url().includes('/games') || page.url().includes('/games/')) {
        await page.goBack();
        await page.waitForTimeout(500);
      }

      const beforeUrl = page.url();
      await page.locator(`div:has-text("${subject}")`).first().click();
      await page.waitForTimeout(1500);

      const afterUrl = page.url();
      const subjectSlug = subject.toLowerCase();

      expect(afterUrl).toContain(`/games/${subjectSlug}`);
      console.log(`  ✅ ${subject}: ${beforeUrl} → ${afterUrl}`);
    }

    console.log('✅ All subjects navigate correctly!');
  });
});