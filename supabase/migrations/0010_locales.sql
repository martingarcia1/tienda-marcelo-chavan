-- Cada local tiene un dueño (cuenta de admin): su vidriera muestra los
-- productos que carga esa cuenta. modo_compra define si el local vende
-- online o solo recibe consultas por WhatsApp.
create table locales (
  slug text primary key,
  nombre text not null,
  owner_id uuid references auth.users(id) on delete set null,
  modo_compra text not null default 'consulta' check (modo_compra in ('consulta', 'online')),
  sort_order integer not null default 0
);

alter table locales enable row level security;

create policy "public read locales" on locales for select using (true);

insert into locales (slug, nombre, owner_id, sort_order) values
  ('sede-central', 'Sede Central', (select id from auth.users where email = 'siufimiguel.admin@gmail.com'), 0),
  ('peatonal-mendoza', 'Peatonal Mendoza', (select id from auth.users where id = 'b1fa637d-309b-445d-bf04-99d2b33b0000'), 1),
  ('galeria-ancel-9', 'Galería Áncel 9', (select id from auth.users where email = 'siufimarce.admin@gmail.com'), 2);
