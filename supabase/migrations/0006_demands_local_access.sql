-- O login atual do aplicativo opera em modo local e não cria uma sessão Supabase.
-- As policies anteriores exigiam auth.uid(), impedindo a abertura de demandas.
drop policy if exists "demands read authenticated" on public.demands;
create policy "demands read app users"
  on public.demands
  for select
  using (true);

drop policy if exists "demands write authenticated" on public.demands;
create policy "demands write app users"
  on public.demands
  for all
  using (true)
  with check (true);
