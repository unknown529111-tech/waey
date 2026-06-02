import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import heroImage from "@/assets/hero-nature.jpg";
import BlobBackground from "./BlobBackground";

const HeroSection = () => {
  return (
    <header className="relative pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center flex flex-col items-center gap-8 overflow-hidden bg-gradient-to-br from-leaf-light/40 via-background to-sun-warm/30">
      <BlobBackground count={2} className="z-0" />
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 inline-flex items-center gap-2 bg-card/70 backdrop-blur text-muted-foreground text-xs font-bold px-4 py-2 rounded-full border border-border/50 shadow-soft"
      >
        <Leaf className="size-3.5" />
        منصة التوازن الشامل
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08 }}
        className="relative z-10 text-4xl md:text-6xl font-bold text-balance leading-[1.15] tracking-tight"
      >
        ازرع عاداتك اليوم،
        <br />
        <span className="text-primary mt-6 block">واحصد حياة متوازنة غداً.</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.16 }}
        className="relative z-10 text-base md:text-lg max-w-[55ch] text-muted-foreground text-pretty leading-[1.9]"
      >
        منصة وعي ترشدك خطوة بخطوة نحو استقرار مالي، صحة مستدامة، وبيئة مزدهرة.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="relative z-10 w-full max-w-[700px] mt-6 rounded-4xl overflow-hidden shadow-soft-lg border border-border/40"
      >
        <img
          src={heroImage}
          alt="نبتة خضراء تنمو من تربة ذهبية ترمز للنمو والاستدامة"
          width={1200}
          height={800}
          className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
      </motion.div>
    </header>
  );
};

export default HeroSection;
