import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Printer, FileText, Check, X, Shield, Award, Download, Share2, Loader2 } from "lucide-react";
import { todayKey, getDailyValue, getStreak } from "@/lib/dailyStorage";
import { getUserPoints, getUnlockedBadgeIds, BADGES } from "@/lib/gamification";
import { generateReportPDF, generateReportShareText, shareContent, downloadBlob } from "@/lib/share";
import { toast } from "sonner";

interface ReportPrintModalProps {
  open: boolean;
  onClose: () => void;
}

export function ReportPrintModal({ open, onClose }: ReportPrintModalProps) {
  const [exporting, setExporting] = useState<"pdf" | "share" | null>(null);

  if (!open) return null;

  const today = todayKey();
  const streak = getStreak();
  const points = getUserPoints();
  const unlockedIds = getUnlockedBadgeIds();
  const unlockedBadges = BADGES.filter((b) => unlockedIds.includes(b.id));

  const waterCups = getDailyValue("water");
  const sleepHours = getDailyValue("sleep");
  const stepMinutes = getDailyValue("steps");
  const moodScore = getDailyValue("mood");

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    setExporting("pdf");
    try {
      const blob = generateReportPDF();
      const dateStr = new Date().toISOString().split("T")[0];
      downloadBlob(blob, `waey-report-${dateStr}.pdf`);
      toast.success("تم تحميل التقرير كـ PDF");
    } catch (e) {
      console.error(e);
      toast.error("فشل إنشاء PDF");
    } finally {
      setExporting(null);
    }
  };

  const handleShare = async () => {
    setExporting("share");
    try {
      const text = generateReportShareText();
      const success = await shareContent({ title: "تقرير وعي اليومي", text });
      if (success) {
        toast.success("تم نسخ التقرير للمشاركة");
      } else {
        toast.error("تعذر المشاركة أو النسخ");
      }
    } catch (e) {
      console.error(e);
      toast.error("فشل المشاركة");
    } finally {
      setExporting(null);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[70] flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 pt-28 overflow-y-auto"
        dir="rtl"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-card border border-border/50 rounded-[2rem] w-full max-w-xl p-6 shadow-xl relative my-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Action buttons top (hidden on print) */}
          <div className="flex items-center justify-between mb-6 border-b border-border/40 pb-4 print:hidden">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">معاينة تقرير الإنجاز والتوازن</h2>
                <p className="text-xs text-muted-foreground">ملخص متابعاتك وحالتك للطباعة أو الحفظ كـ PDF أو المشاركة</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="size-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>

          {/* Printable Document Area */}
          <div className="space-y-6 bg-background p-6 rounded-2xl border border-border/40 text-right print:border-none print:p-0">
            {/* Report Header */}
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <h1 className="text-xl font-bold text-primary">وعي — تقرير الإنجاز اليومي</h1>
                <p className="text-xs text-muted-foreground">التاريخ: {today}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full">
                  🔥 سلسلة {streak.count} أيام
                </span>
              </div>
            </div>

            {/* Metrics Table */}
            <div>
              <h3 className="text-xs font-bold text-muted-foreground mb-3">مؤشرات الوعي والتوازن</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-muted/40 text-center">
                  <span className="text-xs text-muted-foreground block mb-1">المياه</span>
                  <span className="text-lg font-bold text-blue-500">{waterCups} أكواب</span>
                </div>
                <div className="p-3 rounded-2xl bg-muted/40 text-center">
                  <span className="text-xs text-muted-foreground block mb-1">النوم</span>
                  <span className="text-lg font-bold text-indigo-500">{sleepHours} ساعات</span>
                </div>
                <div className="p-3 rounded-2xl bg-muted/40 text-center">
                  <span className="text-xs text-muted-foreground block mb-1">النشاط</span>
                  <span className="text-lg font-bold text-emerald-500">{stepMinutes} دقيقة</span>
                </div>
                <div className="p-3 rounded-2xl bg-muted/40 text-center">
                  <span className="text-xs text-muted-foreground block mb-1">المزاج</span>
                  <span className="text-lg font-bold text-amber-500">{moodScore ? `${moodScore}/5` : "-"}</span>
                </div>
              </div>
            </div>

            {/* Earned Badges */}
            <div>
              <h3 className="text-xs font-bold text-muted-foreground mb-3">الأوسمة المكتسبة ({unlockedBadges.length})</h3>
              <div className="flex flex-wrap gap-2">
                {unlockedBadges.length === 0 ? (
                  <span className="text-xs text-muted-foreground">واصل التتبع لفتح الأوسمة!</span>
                ) : (
                  unlockedBadges.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-700 dark:text-amber-300"
                    >
                      <span>{b.emoji}</span>
                      <span>{b.title}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Summary Notes */}
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 text-xs leading-relaxed text-muted-foreground">
              تم استخراج هذا التقرير تلقائياً من منصة وعي لحفظ السجل اليومي وتتبع التطور الشخصي في الصحة والمال والبيئة.
            </div>
          </div>

          {/* Action buttons bottom (hidden on print) */}
          <div className="flex gap-3 mt-6 print:hidden">
            <button
              onClick={handleExportPDF}
              disabled={exporting !== null}
              className="flex-1 h-11 rounded-full bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {exporting === "pdf" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <Download className="size-4" />
                  تحميل PDF
                </>
              )}
            </button>
            <button
              onClick={handleShare}
              disabled={exporting !== null}
              className="flex-1 h-11 rounded-full bg-secondary text-secondary-foreground font-bold text-xs hover:bg-secondary/80 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {exporting === "share" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  جاري النسخ...
                </>
              ) : (
                <>
                  <Share2 className="size-4" />
                  مشاركة التقرير
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 h-11 rounded-full bg-muted text-muted-foreground font-bold text-xs hover:bg-muted/80 transition-all flex items-center justify-center gap-2"
            >
              <Printer className="size-4" />
              طباعة
            </button>
            <button
              onClick={onClose}
              className="h-11 px-6 rounded-full bg-muted/50 text-muted-foreground font-bold text-xs hover:bg-muted/80 transition-all"
            >
              إغلاق
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}