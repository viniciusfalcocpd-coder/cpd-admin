alter table public.patrimonios
  add column if not exists situacao_operacional text not null default 'em_uso';

alter table public.patrimonios
  drop constraint if exists patrimonios_situacao_operacional_check;

alter table public.patrimonios
  add constraint patrimonios_situacao_operacional_check
  check (situacao_operacional in ('em_uso', 'em_manutencao', 'reserva', 'inoperante'));

alter table public.demands
  add column if not exists patrimonio_id uuid references public.patrimonios (id) on delete set null;

create index if not exists idx_demands_patrimonio_id on public.demands (patrimonio_id);

drop policy if exists "demands write authenticated" on public.demands;
create policy "demands write authenticated"
  on public.demands
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);
