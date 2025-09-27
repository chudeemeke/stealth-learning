import { test, expect } from '@playwright/test';

test.describe('🎮 Visual Game Navigation Test', () => {
  test('Walk through complete kid flow to game selection', async ({ page }) => {
    console.log('📸 VISUAL WALKTHROUGH: Testing game navigation issue\n');

    // Start at localhost
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // STEP 1: Landing page
    console.log('STEP 1: Landing Page');
    await page.screenshot({ path: 'e2e/screenshots/flow-01-landing.png', fullPage: true });
    const kidButton = page.locator('button:has-text("I\'m a Kid")');
    expect(await kidButton.count()).toBeGreaterThan(0);
    console.log('  ✅ Found "I\'m a Kid" button\n');

    // STEP 2: Click Kid button
    console.log('STEP 2: Clicking "I\'m a Kid" button...');
    await kidButton.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'e2e/screenshots/flow-02-after-kid-click.png', fullPage: true });

    // Check what happened
    const currentUrl = page.url();
    console.log(`  Current URL: ${currentUrl}`);

    // Look for profile creation or age selection
    const nameInput = page.locator('input[placeholder*="name" i], input[type="text"]').first();
    const ageButtons = page.locator('button').filter({ hasText: /years|age/i });

    if (await nameInput.count() > 0) {
      console.log('  ✅ Profile creation screen appeared\n');

      // STEP 3: Enter name
      console.log('STEP 3: Entering kid name...');
      await nameInput.fill('TestKid');
      await page.screenshot({ path: 'e2e/screenshots/flow-03-name-entered.png', fullPage: true });

      // Find continue button
      const continueBtn = page.locator('button').filter({
        hasText: /continue|next|done|play|start/i
      }).first();

      if (await continueBtn.count() > 0) {
        console.log('  Clicking continue...');
        await continueBtn.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'e2e/screenshots/flow-04-after-continue.png', fullPage: true });
      }
    } else if (await ageButtons.count() > 0) {
      console.log('  ✅ Age selection screen appeared\n');
    } else {
      console.log('  ⚠️ Unknown screen - checking for game selection...\n');
    }

    // STEP 4: Look for age selection if present
    const ageButton = page.locator('button').filter({ hasText: /6-8|6 - 8/i }).first();
    if (await ageButton.count() > 0) {
      console.log('STEP 4: Selecting age 6-8...');
      await ageButton.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'e2e/screenshots/flow-05-after-age.png', fullPage: true });
      console.log(`  New URL: ${page.url()}\n`);
    }

    // STEP 5: Look for avatar selection
    const avatarSection = page.locator('text=/avatar|character|choose/i').first();
    if (await avatarSection.count() > 0) {
      console.log('STEP 5: Avatar selection screen...');
      const firstAvatar = page.locator('[class*="avatar"], img[alt*="avatar"]').first();
      if (await firstAvatar.count() > 0) {
        await firstAvatar.click();
        await page.waitForTimeout(1000);
      }

      const playBtn = page.locator('button').filter({ hasText: /play|start|begin/i }).first();
      if (await playBtn.count() > 0) {
        await playBtn.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'e2e/screenshots/flow-06-after-avatar.png', fullPage: true });
      }
    }

    // STEP 6: Look for game selection screen
    console.log('STEP 6: Checking for game selection...');
    await page.waitForTimeout(2000);

    // Check for game cards or subject tiles
    const gameCards = await page.locator('[class*="card"], [class*="game"], [class*="subject"]').all();
    const gameButtons = await page.locator('button').filter({
      hasText: /math|english|science|play|start playing/i
    }).all();

    console.log(`  Found ${gameCards.length} potential game cards`);
    console.log(`  Found ${gameButtons.length} game-related buttons`);

    await page.screenshot({ path: 'e2e/screenshots/flow-07-game-selection.png', fullPage: true });

    if (gameButtons.length > 0) {
      // Try clicking a math game
      const mathButton = page.locator('button, [class*="card"]').filter({
        hasText: /math/i
      }).first();

      if (await mathButton.count() > 0) {
        console.log('\nSTEP 7: Clicking Mathematics game...');
        const beforeUrl = page.url();
        console.log(`  Before URL: ${beforeUrl}`);

        await mathButton.click();
        await page.waitForTimeout(3000);

        const afterUrl = page.url();
        console.log(`  After URL: ${afterUrl}`);
        console.log(`  URL changed: ${beforeUrl !== afterUrl ? '✅' : '❌'}`);

        await page.screenshot({ path: 'e2e/screenshots/flow-08-after-math-click.png', fullPage: true });

        // Check if we're back at start
        const backAtStart = await page.locator('button:has-text("I\'m a Kid")').count() > 0;
        const hasStartPlaying = await page.locator('button:has-text("Start Playing")').count() > 0;

        if (backAtStart) {
          console.log('\n❌ ISSUE CONFIRMED: Returned to landing page!');
        } else if (hasStartPlaying) {
          console.log('\n❌ ISSUE CONFIRMED: Back at game selection with "Start Playing" button!');
        } else {
          // Check what screen we're on
          const headings = await page.locator('h1, h2').allTextContents();
          console.log('\n  Current screen headings:', headings);
        }
      }
    }

    // Final diagnosis
    console.log('\n' + '='.repeat(60));
    console.log('📊 DIAGNOSIS:');
    console.log('='.repeat(60));

    const finalUrl = page.url();
    const isStillHome = finalUrl.includes('localhost:3001') && !finalUrl.includes('/play');

    if (isStillHome) {
      console.log('❌ Navigation Issue Confirmed:');
      console.log('  - Clicking games does not navigate to game page');
      console.log('  - App returns to home/selection screen');
      console.log('  - Missing route handlers for /play/* paths');
      console.log('\n💡 Likely Causes:');
      console.log('  1. Router not configured for game routes');
      console.log('  2. Missing navigate() calls in click handlers');
      console.log('  3. Component re-mounting instead of navigating');
    } else {
      console.log('✅ Navigation working - reached:', finalUrl);
    }
  });

  test('Test all navigation paths', async ({ page }) => {
    console.log('\n🔍 Testing All Navigation Paths\n');

    const routes = [
      { path: '/', expected: 'home' },
      { path: '/play', expected: 'game selection' },
      { path: '/play/mathematics', expected: 'math game' },
      { path: '/play/english', expected: 'english game' },
      { path: '/play/science', expected: 'science game' },
      { path: '/games', expected: 'games list' },
      { path: '/profile', expected: 'profile' }
    ];

    for (const route of routes) {
      await page.goto(`http://localhost:3001${route.path}`, {
        waitUntil: 'domcontentloaded'
      });
      await page.waitForTimeout(1000);

      const buttons = await page.locator('button').allTextContents();
      const headings = await page.locator('h1, h2').allTextContents();

      console.log(`Route: ${route.path}`);
      console.log(`  Expected: ${route.expected}`);
      console.log(`  Buttons: [${buttons.slice(0, 3).join(', ')}]`);
      console.log(`  Headings: [${headings.join(', ')}]`);

      // Check if it's the home page
      const isHomePage = buttons.some(b => b.includes("I'm a Kid"));
      console.log(`  Is Home Page: ${isHomePage ? '❌ YES (wrong!)' : '✅ NO'}\n`);

      if (isHomePage && route.path !== '/') {
        await page.screenshot({
          path: `e2e/screenshots/route-error-${route.path.replace(/\//g, '-')}.png`
        });
      }
    }
  });
});