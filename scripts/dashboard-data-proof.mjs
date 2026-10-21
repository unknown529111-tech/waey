// Waey P4 — proves the dashboard's numbers come from the app's own data.
// Seeds the trackers in localStorage, reloads, and reads the numbers the page
// renders: the overall ProgressRing, each field card's percentage and its
// done-of-total count, and the quick-stats tiles.
//
// Run: node scripts/dashboard-data-proof.mjs
import { chromium } from "playwright";

const BASE = "http://127.0.0.1:5174";

const READ = () => {
  const txt = (sel) => (document.querySelector(sel)?.textContent || "").replace(/\s+/g, " ").trim();

  // The ProgressRing draws its arc with strokeDashoffset; the value it shows
  // is the number inside the ring.
  const ring = document.querySelector(".dash-progress figure");
  const ringValue = ring ? (ring.textContent || "").replace(/\s+/g, " ").trim() : "";

  // Each field card: name, done-of-total, percentage.
  const fields = [...document.querySelectorAll(".dash-field")].map((el) => ({
    field: el.getAttribute("data-field"),
    text: (el.textContent || "").replace(/\s+/g, " ").trim(),
    barWidth: el.querySelector(".dash-field-bar > span")?.style.width || "",
  }));

  // The quick-stats rail (StatTile).
  const stats = [...document.querySelectorAll(".dash-stat")].map((el) =>
    (el.textContent || "").replace(/\s+/g, " ").trim(),
  );

  // The trackers the page renders, with their live values.
  const trackers = [...document.querySelectorAll(".dash-tracker")].map((el) => ({
    label: el.getAttribute("aria-label"),
    count: el.querySelector(".dash-count")?.textContent?.replace(/\s+/g, " ").trim() || "",
  }));

  const pending = txt(".dash-pending");

  return { ringValue, fields, stats, trackers, pending };
};

const dayKey = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

const SCENARIOS = [
  {
    name: "empty (no data seeded)",
    seed: () => {},
  },
  {
    name: "water 8/8, sleep 7h, activity 30min, mood 4, weight 72, eco 3, 1 expense, 1 goal",
    seed: () => {
      const k = dayKey;
      localStorage.setItem("waey_water", JSON.stringify({ [k]: 8 }));
      localStorage.setItem("waey_sleep", JSON.stringify({ [k]: 7 }));
      localStorage.setItem("waey_activity", JSON.stringify({ [k]: 30 }));
      localStorage.setItem("waey_mood", JSON.stringify({ [k]: 4 }));
      localStorage.setItem("waey_weight", JSON.stringify({ [k]: 72 }));
      localStorage.setItem("waey_eco", JSON.stringify({ [k]: 3 }));
      localStorage.setItem(`waey_expenses_${k}`, JSON.stringify([
        { id: "e1", amount: 250, category: "food", note: "lunch", ts: Date.now() },
      ]));
      localStorage.setItem("waey_goals", JSON.stringify([
        { id: "g1", title: "Read 20 pages", category: "education", target: 10, current: 5 },
      ]));
    },
  },
];

const run = async () => {
  const browser = await chromium.launch({
    executablePath: "/home/m7/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome",
    args: ["--no-sandbox", "--disable-gpu"],
  });

  for (const sc of SCENARIOS) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 1200 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text().slice(0, 160));
    });
    page.on("pageerror", (e) => errors.push("PAGEERROR " + String(e).slice(0, 160)));
    await page.addInitScript(() => localStorage.setItem("waey-lang", "en"));
    await page.addInitScript((seedSrc) => {
      // The seed runs in the page, so it must not close over Node scope.
      const d = new Date();
      const p = (n) => String(n).padStart(2, "0");
      const dayKey = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
      // eslint-disable-next-line no-new-func
      const seed = new Function("localStorage", "dayKey", seedSrc);
      seed(localStorage, dayKey);
    }, `return (${sc.seed.toString()})();`);
    await page.goto(BASE + "/dashboard", { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(900);
    const data = await page.evaluate(READ);

    console.log(`\n=== ${sc.name} ===`);
    console.log(`overall ProgressRing : ${data.ringValue}`);
    console.log(`pending line         : ${data.pending}`);
    console.log("field cards:");
    data.fields.forEach((f) => console.log(`  ${f.field.padEnd(12)} bar=${f.barWidth.padEnd(7)} :: ${f.text}`));
    console.log("quick stats:");
    data.stats.forEach((s) => console.log(`  ${s}`));
    console.log("trackers:");
    data.trackers.forEach((t) => console.log(`  ${String(t.label).padEnd(34)} ${t.count}`));
    console.log(`console errors: ${errors.length ? JSON.stringify(errors) : "none"}`);
    await ctx.close();
  }

  await browser.close();
};

run();
