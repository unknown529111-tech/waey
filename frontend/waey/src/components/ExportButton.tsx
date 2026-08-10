import { Download } from "lucide-react";
import { useT } from "@/contexts/useLanguage";

const readAllData = () => {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith("waey_"));
  const data: Record<string, unknown> = {};
  keys.forEach((k) => {
    try {
      data[k] = JSON.parse(localStorage.getItem(k) || "");
    } catch {
      data[k] = localStorage.getItem(k);
    }
  });
  return data;
};

const ExportButton = () => {
  const t = useT();
  const handleExport = async () => {
    let Workbook: typeof import("exceljs").Workbook;
    try {
      ({ Workbook } = await import("exceljs"));
    } catch {
      return;
    }
    const all = readAllData();
    const wb = new Workbook();

    Object.entries(all).forEach(([key, value]) => {
      let rows: Record<string, unknown>[] = [];

      if (typeof value === "object" && value !== null) {
        if (Array.isArray(value)) {
          rows = value.map((item, i) => ({
            index: i + 1,
            ...(typeof item === "object" ? item : { value: item }),
          }));
        } else {
          const entries = Object.entries(value as Record<string, unknown>);
          if (entries.length > 0 && entries.every(([k]) => /^\d{4}-\d{2}-\d{2}$/.test(k))) {
            rows = entries.map(([date, val]) => ({ date, value: val }));
          } else {
            rows = entries.map(([k, v]) => ({
              key: k,
              value: typeof v === "object" ? JSON.stringify(v) : v,
            }));
          }
        }
      } else {
        rows = [{ key, value }];
      }

      const safeName = key.replace("waey_", "").slice(0, 31);
      const ws = wb.addWorksheet(safeName);
      const headers = Object.keys(rows[0] || {});
      ws.addRow(headers);
      rows.forEach((r) => ws.addRow(headers.map((h) => (r[h] === undefined || r[h] === null ? "" : r[h]))));
    });

    const buf = await wb.xlsx.writeBuffer();
    const blob = new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waey-data-${new Date().toISOString().slice(0, 10)}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-full px-4 py-2 hover:bg-primary/90 transition-colors"
    >
      <Download className="size-3.5" />
      <span>{t('export.label')}</span>
    </button>
  );
};

export default ExportButton;

