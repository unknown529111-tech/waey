import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import SectionHeading from "./SectionHeading";
import { renderInLang } from "./test-utils";

const heading = {
  eyebrow: "المجالات",
  title: "اختر مجالك",
  lead: "أربعة مجالات، وخطوة صغيرة واحدة كل يوم.",
  action: { label: "كل المجالات", to: "/fields" },
};

describe("SectionHeading", () => {
  it("renders the eyebrow, title, lead and a real action link", () => {
    renderInLang(<SectionHeading {...heading} />);

    expect(screen.getByText("المجالات")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "اختر مجالك" })).toBeInTheDocument();
    expect(
      screen.getByText("أربعة مجالات، وخطوة صغيرة واحدة كل يوم."),
    ).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "كل المجالات" });
    expect(link).toHaveAttribute("href", "/fields");
  });

  it("points the arrow left in Arabic and right in English", () => {
    const { unmount } = renderInLang(<SectionHeading {...heading} />);
    expect(screen.getByTestId("arrow")).toHaveClass("lucide-arrow-left");
    unmount();

    renderInLang(
      <SectionHeading
        eyebrow="Fields"
        title="Choose your field"
        lead="Four fields, one small step a day."
        action={{ label: "All fields", to: "/fields" }}
      />,
      "en",
    );
    expect(screen.getByRole("link", { name: "All fields" })).toBeInTheDocument();
    expect(screen.getByTestId("arrow")).toHaveClass("lucide-arrow-right");
  });

  it("omits the action link when no action is given", () => {
    renderInLang(<SectionHeading title="اختر مجالك" />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByText("المجالات")).not.toBeInTheDocument();
  });
});
