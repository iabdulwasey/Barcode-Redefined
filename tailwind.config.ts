import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // SCANVAS Design System
        canvas: {
          bg: "#0A0A0A",
          surface: "#141414",
          elevated: "#1C1C1C",
          border: "#2A2A2A",
          muted: "#3A3A3A",
        },
        brand: {
          DEFAULT: "#6366F1", // indigo-500
          hover: "#818CF8",   // indigo-400
          muted: "#3730A3",   // indigo-800
        },
        scan: {
          good: "#22C55E",    // green-500
          warn: "#F59E0B",    // amber-500
          bad: "#EF4444",     // red-500
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
        digits: ["var(--font-geist-mono)", "monospace"], // For barcode digit display
      },
      animation: {
        "scan-pulse": "scan-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fade-in 0.2s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        "scan-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { transform: "translateY(8px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
