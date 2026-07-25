from playwright.sync_api import sync_playwright
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    
    page.on("console", lambda msg: print(f"[{msg.type}] {msg.text}"))
    page.on("pageerror", lambda exc: print(f"[PAGE ERROR] {exc}"))
    page.on("requestfailed", lambda req: print(f"[REQUEST FAILED] {req.url} - {req.failure}"))
    
    page.goto('http://localhost:8084/', wait_until='networkidle', timeout=60000)
    page.wait_for_timeout(3000)
    
    # Check localStorage before sign in
    print("Before sign in:")
    print(page.evaluate("() => localStorage.getItem('waey-auth')"))
    print(page.evaluate("() => localStorage.getItem('waey-users')"))
    
    # Sign in
    signin_btn = page.locator('button:has-text("تسجيل الدخول")')
    if signin_btn.count() > 0:
        print("Found sign in button, clicking...")
        signin_btn.click()
        page.wait_for_timeout(1000)
        
        page.fill('input[type="email"]', 'test@example.com')
        page.fill('input[type="password"]', 'password123')
        page.click('button[type="submit"]')
        page.wait_for_timeout(3000)
        print("Signed in!")
    
    # Check localStorage after sign in
    print("After sign in:")
    auth_data = page.evaluate("() => localStorage.getItem('waey-auth')")
    print(f"waey-auth: {auth_data}")
    
    # Now go to dashboard
    print("Navigating to dashboard...")
    page.goto('http://localhost:8084/dashboard', wait_until='networkidle', timeout=60000)
    page.wait_for_timeout(5000)
    
    # Check localStorage on dashboard
    print("On dashboard:")
    auth_data = page.evaluate("() => localStorage.getItem('waey-auth')")
    print(f"waey-auth: {auth_data}")
    
    page.screenshot(path='dashboard_test2.png', full_page=True)
    print('Screenshot saved')
    
    print(f"URL: {page.url}")
    print(f"Title: {page.title()}")
    
    # Check all elements
    body_html = page.locator('body').inner_html()
    print(f"Body HTML length: {len(body_html)}")
    
    root_html = page.locator('#root').inner_html()
    print(f"Root HTML length: {len(root_html)}")
    if len(root_html) < 500:
        print(f"Root HTML: {root_html[:500]}")
    
    # Check for specific elements
    print(f"Has main: {page.locator('main').count() > 0}")
    print(f"Has header: {page.locator('header').count() > 0}")
    print(f"Has 'يومي في وعي': {page.locator('text=يومي في وعي').count() > 0}")
    
    # Check if there's an error boundary or loader
    print(f"Has PageLoader: {page.locator('.animate-spin').count() > 0}")
    print(f"Has ErrorBoundary: {page.locator('text=حدث خطأ').count() > 0}")
    
    import time
    time.sleep(15)
    browser.close()