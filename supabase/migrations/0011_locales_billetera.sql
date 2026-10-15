-- Billetera de cada local. null = el local no cobra online (consulta por
-- WhatsApp). Las credenciales NO viven acá: son secretos de las Edge
-- Functions con el sufijo del local (MP_ACCESS_TOKEN_GALERIA_ANCEL_9, …).
alter table locales add column payment_provider text
  check (payment_provider in ('mercadopago', 'payway'));

-- Para poder cobrar, un local necesita billetera.
alter table locales add constraint locales_online_requiere_billetera
  check (modo_compra = 'consulta' or payment_provider is not null);

-- Cada pedido queda asociado al local que lo vende.
alter table orders add column local_slug text references locales(slug);
