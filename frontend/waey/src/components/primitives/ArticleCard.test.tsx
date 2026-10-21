import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import ArticleCard from "./ArticleCard";
import { renderInLang } from "./test-utils";

const FIELDS = [
  { field: "health", pill: "bg-field-health-tint", ink: "text-field-health" },
  { field: "finance", pill: "bg-field-finance-tint", ink: "text-field-finance" },
  { field: "environment", pill: "bg-field-environment-tint", ink: "text-field-environment" },
  { field: "education", pill: "bg-field-education-tint", ink: "text-field-education" },
] as const;

const article = {
  category: "الصحة",
  title: "خمس عادات صغيرة لقلب أهدأ",
  excerpt: "خطوات يومية بسيطة تصنع فرقًا في طاقتك ونومك ومزاجك.",
  meta: "١ أكتوبر ٢٠٢٦",
  to: "/insights/healthier-habits",
  image: "/insights/healthier-habits.jpg",
  field: "health" as const,
};

describe("ArticleCard", () => {
  it("is one real link carrying the title and excerpt", () => {
    renderInLang(<ArticleCard {...article} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", article.to);
    expect(screen.getByRole("heading", { level: 3, name: article.title })).toBeInTheDocument();
    expect(screen.getByText(article.excerpt)).toBeInTheDocument();
  });

  it("clamps the excerpt to two lines", () => {
    renderInLang(<ArticleCard {...article} />);

    expect(screen.getByText(article.excerpt)).toHaveClass("line-clamp-2");
  });

  it.each(FIELDS)("paints the $field pill with its own accent", ({ field, pill, ink }) => {
    renderInLang(<ArticleCard {...article} field={field} category="المجال" />);

    const chip = screen.getByTestId("article-pill");
    expect(chip).toHaveClass(pill, ink);
    const others = FIELDS.filter((f) => f.field !== field);
    for (const other of others) {
      expect(chip).not.toHaveClass(other.pill);
      expect(chip).not.toHaveClass(other.ink);
    }
  });

  it("falls back to the neutral accent when no field is given", () => {
    renderInLang(<ArticleCard {...article} field={undefined} />);

    const chip = screen.getByTestId("article-pill");
    expect(chip).toHaveClass("bg-muted", "text-muted-foreground");
    for (const other of FIELDS) expect(chip).not.toHaveClass(other.pill);
  });

  it("names the link with the localized opens phrase and keeps the visible title", () => {
    renderInLang(<ArticleCard {...article} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAccessibleName(`${article.title} — يقرأ المقال`);
    expect(link).toHaveTextContent(article.title);
  });

  it("shows the meta row with its icon on a card with the house radius", () => {
    renderInLang(<ArticleCard {...article} />);

    const link = screen.getByRole("link");
    expect(link).toHaveClass("rounded-card", "bg-card");
    expect(screen.getByText(article.meta)).toBeInTheDocument();
    expect(screen.getByText("تاريخ النشر")).toBeInTheDocument();
    expect(screen.getByTestId("article-pill").closest("a")).toBe(link);
  });

  it("renders the image with the title as alt text, lazily", () => {
    renderInLang(<ArticleCard {...article} />);

    const image = screen.getByRole("img", { name: article.title });
    expect(image).toHaveAttribute("src", article.image);
    expect(image).toHaveAttribute("loading", "lazy");
  });

  it("renders in English", () => {
    renderInLang(
      <ArticleCard
        category="Finance"
        title="Small money habits that compound"
        excerpt="Set aside a little each week, and let consistency do the heavy lifting."
        meta="Sep 28, 2026"
        to="/insights/money-habits"
        field="finance"
      />,
      "en",
    );

    const link = screen.getByRole("link", {
      name: "Small money habits that compound — reads the article",
    });
    expect(link).toHaveAttribute("href", "/insights/money-habits");
    expect(screen.getByText("Set aside a little each week, and let consistency do the heavy lifting.")).toBeInTheDocument();
    expect(screen.getByText("Sep 28, 2026")).toBeInTheDocument();
    expect(screen.getByText("Published on")).toBeInTheDocument();
  });
});
