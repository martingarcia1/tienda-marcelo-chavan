-- Ofertas por producto: descuento por porcentaje o monto fijo, con vigencia
-- opcional (desde/hasta) y etiqueta personalizable. Sin oferta activa,
-- discount_type queda en null y el producto se vende a su precio de lista.

alter table products add column discount_type text check (discount_type in ('percentage', 'fixed_amount'));
alter table products add column discount_value numeric(12,2);
alter table products add column discount_label text;
alter table products add column discount_from date;
alter table products add column discount_until date;
