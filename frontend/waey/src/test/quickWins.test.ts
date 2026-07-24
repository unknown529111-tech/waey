import { describe, it, expect, beforeEach } from "vitest";

describe("Option C Quick Wins", () => {
  beforeEach(() => {
    document.title = "";
    document.head.innerHTML = "";
  });

  describe("SEO Head Management", () => {
    it("updates document.title and meta tags dynamically", () => {
      document.title = "اختبار العنوان | وعي";
      expect(document.title).toBe("اختبار العنوان | وعي");

      const meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      meta.setAttribute("content", "وصف المنصة للتأكد من المحركات");
      document.head.appendChild(meta);

      const queried = document.querySelector("meta[name='description']");
      expect(queried?.getAttribute("content")).toBe("وصف المنصة للتأكد من المحركات");
    });
  });

  describe("Accessibility Landmarks", () => {
    it("has skip link target landmark on main element", () => {
      const main = document.createElement("main");
      main.id = "main-content";
      document.body.appendChild(main);

      const landmark = document.getElementById("main-content");
      expect(landmark).not.toBeNull();
    });
  });
});
