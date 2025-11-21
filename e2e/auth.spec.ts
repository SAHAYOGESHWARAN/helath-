
import { test, expect } from '@playwright/test';

test.describe('Auth Flows', () => {
  test('should allow a user to log in and log out', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1:has-text("Intelligent Healthcare")')).toBeVisible();
    await page.click('a:has-text("Sign In")');
    await page.waitForURL('**/login');

    await page.fill('input[placeholder="Email Address"]', 'john.doe@email.com');
    await page.fill('input[placeholder="Password"]', 'Password123!');
    await page.click('button:has-text("Sign In")');

    await page.waitForURL('**/patient/dashboard');
    await expect(page).toHaveURL(/.*patient\/dashboard/);

    // Use title attribute for the sidebar logout button which is visible
    await page.click('button[title="Logout"]');
    await expect(page).toHaveURL('/login');
  });

  test('should allow a patient to register', async ({ page }) => {
    await page.goto('/register');
    // Click the "Create Patient Account" button in the "For Patients" card
    await page.click('a[href="/register/patient"]');

    await page.waitForURL('**/register/patient');

    const timestamp = Date.now();
    await page.fill('input[name="name"]', 'Test Patient');
    await page.fill('input[name="email"]', `test.patient.${timestamp}@example.com`);
    await page.fill('input[name="dob"]', '1990-01-01');
    await page.selectOption('select[name="state"]', 'California');
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    
    await page.click('button[type="submit"]');

    await page.waitForURL('**/patient/dashboard');
    await expect(page).toHaveURL(/.*patient\/dashboard/);
    await expect(page.locator('h1')).toContainText('Welcome back, Test');
  });
});
