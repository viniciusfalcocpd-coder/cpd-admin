import { z } from "zod";

export type PatrimonioStatus = "pending" | "in_maintenance" | "waiting_parts" | "ready" | "written_off";

export type PatrimonioTab = "ativos" | "arquivados";

export type PatrimonioMode = "create" | "edit";

export interface SecretariaLookup {
  id: string;
  codigo: number;
  nome: string;
  created_at: string;
}

export interface EquipamentoLookup {
  id: string;
  nome: string;
  created_at: string;
}

export interface TecnologiaLookup {
  id: string;
  nome: string;
  created_at: string;
}

export interface PatrimonioRecord {
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
  pecas_retiradas: string[];
  created_at: string;
  updated_at: string;
}

export interface PatrimonioFormValues {
  patrimonio: string;
  secretaria_id: string;
  equipamento_id: string;
  tecnologia_id: string;
  marca: string;
  responsavel: string;
  status: PatrimonioStatus;
  problema: string;
  diagnostico: string;
  solucao: string;
  condenado: boolean;
  pecas_retiradas: string[];
}

export interface PatrimonioPageData {
  patrimonios: PatrimonioRecord[];
  secretarias: SecretariaLookup[];
  equipamentos: EquipamentoLookup[];
  tecnologias: TecnologiaLookup[];
}

export const patrimonioStatusOptions: Array<{ value: PatrimonioStatus; label: string }> = [
  { value: "pending", label: "Pendente" },
  { value: "in_maintenance", label: "Em manutencao" },
  { value: "waiting_parts", label: "Aguardando pecas" },
  { value: "ready", label: "Pronto" },
  { value: "written_off", label: "Baixa patrimonial" },
];

export const patrimonioFormSchema = z.object({
  patrimonio: z.string().min(1, "Informe o patrimonio."),
  secretaria_id: z.string().min(1, "Selecione a secretaria."),
  equipamento_id: z.string().min(1, "Selecione o equipamento."),
  tecnologia_id: z.string().optional().default(""),
  marca: z.string().min(1, "Informe a marca."),
  responsavel: z.string().min(1, "Informe o responsavel."),
  status: z.enum(["pending", "in_maintenance", "waiting_parts", "ready", "written_off"]),
  problema: z.string().default(""),
  diagnostico: z.string().default(""),
  solucao: z.string().default(""),
  condenado: z.boolean().default(false),
  pecas_retiradas: z.array(z.string()).default([]),
});

export type PatrimonioFormInput = z.infer<typeof patrimonioFormSchema>;

export const patrimonioEditableFields = [
  "secretaria_id",
  "equipamento_id",
  "tecnologia_id",
  "marca",
  "responsavel",
  "status",
  "problema",
  "diagnostico",
  "solucao",
  "condenado",
  "pecas_retiradas",
] as const;

export const patrimonioStatusLabel: Record<PatrimonioStatus, string> = {
  pending: "Pendente",
  in_maintenance: "Em manutencao",
  waiting_parts: "Aguardando pecas",
  ready: "Pronto",
  written_off: "Baixa patrimonial",
};
