import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import TipList from "./TipList";
import { renderInLang } from "./test-utils";

const tips = [
  "اشرب كوب ماء قبل القهوة.",
  "امشِ عشر دقائق بعد الغداء.",
  "أنهِ اليوم بلا شاشة.",
];

describe("TipList", () => {
  it("renders a real list with one row per tip", () => {
    renderInLang(<TipList title="قبل أن تبدأ" items={tips} />);

    expect(screen.getByRole("heading", { name: "قبل أن تبدأ" })).toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    for (const tip of tips) expect(screen.getByText(tip)).toBeInTheDocument();
  });

  it("marks every tick aria-hidden so the text carries the signal", () => {
    renderInLang(<TipList title="Before you start" items={tips} />, "en");

    const ticks = screen.getAllByTestId("tick");
    expect(ticks).toHaveLength(tips.length);
    for (const tick of ticks) expect(tick).toHaveAttribute("aria-hidden", "true");
  });
});
