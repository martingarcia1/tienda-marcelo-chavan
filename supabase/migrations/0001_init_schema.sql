-- Marcelo Chavan — esquema inicial (categorías, productos, fotos, pedidos)

create extension if not exists "pgcrypto";

-- ── Tablas ────────────────────────────────────────────────────

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete restrict,
  name text not null,
  slug text not null unique,
  description text,
  price numeric(12,2) not null default 0,
  stock integer not null default 0,
  tag text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_category_id_idx on products(category_id);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0
);
create index product_images_product_id_idx on product_images(product_id);

create type payment_method as enum ('mercadopago', 'efectivo_local', 'transferencia_local');
create type order_status as enum ('pending', 'paid', 'ready_for_pickup', 'completed', 'cancelled');

create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  payment_method payment_method not null,
  status order_status not null default 'pending',
  subtotal numeric(12,2) not null,
  discount_amount numeric(12,2) not null default 0,
  total numeric(12,2) not null,
  mp_preference_id text,
  mp_payment_id text,
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name_snapshot text not null,
  unit_price_snapshot numeric(12,2) not null,
  quantity integer not null check (quantity > 0),
  line_total numeric(12,2) not null
);
create index order_items_order_id_idx on order_items(order_id);

-- products.updated_at se actualiza solo en cada UPDATE
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_set_updated_at
before update on products
for each row execute function set_updated_at();

-- ── Seguridad (Row Level Security) ───────────────────────────

alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Cualquiera puede LEER el catálogo activo (así funciona el sitio público)
create policy "public read active categories" on categories
  for select using (active = true);

create policy "public read active products" on products
  for select using (active = true);

create policy "public read product images" on product_images
  for select using (
    exists (select 1 from products p where p.id = product_images.product_id and p.active = true)
  );

-- Solo el dueño logueado (cuenta única de Supabase Auth) puede escribir el catálogo
create policy "authenticated manage categories" on categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated manage products" on products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "authenticated manage product images" on product_images
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Pedidos: nadie inserta/edita directo desde el navegador (ni siquiera logueado).
-- Los va a crear/actualizar únicamente la Edge Function del checkout, usando la
-- service_role key (que ignora estas reglas). El dueño solo puede LEERLOS acá.
create policy "authenticated read orders" on orders
  for select using (auth.role() = 'authenticated');

create policy "authenticated read order items" on order_items
  for select using (auth.role() = 'authenticated');
