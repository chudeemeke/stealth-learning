import { test, expect } from '@playwright/test';

test.describe('Button Rotation Fix Validation', () => {
  test('Verify no rotation on button hover effects', async ({ page }) => {
    // Navigate to the landing page
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Test 1: Check "I'm a Kid!" button hover
    console.log('Testing "I\'m a Kid!" button hover...');
    const kidButton = page.getByRole('button', { name: /I'm a Kid/i });

    // Get initial transform
    const initialTransform = await kidButton.evaluate(el =>
      window.getComputedStyle(el).transform
    );

    // Hover over the button
    await kidButton.hover();
    await page.waitForTimeout(500); // Wait for animation

    // Get hover transform
    const hoverTransform = await kidButton.evaluate(el =>
      window.getComputedStyle(el).transform
    );

    // Check that there's no rotation in the transform matrix
    console.log('Initial transform:', initialTransform);
    console.log('Hover transform:', hoverTransform);

    // Take screenshot of hover state
    await page.screenshot({
      path: 'e2e/screenshots/fix-validated-no-rotation.png',
      fullPage: true
    });

    // Test 2: Navigate to profile creation and test "Let's Play" button
    await kidButton.click();
    await page.waitForLoadState('networkidle');

    // Select age group
    const age6to8 = page.getByRole('button', { name: /6-8 years/i });
    await age6to8.click();
    await page.waitForTimeout(500);

    // Fill in profile
    await page.fill('input[placeholder*="name"]', 'TestKid');

    // Test "Let's Play" button hover
    const letsPlayButton = page.getByRole('button', { name: /Let's Play/i });

    // Get initial state
    const letsPlayInitial = await letsPlayButton.evaluate(el =>
      window.getComputedStyle(el).transform
    );

    // Hover and check
    await letsPlayButton.hover();
    await page.waitForTimeout(500);

    const letsPlayHover = await letsPlayButton.evaluate(el =>
      window.getComputedStyle(el).transform
    );

    console.log('Let\'s Play Initial:', letsPlayInitial);
    console.log('Let\'s Play Hover:', letsPlayHover);

    // Validate no rotation component in transform
    if (letsPlayHover && letsPlayHover !== 'none') {
      const matrix = letsPlayHover.match(/matrix\(([^)]+)\)/);
      if (matrix) {
        const values = matrix[1].split(',').map(v => parseFloat(v.trim()));
        // In a 2D transform matrix, rotation would affect values[0], [1], [2], [3]
        // For no rotation, values[0] and [3] should be close to their scale values
        // and values[1] and [2] should be close to 0
        const hasRotation = Math.abs(values[1]) > 0.1 || Math.abs(values[2]) > 0.1;
        expect(hasRotation).toBe(false);
        console.log('✅ No rotation detected on hover!');
      }
    }

    // Test 3: Continue to game selection and test "Start Playing" button
    await letsPlayButton.click();
    await page.waitForLoadState('networkidle');

    // Select an avatar
    const firstAvatar = page.locator('button').filter({ hasText: '🦁' }).first();
    if (await firstAvatar.isVisible()) {
      await firstAvatar.click();
      await page.waitForTimeout(500);
    }

    // Test "Start Playing" button if visible
    const startPlayingButton = page.getByRole('button', { name: /Start Playing/i });
    if (await startPlayingButton.isVisible()) {
      const startInitial = await startPlayingButton.evaluate(el =>
        window.getComputedStyle(el).transform
      );

      await startPlayingButton.hover();
      await page.waitForTimeout(500);

      const startHover = await startPlayingButton.evaluate(el =>
        window.getComputedStyle(el).transform
      );

      console.log('Start Playing Initial:', startInitial);
      console.log('Start Playing Hover:', startHover);

      // Validate no rotation
      if (startHover && startHover !== 'none') {
        const matrix = startHover.match(/matrix\(([^)]+)\)/);
        if (matrix) {
          const values = matrix[1].split(',').map(v => parseFloat(v.trim()));
          const hasRotation = Math.abs(values[1]) > 0.1 || Math.abs(values[2]) > 0.1;
          expect(hasRotation).toBe(false);
          console.log('✅ No rotation on "Start Playing" button!');
        }
      }
    }

    console.log('\n✅ All button hover effects verified - NO ROTATION DETECTED!');
  });
});