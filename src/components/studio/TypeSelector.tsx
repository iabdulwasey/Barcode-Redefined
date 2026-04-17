"use client";

import { useState } from "react";
import { ChevronDown, QrCode, Barcode } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BARCODE_TYPE_LABELS,
  BARCODE_TYPE_DESCRIPTIONS,
  is1D,
  type BarcodeType,
} from "@/types/barcode";

const ONE_D_TYPES: BarcodeType[] = [
  "EAN-13",
  "EAN-8",
  "UPC-A",
  "UPC-E",
  "CODE-128",
  "CODE-39",
  "CODE-93",
  "ITF-14",
  "CODABAR",
  "ISBN",
  "MSI",
  "PHARMACODE",
];

const TWO_D_TYPES: BarcodeType[] = ["QR"];

interface TypeSelectorProps {
  value: BarcodeType;
  onChange: (type: BarcodeType) => void;
}

export function TypeSelector({ value, onChange }: TypeSelectorProps) {
  const [open, setOpen] = useState(false);
  const is1DType = is1D(value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md",
          "border border-canvas-border bg-canvas-elevated",
          "hover:border-white/30 transition-colors",
          "focus-visible:outline-none focus-visible:border-brand"
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          {is1DType ? (
            <Barcode size={16} className="shrink-0 text-brand" />
          ) : (
            <QrCode size={16} className="shrink-0 text-brand" />
          )}
          <span className="text-sm font-medium truncate">
            {BARCODE_TYPE_LABELS[value]}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={cn("text-white/40 transition-transform", open && "rotate-180")}
        />
      </button>

      <p className="mt-2 text-xs text-white/40 leading-relaxed">
        {BARCODE_TYPE_DESCRIPTIONS[value]}
      </p>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            role="listbox"
            className={cn(
              "absolute left-0 right-0 top-full mt-1 z-20 max-h-80 overflow-y-auto",
              "rounded-md border border-canvas-border bg-canvas-elevated shadow-xl animate-fade-in"
            )}
          >
            <div className="sticky top-0 bg-canvas-elevated px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/30 border-b border-canvas-border">
              1D Barcodes
            </div>
            {ONE_D_TYPES.map((type) => (
              <TypeOption
                key={type}
                type={type}
                selected={type === value}
                onSelect={() => {
                  onChange(type);
                  setOpen(false);
                }}
              />
            ))}
            <div className="sticky top-0 bg-canvas-elevated px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/30 border-b border-t border-canvas-border">
              2D Codes
            </div>
            {TWO_D_TYPES.map((type) => (
              <TypeOption
                key={type}
                type={type}
                selected={type === value}
                onSelect={() => {
                  onChange(type);
                  setOpen(false);
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TypeOption({
  type,
  selected,
  onSelect,
}: {
  type: BarcodeType;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      role="option"
      aria-selected={selected}
      className={cn(
        "w-full text-left px-3 py-2 flex flex-col gap-0.5 transition-colors",
        "hover:bg-canvas-surface",
        selected && "bg-brand/10 text-white"
      )}
    >
      <span className="text-sm font-medium">{BARCODE_TYPE_LABELS[type]}</span>
      <span className="text-[11px] text-white/40 leading-tight">
        {BARCODE_TYPE_DESCRIPTIONS[type]}
      </span>
    </button>
  );
}
