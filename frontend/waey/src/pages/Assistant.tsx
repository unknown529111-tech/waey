import { Sparkles } from "lucide-react";
import PageHero from "@/components/PageHero";
import AIChat from "@/components/AIChat";

const Assistant = () => (
  <div className="pb-16">
    <PageHero
      badge="المساعد الذكي"
      icon={<Sparkles className="size-4" />}
      title="اسأل مساعد وعي"
      subtitle="إجابات سريعة وموثوقة في الصحة والمال والبيئة، باللغة العربية."
    />
    <AIChat />
  </div>
);

export default Assistant;
