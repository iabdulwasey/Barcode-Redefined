import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { PostHogProvider, PostHogPageTracker } from "@/components/shared/PostHogProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SCANVAS — AI-Powered Barcode & QR Code Art Studio",
    template: "%s | SCANVAS",
  },
  description:
    "Transform barcodes and QR codes into scannable works of art. AI-powered shapes, professional exports, batch generation, and real-time scan validation.",
  keywords: [
    "artistic barcode generator",
    "creative QR code maker",
    "AI QR code art",
    "barcode design",
    "custom barcode",
    "EAN-13 generator",
    "QR code art",
    "barcode art",
    "packaging design tool",
  ],
  authors: [{ name: "SCANVAS" }],
  creator: "SCANVAS",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SCANVAS",
    title: "SCANVAS — AI-Powered Barcode & QR Code Art Studio",
    description:
      "Transform barcodes and QR codes into scannable works of art.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SCANVAS — AI-Powered Barcode & QR Code Art Studio",
    description:
      "Transform barcodes and QR codes into scannable works of art.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-canvas-bg text-white min-h-screen`}
      >
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageTracker />
          </Suspense>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
