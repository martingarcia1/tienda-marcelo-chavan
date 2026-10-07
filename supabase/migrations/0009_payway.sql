-- Payway (ex Decidir) como pasarela de pago con tarjeta. El pago se resuelve
-- en el momento (aprobado/rechazado) desde la Edge Function create-order, así
-- que no hace falta webhook.
alter type payment_method add value if not exists 'payway';

alter table orders add column payway_payment_id text;
alter table orders add column installments integer not null default 1;
alter table orders add column installments_surcharge numeric(12,2) not null default 0;
