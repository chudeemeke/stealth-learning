import { test, expect } from '@playwright/test';

test.describe('Final GitHub Pages Verification', () => {
  test('Verify site is fully functional', async ({ page }) => {
    console.log('🔍 Testing GitHub Pages deployment...\n');

    // Go to the site
    await page.goto('https://chudeemeke.github.io/stealth-learning/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for potential loading
    await page.waitForTimeout(5000);

    // Take screenshot
    await page.screenshot({
      path: 'e2e/screenshots/final-github-pages-verification.png',
      fullPage: true
    });

    // Check for main content
    const bodyText = await page.locator('body').textContent();
    const hasPlayGames = bodyText?.includes('Play Games') || bodyText?.includes('play games');
    const hasKids = bodyText?.includes('Kids') || bodyText?.includes('kids');
    const hasParent = bodyText?.includes('Parent') || bodyText?.includes('parent');

    console.log('✅ Content Checks:');
    console.log(`  - Has "Play Games": ${hasPlayGames}`);
    console.log(`  - Has "Kids": ${hasKids}`);
    console.log(`  - Has "Parent": ${hasParent}`);

    // Check if buttons are visible
    const playButton = page.locator('button:has-text("Play Games")').first();
    const kidsSection = page.locator('text=/Kids/i').first();
    const parentSection = page.locator('text=/Parent/i').first();

    const playVisible = await playButton.isVisible().catch(() => false);
    const kidsVisible = await kidsSection.isVisible().catch(() => false);
    const parentVisible = await parentSection.isVisible().catch(() => false);

    console.log('\n✅ Visibility Checks:');
    console.log(`  - Play button visible: ${playVisible}`);
    console.log(`  - Kids section visible: ${kidsVisible}`);
    console.log(`  - Parent section visible: ${parentVisible}`);

    // Check background color (should NOT be black)
    const backgroundColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    const isBlack = backgroundColor === 'rgb(0, 0, 0)' || backgroundColor === 'rgba(0, 0, 0, 1)';
    console.log(`\n✅ Black screen: ${isBlack ? 'YES (PROBLEM!)' : 'NO (Good!)'}`);

    // Try clicking Kids section if visible
    if (kidsVisible) {
      await kidsSection.click();
      await page.waitForTimeout(2000);
      await page.screenshot({
        path: 'e2e/screenshots/final-github-pages-kids-section.png',
        fullPage: true
      });
      console.log('\n✅ Kids section clicked and screenshot taken');
    }

    // Final verdict
    const siteWorking = (hasPlayGames || hasKids || hasParent) && !isBlack;

    console.log('\n' + '='.repeat(50));
    console.log('🎯 FINAL VERDICT:');
    console.log('='.repeat(50));
    console.log(`Site is ${siteWorking ? '✅ WORKING!' : '❌ NOT WORKING'}`);

    if (!siteWorking) {
      console.log('\nIssues detected:');
      if (isBlack) console.log('  - Black screen issue');
      if (!hasPlayGames && !hasKids && !hasParent) console.log('  - No content visible');
    }

    expect(siteWorking).toBeTruthy();
  });
});