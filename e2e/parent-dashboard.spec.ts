import { test, expect } from '@playwright/test';

test.describe('Parent Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Use parent authentication
    await page.goto('/dashboard');
  });

  test('should display child progress overview', async ({ page }) => {
    // Verify dashboard loads
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Check for child progress cards
    await expect(page.getByTestId('child-progress-overview')).toBeVisible();

    // Verify key metrics are displayed
    await expect(page.getByTestId('total-learning-time')).toBeVisible();
    await expect(page.getByTestId('games-completed')).toBeVisible();
    await expect(page.getByTestId('current-streak')).toBeVisible();
    await expect(page.getByTestId('skills-mastered')).toBeVisible();
  });

  test('should show performance analytics charts', async ({ page }) => {
    // Navigate to analytics section
    await page.getByRole('tab', { name: 'Analytics' }).click();

    // Verify charts are present
    await expect(page.getByTestId('performance-chart')).toBeVisible();
    await expect(page.getByTestId('subject-breakdown-chart')).toBeVisible();
    await expect(page.getByTestId('learning-patterns-chart')).toBeVisible();

    // Test chart interactions
    await page.getByTestId('chart-time-filter').selectOption('last-week');
    await expect(page.getByTestId('performance-chart')).toBeVisible();

    // Verify chart data updates
    await page.getByTestId('chart-subject-filter').selectOption('mathematics');
    await expect(page.getByTestId('subject-breakdown-chart')).toBeVisible();
  });

  test('should allow viewing detailed progress reports', async ({ page }) => {
    // Click on detailed report
    await page.getByRole('button', { name: 'View Detailed Report' }).click();

    // Verify report modal opens
    await expect(page.getByTestId('detailed-report-modal')).toBeVisible();

    // Check report sections
    await expect(page.getByTestId('academic-progress')).toBeVisible();
    await expect(page.getByTestId('skill-development')).toBeVisible();
    await expect(page.getByTestId('learning-recommendations')).toBeVisible();

    // Test export functionality
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export PDF' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/report.*\.pdf/);
  });

  test('should manage child accounts', async ({ page }) => {
    // Navigate to child management
    await page.getByRole('tab', { name: 'Children' }).click();

    // Verify child list
    await expect(page.getByTestId('child-list')).toBeVisible();

    // Add new child
    await page.getByRole('button', { name: 'Add Child' }).click();
    await expect(page.getByTestId('add-child-modal')).toBeVisible();

    await page.getByLabel('Name').fill('Test Child 2');
    await page.getByLabel('Age').fill('8');
    await page.getByLabel('Grade').selectOption('2nd Grade');

    await page.getByRole('button', { name: 'Save Child' }).click();

    // Verify child was added
    await expect(page.getByText('Test Child 2')).toBeVisible();

    // Edit child profile
    await page.getByTestId('child-options-menu').first().click();
    await page.getByRole('menuitem', { name: 'Edit Profile' }).click();

    await expect(page.getByTestId('edit-child-modal')).toBeVisible();
    await page.getByLabel('Learning Goals').fill('Improve multiplication skills');
    await page.getByRole('button', { name: 'Update' }).click();
  });

  test('should configure parental controls', async ({ page }) => {
    // Navigate to settings
    await page.getByRole('tab', { name: 'Settings' }).click();

    // Verify parental controls section
    await expect(page.getByTestId('parental-controls')).toBeVisible();

    // Test screen time limits
    await page.getByLabel('Daily Screen Time Limit').fill('60');
    await page.getByLabel('Break Reminder Interval').fill('20');

    // Test content filtering
    await page.getByTestId('content-age-filter').selectOption('6-8');
    await page.getByLabel('Block Inappropriate Content').check();

    // Test notification preferences
    await page.getByLabel('Weekly Progress Reports').check();
    await page.getByLabel('Achievement Notifications').check();
    await page.getByLabel('Concern Alerts').check();

    // Save settings
    await page.getByRole('button', { name: 'Save Settings' }).click();
    await expect(page.getByTestId('settings-saved-message')).toBeVisible();
  });

  test('should display achievement milestones', async ({ page }) => {
    // Navigate to achievements
    await page.getByRole('tab', { name: 'Achievements' }).click();

    // Verify achievement gallery
    await expect(page.getByTestId('achievement-gallery')).toBeVisible();

    // Check achievement categories
    await expect(page.getByTestId('academic-achievements')).toBeVisible();
    await expect(page.getByTestId('engagement-achievements')).toBeVisible();
    await expect(page.getByTestId('special-achievements')).toBeVisible();

    // View achievement details
    await page.getByTestId('achievement-card').first().click();
    await expect(page.getByTestId('achievement-detail-modal')).toBeVisible();

    // Verify achievement information
    await expect(page.getByTestId('achievement-description')).toBeVisible();
    await expect(page.getByTestId('achievement-progress')).toBeVisible();
    await expect(page.getByTestId('achievement-criteria')).toBeVisible();
  });

  test('should show learning recommendations', async ({ page }) => {
    // Navigate to recommendations
    await page.getByRole('tab', { name: 'Recommendations' }).click();

    // Verify recommendation sections
    await expect(page.getByTestId('skill-recommendations')).toBeVisible();
    await expect(page.getByTestId('content-recommendations')).toBeVisible();
    await expect(page.getByTestId('learning-path-suggestions')).toBeVisible();

    // Test recommendation actions
    await page.getByRole('button', { name: 'Assign Recommended Game' }).first().click();
    await expect(page.getByTestId('assign-content-modal')).toBeVisible();

    await page.getByRole('button', { name: 'Assign to Child' }).click();
    await expect(page.getByTestId('assignment-success-message')).toBeVisible();
  });

  test('should handle multiple children switching', async ({ page }) => {
    // Verify child selector
    await expect(page.getByTestId('child-selector')).toBeVisible();

    // Switch between children
    await page.getByTestId('child-selector').click();
    await page.getByRole('option', { name: 'Child 2' }).click();

    // Verify dashboard updates for selected child
    await expect(page.getByTestId('child-name-header')).toContainText('Child 2');
    await expect(page.getByTestId('child-progress-overview')).toBeVisible();

    // Switch back to first child
    await page.getByTestId('child-selector').click();
    await page.getByRole('option', { name: 'Test Child' }).click();
    await expect(page.getByTestId('child-name-header')).toContainText('Test Child');
  });

  test('should display learning streak calendar', async ({ page }) => {
    // Navigate to progress section
    await page.getByRole('tab', { name: 'Progress' }).click();

    // Verify streak calendar
    await expect(page.getByTestId('streak-calendar')).toBeVisible();

    // Check calendar navigation
    await page.getByTestId('calendar-prev-month').click();
    await page.getByTestId('calendar-next-month').click();

    // Verify streak indicators
    await expect(page.getByTestId('streak-day')).toBeVisible();
    await expect(page.getByTestId('current-streak-count')).toBeVisible();
    await expect(page.getByTestId('longest-streak-count')).toBeVisible();
  });

  test('should handle data export and privacy', async ({ page }) => {
    // Navigate to privacy settings
    await page.getByRole('tab', { name: 'Privacy' }).click();

    // Test data export
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export All Data' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/child-data.*\.zip/);

    // Test data deletion options
    await page.getByRole('button', { name: 'Delete Child Data' }).click();
    await expect(page.getByTestId('data-deletion-modal')).toBeVisible();

    // Cancel deletion
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByTestId('data-deletion-modal')).not.toBeVisible();
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByTestId('dashboard-mobile-menu')).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByTestId('dashboard-hamburger-menu')).toBeVisible();

    // Test navigation in mobile
    await page.getByTestId('dashboard-hamburger-menu').click();
    await expect(page.getByTestId('mobile-nav-menu')).toBeVisible();

    await page.getByRole('link', { name: 'Analytics' }).click();
    await expect(page.getByTestId('performance-chart')).toBeVisible();
  });

  test('should handle real-time updates', async ({ page }) => {
    // Monitor for real-time updates
    await expect(page.getByTestId('live-activity-indicator')).toBeVisible();

    // Simulate child activity (this would normally come from WebSocket)
    // For testing, we'll check that the UI updates when data changes

    // Verify progress updates
    const initialXP = await page.getByTestId('total-xp').textContent();

    // Trigger a refresh or wait for update
    await page.getByRole('button', { name: 'Refresh Data' }).click();

    // Verify data is refreshed
    await expect(page.getByTestId('last-updated-timestamp')).toBeVisible();
  });
});