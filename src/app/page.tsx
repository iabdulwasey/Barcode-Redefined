import type { Metadata } from "next";
import Link from "next/link";
import { Check, X, ArrowRight, Zap, Layers, Sparkles, Package, FileText, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "SCANVAS — AI-Powered Barcode & QR Code Art Studio",
  description:
    "Transform barcodes and QR codes into scannable works of art. AI-powered shapes, professional exports, batch generation, and real-time scan validation. 100% free.",
};

const FEATURES = [
  {
    icon: Zap,
    title: "20+ Barcode Symbologies",
    desc: "EAN-13, UPC-A, CODE-128, QR, DataMatrix, PDF417 and more — all rendered as crisp, scalable SVG.",
  },
  {
    icon: Layers,
    title: "AI Shape Masking",
    desc: "Apply any silhouette — palm tree, skull, skyline — as a mask over your barcode. The scan zone is always protected.",
  },
  {
    icon: Sparkles,
    title: "AI QR Art",
    desc: "Flux ControlNet turns any URL into a scannable painting, illustration, or photo-realistic scene.",
  },
  {
    icon: Package,
    title: "Batch Generation",
    desc: "Upload a CSV, get a ZIP of 500 styled barcodes in seconds. Perfect for product launches and inventory systems.",
  },
  {
    icon: FileText,
    title: "Print-Ready PDF",
    desc: "300 DPI output with configurable bleed (0–5 mm) and crop marks — straight to the printer, no Illustrator needed.",
  },
  {
    icon: ShieldCheck,
    title: "Scan Validation",
    desc: "ZXing WASM decodes every barcode before you download it. Green = guaranteed to scan. No more wasted prints.",
  },
];

const COMPARISON = [
  { feature: "1D Barcodes (EAN/UPC/CODE-128)", scanvas: true, barkod: true, canva: false },
  { feature: "QR Codes", scanvas: true, barkod: false, canva: true },
  { feature: "AI Shape Masking", scanvas: true, barkod: false, canva: false },
  { feature: "AI QR Art (Flux)", scanvas: true, barkod: false, canva: true },
  { feature: "Batch Generation (CSV → ZIP)", scanvas: true, barkod: false, canva: false },
  { feature: "SVG Export", scanvas: true, barkod: true, canva: false },
  { feature: "PNG Export", scanvas: true, barkod: false, canva: true },
  { feature: "Print PDF (bleed + crop marks)", scanvas: true, barkod: false, canva: false },
  { feature: "Real-time Scan Validation", scanvas: true, barkod: false, canva: false },
  { feature: "Product Mockup Preview", scanvas: true, barkod: false, canva: false },
  { feature: "100% Free", scanvas: true, barkod: false, canva: false },
];

