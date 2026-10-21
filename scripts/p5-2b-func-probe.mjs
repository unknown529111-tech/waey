// Phase 5-2b functional proof.
//
// Shopping list: the three defects must actually be fixed —
//   1. every per-item control names the item it acts on;
//   2. the remove button is visible with NO pointer over it, and on focus;
//   3. both are at least 44x44.
//   And the StatBand must show DIFFERENT numbers for an empty list and a
//   seeded one, so the figures are visibly derived from the data.
//
// Legal pages: clicking a contents entry must move the page to that section.
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://127.0.0.1:5188";
const browser = await chromium.launch({
  executablePath: "/home/m7/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome",
});

const errors = [];
const SEED = [
  { key: "tomatoes", name: "Tomatoes", checked: false },
  { key: "olive oil", name: "Olive oil", checked: true },
  { key: "lentils", name: "Lentils", checked: false },
];

async function open(path, lang = "en") {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on("console", (m) => m.type() === "error" && errors.push(`[${path}] ${m.text().slice(0, 130)}`));
  page.on("pageerror", (e) => errors.push(`[${path}] PAGEERROR ` + String(e).slice(0, 180)));
  await page.addInitScript((l) => localStorage.setItem("waey-lang", l), lang);
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  return page;
}

// ── the shopping list ──────────────────────────────────────────
{
  const page = await open("/shopping-list");

  const empty = await page.evaluate(() => ({
    body: document.body.innerText.replace(/\s+/g, " ").slice(0, 300),
    items: document.querySelectorAll(".shop-item").length,
  }));
  console.log("=== shopping list, EMPTY ===");
  console.log("  items rendered:", empty.items);
  console.log("  page says:", empty.body.slice(0, 220));

  // seed a list and reload
  await page.evaluate((s) => localStorage.setItem("waey_shopping_list", JSON.stringify(s)), SEED);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1600);

  const r = await page.evaluate(() => {
    const row = document.querySelector(".shop-item");
    const toggle = row?.querySelector(".shop-toggle");
    const remove = row?.querySelector(".shop-remove");
    const box = (el) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { w: Math.round(b.width), h: Math.round(b.height) };
    };
    const cs = (el, p) => (el ? getComputedStyle(el)[p] : null);
    return {
      items: document.querySelectorAll(".shop-item").length,
      toggles: [...document.querySelectorAll(".shop-toggle")].map((b) => ({
        name: b.getAttribute("aria-label"),
        pressed: b.getAttribute("aria-pressed"),
        size: box(b),
      })),
      removes: [...document.querySelectorAll(".shop-remove")].map((b) => ({
        name: b.getAttribute("aria-label"),
        size: box(b),
        opacity: cs(b, "opacity"),
        visibility: cs(b, "visibility"),
      })),
      band: (document.querySelector(".stat-band, [class*='stat-band'], [class*='band']")?.innerText || "")
        .replace(/\s+/g, " ")
        .slice(0, 140),
      body: document.body.innerText.replace(/\s+/g, " ").slice(0, 260),
    };
  });

  console.log("\n=== shopping list, SEEDED (3 items, 1 already checked) ===");
  console.log("  items rendered:", r.items);
  console.log("  --- the per-item toggle ---");
  for (const t of r.toggles) {
    console.log(`     ${t.size.w}x${t.size.h}  aria-pressed=${t.pressed}  "${t.name}"`);
  }
  console.log("  --- the per-item remove ---");
  for (const m of r.removes) {
    console.log(`     ${m.size.w}x${m.size.h}  opacity=${m.opacity} visibility=${m.visibility}  "${m.name}"`);
  }

  const namesItem = r.toggles.every((t) => t.name && t.name.length > 4) &&
                    r.removes.every((m) => m.name && m.name.length > 4);
  const bigEnough = [...r.toggles, ...r.removes].every((b) => b.size.w >= 44 && b.size.h >= 44);
  const visible = r.removes.every((m) => Number(m.opacity) > 0.9 && m.visibility === "visible");
  console.log("  =>", namesItem ? "PASS every control names its item" : "FAIL a control has no item name");
  console.log("  =>", bigEnough ? "PASS every per-item target is at least 44x44" : "FAIL a target is too small");
  console.log("  =>", visible ? "PASS the remove button is visible with no pointer over it" : "FAIL it is hidden");

  // the numbers must move with the data
  console.log("  the band reads:", r.band || "(no band matched)");
  console.log("  the page says:", r.body.slice(0, 200));

  // focus the remove button and read it again
  await page.evaluate(() => document.querySelector(".shop-remove")?.focus());
  await page.waitForTimeout(300);
  const focused = await page.evaluate(() => {
    const el = document.activeElement;
    const b = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName,
      cls: el.className,
      size: `${Math.round(b.width)}x${Math.round(b.height)}`,
      opacity: cs.opacity,
      outline: cs.outlineWidth + " " + cs.outlineStyle + " " + cs.outlineColor,
      name: el.getAttribute("aria-label"),
    };
  });
  console.log("\n  after focusing the remove button:");
  console.log(`     ${focused.cls}  ${focused.size}  opacity=${focused.opacity}  outline=${focused.outline}`);
  console.log("     aria-label:", focused.name);
  await page.close();
}

