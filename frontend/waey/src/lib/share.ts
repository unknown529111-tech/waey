import { todayKey, getDailyValue, getStreak } from "./dailyStorage";
import { getUserPoints, getUnlockedBadgeIds, BADGES } from "./gamification";
import type { jsPDF as JsPDFClass } from "jspdf";
import type { UserOptions as AutoTableOptions } from "jspdf-autotable";
import amiriRegularUrl from "@/assets/fonts/Amiri-Regular.ttf";
import amiriBoldUrl from "@/assets/fonts/Amiri-Bold.ttf";

interface AutoTableDoc extends JsPDFClass {
  autoTable: (options: AutoTableOptions) => AutoTableDoc;
  lastAutoTable: { finalY: number };
}

/* ------------------------------------------------------------------ */
/* PDF font pipeline (jsPDF has no Arabic glyphs in its built-in      */
/* fonts — the old helvetica output was mojibake). Amiri is embedded  */
/* (regular + bold); jsPDF's built-in Arabic parser + bidi engine     */
/* shape and reorder the text automatically on every doc.text().      */
/* ------------------------------------------------------------------ */

const PDF_FONT = "Amiri";
const PDF_FONT_REGULAR = "Amiri-Regular.ttf";
const PDF_FONT_BOLD = "Amiri-Bold.ttf";

/** jsPDF CDN fallback if the bundled font assets fail to fetch. */
const PDF_FONT_FALLBACK_BASE = "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/amiri/";

/** Emoji can't be embedded in the PDF font — strip them before drawing. */
const EMOJI_RE =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{2300}-\u{23FF}\u{25A0}-\u{25FF}\u{2B50}\u{1F1E6}-\u{1F1FF}]/gu;

function stripEmoji(text: string): string {
  return text.replace(EMOJI_RE, "").replace(/\uFE0F/g, "").replace(/[ \t]{2,}/g, " ").trim();
}

const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** Convert Western digits to Arabic-Indic when the surrounding label is Arabic. */
function toArabicDigits(value: number, label: string): string {
  const s = String(value);
  if (!/[\u0600-\u06FF]/.test(label)) return s;
  return s.replace(/\d/g, (d) => AR_DIGITS[Number(d)]);
}

function toBinaryString(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let out = "";
  for (let i = 0; i < bytes.length; i += 8192) {
    out += String.fromCharCode(...bytes.subarray(i, i + 8192));
  }
  return out;
}

let pdfFontsPromise: Promise<{ regular: string; bold: string }> | null = null;

async function fetchBinary(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.arrayBuffer();
}

async function loadPdfFonts(): Promise<{ regular: string; bold: string }> {
  if (!pdfFontsPromise) {
    pdfFontsPromise = (async () => {
      try {
        const [regular, bold] = await Promise.all([
          fetchBinary(amiriRegularUrl),
          fetchBinary(amiriBoldUrl),
        ]);
        return { regular: toBinaryString(regular), bold: toBinaryString(bold) };
      } catch (err) {
        // Fall back to the CDN copy before giving up.
        const [regular, bold] = await Promise.all([
          fetchBinary(`${PDF_FONT_FALLBACK_BASE}Amiri-Regular.ttf`),
          fetchBinary(`${PDF_FONT_FALLBACK_BASE}Amiri-Bold.ttf`),
        ]);
        return { regular: toBinaryString(regular), bold: toBinaryString(bold) };
      }
    })();
    // Allow a retry to re-fetch if the first attempt failed.
    pdfFontsPromise.catch(() => {
      pdfFontsPromise = null;
    });
  }
  return pdfFontsPromise;
}

