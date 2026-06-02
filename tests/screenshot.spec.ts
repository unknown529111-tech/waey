import { test } from "@playwright/test";
import path from "path";

const OUT = path.resolve(__dirname, "../screenshots");

test("screenshot home", async ({ page }) => {
  await page.goto("http://localhost:8080/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT, "home.png"), fullPage: true });
});

test("screenshot assistant", async ({ page }) => {
  await page.goto("http://localhost:8080/assistant", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT, "assistant.png"), fullPage: true });
});
