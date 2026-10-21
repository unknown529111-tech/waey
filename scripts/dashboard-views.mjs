// Waey P4 — checks the daily/weekly view switch and the field links'
// accessible names on /dashboard.
// Run: node scripts/dashboard-views.mjs
import { chromium } from "playwright";

const browser = await chromium.launch({
  executablePath: "/home/m7/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome",
  args: ["--no-sandbox", "--disable-gpu"],
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();
await page.addInitScript(() => localStorage.setItem("waey-lang", "en"));
await page.goto("http://127.0.0.1:5174/dashboard", { waitUntil: "networkidle" });
await page.waitForTimeout(800);

const daily = await page.evaluate(() => {
  const t = document.querySelector(".dash-tracker");
  return {
    trackerDisplay: t ? getComputedStyle(t).display : "absent",
    trackerCount: document.querySelectorAll(".dash-tracker").length,
  };
});

await page.evaluate(() =>
  [...document.querySelectorAll(".seg button")].find((b) => b.textContent.includes("Weekly"))?.click(),
);
await page.waitForTimeout(600);

const weekly = await page.evaluate(() => {
  const t = document.querySelector(".dash-tracker");
  return {
    trackerDisplay: t ? getComputedStyle(t).display : "absent",
    charts: document.querySelectorAll(".chart").length,
    bars: document.querySelectorAll(".bars .bar").length,
    backBtn: [...document.querySelectorAll("button")].filter((b) => b.textContent.includes("Back to Daily")).length,
  };
});

console.log("DAILY  :", JSON.stringify(daily));
console.log("WEEKLY :", JSON.stringify(weekly));

const names = await page.evaluate(() =>
  [...document.querySelectorAll(".dash-field")].map((e) => ({
    field: e.dataset.field,
    name: e.textContent.replace(/\s+/g, " ").trim(),
    aria: e.getAttribute("aria-label"),
  })),
);
console.log("FIELD LINK NAMES:");
names.forEach((n) => console.log(`   ${n.field} :: ${JSON.stringify(n.name)}`));

await browser.close();
