"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Tabs = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex gap-2", className)} {...props} />
  ),
);
Tabs.displayName = "Tabs";

type TabButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

const TabButton = React.forwardRef<HTMLButtonElement, TabButtonProps>(
  ({ className, active, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "inline-flex h-9 items-center justify-center border px-3 text-sm transition-colors",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted",
        className,
      )}
      {...props}
    />
  ),
);
TabButton.displayName = "TabButton";

export { Tabs, TabButton };
