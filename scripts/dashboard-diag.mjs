// Waey P4 — diagnostic: is Dashboard.css applied, and does the daily/weekly
// view switch actually hide the other view?
// Run: node scripts/dashboard-diag.mjs
import { chromium } from "playwright";

const browser = await chromium.launch({
  executablePath: "/home/m7/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome",
  args: ["--no-sandbox", "--disable-gpu"],
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text().slice(0, 200));
});
page.on("pageerror", (e) => errors.push("PAGEERROR " + String(e).slice(0, 200)));
await page.addInitScript(() => localStorage.setItem("waey-lang", "en"));
await page.goto("http://127.0.0.1:5174/dashboard", { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(1200);

const info = await page.evaluate(() => {
  const hero = document.querySelector(".dash-hero");
  const video = document.querySelector(".dash-hero-video");
  const h1 = document.querySelector(".dash-hero-title");
  const sheets = [...document.styleSheets].map((s) => s.href || `inline(${s.cssRules ? s.cssRules.length : 0} rules)`);
  const dashRules = (() => {
    for (const s of document.styleSheets) {
      try {
        for (const r of s.cssRules) {
          if (r.selectorText === ".dash-hero") return "FOUND .dash-hero rule";
        }
      } catch {
        /* cross-origin sheet */
      }
    }
    return "NOT FOUND";
  })();
  const hiddenRule = (() => {
    for (const s of document.styleSheets) {
      try {
        for (const r of s.cssRules) {
          if (r.selectorText === ".hidden") return "FOUND .hidden rule";
        }
      } catch {
        /* cross-origin sheet */
      }
    }
    return "NOT FOUND";
  })();
  return {
    sheets,
    dashRules,
    hiddenRule,
    heroPosition: hero ? getComputedStyle(hero).position : "no hero",
    heroRadius: hero ? getComputedStyle(hero).borderRadius : "-",
    videoPosition: video ? getComputedStyle(video).position : "no video",
    h1FontSize: h1 ? getComputedStyle(h1).fontSize : "-",
    h1FontFamily: h1 ? getComputedStyle(h1).fontFamily.slice(0, 40) : "-",
    hasDashClass: !!document.querySelector(".dash"),
  };
});

console.log("STYLESHEETS:", JSON.stringify(info.sheets, null, 1));
console.log("dash-hero rule:", info.dashRules);
console.log(".hidden rule:", info.hiddenRule);
console.log("hero position:", info.heroPosition, "| radius:", info.heroRadius);
console.log("video position:", info.videoPosition);
console.log("h1 size:", info.h1FontSize, "| family:", info.h1FontFamily);
console.log("has .dash root:", info.hasDashClass);
console.log("console errors:", errors.length ? JSON.stringify(errors) : "none");

// Now flip to weekly and check what is actually visible.
await page.evaluate(() =>
  [...document.querySelectorAll(".seg button")].find((b) => b.textContent.includes("Weekly"))?.click(),
);
await page.waitForTimeout(700);
const flip = await page.evaluate(() => {
  const wrap = document.querySelector(".dash");
  const kids = [...wrap.children].map((el) => ({
    cls: el.className,
    display: getComputedStyle(el).display,
    height: el.getBoundingClientRect().height,
  }));
  const visibleTrackers = [...document.querySelectorAll(".dash-tracker")].filter(
    (e) => e.getBoundingClientRect().height > 0,
  ).length;
  return { kids, visibleTrackers, charts: document.querySelectorAll(".chart").length };
});
console.log("\nAFTER FLIP TO WEEKLY:");
console.log("  children of .dash:", JSON.stringify(flip.kids, null, 1));
console.log("  visible .dash-tracker elements:", flip.visibleTrackers);
console.log("  .chart elements:", flip.charts);

await browser.close();
