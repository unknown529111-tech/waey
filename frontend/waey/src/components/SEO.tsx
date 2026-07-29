import { useEffect } from "react";
import { useT } from "@/contexts/useLanguage";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  schema?: Record<string, unknown>;
}

export function SEO({
  title: _title,
  description: _description,
  canonical = "https://waey-m7.com",
  ogType = "website",
  ogImage = "/website-new.png",
  schema,
}: SEOProps) {
  const t = useT();
  const title = _title ?? t('seo.defaultTitle');
  const description = _description ?? t('seo.defaultDesc');
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
      name: t('seo.siteName'),
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
