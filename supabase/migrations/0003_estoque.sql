drop table if exists public.stock_movements;
drop table if exists public.stock_items;

create table if not exists public.stock_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stock_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specification text not null,
  type text not null,
  category_id uuid not null references public.stock_categories (id) on delete restrict,
  quantity integer not null default 0 check (quantity >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_stock_items_category_id on public.stock_items (category_id);
create index if not exists idx_stock_items_type on public.stock_items (type);
create index if not exists idx_stock_items_quantity on public.stock_items (quantity);
create index if not exists idx_stock_items_name on public.stock_items (name);

drop trigger if exists trg_stock_categories_set_updated_at on public.stock_categories;
create trigger trg_stock_categories_set_updated_at
before update on public.stock_categories
for each row execute function public.set_updated_at();

drop trigger if exists trg_stock_items_set_updated_at on public.stock_items;
create trigger trg_stock_items_set_updated_at
before update on public.stock_items
for each row execute function public.set_updated_at();

alter table public.stock_categories enable row level security;
alter table public.stock_items enable row level security;

drop policy if exists "stock_categories read authenticated" on public.stock_categories;
drop policy if exists "stock_categories write authenticated" on public.stock_categories;
create policy "stock_categories read authenticated"
  on public.stock_categories
  for select
  using (true);

create policy "stock_categories write authenticated"
  on public.stock_categories
  for all
  using (true)
  with check (true);

drop policy if exists "stock_items read authenticated" on public.stock_items;
drop policy if exists "stock_items insert authenticated" on public.stock_items;
drop policy if exists "stock_items update authenticated" on public.stock_items;
drop policy if exists "stock_items delete authenticated" on public.stock_items;
create policy "stock_items read authenticated"
  on public.stock_items
  for select
  using (true);

create policy "stock_items insert authenticated"
  on public.stock_items
  for insert
  with check (true);

create policy "stock_items update authenticated"
  on public.stock_items
  for update
  using (true)
  with check (true);

create policy "stock_items delete authenticated"
  on public.stock_items
  for delete
  using (true);

insert into public.stock_categories (id, name, description)
values
  ('10000000-0000-0000-0000-000000000001', 'Computadores', 'Componentes e pecas para computadores.'),
  ('10000000-0000-0000-0000-000000000002', 'Rede', 'Equipamentos e materiais de rede.'),
  ('10000000-0000-0000-0000-000000000003', 'Perifericos', 'Mouse, teclado e acessorios.')
on conflict (id) do update
set
  name = excluded.name,
  description = excluded.description;

insert into public.stock_items (name, specification, type, category_id, quantity)
values
  ('SSD 240GB', 'SSD SATA 2.5 polegadas', 'Armazenamento', '10000000-0000-0000-0000-000000000001', 4),
  ('Fonte ATX 500W', 'Fonte 500W padrao ATX', 'Energia', '10000000-0000-0000-0000-000000000001', 12),
  ('Mouse USB', 'Mouse optico USB 2.0', 'Perifericos', '10000000-0000-0000-0000-000000000003', 28)
on conflict do nothing;
