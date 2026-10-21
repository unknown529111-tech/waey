import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import StatBand from "./StatBand";
import { renderInLang } from "./test-utils";

const statsAr = [
  { value: "٤", label: "مجالات متكاملة" },
  { value: "٥ دقائق", label: "تمرين يومي" },
  { value: "٧ أيام", label: "التزام أسبوعي" },
  { value: "١٠٠٪", label: "بياناتك تبقى لك" },
];

const statsEn = [
  { value: "4", label: "connected fields" },
  { value: "5 min", label: "daily practice" },
  { value: "7 days", label: "weekly commitment" },
  { value: "100%", label: "your data stays yours" },
];

describe("StatBand", () => {
  it("is a named section with all four numbers and captions", () => {
    renderInLang(<StatBand items={statsAr} />);

    const band = screen.getByRole("region", { name: "أرقام تستحق الوقوف عندها" });
    expect(band.tagName).toBe("SECTION");
    for (const { value, label } of statsAr) {
      expect(within(band).getByText(value)).toBeInTheDocument();
      expect(within(band).getByText(label)).toBeInTheDocument();
    }
  });

  it("takes its accessible name from the English dictionary", () => {
    renderInLang(<StatBand items={statsEn} />, "en");

    expect(
      screen.getByRole("region", { name: "Numbers worth pausing on" }),
    ).toBeInTheDocument();
  });

  it("uses the primary ground in light and the footer band in dark", () => {
    renderInLang(<StatBand items={statsAr} />);

    const band = screen.getByRole("region", { name: "أرقام تستحق الوقوف عندها" });
    expect(band).toHaveClass("bg-primary", "text-primary-foreground", "dark:bg-footer");
  });
});
