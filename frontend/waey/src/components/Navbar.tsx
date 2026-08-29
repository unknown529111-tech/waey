import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, User, LogOut, type LucideIcon } from "lucide-react";
import logo from "@/assets/logo-waey.png";
import logoDark from "@/assets/logo-waey-dark.png";
import { useLanguage } from "@/contexts/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import SearchModal from "@/components/SearchModal";
import AuthModal from "@/components/AuthModal";
import { ThemeToggle } from "@/components/ThemeToggle";

const Navbar = () => {
  const { t, lang, setLang } = useLanguage();
  const { theme } = useTheme();
  const { user, isAuthenticated, isLoaded, signOut } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

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
      <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-500 bg-card/90 backdrop-blur-xl border-b border-border shadow-[0_1px_8px_-2px_rgb(0_0_0_/_0.18)] dark:shadow-[0_1px_8px_-2px_rgb(0_0_0_/_0.5)]">
        <nav
          className="max-w-[80rem] mx-auto px-8 py-6 flex justify-between items-center relative z-[2] pointer-events-auto"
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          <Link to="/" className="flex items-center shrink-0" aria-label={t('nav.homeLink')}>
            <img src={theme === "dark" ? logoDark : logo} alt={t('nav.homeLink')} className="h-9 w-auto" />
          </Link>

          <div className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `font-body text-sm transition-colors ${
                    isActive
                      ? "text-foreground"
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
                    className="btn btn-moss font-body px-6 py-2.5 text-sm"
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
                bg-background rounded-l-[1.125rem]
                border-l border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h3 className="font-display text-2xl text-foreground">{t('nav.menu')}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 rounded-full border border-border hover:border-foreground transition-colors"
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
                          ? "text-foreground font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon && <link.icon className="size-5" />}
                    {t(link.label)}
                  </NavLink>
                ))}

                <div className="pt-5 border-t border-border space-y-3">
                  <div className="flex items-center justify-end px-1">
                    <button
                      onClick={() => lang === 'ar' ? setLang('en') : setLang('ar')}
                      className="size-9 grid place-items-center rounded-full border border-border text-foreground/80 hover:text-foreground hover:border-foreground transition-colors"
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
                          className="font-body w-full px-4 py-3 text-base font-medium rounded-full border border-border text-foreground/80 hover:text-destructive hover:border-destructive/50 transition-colors flex items-center justify-center gap-2"
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
                          className="btn btn-moss font-body w-full px-4 py-3 text-base"
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
