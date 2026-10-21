// Waey P4 — before/after control census for /dashboard.
// Counts every interactive control the dashboard renders, in the daily view
// and the weekly view, and lists them by accessible name so a tracker that
// disappears is caught by name, not just by count.
//
// Works on both the old page (root: .relative.min-h-[60vh]) and the rebuilt
// one (root: .dash), so the same script measures both.
//
// Run: node scripts/dashboard-buttons.mjs <label>
import { chromium } from "playwright";

const BASE = "http://127.0.0.1:5174";
const LABEL = process.argv[2] || "run";

const CENSUS = async () => {
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const s = getComputedStyle(el);
    if (s.visibility === "hidden" || s.display === "none" || parseFloat(s.opacity) === 0) return false;
    return true;
  };
  const nameOf = (el) =>
    (
      el.getAttribute("aria-label") ||
      el.getAttribute("title") ||
      (el.textContent || "").trim() ||
      el.getAttribute("placeholder") ||
      (el.labels && el.labels.length ? el.labels[0].textContent.trim() : "") ||
      ""
    )
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 60);

  // The dashboard root, whichever version of the page is running.
  const root =
    document.querySelector(".dash") ||
    document.querySelector('[class*="min-h-[60vh]"]') ||
    document.body;

  const grab = (scope) => {
    const out = [];
    for (const el of scope.querySelectorAll("button, a[href], input, select, textarea, [role=button]")) {
      if (!visible(el)) continue;
      // A control inside a collapsed <details> is not reachable yet.
      if (el.closest("details:not([open])")) continue;
      out.push({
        tag: el.tagName.toLowerCase(),
        type: el.getAttribute("type") || "",
        name: nameOf(el),
      });
    }
    return out;
  };

  // The daily/weekly switch lives in the page; flip it and re-measure.
  const segButtons = [...root.querySelectorAll(".seg button")];
  const dailySeg = segButtons.find((b) => !b.getAttribute("aria-selected") || b.getAttribute("aria-selected") === "true");
  const weeklySeg = segButtons.find((b) => b !== dailySeg);

  const daily = grab(root);

  let weekly = [];
  if (weeklySeg) {
    weeklySeg.click();
    // React re-renders on the next tick; wait for the weekly view to mount.
    await new Promise((r) => setTimeout(r, 350));
    weekly = grab(root);
    if (dailySeg) {
      dailySeg.click();
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  return { daily, weekly, rootFound: root !== document.body };
};

const run = async () => {
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
  await page.goto(BASE + "/dashboard", { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(900);
  const c = await page.evaluate(CENSUS);
  await browser.close();

  const dailyButtons = c.daily.filter((x) => x.tag === "button").length;
  const weeklyButtons = c.weekly.filter((x) => x.tag === "button").length;
  const lines = [];
  lines.push(`=== ${LABEL} ===`);
  lines.push(`dashboard root detected: ${c.rootFound ? "yes" : "NO (fell back to body)"}`);
  lines.push(`daily view: ${c.daily.length} interactive controls (${dailyButtons} buttons)`);
  lines.push(`weekly view: ${c.weekly.length} interactive controls (${weeklyButtons} buttons)`);
  lines.push(`console errors: ${errors.length ? JSON.stringify(errors) : "none"}`);
  lines.push("");
  lines.push("--- daily controls ---");
  c.daily.forEach((x) => lines.push(`${x.tag}${x.type ? `[${x.type}]` : ""} :: ${x.name}`));
  lines.push("");
  lines.push("--- weekly controls ---");
  c.weekly.forEach((x) => lines.push(`${x.tag}${x.type ? `[${x.type}]` : ""} :: ${x.name}`));
  console.log(lines.join("\n"));
};

run();
