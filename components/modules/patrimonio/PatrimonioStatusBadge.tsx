import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PatrimonioStatus } from "@/types/patrimonio";

const label: Record<PatrimonioStatus, string> = {
  pending: "Pendente",
  in_maintenance: "Em manutencao",
  waiting_parts: "Aguardando pecas",
  ready: "Pronto",
  written_off: "Baixa patrimonial",
};

const tone: Record<PatrimonioStatus, string> = {
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  in_maintenance: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  waiting_parts: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  ready: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  written_off: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

export function PatrimonioStatusBadge({ value }: { value: PatrimonioStatus }) {
  return (
    <Badge className={cn("border-transparent", tone[value])} variant="secondary">
      {label[value]}
    </Badge>
  );
}

