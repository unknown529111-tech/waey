import { useEffect, useMemo } from "react";
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
import NextField from "@/components/NextField";
import PageHero from "@/components/primitives/PageHero";
import SectionHeading from "@/components/primitives/SectionHeading";
import StatBand from "@/components/primitives/StatBand";
import { useLanguage, useT } from "@/contexts/useLanguage";
import { trackEvent } from "@/lib/analytics";
import { getDailyMap, getExpenses, getStreak, lastNDays } from "@/lib/dailyStorage";
import "./Insights.css";

// Charts read the field-accent tokens so they reskin with the theme (var() resolves in SVG attrs).
const fieldColor = (name: string) => `hsl(var(--field-${name}))`;

const COLORS = [
  fieldColor("finance"),
  fieldColor("health"),
  fieldColor("environment"),
  fieldColor("education"),
  fieldColor("current"),
  fieldColor("finance-soft"),
  fieldColor("health-soft"),
];

// The stored category id is not a label — the pie chart reads the house key
// and falls back to the raw id for a category the app does not know yet.
const EXPENSE_CATEGORY_KEY: Record<string, string> = {
  food: "tracker.expense.cat.food",
  transport: "tracker.expense.cat.transport",
  bills: "tracker.expense.cat.bills",
  health: "tracker.expense.cat.health",
  entertainment: "tracker.expense.cat.entertainment",
  other: "tracker.expense.cat.other",
};

const SHELL = "mx-auto w-full max-w-[80rem] px-6";

