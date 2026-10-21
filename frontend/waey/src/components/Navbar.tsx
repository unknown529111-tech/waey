/*
 * Navbar — the site chrome's top bar.
 *
 * Reference structure (the approved design image): a clean, solid light bar
 * with [logo + wordmark] on the inline-start side, the nav links centred, and
 * a search icon plus a strong CTA pill on the inline-end side.
 *
 * New locale keys (added to src/locales/ar.ts and src/locales/en.ts):
 *   brand.name       ar: "وعي"                       en: "Waey"
 *   brand.tagline    ar: "وعي في مكان هادئ واحد"      en: "Awareness in one calm place"
 *   nav.langSwitch   ar: "EN"                         en: "عربي"
 *   nav.close        ar: "إغلاق"                      en: "Close"
 *   footer.link.trackers (footer) ar: "المتتبعات اليومية" en: "Daily trackers"
 */
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, LogOut, Menu, Search, X } from "lucide-react";
import logoMark from "@/assets/logo-mark.png";
import { useLanguage } from "@/contexts/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import SearchModal from "@/components/SearchModal";
import AuthModal from "@/components/AuthModal";
import { ThemeToggle } from "@/components/ThemeToggle";

/** The pages the navbar links to. Every one of these is a real route. */
const NAV_LINKS = [
  { path: "/", label: "nav.home" },
  { path: "/health", label: "nav.health" },
  { path: "/finance", label: "nav.finance" },
  { path: "/environment", label: "nav.environment" },
  { path: "/education", label: "nav.education" },
  { path: "/dashboard", label: "nav.dashboard" },
];

