import { TreePine } from "lucide-react";
import PageHero from "@/components/PageHero";
import EnvironmentalContent from "@/components/EnvironmentalContent";
import RecycleSection from "@/components/RecycleSection";

const Environment = () => (
  <div className="relative min-h-[60vh] pb-16">
    <div className="absolute inset-0 bg-gradient-to-b from-leaf-light/40 via-background to-sun-warm/20 pointer-events-none" />
    <div className="relative">
      <PageHero
        badge="التناغم البيئي"
        icon={<TreePine className="size-4" />}
        title="قراراتك تحمي كوكبنا"
        subtitle="بدائل طبيعية، ترشيد استهلاك، إحصائيات، ومجتمع — كل ما تحتاجه لحياة أكثر استدامة."
      />

      <EnvironmentalContent />

      <RecycleSection />
    </div>
  </div>
);

export default Environment;
