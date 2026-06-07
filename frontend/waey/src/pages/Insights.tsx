import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getDailyMap,
  getExpenses,
  getStreak,
  lastNDays,
} from "@/lib/dailyStorage";
import { Droplet, Moon, Wallet, Flame, Footprints, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useT } from "@/contexts/LanguageContext";

const dayLabel = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("ar-EG", { weekday: "short", day: "numeric" });
};

const COLORS = ["#5D7052", "#C18C5D", "#7BA98F", "#D4A656", "#8C7A6B", "#E6DCCD", "#9CC1A8"];

const Insights = () => {
  const t = useT();
  const days = lastNDays(7);

  const water = getDailyMap("water");
  const sleep = getDailyMap("sleep");
  const steps = getDailyMap("steps");
  const mood = getDailyMap("mood");
  const eco = getDailyMap("eco");

  const weekly = days.map((d) => ({
    day: dayLabel(d),
    iso: d,
    مياه: water[d] ?? 0,
    نوم: sleep[d] ?? 0,
    نشاط: steps[d] ?? 0,
    مزاج: mood[d] ?? 0,
    بيئة: eco[d] ?? 0,
  }));

  const expensesByDay = days.map((d) => {
    const list = getExpenses(d);
    return {
      day: dayLabel(d),
      المصروف: +list.reduce((s, e) => s + e.amount, 0).toFixed(2),
    };
  });

  const expensesByCategory = useMemo(() => {
    const byCat: Record<string, number> = {};
    days.forEach((d) => {
      getExpenses(d).forEach((e) => {
        byCat[e.category] = (byCat[e.category] ?? 0) + e.amount;
      });
    });
    return Object.entries(byCat)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value: +value.toFixed(2) }));
  }, [days]);

  const totals = useMemo(() => {
    let waterTotal = 0, sleepTotal = 0, expensesTotal = 0;
    days.forEach((d) => {
      waterTotal += water[d] ?? 0;
      sleepTotal += sleep[d] ?? 0;
      getExpenses(d).forEach((e) => { expensesTotal += e.amount; });
    });
    return { water: waterTotal, sleep: sleepTotal, expenses: expensesTotal };
  }, [days, sleep, water]);

  const streak = getStreak();

  const summary = useMemo(() => {
    const lines: string[] = [];
    const avgSleep = totals.sleep / 7;
    if (avgSleep < 6) lines.push("نومك قليل — حاول تنام بدري ربع ساعة كل يوم.");
    else if (avgSleep < 7) lines.push("نومك متوسط — كويس إنك قريب من المعدل الصحي.");
    else lines.push("نومك ممتاز — جسمك وعقلك بينعموا براحة كافية 👏");
    if (totals.water < 21) lines.push("مياهك أقل من الموصى به (3 لتر/يوم). جيب زجاجة معاك.");
    else lines.push("شرب مية كويس — مستمر في الترطيب 💧");
    return lines;
  }, [totals.sleep, totals.water]);

  const stat = (icon: JSX.Element, label: string, value: string) => (
    <div className="bg-card border border-[#DED8CF]/50 dark:border-border/50 rounded-[2rem] p-5 shadow-soft hover:-translate-y-0.5 hover:shadow-moss-lg transition-all duration-300">
      <div className="flex items-center gap-2 mb-1">
        <div className="size-8 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );

  return (
    <div className="relative min-h-[60vh]">
      <div className="absolute inset-0 bg-gradient-to-b from-leaf-light/40 via-background to-sun-warm/20 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-1">
            {t('insights.title')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('insights.subtitle')}
          </p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-bold bg-secondary hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95 transition-all duration-300 rounded-full px-4 py-2"
        >
          <ArrowRight className="size-4" />
          {t('insights.back')}
        </Link>
      </header>

      <div className="bg-gradient-to-l from-primary/10 via-card to-accent/10 border border-[#DED8CF]/50 dark:border-border/50 rounded-[2rem] p-6 shadow-soft">
        <div className="text-xs font-bold text-primary mb-2">{t('insights.report')}</div>
        <ul className="space-y-1.5 text-sm leading-relaxed">
          {summary.map((s, i) => (
            <li key={i}>• {s}</li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stat(<Droplet className="size-4 text-blue-500" />, "إجمالي المياه", `${totals.water} كوب`)}
        {stat(<Moon className="size-4 text-indigo-500" />, "إجمالي النوم", `${totals.sleep.toFixed(1)} س`)}
        {stat(<Wallet className="size-4 text-accent" />, "مصاريف الأسبوع", `${totals.expenses.toFixed(0)} ج`)}
        {stat(<Flame className="size-4 text-accent" />, "أيام متتالية", `${streak.count}`)}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-card border border-[#DED8CF]/50 dark:border-border/50 rounded-[2rem] p-6 shadow-soft">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Droplet className="size-4 text-blue-500" /> المياه (آخر 7 أيام)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Bar dataKey="مياه" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-[#DED8CF]/50 dark:border-border/50 rounded-[2rem] p-6 shadow-soft">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Wallet className="size-4 text-accent" /> المصاريف اليومية
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={expensesByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Line type="monotone" dataKey="المصروف" stroke="#C18C5D" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-[#DED8CF]/50 dark:border-border/50 rounded-[2rem] p-6 shadow-soft">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Moon className="size-4 text-indigo-500" /> النوم والمزاج
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Line type="monotone" dataKey="نوم" stroke="#6366F1" strokeWidth={2} />
              <Line type="monotone" dataKey="مزاج" stroke="#5D7052" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-[#DED8CF]/50 dark:border-border/50 rounded-[2rem] p-6 shadow-soft">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Wallet className="size-4 text-accent" /> توزيع المصاريف
          </h3>
          {expensesByCategory.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
              لا توجد مصاريف مسجلة هذا الأسبوع.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={expensesByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {expensesByCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-card border border-[#DED8CF]/50 dark:border-border/50 rounded-[2rem] p-6 shadow-soft lg:col-span-2">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Footprints className="size-4 text-primary" /> النشاط البدني والأفعال البيئية
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Bar dataKey="نشاط" fill="#5D7052" radius={[8, 8, 0, 0]} />
              <Bar dataKey="بيئة" fill="#C18C5D" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      </div>
    </div>
  );
};

export default Insights;
