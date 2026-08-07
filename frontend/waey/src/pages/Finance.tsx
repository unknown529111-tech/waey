import { Wallet, PiggyBank, TrendingUp, Shield, Target, AlertTriangle, Lightbulb, Coins, ShoppingBag, HelpCircle, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";
import Calculators from "@/components/Calculators";
import FinanceFeatures from "@/components/FinanceFeatures";
import { useT, useLanguage } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";
import { useEffect } from "react";

const Finance = () => {
  const t = useT();
  const { lang } = useLanguage();

  useEffect(() => {
    trackEvent("page_view", { page: "finance" });
  }, []);

  const principles = [
    { icon: PiggyBank, title: t('finance.principles.0.title'), desc: t('finance.principles.0.desc') },
    { icon: Shield, title: t('finance.principles.1.title'), desc: t('finance.principles.1.desc') },
    { icon: Target, title: t('finance.principles.2.title'), desc: t('finance.principles.2.desc') },
    { icon: TrendingUp, title: t('finance.principles.3.title'), desc: t('finance.principles.3.desc') },
    { icon: AlertTriangle, title: t('finance.principles.4.title'), desc: t('finance.principles.4.desc') },
    { icon: Coins, title: t('finance.principles.5.title'), desc: t('finance.principles.5.desc') },
  ];

  const everydayTips = [
    t('finance.tips.0'),
    t('finance.tips.1'),
    t('finance.tips.2'),
    t('finance.tips.3'),
    t('finance.tips.4'),
    t('finance.tips.5'),
    t('finance.tips.6'),
    t('finance.tips.7'),
    t('finance.tips.8'),
    t('finance.tips.9'),
  ];

  const earnTips = [
    { title: t('finance.earnTips.0.title'), desc: t('finance.earnTips.0.desc') },
    { title: t('finance.earnTips.1.title'), desc: t('finance.earnTips.1.desc') },
    { title: t('finance.earnTips.2.title'), desc: t('finance.earnTips.2.desc') },
    { title: t('finance.earnTips.3.title'), desc: t('finance.earnTips.3.desc') },
  ];

  const warnings = [
    t('finance.warnings.0'),
    t('finance.warnings.1'),
    t('finance.warnings.2'),
    t('finance.warnings.3'),
  ];

  const buyQuestions = [
    { question: t('finance.buyQuestions.0.question'), icon: HelpCircle, tip: t('finance.buyQuestions.0.tip') },
    { question: t('finance.buyQuestions.1.question'), icon: CheckCircle, tip: t('finance.buyQuestions.1.tip') },
    { question: t('finance.buyQuestions.2.question'), icon: XCircle, tip: t('finance.buyQuestions.2.tip') },
  ];

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-leaf-light/40 via-background to-sun-warm/20 pointer-events-none" />
      <div className="relative">
        <PageHero
          badge={t('finance.badge')}
          icon={<Wallet className="size-4" />}
          title={lang === 'ar' ? <span>{t('finance.title').replace('أموالك بذكاء', '')}<span className="block">أموالك بذكاء</span></span> : t('finance.title')}
          subtitle={t('finance.subtitle')}
          subtitleClass={lang === 'ar' ? 'mt-6' : ''}
        />
        <Calculators />

        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16 space-y-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
              <Lightbulb className="size-6 text-accent" />
              {t('finance.principles')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {principles.map((p, i) => (
                <div key={i} className="bg-card border border-[#DED8CF]/50 dark:border-border/50 rounded-[2rem] p-6 shadow-soft hover:-translate-y-1 hover:shadow-moss-lg transition-all duration-300">
                  <p.icon className="size-8 text-accent mb-3" />
                  <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
              <PiggyBank className="size-6 text-primary" />
              {t('finance.tips')}
            </h2>
            <div className="bg-card border border-[#DED8CF]/50 dark:border-border/50 rounded-[2rem] p-6 md:p-8 shadow-soft">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {everydayTips.map((tip, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 size-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed text-sm pt-0.5">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
              <ShoppingBag className="size-6 text-accent" />
              {t('finance.beforeBuy')}
            </h2>
            <p className="text-muted-foreground text-base mb-8 max-w-[55ch] leading-relaxed -mt-4">
              {t('finance.askBefore')}
            </p>

            <div className="flex flex-col gap-4">
              {buyQuestions.map((item, i) => (
                <motion.div
                  key={item.question}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-card p-6 md:p-8 rounded-[2rem] border border-[#DED8CF]/50 dark:border-border/50 flex items-start gap-5 shadow-soft hover:-translate-y-0.5 hover:shadow-moss-lg transition-all duration-300"
                >
                  <div className="size-12 bg-sun-warm rounded-2xl flex items-center justify-center shrink-0">
                    <span className="text-xl font-bold text-accent">{i + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">{item.question}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed flex items-center gap-2">
                      <Lightbulb className="size-4 text-accent shrink-0" />
                      {item.tip}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
              <TrendingUp className="size-6 text-accent" />
              {t('finance.earnMore')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {earnTips.map((e, i) => (
                <div key={i} className="bg-card border border-[#DED8CF]/50 dark:border-border/50 rounded-[2rem] p-6 shadow-soft hover:-translate-y-1 hover:shadow-moss-lg transition-all duration-300">
                  <h3 className="font-bold mb-1.5">{e.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <FinanceFeatures />

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
              <AlertTriangle className="size-6 text-destructive" />
              {t('finance.warnings')}
            </h2>
            <div className="bg-destructive/5 rounded-[2rem] p-6 md:p-8 border border-destructive/20 shadow-soft">
              <ul className="space-y-3">
                {warnings.map((w, i) => (
                  <li key={i} className="flex gap-3">
                    <AlertTriangle className="shrink-0 size-5 text-destructive mt-0.5" />
                    <span className="leading-relaxed text-sm md:text-base">{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-[2rem] p-8 md:p-12 border border-primary/10 bg-card text-center shadow-soft">
            <Coins className="size-10 text-accent mx-auto mb-4" />
            <p className="text-base md:text-lg leading-loose max-w-[700px] mx-auto text-foreground/90">
              {t('finance.footerQuote1')}
              <br />
              <span className="font-bold text-accent">{t('finance.footerQuote2')}</span>
              <br />
              <br />
              {t('finance.footerQuote3')}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Finance;
