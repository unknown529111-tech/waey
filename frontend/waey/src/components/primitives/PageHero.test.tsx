import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import PageHero from "./PageHero";
import { renderInLang } from "./test-utils";

const hero = {
  eyebrow: "لماذا يهمّ الوعي",
  title: "خطوات صغيرة تصنع فرقًا كبيرًا",
  lead: "الوعي يمنحك الأدوات والقرارات التي تصنع حياة أكثر صحة وتوازنًا — لك، ولمن حولك، ولكوكبنا.",
  primaryAction: { label: "ابدأ رحلتك", to: "/start" },
  secondaryAction: { label: "تعرّف على المجالات", to: "/fields" },
};

describe("PageHero", () => {
  it("renders the eyebrow, the single h1, the lead and both action links", () => {
    renderInLang(<PageHero {...hero} />);

    expect(screen.getByText(hero.eyebrow)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: hero.title })).toBeInTheDocument();
    expect(screen.getByText(hero.lead)).toBeInTheDocument();

    expect(screen.getByRole("link", { name: hero.primaryAction.label })).toHaveAttribute(
      "href",
      "/start",
    );
    expect(screen.getByRole("link", { name: hero.secondaryAction.label })).toHaveAttribute(
      "href",
      "/fields",
    );
  });

  it("points the arrow left in Arabic and right in English", () => {
    const { unmount } = renderInLang(<PageHero {...hero} />);
    expect(screen.getByTestId("arrow")).toHaveClass("lucide-arrow-left");
    unmount();

    renderInLang(
      <PageHero
        eyebrow="Why awareness matters"
        title="Small steps create big change"
        lead="Awareness gives you the knowledge, tools and confidence to make better decisions — for yourself, your community and the planet."
        primaryAction={{ label: "Start your journey", to: "/start" }}
        secondaryAction={{ label: "Explore the fields", to: "/fields" }}
      />,
      "en",
    );
    expect(screen.getByRole("link", { name: "Start your journey" })).toBeInTheDocument();
    expect(screen.getByTestId("arrow")).toHaveClass("lucide-arrow-right");
  });

  it("names the header region from the locale file", () => {
    const { unmount } = renderInLang(<PageHero {...hero} />);
    expect(screen.getByRole("banner", { name: "مقدمة الصفحة" })).toBeInTheDocument();
    unmount();

    renderInLang(<PageHero title="Small steps create big change" />, "en");
    expect(screen.getByRole("banner", { name: "Page introduction" })).toBeInTheDocument();
  });

  it("renders without media and with media", () => {
    const { unmount } = renderInLang(<PageHero {...hero} />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    unmount();

    renderInLang(
      <PageHero
        {...hero}
        media={<img src="/awareness.svg" alt="يدان تحملان الأرض بين أوراق خضراء" />}
      />,
    );
    expect(screen.getByRole("img", { name: "يدان تحملان الأرض بين أوراق خضراء" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "صورة توضيحية" })).toBeInTheDocument();
  });

  it("renders in English", () => {
    renderInLang(
      <PageHero
        eyebrow="Why awareness matters"
        title="Small steps create big change"
        lead="Awareness gives you the knowledge, tools and confidence to make better decisions."
        primaryAction={{ label: "Start your journey", to: "/start" }}
        secondaryAction={{ label: "Explore the fields", to: "/fields" }}
      />,
      "en",
    );

    expect(screen.getByText("Why awareness matters")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Small steps create big change" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore the fields" })).toHaveAttribute(
      "href",
      "/fields",
    );
  });
});
