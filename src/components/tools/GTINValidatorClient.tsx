"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  validateGTIN,
  calculateCheckDigit,
  formatGTIN,
  type GTINResult,
  type GTINLength,
} from "@/lib/validators/gtin";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** The state we derive from user input on every keystroke. */
interface ValidationState {
  /** Raw digits only (non-digits stripped). */
  digits: string;
  /** Full validation result — null when input is empty. */
  result: GTINResult | null;
  /**
   * When the user has entered exactly N-1 digits for a valid GTIN length,
   * we surface the required final check digit.
   */
  suggestedCheckDigit: number | null;
  /** The GTIN length we're expecting based on N-1 digit count. */
  expectedLength: GTINLength | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Valid GTIN payload lengths (total length minus 1). */
const PAYLOAD_LENGTHS: ReadonlyArray<number> = [7, 11, 12, 13];

/** Maps a payload length to the corresponding GTIN label. */
const PAYLOAD_TO_LABEL: ReadonlyMap<number, string> = new Map([
  [7, "GTIN-8"],
  [11, "GTIN-12 (UPC-A)"],
  [12, "GTIN-13 (EAN-13)"],
  [13, "GTIN-14 (ITF-14)"],
]);

/** Maps a GTINLength to its display label. */
const LENGTH_LABEL: ReadonlyMap<GTINLength, string> = new Map([
  [8, "GTIN-8 (EAN-8)"],
  [12, "GTIN-12 (UPC-A)"],
  [13, "GTIN-13 (EAN-13)"],
  [14, "GTIN-14 (ITF-14)"],
]);

function deriveState(raw: string): ValidationState {
  const digits = raw.replace(/\D/g, "");

  if (digits.length === 0) {
    return {
      digits,
      result: null,
      suggestedCheckDigit: null,
      expectedLength: null,
    };
  }

  // Check if digit count matches a complete GTIN length → full validation.
  if (
    digits.length === 8 ||
    digits.length === 12 ||
    digits.length === 13 ||
    digits.length === 14
  ) {
    return {
      digits,
      result: validateGTIN(digits),
      suggestedCheckDigit: null,
      expectedLength: null,
    };
  }

  // Check if digit count matches a payload (N-1) → suggest check digit.
  if (PAYLOAD_LENGTHS.includes(digits.length)) {
    const suggested = calculateCheckDigit(digits);
    // The expected full length is payload + 1.
    const fullLen = (digits.length + 1) as GTINLength;
    return {
      digits,
      result: null,
      suggestedCheckDigit: suggested,
      expectedLength: fullLen,
    };
  }

  // Partial input that doesn't yet match any useful length.
  return {
    digits,
    result: null,
    suggestedCheckDigit: null,
    expectedLength: null,
  };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface ValidityBadgeProps {
  isValid: boolean;
}

function ValidityBadge({ isValid }: ValidityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide",
        isValid
          ? "bg-scan-good/10 text-scan-good border border-scan-good/20"
          : "bg-scan-bad/10 text-scan-bad border border-scan-bad/20"
      )}
      aria-label={isValid ? "Valid GTIN" : "Invalid GTIN"}
    >
      <span aria-hidden="true">{isValid ? "✓" : "✗"}</span>
      {isValid ? "Valid" : "Invalid"}
    </span>
  );
}

interface ResultRowProps {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}

