import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AssistantFab from "./AssistantFab";
import BlobBackground from "./BlobBackground";
import { startNotificationScheduler, requestNotificationPermission } from "@/lib/notifications";
import { StreakDisplay } from "./StreakDisplay";

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    requestNotificationPermission();
    const stop = startNotificationScheduler();
    return stop;
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <BlobBackground count={3} className="z-0" />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
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
    </div>
  );
};

export default Layout;
