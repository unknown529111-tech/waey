import { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Droplets,
  Zap,
  Leaf,
  Trash2,
  Sprout,
  Lightbulb,
  TreePine,
  Heart,
} from "lucide-react";
import { useT } from "@/contexts/LanguageContext";

/* ─── Section Wrapper ─── */

const SectionHeader = ({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-center mb-12"
  >
    <div className="inline-flex items-center gap-3 mb-4">
      <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center">
        {icon}
      </div>
    </div>
    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
      {title}
    </h2>
    <p className="text-muted-foreground text-lg max-w-[55ch] mx-auto leading-relaxed">
      {subtitle}
    </p>
  </motion.div>
);

const FadeInUp = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ─── 1. Natural Cleaning Alternatives Table ─── */

const NaturalCleaners = () => {
  const t = useT();

  const cleanersData = [
    {
      chemical: t('env.cleaner.0.chemical'),
      natural: t('env.cleaner.0.natural'),
      benefit: t('env.cleaner.0.benefit'),
      emoji: "🧪",
    },
    {
      chemical: t('env.cleaner.1.chemical'),
      natural: t('env.cleaner.1.natural'),
      benefit: t('env.cleaner.1.benefit'),
      emoji: "🍋",
    },
    {
      chemical: t('env.cleaner.2.chemical'),
      natural: t('env.cleaner.2.natural'),
      benefit: t('env.cleaner.2.benefit'),
      emoji: "🪵",
    },
    {
      chemical: t('env.cleaner.3.chemical'),
      natural: t('env.cleaner.3.natural'),
      benefit: t('env.cleaner.3.benefit'),
      emoji: "🌿",
    },
    {
      chemical: t('env.cleaner.4.chemical'),
      natural: t('env.cleaner.4.natural'),
      benefit: t('env.cleaner.4.benefit'),
      emoji: "🪟",
    },
  ];

  return (
    <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-transparent to-muted/30">
      <div className="max-w-[1000px] mx-auto">
        <SectionHeader
          icon={<Sprout className="size-6 text-primary" />}
          title={t('env.naturalCleaners.title')}
          subtitle={t('env.naturalCleaners.subtitle')}
        />

        <FadeInUp>
          <div className="bg-card rounded-4xl p-6 md:p-8 border border-border shadow-soft overflow-hidden">
            {/* Mobile: card layout */}
            <div className="grid grid-cols-1 md:hidden gap-4">
              {cleanersData.map((item, i) => (
                <div
                  key={i}
                  className="bg-background rounded-3xl p-5 border border-border"
                >
                  <span className="text-3xl block mb-3">{item.emoji}</span>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-bold text-destructive block mb-1">
                        {t('env.cleaner.mobile.chemical')}
                      </span>
                      <span className="text-sm font-bold line-through text-muted-foreground">
                        {item.chemical}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-primary block mb-1">
                        {t('env.cleaner.mobile.natural')}
                      </span>
                      <span className="text-base font-bold text-foreground">
                        {item.natural}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                      💚 {item.benefit}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <table className="hidden md:table w-full text-right">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-4 pr-4 text-sm font-bold text-muted-foreground">
                    {t('env.cleaner.table.chemical')}
                  </th>
                  <th className="pb-4 pr-4 text-sm font-bold text-muted-foreground">
                    {t('env.cleaner.table.natural')}
                  </th>
                  <th className="pb-4 pr-4 text-sm font-bold text-muted-foreground">
                    {t('env.cleaner.table.benefit')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {cleanersData.map((item, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="border-b border-border/50 last:border-0"
                  >
                    <td className="py-4 pr-4">
                      <span className="text-sm font-bold text-destructive line-through">
                        {item.chemical}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="text-sm font-bold text-primary">
                        {item.emoji} {item.natural}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="text-sm text-muted-foreground">
                        {item.benefit}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
};

/* ─── 2. Energy & Water Conservation Tips ─── */

const EnergyWaterTips = () => {
  const t = useT();

  const conservationTips = [
    {
      icon: Droplets,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      title: t('env.tip.0.title'),
      desc: t('env.tip.0.desc'),
    },
    {
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      title: t('env.tip.1.title'),
      desc: t('env.tip.1.desc'),
    },
    {
      icon: Leaf,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      title: t('env.tip.2.title'),
      desc: t('env.tip.2.desc'),
    },
    {
      icon: Lightbulb,
      color: "text-yellow-500",
      bg: "bg-yellow-50 dark:bg-yellow-950/30",
      title: t('env.tip.3.title'),
      desc: t('env.tip.3.desc'),
    },
    {
      icon: TreePine,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950/30",
      title: t('env.tip.4.title'),
      desc: t('env.tip.4.desc'),
    },
    {
      icon: Zap,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-950/30",
      title: t('env.tip.5.title'),
      desc: t('env.tip.5.desc'),
    },
  ];

  return (
    <section className="py-20 px-6 md:px-12">
      <div className="max-w-[1000px] mx-auto">
        <SectionHeader
          icon={<Zap className="size-6 text-primary" />}
          title={t('env.energyWater.title')}
          subtitle={t('env.energyWater.subtitle')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {conservationTips.map((tip, i) => (
            <FadeInUp key={i} delay={i * 0.06}>
              <div className="bg-card p-6 md:p-7 rounded-3xl border border-border hover:shadow-moss-lg transition-all duration-300 hover:-translate-y-1 h-full">
                <div
                  className={`size-12 ${tip.bg} rounded-2xl flex items-center justify-center mb-4`}
                >
                  <tip.icon className={`size-6 ${tip.color}`} />
                </div>
                <h4 className="font-bold text-base mb-2">{tip.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tip.desc}
                </p>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── 3. Zero Waste Recipes ─── */

const ZeroWaste = () => {
  const t = useT();

  const zeroWasteItems = [
    {
      emoji: "🥣",
      title: t('env.zeroWaste.0.title'),
      desc: t('env.zeroWaste.0.desc'),
      impact: t('env.zeroWaste.0.impact'),
    },
    {
      emoji: "🌱",
      title: t('env.zeroWaste.1.title'),
      desc: t('env.zeroWaste.1.desc'),
      impact: t('env.zeroWaste.1.impact'),
    },
    {
      emoji: "🧊",
      title: t('env.zeroWaste.2.title'),
      desc: t('env.zeroWaste.2.desc'),
      impact: t('env.zeroWaste.2.impact'),
    },
    {
      emoji: "🍌",
      title: t('env.zeroWaste.3.title'),
      desc: t('env.zeroWaste.3.desc'),
      impact: t('env.zeroWaste.3.impact'),
    },
  ];

  return (
    <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-muted/20 to-transparent">
      <div className="max-w-[1000px] mx-auto">
        <SectionHeader
          icon={<Trash2 className="size-6 text-primary" />}
          title={t('env.zeroWaste.title')}
          subtitle={t('env.zeroWaste.subtitle')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {zeroWasteItems.map((item, i) => (
            <FadeInUp key={i} delay={i * 0.1}>
              <div className="bg-card p-7 rounded-3xl border border-border hover:shadow-moss-lg transition-all duration-300 hover:-translate-y-1 flex gap-5">
                <span className="text-4xl shrink-0 mt-1">{item.emoji}</span>
                <div>
                  <h4 className="font-bold text-base mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {item.desc}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                    🌍 {item.impact}
                  </span>
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── 4. Visual Statistics (Infographic) ─── */

const VisualStats = () => {
  const t = useT();

  const statsData = [
    {
      emoji: "🌊",
      stat: t('env.stat.0.stat'),
      unit: t('env.stat.0.unit'),
      impact: t('env.stat.0.impact'),
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      emoji: "👕",
      stat: t('env.stat.1.stat'),
      unit: t('env.stat.1.unit'),
      impact: t('env.stat.1.impact'),
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      border: "border-emerald-200 dark:border-emerald-800",
    },
    {
      emoji: "🌳",
      stat: t('env.stat.2.stat'),
      unit: t('env.stat.2.unit'),
      impact: t('env.stat.2.impact'),
      color: "text-green-700",
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-200 dark:border-green-800",
    },
    {
      emoji: "🥤",
      stat: t('env.stat.3.stat'),
      unit: t('env.stat.3.unit'),
      impact: t('env.stat.3.impact'),
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200 dark:border-amber-800",
    },
  ];

  return (
    <section className="py-20 px-6 md:px-12">
      <div className="max-w-[1000px] mx-auto">
        <SectionHeader
          icon={<Heart className="size-6 text-primary" />}
          title={t('env.visualStats.title')}
          subtitle={t('env.visualStats.subtitle')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statsData.map((item, i) => (
            <FadeInUp key={i} delay={i * 0.1}>
              <div
                className={`bg-card rounded-3xl p-7 border-2 ${item.border} ${item.bg} text-center h-full hover:shadow-float transition-all duration-300 hover:-translate-y-1`}
              >
                <span className="text-5xl block mb-4">{item.emoji}</span>
                <div className="mb-3">
                  <span className={`text-4xl font-black ${item.color} tabular-nums block leading-tight`}>
                    {item.stat}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground block mt-1">
                    {item.unit}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.impact}
                </p>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── Main Component ─── */

const EnvironmentalContent = () => {
  return (
    <div className="space-y-4 md:space-y-8">
      {/* Section 1: Natural Cleaners */}
      <NaturalCleaners />

      {/* Section 2: Energy & Water Tips */}
      <EnergyWaterTips />

      {/* Section 3: Zero Waste */}
      <ZeroWaste />

      {/* Section 4: Visual Stats */}
      <VisualStats />

      
    </div>
  );
};

export default EnvironmentalContent;
