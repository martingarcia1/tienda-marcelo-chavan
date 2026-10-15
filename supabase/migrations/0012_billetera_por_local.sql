-- Billetera de cada local. La venta online (modo_compra = 'online') se
-- activa recién cuando sus credenciales estén cargadas y probadas.
update locales set payment_provider = 'mercadopago' where slug = 'peatonal-mendoza';
update locales set payment_provider = 'payway'      where slug = 'galeria-ancel-9';
update locales set payment_provider = null, modo_compra = 'consulta' where slug = 'sede-central';
