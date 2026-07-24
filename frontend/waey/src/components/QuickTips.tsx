import { Droplets, Footprints, Apple, Bed } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useT } from "@/contexts/useLanguage";

const tipKeys = [
  // Week 1
  [
    { icon: Droplets, categoryKey: "quicktips.week1.tip1.category", tipKey: "quicktips.week1.tip1.tip", color: "text-primary" },
    { icon: Footprints, categoryKey: "quicktips.week1.tip2.category", tipKey: "quicktips.week1.tip2.tip", color: "text-accent" },
    { icon: Apple, categoryKey: "quicktips.week1.tip3.category", tipKey: "quicktips.week1.tip3.tip", color: "text-destructive" },
    { icon: Bed, categoryKey: "quicktips.week1.tip4.category", tipKey: "quicktips.week1.tip4.tip", color: "text-primary" },
  ],
  // Week 2
  [
    { icon: Droplets, categoryKey: "quicktips.week2.tip1.category", tipKey: "quicktips.week2.tip1.tip", color: "text-primary" },
    { icon: Footprints, categoryKey: "quicktips.week2.tip2.category", tipKey: "quicktips.week2.tip2.tip", color: "text-accent" },
    { icon: Apple, categoryKey: "quicktips.week2.tip3.category", tipKey: "quicktips.week2.tip3.tip", color: "text-destructive" },
    { icon: Bed, categoryKey: "quicktips.week2.tip4.category", tipKey: "quicktips.week2.tip4.tip", color: "text-primary" },
  ],
  // Week 3
  [
    { icon: Droplets, categoryKey: "quicktips.week3.tip1.category", tipKey: "quicktips.week3.tip1.tip", color: "text-primary" },
    { icon: Footprints, categoryKey: "quicktips.week3.tip2.category", tipKey: "quicktips.week3.tip2.tip", color: "text-accent" },
    { icon: Apple, categoryKey: "quicktips.week3.tip3.category", tipKey: "quicktips.week3.tip3.tip", color: "text-destructive" },
    { icon: Bed, categoryKey: "quicktips.week3.tip4.category", tipKey: "quicktips.week3.tip4.tip", color: "text-primary" },
  ],
  // Week 4
  [
    { icon: Droplets, categoryKey: "quicktips.week4.tip1.category", tipKey: "quicktips.week4.tip1.tip", color: "text-primary" },
    { icon: Footprints, categoryKey: "quicktips.week4.tip2.category", tipKey: "quicktips.week4.tip2.tip", color: "text-accent" },
    { icon: Apple, categoryKey: "quicktips.week4.tip3.category", tipKey: "quicktips.week4.tip3.tip", color: "text-destructive" },
    { icon: Bed, categoryKey: "quicktips.week4.tip4.category", tipKey: "quicktips.week4.tip4.tip", color: "text-primary" },
  ],
];

const getWeekIndex = () => {
  const start = new Date("2025-01-01").getTime();
  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  return Math.floor((now - start) / weekMs) % tipKeys.length;
};

const QuickTips = () => {
  const t = useT();
  const [weekIndex, setWeekIndex] = useState(getWeekIndex);
  const tips = tipKeys[weekIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setWeekIndex(getWeekIndex());
    }, 60 * 60 * 1000); // check every hour
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="tips" className="bg-card rounded-t-[3rem] px-6 md:px-12 py-24">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-primary tracking-tight mb-4">
            {t('quicktips.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-[50ch] mx-auto leading-relaxed">
            {t('quicktips.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tips.map((tip, i) => (
            <motion.div
              key={`${weekIndex}-${tip.tipKey}`}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-start gap-5 p-6 bg-card rounded-3xl border border-border"
            >
              <div className="size-10 bg-card rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <tip.icon className={`size-5 ${tip.color}`} />
              </div>
              <div>
                <h4 className="font-bold mb-2">{t(tip.categoryKey)}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(tip.tipKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickTips;
