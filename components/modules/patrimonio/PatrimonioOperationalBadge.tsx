import { Badge } from "@/components/ui/badge";
import { getStatusMetadata } from "@/lib/status-metadata";
import type { PatrimonioSituacaoOperacional } from "@/types/patrimonio";

export function PatrimonioOperationalBadge({ value }: { value: PatrimonioSituacaoOperacional }) {
  const status = getStatusMetadata(value);
  return <Badge variant="outline" className={`border ${status.className}`}>{status.label}</Badge>;
}
