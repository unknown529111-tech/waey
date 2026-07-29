import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";
import { getQueueSize } from "@/lib/offlineQueue";
import { useT } from "@/contexts/useLanguage";

const OfflineIndicator = () => {
  const t = useT();
  const [offline, setOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );
  const [queueCount, setQueueCount] = useState(0);
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    const on = () => {
      setOffline(false);
      setQueueCount(0);
    };
    const off = () => setOffline(true);
    const onFlush = () => setQueueCount(0);

    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    window.addEventListener("waey-sync-flushed", onFlush as EventListener);

    let timer: number | undefined;
    if (offline) {
      timer = window.setInterval(() => setQueueCount(getQueueSize()), 2000);
    }

    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
      window.removeEventListener("waey-sync-flushed", onFlush as EventListener);
      if (timer) clearInterval(timer);
    };
  }, [offline]);

  if (isDev || !offline) return null;

  return (
    <div className="fixed bottom-20 left-4 z-50 flex items-center gap-2 bg-amber-600 text-white text-xs font-bold rounded-full px-3 py-1.5 shadow-lg animate-in fade-in">
      <WifiOff className="size-3.5" />
      <span>{t('offline.text')}</span>
      {queueCount > 0 && (
        <span className="bg-white/20 rounded-full px-1.5 py-0.5 text-[10px]">
          {t('offline.saved').replace('{count}', String(queueCount))}
        </span>
      )}
    </div>
  );
};

export default OfflineIndicator;
