from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://localhost:8080', wait_until='networkidle', timeout=60000)
    page.screenshot(path='screenshot.png', full_page=True)
    print('Screenshot saved to screenshot.png')
    browser.close()