"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  default: "bg-brand text-white hover:bg-brand-hover",
  outline:
    "border border-canvas-border bg-transparent hover:bg-canvas-elevated hover:border-white/30 text-white/80 hover:text-white",
  ghost: "bg-transparent hover:bg-canvas-elevated text-white/80 hover:text-white",
  destructive: "bg-scan-bad text-white hover:bg-red-600",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-11 px-6 text-base",
  icon: "h-9 w-9",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, variant = "default", size = "md", ...props }, ref) {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all",
          "disabled:opacity-50 disabled:pointer-events-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-bg",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
