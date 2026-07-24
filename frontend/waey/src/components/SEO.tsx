import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  schema?: Record<string, unknown>;
}

export function SEO({
  title = "وعي — منصة التوازن والصحة الشاملة",
  description = "منصة مصرية عربية للتوازن الشامل في الصحة البدنية والنفسية، الميزانية المالية، والوعي البيئي والتعليمي.",
  canonical = "https://waey.app",
  ogType = "website",
  ogImage = "/website-new.png",
  schema,
}: SEOProps) {
  useEffect(() => {
    // 1. Update Title
    const fullTitle = title.includes("وعي") ? title : `${title} | وعي`;
    document.title = fullTitle;

    // 2. Update Meta Tags Helper
    const setMeta = (nameAttr: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${attrVal}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(nameAttr, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    setMeta("name", "description", description);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:image", ogImage);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage);

    // 3. Update Structured Data (JSON-LD)
    const schemaData = schema || {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "وعي - Waey",
      url: canonical,
      description: description,
      inLanguage: "ar-EG",
    };

    let scriptTag = document.querySelector<HTMLScriptElement>("script[type='application/ld+json']");
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemaData);

    return () => {
      // Reset script tag content on unmount if needed
    };
  }, [title, description, canonical, ogType, ogImage, schema]);

  return null;
}
