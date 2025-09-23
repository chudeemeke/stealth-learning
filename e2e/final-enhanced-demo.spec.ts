import { test, expect } from '@playwright/test';

test('Final Enhanced Experience Demo', async ({ page }) => {
  console.log('🎮 FINAL ENHANCED EXPERIENCE DEMONSTRATION');

  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // === CAPTURE ENHANCED LANDING ===
  await page.screenshot({ path: 'e2e/screenshots/FINAL-01-enhanced-landing.png', fullPage: true });
  console.log('📸 FINAL: Enhanced landing page captured');

  // === QUICK NAVIGATION TO SHOWCASE ===
  const kidButton = page.getByText('I\'m a Kid!');
  if (await kidButton.isVisible()) {
    await kidButton.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'e2e/screenshots/FINAL-02-kid-selection.png', fullPage: true });

    // Quick setup to show game selection
    try {
      // Find any age button
      const ageButtons = page.locator('button[class*="age"], button').filter({ hasText: /year/ });
      const ageCount = await ageButtons.count();
      if (ageCount > 0) {
        await ageButtons.first().click();
        await page.waitForTimeout(800);

        // Name input
        const nameInput = page.locator('input[type="text"]');
        if (await nameInput.isVisible()) {
          await nameInput.fill('DemoKid');
          await page.waitForTimeout(500);

          // Avatar selection
          const avatarButtons = page.locator('button').filter({ hasText: /🦁|🐻|🐯|🦊|😊|🎯/ });
          const avatarCount = await avatarButtons.count();
          if (avatarCount > 0) {
            await avatarButtons.first().click();
            await page.waitForTimeout(500);

            // Play button - be more specific
            const playButton = page.locator('button').filter({ hasText: /Let's Play/ });
            if (await playButton.isVisible()) {
              await playButton.click();
              await page.waitForTimeout(4000); // Enhanced loading

              await page.screenshot({ path: 'e2e/screenshots/FINAL-03-enhanced-game-selection.png', fullPage: true });
              console.log('🎯 FINAL: Enhanced game selection interface captured');

              // Show theme switching
              const mathButton = page.locator('button').filter({ hasText: /Math/ });
              if (await mathButton.isVisible()) {
                await mathButton.click();
                await page.waitForTimeout(2000);
                await page.screenshot({ path: 'e2e/screenshots/FINAL-04-math-theme.png', fullPage: true });
                console.log('🧮 FINAL: Math theme showcase captured');
              }

              const englishButton = page.locator('button').filter({ hasText: /English/ });
              if (await englishButton.isVisible()) {
                await englishButton.click();
                await page.waitForTimeout(2000);
                await page.screenshot({ path: 'e2e/screenshots/FINAL-05-english-theme.png', fullPage: true });
                console.log('📚 FINAL: English theme showcase captured');
              }

              const scienceButton = page.locator('button').filter({ hasText: /Science/ });
              if (await scienceButton.isVisible()) {
                await scienceButton.click();
                await page.waitForTimeout(2000);
                await page.screenshot({ path: 'e2e/screenshots/FINAL-06-science-theme.png', fullPage: true });
                console.log('🔬 FINAL: Science theme showcase captured');
              }
            }
          }
        }
      }
    } catch (error) {
      console.log('⚠️ Navigation issue, but main interface captured');
    }
  }

  console.log('🎉 FINAL ENHANCED EXPERIENCE DEMONSTRATION COMPLETE!');
});

console.log('🎮 Ready for Enhanced Experience at http://localhost:5173/');