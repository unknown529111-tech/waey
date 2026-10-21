// Waey P4 — browser audit for /dashboard.
// Measures, per theme / width / language:
//   * every text/background contrast pair (WCAG AA, 4.5:1 body, 3:1 large)
//   * every interactive control's accessible name and tap-target size
//   * console errors
//   * horizontal overflow
// Run: node scripts/dashboard-audit.mjs
import { chromium } from "playwright";

const BASE = "http://127.0.0.1:5174";
const PATHS = ["/dashboard"];
const WIDTHS = [320, 768, 1024, 1440];
const THEMES = ["light", "dark"];
const LANGS = ["en", "ar"];

const srgb = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = ([r, g, b]) => 0.2126 * srgb(r / 255) + 0.7152 * srgb(g / 255) + 0.0722 * srgb(b / 255);
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

const AUDIT = () => {
  const out = { contrast: [], small: [], enhanced: [], unnamed: [], overflow: null, text: 0 };

  // These helpers must live INSIDE the function: page.evaluate() serialises
  // only the function's own source.
  const srgb = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const lum = ([r, g, b]) => 0.2126 * srgb(r / 255) + 0.7152 * srgb(g / 255) + 0.0722 * srgb(b / 255);
  const ratio = (a, b) => {
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  };
  const parse = (s) => {
    const m = s.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(",").map((x) => parseFloat(x));
    return { rgb: [p[0], p[1], p[2]], a: p.length > 3 ? p[3] : 1 };
  };
  const over = (fg, bg) => fg.rgb.map((c, i) => c * fg.a + bg[i] * (1 - fg.a));

  const bgOf = (el) => {
    let node = el;
    let acc = [255, 255, 255];
    const stack = [];
    while (node && node !== document.documentElement) {
      const c = parse(getComputedStyle(node).backgroundColor);
      if (c && c.a > 0) {
        stack.push(c);
        if (c.a === 1) break;
      }
      node = node.parentElement;
    }
    for (let i = stack.length - 1; i >= 0; i--) acc = over(stack[i], acc);
    return acc;
  };

  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const s = getComputedStyle(el);
    if (s.visibility === "hidden" || s.display === "none" || parseFloat(s.opacity) === 0) return false;
    return true;
  };

  // Only audit the dashboard page itself — not the shared navbar/footer,
  // which were audited on the four field pages already.
  const root = document.querySelector(".dash");
  if (!root) return { error: "no .dash root", contrast: [], small: [], enhanced: [], unnamed: [], overflow: null, text: 0 };

  for (const el of root.querySelectorAll("*")) {
    if (!visible(el)) continue;
    const s = getComputedStyle(el);
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);
    if (!own) continue;
    const fg = parse(s.color);
    if (!fg || fg.a === 0) continue;
    const bg = bgOf(el);
    const r = ratio(over(fg, bg), bg);
    const px = parseFloat(s.fontSize);
    const bold = parseInt(s.fontWeight, 10) >= 700;
    const large = px >= 24 || (bold && px >= 18.66);
    const need = large ? 3 : 4.5;
    out.text++;
    if (r < need) {
      out.contrast.push({
        sel: el.tagName.toLowerCase() + "." + (el.className || "").toString().split(" ").filter(Boolean).slice(0, 2).join("."),
        text: el.textContent.trim().slice(0, 48),
        ratio: +r.toFixed(2),
        need,
        px,
        color: s.color,
      });
    }
  }

  for (const el of root.querySelectorAll("a, button, input, select, textarea, [role=button], [role=link]")) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const name =
      el.getAttribute("aria-label") ||
      el.getAttribute("title") ||
      (el.textContent || "").trim() ||
      el.getAttribute("placeholder") ||
      (el.labels && el.labels.length ? el.labels[0].textContent.trim() : "") ||
      "";
    if (!name) {
      out.unnamed.push(el.tagName.toLowerCase() + "." + (el.className || "").toString().split(" ").filter(Boolean).slice(0, 2).join("."));
    }
    const inline = getComputedStyle(el).display === "inline" && el.tagName === "A";
    if (!inline && (r.height < 24 || r.width < 24)) {
      out.small.push({
        sel: el.tagName.toLowerCase() + "." + (el.className || "").toString().split(" ").filter(Boolean).slice(0, 2).join("."),
        name: name.slice(0, 40),
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        below: "24x24 (WCAG 2.5.8)",
      });
    } else if (!inline && (r.height < 44 || r.width < 44)) {
      out.enhanced.push({
        sel: el.tagName.toLowerCase() + "." + (el.className || "").toString().split(" ").filter(Boolean).slice(0, 2).join("."),
        name: name.slice(0, 40),
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        below: "44x44 (enhanced)",
      });
    }
  }

  out.overflow = {
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    overflowing: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  };
  return out;
};

const run = async () => {
  const browser = await chromium.launch({
    executablePath: "/home/m7/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const report = [];
  for (const lang of LANGS) {
    for (const theme of THEMES) {
      for (const width of WIDTHS) {
        const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
        const page = await ctx.newPage();
        const errors = [];
        page.on("console", (m) => {
          if (m.type() === "error") errors.push(m.text().slice(0, 200));
        });
        page.on("pageerror", (e) => errors.push("PAGEERROR " + String(e).slice(0, 200)));
        await page.addInitScript((t) => localStorage.setItem("waey-theme", t), theme);
        await page.addInitScript((l) => localStorage.setItem("waey-lang", l), lang);
        for (const path of PATHS) {
          await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 45000 });
          await page.waitForTimeout(800);
          const data = await page.evaluate(AUDIT);
          report.push({
            lang,
            theme,
            width,
            path,
            errors,
            textNodes: data.text,
            contrast: data.contrast,
            small: data.small,
            enhanced: data.enhanced,
            unnamed: data.unnamed,
            overflow: data.overflow,
            error: data.error,
          });
        }
        await ctx.close();
      }
    }
  }
  await browser.close();
  console.log(JSON.stringify(report, null, 1));
};

run();
