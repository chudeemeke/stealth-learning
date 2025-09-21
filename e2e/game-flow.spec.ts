import { test, expect } from '@playwright/test';

test.describe('Game Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Use child authentication
    await page.goto('/games');
  });

  test('should complete a full math game', async ({ page }) => {
    // Navigate to math games
    await page.getByRole('button', { name: 'Math Games' }).click();
    await expect(page).toHaveURL('/games/math');

    // Select an age-appropriate game
    await page.getByTestId('game-card-addition').click();

    // Wait for game to load
    await expect(page.getByRole('heading', { name: /addition/i })).toBeVisible();

    // Start the game
    await page.getByRole('button', { name: 'Start Game' }).click();

    // Complete first question
    await expect(page.getByTestId('question-container')).toBeVisible();

    // Look for multiple choice answers or input field
    const multipleChoice = page.getByTestId('answer-options');
    const inputField = page.getByTestId('answer-input');

    if (await multipleChoice.isVisible()) {
      // Handle multiple choice question
      await page.getByTestId('answer-option-0').click();
    } else if (await inputField.isVisible()) {
      // Handle input-based question
      await inputField.fill('5'); // Assuming simple addition
    }

    // Submit answer
    await page.getByRole('button', { name: 'Submit' }).click();

    // Wait for feedback
    await expect(page.getByTestId('answer-feedback')).toBeVisible();

    // Continue to next question or finish
    const nextButton = page.getByRole('button', { name: 'Next' });
    const finishButton = page.getByRole('button', { name: 'Finish' });

    if (await nextButton.isVisible()) {
      await nextButton.click();
    } else if (await finishButton.isVisible()) {
      await finishButton.click();
    }

    // Verify game completion
    await expect(page.getByTestId('game-results')).toBeVisible();
    await expect(page.getByTestId('final-score')).toBeVisible();
  });

  test('should handle game pause and resume', async ({ page }) => {
    // Start a game
    await page.getByRole('button', { name: 'Math Games' }).click();
    await page.getByTestId('game-card-addition').click();
    await page.getByRole('button', { name: 'Start Game' }).click();

    // Pause the game
    await page.getByRole('button', { name: 'Pause' }).click();
    await expect(page.getByTestId('pause-menu')).toBeVisible();

    // Resume the game
    await page.getByRole('button', { name: 'Resume' }).click();
    await expect(page.getByTestId('question-container')).toBeVisible();
  });

  test('should save game progress', async ({ page }) => {
    // Start a game
    await page.getByRole('button', { name: 'Math Games' }).click();
    await page.getByTestId('game-card-addition').click();
    await page.getByRole('button', { name: 'Start Game' }).click();

    // Answer a question
    await page.getByTestId('answer-option-0').click();
    await page.getByRole('button', { name: 'Submit' }).click();

    // Exit game mid-way
    await page.getByRole('button', { name: 'Pause' }).click();
    await page.getByRole('button', { name: 'Save & Exit' }).click();

    // Return to game selection
    await expect(page).toHaveURL('/games/math');

    // Verify continue option is available
    await page.getByTestId('game-card-addition').click();
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
  });

  test('should track performance metrics', async ({ page }) => {
    // Complete a game
    await page.getByRole('button', { name: 'Math Games' }).click();
    await page.getByTestId('game-card-addition').click();
    await page.getByRole('button', { name: 'Start Game' }).click();

    // Answer questions and complete game
    for (let i = 0; i < 3; i++) {
      await page.getByTestId('answer-option-0').click();
      await page.getByRole('button', { name: 'Submit' }).click();

      const nextButton = page.getByRole('button', { name: 'Next' });
      if (await nextButton.isVisible()) {
        await nextButton.click();
      }
    }

    // Finish game
    await page.getByRole('button', { name: 'Finish' }).click();

    // Verify performance metrics are displayed
    await expect(page.getByTestId('accuracy-score')).toBeVisible();
    await expect(page.getByTestId('time-spent')).toBeVisible();
    await expect(page.getByTestId('xp-earned')).toBeVisible();
  });

  test('should adapt difficulty based on performance', async ({ page }) => {
    // Complete multiple games to trigger difficulty adaptation
    for (let gameIndex = 0; gameIndex < 3; gameIndex++) {
      await page.getByRole('button', { name: 'Math Games' }).click();
      await page.getByTestId('game-card-addition').click();
      await page.getByRole('button', { name: 'Start Game' }).click();

      // Answer all questions correctly
      for (let questionIndex = 0; questionIndex < 5; questionIndex++) {
        await page.getByTestId('answer-option-0').click(); // Assume first option is correct
        await page.getByRole('button', { name: 'Submit' }).click();

        const nextButton = page.getByRole('button', { name: 'Next' });
        if (await nextButton.isVisible()) {
          await nextButton.click();
        }
      }

      await page.getByRole('button', { name: 'Finish' }).click();
      await page.getByRole('button', { name: 'Play Again' }).click();
    }

    // Check if difficulty has increased
    await expect(page.getByTestId('difficulty-indicator')).toContainText(/medium|hard/i);
  });

  test('should handle incorrect answers with hints', async ({ page }) => {
    await page.getByRole('button', { name: 'Math Games' }).click();
    await page.getByTestId('game-card-addition').click();
    await page.getByRole('button', { name: 'Start Game' }).click();

    // Give an incorrect answer
    await page.getByTestId('answer-option-3').click(); // Assume this is wrong
    await page.getByRole('button', { name: 'Submit' }).click();

    // Check for feedback and hint option
    await expect(page.getByTestId('incorrect-feedback')).toBeVisible();

    if (await page.getByRole('button', { name: 'Hint' }).isVisible()) {
      await page.getByRole('button', { name: 'Hint' }).click();
      await expect(page.getByTestId('hint-text')).toBeVisible();
    }

    // Try again with correct answer
    await page.getByTestId('answer-option-0').click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByTestId('correct-feedback')).toBeVisible();
  });

  test('should work on mobile devices', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-specific test');

    // Navigate to games on mobile
    await page.getByRole('button', { name: 'Math Games' }).click();

    // Verify touch-friendly interface
    const gameCard = page.getByTestId('game-card-addition');
    await expect(gameCard).toHaveCSS('min-height', /64px/); // Touch target size

    await gameCard.click();
    await page.getByRole('button', { name: 'Start Game' }).click();

    // Test touch interactions
    await page.getByTestId('answer-option-0').tap();
    await page.getByRole('button', { name: 'Submit' }).tap();
  });

  test('should handle offline functionality', async ({ page, context }) => {
    // Start a game while online
    await page.getByRole('button', { name: 'Math Games' }).click();
    await page.getByTestId('game-card-addition').click();
    await page.getByRole('button', { name: 'Start Game' }).click();

    // Simulate going offline
    await context.setOffline(true);

    // Verify game continues to work
    await page.getByTestId('answer-option-0').click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByTestId('answer-feedback')).toBeVisible();

    // Complete game offline
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByTestId('answer-option-0').click();
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.getByRole('button', { name: 'Finish' }).click();

    // Verify offline indicator
    await expect(page.getByTestId('offline-indicator')).toBeVisible();

    // Go back online
    await context.setOffline(false);

    // Verify sync indicator
    await expect(page.getByTestId('sync-indicator')).toBeVisible();
  });

  test('should provide accessibility features', async ({ page }) => {
    await page.getByRole('button', { name: 'Math Games' }).click();
    await page.getByTestId('game-card-addition').click();

    // Check for accessibility features
    await expect(page.getByRole('button', { name: 'Audio On/Off' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'High Contrast' })).toBeVisible();

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Verify screen reader content
    await expect(page.getByLabelText(/question/i)).toBeVisible();
  });
});