import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getInventarioByPatrimonioId, getInventariosByPatrimonioIds } from "@/services/inventario";
import { getPatrimonioIdsWithActiveDemand } from "@/services/demandas-patrimonio";
import type {
  EquipamentoLookup,
  PatrimonioFormInput,
  PatrimonioPageData,
  PatrimonioRecord,
  PatrimonioStatus,
  PatrimonioSituacaoOperacional,
  SecretariaLookup,
  TecnologiaLookup,
} from "@/types/patrimonio";
import { patrimonioStatusLabel } from "@/types/patrimonio";

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
  situacao_operacional: PatrimonioSituacaoOperacional;
};

type PatrimonioPayload = {
  patrimonio: string;
  secretaria_id: string;
  equipamento_id: string;
  tecnologia_id: string | null;
  marca: string;
  responsavel: string;
  problema?: string | null;
  diagnostico?: string | null;
  solucao?: string | null;
  status: PatrimonioStatus;
  arquivado: boolean;
  condenado: boolean;
  pecas_retiradas: string[];
  situacao_operacional: PatrimonioSituacaoOperacional;
};

type PatrimonioAgenteLookup = {
  id: string;
  patrimonio: string;
  equipamento: string;
  secretaria: string;
  responsavel: string;
  status: string;
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

function mapPatrimonioRow(row: PatrimonioRow): Omit<PatrimonioRecord, "inventario"> {
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

function formatSecretaria(secretaria: SecretariaRow | null) {
  if (!secretaria) {
    return "Não informado";
  }

  return `${secretaria.codigo} - ${secretaria.nome}`;
}

function formatStatus(status: PatrimonioStatus) {
  return patrimonioStatusLabel[status];
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
      "id, patrimonio, secretaria_id, equipamento_id, tecnologia_id, marca, responsavel, problema, diagnostico, solucao, status, arquivado, condenado, pecas_retiradas, situacao_operacional, created_at, updated_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Falha ao carregar patrimonios: ${error.message}`);
  }

  const rows = (data ?? []) as PatrimonioRow[];
  const inventories = await getInventariosByPatrimonioIds(rows.map((row) => row.id));
  const activeDemandPatrimonioIds = await getPatrimonioIdsWithActiveDemand(rows.map((row) => row.id));
  const inventoryByPatrimonioId = new Map(inventories.map((inventory) => [inventory.patrimonio_id, inventory]));

  return rows.map((row) => ({
    ...mapPatrimonioRow(row),
    situacao_operacional: activeDemandPatrimonioIds.has(row.id) ? "em_manutencao" : row.situacao_operacional,
    inventario: inventoryByPatrimonioId.get(row.id) ?? null,
  }));
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
      "id, patrimonio, secretaria_id, equipamento_id, tecnologia_id, marca, responsavel, problema, diagnostico, solucao, status, arquivado, condenado, pecas_retiradas, situacao_operacional, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Falha ao carregar patrimonio: ${error.message}`);
  }

  if (!data) return null;
  const inventory = await getInventarioByPatrimonioId(id);
  return { ...mapPatrimonioRow(data as PatrimonioRow), inventario: inventory };
}

export async function getPatrimonioForAgenteByNumero(
  patrimonio: string,
): Promise<PatrimonioAgenteLookup | null> {
  const supabase = await getClient();
  const { data: patrimonioRow, error: patrimonioError } = await supabase
    .from("patrimonios")
    .select("id, patrimonio, secretaria_id, equipamento_id, responsavel, status")
    .eq("patrimonio", patrimonio)
    .maybeSingle();

  if (patrimonioError) {
    throw new Error(`Falha ao consultar patrimonio: ${patrimonioError.message}`);
  }

  if (!patrimonioRow) {
    return null;
  }

  const [secretariaResult, equipamentoResult] = await Promise.all([
    supabase
      .from("secretarias")
      .select("id, codigo, nome")
      .eq("id", patrimonioRow.secretaria_id)
      .maybeSingle(),
    supabase
      .from("equipamentos")
      .select("id, nome")
      .eq("id", patrimonioRow.equipamento_id)
      .maybeSingle(),
  ]);

  if (secretariaResult.error) {
    throw new Error(`Falha ao consultar secretaria do patrimonio: ${secretariaResult.error.message}`);
  }

  if (equipamentoResult.error) {
    throw new Error(`Falha ao consultar equipamento do patrimonio: ${equipamentoResult.error.message}`);
  }

  return {
    id: patrimonioRow.id,
    patrimonio: patrimonioRow.patrimonio,
    equipamento: equipamentoResult.data?.nome ?? "Não informado",
    secretaria: formatSecretaria(secretariaResult.data as SecretariaRow | null),
    responsavel: patrimonioRow.responsavel,
    status: formatStatus(patrimonioRow.status as PatrimonioStatus),
  };
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
    problema: null,
    diagnostico: null,
    solucao: null,
    status: input.status,
    arquivado: input.status === "written_off",
    condenado: input.condenado,
    pecas_retiradas: input.condenado ? input.pecas_retiradas : [],
    situacao_operacional: input.situacao_operacional,
  };

  const { data, error } = await supabase.from("patrimonios").insert(payload).select(
    "id, patrimonio, secretaria_id, equipamento_id, tecnologia_id, marca, responsavel, problema, diagnostico, solucao, status, arquivado, condenado, pecas_retiradas, situacao_operacional, created_at, updated_at",
  ).single();

  if (error || !data) {
    throw new Error(`Falha ao criar patrimonio: ${error?.message ?? "registro nao retornado"}`);
  }

  return { ...mapPatrimonioRow(data as PatrimonioRow), inventario: null };
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
    status: input.status,
    arquivado: input.status === "written_off",
    condenado: input.condenado,
    pecas_retiradas: input.condenado ? input.pecas_retiradas : [],
    situacao_operacional: input.situacao_operacional,
  };

  const { data, error } = await supabase
    .from("patrimonios")
    .update(payload)
    .eq("id", id)
    .select(
      "id, patrimonio, secretaria_id, equipamento_id, tecnologia_id, marca, responsavel, problema, diagnostico, solucao, status, arquivado, condenado, pecas_retiradas, situacao_operacional, created_at, updated_at",
    )
    .single();

  if (error || !data) {
    throw new Error(`Falha ao atualizar patrimonio: ${error?.message ?? "registro nao retornado"}`);
  }

  const inventory = await getInventarioByPatrimonioId(id);
  return { ...mapPatrimonioRow(data as PatrimonioRow), inventario: inventory };
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
      "id, patrimonio, secretaria_id, equipamento_id, tecnologia_id, marca, responsavel, problema, diagnostico, solucao, status, arquivado, condenado, pecas_retiradas, situacao_operacional, created_at, updated_at",
    )
    .single();

  if (error || !data) {
    throw new Error(`Falha ao arquivar patrimonio: ${error?.message ?? "registro nao retornado"}`);
  }

  const inventory = await getInventarioByPatrimonioId(id);
  return { ...mapPatrimonioRow(data as PatrimonioRow), inventario: inventory };
}
