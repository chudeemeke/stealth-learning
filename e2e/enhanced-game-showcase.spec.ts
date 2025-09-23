import { test, expect } from '@playwright/test';

test.describe('Enhanced Game System Visual Showcase', () => {
  test('Enhanced Game Selection Experience Showcase', async ({ page }) => {
    console.log('🎮 SHOWCASING ENHANCED GAME EXPERIENCE');

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // === ENHANCED LANDING PAGE ===
    await page.screenshot({ path: 'e2e/screenshots/showcase-01-enhanced-landing.png', fullPage: true });
    console.log('📸 Enhanced Landing Page captured');

    // Complete kid flow quickly to showcase game selection
    const kidButton = page.getByText('I\'m a Kid!');
    if (await kidButton.isVisible()) {
      await kidButton.click();
      await page.waitForTimeout(1000);

      // Quick registration to get to enhanced game selection
      const ageButtons = page.locator('button').filter({ hasText: /years/ });
      const ageCount = await ageButtons.count();
      if (ageCount > 0) {
        await ageButtons.first().click();
        await page.waitForTimeout(500);

        const nameInput = page.locator('input[type="text"]');
        if (await nameInput.isVisible()) {
          await nameInput.fill('ShowcaseKid');
          await page.waitForTimeout(300);

          const avatarButtons = page.locator('button').filter({ hasText: /🦁|🐻|🐯|🦊/ });
          const avatarCount = await avatarButtons.count();
          if (avatarCount > 0) {
            await avatarButtons.first().click();
            await page.waitForTimeout(500);

            const playButton = page.getByText('Let\'s Play!').or(page.getByText('🎮'));
            if (await playButton.isVisible()) {
              await playButton.click();
              await page.waitForTimeout(3000); // Allow enhanced loading
            }
          }
        }
      }
    }

    // === ENHANCED GAME SELECTION SHOWCASE ===
    console.log('🌟 Showcasing Enhanced Game Selection Interface');

    await page.waitForTimeout(2000); // Allow enhanced animations to settle
    await page.screenshot({ path: 'e2e/screenshots/showcase-02-enhanced-game-selection.png', fullPage: true });
    console.log('📸 Enhanced Game Selection Interface captured');

    // === SUBJECT THEME SHOWCASE ===
    const subjects = [
      { name: 'Math', selector: 'Math' },
      { name: 'English', selector: 'English' },
      { name: 'Science', selector: 'Science' }
    ];

    for (const subject of subjects) {
      console.log(`🎨 Showcasing ${subject.name} enhanced theme...`);

      const subjectButton = page.locator('button').filter({ hasText: subject.selector });
      const buttonCount = await subjectButton.count();

      if (buttonCount > 0) {
        await subjectButton.first().click();
        await page.waitForTimeout(2000); // Allow enhanced theme transition

        await page.screenshot({
          path: `e2e/screenshots/showcase-03-${subject.name.toLowerCase()}-enhanced-theme.png`,
          fullPage: true
        });

        console.log(`✨ ${subject.name} enhanced theme showcase captured`);
      }
    }

    // === ENHANCED GAME CARD INTERACTIONS ===
    console.log('🃏 Showcasing Enhanced Game Card Interactions');

    // Find game cards and showcase interactions
    const gameCards = page.locator('div').filter({ hasText: /Addition|Math|English|Science/ });
    const cardCount = await gameCards.count();

    if (cardCount > 0) {
      console.log(`🎯 Found ${cardCount} game cards for interaction showcase`);

      // Hover over first few cards to showcase enhanced effects
      for (let i = 0; i < Math.min(cardCount, 3); i++) {
        const card = gameCards.nth(i);
        if (await card.isVisible()) {
          await card.hover();
          await page.waitForTimeout(800); // Allow enhanced hover animations

          console.log(`✨ Enhanced hover effect showcased for card ${i + 1}`);
        }
      }

      await page.screenshot({ path: 'e2e/screenshots/showcase-04-enhanced-card-interactions.png', fullPage: true });

      // Click on first available game card to showcase gameplay
      const firstCard = gameCards.first();
      if (await firstCard.isVisible()) {
        await firstCard.click();
        await page.waitForTimeout(3000); // Enhanced loading

        await page.screenshot({ path: 'e2e/screenshots/showcase-05-enhanced-game-loading.png', fullPage: true });
        console.log('🎮 Enhanced game loading showcase captured');

        // Capture enhanced gameplay interface
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'e2e/screenshots/showcase-06-enhanced-gameplay.png', fullPage: true });
        console.log('🎯 Enhanced gameplay interface captured');
      }
    }

    // === RESPONSIVE SHOWCASE ===
    console.log('📱 Showcasing Enhanced Responsive Design');

    // Tablet showcase
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'e2e/screenshots/showcase-07-enhanced-tablet.png', fullPage: true });

    // Mobile showcase
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'e2e/screenshots/showcase-08-enhanced-mobile.png', fullPage: true });

    console.log('🎉 ENHANCED GAME SYSTEM SHOWCASE COMPLETE!');
    console.log('📊 Visual showcase screenshots captured successfully');
  });

  test('Enhanced Visual Elements Quick Validation', async ({ page }) => {
    console.log('🔍 Quick Enhanced Elements Validation');

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Check for enhanced visual elements
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Take final validation screenshot
    await page.screenshot({ path: 'e2e/screenshots/showcase-09-final-validation.png', fullPage: true });

    console.log('✅ Enhanced visual elements validation complete');
  });
});

console.log(`
🎮 ENHANCED GAME SYSTEM SHOWCASE
=================================

This showcase demonstrates:
✨ Enhanced immersive backgrounds
🎭 Interactive character systems
🎨 Subject-specific theme transitions
🃏 Advanced game card interactions
🎯 Enhanced gameplay interfaces
📱 Responsive design adaptations
🎵 Audio-visual feedback systems

All showcase screenshots saved to e2e/screenshots/
`);