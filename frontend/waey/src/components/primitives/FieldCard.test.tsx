import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { Wallet } from "lucide-react";
import FieldCard from "./FieldCard";
import { renderInLang } from "./test-utils";

const FIELDS = [
  { field: "health", plate: "bg-field-health-tint", ink: "text-field-health" },
  { field: "finance", plate: "bg-field-finance-tint", ink: "text-field-finance" },
  { field: "environment", plate: "bg-field-environment-tint", ink: "text-field-environment" },
  { field: "education", plate: "bg-field-education-tint", ink: "text-field-education" },
] as const;

describe("FieldCard", () => {
  it.each(FIELDS)("paints the $field accent on the icon", ({ field, plate, ink }) => {
    renderInLang(
      <FieldCard
        field={field}
        title="المال بوعي"
        description="اعرف أين يذهب كل جنيه قبل أن ينتهي الشهر."
        to={`/fields/${field}`}
      />,
    );

    const icon = screen.getByTestId("field-icon");
    expect(icon).toHaveClass(plate, ink);
    // no bleed from another field's tone
    const others = FIELDS.filter((f) => f.field !== field);
    for (const other of others) expect(icon).not.toHaveClass(other.plate);
  });

  it("is a link whose name carries the title and promise", () => {
    renderInLang(
      <FieldCard
        field="finance"
        title="المال بوعي"
        description="اعرف أين يذهب كل جنيه قبل أن ينتهي الشهر."
        to="/finance"
        icon={Wallet}
      />,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/finance");
    expect(link).toHaveTextContent("المال بوعي");
    expect(link).toHaveTextContent("اعرف أين يذهب كل جنيه قبل أن ينتهي الشهر.");
    expect(link).toHaveAccessibleName(/المال بوعي/);
  });

  it("points the arrow left in Arabic and right in English", () => {
    const { unmount } = renderInLang(
      <FieldCard
        field="education"
        title="تعلّم بلا ضغط"
        description="درس قصير واحد كل يوم."
        to="/education"
      />,
    );
    expect(screen.getByTestId("arrow")).toHaveClass("lucide-arrow-left");
    unmount();

    renderInLang(
      <FieldCard
        field="education"
        title="Learn without pressure"
        description="One short lesson a day."
        to="/education"
      />,
      "en",
    );
    expect(screen.getByTestId("arrow")).toHaveClass("lucide-arrow-right");
  });
});
