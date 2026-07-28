import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  EquipamentoLookup,
  PatrimonioFormInput,
  PatrimonioPageData,
  PatrimonioRecord,
  PatrimonioStatus,
  SecretariaLookup,
  TecnologiaLookup,
} from "@/types/patrimonio";

type SecretariaRow = SecretariaLookup;
type EquipamentoRow = EquipamentoLookup;
type TecnologiaRow = TecnologiaLookup;

type PatrimonioRow = {
  id: string;
  patrimonio: string;
  secretaria_id: string;
  equipamento_id: string;
  tecnologia_id: string | null;
  marca: string;
  responsavel: string;
  problema: string | null;
  diagnostico: string | null;
  solucao: string | null;
  status: PatrimonioStatus;
  arquivado: boolean;
  condenado: boolean;
  pecas_retiradas: string[] | string | null;
  created_at: string;
  updated_at: string;
};

type PatrimonioPayload = {
  patrimonio: string;
  secretaria_id: string;
  equipamento_id: string;
  tecnologia_id: string | null;
  marca: string;
  responsavel: string;
  problema: string | null;
  diagnostico: string | null;
  solucao: string | null;
  status: PatrimonioStatus;
  arquivado: boolean;
  condenado: boolean;
  pecas_retiradas: string[];
};

function normalizeText(value: string) {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function normalizePecasRetiradas(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function mapPatrimonioRow(row: PatrimonioRow): PatrimonioRecord {
  return {
    ...row,
    tecnologia_id: row.tecnologia_id ?? null,
    problema: row.problema ?? null,
    diagnostico: row.diagnostico ?? null,
    solucao: row.solucao ?? null,
    pecas_retiradas: normalizePecasRetiradas(row.pecas_retiradas),
  };
}

async function getClient() {
  return createSupabaseServerClient();
}

async function fetchSecretarias() {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from("secretarias")
    .select("id, codigo, nome, created_at")
    .order("codigo", { ascending: true });

  if (error) {
    throw new Error(`Falha ao carregar secretarias: ${error.message}`);
  }

  return (data ?? []) as SecretariaRow[];
}

async function fetchEquipamentos() {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from("equipamentos")
    .select("id, nome, created_at")
    .order("nome", { ascending: true });

  if (error) {
    throw new Error(`Falha ao carregar equipamentos: ${error.message}`);
  }

  return (data ?? []) as EquipamentoRow[];
}

async function fetchTecnologias() {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from("tecnologias")
    .select("id, nome, created_at")
    .order("nome", { ascending: true });

  if (error) {
    throw new Error(`Falha ao carregar tecnologias: ${error.message}`);
  }

  return (data ?? []) as TecnologiaRow[];
}

async function fetchPatrimonios() {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from("patrimonios")
    .select(
      "id, patrimonio, secretaria_id, equipamento_id, tecnologia_id, marca, responsavel, problema, diagnostico, solucao, status, arquivado, condenado, pecas_retiradas, created_at, updated_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Falha ao carregar patrimonios: ${error.message}`);
  }

  return ((data ?? []) as PatrimonioRow[]).map(mapPatrimonioRow);
}

export async function getPatrimonioPageData(): Promise<PatrimonioPageData> {
  const [secretarias, equipamentos, tecnologias, patrimonios] = await Promise.all([
    fetchSecretarias(),
    fetchEquipamentos(),
    fetchTecnologias(),
    fetchPatrimonios(),
  ]);

  return {
    secretarias,
    equipamentos,
    tecnologias,
    patrimonios,
  };
}

export async function getPatrimonioRecordById(id: string): Promise<PatrimonioRecord | null> {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from("patrimonios")
    .select(
      "id, patrimonio, secretaria_id, equipamento_id, tecnologia_id, marca, responsavel, problema, diagnostico, solucao, status, arquivado, condenado, pecas_retiradas, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Falha ao carregar patrimonio: ${error.message}`);
  }

  return data ? mapPatrimonioRow(data as PatrimonioRow) : null;
}

export async function createPatrimonioRecord(input: PatrimonioFormInput): Promise<PatrimonioRecord> {
  const supabase = await getClient();
  const payload: PatrimonioPayload = {
    patrimonio: input.patrimonio.trim(),
    secretaria_id: input.secretaria_id,
    equipamento_id: input.equipamento_id,
    tecnologia_id: input.tecnologia_id.trim() ? input.tecnologia_id : null,
    marca: input.marca.trim(),
    responsavel: input.responsavel.trim(),
    problema: normalizeText(input.problema),
    diagnostico: normalizeText(input.diagnostico),
    solucao: normalizeText(input.solucao),
    status: input.status,
    arquivado: input.status === "written_off",
    condenado: input.condenado,
    pecas_retiradas: input.condenado ? input.pecas_retiradas : [],
  };

  const { data, error } = await supabase.from("patrimonios").insert(payload).select(
    "id, patrimonio, secretaria_id, equipamento_id, tecnologia_id, marca, responsavel, problema, diagnostico, solucao, status, arquivado, condenado, pecas_retiradas, created_at, updated_at",
  ).single();

  if (error || !data) {
    throw new Error(`Falha ao criar patrimonio: ${error?.message ?? "registro nao retornado"}`);
  }

  return mapPatrimonioRow(data as PatrimonioRow);
}

export async function updatePatrimonioRecord(
  id: string,
  input: PatrimonioFormInput,
): Promise<PatrimonioRecord> {
  const supabase = await getClient();
  const payload: PatrimonioPayload = {
    patrimonio: input.patrimonio.trim(),
    secretaria_id: input.secretaria_id,
    equipamento_id: input.equipamento_id,
    tecnologia_id: input.tecnologia_id.trim() ? input.tecnologia_id : null,
    marca: input.marca.trim(),
    responsavel: input.responsavel.trim(),
    problema: normalizeText(input.problema),
    diagnostico: normalizeText(input.diagnostico),
    solucao: normalizeText(input.solucao),
    status: input.status,
    arquivado: input.status === "written_off",
    condenado: input.condenado,
    pecas_retiradas: input.condenado ? input.pecas_retiradas : [],
  };

  const { data, error } = await supabase
    .from("patrimonios")
    .update(payload)
    .eq("id", id)
    .select(
      "id, patrimonio, secretaria_id, equipamento_id, tecnologia_id, marca, responsavel, problema, diagnostico, solucao, status, arquivado, condenado, pecas_retiradas, created_at, updated_at",
    )
    .single();

  if (error || !data) {
    throw new Error(`Falha ao atualizar patrimonio: ${error?.message ?? "registro nao retornado"}`);
  }

  return mapPatrimonioRow(data as PatrimonioRow);
}

export async function archivePatrimonioRecord(id: string): Promise<PatrimonioRecord> {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from("patrimonios")
    .update({
      status: "written_off",
      arquivado: true,
    })
    .eq("id", id)
    .select(
      "id, patrimonio, secretaria_id, equipamento_id, tecnologia_id, marca, responsavel, problema, diagnostico, solucao, status, arquivado, condenado, pecas_retiradas, created_at, updated_at",
    )
    .single();

  if (error || !data) {
    throw new Error(`Falha ao arquivar patrimonio: ${error?.message ?? "registro nao retornado"}`);
  }

  return mapPatrimonioRow(data as PatrimonioRow);
}
