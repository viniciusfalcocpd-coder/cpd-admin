create table if not exists public.inventario_equipamento (
  id uuid primary key default gen_random_uuid(),
  patrimonio_id uuid not null unique references public.patrimonios (id) on delete cascade,
  agent_id text not null,
  agent_version text,
  collected_at timestamptz,
  hostname text,
  computer_manufacturer text,
  computer_model text,
  serial_number text,
  bios_version text,
  os_name text,
  os_version text,
  os_architecture text,
  os_kernel text,
  boot_time timestamptz,
  cpu_manufacturer text,
  cpu_model text,
  cpu_physical_cores integer,
  cpu_logical_cores integer,
  cpu_frequency_mhz numeric,
  memory_total_gb numeric,
  memory_installed_capacity_gb numeric,
  memory_total_slots integer,
  memory_used_slots integer,
  memory_free_slots integer,
  memory_modules jsonb not null default '[]'::jsonb,
  disks jsonb not null default '[]'::jsonb,
  networks jsonb not null default '[]'::jsonb,
  gpu jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_inventario_equipamento_agent_id
  on public.inventario_equipamento (agent_id);

drop trigger if exists trg_inventario_equipamento_set_updated_at on public.inventario_equipamento;
create trigger trg_inventario_equipamento_set_updated_at
before update on public.inventario_equipamento
for each row execute function public.set_updated_at();

alter table public.inventario_equipamento enable row level security;

drop policy if exists "inventario equipamento read authenticated" on public.inventario_equipamento;
drop policy if exists "inventario equipamento insert authenticated" on public.inventario_equipamento;
drop policy if exists "inventario equipamento update authenticated" on public.inventario_equipamento;
create policy "inventario equipamento read authenticated"
  on public.inventario_equipamento
  for select
  using (true);

create policy "inventario equipamento insert authenticated"
  on public.inventario_equipamento
  for insert
  with check (true);

create policy "inventario equipamento update authenticated"
  on public.inventario_equipamento
  for update
  using (true)
  with check (true);
