// Waey P4 — screenshot the weekly view, asserting the styles are applied at
// the moment the shot is taken (a capture during a CSS/HMR race shows an
// unstyled page and misleads the review).
// Run: node scripts/dashboard-weekly-shot.mjs
import { chromium } from "playwright";

const browser = await chromium.launch({
  executablePath: "/home/m7/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome",
  args: ["--no-sandbox", "--disable-gpu"],
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1500 } });
const page = await ctx.newPage();
await page.addInitScript(() => localStorage.setItem("waey-theme", "light"));
await page.addInitScript(() => localStorage.setItem("waey-lang", "en"));
await page.goto("http://127.0.0.1:5174/dashboard", { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(1200);

await page.evaluate(() =>
  [...document.querySelectorAll(".seg button")].find((b) => b.textContent.includes("Weekly"))?.click(),
);
// Wait for the weekly charts to be laid out, not just for a timer.
await page.waitForFunction(() => document.querySelectorAll(".chart").length === 5, { timeout: 10000 });
await page.waitForTimeout(600);

const applied = await page.evaluate(() => {
  const h1 = document.querySelector(".dash-hero-title");
  const chart = document.querySelector(".chart .bars .bar");
  return {
    h1Size: h1 ? getComputedStyle(h1).fontSize : "-",
    barWidth: chart ? getComputedStyle(chart).width : "-",
    barHeight: chart ? getComputedStyle(chart).height : "-",
    visibleTrackers: [...document.querySelectorAll(".dash-tracker")].filter(
      (e) => e.getBoundingClientRect().height > 0,
    ).length,
  };
});
console.log("applied at capture:", JSON.stringify(applied));

const out = "/home/m7/.hermes/profiles/frontendengineer/cache/scratch/dash-en-weekly.png";
await page.screenshot({ path: out });
console.log(out);
await browser.close();
