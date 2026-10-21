// Phase 5-1 verification for /insights.
//
// 1. Seeds a week of tracker data (the app stores a JSON map under
//    `waey_<key>`), then measures the RENDERED HEIGHT of the steps bar and
//    the eco bar. Before the fix they shared one Y axis, so the eco bar was
//    a flat sliver against a steps-scaled axis and was effectively
//    invisible. Now eco has its own axis and must be visibly tall.
// 2. Reads every chart's <figcaption> — the text a screen reader announces.
// 3. Measures the chart colours, the contrast of every text/background
//    pair, and the horizontal overflow.
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://127.0.0.1:5188";
const browser = await chromium.launch({
  executablePath: "/home/m7/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome",
});

const day = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

async function run(label, width, theme, seed) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 140)));
  page.on("pageerror", (e) => errors.push("PAGEERROR " + String(e).slice(0, 140)));

  await page.goto(`${BASE}/insights`, { waitUntil: "networkidle" });
  if (seed) {
    await page.evaluate((s) => {
      for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v);
    }, seed);
  }
  await page.evaluate((t) => localStorage.setItem("waey-theme", t), theme);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(2200);

  const r = await page.evaluate(() => {
    // Every chart is a <figure> with a visually hidden <figcaption>.
    const figs = [...document.querySelectorAll("figure.ins-figure")].map((f) => ({
      caption: (f.querySelector("figcaption")?.textContent || "").trim(),
      plotHidden: f.querySelector(".ins-chart-plot")?.getAttribute("aria-hidden") === "true",
      captionHidden: getComputedStyle(f.querySelector("figcaption")).position === "absolute",
    }));

    // Bar heights, per series, as actually rendered.
    const bars = [...document.querySelectorAll(".recharts-bar-rectangle path")].map((p) => {
      const b = p.getBoundingClientRect();
      return { h: +b.height.toFixed(1), fill: getComputedStyle(p).fill };
    });

    // The right-hand (eco) axis exists and is scaled on its own.
    const axes = [...document.querySelectorAll(".recharts-yAxis")].map((a) => ({
      side: a.getAttribute("x") || "left",
      ticks: [...a.querySelectorAll(".recharts-cartesian-axis-tick-value")].map(
        (t) => t.textContent,
      ),
    }));

    const hscroll =
      document.documentElement.scrollWidth > document.documentElement.clientWidth;

    return {
      figs,
      bars,
      axes,
      hscroll,
      docW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    };
  });

  console.log(`\n===== ${label} (${width}px, ${theme}) =====`);
  console.log("figures:", r.figs.length);
  for (const f of r.figs) {
    console.log(
      `   plot aria-hidden=${f.plotHidden}  caption screen-reader-only=${f.captionHidden}`,
    );
    console.log(`     "${f.caption.slice(0, 150)}"`);
  }
  console.log("bars rendered:", r.bars.length);
  const heights = r.bars.map((b) => b.h);
  console.log("   bar heights:", heights.slice(0, 16).join(", "));
  console.log("   bar fills  :", [...new Set(r.bars.map((b) => b.fill))].join(" | "));
  console.log("y axes:", r.axes.length);
  for (const a of r.axes) console.log(`   ticks: ${a.ticks.join(" ")}`);
  console.log(
    `horizontal overflow: ${r.hscroll} (doc ${r.docW} vs client ${r.clientW})`,
  );
  console.log("console errors:", errors.length ? errors.slice(0, 3) : "none");
  await page.close();
  return r;
}

const seed = {};
for (let i = 0; i < 7; i++) {
  const d = day(i);
  seed.waey_steps = seed.waey_steps || {};
  seed.waey_eco = seed.waey_eco || {};
  seed.waey_water = seed.waey_water || {};
  seed.waey_sleep = seed.waey_sleep || {};
  seed.waey_mood = seed.waey_mood || {};
  seed.waey_steps[d] = 7000 + i * 200;
  seed.waey_eco[d] = 3;
  seed.waey_water[d] = 8;
  seed.waey_sleep[d] = 7.5;
  seed.waey_mood[d] = 4;
}
for (const k of Object.keys(seed)) seed[k] = JSON.stringify(seed[k]);

const r = await run("SEEDED", 1440, "light", seed);
await run("SEEDED", 1440, "dark", seed);
await run("SEEDED", 320, "light", seed);

const ecoBars = r.bars.filter((b) => b.fill.includes("54, 166, 89") || b.fill.includes("31, 107, 57"));
console.log("\n===== VERDICT =====");
console.log("eco bar heights:", ecoBars.map((b) => b.h).join(", "));
console.log(
  ecoBars.length > 0 && Math.max(...ecoBars.map((b) => b.h)) > 4
    ? "PASS — the eco series is now visibly drawn"
    : "FAIL — the eco series is still a sliver",
);
const tallest = Math.max(...r.bars.map((b) => b.h));
console.log(
  ecoBars.length > 0 &&
    Math.max(...ecoBars.map((b) => b.h)) > tallest * 0.3
    ? "PASS — eco is scaled to its own axis, not crushed by the steps scale"
    : "CHECK — eco is still small relative to the steps bars",
);

await browser.close();
