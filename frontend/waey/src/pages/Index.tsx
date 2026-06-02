import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Wallet, TreePine, ArrowLeft, LayoutDashboard, GraduationCap, Sparkles, Trophy, Flame } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import AskSection from "@/components/AskSection";
import { getCardRadius } from "@/lib/organic";

const sections = [
  { to: "/health", icon: Heart, title: "الصحة", desc: "عادات بسيطة لجسد قوي وعقل صافي.", color: "from-primary/20 to-leaf-light/40" },
  { to: "/finance", icon: Wallet, title: "المالية", desc: "حاسبات وادخار يبني مستقبلك.", color: "from-secondary/20 to-sun-warm/40" },
  { to: "/environment", icon: TreePine, title: "البيئة", desc: "إعادة تدوير وتوفير طاقة وماء.", color: "from-primary/15 to-accent/30" },
  { to: "/education", icon: GraduationCap, title: "التعليم والتركيز", desc: "طرق مذاكرة، إزاي تركز، وكلمات تحفّزك.", color: "from-secondary/15 to-muted" },
  { to: "/dashboard", icon: LayoutDashboard, title: "يومي في وعي", desc: "لوحة شخصية، تحدي اليوم وتتبع عاداتك.", color: "from-accent/30 to-leaf-light/30" },
];

const Index = () => {
  return (
    <div className="relative">
      <HeroSection />

      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200/60 dark:border-amber-800/30 rounded-[2rem] p-6 md:p-8"
        >
          <div className="absolute -top-10 -left-10 size-40 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 size-40 rounded-full bg-orange-400/10 blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="size-16 md:size-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-lg">
              <Trophy className="size-8 md:size-10 text-white" />
            </div>
            <div className="flex-1 text-center md:text-right">
              <h3 className="text-xl md:text-2xl font-bold text-amber-900 dark:text-amber-200 mb-2">
                🏆 نظام الجائزة
              </h3>
              <p className="text-amber-800/80 dark:text-amber-300/80 leading-relaxed font-medium">
                أول مستخدم يصل إلى{" "}
                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold bg-amber-100 dark:bg-amber-900/40 px-3 py-0.5 rounded-full">
                  <Flame className="size-4" />
                  100
                </span>{" "}
                نقطة استمرار يفوز بـ{" "}
                <span className="text-amber-600 dark:text-amber-400 font-bold text-lg">500 جنيه مصري</span> 🎉
              </p>
              <p className="text-sm text-amber-700/60 dark:text-amber-400/60 mt-2">
                كل 5 دقائق تواجد نشط = نقطة استمرار (مرة واحدة يومياً). سجل دخولك وابدأ جمع النقاط!
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative px-4 sm:px-6 lg:px-8 pb-32 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-card/70 text-muted-foreground text-sm font-bold px-5 py-2 rounded-full mb-4 hover:scale-105 transition-transform duration-300 border border-border/50 shadow-soft">
            <Sparkles className="size-4" />
            استكشف الأقسام
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-balance">
            اختر المجال اللي عايز تبدأ فيه
          </h2>
        </motion.div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((s, i) => (
            <motion.div
              key={s.to}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <Link
                to={s.to}
                className={`group block p-8 bg-card border border-border/50 shadow-soft hover:-translate-y-1 hover:shadow-moss-lg hover:border-primary transition-all duration-300 ${getCardRadius(i)}`}
              >
                <div className="relative mb-5">
                  <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                    <s.icon className="size-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                </div>
                <h3 className="font-bold text-lg md:text-xl mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{s.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:gap-3 transition-all duration-300">
                  ادخل القسم
                  <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <AskSection />
    </div>
  );
};

export default Index;
