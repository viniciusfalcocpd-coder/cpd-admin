"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { archivePatrimonioRecord, getPatrimonioRecordById, updatePatrimonioRecord } from "@/services/patrimonio";

const openDemandSchema = z.object({
  patrimonioId: z.string().uuid(),
  requester: z.string().trim().min(1),
  sector: z.string().trim().min(1),
  owner: z.string().trim().min(1),
  description: z.string().trim().min(3),
  priority: z.enum(["low", "medium", "high", "urgent"]),
});

export async function openPatrimonioDemandaAction(values: unknown) {
  const input = openDemandSchema.parse(values);
  const patrimonio = await getPatrimonioRecordById(input.patrimonioId);
  if (!patrimonio) throw new Error("Patrimonio nao encontrado.");

  const supabase = await createSupabaseServerClient();
  const number = `DEM-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
  const { data, error } = await supabase.from("demands").insert({
    number,
    requester: input.requester,
    sector: input.sector,
    owner: input.owner,
    description: input.description,
    priority: input.priority,
    status: "open",
    patrimonio_id: patrimonio.id,
    request_date: new Date().toISOString().slice(0, 10),
  }).select("id, number").single();

  if (error || !data) throw new Error(`Falha ao abrir demanda: ${error?.message ?? "registro nao retornado"}`);

  const updated = {
    patrimonio: patrimonio.patrimonio,
    secretaria_id: patrimonio.secretaria_id,
    equipamento_id: patrimonio.equipamento_id,
    tecnologia_id: patrimonio.tecnologia_id ?? "",
    marca: patrimonio.marca,
    responsavel: patrimonio.responsavel,
    status: patrimonio.status,
    situacao_operacional: "em_manutencao" as const,
    condenado: patrimonio.condenado,
    pecas_retiradas: patrimonio.pecas_retiradas,
    problema: "",
    diagnostico: "",
    solucao: "",
  };
  await updatePatrimonioRecord(patrimonio.id, updated);
  revalidatePath(`/patrimonio/${patrimonio.id}`);
  revalidatePath("/patrimonio");
  revalidatePath("/demandas");
  return data;
}

export type DemandaConclusaoDestino = "em_uso" | "reserva" | "inoperante" | "baixa";

export async function concludePatrimonioDemandaAction(demandaId: string, destino: DemandaConclusaoDestino) {
  const supabase = await createSupabaseServerClient();
  const { data: demand, error: demandError } = await supabase
    .from("demands")
    .select("id, patrimonio_id")
    .eq("id", demandaId)
    .maybeSingle();
  if (demandError || !demand) throw new Error("Demanda nao encontrada.");

  if (demand.patrimonio_id) {
    if (destino === "baixa") {
      await archivePatrimonioRecord(demand.patrimonio_id);
    } else {
      const patrimonio = await getPatrimonioRecordById(demand.patrimonio_id);
      if (patrimonio) await updatePatrimonioRecord(demand.patrimonio_id, {
        patrimonio: patrimonio.patrimonio,
        secretaria_id: patrimonio.secretaria_id,
        equipamento_id: patrimonio.equipamento_id,
        tecnologia_id: patrimonio.tecnologia_id ?? "",
        marca: patrimonio.marca,
        responsavel: patrimonio.responsavel,
        status: patrimonio.status,
        situacao_operacional: destino,
        condenado: patrimonio.condenado,
        pecas_retiradas: patrimonio.pecas_retiradas,
        problema: "",
        diagnostico: "",
        solucao: "",
      });
    }
    revalidatePath(`/patrimonio/${demand.patrimonio_id}`);
    revalidatePath("/patrimonio");
  }

  const { error } = await supabase.from("demands").update({ status: "done", closed_at: new Date().toISOString() }).eq("id", demandaId);
  if (error) throw new Error(`Falha ao concluir demanda: ${error.message}`);
  revalidatePath("/demandas");
}
