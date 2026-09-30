-- Permite a cualquier admin autenticado cambiar el estado de un pedido desde
-- el panel (hoy solo se podían leer). Se hace vía función en vez de abrir
-- UPDATE directo sobre la tabla para no exponer campos sensibles (montos,
-- id de pago de Mercado Pago, etc.) a edición libre desde el navegador.

create or replace function actualizar_estado_pedido(p_order_id uuid, p_status order_status)
returns void as $$
begin
  update orders set status = p_status where id = p_order_id;
end;
$$ language plpgsql security definer;

revoke all on function actualizar_estado_pedido(uuid, order_status) from public;
grant execute on function actualizar_estado_pedido(uuid, order_status) to authenticated;
