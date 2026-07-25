from playwright.sync_api import sync_playwright
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    
    # Capture console
    page.on("console", lambda msg: print(f"[{msg.type}] {msg.text}"))
    page.on("pageerror", lambda exc: print(f"[PAGE ERROR] {exc}"))
    
    # Go to home page
    page.goto('http://localhost:8084/', wait_until='networkidle', timeout=60000)
    page.wait_for_timeout(3000)
    
    # Check if sign in button exists
    signin_btn = page.locator('button:has-text("تسجيل الدخول")')
    if signin_btn.count() > 0:
        print("Found sign in button, clicking...")
        signin_btn.click()
        page.wait_for_timeout(1000)
        
        # Fill in sign in form
        page.fill('input[type="email"]', 'test@example.com')
        page.fill('input[type="password"]', 'password123')
        page.click('button[type="submit"]')
        page.wait_for_timeout(3000)
        print("Signed in!")
    
    # Now go to dashboard
    print("Navigating to dashboard...")
    page.goto('http://localhost:8084/dashboard', wait_until='networkidle', timeout=60000)
    page.wait_for_timeout(5000)
    
    # Check what's on the page
    page.screenshot(path='dashboard_test.png', full_page=True)
    print('Screenshot saved')
    
    print(f"URL: {page.url}")
    print(f"Title: {page.title()}")
    
    # Check for dashboard content
    root_html = page.locator('#root').inner_html()
    print(f"Root HTML length: {len(root_html)}")
    
    # Check for specific dashboard elements
    print(f"Has 'يومي في وعي': {page.locator('text=يومي في وعي').count() > 0}")
    print(f"Has WaterTracker: {page.locator('text=المياه').count() > 0}")
    print(f"Has Sleep: {page.locator('text=النوم').count() > 0}")
    
    # Check if redirected
    if page.url == 'http://localhost:8084/':
        print("REDIRECTED TO HOME!")
    else:
        print("ON DASHBOARD!")
    
    import time
    time.sleep(10)
    browser.close()