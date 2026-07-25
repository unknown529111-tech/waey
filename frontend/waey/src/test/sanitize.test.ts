import { describe, it, expect } from "vitest";
import {
  sanitizeString,
  sanitizeEmail,
  sanitizePassword,
  isValidEmail,
} from "@/lib/sanitize";

describe("sanitizeString", () => {
  it("strips HTML tags", () => {
    expect(sanitizeString("<p>hello</p>")).toBe("hello");
  });

  it("blocks javascript: protocol", () => {
    expect(sanitizeString("javascript:alert(1)")).toBe("blocked:alert(1)");
  });

  it("blocks data:text/html protocol (HTML stripped first)", () => {
    expect(sanitizeString("data:text/html,<script>alert(1)</script>")).toBe(
      "blocked:,alert(1)"
    );
  });

  it("blocks vbscript: protocol", () => {
    expect(sanitizeString("vbscript:msgbox(1)")).toBe("blocked:msgbox(1)");
  });

  it("blocks event handler attributes (HTML stripped first)", () => {
    expect(sanitizeString('<div onclick="evil()">click</div>')).toBe("click");
  });

  it("collapses whitespace and trims", () => {
    expect(sanitizeString("  hello    world  ")).toBe("hello world");
  });

  it("respects maxLen", () => {
    const input = "a".repeat(500);
    expect(sanitizeString(input, 10)).toHaveLength(10);
  });

  it("returns empty string for empty input", () => {
    expect(sanitizeString("")).toBe("");
    expect(sanitizeString("   ")).toBe("");
  });
});

describe("sanitizeEmail", () => {
  it("trims and lowercases", () => {
    expect(sanitizeEmail("  USER@Example.COM  ")).toBe("user@example.com");
  });

  it("caps at 254 characters", () => {
    const long = "a@b." + "c".repeat(300);
    expect(sanitizeEmail(long)).toHaveLength(254);
  });

  it("returns empty for empty input", () => {
    expect(sanitizeEmail("")).toBe("");
  });
});

describe("sanitizePassword", () => {
  it("trims whitespace", () => {
    expect(sanitizePassword("  secret  ")).toBe("secret");
  });

  it("caps at default maxLen", () => {
    const long = "x".repeat(200);
    expect(sanitizePassword(long)).toHaveLength(128);
  });

  it("returns empty for empty input", () => {
    expect(sanitizePassword("")).toBe("");
  });
});

describe("isValidEmail", () => {
  it("accepts valid emails", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("a.b@c.co")).toBe(true);
  });

  it("rejects invalid emails", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("plainaddress")).toBe(false);
    expect(isValidEmail("@missing.com")).toBe(false);
    expect(isValidEmail("user@")).toBe(false);
    expect(isValidEmail("user@.com")).toBe(false);
  });

  it("sanitizes before validation", () => {
    expect(isValidEmail("  USER@Example.COM  ")).toBe(true);
  });
});
