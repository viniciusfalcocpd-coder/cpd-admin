import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PatrimonioSituacaoOperacional } from "@/types/patrimonio";
import { patrimonioSituacaoOperacionalLabel } from "@/types/patrimonio";

const tone: Record<PatrimonioSituacaoOperacional, string> = {
  em_uso: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  em_manutencao: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  reserva: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  inoperante: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

export function PatrimonioOperationalBadge({ value }: { value: PatrimonioSituacaoOperacional }) {
  return (
    <Badge variant="secondary" className={cn("border-transparent", tone[value])}>
      {patrimonioSituacaoOperacionalLabel[value]}
    </Badge>
  );
}
