import { Download } from "lucide-react";
import * as XLSX from "xlsx";

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
  const handleExport = () => {
    const all = readAllData();
    const wb = XLSX.utils.book_new();

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
      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, safeName);
    });

    XLSX.writeFile(wb, `waey-data-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-full px-4 py-2 hover:bg-primary/90 transition-colors"
    >
      <Download className="size-3.5" />
      <span>تصدير بياناتك (Excel)</span>
    </button>
  );
};

export default ExportButton;
