"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, type = "text", ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-canvas-border bg-canvas-elevated px-3 py-1 text-sm",
        "text-white placeholder:text-white/30",
        "focus-visible:outline-none focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "transition-colors",
        className
      )}
      {...props}
    />
  );
});