async function createPdfDocument(): Promise<{
  doc: AutoTableDoc;
  table: (options: AutoTableOptions) => void;
}> {
  const { jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");
  const { regular, bold } = await loadPdfFonts();
  const doc = new jsPDF({ unit: "pt", format: "a4" }) as AutoTableDoc;
  doc.addFileToVFS(PDF_FONT_REGULAR, regular);
  doc.addFileToVFS(PDF_FONT_BOLD, bold);
  doc.addFont(PDF_FONT_REGULAR, PDF_FONT, "normal");
  doc.addFont(PDF_FONT_BOLD, PDF_FONT, "bold");
  doc.setFont(PDF_FONT);
  return {
    doc,
    table: (options) => {
      autoTable(doc, options);
    },
  };
}

/* ------------------------------------------------------------------ */

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

  const T = (key: string, fallback: string): string => (t ? t(key) : undefined) ?? fallback;

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

export async function generateReportPDF(t?: (key: string) => string): Promise<Blob> {
  const { doc, table } = await createPdfDocument();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  let y = margin;

  const T = (key: string, fallback: string): string => stripEmoji((t ? t(key) : undefined) ?? fallback);

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
  doc.text(`${T("share.streak", "السلسلة")}: ${streak.count} ${T("share.day", "يوم")}`, pageWidth - margin, y, { align: "right" });
  doc.text(`${T("share.points", "النقاط")}: ${points}`, margin, y);
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
    [
      `${toArabicDigits(waterCups, T("share.cups", "أكواب"))} ${T("share.cups", "أكواب")}`,
      T("share.water", "المياه"),
    ],
    [
      `${toArabicDigits(sleepHours, T("share.hours", "ساعات"))} ${T("share.hours", "ساعات")}`,
      T("share.sleep", "النوم"),
    ],
    [
      `${toArabicDigits(stepMinutes, T("share.minutes", "دقيقة"))} ${T("share.minutes", "دقيقة")}`,
      T("share.activity", "النشاط"),
    ],
    [moodScore ? `${moodScore}/5` : "—", T("share.mood", "المزاج")],
  ];

  table({
    startY: y,
    head: [[T("share.value", "القيمة"), T("share.indicator", "المؤشر")]],
    body: metrics,
    theme: "striped",
    styles: { fontSize: 11, cellPadding: 8, halign: "right", font: PDF_FONT },
    headStyles: { fillColor: [93, 112, 82], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [250, 250, 245] },
    margin: { left: margin, right: margin },
    tableWidth: "auto",
  });

  y = doc.lastAutoTable.finalY + 15;

  // Badges
  const unlockedIds = getUnlockedBadgeIds();
  const unlockedBadges = BADGES.filter((b) => unlockedIds.includes(b.id));

  doc.setFontSize(14);
  doc.setTextColor(60);
  doc.text(`${T("share.earnedBadges", "الأوسمة المكتسبة")}: ${unlockedBadges.length}`, margin, y);
  y += 15;

  if (unlockedBadges.length > 0) {
    const badgeData = unlockedBadges.map((b) => [
      b.description ?? "",
      stripEmoji(`${b.emoji} ${b.title}`),
    ]);
    table({
      startY: y,
      head: [[T("share.description", "الوصف"), T("share.badge", "الوسام")]],
      body: badgeData,
      theme: "striped",
      styles: { fontSize: 10, cellPadding: 6, halign: "right", font: PDF_FONT },
      headStyles: { fillColor: [193, 140, 93], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [255, 248, 240] },
      margin: { left: margin, right: margin },
      columnStyles: { 1: { fontStyle: "bold" } },
    });
    y = doc.lastAutoTable.finalY + 15;
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
  doc.text(T("share.reportFooter", "تم إنشاء هذا التقرير تلقائياً من منصة وعي لتتبع التطور الشخصي"), pageWidth / 2, y, { align: "center" });
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

export async function generateBadgesPDF(t?: (key: string) => string): Promise<Blob> {
  const { doc, table } = await createPdfDocument();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  let y = margin;

  const T = (key: string, fallback: string): string => stripEmoji((t ? t(key) : undefined) ?? fallback);

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
  doc.text(`${T("share.streak", "السلسلة")}: ${streak.count} ${T("share.day", "يوم")}`, pageWidth - margin, y, { align: "right" });
  doc.text(`${T("share.points", "النقاط")}: ${points}`, margin, y);
  y += 20;

  doc.setFontSize(14);
  doc.setTextColor(60);
  doc.text(`${T("share.openBadges", "الأوسمة المفتوحة")}: ${unlockedBadges.length} ${T("share.of", "من")} ${BADGES.length}`, margin, y);
  y += 15;

  if (unlockedBadges.length > 0) {
    const badgeData = unlockedBadges.map((b) => [
      b.description ?? "",
      stripEmoji(`${b.emoji} ${b.title}`),
    ]);
    table({
      startY: y,
      head: [[T("share.description", "الوصف"), T("share.badge", "الوسام")]],
      body: badgeData,
      theme: "striped",
      styles: { fontSize: 10, cellPadding: 6, halign: "right", font: PDF_FONT },
      headStyles: { fillColor: [193, 140, 93], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [255, 248, 240] },
      margin: { left: margin, right: margin },
      columnStyles: { 1: { fontStyle: "bold" } },
    });
    y = doc.lastAutoTable.finalY + 15;
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
  doc.text(T("share.badgesFooter", "تم إنشاء هذا التقرير من منصة وعي"), pageWidth / 2, y, { align: "center" });
  y += 12;
  doc.text(T("share.categories", "🌿 الصحة  •  💰  المال  •  🌱 البيئة  •  📚 التعليم"), pageWidth / 2, y, { align: "center" });
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

  const T = (key: string, fallback: string): string => (t ? t(key) : undefined) ?? fallback;

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
