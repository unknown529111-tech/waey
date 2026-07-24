import { Sparkles } from "lucide-react";
import PageHero from "@/components/PageHero";
import AIChat from "@/components/AIChat";
import { useT } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";
import { useEffect } from "react";

const Assistant = () => {
  const t = useT();

  useEffect(() => {
    trackEvent("page_view", { page: "assistant" });
  }, []);
  return (
    <div className="pb-16">
      <PageHero
        badge={t('assistant.badge')}
        icon={<Sparkles className="size-4" />}
        title={t('assistant.title')}
        subtitle={t('assistant.subtitle')}
      />
      <AIChat />
    </div>
  );
};

export default Assistant;
