import { describe, it, expect, beforeAll, vi } from "vitest";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { generateReportPDF, generateBadgesPDF } from "@/lib/share";

// jsdom 20 Blob lacks arrayBuffer()/text(); read bytes via FileReader instead.
function blobToBuffer(blob: Blob): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(Buffer.from(fr.result as ArrayBuffer));
    fr.onerror = () => reject(fr.error);
    fr.readAsArrayBuffer(blob);
  });
}

const OUT_DIR = "C:/Users/mahmo/AppData/Local/hermes";

describe("PDF export (Arabic)", () => {
  beforeAll(() => {
    const today = new Date();
    const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    localStorage.setItem("waey_streak", JSON.stringify({ count: 12, lastDay: key }));
    localStorage.setItem("waey_points", "1540");
    localStorage.setItem("waey_unlocked_badges", JSON.stringify(["first_step", "streak_7", "water_8"]));
    localStorage.setItem("waey_water", JSON.stringify({ [key]: 6 }));
    localStorage.setItem("waey_sleep", JSON.stringify({ [key]: 7 }));
    localStorage.setItem("waey_steps", JSON.stringify({ [key]: 8400 }));
    localStorage.setItem("waey_mood", JSON.stringify({ [key]: 4 }));
  });

  // Serve the vendored font files locally so tests never hit the network.
  beforeAll(() => {
    const fontDir = path.resolve(__dirname, "../assets/fonts");
    vi.stubGlobal("fetch", async (url: string | URL) => {
      const name = String(url).split("/").pop();
      const file = path.join(fontDir, name ?? "");
      const body = readFileSync(file);
      return {
        ok: true,
        status: 200,
        arrayBuffer: async () =>
          body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength) as ArrayBuffer,
      } as Response;
    });
  });

  it("generateReportPDF produces a valid non-empty PDF blob", async () => {
    const blob = await generateReportPDF();
    expect(blob.size).toBeGreaterThan(2000);
    const bytes = await blobToBuffer(blob);
    expect(bytes.subarray(0, 4).toString("latin1")).toBe("%PDF");
    writeFileSync(path.join(OUT_DIR, "tmp-fixed-report.pdf"), bytes);
  });

  it("generateBadgesPDF produces a valid non-empty PDF blob", async () => {
    const blob = await generateBadgesPDF();
    expect(blob.size).toBeGreaterThan(2000);
    const bytes = await blobToBuffer(blob);
    expect(bytes.subarray(0, 4).toString("latin1")).toBe("%PDF");
    writeFileSync(path.join(OUT_DIR, "tmp-fixed-badges.pdf"), bytes);
  });
});
