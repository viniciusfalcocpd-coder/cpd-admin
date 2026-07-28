insert into public.profiles (id, full_name, role, active)
values
  (gen_random_uuid(), 'Vinicius Oliveira', 'administrator', true),
  (gen_random_uuid(), 'Larissa Souza', 'coordinator', true),
  (gen_random_uuid(), 'Pedro Henrique', 'technician', true)
on conflict do nothing;

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
  ('Nao informado')
on conflict (nome) do nothing;
