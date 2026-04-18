"use client";

import { useRef, useState } from "react";
import {
  Upload,
  FileText,
  Download,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { parseBatchCsv } from "@/engine/export/batch-export";
import type { BatchItem } from "@/engine/export/batch-export";

type Format = "svg" | "png";

interface JobResult {
  successCount: number;
  failCount: number;
  zipUrl: string;
}

const CSV_TEMPLATE = `data,type,filename
5901234123457,EAN-13,product-001
012345678905,UPC-A,product-002
SCANVAS-001,CODE-128,product-003
https://scanvas.studio,QR,qr-001
`;

export function BatchStudio() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<BatchItem[]>([]);
  const [csvText, setCsvText] = useState("");
  const [formats, setFormats] = useState<Format[]>(["svg"]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCsvText(text);
      setItems(parseBatchCsv(text));
      setResult(null);
      setError(null);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith(".csv") || file?.type === "text/csv") handleFile(file);
  };

  const handleTextChange = (text: string) => {
    setCsvText(text);
    setItems(parseBatchCsv(text));
    setResult(null);
    setError(null);
  };

  const toggleFormat = (fmt: Format) => {
    setFormats((prev) =>
      prev.includes(fmt) ? prev.filter((f) => f !== fmt) : [...prev, fmt]
    );
  };

  const generate = async () => {
    if (items.length === 0 || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/v1/batch/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, formats }),
      });

      if (!res.ok) {
        const json = await res.json() as { error?: string };
        throw new Error(json.error ?? "Batch generation failed");
      }

      const blob = await res.blob();
      const zipUrl = URL.createObjectURL(blob);
      const successCount = Number(res.headers.get("X-Batch-Success") ?? items.length);
      const failCount = Number(res.headers.get("X-Batch-Fail") ?? 0);

      setResult({ zipUrl, successCount, failCount });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.zipUrl;
    a.download = `scanvas-batch-${Date.now()}.zip`;
    a.click();
  };

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "scanvas-batch-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setItems([]);
    setCsvText("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Upload + CSV */}
      <div className="lg:col-span-2 space-y-4">
        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
            items.length > 0
              ? "border-brand/40 bg-brand/5"
              : "border-canvas-border hover:border-white/30 bg-canvas-elevated"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <Upload size={24} className="mx-auto mb-3 text-white/30" />
          <p className="text-sm text-white/60 mb-1">Drop your CSV here or click to browse</p>
          <p className="text-xs text-white/30">Columns: data, type (optional), filename (optional)</p>
        </div>

        {/* Or paste CSV */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
              Or paste CSV
            </p>
            <button
              type="button"
              onClick={downloadTemplate}
              className="text-[11px] text-brand-hover hover:underline flex items-center gap-1"
            >
              <FileText size={11} />
              Download template
            </button>
          </div>
          <textarea
            value={csvText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={`data,type,filename\n5901234123457,EAN-13,product-001\nhttps://example.com,QR,qr-code`}
            rows={8}
            className={cn(
              "w-full rounded-lg border border-canvas-border bg-canvas-elevated",
              "text-sm font-mono text-white/70 placeholder:text-white/20",
              "px-3 py-2 resize-y outline-none focus:border-brand transition-colors"
            )}
          />
        </div>

        {/* Preview table */}
        {items.length > 0 && (
          <div className="rounded-xl border border-canvas-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-canvas-border bg-canvas-elevated">
              <span className="text-xs font-semibold text-white/60">
                {items.length} item{items.length !== 1 ? "s" : ""} detected
              </span>
              <button
                type="button"
                onClick={reset}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-canvas-surface sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-2 text-white/40 font-medium">#</th>
                    <th className="text-left px-4 py-2 text-white/40 font-medium">Data</th>
                    <th className="text-left px-4 py-2 text-white/40 font-medium">Type</th>
                    <th className="text-left px-4 py-2 text-white/40 font-medium">Filename</th>
                  </tr>
                </thead>
                <tbody>
                  {items.slice(0, 50).map((item, i) => (
                    <tr key={i} className="border-t border-canvas-border">
                      <td className="px-4 py-1.5 text-white/30">{i + 1}</td>
                      <td className="px-4 py-1.5 font-mono text-white/70 truncate max-w-[200px]">
                        {item.data}
                      </td>
                      <td className="px-4 py-1.5 text-white/50">{item.type ?? "CODE-128"}</td>
                      <td className="px-4 py-1.5 text-white/30">{item.filename ?? "—"}</td>
                    </tr>
                  ))}
                  {items.length > 50 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-2 text-center text-white/30">
                        …and {items.length - 50} more
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Right: Settings + Generate */}
      <div className="space-y-4">
        {/* Format */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">
            Output formats
          </p>
          <div className="space-y-1.5">
            {(["svg", "png"] as Format[]).map((fmt) => (
              <label key={fmt} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formats.includes(fmt)}
                  onChange={() => toggleFormat(fmt)}
                  className="accent-brand"
                />
                <span className="text-sm text-white/70 uppercase font-mono">{fmt}</span>
                {fmt === "png" && (
                  <span className="text-[10px] text-white/30">400px</span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Limits notice */}
        <div className="rounded-lg border border-canvas-border bg-canvas-elevated p-3 text-[11px] text-white/40 space-y-1">
          <p className="font-semibold text-white/60">Limits</p>
          <p>Free: 10 per job</p>
          <p>Pro: 50 per job</p>
          <p>Team: 500 per job</p>
        </div>

        {/* Generate */}
        <Button
          onClick={generate}
          disabled={items.length === 0 || loading || formats.length === 0}
          className="w-full"
          size="md"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Download size={14} />
          )}
          {loading
            ? `Generating ${items.length} barcodes…`
            : `Generate ${items.length > 0 ? `${items.length} ` : ""}barcodes`}
        </Button>

        {/* Result */}
        {result && (
          <div className="rounded-xl border border-scan-good/30 bg-scan-good/5 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-scan-good" />
              <p className="text-sm font-medium text-scan-good">Done!</p>
            </div>
            <p className="text-xs text-white/60">
              {result.successCount} generated
              {result.failCount > 0 && `, ${result.failCount} failed`}
            </p>
            <Button onClick={downloadResult} className="w-full" size="sm">
              <Download size={12} />
              Download ZIP
            </Button>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-scan-bad/30 bg-scan-bad/5 p-3 flex items-start gap-2">
            <AlertCircle size={14} className="text-scan-bad mt-0.5 shrink-0" />
            <p className="text-xs text-scan-bad">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
