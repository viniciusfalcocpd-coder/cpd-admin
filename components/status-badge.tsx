import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getStatusMetadata } from "@/lib/status-metadata";

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
  | "active"
  | "em_uso"
  | "em_manutencao"
  | "reserva"
  | "inoperante";

export function StatusBadge({ value, className }: { value: StatusValue; className?: string }) {
  const status = getStatusMetadata(value);
  return (
    <Badge className={cn("border", status.className, className)} variant="outline">
      {status.label}
    </Badge>
  );
}
