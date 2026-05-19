import type { CsvExport } from "@/types/reports";

function escapeCsvCell(value: unknown) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function buildCsvExport(input: {
  fileName: string;
  rows: Array<Record<string, unknown>>;
}): CsvExport {
  const headers = Array.from(new Set(input.rows.flatMap((row) => Object.keys(row))));
  const lines = [
    headers.map(escapeCsvCell).join(","),
    ...input.rows.map((row) => headers.map((header) => escapeCsvCell(row[header])).join(",")),
  ];

  return {
    fileName: input.fileName,
    contentType: "text/csv",
    body: lines.join("\n"),
  };
}
