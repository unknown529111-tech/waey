import { useState } from "react";
import { Moon, Footprints, Recycle, Target, Brain, Sparkles, BarChart3, Database, Printer, Bell, Snowflake } from "lucide-react";
import { Link } from "react-router-dom";
import { useT, useLanguage } from "@/contexts/useLanguage";
import StreakBadge from "@/features/StreakBadge";
import DailyChallenge from "@/features/DailyChallenge";
import DailyQuote from "@/features/DailyQuote";
import WaterTracker from "@/features/WaterTracker";
import WeightTracker from "@/features/WeightTracker";
import ExpenseTracker from "@/features/ExpenseTracker";
import MoodTracker from "@/features/MoodTracker";
import SimpleTracker from "@/features/SimpleTracker";
import DailyBig3 from "@/features/DailyBig3";
import GratitudeJournal from "@/features/GratitudeJournal";
import MentalEnergy from "@/features/MentalEnergy";
import NightReview from "@/features/NightReview";
import DailyImpact from "@/features/DailyImpact";
import { BadgeShowcase } from "@/components/BadgeShowcase";
import { BackupModal } from "@/components/BackupModal";
import { ReportPrintModal } from "@/components/ReportPrintModal";
import { OnboardingModal } from "@/components/OnboardingModal";
import { WhatsNewModal } from "@/components/WhatsNewModal";
import { SEO } from "@/components/SEO";
import ExportButton from "@/components/ExportButton";
import NotificationSettings from "@/components/NotificationSettings";
import { useFreeze } from "@/features/useFreeze";
import { GoalSetting } from "@/features/GoalSetting";
import { DailyCheckIn } from "@/features/DailyCheckIn";
import { trackEvent } from "@/lib/analytics";
import { useEffect } from "react";
import { toast } from "sonner";

const Dashboard = () => {
  const t = useT();
  const { lang } = useLanguage();
  const [backupOpen, setBackupOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { freezes, freeze } = useFreeze();

  useEffect(() => {
    trackEvent("page_view", { page: "dashboard" });
  }, []);

  const todayStamp = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-EG', {
    weekday: "long",
    day: "numeric",
    month: "long",
    numberingSystem: lang === 'en' ? 'latn' : 'arab',
  });

  return (
    <div className="relative min-h-[60vh]">
      <SEO
        title={t('dash.seoTitle')}
        description={t('dash.seoDesc')}
      />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <header className="mb-8">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="eyebrow">{todayStamp}</span>
            <StreakBadge />
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-extrabold text-primary leading-tight">
                <span className={`rule-mark ${lang === 'ar' ? 'rule-mark-lower' : ''}`}>{t('dash.title')}</span>
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-10 max-w-xl">
                {t('dash.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setReportOpen(true)}
                className="btn btn-linen text-xs px-3.5 py-2"
                title={t('dash.printReport')}
              >
                <Printer className="size-3.5 text-primary" />
                {t('dash.pdfReport')}
              </button>
              <button
                onClick={() => setBackupOpen(true)}
                className="btn btn-linen text-xs px-3.5 py-2"
                title={t('dash.backupRestore')}
              >
                <Database className="size-3.5 text-primary" />
                {t('dash.backup')}
              </button>
              <ExportButton />
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="btn btn-linen text-xs px-3.5 py-2"
                title={t('dash.notifSettings')}
              >
                <Bell className="size-3.5 text-primary" />
                {t('dash.notifications')}
              </button>
              <button
                onClick={() => { freeze(); toast.success(t('dash.freezeToast')); }}
                className="btn btn-linen text-xs px-3.5 py-2"
                title={t('dash.freezeStreak')}
              >
                <Snowflake className="size-3.5 text-primary" />
                {t('dash.freezeCount').replace('{count}', freezes)}
              </button>
              <Link
                to="/insights"
                className="btn btn-moss text-sm px-4 py-2.5"
              >
                <BarChart3 className="size-4" />
                {t('dash.weeklyInsights')}
              </Link>
            </div>
          </div>
        </header>

        {/* Notification Settings */}
        {notifOpen && (
          <div className="mb-8">
            <NotificationSettings />
          </div>
        )}

        {/* Milestone Badges & Points Showcase */}
        <BadgeShowcase />

        <GoalSetting />

        <DailyCheckIn />

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <DailyChallenge />

            <div className="grid sm:grid-cols-2 gap-5">
              <DailyBig3 />
              <MentalEnergy />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <WaterTracker />
              <WeightTracker />
              <SimpleTracker
                storageKey="sleep"
                title={t('dash.sleep')}
                unit={t('dash.hour')}
                icon={Moon}
                color="text-indigo-500"
                step={0.5}
                goal={8}
                max={14}
              />
              <SimpleTracker
                storageKey="steps"
                title={t('dash.activity')}
                unit={t('dash.minute')}
                icon={Footprints}
                color="text-primary"
                step={5}
                goal={30}
                max={300}
              />
              <SimpleTracker
                storageKey="eco"
                title={t('dash.eco')}
                unit={t('dash.action')}
                icon={Recycle}
                color="text-primary"
                step={1}
                goal={3}
                max={20}
              />
            </div>

            <ExpenseTracker />

            <NightReview />
          </div>

          <aside className="space-y-5">
            <DailyQuote />
            <MoodTracker />
            <GratitudeJournal />
            <DailyImpact />
          </aside>
        </div>
      </div>

      <BackupModal open={backupOpen} onClose={() => setBackupOpen(false)} />
      <ReportPrintModal open={reportOpen} onClose={() => setReportOpen(false)} />
      <OnboardingModal />
      <WhatsNewModal />
    </div>
  );
};

export default Dashboard;

