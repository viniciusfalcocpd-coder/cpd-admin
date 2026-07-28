create table if not exists public.secretarias (
  id uuid primary key default gen_random_uuid(),
  codigo integer not null unique,
  nome text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.equipamentos (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.tecnologias (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.patrimonio_sequencias (
  secretaria_id uuid primary key references public.secretarias (id) on delete cascade,
  ultimo_numero integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.patrimonios (
  id uuid primary key default gen_random_uuid(),
  patrimonio text not null unique,
  secretaria_id uuid not null references public.secretarias (id) on delete restrict,
  equipamento_id uuid not null references public.equipamentos (id) on delete restrict,
  tecnologia_id uuid references public.tecnologias (id) on delete set null,
  marca text not null,
  responsavel text not null,
  problema text,
  diagnostico text,
  solucao text,
  status text not null check (status in ('pending', 'in_maintenance', 'waiting_parts', 'ready', 'written_off')),
  arquivado boolean not null default false,
  condenado boolean not null default false,
  pecas_retiradas jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_patrimonios_secretaria_id on public.patrimonios (secretaria_id);
create index if not exists idx_patrimonios_equipamento_id on public.patrimonios (equipamento_id);
create index if not exists idx_patrimonios_tecnologia_id on public.patrimonios (tecnologia_id);
create index if not exists idx_patrimonios_arquivado on public.patrimonios (arquivado, status);
create index if not exists idx_patrimonios_responsavel on public.patrimonios (responsavel);
create index if not exists idx_patrimonios_patrimonio on public.patrimonios (patrimonio);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_patrimonios_set_updated_at on public.patrimonios;
create trigger trg_patrimonios_set_updated_at
before update on public.patrimonios
for each row execute function public.set_updated_at();

drop trigger if exists trg_patrimonio_sequencias_set_updated_at on public.patrimonio_sequencias;
create trigger trg_patrimonio_sequencias_set_updated_at
before update on public.patrimonio_sequencias
for each row execute function public.set_updated_at();

alter table public.secretarias enable row level security;
alter table public.equipamentos enable row level security;
alter table public.tecnologias enable row level security;
alter table public.patrimonios enable row level security;

drop policy if exists "secretarias read authenticated" on public.secretarias;
drop policy if exists "secretarias write authenticated" on public.secretarias;
create policy "secretarias read authenticated"
  on public.secretarias
  for select
  using (true);

create policy "secretarias write authenticated"
  on public.secretarias
  for all
  using (true)
  with check (true);

drop policy if exists "equipamentos read authenticated" on public.equipamentos;
drop policy if exists "equipamentos write authenticated" on public.equipamentos;
create policy "equipamentos read authenticated"
  on public.equipamentos
  for select
  using (true);

create policy "equipamentos write authenticated"
  on public.equipamentos
  for all
  using (true)
  with check (true);

drop policy if exists "tecnologias read authenticated" on public.tecnologias;
drop policy if exists "tecnologias write authenticated" on public.tecnologias;
create policy "tecnologias read authenticated"
  on public.tecnologias
  for select
  using (true);

create policy "tecnologias write authenticated"
  on public.tecnologias
  for all
  using (true)
  with check (true);

drop policy if exists "patrimonios read authenticated" on public.patrimonios;
drop policy if exists "patrimonios write authenticated" on public.patrimonios;
drop policy if exists "patrimonios update authenticated" on public.patrimonios;
drop policy if exists "patrimonios delete authenticated" on public.patrimonios;
create policy "patrimonios read authenticated"
  on public.patrimonios
  for select
  using (true);

create policy "patrimonios write authenticated"
  on public.patrimonios
  for insert
  with check (true);

create policy "patrimonios update authenticated"
  on public.patrimonios
  for update
  using (true)
  with check (true);

create policy "patrimonios delete authenticated"
  on public.patrimonios
  for delete
  using (true);

insert into public.secretarias (codigo, nome)
values
  (101, 'Gabinete'),
  (102, 'Educacao'),
  (103, 'Administracao')
on conflict (codigo) do nothing;

insert into public.equipamentos (nome)
values
  ('Desktop'),
  ('Notebook'),
  ('Monitor'),
  ('Impressora'),
  ('Scanner'),
  ('Switch'),
  ('Access Point'),
  ('Nobreak'),
  ('Servidor'),
  ('Tablet'),
  ('Telefone IP'),
  ('Projetor'),
  ('Mini PC'),
  ('Thin Client'),
  ('Roteador')
on conflict (nome) do nothing;

insert into public.tecnologias (nome)
values
  ('DDR2'),
  ('DDR3'),
  ('DDR4'),
  ('DDR5'),
  ('LPDDR4'),
  ('LPDDR5'),
  ('Não informado')
on conflict (nome) do nothing;