const Insights = () => {
  const t = useT();
  const { lang } = useLanguage();
  const locale = lang === "ar" ? "ar-EG" : "en-US";

  useEffect(() => {
    trackEvent("page_view", { page: "insights" });
  }, []);

  const dayLabel = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(locale, { weekday: "short", day: "numeric" });
  };

  // The window line names the days, not the weekday — midday avoids a UTC shift.
  const rangeLabel = (iso: string) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
    });

  const days = lastNDays(7);

  const water = getDailyMap("water");
  const sleep = getDailyMap("sleep");
  const steps = getDailyMap("steps");
  const mood = getDailyMap("mood");
  const eco = getDailyMap("eco");

  const weekly = days.map((d) => ({
    day: dayLabel(d),
    iso: d,
    water: water[d] ?? 0,
    sleep: sleep[d] ?? 0,
    steps: steps[d] ?? 0,
    mood: mood[d] ?? 0,
    eco: eco[d] ?? 0,
  }));

  const expensesByDay = days.map((d) => {
    const list = getExpenses(d);
    return {
      day: dayLabel(d),
      expenses: +list.reduce((s, e) => s + e.amount, 0).toFixed(2),
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
      .map(([id, value]) => ({
        name: EXPENSE_CATEGORY_KEY[id] ? t(EXPENSE_CATEGORY_KEY[id]) : id,
        value: +value.toFixed(2),
      }));
  }, [days, t]);

  const totals = useMemo(() => {
    let waterTotal = 0,
      sleepTotal = 0,
      expensesTotal = 0;
    days.forEach((d) => {
      waterTotal += water[d] ?? 0;
      sleepTotal += sleep[d] ?? 0;
      getExpenses(d).forEach((e) => {
        expensesTotal += e.amount;
      });
    });
    return { water: waterTotal, sleep: sleepTotal, expenses: expensesTotal };
  }, [days, sleep, water]);

  const streak = getStreak();

  const summary = useMemo(() => {
    const lines: string[] = [];
    const avgSleep = totals.sleep / 7;
    if (avgSleep < 6) lines.push(t("insights.sleep.low"));
    else if (avgSleep < 7) lines.push(t("insights.sleep.medium"));
    else lines.push(t("insights.sleep.good"));
    if (totals.water < 21) lines.push(t("insights.water.low"));
    else lines.push(t("insights.water.good"));
    return lines;
  }, [totals.sleep, totals.water, t]);

  /* A chart is a picture, and a screen reader cannot read one. Each chart
     therefore carries a text description built from the same numbers it
     draws, and the drawing itself is hidden from the accessibility tree so
     the description is what gets announced. The numbers come from the same
     arrays the chart is given — nothing here is typed by hand. */
  const chartAlt = (
    title: string,
    series: { label: string; values: (string | number)[] }[],
  ) =>
    t("insights.alt.summary", {
      title,
      data: series
        .map((s) =>
          t("insights.alt.format", {
            label: s.label,
            value: s.values.join(" · "),
          }),
        )
        .join(" · "),
    });

  const weekPairs = (pick: (d: (typeof weekly)[number]) => string | number) =>
    weekly.map((d) => `${d.day} ${pick(d)}`);

  const waterAlt = chartAlt(t("insights.waterChart"), [
    { label: t("insights.alt.water"), values: weekPairs((d) => d.water) },
  ]);

  const expensesAlt = chartAlt(t("insights.expensesChart"), [
    {
      label: t("insights.alt.expenses"),
      values: expensesByDay.map((d) => `${d.day} ${d.expenses}`),
    },
  ]);

  const sleepAlt = chartAlt(t("insights.sleepChart"), [
    { label: t("insights.alt.sleep"), values: weekPairs((d) => d.sleep) },
    { label: t("insights.alt.mood"), values: weekPairs((d) => d.mood) },
  ]);

  const distributionAlt =
    expensesByCategory.length === 0
      ? t("insights.alt.summary", {
          title: t("insights.expenseDistribution"),
          data: t("insights.noExpenses"),
        })
      : chartAlt(t("insights.expenseDistribution"), [
          {
            label: t("insights.alt.distribution"),
            values: expensesByCategory.map((c) => `${c.name} ${c.value}`),
          },
        ]);

  const activityAlt = chartAlt(t("insights.dailyActivity"), [
    { label: t("insights.alt.steps"), values: weekPairs((d) => d.steps) },
    { label: t("insights.alt.eco"), values: weekPairs((d) => d.eco) },
  ]);

  return (
    <div className="insights" dir={lang === "ar" ? "rtl" : "ltr"}>
      <PageHero
        eyebrow={t("insights.eyebrow")}
        title={t("insights.title")}
        lead={t("insights.subtitle")}
        primaryAction={{ label: t("insights.back"), to: "/dashboard" }}
      />

      {/* ═══════════ THE WEEK IN ONE BREATH ═══════════ */}
      <section className={SHELL} aria-label={t("insights.report")}>
        <SectionHeading
          eyebrow={t("insights.report.eyebrow")}
          title={t("insights.report")}
          lead={t("insights.report.lead")}
        />

        <div className="ins-report mt-8">
          <p className="ins-report-range mono-label">
            {t("insights.report.range", {
              from: rangeLabel(days[0]),
              to: rangeLabel(days[days.length - 1]),
            })}
          </p>
          {summary.map((line, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "ins-report-lead font-display"
                  : "ins-report-line font-display"
              }
            >
              {line}
            </p>
          ))}
        </div>
      </section>

      {/* ═══════════ THE FOUR NUMBERS ═══════════ */}
      <div className="mt-14">
        <StatBand
          items={[
            { value: String(totals.water), label: t("insights.stat.water") },
            { value: totals.sleep.toFixed(1), label: t("insights.stat.sleep") },
            { value: totals.expenses.toFixed(0), label: t("insights.stat.expenses") },
            { value: String(streak.count), label: t("insights.stat.streak") },
          ]}
        />
      </div>

      {/* ═══════════ THE CHARTS ═══════════ */}
      <section className={`${SHELL} mt-14`} aria-label={t("insights.charts.title")}>
        <SectionHeading
          eyebrow={t("insights.charts.eyebrow")}
          title={t("insights.charts.title")}
          lead={t("insights.charts.lead")}
        />

        <div className="ins-grid mt-8">
          <article className="ins-chart">
            <SectionHeading title={t("insights.waterChart")} />
            <figure className="ins-figure">
              <div className="ins-chart-plot" aria-hidden="true">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={weekly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="water" fill={fieldColor("current")} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <figcaption className="sr-only">{waterAlt}</figcaption>
            </figure>
          </article>

          <article className="ins-chart">
            <SectionHeading title={t("insights.expensesChart")} />
            <figure className="ins-figure">
              <div className="ins-chart-plot" aria-hidden="true">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={expensesByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke={fieldColor("finance")}
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <figcaption className="sr-only">{expensesAlt}</figcaption>
            </figure>
          </article>

          <article className="ins-chart">
            <SectionHeading title={t("insights.sleepChart")} />
            <figure className="ins-figure">
              <div className="ins-chart-plot" aria-hidden="true">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={weekly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="sleep"
                      stroke={fieldColor("education")}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke={fieldColor("health")}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <figcaption className="sr-only">{sleepAlt}</figcaption>
            </figure>
          </article>

          <article className="ins-chart">
            <SectionHeading title={t("insights.expenseDistribution")} />
            <figure className="ins-figure">
              {/* The empty state is text, so it stays readable — only the
                  drawing itself is hidden from the accessibility tree. */}
              <div className="ins-chart-plot">
                {expensesByCategory.length === 0 ? (
                  <p className="ins-chart-empty font-body">{t("insights.noExpenses")}</p>
                ) : (
                  <div aria-hidden="true">
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={expensesByCategory}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {expensesByCategory.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
              <figcaption className="sr-only">{distributionAlt}</figcaption>
            </figure>
          </article>

          <article className="ins-chart ins-chart-wide">
            <SectionHeading title={t("insights.dailyActivity")} />
            <figure className="ins-figure">
              <div className="ins-chart-plot" aria-hidden="true">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={weekly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" fontSize={11} />
                    {/* Steps and eco actions live on different scales — a few
                        thousand against a few — so the eco series gets its own
                        axis. On a shared one it was drawn as a flat sliver
                        against the bottom of the chart and was, in practice,
                        invisible. */}
                    <YAxis
                      yAxisId="left"
                      fontSize={11}
                      label={{
                        value: t("insights.alt.steps"),
                        angle: -90,
                        position: "insideLeft",
                        style: { fontSize: 10, fill: "hsl(var(--muted-foreground))" },
                      }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      fontSize={11}
                      label={{
                        value: t("insights.alt.eco"),
                        angle: 90,
                        position: "insideRight",
                        style: { fontSize: 10, fill: "hsl(var(--muted-foreground))" },
                      }}
                    />
                    <Tooltip />
                    <Bar
                      yAxisId="left"
                      dataKey="steps"
                      fill={fieldColor("health")}
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="eco"
                      fill={fieldColor("environment")}
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <figcaption className="sr-only">{activityAlt}</figcaption>
            </figure>
          </article>
        </div>
      </section>

      {/* ═══════════ WHERE NEXT ═══════════ */}
      <section className={`${SHELL} mt-14 pb-20`} aria-label={t("insights.cta.title")}>
        <div className="ins-cta">
          <p className="eyebrow">{t("insights.cta.eyebrow")}</p>
          <h2 className="font-display ins-cta-title">{t("insights.cta.title")}</h2>
          <p className="font-body ins-cta-body">{t("insights.cta.body")}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <NextField to="finance" toRoute="/finance" label={t("field.next.health")} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Insights;
