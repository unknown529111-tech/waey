import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

const NAV_ITEMS = ["Work", "Services", "Studio", "Contact"];

const PROJECTS = [
  { title: "Orion — Brand Identity", tag: "Branding", year: "2025" },
  { title: "Void — Digital Experience", tag: "Web Design", year: "2025" },
  { title: "Aether — Product Launch", tag: "Campaign", year: "2024" },
  { title: "Helios — Art Direction", tag: "Creative Direction", year: "2024" },
];

const SERVICES = [
  { title: "Brand Strategy", desc: "Positioning, narratives, and visual identities that cut through the noise." },
  { title: "Digital Design", desc: "Websites, platforms, and interactive experiences with obsessive attention to detail." },
  { title: "Art Direction", desc: "Campaigns, photoshoots, and visual systems that tell unforgettable stories." },
  { title: "Motion Design", desc: "Typography, animation, and film that bring ideas to life." },
];

const MARQUEE = ["Strategy", "Identity", "Digital", "Motion", "Art Direction", "Branding", "UI/UX"];

const DesignAgency = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const bgOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 0.8]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f0e8] font-['Inter',sans-serif] overflow-x-hidden">
      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
      }} />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-40 mix-blend-difference"
      >
        <motion.div className="absolute inset-0 bg-[#0a0a0a]" style={{ opacity: bgOpacity }} />
        <div className="relative flex items-center justify-between px-8 md:px-16 h-20">
          <span className="text-lg font-medium tracking-tight">STUDIO</span>
          <div className="hidden md:flex items-center gap-12">
            {NAV_ITEMS.map((item) => (
              <button key={item} className="text-sm font-light tracking-widest uppercase hover:opacity-60 transition-opacity">
                {item}
              </button>
            ))}
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center px-8 md:px-16">
        <div className="max-w-[1440px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            <span className="text-sm font-light tracking-[0.3em] uppercase text-[#f5f0e8]/40">Est. 2025</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3rem,10vw,8rem)] font-bold leading-[0.85] tracking-tighter mb-8"
          >
            <span className="block">Design that</span>
            <span className="block text-[#f5f0e8]/20" style={{ WebkitTextStroke: "1px #f5f0e8", WebkitTextFillColor: "transparent" }}>resonates.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 max-w-4xl"
          >
            <p className="text-lg md:text-xl font-light leading-relaxed text-[#f5f0e8]/60 max-w-xl">
              We craft visual identities, digital experiences, and campaigns for brands that refuse to blend in.
            </p>
            <motion.button
              whileHover={{ gap: "16px" }}
              className="group flex items-center gap-2 text-sm font-medium tracking-widest uppercase border-b border-[#f5f0e8]/20 pb-2 shrink-0 hover:border-[#f5f0e8]/60 transition-colors"
            >
              Start a project
              <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-16 bg-gradient-to-b from-[#f5f0e8]/40 to-transparent"
          />
        </motion.div>
      </section>

      {/* Marquee */}
      <section className="py-24 border-t border-[#f5f0e8]/5">
        <div className="overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex gap-16 w-max"
          >
            {[...MARQUEE, ...MARQUEE].map((item, i) => (
              <span key={i} className="text-[clamp(4rem,8vw,7rem)] font-bold leading-none text-[#f5f0e8]/5 whitespace-nowrap" style={{ WebkitTextStroke: "1px #f5f0e8", WebkitTextFillColor: "transparent" }}>
                {item} •
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Work */}
      <section className="px-8 md:px-16 py-32">
        <div className="max-w-[1440px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20"
          >
            <span className="text-sm font-light tracking-[0.3em] uppercase text-[#f5f0e8]/40">Selected Work</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mt-4">Recent projects</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#f5f0e8]/10">
            {PROJECTS.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-[#0a0a0a] p-8 md:p-12 cursor-pointer hover:bg-[#111] transition-colors"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-[#f5f0e8]/5 to-[#f5f0e8]/1 mb-8 flex items-center justify-center overflow-hidden">
                  <span className="text-6xl font-bold text-[#f5f0e8]/10 group-hover:scale-110 transition-transform duration-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight group-hover:translate-x-2 transition-transform duration-300">{project.title}</h3>
                    <span className="text-sm font-light text-[#f5f0e8]/40 mt-2 block">{project.tag}</span>
                  </div>
                  <span className="text-sm text-[#f5f0e8]/30 font-light">{project.year}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="px-8 md:px-16 py-32 bg-[#0d0d0d]">
        <div className="max-w-[1440px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20"
          >
            <span className="text-sm font-light tracking-[0.3em] uppercase text-[#f5f0e8]/40">What we do</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mt-4">Services</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="text-[#f5f0e8]/20 text-sm font-light">{(i + 1).toString().padStart(2, "0")}</span>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight mt-4 mb-4">{service.title}</h3>
                <p className="text-[#f5f0e8]/50 font-light leading-relaxed max-w-sm">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 md:px-16 py-48 text-center bg-[#0a0a0a]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-7xl font-bold tracking-tight leading-[0.9] mb-8">
            Let's make
            <br />
            something unforgettable.
          </h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#f5f0e8] text-[#0a0a0a] text-sm font-medium tracking-widest uppercase hover:bg-[#f5f0e8]/90 transition-colors mt-8"
          >
            Get in touch
            <ArrowUpRight size={16} />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-8 md:px-16 py-12 border-t border-[#f5f0e8]/5">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <span className="text-lg font-medium tracking-tight">STUDIO</span>
            <p className="text-sm text-[#f5f0e8]/30 font-light mt-2">© 2025 — All rights reserved</p>
          </div>
          <div className="flex gap-8">
            {["Twitter", "Instagram", "LinkedIn", "Dribbble"].map((social) => (
              <button key={social} className="text-sm text-[#f5f0e8]/40 font-light hover:text-[#f5f0e8]/80 transition-colors">
                {social}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DesignAgency;
