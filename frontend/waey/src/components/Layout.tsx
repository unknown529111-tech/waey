import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AssistantFab from "./AssistantFab";
import BlobBackground from "./BlobBackground";
import OfflineIndicator from "./OfflineIndicator";
import { PwaInstallPrompt, usePwaInstall } from "./PwaInstallPrompt";
import { EmergencyAccess } from "./EmergencyAccess";
import { startNotificationScheduler, requestNotificationPermission } from "@/lib/notifications";
import { StreakDisplay } from "./StreakDisplay";
import { initOfflineSync } from "@/lib/offlineQueue";

const Layout = () => {
  const location = useLocation();

  usePwaInstall();

  useEffect(() => {
    requestNotificationPermission();
    const stop = startNotificationScheduler();
    return stop;
  }, []);

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
        الانتقال إلى المحتوى الرئيسي
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
          className="relative z-10 flex-1"
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

