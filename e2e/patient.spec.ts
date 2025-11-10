import { test, expect } from '@playwright/test';

test.describe('Patient Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'jane.smith@email.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/patient/dashboard');
  });

  test('should allow a patient to use the Health Assistant', async ({ page }) => {
    await page.click('a:has-text("Health Assistant")');
    await expect(page).toHaveURL('/patient/health-assistant');

    await page.fill('input[type="text"]', 'What is the best way to treat a cold?');
    await page.click('button:has-text("Ask")');

    await expect(page.locator('div:has-text("cold")')).toBeVisible();
  });

  test('should allow a patient to use the BMI Calculator', async ({ page }) => {
    await page.click('a:has-text("BMI Calculator")');
    await expect(page).toHaveURL('/patient/bmi-calculator');

    await page.fill('input[placeholder="Height (cm)"]', '180');
    await page.fill('input[placeholder="Weight (kg)"]', '80');
    await page.click('button:has-text("Calculate BMI")');

    await expect(page.locator('p:has-text("24.69")')).toBeVisible();
  });

  test('should allow a patient to use the Calorie Tracker', async ({ page }) => {
    await page.click('a:has-text("Calorie Tracker")');
    await expect(page).toHaveURL('/patient/calorie-tracker');

    await page.fill('input[placeholder="Food"]', 'Apple');
    await page.fill('input[placeholder="Calories"]', '95');
    await page.click('button:has-text("Add Entry")');

    await expect(page.locator('h2:has-text("Total Calories: 95")')).toBeVisible();
  });

  test('should allow a patient to use the Workout Planner', async ({ page }) => {
    await page.click('a:has-text("Workout Planner")');
    await expect(page).toHaveURL('/patient/workout-planner');

    await page.fill('input[placeholder="Exercise"]', 'Push-ups');
    await page.fill('input[placeholder="Sets"]', '3');
    await page.fill('input[placeholder="Reps"]', '15');
    await page.click('button:has-text("Add Workout")');

    await expect(page.locator('span:has-text("Push-ups")')).toBeVisible();
  });
});
