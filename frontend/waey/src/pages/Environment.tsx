import { TreePine } from "lucide-react";
import PageHero from "@/components/PageHero";
import EnvironmentalContent from "@/components/EnvironmentalContent";
import RecycleSection from "@/components/RecycleSection";
import { useT, useLanguage } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";
import { useEffect } from "react";

const Environment = () => {
  const t = useT();
  const { lang } = useLanguage();

  useEffect(() => {
    trackEvent("page_view", { page: "environment" });
  }, []);
  return (
    <div className="relative min-h-[60vh] pb-16">
      <div className="relative">
        <PageHero
          badge={t('env.badge')}
          icon={<TreePine className="size-4" />}
          title={t('env.title')}
          subtitle={t('env.subtitle')}
          titleClass={lang === 'ar' ? 'rule-mark-env' : ''}
          subtitleClass={lang === 'ar' ? 'mt-10' : ''}
        />

        <EnvironmentalContent />

        <RecycleSection />
      </div>
    </div>
  );
};

export default Environment;
