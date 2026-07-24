from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://localhost:8080', wait_until='networkidle', timeout=60000)
    page.wait_for_timeout(3000)
    page.screenshot(path='screenshot3.png', full_page=True)
    print('Screenshot saved to screenshot3.png')
    print(f'Title: {page.title()}')
    print(f'Body text length: {len(page.content())}')
    browser.close()