import { describe, it, expect, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import NewsletterBand from "./NewsletterBand";
import { renderInLang } from "./test-utils";

const band = {
  eyebrow: "ابقَ على اتصال",
  heading: "اشترك في رسائل وعي",
  description: "رسالة واحدة كل أسبوع عن الصحة والمال والبيئة والتعلّم.",
  placeholder: "أدخل بريدك الإلكتروني",
  buttonLabel: "اشترك",
};

describe("NewsletterBand", () => {
  it("renders the heading and labels the email input from the locale file", () => {
    renderInLang(<NewsletterBand {...band} onSubmit={() => {}} />);

    expect(screen.getByRole("heading", { level: 2, name: band.heading })).toBeInTheDocument();
    expect(screen.getByText(band.description)).toBeInTheDocument();

    const input = screen.getByLabelText("البريد الإلكتروني");
    expect(input.id).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "البريد الإلكتروني" })).toBe(input);
    expect(input).toHaveAttribute("placeholder", band.placeholder);
  });

  it("gives each instance its own input id, so two bands cannot collide", () => {
    const { unmount } = renderInLang(<NewsletterBand {...band} onSubmit={() => {}} />);
    const first = screen.getByLabelText("البريد الإلكتروني").id;
    unmount();

    renderInLang(<NewsletterBand {...band} onSubmit={() => {}} />);
    const second = screen.getByLabelText("البريد الإلكتروني").id;
    expect(second).toBeTruthy();
    expect(second).not.toBe(first);
  });

  it("refuses an invalid address with a localized alert and does not submit", () => {
    const onSubmit = vi.fn();
    renderInLang(<NewsletterBand {...band} onSubmit={onSubmit} />);

    const input = screen.getByLabelText("البريد الإلكتروني");
    fireEvent.change(input, { target: { value: "not-an-email" } });
    fireEvent.submit(input.closest("form")!);

    expect(onSubmit).not.toHaveBeenCalled();
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("من فضلك أدخل بريدًا إلكترونيًا صحيحًا.");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", alert.id);
  });

  it("clears the error once the address is corrected", () => {
    const onSubmit = vi.fn();
    renderInLang(<NewsletterBand {...band} onSubmit={onSubmit} />);

    const input = screen.getByLabelText("البريد الإلكتروني");
    fireEvent.change(input, { target: { value: "nope" } });
    fireEvent.submit(input.closest("form")!);
    expect(screen.getByRole("alert")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "sara@waey.eg" } });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    fireEvent.submit(input.closest("form")!);
    expect(onSubmit).toHaveBeenCalledWith("sara@waey.eg");
  });

  it("submits the trimmed email through a real form", () => {
    const onSubmit = vi.fn();
    renderInLang(<NewsletterBand {...band} onSubmit={onSubmit} />);

    const input = screen.getByLabelText("البريد الإلكتروني");
    fireEvent.change(input, { target: { value: "  sara@waey.eg  " } });
    fireEvent.submit(input.closest("form")!);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith("sara@waey.eg");
  });

  it("uses a real submit button and an email-typed input", () => {
    renderInLang(<NewsletterBand {...band} onSubmit={() => {}} />);

    const button = screen.getByRole("button", { name: band.buttonLabel });
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveClass("min-h-11");

    const input = screen.getByLabelText("البريد الإلكتروني");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("autocomplete", "email");
  });

  it("renders the eyebrow and decorative media when given", () => {
    renderInLang(
      <NewsletterBand
        {...band}
        onSubmit={() => {}}
        media={<img src="/newsletter.svg" alt="غصن أخضر حول حرف" />}
      />,
    );

    expect(screen.getByText(band.eyebrow)).toHaveClass("eyebrow");
    expect(screen.getByRole("img", { name: "غصن أخضر حول حرف" })).toBeInTheDocument();
  });

  it("renders in English", () => {
    renderInLang(
      <NewsletterBand
        eyebrow="Stay connected"
        heading="Get the latest from Waey"
        description="One letter a week on health, money, environment and learning."
        placeholder="Enter your email address"
        buttonLabel="Subscribe"
        onSubmit={() => {}}
      />,
      "en",
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Get the latest from Waey" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Email address" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Subscribe" })).toBeInTheDocument();
  });
});
