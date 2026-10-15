-- Entrega de cada pedido: envío a domicilio (con costo) o retiro en un punto
-- del local. Los pedidos anteriores quedan como 'retiro'.
alter table orders add column delivery_method text not null default 'retiro'
  check (delivery_method in ('envio', 'retiro'));
alter table orders add column pickup_point text;
alter table orders add column shipping_address text;
alter table orders add column shipping_cost numeric(12,2) not null default 0;
