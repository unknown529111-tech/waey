// Waey P4 — screenshots of /dashboard for the design review.
// Run: node scripts/dashboard-shots.mjs
import { chromium } from "playwright";

const browser = await chromium.launch({
  executablePath: "/home/m7/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome",
  args: ["--no-sandbox", "--disable-gpu"],
});

const shots = [
  { name: "ar-light-1440", lang: "ar", theme: "light", width: 1440, height: 2400 },
  { name: "en-light-1440", lang: "en", theme: "light", width: 1440, height: 2400 },
  { name: "en-dark-1440", lang: "en", theme: "dark", width: 1440, height: 2400 },
  { name: "ar-light-390", lang: "ar", theme: "light", width: 390, height: 1400 },
];

for (const s of shots) {
  const ctx = await browser.newContext({ viewport: { width: s.width, height: s.height } });
  const page = await ctx.newPage();
  await page.addInitScript((t) => localStorage.setItem("waey-theme", t), s.theme);
  await page.addInitScript((l) => localStorage.setItem("waey-lang", l), s.lang);
  await page.goto("http://127.0.0.1:5174/dashboard", { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(1200);
  const path = `/home/m7/.hermes/profiles/frontendengineer/cache/scratch/dash-${s.name}.png`;
  await page.screenshot({ path, fullPage: false });
  console.log(path);
  await ctx.close();
}

await browser.close();
