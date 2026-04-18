import Link from "next/link";
import type { Metadata } from "next";
import { AIQRStudio } from "@/components/studio/AIQRStudio";

export const metadata: Metadata = {
  title: "AI QR Art Studio — SCANVAS",
  description: "Generate beautiful, scannable AI QR codes styled with Flux ControlNet.",
};

export default function AIQRPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 py-3 border-b border-canvas-border shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-lg font-bold tracking-tight">SCANVAS</Link>
          <span className="text-xs text-white/30 font-mono">AI QR</span>
        </div>
        <nav className="flex items-center gap-4 text-sm text-white/60">
          <a href="/studio" className="hover:text-white transition-colors">Studio</a>
          <a href="/shapes" className="hover:text-white transition-colors">Shapes</a>
          <a href="/studio/ai-qr" className="text-white font-medium">AI QR</a>
          <a href="/batch" className="hover:text-white transition-colors">Batch</a>
        </nav>
        <div className="flex items-center gap-2">
          <button className="text-sm px-4 py-1.5 rounded-md border border-canvas-border text-white/60 hover:text-white hover:border-white/30 transition-colors">
            Sign In
          </button>
          <button className="text-sm px-4 py-1.5 rounded-md bg-brand text-white font-medium hover:bg-brand-hover transition-colors">
            Get Pro
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">AI QR Art Studio</h1>
          <p className="text-white/50 text-sm max-w-2xl">
            Transform any URL or text into a scannable work of art.
            Powered by Flux ControlNet — every code remains fully readable.
          </p>
        </div>

        <AIQRStudio />
      </div>
    </div>
  );
}
