import PageHero from "@/components/PageHero";
import AIChat from "@/components/AIChat";
import { useT, useLanguage } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";
import { useEffect } from "react";

const Assistant = () => {
  const t = useT();
  const { lang } = useLanguage();

  useEffect(() => {
    trackEvent("page_view", { page: "assistant" });
  }, []);
  return (
    <div className="pb-16">
      <PageHero
        eyebrow={'Waey · ' + t('nav.assistant')}
        title={t('assistant.title')}
        titleClass={lang === 'ar' ? 'rule-mark-lower' : ''}
        subtitle={t('assistant.subtitle')}
        subtitleClass={lang === 'ar' ? 'mt-10' : ''}
      />
      <AIChat />
    </div>
  );
};

export default Assistant;
