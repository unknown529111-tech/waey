import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import PageHero from "@/components/PageHero";
import { useT } from "@/contexts/useLanguage";

const FAQ_ITEMS = [
  { key: "what" },
  { key: "trackers" },
  { key: "streak" },
  { key: "points" },
  { key: "data" },
  { key: "offline" },
  { key: "pwa" },
];

const Faq = () => {
  const t = useT();

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-leaf-light/40 via-background to-sun-warm/20 pointer-events-none" />
      <div className="relative">
        <PageHero
          badge="FAQ"
          icon={<HelpCircle className="size-4" />}
          title={t('faq.title')}
          subtitle={t('faq.subtitle')}
        />
        <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto pb-16">
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-card border border-border rounded-3xl p-6"
                dir="rtl"
              >
                <h2 className="text-base font-bold mb-2">
                  {t(`faq.${item.key}.title`)}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`faq.${item.key}.body`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
