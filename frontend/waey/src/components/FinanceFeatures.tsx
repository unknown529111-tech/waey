import { TrendingUp, AlertTriangle, CheckCircle, BadgePercent, Brain, ShoppingCart, Calendar, GraduationCap, Briefcase, Heart, Skull, Target, DollarSign, Users, MessageCircle, HelpCircle, Wallet } from "lucide-react";

/* ─── 1. Inflation & Value Protection ─── */

const valueComparison = [
  { method: "التخزين", desc: "تحت البلاطة أو في الدولاب", result: "تخسر قيمتها", icon: "🏚️" },
  { method: "الادخار", desc: "حساب توفير أو شهادة بنكية", result: "تحافظ على القيمة + فايدة بسيطة", icon: "🏦" },
  { method: "الاستثمار", desc: "ذهب، أسهم، صناديق استثمار", result: "بتكبر القيمة", icon: "📈" },
];

/* ─── 2. Financial Psychology ─── */

const spendingTriggers = [
  { trigger: "الفراغ والملل", fix: "لما تمسك الموبايل وتفتح تطبيقات التسوق من غير هدف" },
  { trigger: "التوتر والضغط", fix: "التسوق عشان تحسّن مزاجك — بيشتت المؤقت وبعدين بتندم" },
  { trigger: "عيون الناس", fix: "ضغط العزومات والمجاملات — تقول لأ وصعبانة عليك" },
  { trigger: "الجهزية", fix: "لما تشتري حاجة عشان 'فيها عرض' حتى لو مش محتاجها" },
];

/* ─── 3. Special Budgets ─── */

const budgetPlans = [
  {
    icon: GraduationCap,
    title: "🎓 طالب الجامعة",
    tips: [
      "اطبخ في السكن/البيت مع زمايلك — التجميع أوفر من الفردي",
      "استخدم مواصلات عامة واشترك شهري بدل دفع每一天",
      "اطبع الدروس عند مكتبة واحدة بكميات بدل كل درس لوحده",
      "اشترك في مكتبة الكلية أو استعير كتب بدل ما تشتري",
      "حدد مبلغ أسبوعي كاش — لما يخلص خلاص",
    ],
  },
  {
    icon: Briefcase,
    title: "💼 الدخل المتغير (فريلانسر)",
    tips: [
      "احسب متوسط آخر 6 شهور واعمل ميزانية على أساسه",
      "صندوق الطوارئ يكون أكبر — 9-12 شهر بدل 3-6",
      "خد مرتبك الشهري من الأرباح وحط الباقي في حساب استثماري",
      "افتح حساب بنكي منفصل للضرائب — حط 10% من كل شغل",
    ],
  },
  {
    icon: Heart,
    title: "💍 خطة ما قبل الزواج",
    tips: [
      "حدد ميزانية للشبكة والعفش قبل ما تنزل تشتري",
      "اطلب عروض أسعار من 3 أماكن على الأقل لنفس الحاجة",
      "الأجهزة الكهربائية — اشتري الأساسيات بس الأول, والباقي بعدين",
      "بلاش تاخد قرض لشقة إلا لو القسط أقل من 30% من دخلك",
      "افتكر: بداية بسيطة من غير ديون أحسن من بداية فخمة بديون سنين",
    ],
  },
];

/* ─── 4. Debt Elimination ─── */

const debtMethods = [
  {
    icon: Skull,
    title: "⚽ كرة الثلج (Snowball)",
    desc: "سدد أصغر دين الأول — تاخد دفعة معنوية وتكمل",
    pros: ["تحفيز نفسي عالي", "نتايج سريعة في البداية"],
    cons: ["بتدفع فوايد أكتر على المدى الطويل"],
  },
  {
    icon: TrendingUp,
    title: "🧊 الانهيار الجليدي (Avalanche)",
    desc: "سدد الدين اللي عليه أعلى فايدة الأول — توفر فلوس",
    pros: ["بتوفر فلوس على طول", "أكثر كفاءة من الناحية المالية"],
    cons: ["محتاج صبر — أول دين بياخد وقت"],
  },
];

/* ─── 5. Income Boost Additions ─── */

const incomeAdditions = [
  {
    icon: Users,
    title: "إزاي تجيب أول عميل",
    items: [
      "اعمل Portfolio بسيط — حتى لو بشغل وهمي أو تطوعي",
      "افتح حساب على لينكد إن واكتب إنك شغّال freelance",
      "انزل في جروبات فيسبوك بتاعة مجالك وعرض شغلك",
      "أول عميل — سعره قليل أو حتى ببلاش عشان الـ Review",
    ],
  },
  {
    icon: TrendingUp,
    title: "الدخل النشط vs السلبي",
    items: [
      "نشط: فلوس مقابل وقتك (شغل، فريلانس) — بتشتري توقف",
      "سلبي: أصول بتجيب فلوس وانت نايم (يوتيوب، منتجات رقمية، تأجير)",
      "الهدف تبني مصدر سلبي واحد على الأقل جنب شغلك",
    ],
  },
  {
    icon: MessageCircle,
    title: "مهارة التفاوض",
    items: [
      "أول ما يطلب منك سعر — متقولش رقم أولاً، اسأله عن الميزانية",
      "وثّق إنجازاتك بأرقام — 'زدت المبيعات ٣٠٪' أقوى من 'شتغلت كويس'",
      "لو هتفاوض على راتب — خلي أول رقم تقوله أعلى من اللي عايزه بـ ١٠-١٥٪",
    ],
  },
];

