/**
 * Shape Gallery Page
 *
 * Full-page gallery of all 50+ shapes.
 * Category tabs, search, hover preview, click to open in studio.
 */

import Link from "next/link";
import type { Metadata } from "next";
import { ShapeGalleryClient } from "@/components/shapes/ShapeGalleryClient";

export const metadata: Metadata = {
  title: "Shape Gallery — SCANVAS",
  description: "Browse 50+ shapes for your artistic barcode. Filter by category, search, click to open in studio.",
};

export default function ShapesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-3 border-b border-canvas-border shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-lg font-bold tracking-tight">SCANVAS</Link>
          <span className="text-xs text-white/30 font-mono">SHAPES</span>
        </div>
        <nav className="flex items-center gap-4 text-sm text-white/60">
          <a href="/studio" className="hover:text-white transition-colors">Studio</a>
          <a href="/shapes" className="text-white font-medium">Shapes</a>
          <a href="/batch" className="hover:text-white transition-colors">Batch</a>
          <a href="/mockups" className="hover:text-white transition-colors">Mockups</a>
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

      <div className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Shape Gallery</h1>
            <p className="text-white/50 text-sm">
              Choose a shape to apply as an artistic mask to your barcode.
              Every shape keeps the bottom scan zone intact.
            </p>
          </div>

          <ShapeGalleryClient />
        </div>
      </div>
    </div>
  );
}
