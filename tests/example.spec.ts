import { test, expect } from '@playwright/test';

test('Playwright is working', async ({ page }) => {
  await page.goto('about:blank');
  await expect(page).toHaveTitle('');
});
