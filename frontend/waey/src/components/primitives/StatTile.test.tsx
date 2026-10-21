import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import StatTile from "./StatTile";
import { renderInLang } from "./test-utils";

const tile = {
  label: "معدّل النوم العميق هذا الأسبوع",
  value: "٦ ساعات",
  delta: { value: "+٤٥ دقيقة", direction: "up" as const },
  field: "health" as const,
};

describe("StatTile", () => {
  it("renders the value, the label and the field tint", () => {
    renderInLang(<StatTile {...tile} />);

    const value = screen.getByText(tile.value);
    expect(value).toBeInTheDocument();
    expect(value).toHaveClass("font-display", "tabular-nums", "text-field-health");
    expect(screen.getByText(tile.label)).toBeInTheDocument();
  });

  it("renders a delta chip with its value, icon and the locale direction text", () => {
    renderInLang(<StatTile {...tile} />);

    const chip = screen.getByTestId("delta-chip");
    expect(within(chip).getByText("+٤٥ دقيقة")).toBeInTheDocument();
    expect(within(chip).getByText("ارتفاع")).toHaveClass("sr-only");
    expect(screen.getByTestId("delta-icon")).toHaveClass("lucide-trending-up");
    expect(screen.getByTestId("delta-icon")).toHaveAttribute("aria-hidden", "true");
  });

  it("distinguishes up from down by class and by icon, not by colour alone", () => {
    const { unmount } = renderInLang(<StatTile {...tile} />);
    expect(screen.getByTestId("delta-chip")).toHaveClass("bg-success-soft", "text-success");
    expect(screen.getByTestId("delta-icon")).toHaveClass("lucide-trending-up");
    unmount();

    renderInLang(
      <StatTile
        label="مصروف الطعام هذا الشهر"
        value="٢٬٤٠٠ جنيه"
        delta={{ value: "−١٨٪", direction: "down" }}
        field="finance"
      />,
    );
    const chip = screen.getByTestId("delta-chip");
    expect(chip).toHaveClass("bg-danger-soft", "text-danger");
    expect(screen.getByTestId("delta-icon")).toHaveClass("lucide-trending-down");
    expect(within(chip).getByText("انخفاض")).toHaveClass("sr-only");
  });

  it("renders without a delta", () => {
    renderInLang(<StatTile label="أيام الالتزام المتتابعة" value="١٢ يومًا" />);

    expect(screen.getByText("١٢ يومًا")).toBeInTheDocument();
    expect(screen.getByText("أيام الالتزام المتتابعة")).toBeInTheDocument();
    expect(screen.queryByTestId("delta-chip")).not.toBeInTheDocument();
    expect(screen.queryByTestId("delta-icon")).not.toBeInTheDocument();
  });

  it("renders in English", () => {
    renderInLang(
      <StatTile
        label="Weekly savings"
        value="EGP 1,240"
        delta={{ value: "+9%", direction: "up" }}
        field="finance"
      />,
      "en",
    );

    expect(screen.getByText("EGP 1,240")).toHaveClass("text-field-finance");
    expect(screen.getByText("Weekly savings")).toBeInTheDocument();
    expect(screen.getByText("rising")).toHaveClass("sr-only");
    expect(screen.getByTestId("delta-icon")).toHaveClass("lucide-trending-up");
  });
});
