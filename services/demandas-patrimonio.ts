import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DemandaPatrimonio } from "@/types/demanda";

export async function getDemandasByPatrimonioId(patrimonioId: string): Promise<DemandaPatrimonio[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("demands")
    .select("id, number, requester, sector, owner, description, priority, status, notes, request_date, closed_at, patrimonio_id")
    .eq("patrimonio_id", patrimonioId)
    .order("request_date", { ascending: false });

  if (error) throw new Error(`Falha ao carregar demandas do patrimonio: ${error.message}`);
  return (data ?? []) as DemandaPatrimonio[];
}

export async function getPatrimonioIdsWithActiveDemand(patrimonioIds: string[]): Promise<Set<string>> {
  if (!patrimonioIds.length) return new Set();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("demands")
    .select("patrimonio_id")
    .in("patrimonio_id", patrimonioIds)
    .in("status", ["open", "in_progress", "waiting_material"]);
  if (error) throw new Error(`Falha ao carregar manutencoes ativas: ${error.message}`);
  return new Set((data ?? []).map((row) => row.patrimonio_id as string).filter(Boolean));
}
