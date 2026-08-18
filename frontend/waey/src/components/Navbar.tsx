import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, User, LogOut, type LucideIcon } from "lucide-react";
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

  const navLinks: { path: string; label: string; icon?: LucideIcon }[] = [
    { path: "/", label: "nav.home" },
    { path: "/health", label: "nav.health" },
    { path: "/finance", label: "nav.finance" },
    { path: "/environment", label: "nav.environment" },
    { path: "/education", label: "nav.education" },
    { path: "/dashboard", label: "nav.dashboard" },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500
        ${scrolled
          ? "bg-background/75 dark:bg-background/60 backdrop-blur-2xl border-b border-border/50"
          : "bg-transparent"}`}>
        <nav
          className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center relative z-[2] pointer-events-auto"
          dir="rtl"
        >
          <Link to="/" className="flex items-center shrink-0" aria-label={t('nav.homeLink')}>
            <img src={logo} alt={t('nav.homeLink')} className="h-12 w-auto" />
          </Link>

          <div className="hidden md:flex md:items-center md:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `font-body text-sm rounded-full px-3 py-2 transition-colors ${
                    isActive
                      ? "text-foreground font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {t(link.label)}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="font-body rounded-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
                  <button
                    onClick={signOut}
                    className="font-body inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <LogOut className="size-4" />
                    <span className="hidden sm:inline">{t('nav.logout')}</span>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="signed-out"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <button
                    onClick={() => { setAuthMode("signup"); setAuthModalOpen(true); }}
                    className="font-body rounded-full px-6 py-2.5 text-sm bg-foreground text-background hover:scale-[1.03] transition-transform duration-300"
                  >
                    {t('nav.signup')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label={t('nav.search')}
            >
              <Search className="size-5" />
            </button>

            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label={t('nav.menu')}
            >
              <Menu className="size-6" />
            </button>
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
            <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-full max-w-sm flex flex-col
                bg-background/85 dark:bg-background/90 backdrop-blur-2xl rounded-l-[2rem]
                shadow-moss-lg border border-border/60"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-border/60">
                <h3 className="font-display text-2xl text-foreground">{t('nav.menu')}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 rounded-full bg-card border border-border/60 hover:bg-muted/60 transition-colors"
                >
                  <X className="size-5 text-foreground/80" />
                </button>
              </div>

              <nav className="flex-1 p-5 space-y-2 overflow-y-auto">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `font-body flex items-center gap-3 px-4 py-3.5 rounded-full text-base font-medium transition-colors ${
                        isActive
                          ? "bg-card text-foreground font-bold shadow-soft"
                          : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon && <link.icon className="size-5" />}
                    {t(link.label)}
                  </NavLink>
                ))}

                <div className="pt-5 border-t border-border/60 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <ThemeToggle />
                    <button
                      onClick={() => lang === 'ar' ? setLang('en') : setLang('ar')}
                      className="size-9 grid place-items-center rounded-full bg-card border border-border/60 text-foreground/80 hover:text-foreground transition-colors"
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
                          className="font-body w-full px-4 py-3 text-base font-bold rounded-full bg-card border border-border/60 text-foreground/80 hover:text-destructive shadow-soft transition-colors flex items-center justify-center gap-2"
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
                        <button
                          onClick={() => { setAuthMode("signup"); setAuthModalOpen(true); setIsOpen(false); }}
                          className="font-body w-full px-4 py-3 text-base font-bold rounded-full bg-foreground text-background shadow-moss hover:scale-[1.02] transition-transform"
                        >
                          {t('nav.signup')}
                        </button>
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
