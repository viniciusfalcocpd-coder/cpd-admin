"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ModuleCommand = {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  enabled?: boolean;
  variant?: "primary" | "default" | "danger";
};

export function ModuleCommandBar({ actions, className }: { actions: ModuleCommand[]; className?: string }) {
  return (
    <div className={cn("flex min-h-10 flex-wrap items-center gap-1 border border-border bg-card px-2 py-1", className)} role="toolbar">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            type="button"
            disabled={action.enabled === false}
            onClick={action.onClick}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 border px-2.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
              action.variant === "primary" ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90" :
                action.variant === "danger" ? "border-destructive/40 text-destructive hover:bg-destructive/10" :
                  "border-transparent hover:border-border hover:bg-muted",
            )}
          >
            {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
