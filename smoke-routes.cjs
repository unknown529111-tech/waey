// Smoke test: visit every route, fail on any page error / console error.
// Run against the live dev server: node smoke-routes.cjs
const { chromium } = require("playwright-core");

const BASE = process.env.BASE_URL || "http://localhost:8080";
// Route map mirrors App.tsx lazy imports; * = standalone page not under layout
const ROUTES = [
  "/", "/health", "/finance", "/environment", "/education",
  "/recipes", "/quiz", "/plans", "/assistant", "/journal",
  "/activity", "/mood", "/challenges", "/settings", "/about",
  "/privacy", "/terms", "/admin",
];

(async () => {
  let browser;
  try {
    browser = await chromium.launch();
  } catch (e) {
    console.log("SKIP: no chromium installed (" + e.message.split("\n")[0] + ")");
    return;
  }
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  let failures = 0;
  for (const r of ROUTES) {
    const errors = [];
    const onErr = (msg) => errors.push(msg);
    page.on("pageerror", onErr);
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    try {
      const resp = await page.goto(BASE + r, { waitUntil: "networkidle", timeout: 20000 });
      const status = resp ? resp.status() : "?";
      await page.waitForTimeout(1500);
      const body = await page.evaluate(() => document.body ? document.body.innerText.slice(0, 120).replace(/\s+/g, " ").trim() : "");
      page.off("pageerror", onErr);
      page.off("console", onErr);
      const real = errors.filter((e) => !/favicon|404|net::ERR|Failed to load resource/i.test(e));
      if (real.length) {
        failures++;
        console.log(`FAIL ${r} (${status}): ${real.slice(0, 3).join(" | ")}`);
        console.log(`     body: ${body}`);
      } else {
        console.log(`ok   ${r} (${status})`);
      }
    } catch (e) {
      failures++;
      const msgs = errors.slice(0, 2).join(" | ");
      console.log(`ERR  ${r}: ${e.message.split("\n")[0]} ${msgs}`);
    }
  }
  await browser.close();
  console.log(failures ? `\n${failures} ROUTE(S) FAILED` : "\nALL ROUTES CLEAN");
  process.exit(failures ? 1 : 0);
})();