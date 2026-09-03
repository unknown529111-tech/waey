import { describe, it, expect } from "vitest";
import ar from "@/locales/ar";
import en from "@/locales/en";

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
});
