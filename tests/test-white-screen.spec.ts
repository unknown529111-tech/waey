import { test, expect } from '@playwright/test';

test('capture console errors and screenshot', async ({ page }) => {
  const consoleErrors: string[] = [];
  const consoleWarnings: string[] = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    } else if (msg.type() === 'warning') {
      consoleWarnings.push(msg.text());
    }
  });
  
  page.on('pageerror', error => {
    consoleErrors.push(error.message);
  });
  
  await page.goto('http://localhost:8081', { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  // Wait for React to hydrate
  await page.waitForTimeout(5000);
  
  // Take a screenshot
  await page.screenshot({ path: 'white-screen.png', fullPage: true });
  
  // Get page content
  const content = await page.content();
  const title = await page.title();
  
  // Check React renderers
  const reactRenderers = await page.evaluate(() => {
    return document.querySelectorAll('[data-reactroot], [data-reactid], #root > *').length;
  });
  
  // Check if there's any content in body
  const bodyText = await page.locator('body').innerText();
  const rootHTML = await page.locator('#root').innerHTML();
  
  console.log('=== TITLE ===', title);
  console.log('=== CONSOLE ERRORS ===', consoleErrors);
  console.log('=== CONSOLE WARNINGS ===', consoleWarnings);
  console.log('=== REACT RENDERERS ===', reactRenderers);
  console.log('=== BODY TEXT (first 2000) ===', bodyText.slice(0, 2000));
  console.log('=== #root HTML ===', rootHTML.slice(0, 2000));
  
  // Check for JavaScript errors in the page
  const jsErrors = await page.evaluate(() => {
    return (window as any).__REACT_ERRORS || [];
  });
  console.log('=== JS ERRORS ===', jsErrors);
  
  expect(consoleErrors.filter(e => !e.includes('WebSocket')).length).toBe(0);
});