import { test as setup, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate as parent', async ({ page }) => {
  // Go to login page
  await page.goto('/login');

  // Wait for the page to load
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();

  // Fill in parent credentials
  await page.getByLabel('Email').fill('parent@test.com');
  await page.getByLabel('Password').fill('testpassword123');

  // Click login button
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Wait for successful login and redirect to dashboard
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  // End of authentication steps.
  await page.context().storageState({ path: authFile });
});

setup('authenticate as child', async ({ page }) => {
  // Go to child login page
  await page.goto('/child-login');

  // Wait for avatar selection screen
  await expect(page.getByRole('heading', { name: 'Choose Your Avatar' })).toBeVisible();

  // Select test child avatar
  await page.getByTestId('avatar-testchild').click();

  // Enter PIN if required
  const pinInput = page.getByLabel('PIN');
  if (await pinInput.isVisible()) {
    await pinInput.fill('1234');
    await page.getByRole('button', { name: 'Continue' }).click();
  }

  // Wait for child dashboard
  await expect(page).toHaveURL('/games');
  await expect(page.getByRole('heading', { name: 'Let\'s Play!' })).toBeVisible();

  // Save child authentication state
  const childAuthFile = path.join(__dirname, '../playwright/.auth/child.json');
  await page.context().storageState({ path: childAuthFile });
});