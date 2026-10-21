/*
 * Footer — the site chrome's deep band.
 *
 * The band is the `--footer` token: deep teal-navy #0F2C47 in light, and in
 * dark the token inverts to a pale mist. The text on the band therefore uses
 * `--background`, which inverts with it — pale on navy in light mode, deep on
 * the pale band in dark mode. Every colour below was measured against the
 * band it sits on (see deliverable.md for the ratios).
 *
 * New locale keys (added to src/locales/ar.ts and src/locales/en.ts):
 *   footer.groupFields    ar: "المجالات"                          en: "Fields"
 *   footer.groupFeatures  ar: "ميزات التطبيق"                     en: "App features"
 *   footer.groupLegal     ar: "قانوني"                            en: "Legal"
 *   footer.link.trackers  ar: "المتتبعات اليومية"                 en: "Daily trackers"
 *   footer.legal          ar: "© {year} وعي. جميع الحقوق محفوظة." en: "© {year} Waey. All rights reserved."
 */
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import logoMark from "@/assets/logo-mark.png";
import { useLanguage } from "@/contexts/useLanguage";

const GROUPS = [
  {
    title: "footer.groupFields",
    links: [
      { to: "/health", label: "nav.health" },
      { to: "/finance", label: "nav.finance" },
      { to: "/environment", label: "nav.environment" },
      { to: "/education", label: "nav.education" },
    ],
  },
  {
    title: "footer.groupFeatures",
    links: [
      { to: "/dashboard", label: "footer.link.trackers" },
      { to: "/insights", label: "nav.insights" },
      { to: "/recipes", label: "nav.recipes" },
      { to: "/assistant", label: "nav.assistant" },
      { to: "/shopping-list", label: "shopping.title" },
    ],
  },
  {
    title: "footer.groupLegal",
    links: [
      { to: "/privacy", label: "footer.privacy" },
      { to: "/terms", label: "footer.terms" },
      { to: "/faq", label: "footer.faq" },
    ],
  },
];

const SOCIAL_ICONS = [
  {
    href: "https://www.facebook.com/profile.php?id=61589322916820",
    labelKey: "footer.facebook",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    href: "https://www.facebook.com/profile.php?id=100033533538308",
    labelKey: "footer.ownerFacebookTitle",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    href: "https://www.linkedin.com/in/mahmoud-k-15780939b/",
    labelKey: "footer.ownerLinkedinTitle",
    path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5V5c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
  },
];

const iconClass =
  "grid size-11 place-items-center rounded-full border border-background/25 text-background/90 transition-colors hover:border-background/50 hover:bg-background/10 hover:text-background";

const Footer = () => {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-auto bg-footer text-background">
      <div className="mx-auto max-w-[80rem] px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-4 lg:gap-8">
          {/* Brand — mark, wordmark, tagline, contact, socials */}
          <div>
            <Link
              to="/"
              className="inline-flex min-h-11 items-center gap-3"
              aria-label={t('nav.homeLink')}
            >
              <img src={logoMark} alt="" className="h-10 w-auto" />
              <span className="flex flex-col">
                <span className="font-display text-2xl font-bold leading-tight">
                  {t('brand.name')}
                </span>
                <span className="font-body text-xs leading-snug text-background/80">
                  {t('brand.tagline')}
                </span>
              </span>
            </Link>

            <a
              href="mailto:waey.official.mk@gmail.com"
              className="mt-3 flex min-h-11 w-fit items-center gap-2 font-body text-sm text-background/90 transition-colors hover:text-background"
            >
              <Mail className="size-4 shrink-0" aria-hidden="true" />
              waey.official.mk@gmail.com
            </a>

            <div className="mt-1 flex items-center gap-2">
              {SOCIAL_ICONS.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(social.labelKey)}
                  className={iconClass}
                >
                  <svg className="size-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {GROUPS.map((group) => (
            <nav key={group.title} aria-label={t(group.title)}>
              <h3 className="eyebrow mb-2 !text-background/80">{t(group.title)}</h3>
              <ul>
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="inline-flex min-h-11 items-center font-body text-sm text-background/90 underline-offset-4 transition-colors hover:text-background hover:underline"
                    >
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Legal line */}
        <div className="mt-12 flex flex-col gap-2 border-t border-background/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-xs text-background/80">{t('footer.legal', { year })}</p>
          <p className="font-body text-xs text-background/80">
            {t('footer.ownerLabel')}{" "}
            <span className="font-semibold text-background">{t('footer.ownerName')}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
