import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, User, LogOut } from "lucide-react";
import logo from "@/assets/logo-waey.png";
import { useLanguage } from "@/contexts/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import SearchModal from "@/components/SearchModal";
import AuthModal from "@/components/AuthModal";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const { t, lang, setLang } = useLanguage();
  const { user, isAuthenticated, isLoaded, signOut } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "nav.home", icon: null },
    { path: "/health", label: "nav.health", icon: null },
    { path: "/finance", label: "nav.finance", icon: null },
    { path: "/environment", label: "nav.environment", icon: null },
    { path: "/education", label: "nav.education", icon: null },
    { path: "/dashboard", label: "nav.dashboard", icon: null },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500
        ${scrolled
          ? "bg-[linear-gradient(135deg,rgba(255,255,255,0.65),rgba(255,255,255,0.35))] dark:bg-[linear-gradient(135deg,rgba(20,28,40,0.75),rgba(20,28,40,0.45))] backdrop-blur-2xl shadow-[0_8px_32px_-12px_rgba(40,90,140,0.35)] border-b border-white/40 dark:border-white/10"
          : "bg-transparent"}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[2] pointer-events-auto" dir="rtl">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2" aria-label={t('nav.homeLink')}>
              <img src={logo} alt={t('nav.homeLink')} className="h-24 w-auto" />
            </Link>

            <div className="hidden md:flex md:items-center md:gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-white/50 dark:bg-white/10 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/30 dark:hover:bg-white/5"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {link.icon && <link.icon className="size-4 inline-block ml-1" />}
                  {t(link.label)}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />

              <button
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                className="btn btn-glass px-3 py-2 text-sm"
                aria-label={t('nav.toggleLang')}
              >
                {lang === 'ar' ? 'EN' : 'عربي'}
              </button>

              <AnimatePresence mode="wait">
                {isLoaded && isAuthenticated ? (
                  <motion.div
                    key="signed-in"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={signOut}
                        className="btn btn-glass px-3 py-2 text-sm text-destructive/80 hover:text-destructive"
                      >
                        <LogOut className="size-4" />
                        <span className="hidden sm:inline">{t('nav.logout')}</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="signed-out"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setAuthMode("signup"); setAuthModalOpen(true); }}
                        className="btn btn-moss px-4 py-2 text-sm"
                      >
                        {t('nav.signup')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label={t('nav.search')}
              >
                <Search className="size-5" />
              </button>

              <button
                onClick={() => setIsOpen(true)}
                className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label={t('nav.menu')}
              >
                <Menu className="size-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <div className="absolute inset-0 bg-sky-400/10 backdrop-blur-sm" />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-full max-w-sm flex flex-col
                bg-[linear-gradient(165deg,rgba(255,255,255,0.82),rgba(214,235,255,0.72))]
                backdrop-blur-2xl rounded-l-[2rem] shadow-[0_20px_60px_-20px_rgba(80,160,220,0.5)]
                border border-white/60"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-white/60">
                <h3 className="font-bold text-sky-900/70">{t('nav.menu')}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 rounded-full bg-white/60 backdrop-blur-md border border-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_12px_-4px_rgba(60,150,220,0.3)] hover:bg-white/80 transition-colors"
                >
                  <X className="size-5 text-sky-700/70" />
                </button>
              </div>

              <nav className="flex-1 p-5 space-y-2 overflow-y-auto">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3.5 rounded-full text-base font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-white/75 text-sky-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_6px_16px_-8px_rgba(70,150,220,0.45)]"
                          : "text-sky-900/60 hover:bg-white/45 hover:text-sky-800"
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon && <link.icon className="size-5" />}
                    {t(link.label)}
                  </NavLink>
                ))}

                <div className="pt-5 border-t border-white/60 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <ThemeToggle />
                    <button
                      onClick={() => lang === 'ar' ? setLang('en') : setLang('ar')}
                      className="size-9 grid place-items-center rounded-full bg-white/60 backdrop-blur-md border border-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_12px_-4px_rgba(60,150,220,0.3)] text-sky-700/80 hover:text-sky-800 transition-colors"
                      aria-label={t('nav.toggleLang')}
                    >
                      <span className="text-sm font-bold">{lang === 'ar' ? 'EN' : 'ع'}</span>
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {isLoaded && isAuthenticated ? (
                      <motion.div
                        key="signed-in"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <button
                          onClick={signOut}
                          className="w-full px-4 py-3 text-base font-bold rounded-full bg-white/60 backdrop-blur-md border border-white/70 text-sky-800/80 hover:text-sky-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_12px_-4px_rgba(60,150,220,0.3)] transition-colors flex items-center justify-center gap-2"
                        >
                          <LogOut className="size-5" />
                          {t('nav.logout')}
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="signed-out"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => { setAuthMode("signup"); setAuthModalOpen(true); setIsOpen(false); }}
                            className="w-full px-4 py-3 text-base font-bold rounded-full bg-gradient-to-br from-[#6f8a58] to-[#4d5f3c] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_10px_24px_-10px_rgba(77,95,60,0.55)] hover:opacity-95 transition-opacity"
                          >
                            {t('nav.signup')}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
      />

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;