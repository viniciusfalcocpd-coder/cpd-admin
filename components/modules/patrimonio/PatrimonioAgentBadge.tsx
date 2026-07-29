import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getInventarioAgenteStatus, inventarioAgenteStatusLabel } from "@/types/inventario";
import type { InventarioEquipamento } from "@/types/inventario";

export function PatrimonioAgentBadge({ inventory }: { inventory: InventarioEquipamento | null }) {
  const status = getInventarioAgenteStatus(inventory);
  const tone = {
    sem_inventario: "text-muted-foreground",
    sincronizado: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    desatualizado: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  }[status];

  return <Badge variant="outline" className={cn(tone)}>{inventarioAgenteStatusLabel[status]}</Badge>;
}
