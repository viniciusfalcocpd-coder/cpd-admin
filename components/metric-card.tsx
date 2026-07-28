import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: string;
  delta?: string;
  tone?: "blue" | "emerald" | "amber" | "violet" | "rose";
};

const toneClasses: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  blue: "border-l-4 border-l-slate-600 text-slate-800 dark:text-slate-100",
  emerald: "border-l-4 border-l-emerald-700 text-emerald-800 dark:text-emerald-100",
  amber: "border-l-4 border-l-amber-700 text-amber-800 dark:text-amber-100",
  violet: "border-l-4 border-l-violet-700 text-violet-800 dark:text-violet-100",
  rose: "border-l-4 border-l-rose-700 text-rose-800 dark:text-rose-100",
};

export function MetricCard({ label, value, delta, tone = "blue" }: MetricCardProps) {
  return (
    <Card className={cn("overflow-hidden border-border", toneClasses[tone])}>
      <CardContent className="bg-muted/20 p-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <span className="font-heading text-2xl font-semibold tracking-tight">{value}</span>
          {delta ? <span className="text-[11px] text-muted-foreground">{delta}</span> : null}
        </div>
      </CardContent>
    </Card>
  );
}
