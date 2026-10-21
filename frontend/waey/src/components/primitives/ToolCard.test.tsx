import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { Droplets } from "lucide-react";
import ToolCard from "./ToolCard";
import { renderInLang } from "./test-utils";

describe("ToolCard", () => {
  it("renders a link with the tool name, promise and target", () => {
    renderInLang(
      <ToolCard
        icon={Droplets}
        title="حاسبة الماء"
        description="اعرف كمية الماء المناسبة لجسمك في دقيقة."
        to="/tools/water"
      />,
    );

    const link = screen.getByRole("link", { name: /حاسبة الماء/ });
    expect(link).toHaveAttribute("href", "/tools/water");
    expect(link).toHaveTextContent("اعرف كمية الماء المناسبة لجسمك في دقيقة.");
  });

  it("uses the current-field accent for the icon plate", () => {
    renderInLang(
      <ToolCard
        icon={Droplets}
        title="حاسبة الماء"
        description="اعرف كمية الماء المناسبة لجسمك في دقيقة."
        to="/tools/water"
      />,
    );

    expect(screen.getByTestId("tool-icon")).toHaveClass(
      "bg-field-current-tint",
      "text-field-current",
    );
  });

  it("hides the icon and arrow from assistive tech", () => {
    renderInLang(
      <ToolCard
        icon={Droplets}
        title="حاسبة الماء"
        description="اعرف كمية الماء المناسبة لجسمك في دقيقة."
        to="/tools/water"
      />,
    );

    expect(screen.getByTestId("arrow")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByTestId("arrow")).toHaveClass("lucide-arrow-left");
    const svg = screen.getByTestId("tool-icon").querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("points the arrow right in English", () => {
    renderInLang(
      <ToolCard
        icon={Droplets}
        title="Water calculator"
        description="Find the right daily water amount in a minute."
        to="/tools/water"
      />,
      "en",
    );

    expect(screen.getByTestId("arrow")).toHaveClass("lucide-arrow-right");
  });
});
