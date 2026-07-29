import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AssistantFab from "./AssistantFab";
import BlobBackground from "./BlobBackground";
import OfflineIndicator from "./OfflineIndicator";
import { PwaInstallPrompt } from "./PwaInstallPrompt";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { EmergencyAccess } from "./EmergencyAccess";
import { startNotificationScheduler, requestNotificationPermission, setNotifT } from "@/lib/notifications";
import { setSWToastTexts } from "@/lib/swRegister";
import { StreakDisplay } from "./StreakDisplay";
import { initOfflineSync } from "@/lib/offlineQueue";
import { useLanguage } from "@/contexts/useLanguage";

const Layout = () => {
  const location = useLocation();
  const { t } = useLanguage();

  usePwaInstall();

  useEffect(() => {
    setNotifT(t);
    setSWToastTexts({
      title: t("swUpdate.title"),
      desc: t("swUpdate.desc"),
      btn: t("swUpdate.btn"),
    });
    requestNotificationPermission();
    const stop = startNotificationScheduler();
    return stop;
  }, [t]);

  useEffect(() => {
    const cleanup = initOfflineSync();
    return cleanup;
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Accessibility Skip to Main Content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-full focus:font-bold focus:shadow-lg transition-all"
      >
        {t('layout.skipToContent')}
      </a>

      <BlobBackground count={3} className="z-0" />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          id="main-content"
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative z-10 flex-1 pt-16"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <AssistantFab />
      <StreakDisplay />
      <OfflineIndicator />
      <PwaInstallPrompt />
      <EmergencyAccess />
    </div>
  );
};

export default Layout;