export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SCANVAS",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "AI-powered barcode and QR code design studio. Create scannable works of art with shape masking, AI QR art, batch generation, and professional print exports.",
    featureList: [
      "20+ barcode symbologies",
      "AI shape masking",
      "AI QR art via Flux ControlNet",
      "Batch generation from CSV",
      "Print-ready PDF with bleed and crop marks",
      "Real-time ZXing scan validation",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex flex-col min-h-screen">
        {/* ── Nav ── */}
        <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b border-canvas-border bg-canvas-bg/80 backdrop-blur-md">
          <span className="text-lg font-bold tracking-tight">SCANVAS</span>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-white/60">
            <Link href="/studio" className="hover:text-white transition-colors">Studio</Link>
            <Link href="/shapes" className="hover:text-white transition-colors">Shapes</Link>
            <Link href="/batch" className="hover:text-white transition-colors">Batch</Link>
            <Link href="/mockups" className="hover:text-white transition-colors">Mockups</Link>
            <Link href="/tools/gtin-validator" className="hover:text-white transition-colors">GTIN Validator</Link>
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

        {/* ── Hero ── */}
        <section className="relative flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden">
          {/* Grid background */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          {/* Radial glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)" }}
          />

          <div className="relative max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand/30 bg-brand/10 text-xs font-medium text-brand-hover mb-2">
              <Sparkles size={11} />
              100% free · no account required
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-none">
              Where every scan
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                is a canvas.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              Transform functional barcodes and QR codes into scannable works of art.
              AI shapes, Flux QR art, batch exports, print-ready PDF — all free, forever.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand text-white font-semibold text-sm hover:bg-brand-hover transition-colors shadow-lg shadow-brand/25"
              >
                Open Studio <ArrowRight size={16} />
              </Link>
              <Link
                href="/shapes"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-canvas-border text-white/70 font-medium text-sm hover:border-white/30 hover:text-white transition-colors"
              >
                Browse Shapes
              </Link>
            </div>
          </div>

          {/* Decorative barcode preview */}
          <div className="relative mt-16 max-w-lg mx-auto w-full opacity-60">
            <svg viewBox="0 0 400 120" className="w-full" aria-hidden>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              {[8,12,6,10,4,14,8,6,12,10,4,8,6,14,10,8,4,12,6,10,8,14,4,8,10,6,12,8,4,10,14,6,8].map((w, i, arr) => {
                const x = arr.slice(0, i).reduce((s, v) => s + v + 3, 10);
                return i % 2 === 0 ? (
                  <rect key={i} x={x} y={0} width={w} height={90} fill="url(#barGrad)" rx={1} />
                ) : null;
              })}
              <rect x={10} y={95} width={380} height={20} rx={4} fill="rgba(99,102,241,0.15)" />
              <text x={200} y={109} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.4)" fontFamily="monospace">
                1234567890128
              </text>
            </svg>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="px-6 py-20 max-w-6xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Everything you need. Nothing you don&apos;t.</h2>
            <p className="text-white/40 text-sm max-w-xl mx-auto">
              Built for packaging designers, indie brands, and developers who care about both function and aesthetics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-canvas-border bg-canvas-elevated p-6 hover:border-brand/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                  <Icon size={20} className="text-brand-hover" />
                </div>
                <h3 className="font-semibold text-sm mb-2">{title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Comparison ── */}
        <section className="px-6 py-20 max-w-4xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">The 10× gap</h2>
            <p className="text-white/40 text-sm">See how SCANVAS stacks up against the alternatives.</p>
          </div>

          <div className="rounded-2xl border border-canvas-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-canvas-border bg-canvas-elevated">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Feature</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-brand-hover uppercase tracking-wider">SCANVAS</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">barkod.studio</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">Canva QR</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map(({ feature, scanvas, barkod, canva }, i) => (
                  <tr key={feature} className={i % 2 === 0 ? "bg-canvas-bg" : "bg-canvas-elevated/30"}>
                    <td className="px-5 py-3 text-white/70 text-xs">{feature}</td>
                    <td className="px-5 py-3 text-center">
                      {scanvas ? <Check size={15} className="inline text-scan-good" /> : <X size={15} className="inline text-scan-bad/60" />}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {barkod ? <Check size={15} className="inline text-white/40" /> : <X size={15} className="inline text-white/20" />}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {canva ? <Check size={15} className="inline text-white/40" /> : <X size={15} className="inline text-white/20" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Free CTA ── */}
        <section className="px-6 py-24 max-w-3xl mx-auto w-full text-center">
          <div className="rounded-3xl border border-brand/20 bg-brand/5 p-12 space-y-5">
            <div className="text-5xl">🎨</div>
            <h2 className="text-3xl font-bold tracking-tight">Free, forever.</h2>
            <p className="text-white/50 text-sm max-w-md mx-auto leading-relaxed">
              No account. No watermarks. No limits. Every feature unlocked from day one.
              If SCANVAS saves you time, a coffee keeps it running.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-brand text-white font-semibold text-sm hover:bg-brand-hover transition-colors shadow-lg shadow-brand/25"
              >
                Start Creating <ArrowRight size={16} />
              </Link>
              <a
                href="https://paypal.me/iabdulwasey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-[#0070ba] text-white font-semibold text-sm hover:bg-[#005ea6] transition-colors"
              >
                ☕ Buy me a coffee
              </a>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-canvas-border px-6 py-8 mt-auto">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
            <span className="font-bold text-white/50 tracking-tight">SCANVAS</span>
            <nav className="flex items-center gap-5">
              <Link href="/studio" className="hover:text-white/60 transition-colors">Studio</Link>
              <Link href="/shapes" className="hover:text-white/60 transition-colors">Shapes</Link>
              <Link href="/studio/ai-qr" className="hover:text-white/60 transition-colors">AI QR</Link>
              <Link href="/batch" className="hover:text-white/60 transition-colors">Batch</Link>
              <Link href="/mockups" className="hover:text-white/60 transition-colors">Mockups</Link>
              <Link href="/tools/gtin-validator" className="hover:text-white/60 transition-colors">GTIN Validator</Link>
            </nav>
            <span>© {new Date().getFullYear()} SCANVAS · Free &amp; open creative tools</span>
          </div>
        </footer>
      </div>
    </>
  );
}
