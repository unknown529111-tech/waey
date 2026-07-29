import { todayKey, getDailyValue, getStreak } from "./dailyStorage";
import { getUserPoints, getUnlockedBadgeIds, BADGES } from "./gamification";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface AutoTableOptions {
  startY?: number;
  head?: string[][];
  body?: string[][];
  theme?: string;
  styles?: Record<string, unknown>;
  headStyles?: Record<string, unknown>;
  alternateRowStyles?: Record<string, unknown>;
  margin?: Record<string, unknown>;
  tableWidth?: string;
  columnStyles?: Record<string, unknown>;
}

interface AutoTableDoc extends jsPDF {
  autoTable: (options: AutoTableOptions) => AutoTableDoc;
  lastAutoTable: { finalY: number };
}

export function generateReportShareText(t?: (key: string) => string): string {
  const today = todayKey();
  const streak = getStreak();
  const points = getUserPoints();
  const unlockedIds = getUnlockedBadgeIds();
  const unlockedBadges = BADGES.filter((b) => unlockedIds.includes(b.id));

  const waterCups = getDailyValue("water");
  const sleepHours = getDailyValue("sleep");
  const stepMinutes = getDailyValue("steps");
  const moodScore = getDailyValue("mood");

  const T = (key: string, fallback: string): string => (t ? t(key) : fallback);

  const lines: string[] = [
    `📊 ${T("share.reportTitle", "تقرير وعي اليومي")}`,
    `📅 ${T("share.date", "التاريخ")}: ${today}`,
    `🔥 ${T("share.streak", "السلسلة")}: ${streak.count} ${T("share.day", "يوم/أيام")}`,
    `⭐ ${T("share.points", "النقاط")}: ${points}`,
    "",
    `📈 ${T("share.metrics", "المؤشرات")}:`,
    `💧 ${T("share.water", "المياه")}: ${waterCups} ${T("share.cups", "أكواب")}`,
    `😴 ${T("share.sleep", "النوم")}: ${sleepHours} ${T("share.hours", "ساعات")}`,
    `🚶 ${T("share.activity", "النشاط")}: ${stepMinutes} ${T("share.minutes", "دقيقة")}`,
    `😊 ${T("share.mood", "المزاج")}: ${moodScore ? `${moodScore}/5` : "—"}`,
    "",
    `${T("share.badges", "الأوسمة")} (${unlockedBadges.length}):`,
    ...unlockedBadges.map((b) => `  ${b.emoji} ${b.title}`),
    "",
    "—",
    `${T("share.fromPlatform", "من منصة وعي (Waey)")} 🌿💰🌱📚`,
    "https://waey-m7.com",
  ];

  return lines.join("\n");
}

export function generateReportPDF(t?: (key: string) => string): Blob {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  let y = margin;

  const T = (key: string, fallback: string): string => (t ? t(key) : fallback);

  // Arabic font setup - use built-in font
  doc.setFont("helvetica");

  // Title
  doc.setFontSize(24);
  doc.setTextColor(93, 112, 82); // Primary green
  doc.text(T("share.pdfTitle", "وعي — تقرير الإنجاز اليومي"), pageWidth / 2, y, { align: "center" });
  y += 10;

  // Date
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`${T("share.date", "التاريخ")}: ${todayKey()}`, pageWidth / 2, y, { align: "center" });
  y += 20;

  // Divider
  doc.setDrawColor(200);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;

  // Streak & Points
  const streak = getStreak();
  const points = getUserPoints();
  doc.setFontSize(12);
  doc.setTextColor(193, 140, 93); // Amber
  doc.text(`🔥 ${T("share.streak", "السلسلة")}: ${streak.count} ${T("share.day", "يوم")}`, margin, y);
  doc.text(`⭐ ${T("share.points", "النقاط")}: ${points}`, pageWidth - margin, y, { align: "right" });
  y += 20;

  // Metrics table
  const waterCups = getDailyValue("water");
  const sleepHours = getDailyValue("sleep");
  const stepMinutes = getDailyValue("steps");
  const moodScore = getDailyValue("mood");

  doc.setFontSize(14);
  doc.setTextColor(60);
  doc.text(T("share.metricsTitle", "مؤشرات الوعي والتوازن"), margin, y);
  y += 15;

  const metrics = [
    ["💧 " + T("share.water", "المياه"), `${waterCups} ${T("share.cups", "أكواب")}`],
    ["😴 " + T("share.sleep", "النوم"), `${sleepHours} ${T("share.hours", "ساعات")}`],
    ["🚶 " + T("share.activity", "النشاط"), `${stepMinutes} ${T("share.minutes", "دقيقة")}`],
    ["😊 " + T("share.mood", "المزاج"), moodScore ? `${moodScore}/5` : "—"],
  ];

  (doc as AutoTableDoc).autoTable({
    startY: y,
    head: [[T("share.indicator", "المؤشر"), T("share.value", "القيمة")]],
    body: metrics,
    theme: "striped",
    styles: { fontSize: 11, cellPadding: 8, halign: "right" },
    headStyles: { fillColor: [93, 112, 82], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [250, 250, 245] },
    margin: { left: margin, right: margin },
    tableWidth: "auto",
  });

  y = (doc as AutoTableDoc).lastAutoTable.finalY + 15;

  // Badges
  const unlockedIds = getUnlockedBadgeIds();
  const unlockedBadges = BADGES.filter((b) => unlockedIds.includes(b.id));

  doc.setFontSize(14);
  doc.setTextColor(60);
  doc.text(`${T("share.earnedBadges", "الأوسمة المكتسبة")} (${unlockedBadges.length})`, margin, y);
  y += 15;

  if (unlockedBadges.length > 0) {
    const badgeData = unlockedBadges.map((b) => [`${b.emoji} ${b.title}`, b.description]);
    (doc as AutoTableDoc).autoTable({
      startY: y,
      head: [[T("share.badge", "الوسام"), T("share.description", "الوصف")]],
      body: badgeData,
      theme: "striped",
      styles: { fontSize: 10, cellPadding: 6, halign: "right" },
      headStyles: { fillColor: [193, 140, 93], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [255, 248, 240] },
      margin: { left: margin, right: margin },
      columnStyles: { 0: { fontStyle: "bold" } },
    });
    y = (doc as AutoTableDoc).lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(T("share.keepTracking", "واصل التتبع لفتح الأوسمة!"), margin, y);
    y += 15;
  }

  // Footer
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(T("share.reportFooter", "تم إنشاء هذا التقرير تلقائياً من منصة وعي (Waey) لتتبع التطور الشخصي"), pageWidth / 2, y, { align: "center" });
  y += 12;
  doc.text(T("share.categories", "🌿 الصحة  •  💰 المال  •  🌱 البيئة  •  📚 التعليم"), pageWidth / 2, y, { align: "center" });
  y += 12;
  doc.setTextColor(93, 112, 82);
  doc.text("https://waey-m7.com", pageWidth / 2, y, { align: "center" });

  return doc.output("blob");
}

