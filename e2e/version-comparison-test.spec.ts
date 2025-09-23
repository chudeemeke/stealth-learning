import { test, expect } from '@playwright/test';

test.describe('Version Comparison: GitHub Pages vs Local', () => {
  test('should test live GitHub Pages site functionality', async ({ page }) => {
    console.log('🌐 Testing LIVE GitHub Pages site...');

    // Test the live GitHub Pages deployment
    await page.goto('https://chudeemeke.github.io/stealth-learning/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'e2e/screenshots/pages-01-landing.png' });

    console.log('📍 Current URL:', page.url());

    // Check if we can see the basic landing page elements
    try {
      const kidButton = page.getByText('I\'m a Kid!');
      const parentButton = page.getByText('I\'m a Parent');

      console.log('🔍 Checking for main buttons...');

      if (await kidButton.isVisible({ timeout: 5000 })) {
        console.log('✅ PAGES: Kid button found');

        // Test kid flow on Pages
        await kidButton.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'e2e/screenshots/pages-02-kid-flow.png' });

        // Check if age selection appears
        const ageButton = page.locator('button').filter({ hasText: '6-8 years' });
        if (await ageButton.first().isVisible({ timeout: 3000 })) {
          console.log('✅ PAGES: Age selection works');

          await ageButton.first().click();
          await page.waitForTimeout(500);

          // Check name input
          const nameInput = page.locator('input[type="text"]');
          if (await nameInput.isVisible({ timeout: 3000 })) {
            console.log('✅ PAGES: Name input found');
            await nameInput.fill('TestKidPages');

            // Check avatar selection
            const avatarButton = page.locator('button').filter({ hasText: '🦁' });
            if (await avatarButton.isVisible({ timeout: 3000 })) {
              console.log('✅ PAGES: Avatar selection works');
              await avatarButton.click();

              // Check Let's Play button
              const playButton = page.getByText('Let\'s Play! 🎮');
              if (await playButton.isVisible({ timeout: 3000 })) {
                console.log('✅ PAGES: Let\'s Play button found');
                await playButton.click();
                await page.waitForTimeout(2000);
                await page.screenshot({ path: 'e2e/screenshots/pages-03-after-play.png' });

                // Check what happens after play
                const currentUrl = page.url();
                console.log('🎯 PAGES: URL after Let\'s Play:', currentUrl);

                // Look for game selection or error
                const gameSelection = page.locator('text=Choose Your Adventure').or(page.locator('text=Math')).or(page.locator('text=English')).or(page.locator('text=Science'));
                const errorIndicator = page.locator('text=Error').or(page.locator('text=Something went wrong'));

                if (await gameSelection.isVisible({ timeout: 3000 })) {
                  console.log('🎉 PAGES: Game selection page reached successfully!');
                } else if (await errorIndicator.isVisible({ timeout: 3000 })) {
                  console.log('❌ PAGES: Error page detected');
                } else {
                  console.log('⚠️ PAGES: Unknown page state');
                  const pageContent = await page.textContent('body');
                  console.log('PAGES: Page content preview:', pageContent?.substring(0, 200));
                }
              } else {
                console.log('❌ PAGES: Let\'s Play button not found');
              }
            } else {
              console.log('❌ PAGES: Avatar selection not working');
            }
          } else {
            console.log('❌ PAGES: Name input not found');
          }
        } else {
          console.log('❌ PAGES: Age selection not working');
        }
      } else {
        console.log('❌ PAGES: Kid button not found');
      }

      // Test parent button on Pages
      await page.goto('https://chudeemeke.github.io/stealth-learning/');
      await page.waitForTimeout(1000);

      if (await parentButton.isVisible({ timeout: 5000 })) {
        console.log('✅ PAGES: Parent button found');

        await parentButton.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'e2e/screenshots/pages-04-parent-login.png' });

        // Check for login form
        const emailInput = page.locator('input[type="email"]');
        const passwordInput = page.locator('input[type="password"]');

        if (await emailInput.isVisible({ timeout: 3000 }) && await passwordInput.isVisible({ timeout: 3000 })) {
          console.log('✅ PAGES: Parent login form found');

          await emailInput.fill('parent@test.com');
          await passwordInput.fill('testpassword');

          const signInButton = page.getByText('Sign In');
          if (await signInButton.isVisible({ timeout: 3000 })) {
            console.log('✅ PAGES: Sign In button found');
            await signInButton.click();
            await page.waitForTimeout(2000);

            const currentUrl = page.url();
            console.log('🎯 PAGES: URL after parent sign in:', currentUrl);

            // Check if we reach parent dashboard
            if (currentUrl.includes('parent-dashboard')) {
              console.log('🎉 PAGES: Parent dashboard reached!');
            } else {
              console.log('❌ PAGES: Parent authentication failed - still on:', currentUrl);
            }

            await page.screenshot({ path: 'e2e/screenshots/pages-05-parent-result.png' });
          } else {
            console.log('❌ PAGES: Sign In button not found');
          }
        } else {
          console.log('❌ PAGES: Parent login form not found');
        }
      } else {
        console.log('❌ PAGES: Parent button not found');
      }

    } catch (error) {
      console.log('❌ PAGES: Major error occurred:', error);
      await page.screenshot({ path: 'e2e/screenshots/pages-error.png' });
    }
  });

  test('should test local dev server functionality', async ({ page }) => {
    console.log('🏠 Testing LOCAL dev server...');

    // Test the local development server
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'e2e/screenshots/local-01-landing.png' });

    console.log('📍 Current URL:', page.url());

    // Check if we can see the basic landing page elements
    try {
      const kidButton = page.getByText('I\'m a Kid!');
      const parentButton = page.getByText('I\'m a Parent');

      console.log('🔍 Checking for main buttons...');

      if (await kidButton.isVisible({ timeout: 5000 })) {
        console.log('✅ LOCAL: Kid button found');

        // Test kid flow locally
        await kidButton.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'e2e/screenshots/local-02-kid-flow.png' });

        // Check if age selection appears
        const ageButton = page.locator('button').filter({ hasText: '6-8 years' });
        if (await ageButton.first().isVisible({ timeout: 3000 })) {
          console.log('✅ LOCAL: Age selection works');

          await ageButton.first().click();
          await page.waitForTimeout(500);

          // Check name input
          const nameInput = page.locator('input[type="text"]');
          if (await nameInput.isVisible({ timeout: 3000 })) {
            console.log('✅ LOCAL: Name input found');
            await nameInput.fill('TestKidLocal');

            // Check avatar selection
            const avatarButton = page.locator('button').filter({ hasText: '🦁' });
            if (await avatarButton.isVisible({ timeout: 3000 })) {
              console.log('✅ LOCAL: Avatar selection works');
              await avatarButton.click();

              // Check Let's Play button
              const playButton = page.getByText('Let\'s Play! 🎮');
              if (await playButton.isVisible({ timeout: 3000 })) {
                console.log('✅ LOCAL: Let\'s Play button found');
                await playButton.click();
                await page.waitForTimeout(2000);
                await page.screenshot({ path: 'e2e/screenshots/local-03-after-play.png' });

                // Check what happens after play
                const currentUrl = page.url();
                console.log('🎯 LOCAL: URL after Let\'s Play:', currentUrl);

                // Look for game selection or error
                const gameSelection = page.locator('text=Choose Your Adventure').or(page.locator('text=Math')).or(page.locator('text=English')).or(page.locator('text=Science'));
                const errorIndicator = page.locator('text=Error').or(page.locator('text=Something went wrong'));

                if (await gameSelection.isVisible({ timeout: 3000 })) {
                  console.log('🎉 LOCAL: Game selection page reached successfully!');
                } else if (await errorIndicator.isVisible({ timeout: 3000 })) {
                  console.log('❌ LOCAL: Error page detected');
                } else {
                  console.log('⚠️ LOCAL: Unknown page state');
                  const pageContent = await page.textContent('body');
                  console.log('LOCAL: Page content preview:', pageContent?.substring(0, 200));
                }
              } else {
                console.log('❌ LOCAL: Let\'s Play button not found');
              }
            } else {
              console.log('❌ LOCAL: Avatar selection not working');
            }
          } else {
            console.log('❌ LOCAL: Name input not found');
          }
        } else {
          console.log('❌ LOCAL: Age selection not working');
        }
      } else {
        console.log('❌ LOCAL: Kid button not found');
      }

      // Test parent button locally
      await page.goto('http://localhost:3001');
      await page.waitForTimeout(1000);

      if (await parentButton.isVisible({ timeout: 5000 })) {
        console.log('✅ LOCAL: Parent button found');

        await parentButton.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'e2e/screenshots/local-04-parent-login.png' });

        // Check for login form
        const emailInput = page.locator('input[type="email"]');
        const passwordInput = page.locator('input[type="password"]');

        if (await emailInput.isVisible({ timeout: 3000 }) && await passwordInput.isVisible({ timeout: 3000 })) {
          console.log('✅ LOCAL: Parent login form found');

          await emailInput.fill('parent@test.com');
          await passwordInput.fill('testpassword');

          const signInButton = page.getByText('Sign In');
          if (await signInButton.isVisible({ timeout: 3000 })) {
            console.log('✅ LOCAL: Sign In button found');
            await signInButton.click();
            await page.waitForTimeout(2000);

            const currentUrl = page.url();
            console.log('🎯 LOCAL: URL after parent sign in:', currentUrl);

            // Check if we reach parent dashboard
            if (currentUrl.includes('parent-dashboard')) {
              console.log('🎉 LOCAL: Parent dashboard reached!');
            } else {
              console.log('❌ LOCAL: Parent authentication failed - still on:', currentUrl);
            }

            await page.screenshot({ path: 'e2e/screenshots/local-05-parent-result.png' });
          } else {
            console.log('❌ LOCAL: Sign In button not found');
          }
        } else {
          console.log('❌ LOCAL: Parent login form not found');
        }
      } else {
        console.log('❌ LOCAL: Parent button not found');
      }

    } catch (error) {
      console.log('❌ LOCAL: Major error occurred:', error);
      await page.screenshot({ path: 'e2e/screenshots/local-error.png' });
    }
  });
});