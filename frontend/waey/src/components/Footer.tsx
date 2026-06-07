import { Mail } from "lucide-react";
import logoDark from "@/assets/logo-waey-dark.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="relative z-10 bg-[#2C2C24] text-white border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center text-center gap-4">
        <div className="flex items-center justify-center mb-1">
          <img src={logoDark} alt="وعي" className="h-36 w-auto" />
        </div>
        <p className="text-xs text-white/70 max-w-md leading-relaxed">
          {t('footer.desc')}
        </p>
        <a
          href="mailto:waey.official.mk@gmail.com"
          className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white transition-all duration-300 group"
        >
          <span className="size-7 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
            <Mail className="size-3.5" />
          </span>
          waey.official.mk@gmail.com
        </a>
        <p className="text-xs text-white/40 mt-2">
          {t('footer.copyright')} {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
