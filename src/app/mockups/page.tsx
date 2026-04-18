import type { Metadata } from "next";
import Link from "next/link";
import { MockupGallery } from "@/components/mockups/MockupGallery";

export const metadata: Metadata = {
  title: "Product Mockups — SCANVAS",
  description: "Preview your barcode on real product mockups — packaging, bottles, cans, and more.",
};

export default function MockupsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-3 border-b border-canvas-border shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-lg font-bold tracking-tight">SCANVAS</Link>
          <span className="text-xs text-white/30 font-mono">MOCKUPS</span>
        </div>
        <nav className="flex items-center gap-4 text-sm text-white/60">
          <Link href="/studio" className="hover:text-white transition-colors">Studio</Link>
          <Link href="/shapes" className="hover:text-white transition-colors">Shapes</Link>
          <Link href="/batch" className="hover:text-white transition-colors">Batch</Link>
          <Link href="/mockups" className="text-white font-medium">Mockups</Link>
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

      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Product Mockups</h1>
          <p className="text-white/50 text-sm max-w-2xl">
            See how your barcode looks on real products.
            Paste your barcode SVG and preview it on packaging, bottles, cans, and labels.
          </p>
        </div>
        <MockupGallery />
      </div>
    </div>
  );
}
