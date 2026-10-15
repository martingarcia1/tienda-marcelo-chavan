-- Secciones de Galería Áncel 9 (nota del cliente): Plata 925, Plata 925
-- Dorada, Acero y Perlas. Las tres primeras con la misma estructura:
--   Anillos (sin piedra / con piedra) · Aros (sin piedra / con piedra / perlas)
--   Cadenas y dijes (sin piedra / con piedra) · Pulseras (sin piedra / con piedra)

-- "Plata" pasa a ser "Plata 925".
update categories set name = 'Plata 925', slug = 'plata-925' where slug = 'plata';

-- Anillos de plata: lisos → sin piedra, con piedras → con piedra; "de
-- compromiso" no está en la estructura nueva y no tiene productos.
update categories set name = 'Sin piedra', slug = 'plata-anillos-sin-piedra' where slug = 'plata-anillos-lisos';
update categories set name = 'Con piedra', slug = 'plata-anillos-con-piedra' where slug = 'plata-anillos-con-piedras';
delete from categories c
where c.slug = 'plata-anillos-de-compromiso'
  and not exists (select 1 from products p where p.category_id = c.id);

update categories set name = 'Cadenas y dijes', slug = 'acero-cadenas-y-dijes' where slug = 'acero-cadenas';

-- Nuevas secciones principales.
insert into categories (name, slug, sort_order) values
  ('Plata 925 Dorada', 'plata-925-dorada', 2),
  ('Perlas', 'perlas', 4);

update categories set sort_order = 1 where slug = 'plata-925';
update categories set sort_order = 3 where slug = 'acero';
update categories set sort_order = 5 where slug = 'abridores';
update categories set sort_order = 6 where slug = 'alianzas';
update categories set sort_order = 7 where slug = 'relojeria';

-- Crea una subcategoría si no existe (por slug).
create function _sub(p_parent text, p_name text, p_slug text, p_order int) returns void as $$
  insert into categories (name, slug, sort_order, parent_id)
  select p_name, p_slug, p_order, id from categories where slug = p_parent
  on conflict (slug) do nothing;
$$ language sql;

-- Plata 925 Dorada: primer nivel.
select _sub('plata-925-dorada', 'Anillos', 'dorada-anillos', 0);
select _sub('plata-925-dorada', 'Aros', 'dorada-aros', 1);
select _sub('plata-925-dorada', 'Cadenas y dijes', 'dorada-cadenas-y-dijes', 2);
select _sub('plata-925-dorada', 'Pulseras', 'dorada-pulseras', 3);

-- Segundo nivel, igual para las tres secciones.
do $$
declare
  pre text;
begin
  foreach pre in array array['plata', 'dorada', 'acero'] loop
    perform _sub(pre || '-anillos', 'Sin piedra', pre || '-anillos-sin-piedra', 0);
    perform _sub(pre || '-anillos', 'Con piedra', pre || '-anillos-con-piedra', 1);
    perform _sub(pre || '-aros', 'Sin piedra', pre || '-aros-sin-piedra', 0);
    perform _sub(pre || '-aros', 'Con piedra', pre || '-aros-con-piedra', 1);
    perform _sub(pre || '-aros', 'Perlas', pre || '-aros-perlas', 2);
    perform _sub(pre || '-cadenas-y-dijes', 'Sin piedra', pre || '-cadenas-y-dijes-sin-piedra', 0);
    perform _sub(pre || '-cadenas-y-dijes', 'Con piedra', pre || '-cadenas-y-dijes-con-piedra', 1);
    perform _sub(pre || '-pulseras', 'Sin piedra', pre || '-pulseras-sin-piedra', 0);
    perform _sub(pre || '-pulseras', 'Con piedra', pre || '-pulseras-con-piedra', 1);
  end loop;
end $$;

drop function _sub(text, text, text, int);
