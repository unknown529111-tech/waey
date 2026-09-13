import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import ar from "@/locales/ar";
import en from "@/locales/en";

/**
 * Recursively collect .ts/.tsx source files (excluding locales and tests),
 * extract every t('key') / _t('key') reference, and assert each key exists
 * in both locale dictionaries. This catches the class of bug the old
 * ar<->en parity check missed: keys referenced in code but defined nowhere,
 * which rendered raw keys like "ai.fallback.general" to users in prod.
 */
function collectSourceKeys(): Set<string> {
  const root = path.resolve(__dirname, "..");
  const keys = new Set<string>();
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      if (entry === "locales" || entry === "test" || entry === "node_modules") continue;
      const full = path.join(dir, entry);
      let st;
      try { st = statSync(full); } catch { continue; }
      if (st.isDirectory()) { walk(full); continue; }
      if (!/\.(ts|tsx)$/.test(entry)) continue;
      const src = readFileSync(full, "utf-8");
      for (const m of src.matchAll(/\bt\(\s*'([a-zA-Z0-9_.]+)'\s*\)/g)) keys.add(m[1]);
    }
  };
  walk(root);
  return keys;
}

describe("locale parity", () => {
  it("ar and en expose identical key sets", () => {
    const a = Object.keys(ar);
    const e = Object.keys(en);
    const missingInEn = a.filter((k) => !(k in en));
    const missingInAr = e.filter((k) => !(k in ar));
    expect(missingInEn, "keys in ar missing from en").toEqual([]);
    expect(missingInAr, "keys in en missing from ar").toEqual([]);
  });

  it("no empty values", () => {
    for (const [k, v] of Object.entries(ar)) expect(v, `ar.${k}`).not.toBe("");
    for (const [k, v] of Object.entries(en)) expect(v, `en.${k}`).not.toBe("");
  });

  it("every key referenced in source code exists in both locales", () => {
    const referenced = collectSourceKeys();
    expect(referenced.size, "sanity: source references should be found").toBeGreaterThan(300);
    const missingAr = [...referenced].filter((k) => !(k in ar));
    const missingEn = [...referenced].filter((k) => !(k in en));
    expect(missingAr, `keys referenced in code but missing from ar: ${missingAr.join(", ")}`).toEqual([]);
    expect(missingEn, `keys referenced in code but missing from en: ${missingEn.join(", ")}`).toEqual([]);
  });
});
