import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Search, User, LogOut } from "lucide-react";
import logo from "@/assets/logo-waey.png";
import { useLanguage } from "@/contexts/useLanguage";
import { useAuth } from "@/contexts/AuthContext";
import SearchModal from "@/components/SearchModal";
import AuthModal from "@/components/AuthModal";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  return (
    <button
      onClick={() => {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.classList.toggle("dark", next);
      }}
      className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      aria-label="تبديل الوضع"
    >
      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
};

const Navbar = () => {
  const { t, lang, setLang } = useLanguage();
  const { user, isAuthenticated, isLoaded, signOut } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

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
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-sm shadow-soft" : "bg-transparent"}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir="rtl">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2" aria-label="وعي - الرئيسية">
              <img src={logo} alt="وعي" className="h-20 w-auto" />
            </Link>

            <div className="hidden md:flex md:items-center md:gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
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
                      <div className="hidden sm:block text-sm text-muted-foreground">
                        {t('nav.loggedInAs')} {user?.name}
                      </div>
                      <button
                        onClick={signOut}
                        className="px-3 py-1.5 text-sm font-medium rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center gap-1.5"
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
                        onClick={() => { setAuthMode("signin"); setAuthModalOpen(true); }}
                        className="px-4 py-2 text-sm font-bold rounded-full bg-muted hover:bg-muted/80 transition-colors"
                      >
                        {t('nav.login')}
                      </button>
                      <button
                        onClick={() => { setAuthMode("signup"); setAuthModalOpen(true); }}
                        className="px-4 py-2 text-sm font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
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
            <div className="absolute inset-0 bg-black/50" />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-card shadow-xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-bold">{t('nav.menu')}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon && <link.icon className="size-5" />}
                    {t(link.label)}
                  </NavLink>
                ))}

                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <ThemeToggle />
                    <button
                      onClick={() => lang === 'ar' ? setLang('en') : setLang('ar')}
                      className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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
                        <div className="text-sm text-muted-foreground px-1">
                          {t('nav.loggedInAs')} {user?.name}
                        </div>
                        <button
                          onClick={signOut}
                          className="w-full px-4 py-3 text-base font-bold rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2"
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
                            onClick={() => { setAuthMode("signin"); setAuthModalOpen(true); setIsOpen(false); }}
                            className="w-full px-4 py-3 text-base font-bold rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                          >
                            {t('nav.login')}
                          </button>
                          <button
                            onClick={() => { setAuthMode("signup"); setAuthModalOpen(true); setIsOpen(false); }}
                            className="w-full px-4 py-3 text-base font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
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