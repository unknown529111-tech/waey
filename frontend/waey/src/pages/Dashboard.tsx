import { useState } from "react";
import { Moon, Footprints, Recycle, Target, Brain, Sparkles, BarChart3, Database, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import { useT } from "@/contexts/useLanguage";
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
import { GoalSetting } from "@/features/GoalSetting";
import { trackEvent } from "@/lib/analytics";
import { useEffect } from "react";

const Dashboard = () => {
  const t = useT();
  const [backupOpen, setBackupOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    trackEvent("page_view", { page: "dashboard" });
  }, []);

  return (
    <div className="relative min-h-[60vh]">
      <SEO
        title="متابعتي اليومية — وعي"
        description="لوحة متابعة المؤشرات اليومية للمياه، النوم، النشاط، الحالة النفسية، والمصروفات."
      />
      <div className="absolute inset-0 bg-gradient-to-b from-leaf-light/40 via-background to-sun-warm/20 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              {t('dash.title')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t('dash.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setReportOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-muted hover:bg-muted/80 hover:scale-105 active:scale-95 transition-all duration-300 rounded-full px-3.5 py-2 text-muted-foreground"
              title="طباعة التقرير / PDF"
            >
              <Printer className="size-3.5 text-primary" />
              تقرير PDF
            </button>
            <button
              onClick={() => setBackupOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-muted hover:bg-muted/80 hover:scale-105 active:scale-95 transition-all duration-300 rounded-full px-3.5 py-2 text-muted-foreground"
              title="نسخ احتياطي واستعادة"
            >
              <Database className="size-3.5 text-primary" />
              نسخ واستعادة
            </button>
            <Link
              to="/insights"
              className="inline-flex items-center gap-1.5 text-sm font-bold bg-secondary hover:bg-muted hover:text-foreground hover:scale-105 active:scale-95 transition-all duration-300 rounded-full px-4 py-2"
            >
              <BarChart3 className="size-4" />
              {t('dash.weeklyInsights')}
            </Link>
          </div>
        </header>

        {/* Milestone Badges & Points Showcase */}
        <BadgeShowcase />

        <GoalSetting />

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

