from playwright.sync_api import sync_playwright
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    
    page.on("console", lambda msg: print(f"[{msg.type}] {msg.text}"))
    page.on("pageerror", lambda exc: print(f"[PAGE ERROR] {exc}"))
    
    page.goto('http://localhost:8084/', wait_until='networkidle', timeout=60000)
    page.wait_for_timeout(3000)
    
    # SIGN UP FIRST - click signup button
    signup_btn = page.locator('button:has-text("إنشاء حساب")')
    if signup_btn.count() > 0:
        print("Found signup button, clicking...")
        signup_btn.click()
        page.wait_for_timeout(1000)
        
        # Fill signup form
        page.fill('input[id="name"]', 'Test User')
        page.fill('input[id="email"]', 'test@example.com')
        page.fill('input[id="password"]', 'password123')
        page.click('button[type="submit"]')
        page.wait_for_timeout(3000)
        print("Signed up!")
    
    # Check localStorage after signup
    print("After signup:")
    auth_data = page.evaluate("() => localStorage.getItem('waey-auth')")
    print(f"waey-auth: {auth_data}")
    users_data = page.evaluate("() => localStorage.getItem('waey-users')")
    print(f"waey-users: {users_data}")
    
    # Now go to dashboard
    print("Navigating to dashboard...")
    page.goto('http://localhost:8084/dashboard', wait_until='networkidle', timeout=60000)
    page.wait_for_timeout(5000)
    
    # Check localStorage on dashboard
    print("On dashboard:")
    auth_data = page.evaluate("() => localStorage.getItem('waey-auth')")
    print(f"waey-auth: {auth_data}")
    
    page.screenshot(path='dashboard_test3.png', full_page=True)
    print('Screenshot saved')
    
    print(f"URL: {page.url}")
    print(f"Title: {page.title()}")
    
    root_html = page.locator('#root').inner_html()
    print(f"Root HTML length: {len(root_html)}")
    if len(root_html) < 500:
        print(f"Root HTML: {root_html[:500]}")
    
    print(f"Has 'يومي في وعي': {page.locator('text=يومي في وعي').count() > 0}")
    print(f"Has WaterTracker: {page.locator('text=مياه').count() > 0}")
    print(f"Has Sleep: {page.locator('text=نوم').count() > 0}")
    print(f"Has PageLoader: {page.locator('.animate-spin').count() > 0}")
    
    import time
    time.sleep(15)
    browser.close()