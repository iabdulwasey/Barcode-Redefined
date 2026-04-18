/**
 * useBarcodeState
 *
 * Single source of truth for the studio. Owns type, data, shape, color,
 * and derives the rendered SVG + scan assessment via a debounced effect.
 *
 * Scan validation runs in two passes:
 *   1. Heuristic (synchronous) — immediate feedback on color/contrast
 *   2. ZXing WASM decode (async) — real decode confidence after SVG is rendered
 */

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BarcodeValidationError, render1DBarcode } from "@/engine/barcode-1d";
import { renderQRCode, validate2DData, QRValidationError } from "@/engine/barcode-2d";
import { compose1DSVG, composeQRSVG } from "@/engine/svg-composer";
import { assessScanability, type ScanAssessment } from "@/engine/scan-validator";
import { decodeBarcodeSvg } from "@/engine/zxing-decoder";
import { getShapeById } from "@/engine/shapes";
import { is1D, type BarcodeType, type ColorConfig } from "@/types/barcode";
import type { Shape } from "@/types/shapes";

export interface UseBarcodeStateReturn {
  type: BarcodeType;
  setType: (type: BarcodeType) => void;
  data: string;
  setData: (data: string) => void;
  shapeId: string | null;
  setShapeId: (id: string | null) => void;
  shape: Shape | null;
  color: ColorConfig;
  setColor: (color: ColorConfig) => void;
  showDigits: boolean;
  setShowDigits: (show: boolean) => void;

  svg: string;
  scan: ScanAssessment;
  error: string | null;
  isGenerating: boolean;
}

const DEFAULT_STATE = {
  type: "EAN-13" as BarcodeType,
  data: "5901234123457",
  shapeId: "palm-tree" as string | null,
  color: {
    mode: "solid" as const,
    primary: "#000000",
    background: "#FFFFFF",
  },
  showDigits: true,
};

const DEBOUNCE_MS = 120;

export function useBarcodeState(): UseBarcodeStateReturn {
  const [type, setType] = useState<BarcodeType>(DEFAULT_STATE.type);
  const [data, setData] = useState(DEFAULT_STATE.data);
  const [shapeId, setShapeId] = useState<string | null>(DEFAULT_STATE.shapeId);
  const [color, setColor] = useState<ColorConfig>(DEFAULT_STATE.color);
  const [showDigits, setShowDigits] = useState(DEFAULT_STATE.showDigits);

  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // ZXing decode result — null means "not yet run / unavailable"
  const [zxingDecoded, setZxingDecoded] = useState<boolean | null>(null);

  const shape = useMemo(() => (shapeId ? getShapeById(shapeId) ?? null : null), [shapeId]);

  const cancelRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Heuristic scan assessment — updated synchronously on every state change
  const heuristicScan = useMemo<ScanAssessment>(
    () =>
      assessScanability({
        type,
        color,
        ...(shape ? { shape } : {}),
        dataValid: !error,
      }),
    [type, color, shape, error]
  );

  // Merge heuristic + ZXing result into final scan assessment
  const scan = useMemo<ScanAssessment>(() => {
    if (zxingDecoded === null) return heuristicScan;

    if (zxingDecoded) {
      // ZXing confirmed decode — clamp to at least 85 confidence
      return {
        ...heuristicScan,
        confidence: Math.max(heuristicScan.confidence, 85),
        level:
          heuristicScan.confidence >= 75
            ? "good"
            : ("warn" as ScanAssessment["level"]),
      };
    }

    // ZXing failed to decode — real failure
    return {
      confidence: 0,
      contrastRatio: heuristicScan.contrastRatio,
      level: "bad" as const,
      warnings: [
        {
          code: "DECODE_FAILED" as const,
          message:
            "Barcode could not be decoded. Check contrast and quiet zones.",
          severity: "error" as const,
        },
        ...heuristicScan.warnings,
      ],
    };
  }, [heuristicScan, zxingDecoded]);

  // Debounced SVG generation
  useEffect(() => {
    cancelRef.current = false;
    setIsGenerating(true);
    setZxingDecoded(null); // reset ZXing result while regenerating

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        let composed: string;

        if (is1D(type)) {
          const renderData = await render1DBarcode(data, type, {
            barWidth: 2,
            height: 100,
          });
          if (cancelRef.current) return;
          composed = compose1DSVG(renderData, {
            ...(shape ? { shape } : {}),
            color,
            width: 400,
            height: showDigits ? 260 : 240,
            showDigits,
          });
        } else {
          validate2DData(data, "QR");
          const qrData = await renderQRCode(data, {
            errorCorrectionLevel: shape ? "H" : "M",
          });
          if (cancelRef.current) return;
          composed = composeQRSVG(qrData, {
            ...(shape ? { shape } : {}),
            color,
            width: 320,
            height: 320,
          });
        }

        if (cancelRef.current) return;
        setSvg(composed);
        setError(null);
        setIsGenerating(false);

        // Fire ZXing validation asynchronously — doesn't block UI
        decodeBarcodeSvg(composed, 400).then((result) => {
          if (!cancelRef.current) {
            setZxingDecoded(result?.decoded ?? null);
          }
        });
      } catch (err) {
        if (cancelRef.current) return;
        const message =
          err instanceof BarcodeValidationError || err instanceof QRValidationError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to generate barcode.";
        setError(message);
        setSvg("");
        setIsGenerating(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      cancelRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [type, data, shape, color, showDigits]);

  const setColorStable = useCallback((next: ColorConfig) => setColor(next), []);

  return {
    type,
    setType,
    data,
    setData,
    shapeId,
    setShapeId,
    shape,
    color,
    setColor: setColorStable,
    showDigits,
    setShowDigits,
    svg,
    scan,
    error,
    isGenerating,
  };
}
