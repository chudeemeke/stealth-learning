import { test, expect } from '@playwright/test';

test.describe('🎯 Navigation Fix Test', () => {
  test('Complete flow: Landing → Profile → Games → Math Game', async ({ page }) => {
    console.log('🚀 Testing fixed navigation flow\n');

    // Start fresh
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Step 1: Click "I'm a Kid"
    console.log('Step 1: Clicking "I\'m a Kid"...');
    const kidButton = page.locator('button:has-text("I\'m a Kid")');
    await kidButton.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'e2e/screenshots/nav-fix-01-after-kid.png' });

    // Step 2: Select age
    console.log('Step 2: Selecting age 6-8...');
    const ageButton = page.locator('button').filter({ hasText: /6-8|6 - 8/i }).first();
    if (await ageButton.count() > 0) {
      await ageButton.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'e2e/screenshots/nav-fix-02-after-age.png' });
    }

    // Step 3: Enter name
    console.log('Step 3: Entering name...');
    const nameInput = page.locator('input[placeholder*="name" i]').first();
    await nameInput.fill('TestPlayer');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'e2e/screenshots/nav-fix-03-name-entered.png' });

    // Step 4: Select avatar (CRITICAL - button is disabled without this!)
    console.log('Step 4: Selecting avatar...');
    // Find and click any avatar (lion, panda, etc)
    const avatarButtons = page.locator('[class*="avatar"], button:has(div:has-text("🦁")), button:has(div:has-text("🐼"))');
    const firstAvatar = avatarButtons.first();
    if (await firstAvatar.count() > 0) {
      await firstAvatar.click();
      await page.waitForTimeout(500);
      console.log('  ✅ Avatar selected');
    } else {
      // Try clicking on emoji directly
      const emojiElement = page.locator('text="🦁"').first();
      if (await emojiElement.count() > 0) {
        await emojiElement.click();
        await page.waitForTimeout(500);
        console.log('  ✅ Avatar selected (emoji click)');
      }
    }
    await page.screenshot({ path: 'e2e/screenshots/nav-fix-04-avatar-selected.png' });

    // Step 5: Click "Let's Play!" (should be enabled now)
    console.log('Step 5: Clicking "Let\'s Play!"...');
    const playButton = page.locator('button').filter({ hasText: /Let's Play/i }).first();

    // Check if button is enabled
    const isDisabled = await playButton.isDisabled();
    console.log(`  Play button disabled: ${isDisabled}`);

    if (!isDisabled) {
      await playButton.click();
      await page.waitForTimeout(2000);

      const afterPlayUrl = page.url();
      console.log(`  After clicking Play: ${afterPlayUrl}`);
      await page.screenshot({ path: 'e2e/screenshots/nav-fix-05-after-play.png' });

      // Step 6: Should be on HomePage now, click "Start Playing!"
      const startPlayingButton = page.locator('button').filter({ hasText: /Start Playing|Begin Your Quest/i }).first();
      if (await startPlayingButton.count() > 0) {
        console.log('\nStep 6: On HomePage, clicking "Start Playing!"...');
        await startPlayingButton.click();
        await page.waitForTimeout(2000);

        const gamesUrl = page.url();
        console.log(`  After Start Playing: ${gamesUrl}`);
        await page.screenshot({ path: 'e2e/screenshots/nav-fix-06-games-page.png' });

        // Step 7: Click on Mathematics game
        console.log('\nStep 7: Clicking Mathematics game...');

        // Capture browser console logs and alerts
        page.on('console', msg => {
          if (msg.type() === 'log') {
            console.log(`  🌐 Browser: ${msg.text()}`);
          }
        });

        let alertTriggered = false;
        page.on('dialog', async dialog => {
          console.log(`  🚨 Alert: ${dialog.message()}`);
          alertTriggered = true;
          await dialog.accept();
        });

        // Try different selectors
        const selectors = [
          'div:has-text("Mathematics")',
          '[class*="cursor-pointer"]:has-text("Mathematics")',
          'h3:has-text("Mathematics")',
          '*:has-text("Mathematics")'
        ];

        let found = false;
        for (const selector of selectors) {
          const element = page.locator(selector).first();
          const count = await element.count();
          console.log(`  Trying selector "${selector}": found ${count} elements`);

          if (count > 0) {
            try {
              const beforeGameUrl = page.url();
              await element.click({ force: true }); // Force click in case element is not visible
              await page.waitForTimeout(2000);

              const afterGameUrl = page.url();
              console.log(`  Before: ${beforeGameUrl}`);
              console.log(`  After:  ${afterGameUrl}`);
              console.log(`  Navigation successful: ${beforeGameUrl !== afterGameUrl ? '✅' : '❌'}`);

              await page.screenshot({ path: 'e2e/screenshots/nav-fix-07-math-game.png' });
              console.log(`  Alert triggered: ${alertTriggered ? '✅' : '❌'}`);
              found = true;
              break;
            } catch (error) {
              console.log(`  Error clicking with selector "${selector}":`, error.message);
            }
          }
        }

        if (!found) {
          console.log('  ❌ Mathematics card not found with any selector');
          const allText = await page.locator('body').textContent();
          console.log('  Page includes "Mathematics":', allText?.includes('Mathematics') ? 'YES' : 'NO');

          // Screenshot for debugging
          await page.screenshot({ path: 'e2e/screenshots/nav-fix-debug-games-page.png' });
        }

        // Check what's on the page now
        const headings = await page.locator('h1, h2').allTextContents();
        console.log(`  Current page headings: ${headings.join(', ')}`);

        // Wait a moment and check for console logs
        await page.waitForTimeout(1000);
      } else {
        console.log('  ❌ "Start Playing" button not found - might still be on landing page');
        const currentButtons = await page.locator('button').allTextContents();
        console.log(`  Available buttons: ${currentButtons.slice(0, 5).join(', ')}`);
      }
    } else {
      console.log('  ❌ Play button is still disabled - avatar might not be selected properly');
    }

    // Final diagnosis
    console.log('\n' + '='.repeat(50));
    console.log('FINAL STATUS:');
    const finalUrl = page.url();
    if (finalUrl.includes('/games/')) {
      console.log('✅ SUCCESS: Navigation to game works!');
      console.log(`   Currently at: ${finalUrl}`);
    } else if (finalUrl.includes('/games')) {
      console.log('⚠️  PARTIAL: Reached games selection page');
      console.log(`   Currently at: ${finalUrl}`);
    } else {
      console.log('❌ FAILED: Navigation issue persists');
      console.log(`   Stuck at: ${finalUrl}`);
    }
  });
});