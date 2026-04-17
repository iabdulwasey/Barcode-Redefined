"use client";

import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { calculateCheckDigit } from "@/engine/barcode-1d";
import type { BarcodeType } from "@/types/barcode";

interface DataInputProps {
  type: BarcodeType;
  value: string;
  onChange: (value: string) => void;
  error: string | null;
}

const PLACEHOLDERS: Partial<Record<BarcodeType, string>> = {
  "EAN-13": "5901234123457",
  "EAN-8": "96385074",
  "UPC-A": "012345678905",
  "CODE-128": "SCANVAS-001",
  "CODE-39": "HELLO-WORLD",
  "ITF-14": "12345678901231",
  ISBN: "9780000000002",
  QR: "https://scanvas.studio",
  PHARMACODE: "1234",
  CODABAR: "A123456A",
  MSI: "1234567",
};

export function DataInput({ type, value, onChange, error }: DataInputProps) {
  const placeholder = PLACEHOLDERS[type] ?? "Enter data";

  // Live check-digit preview for EAN/UPC
  let checkDigitHint: string | null = null;
  const digits = value.trim();
  if (type === "EAN-13" && /^\d{12}$/.test(digits)) {
    checkDigitHint = `Check digit: ${calculateCheckDigit(digits, "EAN-13")} → ${digits}${calculateCheckDigit(digits, "EAN-13")}`;
  } else if (type === "EAN-8" && /^\d{7}$/.test(digits)) {
    checkDigitHint = `Check digit: ${calculateCheckDigit(digits, "EAN-8")} → ${digits}${calculateCheckDigit(digits, "EAN-8")}`;
  } else if (type === "UPC-A" && /^\d{11}$/.test(digits)) {
    checkDigitHint = `Check digit: ${calculateCheckDigit(digits, "UPC-A")} → ${digits}${calculateCheckDigit(digits, "UPC-A")}`;
  }

  const charCount = value.length;
  const maxChars = type === "QR" ? 3000 : 100;

  return (
    <div className="space-y-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Barcode data"
        aria-invalid={!!error}
        className={error ? "border-scan-bad focus-visible:border-scan-bad" : ""}
      />

      <div className="flex items-center justify-between text-[11px] text-white/40 px-0.5">
        <span>
          {charCount}
          {type === "QR" ? `/${maxChars}` : ""}
        </span>
        {checkDigitHint && !error && (
          <span className="text-scan-good font-mono">{checkDigitHint}</span>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-1.5 text-[11px] text-scan-bad px-0.5"
        >
          <AlertCircle size={12} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
