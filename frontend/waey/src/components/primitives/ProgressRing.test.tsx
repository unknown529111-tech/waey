import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import ProgressRing from "./ProgressRing";
import { renderInLang } from "./test-utils";

const circumference = 2 * Math.PI * 52;

const ring = {
  value: 72,
  label: "التقدّم في عادات النوم",
};

const offsetOf = () => Number(screen.getByTestId("ring-arc").getAttribute("stroke-dashoffset"));

describe("ProgressRing", () => {
  it("renders the real percentage with the locale sign and the caption", () => {
    const { unmount } = renderInLang(<ProgressRing {...ring} />);
    expect(screen.getByText("72٪")).toBeInTheDocument();
    expect(screen.getByText(ring.label)).toBeInTheDocument();
    unmount();

    renderInLang(<ProgressRing value={72} label="Progress on sleep habits" />, "en");
    expect(screen.getByText("72%")).toBeInTheDocument();
    expect(screen.getByText("Progress on sleep habits")).toBeInTheDocument();
  });

  it("is exposed as an image named from the label and the percentage", () => {
    renderInLang(<ProgressRing {...ring} />);

    const img = screen.getByRole("img", { name: `${ring.label} 72٪` });
    expect(img.tagName.toLowerCase()).toBe("svg");
  });

  it("derives the arc offset from the value", () => {
    const { unmount } = renderInLang(<ProgressRing value={100} label={ring.label} />);
    expect(offsetOf()).toBeCloseTo(circumference * (1 - 100 / 100));
    unmount();

    const quarter = renderInLang(<ProgressRing value={25} label={ring.label} />);
    expect(offsetOf()).toBeCloseTo(circumference * (1 - 25 / 100));
    quarter.unmount();

    renderInLang(<ProgressRing value={0} label={ring.label} />);
    expect(offsetOf()).toBeCloseTo(circumference * (1 - 0 / 100));
  });

  it("starts the arc at twelve o'clock with a rounded cap", () => {
    renderInLang(<ProgressRing {...ring} />);

    const arc = screen.getByTestId("ring-arc");
    expect(arc).toHaveAttribute("transform", "rotate(-90 60 60)");
    expect(arc).toHaveAttribute("stroke-linecap", "round");
    expect(arc).toHaveAttribute("stroke-dasharray", String(circumference));
  });

  it("clamps values outside 0–100", () => {
    const { unmount } = renderInLang(<ProgressRing value={150} label={ring.label} />);
    expect(screen.getByText("100٪")).toBeInTheDocument();
    expect(offsetOf()).toBeCloseTo(circumference * (1 - 100 / 100));
    unmount();

    renderInLang(<ProgressRing value={-20} label={ring.label} />);
    expect(screen.getByText("0٪")).toBeInTheDocument();
    expect(offsetOf()).toBeCloseTo(circumference * (1 - 0 / 100));
  });

  it("paints the arc with the field's own accent only", () => {
    const fields = ["health", "finance", "environment", "education"] as const;

    for (const field of fields) {
      const { unmount } = renderInLang(<ProgressRing {...ring} field={field} />);
      const arc = screen.getByTestId("ring-arc");

      expect(arc).toHaveClass(`stroke-field-${field}`);
      for (const other of fields) {
        if (other !== field) expect(arc).not.toHaveClass(`stroke-field-${other}`);
      }
      unmount();
    }
  });

  it("falls back to the current-field accent when no field is given", () => {
    renderInLang(<ProgressRing {...ring} />);

    expect(screen.getByTestId("ring-arc")).toHaveClass("stroke-field-current");
  });
});
