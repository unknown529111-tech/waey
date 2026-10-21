// Re-check the legal rail and the shopping list's stat band, scoped correctly.
import { chromium } from "playwright";
const BASE = process.env.BASE || "http://127.0.0.1:5188";
const browser = await chromium.launch({
  executablePath: "/home/m7/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome",
});

for (const path of ["/privacy", "/terms"]) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => localStorage.setItem("waey-lang", "en"));
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => {
    const rail = document.querySelector(".legal-rail");
    const links = [...(rail?.querySelectorAll("a[href^='#']") || [])];
    return {
      railExists: !!rail,
      railIsNav: rail?.tagName,
      labelledBy: rail?.getAttribute("aria-labelledby"),
      titleText: (rail?.querySelector("[id]")?.textContent || "").trim().slice(0, 40),
      entries: links.map((a) => ({ href: a.getAttribute("href"), text: a.textContent.trim().slice(0, 34) })),
      sections: [...document.querySelectorAll("section[id]")].map((s) => s.id),
      sticky: rail ? getComputedStyle(rail).position : null,
    };
  });
  console.log(`\n=== ${path} ===`);
  console.log("  the rail is a <" + r.railIsNav + "> labelled by:", r.labelledBy, "|", r.titleText);
  console.log("  position:", r.sticky);
  console.log("  contents entries:", r.entries.length);
  for (const e of r.entries) console.log(`     ${e.href}  ${e.text}`);
  console.log("  sections with ids:", r.sections.length, "->", r.sections.join(", "));
  const covered = r.sections.filter((s) => r.entries.some((e) => e.href === "#" + s));
  console.log(`  sections reachable from the rail: ${covered.length}/${r.sections.length}`);
  await page.close();
}

// the shopping list's stat band, with the real numbers
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => localStorage.setItem("waey-lang", "en"));
  await page.goto(`${BASE}/shopping-list`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1400);
  const empty = await page.evaluate(() => {
    const b = document.querySelector(".shop-metrics");
    return b ? b.innerText.replace(/\s+/g, " ").trim().slice(0, 160) : "(none found)";
  });
  await page.evaluate(() => localStorage.setItem("waey_shopping_list", JSON.stringify([
    { key: "tomatoes", name: "Tomatoes", checked: false },
    { key: "olive oil", name: "Olive oil", checked: true },
    { key: "lentils", name: "Lentils", checked: false },
  ])));
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const seeded = await page.evaluate(() => {
    const b = document.querySelector(".shop-metrics");
    return b ? b.innerText.replace(/\s+/g, " ").trim().slice(0, 160) : "(none found)";
  });
  console.log("\n=== the shopping list's stat band ===");
  console.log("  empty  :", empty);
  console.log("  seeded :", seeded);
  console.log("  =>", empty !== seeded && seeded.length > 0
    ? "PASS the numbers move with the data"
    : "FAIL the band does not reflect the data");
  await page.close();
}

await browser.close();