/* ─── Main Component ─── */

const FinanceFeatures = () => (
  <section className="space-y-12">

    {/* ─── 1. Inflation & Value Protection ─── */}
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
        <BadgePercent className="size-6 text-accent" />
        📉 التعامل مع التضخم وحماية القيمة
      </h2>
      <p className="text-muted-foreground mb-6 -mt-4">
        التضخم بيأكل قيمة الفلوس كل سنة. الفرق بين التخزين والادخار والاستثمار هو الفرق بين الخسارة والربح.
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
          نظام المظاريف الرقمية
        </h3>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
          أول ما المرتب ينزل، قسمه على محافظ أو حسابات منفصلة — مظروف لكل حاجة. وخلّي معاك بطاقة واحدة بس للصرف اليومي عشان متقدرش تصرف من المظاريف التانية.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: "الفواتير", pct: "٥٠٪", color: "bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800/30" },
            { name: "الأكل", pct: "٢٠٪", color: "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800/30" },
            { name: "الترفيه", pct: "١٠٪", color: "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30" },
            { name: "الادخار", pct: "٢٠٪", color: "bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/30" },
          ].map((env, i) => (
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
        🎭 علم النفس المالي
      </h2>

      {/* Spending Triggers */}
      <div className="mb-6">
        <h3 className="font-bold text-base mb-4 flex items-center gap-2">
          <ShoppingCart className="size-4 text-accent" />
          اعرف محفزات الصرف (Spending Triggers)
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
          فخاخ السوبر ماركت
        </h3>
        <div className="bg-card rounded-2xl p-5 border border-border space-y-3">
          {[
            "الحاجات الأساسية (اللبن، العيش) دايماً في آخر المحل — عشان تمشي على كل الحاجات وتشتري زيادة",
            "عروض 'اشتري 2 واحصل على 1' بتخليك تصرف أكتر من ميزانيتك على حاجات مش محتاجها",
            "الحاجات اللي في مستوى العين — أغلى وأعلى هامش ربح",
            "العطور والصابون الفاخر جنب الكاشير — عشان تشتري باندفاع وانت مستني",
            "إثارة الشائعات عن نقص سلعة معينة — عشان الناس تهرى تشتري وتخزّن ويرفعوا السعر",
          ].map((trap, i) => (
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
          تحدي أيام بدون صرف (No-Spend Days)
        </h3>
        <div className="bg-gradient-to-l from-accent/10 via-card to-transparent rounded-2xl p-5 border border-accent/20">
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            حدد يومين في الأسبوع ممنوع تدفع فيهم مليم (غير المواصلات الثابتة والأكل من البيت). هتوفر ١٠٠٠-٢٠٠٠ جنيه في الشهر من غير ما تحس!
          </p>
          <div className="flex flex-wrap gap-2">
            {["الأحد", "الخميس"].map((day, i) => (
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
        🎓 ميزانيات للحالات الخاصة
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
        🕳️ الخلاص من الديون
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {debtMethods.map((method, i) => (
          <div key={i} className="bg-card rounded-2xl p-6 border border-border">
            <method.icon className="size-8 text-accent mb-3" />
            <h3 className="font-bold text-lg mb-2">{method.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{method.desc}</p>
            <div className="space-y-2">
              <p className="text-xs font-bold text-green-600 dark:text-green-400">المميزات:</p>
              {method.pros.map((pro, j) => (
                <p key={j} className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <CheckCircle className="size-3.5 text-green-500 shrink-0 mt-0.5" /> {pro}
                </p>
              ))}
              <p className="text-xs font-bold text-destructive mt-2">العيوب:</p>
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
          متى تلجأ لإعادة جدولة الديون؟
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          لو بقيت مش قادر تسدد القسط الشهري، كلم البنك قبل ما تتأخر. إعادة الجدولة بتطول المدة وتقلل القسط — فيها فوايد زيادة بس أحسن من التعثر القانوني. متفكرش إن الموضوع هيحل نفسه — كل ما تكلمهم بدري كل ما كان أفضل.
        </p>
      </div>
    </div>

    {/* ─── 5. Income Boost ─── */}
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
        <DollarSign className="size-6 text-accent" />
        🚀 زوّد دخلك
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

export default FinanceFeatures;