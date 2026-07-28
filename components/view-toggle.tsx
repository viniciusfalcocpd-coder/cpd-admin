"use client";

import { Grid2x2, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ViewMode = "list" | "cards";

export function ViewToggle({
  value,
  onChange,
  className,
}: {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex border border-border", className)}>
      <Button
        type="button"
        variant={value === "list" ? "default" : "outline"}
        size="sm"
        className="border-0"
        onClick={() => onChange("list")}
      >
        <List className="h-4 w-4" />
        Lista
      </Button>
      <Button
        type="button"
        variant={value === "cards" ? "default" : "outline"}
        size="sm"
        className="border-0 border-l border-l-border"
        onClick={() => onChange("cards")}
      >
        <Grid2x2 className="h-4 w-4" />
        Cards
      </Button>
    </div>
  );
}
