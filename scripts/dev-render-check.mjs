// Does the dev server on 5174 actually RENDER the pages?
// A client-side route answers 200 for every path, including one that renders
// nothing, so the status code proves nothing. This looks at the DOM.
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://127.0.0.1:5174";
const browser = await chromium.launch({
  executablePath: "/home/m7/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome",
});
const ROUTES = ["/", "/insights", "/recipes", "/faq", "/shopping-list", "/privacy", "/terms", "/assistant", "/dashboard"];

for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 120)));
  page.on("pageerror", (e) => errors.push("PAGEERROR " + String(e).slice(0, 140)));
  try {
    await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(1200);
    const r = await page.evaluate(() => ({
      root: document.getElementById("root")?.innerHTML.length || 0,
      h1: document.querySelector("h1")?.textContent?.trim().slice(0, 34) || "(none)",
      charts: document.querySelectorAll(".recharts-surface").length,
      dead: /مشكلة في الاتصال|تعذر تحميل الصفحة|problem occurred/i.test(document.body.innerText),
    }));
    console.log(
      `${route.padEnd(16)} root=${String(r.root).padStart(6)}  h1="${r.h1}"` +
      (route === "/insights" ? `  charts=${r.charts}` : "") +
      (r.dead ? "  ** THE ERROR SCREEN **" : "") +
      (errors.length ? `  errors: ${errors.length} -> ${errors[0]}` : ""),
    );
  } catch (e) {
    console.log(`${route.padEnd(16)} FAILED: ${String(e).slice(0, 90)}`);
  }
  await page.close();
}
await browser.close();
