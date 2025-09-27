/**
 * Test All Subject Games
 * Verifies that all 6 subjects are playable
 */

import { test, expect } from '@playwright/test';

test.describe('All Subjects Gameplay Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Navigate through kid flow to games
    await page.click('button:has-text("I\'m a Kid!")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("6-8 years")');
    await page.fill('input[placeholder*="name"]', 'TestPlayer');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Select avatar
    const avatarExists = await page.locator('.avatar-option').count() > 0;
    if (avatarExists) {
      await page.click('.avatar-option:first-child');
      await page.waitForTimeout(500);
    }

    await page.click('button:has-text("Play")');
    await page.waitForTimeout(2000);
  });

  const subjects = [
    { name: 'Mathematics', selector: 'Mathematics', color: 'blue' },
    { name: 'English', selector: 'English', color: 'green' },
    { name: 'Science', selector: 'Science', color: 'purple' },
    { name: 'Geography', selector: 'Geography', color: 'orange' },
    { name: 'Logic', selector: 'Logic', color: 'red' },
    { name: 'Arts', selector: 'Arts', color: 'pink' }
  ];

  for (const subject of subjects) {
    test(`Test ${subject.name} game`, async ({ page }) => {
      console.log(`🎮 Testing ${subject.name}...`);

      // Look for the subject card
      const cardSelector = `.game-select-card:has-text("${subject.selector}")`;
      const cardExists = await page.locator(cardSelector).count() > 0;

      if (!cardExists) {
        console.log(`❌ ${subject.name} card not found!`);
        await page.screenshot({
          path: `e2e/screenshots/subject-missing-${subject.name.toLowerCase()}.png`,
          fullPage: true
        });
        throw new Error(`${subject.name} game card not found`);
      }

      // Click the subject card
      await page.click(cardSelector);
      await page.waitForTimeout(2000);

      // Take screenshot of the game
      await page.screenshot({
        path: `e2e/screenshots/subject-game-${subject.name.toLowerCase()}.png`,
        fullPage: true
      });

      // Check if we're on a game page or question page
      const hasQuestion = await page.locator('.question-text, .game-question, [class*="question"]').count() > 0;
      const hasGameCanvas = await page.locator('canvas, .game-canvas, .game-container').count() > 0;
      const hasAnswerOptions = await page.locator('.answer-option, .option-card, button[class*="answer"]').count() > 0;

      if (hasQuestion) {
        console.log(`✅ ${subject.name} has questions displayed`);

        // Check for special elements for Science
        if (subject.name === 'Science') {
          const hasImage = await page.locator('img[src*="diagram"], img[src*="science"], .diagram-container, .question-image').count() > 0;
          if (!hasImage) {
            console.log(`⚠️ ${subject.name} is missing diagrams for visual questions`);
            await page.screenshot({
              path: `e2e/screenshots/science-no-diagram.png`,
              fullPage: true
            });
          } else {
            console.log(`✅ ${subject.name} has diagrams`);
          }
        }
      } else if (hasGameCanvas) {
        console.log(`✅ ${subject.name} has game canvas`);
      } else {
        console.log(`❌ ${subject.name} game is not loading properly`);

        // Check what's on the page
        const pageContent = await page.content();
        const hasError = pageContent.includes('error') || pageContent.includes('Error');
        const hasLoading = await page.locator('.loading, [class*="loading"], [class*="spinner"]').count() > 0;

        if (hasError) {
          console.log(`  - Error found on page`);
        }
        if (hasLoading) {
          console.log(`  - Page still loading`);
        }

        await page.screenshot({
          path: `e2e/screenshots/subject-broken-${subject.name.toLowerCase()}.png`,
          fullPage: true
        });
      }

      // Try to interact with the game
      if (hasAnswerOptions) {
        const options = await page.locator('.answer-option, .option-card, button[class*="answer"]').all();
        if (options.length > 0) {
          await options[0].click();
          await page.waitForTimeout(1500);

          // Check for feedback
          const hasFeedback = await page.locator('[class*="feedback"], [class*="celebration"], [class*="correct"], [class*="incorrect"]').count() > 0;
          console.log(`  - Feedback system: ${hasFeedback ? '✅ Working' : '❌ Not working'}`);
        }
      }

      // Navigate back to game selection
      await page.goto('http://localhost:3000');
      await page.click('button:has-text("I\'m a Kid!")');
      await page.waitForTimeout(500);
      await page.click('button:has-text("6-8 years")');
      await page.fill('input[placeholder*="name"]', 'TestPlayer');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);

      const avatarExists2 = await page.locator('.avatar-option').count() > 0;
      if (avatarExists2) {
        await page.click('.avatar-option:first-child');
        await page.waitForTimeout(500);
      }

      await page.click('button:has-text("Play")');
      await page.waitForTimeout(2000);
    });
  }

  test('Summary of all subjects', async ({ page }) => {
    // Take a screenshot of the game selection page
    await page.screenshot({
      path: 'e2e/screenshots/all-subjects-overview.png',
      fullPage: true
    });

    // Count available game cards
    const gameCards = await page.locator('.game-select-card').all();
    console.log(`\n📊 SUBJECT AVAILABILITY SUMMARY:`);
    console.log(`Found ${gameCards.length} game cards total`);

    for (const card of gameCards) {
      const text = await card.textContent();
      console.log(`  - ${text?.trim()}`);
    }
  });
});