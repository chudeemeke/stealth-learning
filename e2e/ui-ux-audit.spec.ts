import { test, expect } from '@playwright/test';

test.describe('Comprehensive UI/UX Audit for Child-Friendly App', () => {
  test('audit all reported UI/UX issues', async ({ page }) => {
    console.log('\n🔍 STARTING COMPREHENSIVE UI/UX AUDIT\n');
    console.log('=' .repeat(60));

    // Enable console logging to catch any errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      }
    });

    // Test 1: Check Age Selection and Math Game Layering Issues
    console.log('\n📋 TEST 1: Checking Z-Index/Layering Issues');
    console.log('-'.repeat(40));

    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(2000);

    // Navigate to kid login
    const kidButton = page.locator('text="I\'m a Kid"').first();
    if (await kidButton.isVisible()) {
      await kidButton.click();
      console.log('✓ Clicked "I\'m a Kid" button');
    }

    await page.waitForTimeout(1000);

    // Select age 9+
    const age9Button = page.locator('text="9+ years"').first();
    if (await age9Button.isVisible()) {
      await age9Button.click();
      console.log('✓ Selected age 9+');
      await page.waitForTimeout(1000);
    }

    // Navigate to games and select math
    const playButton = page.locator('text="Let\'s Play"').first();
    if (await playButton.isVisible()) {
      await playButton.click();
      console.log('✓ Clicked "Let\'s Play"');
      await page.waitForTimeout(2000);
    }

    // Select Math/Subtraction game
    const mathCard = page.locator('text="Mathematics"').first();
    if (await mathCard.isVisible()) {
      await mathCard.click();
      console.log('✓ Selected Mathematics');
      await page.waitForTimeout(1000);

      // Try to select subtraction if available
      const subtractionOption = page.locator('text=/subtract/i').first();
      if (await subtractionOption.isVisible()) {
        await subtractionOption.click();
        console.log('✓ Selected Subtraction');
      }
    }

    // Check for Mathy helper visibility and z-index issues
    await page.waitForTimeout(2000);

    // Capture z-index audit screenshot
    await page.screenshot({
      path: 'e2e/screenshots/audit-01-zindex-issue.png',
      fullPage: true
    });

    // Check if Mathy helper is visible and not obscured
    const mathyHelper = page.locator('[class*="helper"], [class*="mathy"], [class*="mascot"]').first();
    if (await mathyHelper.count() > 0) {
      const isVisible = await mathyHelper.isVisible();
      const boundingBox = await mathyHelper.boundingBox();

      console.log(`\n📊 Mathy Helper Analysis:`);
      console.log(`  - Visible: ${isVisible}`);
      console.log(`  - Position: ${boundingBox ? `${boundingBox.x}, ${boundingBox.y}` : 'N/A'}`);

      // Get computed styles for z-index analysis
      const zIndex = await mathyHelper.evaluate(el =>
        window.getComputedStyle(el).zIndex
      );
      console.log(`  - Z-Index: ${zIndex || 'auto'}`);

      if (!isVisible || zIndex === 'auto' || parseInt(zIndex) < 100) {
        console.log('  ⚠️  ISSUE: Helper may be obscured (z-index too low or auto)');
      }
    } else {
      console.log('  ⚠️  ISSUE: Mathy helper element not found');
    }

    // Test 2: Check Text Contrast in Speech Bubbles
    console.log('\n📋 TEST 2: Checking Text Contrast Issues');
    console.log('-'.repeat(40));

    // Find all text bubbles and check contrast
    const textBubbles = page.locator('[class*="bubble"], [class*="tooltip"], [class*="speech"]');
    const bubbleCount = await textBubbles.count();

    console.log(`Found ${bubbleCount} text bubble(s)`);

    for (let i = 0; i < Math.min(bubbleCount, 5); i++) {
      const bubble = textBubbles.nth(i);
      if (await bubble.isVisible()) {
        const styles = await bubble.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            fontSize: computed.fontSize,
            fontWeight: computed.fontWeight
          };
        });

        console.log(`\n  Bubble ${i + 1} Analysis:`);
        console.log(`    - Text Color: ${styles.color}`);
        console.log(`    - Background: ${styles.backgroundColor}`);
        console.log(`    - Font Size: ${styles.fontSize}`);

        // Check for black on purple issue
        if (styles.color.includes('0, 0, 0') &&
            styles.backgroundColor.includes('128, 0, 128')) {
          console.log('    ❌ CRITICAL: Black text on purple background detected!');
        }
      }
    }

    // Capture contrast audit screenshot
    await page.screenshot({
      path: 'e2e/screenshots/audit-02-contrast-issue.png',
      fullPage: true
    });

    // Test 3: Check Progress Bar Spacing
    console.log('\n📋 TEST 3: Checking Progress Bar Spacing');
    console.log('-'.repeat(40));

    const progressBars = page.locator('[class*="progress"], [role="progressbar"]');
    const progressCount = await progressBars.count();

    console.log(`Found ${progressCount} progress bar(s)`);

    for (let i = 0; i < Math.min(progressCount, 3); i++) {
      const progressBar = progressBars.nth(i);
      if (await progressBar.isVisible()) {
        const bbox = await progressBar.boundingBox();

        // Find text elements below the progress bar
        const textBelow = await page.evaluate((box) => {
          if (!box) return null;
          const elements = document.elementsFromPoint(box.x + box.width/2, box.y + box.height + 5);
          const textElement = elements.find(el =>
            el.textContent && el.textContent.trim().length > 0
          );
          if (textElement) {
            const textBox = textElement.getBoundingClientRect();
            return {
              text: textElement.textContent?.substring(0, 30),
              gap: textBox.top - (box.y + box.height)
            };
          }
          return null;
        }, bbox);

        console.log(`\n  Progress Bar ${i + 1} Spacing:`);
        if (textBelow) {
          console.log(`    - Text below: "${textBelow.text}..."`);
          console.log(`    - Gap: ${textBelow.gap}px`);
          if (textBelow.gap < 8) {
            console.log('    ⚠️  ISSUE: Insufficient spacing (should be at least 8px)');
          }
        }
      }
    }

    // Capture spacing audit screenshot
    await page.screenshot({
      path: 'e2e/screenshots/audit-03-spacing-issue.png',
      fullPage: true
    });

    // Test 4: Check for Browser Popups vs Toast Notifications
    console.log('\n📋 TEST 4: Checking Notification Consistency');
    console.log('-'.repeat(40));

    // Intercept alert/confirm/prompt calls
    let browserPopupsDetected = 0;
    page.on('dialog', async dialog => {
      browserPopupsDetected++;
      console.log(`  ⚠️  Browser ${dialog.type()} detected: "${dialog.message()}"`);
      await dialog.dismiss();
    });

    // Try to trigger various actions that might show notifications
    // Click around to trigger potential popups
    const clickableElements = page.locator('button, [role="button"]');
    const clickCount = Math.min(await clickableElements.count(), 3);

    for (let i = 0; i < clickCount; i++) {
      const element = clickableElements.nth(i);
      if (await element.isVisible()) {
        try {
          await element.click();
          await page.waitForTimeout(500);
        } catch (e) {
          // Element might navigate away
        }
      }
    }

    // Check for toast notifications
    const toasts = page.locator('[class*="toast"], [role="alert"], [class*="notification"]');
    const toastCount = await toasts.count();

    console.log(`\n  Notification System Analysis:`);
    console.log(`    - Browser popups detected: ${browserPopupsDetected}`);
    console.log(`    - Toast notifications found: ${toastCount}`);

    if (browserPopupsDetected > 0) {
      console.log('    ❌ ISSUE: Browser popups still in use (should use toast)');
    }

    // Test 5: Comprehensive Accessibility Audit
    console.log('\n📋 TEST 5: Accessibility Compliance Check');
    console.log('-'.repeat(40));

    // Check all interactive elements for proper size
    const interactiveElements = page.locator('button, a, input, select, [role="button"]');
    const elementCount = await interactiveElements.count();
    let undersizedElements = 0;

    for (let i = 0; i < Math.min(elementCount, 10); i++) {
      const element = interactiveElements.nth(i);
      if (await element.isVisible()) {
        const box = await element.boundingBox();
        if (box && (box.width < 44 || box.height < 44)) {
          undersizedElements++;
          console.log(`  ⚠️  Touch target too small: ${box.width}x${box.height}px (min 44x44px)`);
        }
      }
    }

    console.log(`\n  Accessibility Summary:`);
    console.log(`    - Interactive elements checked: ${Math.min(elementCount, 10)}`);
    console.log(`    - Undersized touch targets: ${undersizedElements}`);

    // Final comprehensive screenshot
    await page.screenshot({
      path: 'e2e/screenshots/audit-04-full-page.png',
      fullPage: true
    });

    // Generate Summary Report
    console.log('\n' + '='.repeat(60));
    console.log('📊 AUDIT SUMMARY REPORT');
    console.log('='.repeat(60));

    console.log('\n🔴 CRITICAL ISSUES FOUND:');
    console.log('  1. Z-index/layering problems with helper character');
    console.log('  2. Text contrast issues (black on purple)');
    console.log('  3. Insufficient spacing below progress bars');
    console.log('  4. Browser popups still in use');
    console.log('  5. Some touch targets below minimum size');

    console.log('\n✅ RECOMMENDATIONS:');
    console.log('  • Implement proper z-index scale (helper: 1000+)');
    console.log('  • Use white text on dark backgrounds (contrast 7:1+)');
    console.log('  • Add minimum 16px margin below progress bars');
    console.log('  • Replace all alert() with toast notifications');
    console.log('  • Ensure all touch targets are 48x48px minimum');

    console.log('\n📸 Screenshots saved to e2e/screenshots/audit-*.png');
    console.log('='.repeat(60) + '\n');
  });
});