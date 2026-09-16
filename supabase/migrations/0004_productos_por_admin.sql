-- Cada admin (Marce, Miguel, Esteban) gestiona solo los productos que él/ella
-- sube. Los clientes del sitio público siguen viendo el catálogo completo de
-- todos los admins sin cambios (política de lectura pública ya existente).

alter table products add column created_by uuid references auth.users(id) default auth.uid();

-- Los productos ya cargados quedan asignados a Marce (primera cuenta admin real).
update products set created_by = (select id from auth.users where email = 'siufimarce.admin@gmail.com')
where created_by is null;

-- ── products: reemplaza la política "cualquier autenticado hace de todo" ────
drop policy "authenticated manage products" on products;

create policy "authenticated read own products" on products
  for select using (auth.role() = 'authenticated' and created_by = auth.uid());

create policy "authenticated insert own products" on products
  for insert with check (auth.role() = 'authenticated' and created_by = auth.uid());

create policy "authenticated update own products" on products
  for update using (created_by = auth.uid()) with check (created_by = auth.uid());

create policy "authenticated delete own products" on products
  for delete using (created_by = auth.uid());

-- ── product_images: mismo criterio, a través del producto dueño ─────────────
drop policy "authenticated manage product images" on product_images;

create policy "authenticated read own product images" on product_images
  for select using (
    exists (select 1 from products p where p.id = product_images.product_id and p.created_by = auth.uid())
  );

create policy "authenticated insert own product images" on product_images
  for insert with check (
    exists (select 1 from products p where p.id = product_images.product_id and p.created_by = auth.uid())
  );

create policy "authenticated delete own product images" on product_images
  for delete using (
    exists (select 1 from products p where p.id = product_images.product_id and p.created_by = auth.uid())
  );
