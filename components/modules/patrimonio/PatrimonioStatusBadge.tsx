import { Badge } from "@/components/ui/badge";
import { getStatusMetadata } from "@/lib/status-metadata";
import type { PatrimonioStatus } from "@/types/patrimonio";

export function PatrimonioStatusBadge({ value }: { value: PatrimonioStatus }) {
  const status = getStatusMetadata(value);
  return <Badge className={`border ${status.className}`} variant="outline">{status.label}</Badge>;
}
