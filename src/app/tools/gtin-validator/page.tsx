/**
 * GTIN Validator Tool Page
 *
 * Server component with metadata. The interactive validation UI is
 * delegated to GTINValidatorClient (a 'use client' component) so that
 * the page shell is statically rendered.
 */

import Link from "next/link";
import type { Metadata } from "next";
import { GTINValidatorClient } from "@/components/tools/GTINValidatorClient";

export const metadata: Metadata = {
  title: "GTIN Validator — SCANVAS",
  description:
    "Free GTIN validator tool. Check EAN-8, UPC-A, EAN-13, and ITF-14 barcodes instantly. Verify check digits, identify country prefixes, and open valid codes directly in the SCANVAS studio.",
  keywords: [
    "GTIN validator",
    "EAN-13 check digit",
    "UPC-A validator",
    "barcode validation",
    "GS1 check digit calculator",
    "EAN-8 validator",
    "ITF-14 validator",
  ],
};

export default function GTINValidatorPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ------------------------------------------------------------------ */}
      {/* Header — matches the shared shell used across studio pages          */}
      {/* ------------------------------------------------------------------ */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-canvas-border shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-lg font-bold tracking-tight">
            SCANVAS
          </Link>
          <span className="text-xs text-white/30 font-mono">GTIN VALIDATOR</span>
        </div>

        <nav className="flex items-center gap-4 text-sm text-white/60">
          <a href="/studio" className="hover:text-white transition-colors">
            Studio
          </a>
          <a href="/shapes" className="hover:text-white transition-colors">
            Shapes
          </a>
          <a href="/studio/ai-qr" className="hover:text-white transition-colors">
            AI QR
          </a>
          <a href="/tools/gtin-validator" className="text-white font-medium">
            GTIN Validator
          </a>
        </nav>

        <a
          href="https://paypal.me/iabdulwasey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm px-4 py-1.5 rounded-md bg-[#0070ba] text-white font-medium hover:bg-[#005ea6] transition-colors"
        >
          ☕ Buy me a coffee
        </a>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Page content                                                        */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            GTIN Validator
          </h1>
          <p className="text-white/50 text-sm max-w-xl">
            Validate EAN-8, UPC-A (GTIN-12), EAN-13, and ITF-14 (GTIN-14)
            barcodes. Check digits are verified using the GS1 algorithm.
            Valid codes can be opened directly in the studio.
          </p>
        </div>

        <GTINValidatorClient />
      </div>
    </div>
  );
}
