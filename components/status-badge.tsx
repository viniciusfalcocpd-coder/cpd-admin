import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusValue =
  | "open"
  | "in_progress"
  | "waiting_material"
  | "done"
  | "canceled"
  | "draft"
  | "sent"
  | "review"
  | "approved"
  | "buying"
  | "received"
  | "rejected"
  | "maintenance"
  | "reserved"
  | "damaged"
  | "written_off"
  | "active";

const statusLabel: Record<StatusValue, string> = {
  open: "Aberta",
  in_progress: "Em atendimento",
  waiting_material: "Aguardando material",
  done: "Concluida",
  canceled: "Cancelada",
  draft: "Rascunho",
  sent: "Enviada",
  review: "Em analise",
  approved: "Aprovada",
  buying: "Em compra",
  received: "Recebida",
  rejected: "Rejeitada",
  maintenance: "Manutencao",
  reserved: "Reservado",
  damaged: "Danificado",
  written_off: "Baixado",
  active: "Ativo",
};

const tone: Partial<Record<StatusValue, string>> = {
  open: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  in_progress: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  waiting_material: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  done: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  canceled: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  draft: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
  sent: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  review: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  approved: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  buying: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  received: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  rejected: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  maintenance: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  reserved: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  damaged: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  written_off: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
  active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

export function StatusBadge({ value, className }: { value: StatusValue; className?: string }) {
  return (
    <Badge className={cn("border-transparent", tone[value], className)} variant="secondary">
      {statusLabel[value]}
    </Badge>
  );
}