const Navbar = () => {
  const { t, lang, setLang } = useLanguage();
  const { isAuthenticated, isLoaded, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const drawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const isRtl = lang === "ar";

  const openAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setIsOpen(false);
  };

  const handleSignOut = () => {
    signOut();
    setIsOpen(false);
  };

  /**
   * Drawer behaviour: move focus in, keep it in (Tab cycles inside the
   * panel) and close on Escape.
   */
  useEffect(() => {
    if (!isOpen) return;
    const panel = drawerRef.current;
    if (!panel) return;

    const getFocusable = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );

    getFocusable()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const items = getFocusable();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  /**
   * Hand focus back to the button that opened the drawer. This effect runs
   * after the drawer is closed and removed from React's tree, so the focus
   * is not clobbered by the drawer's unmount.
   */
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      return;
    }
    if (!wasOpenRef.current) return;
    wasOpenRef.current = false;
    menuButtonRef.current?.focus();
  }, [isOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-card">
        <nav
          dir={isRtl ? "rtl" : "ltr"}
          className="mx-auto flex h-16 max-w-[80rem] items-center gap-2 px-4 sm:h-[72px] sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-4 lg:px-8"
        >
          {/* Brand — mark + wordmark, on the inline-start side */}
          <Link
            to="/"
            className="flex min-h-11 shrink-0 items-center gap-2.5 lg:justify-self-start"
            aria-label={t('nav.homeLink')}
          >
            <img src={logoMark} alt="" className="h-9 w-auto" />
            <span className="flex flex-col">
              <span className="font-display text-lg font-bold leading-tight text-foreground">
                {t('brand.name')}
              </span>
              <span className="hidden font-body text-[11px] leading-tight text-muted-foreground lg:block">
                {t('brand.tagline')}
              </span>
            </span>
          </Link>

          {/* Links — centred in the bar (grid track 2), hidden below lg */}
          <div className="hidden lg:flex lg:justify-self-center lg:items-center lg:gap-0.5">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `relative inline-flex min-h-11 items-center rounded-full px-2.5 font-body text-sm transition-colors xl:px-3 ${
                    isActive
                      ? "font-bold text-primary after:absolute after:inset-x-2.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary after:content-['']"
                      : "font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`
                }
              >
                {t(link.label)}
              </NavLink>
            ))}
          </div>

          {/* Actions — inline-end side */}
          <div className="ms-auto flex items-center gap-0.5 lg:ms-0 lg:justify-self-end lg:gap-1">
            {/* Every control below carries shrink-0: inside the 1fr grid track the
                flex row would otherwise compress the icon buttons below 44px
                between 1024 and 1099px wide. */}
            <div className="hidden shrink-0 sm:block">
              <ThemeToggle label={t('nav.toggleDark')} />
            </div>

            <button
              type="button"
              onClick={() => setLang(isRtl ? "en" : "ar")}
              className="min-h-11 min-w-11 shrink-0 rounded-full px-2 font-body text-xs font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={t('nav.toggleLang')}
            >
              {t('nav.langSwitch')}
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={t('nav.search')}
            >
              <Search className="size-5" aria-hidden="true" />
            </button>

            <div className="hidden shrink-0 sm:block">
              <AnimatePresence mode="wait" initial={false}>
                {isLoaded && isAuthenticated ? (
                  <motion.div
                    key="signed-in"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                  >
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 font-body text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <LogOut className="size-4" aria-hidden="true" />
                      {t('nav.logout')}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="signed-out"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                  >
                    <button
                      type="button"
                      onClick={() => openAuth("signup")}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 font-body text-sm font-bold text-primary-foreground shadow-soft transition-transform duration-300 hover:scale-[1.03] active:scale-95 xl:px-5"
                    >
                      {t('nav.signup')}
                      {isRtl ? (
                        <ArrowLeft className="size-4" aria-hidden="true" />
                      ) : (
                        <ArrowRight className="size-4" aria-hidden="true" />
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsOpen(true)}
              className="grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
              aria-label={t('nav.menu')}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer — slides in from the inline-end edge, where its trigger sits */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-foreground/30"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              ref={drawerRef}
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-nav-title"
              initial={{ x: isRtl ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? "-100%" : "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
              className="absolute inset-y-0 end-0 flex w-[min(20rem,100%)] flex-col border-s border-border bg-background shadow-float"
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
                <h2 id="mobile-nav-title" className="font-display text-xl text-foreground">
                  {t('nav.menu')}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="grid size-11 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  aria-label={t('nav.close')}
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                <nav className="space-y-1">
                  {NAV_LINKS.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      end={link.path === "/"}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex min-h-11 items-center border-s-2 px-3 py-2.5 font-body text-base transition-colors ${
                          isActive
                            ? "border-primary bg-muted font-bold text-foreground"
                            : "border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        }`
                      }
                    >
                      {t(link.label)}
                    </NavLink>
                  ))}
                </nav>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-4">
                  <ThemeToggle label={t('nav.toggleDark')} />
                  <button
                    type="button"
                    onClick={() => setLang(isRtl ? "en" : "ar")}
                    className="min-h-11 min-w-11 rounded-full border border-border px-3 font-body text-sm font-bold text-foreground transition-colors hover:bg-muted"
                    aria-label={t('nav.toggleLang')}
                  >
                    {t('nav.langSwitch')}
                  </button>
                </div>

                <div className="mt-3">
                  <AnimatePresence mode="wait" initial={false}>
                    {isLoaded && isAuthenticated ? (
                      <motion.div
                        key="signed-in"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                      >
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 font-body text-sm font-medium text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
                        >
                          <LogOut className="size-4" aria-hidden="true" />
                          {t('nav.logout')}
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="signed-out"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                      >
                        <button
                          type="button"
                          onClick={() => openAuth("signup")}
                          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 font-body text-sm font-bold text-primary-foreground shadow-soft transition-transform duration-300 hover:scale-[1.03] active:scale-95"
                        >
                          {t('nav.signup')}
                          {isRtl ? (
                            <ArrowLeft className="size-4" aria-hidden="true" />
                          ) : (
                            <ArrowRight className="size-4" aria-hidden="true" />
                          )}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
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
