import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";

const OfflineIndicator = () => {
  const [offline, setOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed bottom-20 left-4 z-50 flex items-center gap-2 bg-amber-600 text-white text-xs font-bold rounded-full px-3 py-1.5 shadow-lg">
      <WifiOff className="size-3.5" />
      <span>لا يوجد اتصال بالإنترنت</span>
    </div>
  );
};

export default OfflineIndicator;
