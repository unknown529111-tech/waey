from playwright.sync_api import sync_playwright
import sys
import io

# Fix encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    
    page.on("console", lambda msg: print(f"[{msg.type}] {msg.text}"))
    page.on("pageerror", lambda exc: print(f"[PAGE ERROR] {exc}"))
    page.on("requestfailed", lambda req: print(f"[REQUEST FAILED] {req.url}"))
    
    page.goto('http://localhost:8080', wait_until='networkidle', timeout=60000)
    page.wait_for_timeout(5000)
    
    page.screenshot(path='debug_screenshot.png', full_page=True)
    print('Screenshot saved')
    
    print(f"URL: {page.url}")
    
    root_html = page.locator('#root').inner_html()
    print(f"Root innerHTML length: {len(root_html)}")
    if len(root_html) < 500:
        print(f"Root content: {root_html}")
    
    # Check for specific elements
    print(f"Navbar (header) visible: {page.locator('header').is_visible()}")
    print(f"Main content visible: {page.locator('main').is_visible()}")
    print(f"Layout main: {page.locator('[data-layout-main]').count()}")
    
    # Check for Clerk components
    print(f"SignInButton present: {page.locator('[data-testid=sign-in-button]').count()}")
    print(f"UserButton present: {page.locator('[data-testid=user-button]').count()}")
    
    # Get all text content
    body_text = page.locator('body').inner_text()
    print(f"Body text length: {len(body_text)}")
    if len(body_text) < 200:
        print(f"Body text: {body_text[:500]}")
    
    import time
    time.sleep(10)
    browser.close()