export async function shareContent(data: { title?: string; text: string; url?: string }): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return true;
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        console.warn("Share cancelled or failed:", e);
      }
    }
  }
  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(data.text);
    return true;
  } catch {
    return false;
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateBadgesPDF(t?: (key: string) => string): Blob {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  let y = margin;

  const T = (key: string, fallback: string): string => (t ? t(key) : fallback);

  doc.setFont("helvetica");

  doc.setFontSize(24);
  doc.setTextColor(93, 112, 82);
  doc.text(T("share.badgesTitle", "🏆 إنجازاتي في وعي"), pageWidth / 2, y, { align: "center" });
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`${T("share.date", "التاريخ")}: ${todayKey()}`, pageWidth / 2, y, { align: "center" });
  y += 20;

  doc.setDrawColor(200);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 15;

  const unlockedIds = getUnlockedBadgeIds();
  const unlockedBadges = BADGES.filter((b) => unlockedIds.includes(b.id));
  const streak = getStreak();
  const points = getUserPoints();

  doc.setFontSize(12);
  doc.setTextColor(193, 140, 93);
  doc.text(`🔥 ${T("share.streak", "السلسلة")}: ${streak.count} ${T("share.day", "يوم")}`, margin, y);
  doc.text(`⭐ ${T("share.points", "النقاط")}: ${points}`, pageWidth - margin, y, { align: "right" });
  y += 20;

  doc.setFontSize(14);
  doc.setTextColor(60);
  doc.text(`${T("share.openBadges", "الأوسمة المفتوحة")} (${unlockedBadges.length} ${T("share.of", "من")} ${BADGES.length})`, margin, y);
  y += 15;

  if (unlockedBadges.length > 0) {
    const badgeData = unlockedBadges.map((b) => [`${b.emoji} ${b.title}`, b.description]);
    (doc as AutoTableDoc).autoTable({
      startY: y,
      head: [[T("share.badge", "الوسام"), T("share.description", "الوصف")]],
      body: badgeData,
      theme: "striped",
      styles: { fontSize: 10, cellPadding: 6, halign: "right" },
      headStyles: { fillColor: [193, 140, 93], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [255, 248, 240] },
      margin: { left: margin, right: margin },
      columnStyles: { 0: { fontStyle: "bold" } },
    });
    y = (doc as AutoTableDoc).lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(T("share.keepTracking", "واصل التتبع لفتح الأوسمة!"), pageWidth / 2, y, { align: "center" });
    y += 15;
  }

  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(T("share.badgesFooter", "تم إنشاء هذا التقرير من منصة وعي (Waey)"), pageWidth / 2, y, { align: "center" });
  y += 12;
  doc.text(T("share.categories", "🌿 الصحة  •  💰 المال  •  🌱 البيئة  •  📚 التعليم"), pageWidth / 2, y, { align: "center" });
  y += 12;
  doc.setTextColor(93, 112, 82);
  doc.text("https://waey-m7.com", pageWidth / 2, y, { align: "center" });

  return doc.output("blob");
}

export function generateAchievementsShareText(t?: (key: string) => string): string {
  const unlockedIds = getUnlockedBadgeIds();
  const unlockedBadges = BADGES.filter((b) => unlockedIds.includes(b.id));
  const streak = getStreak();
  const points = getUserPoints();

  const T = (key: string, fallback: string): string => (t ? t(key) : fallback);

  const lines: string[] = [
    `🏆 ${T("share.achievementsTitle", "إنجازاتي في منصة وعي")}`,
    `🔥 ${T("share.currentStreak", "السلسلة الحالية")}: ${streak.count} ${T("share.day", "يوم")}`,
    `⭐ ${T("share.totalPoints", "إجمالي النقاط")}: ${points}`,
    `🏅 ${T("share.openBadges", "الأوسمة المفتوحة")}: ${unlockedBadges.length} ${T("share.of", "من")} ${BADGES.length}`,
    "",
    ...unlockedBadges.map((b, i) => `${i + 1}. ${b.emoji} ${b.title} — ${b.description}`),
    "",
    T("share.joinMe", "انضم إليّ في رحلة الوعي والتوازن!"),
    "🌿💰🌱📚",
    "https://waey-m7.com",
  ];

  return lines.join("\n");
}