function ResultRow({ label, value, mono = false }: ResultRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-canvas-border last:border-0">
      <span className="text-sm text-white/40 shrink-0">{label}</span>
      <span
        className={cn(
          "text-sm text-right",
          mono && "font-mono tracking-wider"
        )}
      >
        {value}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main client component
// ---------------------------------------------------------------------------

export function GTINValidatorClient() {
  const [rawInput, setRawInput] = React.useState("");
  const state = React.useMemo(() => deriveState(rawInput), [rawInput]);

  /** Handle paste: strip non-digits immediately so the field stays clean. */
  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    const digitsOnly = pasted.replace(/\D/g, "");
    setRawInput(digitsOnly);
  }

  /** Allow only digit characters while typing. */
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    setRawInput(digitsOnly);
  }

  function handleClear() {
    setRawInput("");
  }

  const showResults =
    state.result !== null || state.suggestedCheckDigit !== null;

  // The formatted GTIN for display (only when we have a full result).
  const formattedGTIN =
    state.result !== null && state.digits.length > 0
      ? formatGTIN(state.digits)
      : null;

  // Link to studio with the validated GTIN pre-filled.
  const studioHref =
    state.result?.isValid === true
      ? `/studio?data=${encodeURIComponent(state.digits)}`
      : null;

  // Check-digit helper label.
  const checkDigitHelperLabel =
    state.suggestedCheckDigit !== null && state.expectedLength !== null
      ? PAYLOAD_TO_LABEL.get(state.digits.length) ?? null
      : null;

  return (
    <div className="flex flex-col gap-6">
      {/* ------------------------------------------------------------------ */}
      {/* Input area                                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="gtin-input"
          className="text-sm font-medium text-white/70"
        >
          GTIN / Barcode Number
        </label>

        <div className="relative flex items-center gap-2">
          <Input
            id="gtin-input"
            value={rawInput}
            onChange={handleChange}
            onPaste={handlePaste}
            placeholder="Enter 8, 12, 13, or 14 digit GTIN…"
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
            maxLength={14}
            className="font-mono tracking-widest text-base h-11 pr-16"
            aria-describedby="gtin-hint"
          />

          {/* Digit counter badge */}
          {rawInput.length > 0 && (
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-white/30 pointer-events-none"
              aria-hidden="true"
            >
              {state.digits.length}/14
            </span>
          )}
        </div>

        <p id="gtin-hint" className="text-xs text-white/30">
          Spaces, hyphens, and non-digit characters are stripped automatically.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Check digit helper — shown when N-1 digits entered                  */}
      {/* ------------------------------------------------------------------ */}
      {state.suggestedCheckDigit !== null && state.expectedLength !== null && (
        <div className="rounded-lg border border-scan-warn/30 bg-scan-warn/5 px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-white/40 mb-0.5">
              {checkDigitHelperLabel ?? `GTIN-${state.expectedLength}`} —
              missing check digit
            </p>
            <p className="text-sm text-white/70">
              Append{" "}
              <span className="font-mono font-bold text-scan-warn text-base">
                {state.suggestedCheckDigit}
              </span>{" "}
              to complete this GTIN.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setRawInput(
                (prev) =>
                  prev.replace(/\D/g, "") +
                  String(state.suggestedCheckDigit)
              )
            }
            className="shrink-0 text-xs px-3 py-1.5 rounded-md border border-scan-warn/40 text-scan-warn hover:bg-scan-warn/10 transition-colors font-medium"
          >
            Append
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Validation results panel                                            */}
      {/* ------------------------------------------------------------------ */}
      {showResults && state.result !== null && (
        <div className="rounded-lg border border-canvas-border bg-canvas-elevated overflow-hidden">
          {/* Header row with validity badge */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-canvas-border">
            <span className="text-sm font-medium">Validation Result</span>
            <ValidityBadge isValid={state.result.isValid} />
          </div>

          {/* Data rows */}
          <div className="px-4">
            {/* Formatted display */}
            {formattedGTIN !== null && (
              <ResultRow
                label="Formatted"
                value={formattedGTIN}
                mono
              />
            )}

            {/* GTIN type */}
            {state.result.length !== null && (
              <ResultRow
                label="Type"
                value={
                  LENGTH_LABEL.get(state.result.length) ??
                  `GTIN-${state.result.length}`
                }
              />
            )}

            {/* Check digit */}
            {state.result.checkDigit !== null && (
              <ResultRow
                label="Check Digit"
                value={
                  <span
                    className={cn(
                      "font-mono",
                      state.result.isValid
                        ? "text-scan-good"
                        : "text-scan-bad"
                    )}
                  >
                    {state.result.checkDigit}
                    {!state.result.isValid &&
                      state.result.calculatedCheckDigit !== null && (
                        <span className="text-white/40 ml-1.5 text-xs font-sans">
                          (expected{" "}
                          <span className="text-scan-good">
                            {state.result.calculatedCheckDigit}
                          </span>
                          )
                        </span>
                      )}
                  </span>
                }
              />
            )}

            {/* Country / region */}
            <ResultRow
              label="Country / Region"
              value={
                state.result.countryPrefix !== null ? (
                  state.result.countryPrefix
                ) : (
                  <span className="text-white/30">Unknown prefix</span>
                )
              }
            />

            {/* Error message */}
            {state.result.error !== null && (
              <ResultRow
                label="Issue"
                value={
                  <span className="text-scan-bad text-xs">
                    {state.result.error}
                  </span>
                }
              />
            )}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-canvas-border">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              Clear
            </button>

            {studioHref !== null && (
              <Link
                href={studioHref}
                className="inline-flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-md bg-brand text-white font-medium hover:bg-brand-hover transition-colors"
              >
                Open in Studio
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2.5 6h7M6.5 3l3 3-3 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Empty / idle state hint                                             */}
      {/* ------------------------------------------------------------------ */}
      {!showResults && rawInput.length === 0 && (
        <div className="rounded-lg border border-dashed border-canvas-border px-6 py-8 text-center">
          <p className="text-sm text-white/30">
            Enter a barcode number above to validate it.
          </p>
          <p className="text-xs text-white/20 mt-1">
            Supports GTIN-8, GTIN-12 (UPC-A), GTIN-13 (EAN-13), GTIN-14 (ITF-14)
          </p>
        </div>
      )}

      {/* Partial input that doesn't yet hit any validation threshold */}
      {!showResults && rawInput.length > 0 && (
        <div className="rounded-lg border border-canvas-border px-4 py-3 flex items-center gap-2">
          <span className="text-xs text-white/30">
            {state.digits.length} digit{state.digits.length === 1 ? "" : "s"} entered —
            keep typing to reach a valid GTIN length (8, 12, 13, or 14).
          </span>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Reference table                                                     */}
      {/* ------------------------------------------------------------------ */}
      <details className="group">
        <summary className="cursor-pointer text-xs text-white/30 hover:text-white/50 transition-colors select-none list-none flex items-center gap-1.5">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            className="transition-transform group-open:rotate-90"
            aria-hidden="true"
          >
            <path
              d="M3 2l4 3-4 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          GTIN format reference
        </summary>

        <div className="mt-3 rounded-lg border border-canvas-border bg-canvas-elevated overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-canvas-border">
                <th className="text-left px-3 py-2 text-white/40 font-medium">
                  Format
                </th>
                <th className="text-left px-3 py-2 text-white/40 font-medium">
                  Digits
                </th>
                <th className="text-left px-3 py-2 text-white/40 font-medium">
                  Common use
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-border">
              {(
                [
                  ["GTIN-8", "8", "Short EAN-8 for small packages"],
                  ["GTIN-12", "12", "UPC-A — North American retail"],
                  ["GTIN-13", "13", "EAN-13 — Global retail standard"],
                  ["GTIN-14", "14", "ITF-14 / GS1-128 — Shipping cases"],
                ] as const
              ).map(([fmt, len, use]) => (
                <tr key={fmt}>
                  <td className="px-3 py-2 font-mono text-white/70">{fmt}</td>
                  <td className="px-3 py-2 text-white/50">{len}</td>
                  <td className="px-3 py-2 text-white/40">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
