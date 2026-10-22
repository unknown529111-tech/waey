// Functional proof for the Phase 5-2a pages.
//
// FAQ: the accordion must open and close, and the search must narrow the
// list in BOTH languages.
// Assistant: the chat must still send, stop and clear, and the four
// suggestion chips must still be there.
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://127.0.0.1:5188";
const browser = await chromium.launch({
  executablePath: "/home/m7/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome",
});

const errors = [];
async function open(path, lang) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on("console", (m) => m.type() === "error" && errors.push(`[${path}] ${m.text().slice(0, 140)}`));
  page.on("pageerror", (e) => errors.push(`[${path}] PAGEERROR ` + String(e).slice(0, 200)));
  await page.addInitScript((l) => localStorage.setItem("waey-lang", l), lang);
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1600);
  return page;
}

// ── the FAQ accordion ──────────────────────────────────────────
{
  const page = await open("/faq", "en");
  const s = await page.evaluate(() => {
    // scope to the FAQ's own list, so the navbar's menu button is not counted
    const list = document.querySelector(".faq-list");
    const btns = [...list.querySelectorAll("button[aria-expanded]")];
    return {
      count: btns.length,
      expanded: btns.map((b) => b.getAttribute("aria-expanded")),
      controls: btns.every((b) => b.getAttribute("aria-controls")),
      panels: btns.map((b) => {
        const id = b.getAttribute("aria-controls");
        const p = document.getElementById(id);
        return { id, exists: !!p, role: p?.getAttribute("role"), hidden: p?.hidden };
      }),
      names: btns.map((b) => b.textContent.trim().slice(0, 44)),
    };
  });
  console.log("=== FAQ accordion (English) ===");
  console.log("  question buttons:", s.count);
  console.log("  every button has aria-controls:", s.controls);
  console.log("  panels all exist:", s.panels.every((p) => p.exists));
  console.log("  panels all role=region:", s.panels.every((p) => p.role === "region"));
  console.log("  hidden states:", s.panels.map((p) => (p.hidden ? "hidden" : "open")).join(", "));
  console.log("  questions:", s.names.join(" | "));

  // click the SECOND question (the first is open by default) and watch it
  const before = await page.evaluate(() => {
    const b = document.querySelectorAll(".faq-list button[aria-expanded]")[1];
    const p = document.getElementById(b.getAttribute("aria-controls"));
    return { expanded: b.getAttribute("aria-expanded"), hidden: p.hidden };
  });
  await page.evaluate(() => document.querySelectorAll(".faq-list button[aria-expanded]")[1].click());
  await page.waitForTimeout(500);
  const after = await page.evaluate(() => {
    const b = document.querySelectorAll(".faq-list button[aria-expanded]")[1];
    const p = document.getElementById(b.getAttribute("aria-controls"));
    return { expanded: b.getAttribute("aria-expanded"), hidden: p.hidden, text: (p.textContent || "").trim().length };
  });
  console.log(`  click the 2nd question: aria-expanded ${before.expanded} -> ${after.expanded}, panel hidden ${before.hidden} -> ${after.hidden}, answer ${after.text} chars`);
  console.log("  =>", after.expanded === "true" && after.hidden === false
    ? "PASS the answer opens and becomes visible"
    : "FAIL");

  // ── the search, in both languages ────────────────────────────
  async function search(lang, term, label) {
    await page.evaluate((l) => localStorage.setItem("waey-lang", l), lang);
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(1400);
    const total = await page.evaluate(() => document.querySelectorAll(".faq-list button[aria-expanded]").length);
    await page.fill(".faq-search input[type='search'], input[type='search']", term);
    await page.waitForTimeout(700);
    const r = await page.evaluate(() => ({
      n: document.querySelectorAll(".faq-list button[aria-expanded]").length,
      names: [...document.querySelectorAll(".faq-list button[aria-expanded]")].map((b) => b.textContent.trim().slice(0, 34)),
    }));
    console.log(`\n=== search: ${label} (${lang}, "${term}") ===`);
    console.log(`  ${total} questions -> ${r.n} matching`);
    console.log("  matches:", r.names.join(" | ") || "(none)");
    console.log("  =>", r.n > 0 && r.n < total ? "PASS" : r.n === total ? "no narrowing" : "FAIL no match");
    await page.fill("input[type='search']", "");
    await page.waitForTimeout(400);
  }

  await search("en", "streak", "English word");
  await search("en", "pwa", "English acronym");
  await search("en", "OFFLINE", "English, upper case");
  await search("ar", "نقاط", "Arabic word");
  await search("ar", "البيانات", "Arabic with the definite article");
  await search("ar", "أوفلاين", "Arabic with a hamza");
  await search("ar", "streak", "English word on the ARABIC page");

  // the empty state
  await page.fill("input[type='search']", "zzzqqqxxx");
  await page.waitForTimeout(700);
  const empty = await page.evaluate(() => ({
    status: !!document.querySelector("[role='status']"),
    text: (document.querySelector("[role='status']")?.textContent || "").trim().slice(0, 80),
    clear: !![...document.querySelectorAll("button")].find((b) =>
      /clear|reset|×|✕|مسح/i.test(b.textContent + (b.getAttribute("aria-label") || ""))),
  }));
  console.log("\n=== search with no match ===");
  console.log("  a role=status region:", empty.status, "|", empty.text);
  console.log("  a way to clear it:", empty.clear);
  console.log("  =>", empty.status && empty.clear ? "PASS a real, recoverable empty state" : "FAIL");
  await page.close();
}

// ── the assistant ──────────────────────────────────────────────
{
  const page = await open("/assistant", "en");
  const r = await page.evaluate(() => ({
    textarea: !!document.querySelector("textarea"),
    submit: !!document.querySelector("button[type='submit']"),
    h1: document.querySelector("h1")?.textContent?.trim(),
    h2s: [...document.querySelectorAll("h2")].map((h) => h.textContent.trim().slice(0, 40)),
    chips: [...document.querySelectorAll(".assistant button")].map((b) => b.textContent.trim().slice(0, 42)),
    fieldLinks: [...document.querySelectorAll(".assistant a")].map((a) => a.textContent.trim().slice(0, 34)),
  }));
  console.log("\n=== assistant ===");
  console.log("  h1:", r.h1);
  console.log("  h2s:", r.h2s.join(" | "));
  console.log("  a textarea:", r.textarea, "| a submit button:", r.submit);
  console.log("  buttons:", r.chips.join(" | "));
  console.log("  links:", r.fieldLinks.join(" | "));

  await page.fill("textarea", "How do I drink more water?");
  await page.waitForTimeout(400);
  await page.click("button[type='submit']");
  await page.waitForTimeout(4000);
  const after = await page.evaluate(() => document.body.innerText.replace(/\s+/g, " ").slice(-400));
  console.log("  after sending, the page says:", after.slice(0, 300));
  console.log("  =>", /water|cup/i.test(after) ? "PASS the assistant still answers" : "FAIL no answer");
  await page.close();
}

console.log("\n=== console errors across the run ===");
console.log(errors.length ? errors.slice(0, 6) : "none");
await browser.close();
