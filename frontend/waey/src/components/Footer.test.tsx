import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import Footer from "./Footer";
import { renderChrome } from "./test-utils";

describe("Footer", () => {
  it("renders the deep band with the wordmark and the tagline", () => {
    renderChrome(<Footer />);

    const band = screen.getByRole("contentinfo");
    expect(band).toHaveClass("bg-footer");
    expect(within(band).getByText("وعي")).toBeInTheDocument();
    expect(within(band).getByText("وعي في مكان هادئ واحد")).toBeInTheDocument();
  });

  it("groups the links into fields, app features and legal", () => {
    renderChrome(<Footer />);

    const fields = screen.getByRole("navigation", { name: "المجالات" });
    const features = screen.getByRole("navigation", { name: "ميزات التطبيق" });
    const legal = screen.getByRole("navigation", { name: "قانوني" });

    const hrefs = (nav: HTMLElement) =>
      within(nav)
        .getAllByRole("link")
        .map((a) => a.getAttribute("href"));

    expect(hrefs(fields)).toEqual(["/health", "/finance", "/environment", "/education"]);
    expect(hrefs(features)).toEqual([
      "/dashboard",
      "/insights",
      "/recipes",
      "/assistant",
      "/shopping-list",
    ]);
    expect(hrefs(legal)).toEqual(["/privacy", "/terms", "/faq"]);
  });

  it("keeps the contact address as a mailto", () => {
    renderChrome(<Footer />);

    const mail = screen.getByRole("link", { name: /waey.official.mk@gmail.com/ });
    expect(mail).toHaveAttribute("href", "mailto:waey.official.mk@gmail.com");
  });

  it("gives every social link a name and safe external attributes", () => {
    renderChrome(<Footer />);

    const socials = screen.getAllByRole("link").filter((a) =>
      a.getAttribute("target") === "_blank",
    );
    expect(socials.length).toBeGreaterThan(0);

    for (const link of socials) {
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link.getAttribute("aria-label")).toBeTruthy();
    }
  });

  it("prints the legal line with the current year", () => {
    renderChrome(<Footer />);

    const band = screen.getByRole("contentinfo");
    expect(band).toHaveTextContent(`© ${new Date().getFullYear()} وعي. جميع الحقوق محفوظة.`);
  });

  it("renders in English", () => {
    renderChrome(<Footer />, { lang: "en" });

    const band = screen.getByRole("contentinfo");
    expect(band).toHaveTextContent(`© ${new Date().getFullYear()} Waey. All rights reserved.`);
    expect(within(band).getByText("Awareness in one calm place")).toBeInTheDocument();
  });
});
