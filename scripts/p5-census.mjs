// Waey P5 — before/after control census for /insights and /recipes.
//
// Counts every interactive control the two pages render and lists them by
// accessible name, so a control that disappears is caught by name and not
// only by count. Works on both the old pages and the rebuilt ones.
//
// Run: node scripts/p5-census.mjs <label>
import { chromium } from "playwright";

const BASE = "http://127.0.0.1:5188";
const LABEL = process.argv[2] || "run";

const CENSUS = () => {
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const s = getComputedStyle(el);
    if (s.visibility === "hidden" || s.display === "none" || parseFloat(s.opacity) === 0)
      return false;
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
      .slice(0, 70);

  const grab = (scope) => {
    const out = [];
    for (const el of scope.querySelectorAll(
      "button, a[href], input, select, textarea, [role=button], summary",
    )) {
      if (!visible(el)) continue;
      if (el.closest("details:not([open])") && el.tagName !== "SUMMARY") continue;
      if (el.closest('[aria-hidden="true"]')) continue;
      const r = el.getBoundingClientRect();
      out.push({
        tag: el.tagName.toLowerCase(),
        type: el.getAttribute("type") || "",
        name: nameOf(el),
        w: Math.round(r.width),
        h: Math.round(r.height),
      });
    }
    return out;
  };

  const main = document.querySelector("main") || document.body;
  return { controls: grab(main) };
};

const measurePage = async (page, route) => {
  await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(900);
  const c = await page.evaluate(CENSUS);
  const overflow = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }));
  return { ...c, overflow };
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

  const insights = await measurePage(page, "/insights");
  const recipes = await measurePage(page, "/recipes");

  await browser.close();

  const lines = [];
  lines.push(`=== ${LABEL} ===`);
  for (const [route, c] of [
    ["/insights", insights],
    ["/recipes", recipes],
  ]) {
    const buttons = c.controls.filter((x) => x.tag === "button").length;
    lines.push("");
    lines.push(`--- ${route} ---`);
    lines.push(`controls: ${c.controls.length} (${buttons} buttons)`);
    lines.push(
      `horizontal overflow: scrollW ${c.overflow.scrollW} vs clientW ${c.overflow.clientW}`,
    );
    c.controls.forEach((x) =>
      lines.push(
        `${x.tag}${x.type ? `[${x.type}]` : ""} ${x.w}x${x.h} :: ${x.name || "(no name)"}`,
      ),
    );
  }
  lines.push("");
  lines.push(`console errors: ${errors.length ? JSON.stringify(errors, null, 2) : "none"}`);
  console.log(lines.join("\n"));
};

run();
