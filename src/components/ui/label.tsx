"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(function Label({ className, ...props }, ref) {
  return (
    <label
      ref={ref}
      className={cn(
        "text-xs font-semibold uppercase tracking-widest text-white/40",
        className
      )}
      {...props}
    />
  );
});
