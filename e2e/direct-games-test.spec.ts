/**
 * Direct Games Page Test
 * Navigates directly to /games to check available subjects
 */

import { test, expect } from '@playwright/test';

test('Direct navigation to games page', async ({ page }) => {
  console.log('🚀 Navigating directly to /games...');

  // Go directly to games page
  await page.goto('http://localhost:3000/games');
  await page.waitForTimeout(3000);

  // Take screenshot
  await page.screenshot({
    path: 'e2e/screenshots/direct-games-page.png',
    fullPage: true
  });

  // Check if redirected to login
  const currentUrl = page.url();
  console.log('📍 Current URL:', currentUrl);

  if (currentUrl.includes('login')) {
    console.log('❌ Redirected to login - not authenticated');

    // Try the kid flow
    await page.goto('http://localhost:3000');
    await page.click('button:has-text("I\'m a Kid!")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("6-8 years")');
    await page.fill('input[placeholder*="name"]', 'TestPlayer');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const avatarExists = await page.locator('.avatar-option').count() > 0;
    if (avatarExists) {
      await page.click('.avatar-option:first-child');
    }

    await page.click('button:has-text("Play")');
    await page.waitForTimeout(2000);

    // Now check if we're on HomePage or GameSelect
    const hasBeginQuest = await page.locator('button:has-text("Begin Your Quest")').count() > 0;
    if (hasBeginQuest) {
      console.log('✅ Found HomePage - clicking Begin Your Quest');
      await page.click('button:has-text("Begin Your Quest")');
      await page.waitForTimeout(2000);
    }
  }

  // Now check for game cards
  console.log('\n📊 Checking for game cards...');

  // Various selectors for game cards
  const selectors = [
    '.game-select-card',
    '.game-card',
    '[class*="subject-card"]',
    '[data-subject]',
    'button[class*="game"]',
    'div[class*="card"]:has(button)'
  ];

  let gameCards = [];
  for (const selector of selectors) {
    const cards = await page.locator(selector).all();
    if (cards.length > 0) {
      console.log(`✅ Found ${cards.length} cards with selector: ${selector}`);
      gameCards = cards;
      break;
    }
  }

  if (gameCards.length === 0) {
    console.log('❌ No game cards found!');

    // Check page content
    const pageTitle = await page.title();
    const h1Text = await page.locator('h1').first().textContent().catch(() => 'No H1');
    const bodyText = await page.locator('body').textContent();

    console.log('📄 Page title:', pageTitle);
    console.log('📝 H1 text:', h1Text);

    // Look for subject names in the page
    const subjects = ['Mathematics', 'English', 'Science', 'Geography', 'Logic', 'Arts'];
    console.log('\n🔍 Searching for subject text in page:');
    for (const subject of subjects) {
      if (bodyText?.includes(subject)) {
        console.log(`  ✓ Found "${subject}" text`);
      }
    }
  } else {
    console.log('\n✅ Game cards found! Listing them:');
    for (let i = 0; i < gameCards.length; i++) {
      const text = await gameCards[i].textContent();
      console.log(`  ${i + 1}. ${text?.trim()}`);

      // Try clicking each card
      await gameCards[i].click();
      await page.waitForTimeout(1500);

      // Check if we navigated to a game
      const newUrl = page.url();
      if (newUrl.includes('/games/')) {
        console.log(`    ✓ Navigated to: ${newUrl}`);

        // Check for Science diagrams specifically
        if (newUrl.includes('science')) {
          const hasDiagram = await page.locator('img:not([src*="icon"]), svg:not([class*="icon"]), .diagram, .illustration').count() > 0;
          console.log(`    ${hasDiagram ? '✓' : '✗'} Science has diagrams: ${hasDiagram}`);

          await page.screenshot({
            path: 'e2e/screenshots/science-game-page.png',
            fullPage: true
          });
        }

        await page.goBack();
        await page.waitForTimeout(1000);
      }
    }
  }

  // Final screenshot
  await page.screenshot({
    path: 'e2e/screenshots/final-games-state.png',
    fullPage: true
  });
});