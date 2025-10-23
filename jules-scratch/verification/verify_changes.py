from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Navigate to the landing page
    page.goto("http://localhost:4173/")
    page.screenshot(path="jules-scratch/verification/01_landing_page.png")

    # Navigate to the sign-up page
    page.goto("http://localhost:4173/#/register")
    page.screenshot(path="jules-scratch/verification/02_register_page.png")

    # Navigate to the patient registration page
    page.goto("http://localhost:4173/#/register/patient")
    page.screenshot(path="jules-scratch/verification/03_patient_register_page.png")

    # Navigate to the provider dashboard
    page.goto("http://localhost:4173/#/login")
    page.get_by_placeholder("Email").fill("provider@demo.com")
    page.get_by_placeholder("Password").fill("Password123!")
    page.get_by_role("button", name="Sign In").click()
    page.wait_for_url("http://localhost:4173/#/dashboard")
    page.screenshot(path="jules-scratch/verification/04_provider_dashboard.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
