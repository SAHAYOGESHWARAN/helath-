
import { test, expect } from '@playwright/test';

test.describe('apiService', () => {
  test('should update user name', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[placeholder="Email Address"]', 'john.doe@email.com');
    await page.fill('input[placeholder="Password"]', 'Password123!');
    await page.click('button:has-text("Sign In")');

    await page.waitForURL('**/patient/dashboard');

    await page.evaluate(async () => {
      const { apiUpdateUser } = await import('../src/services/apiService');
      await apiUpdateUser('pat1', (user) => ({...user, givenName: 'Johnathan'}));
    });

    await page.reload();
    await expect(page.locator('h1:has-text("Welcome back, Johnathan!")')).toBeVisible();
  });
});
