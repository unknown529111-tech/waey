import { Wallet, PiggyBank, TrendingUp, Shield, Target, AlertTriangle, Lightbulb, Coins, ShoppingBag, HelpCircle, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";
import Calculators from "@/components/Calculators";
import FinanceFeatures from "@/components/FinanceFeatures";

const principles = [
  { icon: PiggyBank, title: "قاعدة 50/30/20", desc: "50% من دخلك للأساسيات (إيجار، أكل، فواتير)، 30% لرغباتك، و20% ادخار واستثمار. ابدأ بالنسبة وعدّلها على حسب وضعك." },
  { icon: Shield, title: "صندوق طوارئ", desc: "ادخر ما يعادل 3 إلى 6 شهور مصاريف في حساب توفير سهل الوصول. ده اللي بيحميك من القروض وقت الأزمات." },
  { icon: Target, title: "اكتب أهدافك بفلوس", desc: "بدل 'عايز أوفر'، قول 'هوفر 10,000 جنيه خلال 6 شهور بـ 1,700 شهريًا'. الهدف الواضح بيتحقق." },
  { icon: TrendingUp, title: "ادفع لنفسك الأول", desc: "أول ما المرتب ينزل، حوّل نسبة الادخار فورًا قبل أي مصروف. لا تنتظر آخر الشهر، مفيش هيفضل." },
  { icon: AlertTriangle, title: "اوعى الديون الاستهلاكية", desc: "تقسيط موبايل أو ملابس بفوايد مرتفعة بيأكل دخلك. لو هتقسط، يبقى لأصل بينمو (تعليم، شغل)." },
  { icon: Coins, title: "تتبع كل جنيه", desc: "أول شهرين سجّل كل مصروف. هتتفاجئ بحجم المصاريف الصغيرة (قهوة، توصيل، اشتراكات) لما تتجمع." },
];

const everydayTips = [
  "اعمل قائمة قبل ما تنزل تتسوّق وملتزمش بحاجة برّاها.",
  "استنى 24 ساعة قبل أي شراء فوق 500 جنيه — غالبًا الرغبة بتقل.",
  "قارن سعر المنتج في 3 محلات/مواقع قبل ما تشتري.",
  "اطبخ في البيت 5 أيام في الأسبوع — بيوفر آلاف شهريًا.",
  "ألغي أي اشتراك مش بتستخدمه فعلًا (Netflix، Gym، تطبيقات).",
  "اشتري الأساسيات بكميات أكبر لما يكون فيه عرض (أرز، زيت، صابون).",
  "خلي عندك ميزانية أسبوعية كاش — لما تخلص بطلت تصرف.",
  "متروحش السوبرماركت وانت جعان، هتشتري ضعف اللي محتاجه.",
  "قلل التوصيل (Talabat/Mrsool) لمرة في الأسبوع كحد أقصى.",
  "بدل قهوة بره يوميًا (40+ جنيه)، اعملها في البيت بـ 5 جنيه.",
];

const earnTips = [
  { title: "نمّي مهارة بتباع", desc: "تعلم مهارة (تصميم، برمجة، كتابة، لغة) — راتب أعلى أو شغل إضافي." },
  { title: "ابدأ Side Hustle صغير", desc: "Freelance، بيع أونلاين، تدريس خصوصي. حتى 1000-2000 جنيه إضافي شهريًا فرق كبير." },
  { title: "اطلب علاوة بذكاء", desc: "وثّق إنجازاتك بأرقام، قارن بسوق الشغل، واطلب بثقة كل سنة." },
  { title: "استثمر بدل ما تخزّن", desc: "الفلوس النايمة بيأكلها التضخم. ابحث عن صناديق استثمار، ذهب، أو شهادات بنكية." },
];

const warnings = [
  "البعد عن مخططات 'اربح بسرعة' والعملات المشبوهة — أغلبها نصب.",
  "لا تقرض حد فلوس مش قادر تخسرها كلها.",
  "اقرأ شروط أي تمويل أو تقسيط — الفايدة الحقيقية غالبًا ضعف المعلنة.",
  "متحطش بياناتك البنكية على مواقع مش موثوقة.",
];

const Finance = () => (
  <div className="relative">
    <div className="absolute inset-0 bg-gradient-to-b from-leaf-light/40 via-background to-sun-warm/20 pointer-events-none" />
    <div className="relative">
      <PageHero
        badge="النمو المالي"
        icon={<Wallet className="size-4" />}
        title="أدوات لإدارة أموالك بذكاء"
        subtitle="حاسبات الكهرباء والمياه والمصروفات بالجنيه المصري، ونصايح عملية تطبّقها من النهارده."
      />
      <Calculators />

      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-16 space-y-12">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
            <Lightbulb className="size-6 text-accent" />
            مبادئ مالية
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
            نصائح ادخار يومية
          </h2>
          <div className="bg-card border border-[#DED8CF]/50 dark:border-border/50 rounded-[2rem] p-6 md:p-8 shadow-soft">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {everydayTips.map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 size-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed text-sm pt-0.5">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground flex items-center gap-2">
            <ShoppingBag className="size-6 text-accent" />
            قبل ما تشتري 🛒
          </h2>
          <p className="text-muted-foreground text-base mb-8 max-w-[55ch] leading-relaxed -mt-4">
            اسأل نفسك هذه الأسئلة الثلاثة قبل أي عملية شراء لتوفير المال والبيئة.
          </p>

          <div className="flex flex-col gap-4">
            {[
              { question: "هل أحتاج هذا المنتج فعلاً؟", icon: HelpCircle, tip: "انتظر 24 ساعة قبل الشراء. معظم الرغبات تتلاشى." },
              { question: "هل يوجد بديل أرخص وبنفس الجودة؟", icon: CheckCircle, tip: "قارن بين 3 خيارات على الأقل قبل اتخاذ القرار." },
              { question: "هل سأستخدمه أكثر من 30 مرة؟", icon: XCircle, tip: "قاعدة الـ 30: إذا لن تستخدمه 30 مرة، فهو ليس ضرورياً." },
            ].map((item, i) => (
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
            زوّد دخلك
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
            تنبيهات
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
            مش الفلوس اللي بتربحها هي اللي بتغنيك،
            <br />
            <span className="font-bold text-accent">دي اللي بتعرف تحافظ عليها.</span>
            <br />
            <br />
            ابدأ صغير، اتعلم باستمرار، واصبر — التراكم بيعمل المعجزات.
          </p>
        </div>
      </section>
    </div>
  </div>
);

export default Finance;
