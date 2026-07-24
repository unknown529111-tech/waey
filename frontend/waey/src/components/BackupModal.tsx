import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Upload, ShieldCheck, AlertCircle, FileJson, CheckCircle2, X } from "lucide-react";
import { todayKey } from "@/lib/dailyStorage";

interface BackupModalProps {
  open: boolean;
  onClose: () => void;
}

export function BackupModal({ open, onClose }: BackupModalProps) {
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  // Export all waey_* keys from localStorage as a formatted JSON file
  const handleExport = () => {
    try {
      const backupData: Record<string, unknown> = {
        _version: 1,
        _exportedAt: new Date().toISOString(),
        _source: "Waey Platform",
        data: {},
      };

      const dataObj: Record<string, unknown> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("waey_") || key === "waey_streak")) {
          const val = localStorage.getItem(key);
          if (val !== null) {
            try {
              dataObj[key] = JSON.parse(val);
            } catch {
              dataObj[key] = val;
            }
          }
        }
      }

      backupData.data = dataObj;

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `waey_backup_${todayKey()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatus({ type: "success", message: "تم تحميل النسخة الاحتياطية بنجاح!" });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "تعذر تصدير النسخة الاحتياطية." });
    }
  };

  // Import JSON backup file into localStorage with validation
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (!parsed || typeof parsed !== "object" || !parsed.data || typeof parsed.data !== "object") {
          throw new Error("ملف النسخة الاحتياطية غير صالح.");
        }

        const data = parsed.data as Record<string, unknown>;
        let importedCount = 0;

        for (const [key, value] of Object.entries(data)) {
          if (key.startsWith("waey_") || key === "waey_streak") {
            const stringVal = typeof value === "string" ? value : JSON.stringify(value);
            localStorage.setItem(key, stringVal);
            importedCount++;
          }
        }

        setStatus({
          type: "success",
          message: `تمت استعادة ${importedCount} عنصر بنجاح! سيتم تحديث الصفحة.`,
        });

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        console.error(err);
        setStatus({
          type: "error",
          message: "صيغة الملف غير صحيحة أو غير مدعومة.",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        dir="rtl"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-card border border-border/50 rounded-[2rem] w-full max-w-md p-6 shadow-xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 border-b border-border/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <FileJson className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">النسخ الاحتياطي والاستعادة</h2>
                <p className="text-xs text-muted-foreground">احفظ بياناتك محلياً وقم باستعادتها في أي وقت</p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="إغلاق"
              className="size-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {/* Export Card */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  <Download className="size-4 text-primary" />
                  حفظ نسخة احتياطية (JSON)
                </h3>
                <p className="text-xs text-muted-foreground mt-1">تنزيل ملف يحتوي على كل تتبعاتك وسلسلتك</p>
              </div>
              <button
                onClick={handleExport}
                className="h-9 px-4 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shrink-0 shadow-sm"
              >
                تنزيل
              </button>
            </div>

            {/* Import Card */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  <Upload className="size-4 text-secondary" />
                  استعادة نسخة سابقة
                </h3>
                <p className="text-xs text-muted-foreground mt-1">رفع ملف JSON لاسترجاع التتبعات والإنجازات</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="h-9 px-4 rounded-full bg-secondary text-secondary-foreground text-xs font-bold hover:bg-secondary/90 transition-all shrink-0 shadow-sm"
              >
                رفع ملف
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportFile}
              />
            </div>
          </div>

          {/* Feedback message */}
          {status.message && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                status.type === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 className="size-4 shrink-0" />
              ) : (
                <AlertCircle className="size-4 shrink-0" />
              )}
              <span>{status.message}</span>
            </motion.div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
