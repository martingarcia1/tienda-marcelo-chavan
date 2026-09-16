-- Descuenta stock de forma atómica cuando un pedido se confirma como pagado.
-- La llama la Edge Function mp-webhook (con la service_role, que ya ignora RLS);
-- security definer es solo una capa extra de seguridad, no estrictamente necesaria acá.
create or replace function decrementar_stock(p_product_id uuid, p_cantidad integer)
returns void as $$
begin
  update products
  set stock = greatest(stock - p_cantidad, 0)
  where id = p_product_id;
end;
$$ language plpgsql security definer;
