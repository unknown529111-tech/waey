import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";
import { getUserId, syncUserSettings } from "@/lib/supabaseStorage";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export function usePwaInstall() {
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);
}

export function PwaInstallPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem("waey_pwa_dismissed");
      if (dismissed) return;
    } catch { return; }
    const timer = setTimeout(() => {
      if (deferredPrompt) setVisible(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      try { localStorage.setItem("waey_pwa_installed", "true"); } catch { /* ignore */ }
    }
    deferredPrompt = null;
    setVisible(false);
    const uid = getUserId();
    if (uid) syncUserSettings(uid);
  };

  const handleDismiss = () => {
    try { localStorage.setItem("waey_pwa_dismissed", "true"); } catch { /* ignore */ }
    setVisible(false);
    const uid = getUserId();
    if (uid) syncUserSettings(uid);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 left-4 z-[60] max-w-xs w-full bg-card border border-border rounded-3xl p-4 shadow-float-lg"
          dir="rtl"
        >
          <button
            onClick={handleDismiss}
            aria-label="إغلاق"
            className="absolute -top-2 -right-2 size-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <X className="size-3.5" />
          </button>
          <div className="flex items-start gap-3 mb-3">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Download className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold">ثبّت تطبيق وعي</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">حمّل وعي على جهازك واستخدمها في أي وقت حتى من غير نت.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 h-9 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all"
            >
              تثبيت
            </button>
            <button
              onClick={handleDismiss}
              className="h-9 px-4 rounded-full bg-muted text-muted-foreground text-xs font-bold hover:bg-muted/80 transition-all"
            >
              لاحقاً
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}