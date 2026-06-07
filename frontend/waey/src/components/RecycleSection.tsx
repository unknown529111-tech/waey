import { motion } from "framer-motion";
import { Recycle } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";

const RecycleSection = () => {
  const t = useT();

  const diyIdeas = [
    { title: t('recycle.idea.0.title'), description: t('recycle.idea.0.desc'), emoji: "🫙" },
    { title: t('recycle.idea.1.title'), description: t('recycle.idea.1.desc'), emoji: "👕" },
    { title: t('recycle.idea.2.title'), description: t('recycle.idea.2.desc'), emoji: "🌱" },
    { title: t('recycle.idea.3.title'), description: t('recycle.idea.3.desc'), emoji: "🎁" },
  ];

  return (
    <section id="recycle" className="px-6 md:px-12 py-24">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Recycle className="size-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary">{t('recycle.title')}</h2>
          </div>
          <p className="text-muted-foreground text-lg mb-10 max-w-[55ch] leading-relaxed">
            {t('recycle.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {diyIdeas.map((idea, i) => (
            <motion.div
              key={idea.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card p-8 rounded-3xl border border-border hover:shadow-moss-lg transition-all duration-300 hover:-translate-y-1"
            >
              <span className="text-4xl block mb-4">{idea.emoji}</span>
              <h4 className="font-bold mb-3">{idea.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{idea.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecycleSection;
