export interface InventarioEquipamento {
  id: string;
  patrimonio_id: string;
  agent_id: string;
  agent_version: string | null;
  collected_at: string | null;
  hostname: string | null;
  computer_manufacturer: string | null;
  computer_model: string | null;
  serial_number: string | null;
  bios_version: string | null;
  os_name: string | null;
  os_version: string | null;
  os_architecture: string | null;
  os_kernel: string | null;
  boot_time: string | null;
  cpu_manufacturer: string | null;
  cpu_model: string | null;
  cpu_physical_cores: number | null;
  cpu_logical_cores: number | null;
  cpu_frequency_mhz: number | null;
  memory_total_gb: number | null;
  memory_installed_capacity_gb: number | null;
  memory_total_slots: number | null;
  memory_used_slots: number | null;
  memory_free_slots: number | null;
  memory_modules: unknown[];
  disks: unknown[];
  networks: unknown[];
  gpu: unknown[];
  created_at: string;
  updated_at: string;
}

export const INVENTORY_STALE_AFTER_DAYS = 7;

export function getInventarioAgenteStatus(
  inventory: Pick<InventarioEquipamento, "collected_at"> | null,
): "sem_inventario" | "sincronizado" | "desatualizado" {
  if (!inventory?.collected_at) return "sem_inventario";

  const age = Date.now() - new Date(inventory.collected_at).getTime();
  return age <= INVENTORY_STALE_AFTER_DAYS * 24 * 60 * 60 * 1000
    ? "sincronizado"
    : "desatualizado";
}

export const inventarioAgenteStatusLabel = {
  sem_inventario: "Sem inventario",
  sincronizado: "Sincronizado",
  desatualizado: "Desatualizado",
} as const;
