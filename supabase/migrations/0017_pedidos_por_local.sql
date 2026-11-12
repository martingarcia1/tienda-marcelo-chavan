-- Pedidos por local: cada admin ve y gestiona solo los pedidos de su local.
-- Antes cualquier cuenta autenticada leía (y cambiaba de estado) todos los
-- pedidos; el filtro por local estaba solo en el panel.

-- Cuentas de soporte: ven los pedidos de todos los locales, incluidos los
-- anteriores a la división por locales (sin local asignado).
create table soporte (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table soporte enable row level security; -- sin políticas: solo se lee desde funciones

insert into soporte (user_id)
select id from auth.users where email = 'martingarcia.code@gmail.com';

create function puede_ver_pedidos_de(p_local text) returns boolean as $$
  select exists (select 1 from locales l where l.slug = p_local and l.owner_id = auth.uid())
      or exists (select 1 from soporte s where s.user_id = auth.uid());
$$ language sql stable security definer set search_path = public;

-- (Queda ejecutable por cualquiera: la usan las políticas, y sin sesión da false.)

-- ── Lectura ─────────────────────────────────────────────────────────────────
drop policy "authenticated read orders" on orders;
create policy "admins read orders of own local" on orders
  for select using (puede_ver_pedidos_de(local_slug));

drop policy "authenticated read order items" on order_items;
create policy "admins read order items of own local" on order_items
  for select using (
    exists (select 1 from orders o where o.id = order_items.order_id and puede_ver_pedidos_de(o.local_slug))
  );

-- ── Cambio de estado: solo sobre pedidos del propio local ───────────────────
create or replace function actualizar_estado_pedido(p_order_id uuid, p_status order_status)
returns void as $$
begin
  update orders set status = p_status
  where id = p_order_id and puede_ver_pedidos_de(local_slug);
  if not found then
    raise exception 'El pedido no existe o no es de tu local.';
  end if;
end;
$$ language plpgsql security definer set search_path = public;

revoke all on function actualizar_estado_pedido(uuid, order_status) from public, anon;
grant execute on function actualizar_estado_pedido(uuid, order_status) to authenticated;

-- ── Cupones: son compartidos, así que sus usos se cuentan en todos los
-- locales aunque el admin ya no pueda leer los pedidos ajenos. ───────────────
create function usos_cupones() returns table (coupon_code text, usos bigint, descontado numeric) as $$
  select o.coupon_code, count(*), coalesce(sum(o.coupon_discount), 0)
  from orders o
  where o.coupon_code is not null and o.status <> 'cancelled'
  group by o.coupon_code;
$$ language sql stable security definer set search_path = public;

revoke all on function usos_cupones() from public, anon;
grant execute on function usos_cupones() to authenticated;
