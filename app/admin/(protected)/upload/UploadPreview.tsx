"use client";

import { useMemo, useState } from "react";
import * as XLSX from "xlsx";

type PreviewRow = Record<string, string | number | boolean | null>;

export default function UploadPreview() {
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [error, setError] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);

  const previewRows = useMemo(() => rows.slice(0, 10), [rows]);

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setError("");
    setRows([]);
    setHeaders([]);
    setFileName("");

    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      setError("Please upload a valid .xlsx file.");
      return;
    }

    try {
      setFileName(file.name);

      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });

      const firstSheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheetName];

      const json = XLSX.utils.sheet_to_json<PreviewRow>(sheet, {
        defval: "",
      });

      if (!json.length) {
        setError("The Excel file is empty.");
        return;
      }

      setRows(json);
      setHeaders(Object.keys(json[0] || {}));
    } catch {
      setError("Could not read the Excel file.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900">
          Upload .xlsx file
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Choose an Excel file to preview rows before importing.
        </p>

        <div className="mt-5">
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="block w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
          />
        </div>

        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-medium text-slate-800">Expected columns</p>
          <p className="mt-2">
            product_name, slug, description, affiliate_link, main_image_url,
            category_slug, price, is_featured, is_active
          </p>
        </div>

        {fileName && !error && (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Loaded file: <span className="font-medium">{fileName}</span>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {rows.length > 0 && (
        <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <p className="text-sm text-slate-500">
              Total rows found:{" "}
              <span className="font-medium text-slate-900">{rows.length}</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Showing first {Math.min(previewRows.length, 10)} rows
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse bg-white">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  {headers.map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {previewRows.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-100 align-top last:border-b-0"
                  >
                    {headers.map((header) => (
                      <td
                        key={header}
                        className="px-6 py-4 text-sm text-slate-700"
                      >
                        {String(row[header] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4">
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-6 py-3 text-sm font-medium text-slate-400"
              title="Import step comes next"
            >
              Import to Database
            </button>
          </div>
        </div>
      )}
    </div>
  );
}