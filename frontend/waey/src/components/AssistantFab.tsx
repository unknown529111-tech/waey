import { Link, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguage";

const AssistantFab = () => {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  if (pathname === "/assistant") return null;

  return (
    <Link
      to="/assistant"
      aria-label={t('assistant.open')}
      className="fixed bottom-6 left-6 z-40 group"
    >
      <div className="absolute inset-0 rounded-full bg-primary/40 blur-xl group-hover:bg-primary/60 transition-all duration-500 animate-gentle-pulse" />
      <div className="relative size-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-float hover:shadow-float-lg hover:scale-105 active:scale-95 transition-all duration-300">
        <Sparkles className="size-6" />
      </div>
      <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none shadow-soft">
        {t('chat.title')}
      </span>
    </Link>
  );
};

export default AssistantFab;
