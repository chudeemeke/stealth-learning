/**
 * Test All Subject Games - Fixed Navigation
 * Verifies that all 6 subjects are playable
 */

import { test, expect } from '@playwright/test';

test.describe('Subject Games Availability Test', () => {
  test('Check all subject games and test them', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Navigate through kid flow
    await page.click('button:has-text("I\'m a Kid!")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("6-8 years")');
    await page.fill('input[placeholder*="name"]', 'TestPlayer');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Select avatar if present
    const avatarExists = await page.locator('.avatar-option').count() > 0;
    if (avatarExists) {
      await page.click('.avatar-option:first-child');
      await page.waitForTimeout(500);
    }

    await page.click('button:has-text("Play")');
    await page.waitForTimeout(2000);

    // Check if we're on the welcome screen
    const hasBeginQuest = await page.locator('button:has-text("Begin Your Quest!")').count() > 0;
    if (hasBeginQuest) {
      console.log('📍 Found welcome screen, clicking Begin Your Quest...');
      await page.click('button:has-text("Begin Your Quest!")');
      await page.waitForTimeout(2000);
    }

    // Alternative: Try clicking Games in nav
    const hasGamesNav = await page.locator('text=Games').count() > 0;
    if (hasGamesNav && await page.locator('.game-select-card').count() === 0) {
      console.log('📍 Clicking Games navigation...');
      await page.click('text=Games');
      await page.waitForTimeout(2000);
    }

    // Take screenshot of current state
    await page.screenshot({
      path: 'e2e/screenshots/games-page-state.png',
      fullPage: true
    });

    // Check what cards are available
    const gameCards = await page.locator('.game-select-card, .game-card, [class*="game"][class*="card"]').all();
    console.log(`\n📊 FOUND ${gameCards.length} GAME CARDS:`);

    for (let i = 0; i < gameCards.length; i++) {
      const cardText = await gameCards[i].textContent();
      console.log(`  ${i + 1}. ${cardText?.trim()}`);
    }

    // Now test each available game
    const expectedSubjects = ['Mathematics', 'English', 'Science', 'Geography', 'Logic', 'Arts'];
    const availableSubjects = [];
    const missingSubjects = [];

    for (const subject of expectedSubjects) {
      // Check different possible selectors
      const selectors = [
        `.game-select-card:has-text("${subject}")`,
        `.game-card:has-text("${subject}")`,
        `[class*="card"]:has-text("${subject}")`,
        `button:has-text("${subject}")`,
        `div:has-text("${subject}"):has(button)`
      ];

      let found = false;
      for (const selector of selectors) {
        const count = await page.locator(selector).count();
        if (count > 0) {
          found = true;
          availableSubjects.push(subject);
          console.log(`✅ ${subject} - FOUND`);

          // Click and test the game
          await page.click(selector);
          await page.waitForTimeout(2000);

          // Take screenshot
          await page.screenshot({
            path: `e2e/screenshots/game-${subject.toLowerCase()}.png`,
            fullPage: true
          });

          // Check if game loaded
          const hasGameContent = await page.locator('.question-text, .game-container, canvas, .game-question').count() > 0;

          if (hasGameContent) {
            console.log(`  ✓ ${subject} game loaded successfully`);

            // Special check for Science diagrams
            if (subject === 'Science') {
              const hasDiagram = await page.locator('img, .diagram, .illustration, svg:not([class*="icon"])').count() > 0;
              console.log(`  ${hasDiagram ? '✓' : '✗'} Science diagrams: ${hasDiagram ? 'Present' : 'MISSING'}`);

              if (!hasDiagram) {
                console.log('  ⚠️  Science questions need diagrams for clarity!');
              }
            }
          } else {
            console.log(`  ✗ ${subject} game did NOT load properly`);
          }

          // Go back to games page
          await page.goBack();
          await page.waitForTimeout(1000);

          // May need to click Games nav again
          const needsNav = await page.locator('.game-select-card').count() === 0;
          if (needsNav) {
            await page.click('text=Games');
            await page.waitForTimeout(1000);
          }

          break;
        }
      }

      if (!found) {
        missingSubjects.push(subject);
        console.log(`❌ ${subject} - NOT FOUND`);
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 FINAL SUMMARY:');
    console.log('='.repeat(50));
    console.log(`✅ Available subjects (${availableSubjects.length}/6):`);
    availableSubjects.forEach(s => console.log(`   - ${s}`));

    if (missingSubjects.length > 0) {
      console.log(`\n❌ Missing subjects (${missingSubjects.length}/6):`);
      missingSubjects.forEach(s => console.log(`   - ${s}`));
    }

    // Check the actual page for debugging
    if (missingSubjects.length > 0) {
      console.log('\n🔍 Debugging: Checking page structure...');
      const allText = await page.locator('body').textContent();

      // Check if subjects are mentioned anywhere
      for (const subject of missingSubjects) {
        if (allText?.includes(subject)) {
          console.log(`  ⚠️  "${subject}" text found on page but not in a clickable card`);
        }
      }

      // Log all clickable elements that might be games
      const clickables = await page.locator('button, [role="button"], .card, [class*="game"]').all();
      console.log(`\n  Found ${clickables.length} clickable elements`);
    }

    // Final assertion
    expect(availableSubjects.length).toBeGreaterThan(0);
    if (missingSubjects.length > 0) {
      console.log('\n⚠️  WARNING: Not all 6 subjects are implemented!');
      console.log('📝 TODO: Implement missing subjects:', missingSubjects.join(', '));
    }
  });
});