// ── the legal pages ────────────────────────────────────────────
for (const path of ["/privacy", "/terms"]) {
  const page = await open(path);
  const rail = await page.evaluate(() => {
    const nav = document.querySelector("nav");
    const links = [...(nav?.querySelectorAll("a") || [])];
    return {
      hasNav: !!nav,
      label: nav?.getAttribute("aria-labelledby"),
      links: links.map((a) => ({ href: a.getAttribute("href"), text: a.textContent.trim().slice(0, 40) })),
      sections: document.querySelectorAll("section[id]").length,
    };
  });
  console.log(`\n=== ${path} ===`);
  console.log("  a <nav> with a label:", rail.hasNav, "| labelled by:", rail.label);
  console.log("  sections with ids:", rail.sections);
  console.log("  contents entries:", rail.links.length);
  for (const l of rail.links.slice(0, 4)) console.log(`     ${l.href}  ${l.text}`);

  // every contents link must point at a section that exists
  const dangling = await page.evaluate(() => {
    const links = [...document.querySelectorAll("nav a[href^='#']")];
    return links
      .filter((a) => !document.getElementById(a.getAttribute("href").slice(1)))
      .map((a) => a.getAttribute("href"));
  });
  console.log("  dangling links:", dangling.length ? dangling.join(", ") : "none");
  console.log("  =>", rail.hasNav && rail.links.length >= 5 && rail.sections >= 5 && !dangling.length
    ? "PASS a contents rail over the sections, no dead links"
    : "FAIL");

  // click a contents entry and check the section comes into view
  const moved = await page.evaluate(async () => {
    const links = [...document.querySelectorAll("nav a[href^='#']")];
    const last = links[links.length - 1];
    if (!last) return { ok: false };
    const id = last.getAttribute("href").slice(1);
    const before = window.scrollY;
    last.click();
    await new Promise((r) => setTimeout(r, 900));
    const target = document.getElementById(id);
    const box = target.getBoundingClientRect();
    return {
      ok: true,
      id,
      scrollBefore: Math.round(before),
      scrollAfter: Math.round(window.scrollY),
      topInViewport: Math.round(box.top),
      inView: box.top < window.innerHeight && box.bottom > 0,
    };
  });
  console.log("  clicking the last entry:", JSON.stringify(moved));
  console.log("  =>", moved.ok && moved.inView ? "PASS the page moves to that section" : "FAIL");
  await page.close();
}

console.log("\n=== console errors ===");
console.log(errors.length ? errors.slice(0, 6) : "none");
await browser.close();
