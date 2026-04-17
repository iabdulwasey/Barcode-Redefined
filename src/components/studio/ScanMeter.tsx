"use client";

import { AlertTriangle, CheckCircle2, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScanAssessment } from "@/engine/scan-validator";

interface ScanMeterProps {
  assessment: ScanAssessment;
}

export function ScanMeter({ assessment }: ScanMeterProps) {
  const { confidence, level, warnings, contrastRatio } = assessment;

  const barClass =
    level === "good" ? "scan-meter-good" : level === "warn" ? "scan-meter-warn" : "scan-meter-bad";

  const Icon =
    level === "good" ? CheckCircle2 : level === "warn" ? AlertTriangle : XCircle;

  const iconColor =
    level === "good" ? "text-scan-good" : level === "warn" ? "text-scan-warn" : "text-scan-bad";

  return (
    <div className="w-full space-y-1.5" role="status" aria-live="polite">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <Icon size={14} className={iconColor} />
          <span className="text-white/60">Scan confidence</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/40 font-mono text-[10px]">
            Contrast {contrastRatio.toFixed(1)}:1
          </span>
          <span className={cn("font-mono font-semibold", iconColor)}>
            {confidence}%
          </span>
        </div>
      </div>

      <div className="h-1.5 rounded-full bg-canvas-border overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-300", barClass)}
          style={{ width: `${confidence}%` }}
        />
      </div>

      {warnings.length > 0 && (
        <ul className="space-y-1 pt-1">
          {warnings.slice(0, 2).map((w, i) => {
            const WarnIcon =
              w.severity === "error" ? XCircle : w.severity === "warning" ? AlertTriangle : Info;
            const color =
              w.severity === "error"
                ? "text-scan-bad"
                : w.severity === "warning"
                  ? "text-scan-warn"
                  : "text-white/50";
            return (
              <li key={i} className="flex items-start gap-1.5 text-[11px] leading-tight">
                <WarnIcon size={11} className={cn("shrink-0 mt-0.5", color)} />
                <span className="text-white/70">{w.message}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
