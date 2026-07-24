import { TreePine } from "lucide-react";
import PageHero from "@/components/PageHero";
import EnvironmentalContent from "@/components/EnvironmentalContent";
import RecycleSection from "@/components/RecycleSection";
import { useT } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";
import { useEffect } from "react";

const Environment = () => {
  const t = useT();

  useEffect(() => {
    trackEvent("page_view", { page: "environment" });
  }, []);
  return (
    <div className="relative min-h-[60vh] pb-16">
      <div className="absolute inset-0 bg-gradient-to-b from-leaf-light/40 via-background to-sun-warm/20 pointer-events-none" />
      <div className="relative">
        <PageHero
          badge={t('env.badge')}
          icon={<TreePine className="size-4" />}
          title={t('env.title')}
          subtitle={t('env.subtitle')}
        />

        <EnvironmentalContent />

        <RecycleSection />
      </div>
    </div>
  );
};

export default Environment;
