import { Mail, Shield, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import logoDark from "@/assets/logo-waey-dark.png";
import { useLanguage } from "@/contexts/useLanguage";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="relative z-10 bg-ink text-white border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center text-center gap-4">
        <div className="flex items-center justify-center mb-1">
          <img src={logoDark} alt="وعي" className="h-36 w-auto" />
        </div>
        <p className="text-xs text-white/70 max-w-md leading-relaxed">
          {t('footer.desc')}
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap mt-1">
          <Link
            to="/privacy"
            className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-all duration-300 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10"
          >
            <Shield className="size-3" />
            سياسة الخصوصية
          </Link>
          <Link
            to="/terms"
            className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-all duration-300 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10"
          >
            <Scale className="size-3" />
            شروط الاستخدام
          </Link>
          <a
            href="mailto:waey.official.mk@gmail.com"
            className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-white transition-all duration-300 group bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10"
          >
            <Mail className="size-3.5" />
            waey.official.mk@gmail.com
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61589322916820"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-white transition-all duration-300 group bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10"
          >
            <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            صفحة وعي على فيسبوك
          </a>
        </div>
        {/* Website Owner & Social Media Section */}
        <div className="w-full max-w-2xl mt-4 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-right">
            <span className="text-[11px] text-white/50 block font-medium">مؤسس وصانع المنصة (Website Owner):</span>
            <strong className="text-sm text-white font-bold">محمود أحمد محمد خليل</strong>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="https://www.facebook.com/profile.php?id=100033533538308"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-all duration-300 bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full border border-white/10"
              title="فيسبوك الشخصي للمؤسس"
            >
              <svg className="size-3.5 fill-current text-blue-400" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              فيسبوك الشخصي
            </a>

            <a
              href="https://www.linkedin.com/in/mahmoud-k-15780939b/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-all duration-300 bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full border border-white/10"
              title="لينكد إن الشخصي للمؤسس"
            >
              <svg className="size-3.5 fill-current text-sky-400" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </div>

        <p className="text-xs text-white/40 mt-2">
          {t('footer.copyright')} {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
