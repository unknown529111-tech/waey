import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Wallet, TreePine, ArrowLeft, LayoutDashboard, Target, ChefHat, GraduationCap } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import DidYouKnow from "@/components/DidYouKnow";

const sections = [
  { to: "/health", icon: Heart, title: "الصحة", desc: "عادات بسيطة لجسد قوي وعقل صافي.", bg: "from-destructive/10 to-destructive/0", color: "text-destructive" },
  { to: "/finance", icon: Wallet, title: "المالية", desc: "حاسبات وادخار يبني مستقبلك.", bg: "from-accent/10 to-accent/0", color: "text-accent" },
  { to: "/environment", icon: TreePine, title: "البيئة", desc: "إعادة تدوير وتوفير طاقة وماء.", bg: "from-primary/10 to-primary/0", color: "text-primary" },
  { to: "/education", icon: GraduationCap, title: "التعليم والتركيز", desc: "طرق مذاكرة، إزاي تركز، وكلمات تحفّزك.", bg: "from-sun-warm/40 to-transparent", color: "text-accent" },
  { to: "/dashboard", icon: LayoutDashboard, title: "يومي في وعي", desc: "لوحة شخصية، تحدي اليوم وتتبع عاداتك.", bg: "from-primary/15 to-primary/0", color: "text-primary" },
  { to: "/plans", icon: Target, title: "خطط 30 يوم", desc: "غيّر عاداتك في شهر بخطوة كل يوم.", bg: "from-leaf-light/60 to-transparent", color: "text-primary" },
  { to: "/recipes", icon: ChefHat, title: "وصفات صحية", desc: "أكل بيتي مصري بسعرات وتكلفة.", bg: "from-destructive/5 to-transparent", color: "text-destructive" },
];

const Index = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Calm natural gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-leaf-light/40 via-background to-sun-warm/30 pointer-events-none" />
      <div className="absolute top-20 -right-20 size-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-20 size-[400px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        <HeroSection />
        <DidYouKnow />

        <section className="px-6 md:px-12 max-w-[1200px] mx-auto py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-bold text-center mb-12 text-primary"
          >
            استكشف الأقسام
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sections.map((s, i) => (
              <motion.div
                key={s.to}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={s.to}
                  className={`group block p-8 rounded-3xl bg-gradient-to-br ${s.bg} bg-card border border-border hover:shadow-xl hover:-translate-y-1 transition-all`}
                >
                  <s.icon className={`size-10 ${s.color} mb-4`} />
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-primary group-hover:gap-2 transition-all">
                    ادخل القسم
                    <ArrowLeft className="size-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
