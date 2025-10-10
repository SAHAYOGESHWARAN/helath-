from playwright.sync_api import sync_playwright, Page, expect

def main():
    with sync_playwright() as p:
        print("Launching browser...")
        # Running headless since there is no display
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        print("Browser launched.")

        try:
            print("Navigating to http://localhost:3000...")
            page.goto("http://localhost:3000", timeout=30000)
            print("Navigation complete.")

            print("Waiting for URL to be http://localhost:3000/#/login...")
            expect(page).to_have_url("http://localhost:3000/#/login", timeout=15000)
            print("URL is correct.")

            print("Clicking 'Sign in as Patient' button...")
            patient_button = page.get_by_role("button", name="Sign in as Patient")
            patient_button.click()
            print("Button clicked.")

            print("Looking for heading 'Good Morning, John!'...")
            heading = page.get_by_role("heading", name="Good Morning, John!")
            expect(heading).to_be_visible(timeout=15000)
            print("Heading found and visible.")

            print("Taking screenshot...")
            page.screenshot(path="jules-scratch/verification/verification.png")
            print("Screenshot saved to jules-scratch/verification/verification.png")

        except Exception as e:
            print(f"An error occurred: {e}")
            page.screenshot(path="jules-scratch/verification/error.png")
            print("Error screenshot saved to jules-scratch/verification/error.png")

        finally:
            print("Closing browser.")
            browser.close()

if __name__ == "__main__":
    main()