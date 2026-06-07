import { TrendingUp, AlertTriangle, CheckCircle, BadgePercent, Brain, ShoppingCart, Calendar, GraduationCap, Briefcase, Heart, Skull, Target, DollarSign, Users, MessageCircle, HelpCircle, Wallet } from "lucide-react";
import { useT } from "@/contexts/LanguageContext";

const FinanceFeatures = () => {
  const t = useT();

  /* ─── 1. Inflation & Value Protection ─── */

  const valueComparison = [
    { method: t('financeFeatures.valueComparison.0.method'), desc: t('financeFeatures.valueComparison.0.desc'), result: t('financeFeatures.valueComparison.0.result'), icon: "🏚️" },
    { method: t('financeFeatures.valueComparison.1.method'), desc: t('financeFeatures.valueComparison.1.desc'), result: t('financeFeatures.valueComparison.1.result'), icon: "🏦" },
    { method: t('financeFeatures.valueComparison.2.method'), desc: t('financeFeatures.valueComparison.2.desc'), result: t('financeFeatures.valueComparison.2.result'), icon: "📈" },
  ];

  /* ─── 2. Financial Psychology ─── */

  const spendingTriggers = [
    { trigger: t('financeFeatures.spendingTriggers.0.trigger'), fix: t('financeFeatures.spendingTriggers.0.fix') },
    { trigger: t('financeFeatures.spendingTriggers.1.trigger'), fix: t('financeFeatures.spendingTriggers.1.fix') },
    { trigger: t('financeFeatures.spendingTriggers.2.trigger'), fix: t('financeFeatures.spendingTriggers.2.fix') },
    { trigger: t('financeFeatures.spendingTriggers.3.trigger'), fix: t('financeFeatures.spendingTriggers.3.fix') },
  ];

  /* ─── 3. Special Budgets ─── */

  const budgetPlans = [
    {
      icon: GraduationCap,
      title: t('financeFeatures.budgetPlans.0.title'),
      tips: [
        t('financeFeatures.budgetPlans.0.tips.0'),
        t('financeFeatures.budgetPlans.0.tips.1'),
        t('financeFeatures.budgetPlans.0.tips.2'),
        t('financeFeatures.budgetPlans.0.tips.3'),
        t('financeFeatures.budgetPlans.0.tips.4'),
      ],
    },
    {
      icon: Briefcase,
      title: t('financeFeatures.budgetPlans.1.title'),
      tips: [
        t('financeFeatures.budgetPlans.1.tips.0'),
        t('financeFeatures.budgetPlans.1.tips.1'),
        t('financeFeatures.budgetPlans.1.tips.2'),
        t('financeFeatures.budgetPlans.1.tips.3'),
      ],
    },
    {
      icon: Heart,
      title: t('financeFeatures.budgetPlans.2.title'),
      tips: [
        t('financeFeatures.budgetPlans.2.tips.0'),
        t('financeFeatures.budgetPlans.2.tips.1'),
        t('financeFeatures.budgetPlans.2.tips.2'),
        t('financeFeatures.budgetPlans.2.tips.3'),
        t('financeFeatures.budgetPlans.2.tips.4'),
      ],
    },
  ];

  /* ─── 4. Debt Elimination ─── */

  const debtMethods = [
    {
      icon: Skull,
      title: t('financeFeatures.debtMethods.0.title'),
      desc: t('financeFeatures.debtMethods.0.desc'),
      pros: [t('financeFeatures.debtMethods.0.pros.0'), t('financeFeatures.debtMethods.0.pros.1')],
      cons: [t('financeFeatures.debtMethods.0.cons.0')],
    },
    {
      icon: TrendingUp,
      title: t('financeFeatures.debtMethods.1.title'),
      desc: t('financeFeatures.debtMethods.1.desc'),
      pros: [t('financeFeatures.debtMethods.1.pros.0'), t('financeFeatures.debtMethods.1.pros.1')],
      cons: [t('financeFeatures.debtMethods.1.cons.0')],
    },
  ];

  /* ─── 5. Income Boost Additions ─── */

  const incomeAdditions = [
    {
      icon: Users,
      title: t('financeFeatures.incomeAdditions.0.title'),
      items: [
        t('financeFeatures.incomeAdditions.0.items.0'),
        t('financeFeatures.incomeAdditions.0.items.1'),
        t('financeFeatures.incomeAdditions.0.items.2'),
        t('financeFeatures.incomeAdditions.0.items.3'),
      ],
    },
    {
      icon: TrendingUp,
      title: t('financeFeatures.incomeAdditions.1.title'),
      items: [
        t('financeFeatures.incomeAdditions.1.items.0'),
        t('financeFeatures.incomeAdditions.1.items.1'),
        t('financeFeatures.incomeAdditions.1.items.2'),
      ],
    },
    {
      icon: MessageCircle,
      title: t('financeFeatures.incomeAdditions.2.title'),
      items: [
        t('financeFeatures.incomeAdditions.2.items.0'),
        t('financeFeatures.incomeAdditions.2.items.1'),
        t('financeFeatures.incomeAdditions.2.items.2'),
      ],
    },
  ];

  const envelopes = [
    { name: t('financeFeatures.envelopes.0.name'), pct: t('financeFeatures.envelopes.0.pct'), color: "bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800/30" },
    { name: t('financeFeatures.envelopes.1.name'), pct: t('financeFeatures.envelopes.1.pct'), color: "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800/30" },
    { name: t('financeFeatures.envelopes.2.name'), pct: t('financeFeatures.envelopes.2.pct'), color: "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30" },
    { name: t('financeFeatures.envelopes.3.name'), pct: t('financeFeatures.envelopes.3.pct'), color: "bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/30" },
  ];

  const supermarketTraps = [
    t('financeFeatures.supermarketTraps.0'),
    t('financeFeatures.supermarketTraps.1'),
    t('financeFeatures.supermarketTraps.2'),
    t('financeFeatures.supermarketTraps.3'),
    t('financeFeatures.supermarketTraps.4'),
  ];

  const noSpendDays = [
    t('financeFeatures.noSpendDays.0'),
    t('financeFeatures.noSpendDays.1'),
  ];

  return (
    <section className="space-y-12">

      {/* ─── 1. Inflation & Value Protection ─── */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
          <BadgePercent className="size-6 text-accent" />
          {t('financeFeatures.inflationTitle')}
        </h2>
        <p className="text-muted-foreground mb-6 -mt-4">
          {t('financeFeatures.inflationDesc')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {valueComparison.map((v, i) => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border text-center hover:shadow-moss-lg transition-all duration-300 hover:-translate-y-1">
              <span className="text-4xl block mb-3">{v.icon}</span>
              <h3 className="font-bold text-lg mb-2">{v.method}</h3>
              <p className="text-sm text-muted-foreground mb-3">{v.desc}</p>
              <span className={`text-xs font-bold rounded-full px-3 py-1.5 ${
                i === 0 ? "bg-destructive/10 text-destructive" : i === 1 ? "bg-accent/10 text-accent" : "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
              }`}>
                {v.result}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl p-6 md:p-8 border border-border">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Wallet className="size-5 text-accent" />
            {t('financeFeatures.digitalEnvelopes')}
          </h3>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            {t('financeFeatures.digitalEnvelopesDesc')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {envelopes.map((env, i) => (
              <div key={i} className={`rounded-2xl p-4 border text-center ${env.color}`}>
                <p className="text-sm font-bold">{env.name}</p>
                <p className="text-2xl font-bold">{env.pct}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 2. Financial Psychology ─── */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
          <Brain className="size-6 text-accent" />
          {t('financeFeatures.psychologyTitle')}
        </h2>

        {/* Spending Triggers */}
        <div className="mb-6">
          <h3 className="font-bold text-base mb-4 flex items-center gap-2">
            <ShoppingCart className="size-4 text-accent" />
            {t('financeFeatures.spendingTriggersTitle')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {spendingTriggers.map((s, i) => (
              <div key={i} className="bg-card rounded-2xl p-4 border border-border flex items-start gap-3">
                <AlertTriangle className="size-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold">{s.trigger}</p>
                  <p className="text-xs text-muted-foreground">{s.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supermarket Traps */}
        <div className="mb-6">
          <h3 className="font-bold text-base mb-4 flex items-center gap-2">
            <BadgePercent className="size-4 text-accent" />
            {t('financeFeatures.supermarketTrapsTitle')}
          </h3>
          <div className="bg-card rounded-2xl p-5 border border-border space-y-3">
            {supermarketTraps.map((trap, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-accent shrink-0">⚠️</span>
                <p className="text-sm text-muted-foreground leading-relaxed">{trap}</p>
              </div>
            ))}
          </div>
        </div>

        {/* No-Spend Days */}
        <div>
          <h3 className="font-bold text-base mb-4 flex items-center gap-2">
            <Calendar className="size-4 text-accent" />
            {t('financeFeatures.noSpendTitle')}
          </h3>
          <div className="bg-gradient-to-l from-accent/10 via-card to-transparent rounded-2xl p-5 border border-accent/20">
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {t('financeFeatures.noSpendDesc')}
            </p>
            <div className="flex flex-wrap gap-2">
              {noSpendDays.map((day, i) => (
                <span key={i} className="text-xs font-bold bg-primary/10 text-primary rounded-full px-3 py-1.5">
                  🚫 {day}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. Special Budgets ─── */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
          <Target className="size-6 text-accent" />
          {t('financeFeatures.budgetsTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {budgetPlans.map((plan, i) => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border hover:shadow-moss-lg transition-all duration-300 hover:-translate-y-1">
              <plan.icon className="size-8 text-accent mb-3" />
              <h3 className="font-bold text-lg mb-3">{plan.title}</h3>
              <ul className="space-y-2">
                {plan.tips.map((tip, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="size-4 text-accent shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 4. Debt Elimination ─── */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
          <AlertTriangle className="size-6 text-destructive" />
          {t('financeFeatures.debtTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {debtMethods.map((method, i) => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border">
              <method.icon className="size-8 text-accent mb-3" />
              <h3 className="font-bold text-lg mb-2">{method.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{method.desc}</p>
              <div className="space-y-2">
                <p className="text-xs font-bold text-green-600 dark:text-green-400">{t('financeFeatures.prosLabel')}</p>
                {method.pros.map((pro, j) => (
                  <p key={j} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <CheckCircle className="size-3.5 text-green-500 shrink-0 mt-0.5" /> {pro}
                  </p>
                ))}
                <p className="text-xs font-bold text-destructive mt-2">{t('financeFeatures.consLabel')}</p>
                {method.cons.map((con, j) => (
                  <p key={j} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <AlertTriangle className="size-3.5 text-destructive shrink-0 mt-0.5" /> {con}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-destructive/5 rounded-2xl p-6 border border-destructive/20">
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
            <HelpCircle className="size-4 text-destructive" />
            {t('financeFeatures.refinanceTitle')}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('financeFeatures.refinanceDesc')}
          </p>
        </div>
      </div>

      {/* ─── 5. Income Boost ─── */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
          <DollarSign className="size-6 text-accent" />
          {t('financeFeatures.incomeTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {incomeAdditions.map((section, i) => (
            <div key={i} className="bg-card rounded-2xl p-6 border border-border hover:shadow-moss-lg transition-all duration-300 hover:-translate-y-1">
              <section.icon className="size-8 text-accent mb-3" />
              <h3 className="font-bold text-lg mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="size-4 text-accent shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default FinanceFeatures;
