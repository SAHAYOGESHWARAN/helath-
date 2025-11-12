import { test, expect } from '@playwright/test';

test.describe('Auth Flows', () => {
  test('should allow a user to log in and log out', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1:has-text("Intelligent Healthcare, Seamlessly Connected.")')).toBeVisible();
    await page.click('a:has-text("Sign In")');
    await page.waitForURL('**/login');

    await page.fill('input[placeholder="Email Address"]', 'john.doe@email.com');
    await page.fill('input[placeholder="Password"]', 'Password123!');
    await page.click('button:has-text("Sign In")');

    await page.waitForURL('**/patient/dashboard');
    await expect(page).toHaveURL(/.*patient\/dashboard/);

    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL('/login');
  });

  test('should allow a user to register', async ({ page }) => {
    await page.goto('/register');
    await page.click('a:has-text("Patient")');

    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', 'john.doe@email.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/patient/dashboard');
  });
});
