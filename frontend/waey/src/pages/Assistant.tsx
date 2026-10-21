import PageHero from "@/components/primitives/PageHero";
import AIChat from "@/components/AIChat";
import { useT } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";
import { useEffect } from "react";
import "./utility-hero.css";

const Assistant = () => {
  const t = useT();

  useEffect(() => {
    trackEvent("page_view", { page: "assistant" });
  }, []);
  return (
    <div className="pb-16">
      <div className="utility-hero">
        <PageHero
          eyebrow={"Waey · " + t("nav.assistant")}
          title={t("assistant.title")}
          lead={t("assistant.subtitle")}
        />
      </div>
      <AIChat />
    </div>
  );
};

export default Assistant;
