const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/uploads/")) return `${API_BASE}${path}`;
  return `${API_BASE}${path}`;
};

export const exportToExcel = async (data, filename, sheetName = "Sheet1") => {
  const ExcelJS = await import("exceljs");
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(sheetName);
  
  if (data.length > 0) {
    ws.addRows(data);
  }
  
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
};

export const DownloadButton = ({ onClick, label = "Export", icon: Icon, small = true }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors ${
      small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
    }`}
  >
    {Icon && <Icon size={small ? 14 : 16} />}
    {label}
  </button>
);
