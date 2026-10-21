import { describe, it, expect } from "vitest";
import { screen, within, waitFor } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";
import Navbar from "./Navbar";
import { renderChrome } from "./test-utils";

/** Every control in the chrome that is an icon on its own needs a name. */
const ICON_ONLY = (name: RegExp) =>
  screen.getAllByRole("button", { name }).every((el) => el.getAttribute("aria-label"));

describe("Navbar", () => {
  it("links to the real pages only — no /plans, no /quiz", () => {
    renderChrome(<Navbar />);

    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href") ?? "");
    expect(hrefs).toEqual(
      expect.arrayContaining([
        "/",
        "/health",
        "/finance",
        "/environment",
        "/education",
        "/dashboard",
      ]),
    );
    expect(hrefs.some((h) => h.includes("/plans"))).toBe(false);
    expect(hrefs.some((h) => h.includes("/quiz"))).toBe(false);
  });

  it("marks the active route with aria-current and an underline, not colour alone", () => {
    renderChrome(<Navbar />, { path: "/finance" });

    const active = screen.getByRole("link", { name: "المالية" });
    expect(active).toHaveAttribute("aria-current", "page");
    // The underline is a shape, not a hue.
    expect(active.className).toMatch(/after:bg-primary/);

    const inactive = screen.getByRole("link", { name: "الصحة" });
    expect(inactive).not.toHaveAttribute("aria-current", "page");
    expect(inactive.className).not.toMatch(/after:bg-primary/);
  });

  it("does not mark the home link active on a sub-route", () => {
    renderChrome(<Navbar />, { path: "/health" });
    expect(screen.getByRole("link", { name: "الرئيسية" })).not.toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("gives every icon-only control an accessible name", () => {
    renderChrome(<Navbar />);

    const search = screen.getByRole("button", { name: "بحث" });
    expect(search).toBeInTheDocument();
    const theme = screen.getByRole("button", { name: "تبديل الوضع" });
    expect(theme).toBeInTheDocument();
    const menu = screen.getByRole("button", { name: "القائمة" });
    expect(menu).toBeInTheDocument();
  });

  it("keeps every chrome control at a 44px tap target", () => {
    renderChrome(<Navbar />);

    const controls = [
      ...screen.getAllByRole("button"),
      ...screen.getAllByRole("link"),
    ];
    for (const el of controls) {
      const cls = el.className;
      const big = /\b(size|min-h|min-w)-11\b/.test(cls);
      expect(
        big,
        `control "${el.textContent?.trim() || el.getAttribute("aria-label")}" lacks a 44px target`,
      ).toBe(true);
    }
  });

  it("never lets the flex row compress an icon button below 44px", () => {
    // Between 1024 and 1099px the action row sits in a 1fr grid track, and the
    // flex row used to squeeze the search button down to 40px. shrink-0 stops
    // that, and it has to be on the control itself — a min-width on the parent
    // would let the row overflow instead.
    renderChrome(<Navbar />);

    const iconButtons = screen
      .getAllByRole("button")
      .filter((el) => el.textContent?.trim() === "");
    for (const el of iconButtons) {
      const cls = typeof el.className === "string" ? el.className : "";
      expect(
        cls.includes("shrink-0"),
        `icon button "${el.getAttribute("aria-label")}" can be compressed below 44px`,
      ).toBe(true);
    }
  });

  it("opens the mobile drawer, traps focus in it, and closes on Escape", async () => {
    renderChrome(<Navbar />);

    const menu = screen.getByRole("button", { name: "القائمة" });
    fireEvent.click(menu);

    const drawer = screen.getByRole("dialog");
    expect(drawer).toHaveAttribute("aria-modal", "true");
    expect(within(drawer).getByRole("link", { name: "الصحة" })).toBeInTheDocument();

    // Focus moved into the drawer.
    expect(drawer.contains(document.activeElement)).toBe(true);

    // Tab from the last focusable wraps back to the first — focus stays inside.
    const focusables = within(drawer).getAllByRole("link").concat(
      within(drawer).getAllByRole("button"),
    );
    const last = focusables[focusables.length - 1];
    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(drawer.contains(document.activeElement)).toBe(true);

    // Escape closes it and returns focus to the button that opened it.
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.activeElement).toBe(menu);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("keeps the sign-up CTA and shows a sign-out item when signed in", () => {
    const { unmount } = renderChrome(<Navbar />);
    expect(screen.getByRole("button", { name: /إنشاء حساب/ })).toBeInTheDocument();
    unmount();

    renderChrome(<Navbar />, {
      auth: { isAuthenticated: true, user: { name: "م", email: "m@e.com" } },
    });
    expect(screen.getByRole("button", { name: /تسجيل الخروج/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /إنشاء حساب/ })).not.toBeInTheDocument();
  });

  it("renders in English with the same structure", () => {
    renderChrome(<Navbar />, { lang: "en", path: "/health" });

    expect(screen.getByRole("link", { name: "Health" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Menu" })).toBeInTheDocument();
  });
});
