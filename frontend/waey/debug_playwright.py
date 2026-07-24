from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)  # headless=False to see what's happening
    page = browser.new_page()
    
    # Capture all console messages
    page.on("console", lambda msg: print(f"[{msg.type}] {msg.text}"))
    page.on("pageerror", lambda exc: print(f"[PAGE ERROR] {exc}"))
    page.on("requestfailed", lambda req: print(f"[REQUEST FAILED] {req.url} - {req.failure}"))
    
    page.goto('http://localhost:8080', wait_until='networkidle', timeout=60000)
    page.wait_for_timeout(5000)
    
    # Take screenshot
    page.screenshot(path='debug_screenshot.png', full_page=True)
    print('Screenshot saved')
    
    # Check page content
    print(f"Title: {page.title()}")
    print(f"URL: {page.url}")
    
    # Check for root element content
    root_html = page.locator('#root').inner_html()
    print(f"Root innerHTML length: {len(root_html)}")
    if len(root_html) < 100:
        print(f"Root content: {root_html[:500]}")
    
    # Check for specific elements
    print(f"Navbar visible: {page.locator('header').is_visible()}")
    print(f"Main content visible: {page.locator('main').is_visible()}")
    
    # Keep browser open for manual inspection
    import time
    time.sleep(10)
    browser.close()