import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useT } from "@/contexts/useLanguage";

const NotFound = () => {
  const t = useT();
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
        <h1 className="text-2xl font-bold mb-2">{t('notFound.title')}</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {t('notFound.desc')}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold text-sm hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-300 shadow-soft"
        >
          <ArrowLeft className="size-4" />
          {t('notFound.back')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
