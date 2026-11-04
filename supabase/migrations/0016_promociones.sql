-- Publicidad: cada admin sube imágenes o videos de su local. Se muestran en
-- el carrusel del inicio y en la página de Novedades (mezclando los locales).

create table promociones (
  id uuid primary key default gen_random_uuid(),
  local_slug text not null references locales(slug) on delete cascade,
  tipo text not null check (tipo in ('imagen', 'video')),
  storage_path text not null,
  titulo text,
  boton_texto text,
  -- '/ruta/interna', 'whatsapp' o un enlace externo (https://...).
  boton_url text,
  activo boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

create index promociones_activo_idx on promociones (activo, sort_order);

alter table promociones enable row level security;

-- Público: solo lo activo.
create policy "public read active promociones" on promociones
  for select using (activo);

-- Cada admin ve, crea, edita y borra solo lo suyo, y solo para su propio local.
create policy "authenticated read own promociones" on promociones
  for select using (auth.role() = 'authenticated' and created_by = auth.uid());

create policy "authenticated insert own promociones" on promociones
  for insert with check (
    created_by = auth.uid()
    and exists (select 1 from locales l where l.slug = local_slug and l.owner_id = auth.uid())
  );

create policy "authenticated update own promociones" on promociones
  for update using (created_by = auth.uid())
  with check (
    created_by = auth.uid()
    and exists (select 1 from locales l where l.slug = local_slug and l.owner_id = auth.uid())
  );

create policy "authenticated delete own promociones" on promociones
  for delete using (created_by = auth.uid());

-- ── Archivos: bucket público, 50 MB por archivo, solo imágenes y videos ─────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'promociones', 'promociones', true, 52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do nothing;

-- Cada admin sube y borra dentro de su carpeta (<su id>/archivo).
create policy "authenticated upload own promociones files" on storage.objects
  for insert with check (
    bucket_id = 'promociones' and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "authenticated delete own promociones files" on storage.objects
  for delete using (
    bucket_id = 'promociones' and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
