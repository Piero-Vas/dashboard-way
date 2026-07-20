/**
 * Utilidad de exportación a CSV para tablas en el Dashboard.
 * Añade BOM UTF-8 (\uFEFF) para compatibilidad perfecta con Microsoft Excel.
 */

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  columns: { key: keyof T | string; label: string; transform?: (item: T) => any }[],
  filename: string
) {
  if (!data || !data.length) {
    alert("No hay datos disponibles para exportar.");
    return;
  }

  const headers = columns.map((col) => `"${col.label.replace(/"/g, '""')}"`).join(",");

  const rows = data.map((item) => {
    return columns
      .map((col) => {
        let value = col.transform ? col.transform(item) : item[col.key as keyof T];
        if (value === null || value === undefined) value = "";
        const stringVal = String(value).replace(/"/g, '""');
        return `"${stringVal}"`;
      })
      .join(",");
  });

  const csvContent = "\uFEFF" + [headers, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
