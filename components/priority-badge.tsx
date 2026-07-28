import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Priority } from "@/types/cpd";

const labels: Record<Priority, string> = {
  low: "Baixa",
  medium: "Media",
  high: "Alta",
  urgent: "Urgente",
};

const tones: Record<Priority, string> = {
  low: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
  medium: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  high: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  urgent: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

export function PriorityBadge({ value, className }: { value: Priority; className?: string }) {
  return (
    <Badge className={cn("border-transparent", tones[value], className)} variant="secondary">
      {labels[value]}
    </Badge>
  );
}
