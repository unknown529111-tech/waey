import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, User, LogOut } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logoLight from "@/assets/logo-waey.png";
import logoDark from "@/assets/logo-waey-dark.png";
import { useAuth } from "@/contexts/useAuth";
import { AuthModal } from "./AuthModal";

const links = [
  { to: "/", label: "الرئيسية", end: true },
  { to: "/health", label: "الصحة" },
  { to: "/finance", label: "المالية" },
  { to: "/environment", label: "البيئة" },
  { to: "/education", label: "التعليم" },
  { to: "/dashboard", label: "يومي" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const [scrolled, setScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="relative z-50 pt-4 px-4 sm:px-6 sticky top-4">
      <div
        className={`mx-auto max-w-6xl transition-all duration-500 ${
          scrolled
            ? "bg-white/70 dark:bg-[#1E1C18]/70 backdrop-blur-md shadow-moss border border-[#DED8CF]/50 dark:border-border/50"
            : "bg-white/40 dark:bg-[#1E1C18]/40 backdrop-blur-sm border border-transparent"
        } rounded-full`}
      >
        <div className="flex items-center justify-between px-2 md:px-4 h-16">
          <Link to="/" className="flex items-center shrink-0 group">
            <img src={logoLight} alt="وعي" className="h-24 w-auto block dark:hidden" />
            <img src={logoDark} alt="وعي" className="h-24 w-auto hidden dark:block" />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-bold rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-primary/10 text-primary shadow-soft"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted/60"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 hover:scale-105 active:scale-95 transition-all duration-300"
                  aria-label="حسابي"
                >
                  <User className="size-4" />
                </button>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="absolute left-0 top-12 z-50 w-56 bg-card border border-border/50 rounded-[2rem] shadow-float p-2"
                    >
                      <div className="px-4 py-3 border-b border-border/50 mb-1">
                        <p className="text-sm font-bold truncate">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => { signOut(); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-destructive hover:bg-destructive/5 rounded-xl transition-all"
                      >
                        <LogOut className="size-4" />
                        تسجيل الخروج
                      </button>
                    </motion.div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="hidden md:inline-flex h-10 px-5 items-center gap-2 text-sm font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-soft"
              >
                <User className="size-4" />
                تسجيل الدخول
              </button>
            )}
            <button
              onClick={() => setIsDark(!isDark)}
              className="size-10 rounded-full bg-muted/60 flex items-center justify-center hover:bg-muted hover:scale-105 active:scale-95 transition-all duration-300 text-foreground/70 hover:text-foreground"
              aria-label="تبديل الوضع"
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <button
              className="md:hidden size-10 rounded-full bg-muted/60 flex items-center justify-center hover:bg-muted hover:scale-105 active:scale-95 transition-all duration-300 text-foreground/70 hover:text-foreground"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="القائمة"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
            className="md:hidden mx-auto max-w-sm mt-2 bg-white/90 dark:bg-[#1E1C18]/90 backdrop-blur-md border border-[#DED8CF]/50 dark:border-border/50 rounded-[2rem] shadow-soft overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `text-sm font-bold py-3 px-4 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-muted/60"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {isAuthenticated ? (
                <button
                  onClick={() => { signOut(); setIsOpen(false); }}
                  className="flex items-center gap-3 text-sm font-bold py-3 px-4 rounded-xl text-destructive hover:bg-destructive/5 transition-all"
                >
                  <LogOut className="size-4" />
                  تسجيل الخروج
                </button>
              ) : (
                <button
                  onClick={() => { setAuthOpen(true); setIsOpen(false); }}
                  className="flex items-center gap-3 text-sm font-bold py-3 px-4 rounded-xl text-primary hover:bg-primary/5 transition-all"
                >
                  <User className="size-4" />
                  تسجيل الدخول
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </nav>
  );
};

export default Navbar;
