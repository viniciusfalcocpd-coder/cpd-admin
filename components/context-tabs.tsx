"use client";

import { cn } from "@/lib/utils";

export function ContextTabs({ tabs, value, onChange }: { tabs: Array<{ value: string; label: string }>; value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex min-h-9 flex-wrap items-end gap-0 border-b border-border" role="tablist">
      {tabs.map((tab) => (
        <button key={tab.value} type="button" role="tab" aria-selected={value === tab.value} onClick={() => onChange(tab.value)} className={cn("border-x border-t px-3 py-2 text-xs font-medium", value === tab.value ? "border-border bg-card text-primary" : "border-transparent text-muted-foreground hover:bg-muted")}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
