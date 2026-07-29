import type { DemandStatus, Priority } from "@/types/cpd";

export interface DemandaPatrimonio {
  id: string;
  number: string;
  requester: string;
  sector: string;
  owner: string;
  description: string;
  priority: Priority;
  status: DemandStatus;
  notes: string | null;
  request_date: string;
  closed_at: string | null;
  patrimonio_id: string;
}

export const demandaStatusAtivo: DemandStatus[] = ["open", "in_progress", "waiting_material"];
