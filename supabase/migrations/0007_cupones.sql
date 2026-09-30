-- Cupones de descuento, compartidos entre todos los admins. Nunca se leen desde
-- el navegador del cliente: create-order los valida con la service_role key.
-- Los usos se cuentan como pedidos no cancelados que usaron el código.

create table coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code = upper(code) and length(code) between 3 and 30),
  discount_type text not null check (discount_type in ('percentage', 'fixed_amount')),
  discount_value numeric(12,2) not null check (discount_value > 0),
  min_purchase numeric(12,2),
  max_uses integer check (max_uses is null or max_uses > 0),
  valid_from date,
  valid_until date,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table coupons enable row level security;

create policy "authenticated manage coupons" on coupons
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- discount_amount pasa a ser el total de descuentos del pedido (cupón + efectivo);
-- coupon_discount guarda la parte del cupón por separado.
alter table orders add column coupon_code text;
alter table orders add column coupon_discount numeric(12,2) not null default 0;
