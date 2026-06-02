import { Moon, Footprints, Recycle, Target, Brain, Sparkles, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import StreakBadge from "@/features/StreakBadge";
import DailyChallenge from "@/features/DailyChallenge";
import DailyQuote from "@/features/DailyQuote";
import WaterTracker from "@/features/WaterTracker";
import ExpenseTracker from "@/features/ExpenseTracker";
import MoodTracker from "@/features/MoodTracker";
import SimpleTracker from "@/features/SimpleTracker";
import DailyBig3 from "@/features/DailyBig3";
import GratitudeJournal from "@/features/GratitudeJournal";
import MentalEnergy from "@/features/MentalEnergy";
import NightReview from "@/features/NightReview";
import DailyImpact from "@/features/DailyImpact";

const Dashboard = () => {
  return (
    <div className="relative min-h-[60vh]">
      <div className="absolute inset-0 bg-gradient-to-b from-leaf-light/40 via-background to-sun-warm/20 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            يومي في وعي
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            تابع عاداتك اليومية في الصحة والمال والبيئة.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StreakBadge />
          <Link
            to="/insights"
            className="inline-flex items-center gap-1.5 text-sm font-bold bg-secondary hover:bg-muted hover:text-foreground hover:scale-105 active:scale-95 transition-all duration-300 rounded-full px-4 py-2"
          >
            <BarChart3 className="size-4" />
            رؤى أسبوعية
          </Link>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <DailyChallenge />

          <div className="grid sm:grid-cols-2 gap-5">
            <DailyBig3 />
            <MentalEnergy />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <WaterTracker />
            <SimpleTracker
              storageKey="sleep"
              title="ساعات النوم"
              unit="ساعة"
              icon={Moon}
              color="text-indigo-500"
              step={0.5}
              goal={8}
              max={14}
            />
            <SimpleTracker
              storageKey="steps"
              title="نشاط بدني (دقيقة)"
              unit="دقيقة"
              icon={Footprints}
              color="text-primary"
              step={5}
              goal={30}
              max={300}
            />
            <SimpleTracker
              storageKey="eco"
              title="أفعال بيئية"
              unit="فعل"
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
    </div>
  );
};

export default Dashboard;
