// What does /assistant actually render?
import { chromium } from "playwright";
const browser = await chromium.launch({
  executablePath: "/home/m7/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
page.on("console", (m) => errs.push(`[${m.type()}] ${m.text().slice(0, 220)}`));
page.on("pageerror", (e) => errs.push("PAGEERROR " + String(e.stack || e).slice(0, 400)));
await page.addInitScript(() => localStorage.setItem("waey-lang", "en"));
await page.goto("http://127.0.0.1:5188/assistant", { waitUntil: "networkidle" });
await page.waitForTimeout(3000);

const r = await page.evaluate(() => ({
  body: document.body.innerText.replace(/\s+/g, " ").slice(0, 700),
  hasTextarea: !!document.querySelector("textarea"),
  hasSubmit: !!document.querySelector("button[type='submit']"),
  chatTitle: !!document.body.innerText.match(/assistant|chat|مساعد/i),
  assistantClass: !!document.querySelector(".assistant"),
  h1: document.querySelector("h1")?.textContent?.trim(),
  h2s: [...document.querySelectorAll("h2")].map((h) => h.textContent.trim().slice(0, 40)),
  errorText: /problem|error|failed|تعذر|مشكلة/i.test(document.body.innerText),
}));
console.log("h1:", r.h1);
console.log("h2s:", r.h2s);
console.log(".assistant root present:", r.assistantClass);
console.log("textarea:", r.hasTextarea, "| submit:", r.hasSubmit);
console.log("body:", r.body);
console.log("\nconsole output:");
for (const e of errs.slice(0, 10)) console.log("  ", e);
await browser.close();
