import { describe, it, expect } from "vitest";
import {
  blobShapes,
  cardRadii,
  sectionGradients,
  sectionWidths,
  sectionPadding,
  cardClasses,
  imageMaskShapes,
  sectionBgVariants,
  getBlobStyle,
  getBlobAnimation,
  getCardRadius,
  getImageMaskStyle,
} from "@/lib/organic";

describe("exports are non-empty arrays", () => {
  it("blobShapes has entries", () => {
    expect(blobShapes.length).toBeGreaterThan(0);
  });

  it("cardRadii has entries", () => {
    expect(cardRadii.length).toBeGreaterThan(0);
  });

  it("sectionGradients has entries", () => {
    expect(sectionGradients.length).toBeGreaterThan(0);
  });

  it("imageMaskShapes has entries", () => {
    expect(imageMaskShapes.length).toBeGreaterThan(0);
  });

  it("sectionBgVariants has entries", () => {
    expect(sectionBgVariants.length).toBeGreaterThan(0);
  });

  it("sectionWidths has keys", () => {
    expect(Object.keys(sectionWidths).length).toBeGreaterThan(0);
  });
});

describe("getBlobStyle", () => {
  it("returns borderRadius from blobShapes", () => {
    const style = getBlobStyle(0);
    expect(style.borderRadius).toBe(blobShapes[0]);
  });

  it("wraps around with modulo", () => {
    const style = getBlobStyle(blobShapes.length);
    expect(style.borderRadius).toBe(blobShapes[0]);
  });

  it("defaults to index 0", () => {
    const style = getBlobStyle();
    expect(style.borderRadius).toBe(blobShapes[0]);
  });
});

describe("getBlobAnimation", () => {
  it("returns animationDelay and animationDuration", () => {
    const anim = getBlobAnimation(0);
    expect(anim.animationDelay).toBe("0s");
    expect(anim.animationDuration).toBe("8s");
  });

  it("wraps around with modulo", () => {
    const anim = getBlobAnimation(8);
    expect(anim.animationDelay).toBe("0s");
    expect(anim.animationDuration).toBe("8s");
  });
});

describe("getCardRadius", () => {
  it("returns the correct string from cardRadii", () => {
    expect(getCardRadius(0)).toBe(cardRadii[0]);
    expect(getCardRadius(1)).toBe(cardRadii[1]);
  });

  it("wraps around with modulo", () => {
    expect(getCardRadius(cardRadii.length)).toBe(cardRadii[0]);
  });
});

describe("getImageMaskStyle", () => {
  it("returns borderRadius from blobShapes with offset", () => {
    const style = getImageMaskStyle(0);
    expect(style.borderRadius).toBe(blobShapes[3]);
  });
});
