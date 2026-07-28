create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique,
  full_name text not null,
  role text not null check (role in ('administrator', 'coordinator', 'technician', 'purchasing', 'viewer')),
  email text unique,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.demands (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  requester text not null,
  sector text not null,
  owner text not null,
  description text not null,
  priority text not null check (priority in ('low', 'medium', 'high', 'urgent')),
  status text not null check (status in ('open', 'in_progress', 'waiting_material', 'done', 'canceled')),
  notes text,
  request_date date not null default current_date,
  closed_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  category text not null,
  item text not null,
  quantity integer not null check (quantity > 0),
  justification text not null,
  priority text not null check (priority in ('low', 'medium', 'high', 'urgent')),
  requester text not null,
  sector text not null,
  cost_center text not null,
  estimated_value numeric(14,2) not null default 0,
  supplier text,
  status text not null check (status in ('draft', 'sent', 'review', 'approved', 'buying', 'received', 'done', 'rejected', 'canceled')),
  notes text,
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stock_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  internal_code text not null unique,
  quantity integer not null default 0,
  minimum_quantity integer not null default 0,
  location text not null,
  supplier text not null,
  unit_value numeric(14,2) not null default 0,
  purchase_date date,
  entry_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  stock_item_id uuid not null references public.stock_items (id) on delete cascade,
  movement_type text not null check (movement_type in ('entry', 'exit', 'transfer', 'write_off')),
  quantity integer not null,
  from_location text,
  to_location text,
  notes text,
  performed_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  patrimony_number text not null unique,
  model text not null,
  brand text not null,
  serial_number text,
  location text not null,
  responsible text not null,
  condition text not null check (condition in ('active', 'maintenance', 'reserved', 'damaged', 'written_off')),
  acquisition_date date,
  warranty_until date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  storage_path text not null,
  file_name text not null,
  file_type text not null,
  bucket_name text not null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  target_type text not null,
  target_id uuid,
  previous_values jsonb,
  new_values jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_demands_status on public.demands (status);
create index if not exists idx_demands_priority on public.demands (priority);
create index if not exists idx_demands_request_date on public.demands (request_date desc);
create index if not exists idx_requests_status on public.requests (status);
create index if not exists idx_stock_low on public.stock_items (quantity, minimum_quantity);
create index if not exists idx_activity_logs_created_at on public.activity_logs (created_at desc);

alter table public.profiles enable row level security;
alter table public.demands enable row level security;
alter table public.requests enable row level security;
alter table public.stock_items enable row level security;
alter table public.stock_movements enable row level security;
alter table public.assets enable row level security;
alter table public.attachments enable row level security;
alter table public.activity_logs enable row level security;

create policy "profiles read own or admin"
  on public.profiles
  for select
  using (true);

create policy "demands read authenticated"
  on public.demands
  for select
  using (auth.uid() is not null);

create policy "requests read authenticated"
  on public.requests
  for select
  using (auth.uid() is not null);

create policy "stock read authenticated"
  on public.stock_items
  for select
  using (auth.uid() is not null);

create policy "movements read authenticated"
  on public.stock_movements
  for select
  using (auth.uid() is not null);

create policy "assets read authenticated"
  on public.assets
  for select
  using (auth.uid() is not null);

create policy "attachments read authenticated"
  on public.attachments
  for select
  using (auth.uid() is not null);

create policy "activity read authenticated"
  on public.activity_logs
  for select
  using (auth.uid() is not null);
