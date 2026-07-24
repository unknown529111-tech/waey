from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    # Capture console logs
    page.on("console", lambda msg: print(f"Console: {msg.type} - {msg.text}"))
    page.on("pageerror", lambda exc: print(f"Page Error: {exc}"))
    
    page.goto('http://localhost:8080', wait_until='networkidle', timeout=60000)
    
    # Wait a bit more for React to render
    page.wait_for_timeout(3000)
    
    # Get page content
    content = page.content()
    print(f"Page title: {page.title()}")
    print(f"Body HTML length: {len(content)}")
    
    # Check for root element
    root = page.locator('#root')
    if root.count() > 0:
        print(f"Root element found, innerHTML length: {len(root.inner_html())}")
    else:
        print("No #root element found")
    
    page.screenshot(path='screenshot2.png', full_page=True)
    print('Screenshot saved to screenshot2.png')
    browser.close()