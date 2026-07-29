import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const optionalString = z.string().trim().optional().nullable();
const optionalNumber = z.number().finite().optional().nullable();

const inventorySchema = z.object({
  patrimonio: z.union([z.string(), z.number()]).transform(String).pipe(z.string().trim().min(1)),
  patrimonioId: z.string().trim().uuid(),
  agent: z.object({
    id: z.string().trim().min(1),
    version: optionalString,
    collectedAt: optionalString,
  }),
  computer: z.object({
    hostname: optionalString,
    manufacturer: optionalString,
    model: optionalString,
    serialNumber: optionalString,
    biosVersion: optionalString,
  }).optional().default({}),
  operatingSystem: z.object({
    hostname: optionalString,
    name: optionalString,
    version: optionalString,
    architecture: optionalString,
    kernel: optionalString,
    bootTime: optionalString,
  }).optional().default({}),
  processor: z.object({
    manufacturer: optionalString,
    model: optionalString,
    physicalCores: optionalNumber,
    logicalCores: optionalNumber,
    frequencyMhz: optionalNumber,
  }).optional().default({}),
  memory: z.object({
    totalGb: optionalNumber,
    installedCapacityGb: optionalNumber,
    totalSlots: optionalNumber,
    usedSlots: optionalNumber,
    freeSlots: optionalNumber,
    modules: z.array(z.unknown()).optional().default([]),
  }).optional().default({}),
  disks: z.array(z.unknown()).optional().default([]),
  networks: z.array(z.unknown()).optional().default([]),
  gpu: z.array(z.unknown()).optional().default([]),
});

type Inventory = z.infer<typeof inventorySchema>;

function nullable(value: string | number | null | undefined) {
  return value === undefined || value === null || value === "" ? null : value;
}

function toInteger(value: number | null | undefined) {
  return value === undefined || value === null ? null : Math.trunc(value);
}

function toTimestamp(value: string | null | undefined) {
  if (!value) return null;
  return Number.isNaN(Date.parse(value)) ? null : value;
}

function toDatabaseRow(input: Inventory, patrimonioId: string) {
  return {
    patrimonio_id: patrimonioId,
    agent_id: input.agent.id.trim(),
    agent_version: nullable(input.agent.version),
    collected_at: toTimestamp(input.agent.collectedAt),
    hostname: nullable(input.computer.hostname ?? input.operatingSystem.hostname),
    computer_manufacturer: nullable(input.computer.manufacturer),
    computer_model: nullable(input.computer.model),
    serial_number: nullable(input.computer.serialNumber),
    bios_version: nullable(input.computer.biosVersion),
    os_name: nullable(input.operatingSystem.name),
    os_version: nullable(input.operatingSystem.version),
    os_architecture: nullable(input.operatingSystem.architecture),
    os_kernel: nullable(input.operatingSystem.kernel),
    boot_time: toTimestamp(input.operatingSystem.bootTime),
    cpu_manufacturer: nullable(input.processor.manufacturer),
    cpu_model: nullable(input.processor.model),
    cpu_physical_cores: toInteger(input.processor.physicalCores),
    cpu_logical_cores: toInteger(input.processor.logicalCores),
    cpu_frequency_mhz: nullable(input.processor.frequencyMhz),
    memory_total_gb: nullable(input.memory.totalGb),
    memory_installed_capacity_gb: nullable(input.memory.installedCapacityGb),
    memory_total_slots: toInteger(input.memory.totalSlots),
    memory_used_slots: toInteger(input.memory.usedSlots),
    memory_free_slots: toInteger(input.memory.freeSlots),
    memory_modules: input.memory.modules,
    disks: input.disks,
    networks: input.networks,
    gpu: input.gpu,
  };
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Inventário inválido" }, { status: 400 });
  }

  const parsed = inventorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Inventário inválido" }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: patrimonio, error: patrimonioError } = await supabase
      .from("patrimonios")
      .select("id, patrimonio")
      .eq("id", parsed.data.patrimonioId)
      .eq("patrimonio", parsed.data.patrimonio)
      .maybeSingle();

    if (patrimonioError) throw patrimonioError;
    if (!patrimonio) {
      return NextResponse.json(
        { success: false, error: "Patrimônio não encontrado" },
        { status: 404 },
      );
    }

    const { error: inventoryError } = await supabase
      .from("inventario_equipamento")
      .upsert(toDatabaseRow(parsed.data, patrimonio.id), { onConflict: "patrimonio_id" });

    if (inventoryError) throw inventoryError;

    return NextResponse.json({
      success: true,
      data: { patrimonio: patrimonio.patrimonio, inventoryUpdated: true },
    });
  } catch (error) {
    console.error("Erro ao salvar inventário do agente:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno ao salvar inventário" },
      { status: 500 },
    );
  }
}
