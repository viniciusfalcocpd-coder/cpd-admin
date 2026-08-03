import { Badge } from "@/components/ui/badge";
import { getStatusMetadata } from "@/lib/status-metadata";
import { getInventarioAgenteStatus } from "@/types/inventario";
import type { InventarioEquipamento } from "@/types/inventario";

export function PatrimonioAgentBadge({ inventory }: { inventory: InventarioEquipamento | null }) {
  const status = getStatusMetadata(getInventarioAgenteStatus(inventory));
  return <Badge variant="outline" className={`border ${status.className}`}>{status.label}</Badge>;
}
