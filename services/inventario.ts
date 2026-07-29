import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { InventarioEquipamento } from "@/types/inventario";

const inventorySelect =
  "id, patrimonio_id, agent_id, agent_version, collected_at, hostname, computer_manufacturer, computer_model, serial_number, bios_version, os_name, os_version, os_architecture, os_kernel, boot_time, cpu_manufacturer, cpu_model, cpu_physical_cores, cpu_logical_cores, cpu_frequency_mhz, memory_total_gb, memory_installed_capacity_gb, memory_total_slots, memory_used_slots, memory_free_slots, memory_modules, disks, networks, gpu, created_at, updated_at";

export async function getInventarioByPatrimonioId(
  patrimonioId: string,
): Promise<InventarioEquipamento | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("inventario_equipamento")
    .select(inventorySelect)
    .eq("patrimonio_id", patrimonioId)
    .maybeSingle();

  if (error) throw new Error(`Falha ao carregar inventario: ${error.message}`);
  return (data as InventarioEquipamento | null) ?? null;
}

export async function getInventariosByPatrimonioIds(
  patrimonioIds: string[],
): Promise<InventarioEquipamento[]> {
  if (!patrimonioIds.length) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("inventario_equipamento")
    .select(inventorySelect)
    .in("patrimonio_id", patrimonioIds);

  if (error) throw new Error(`Falha ao carregar inventarios: ${error.message}`);
  return (data ?? []) as InventarioEquipamento[];
}
