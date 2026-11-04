-- Secciones de la Sede Central (nota del cliente), en orden alfabético:
--   Alianzas clásicas · Alianzas especiales · Anillos · Anillos de compromiso
--   Aros · Cadenas · Collares · Conjuntos · Dijes · Gargantillas · Pulseras
-- y después "Colecciones": Borsari, Gucci, Montblanc y Relojería (TAG Heuer,
-- Longines, Luminox, Movado, Relojes suizos, Victorinox).
-- El orden en la vidriera lo define `seccionesDestacadas` en locales.js; acá
-- van con sort_order alto para no mover el orden de los otros locales.

create function _cat(p_parent text, p_name text, p_slug text, p_order int) returns void as $$
  insert into categories (name, slug, sort_order, parent_id)
  values (p_name, p_slug, p_order, (select id from categories where slug = p_parent))
  on conflict (slug) do nothing;
$$ language sql;

-- Principales ("Pulseras" ya existe como principal y se reutiliza).
select _cat(null, 'Alianzas clásicas', 'alianzas-clasicas', 20);
select _cat(null, 'Alianzas especiales', 'alianzas-especiales', 21);
select _cat(null, 'Anillos', 'anillos', 22);
select _cat(null, 'Anillos de compromiso', 'anillos-de-compromiso', 23);
select _cat(null, 'Aros', 'aros', 24);
select _cat(null, 'Cadenas', 'cadenas', 25);
select _cat(null, 'Collares', 'collares', 26);
select _cat(null, 'Conjuntos', 'conjuntos', 27);
select _cat(null, 'Dijes', 'dijes', 28);
select _cat(null, 'Gargantillas', 'gargantillas', 29);
update categories set sort_order = 30 where slug = 'pulseras' and parent_id is null;

-- Colecciones.
select _cat(null, 'Colecciones', 'colecciones', 31);
select _cat('colecciones', 'Borsari', 'coleccion-borsari', 0);
select _cat('colecciones', 'Gucci', 'coleccion-gucci', 0);
select _cat('colecciones', 'Montblanc', 'coleccion-montblanc', 0);
select _cat('colecciones', 'Relojería', 'coleccion-relojeria', 0);

-- Marcas de relojería: las que ya existían en Relojería › Alta gama (sin
-- productos) pasan a la colección, para no tenerlas duplicadas.
update categories set parent_id = (select id from categories where slug = 'coleccion-relojeria'), sort_order = 0
where slug in ('relojeria-tag-heuer', 'relojeria-longines', 'relojeria-movado', 'relojeria-victorinox');
select _cat('coleccion-relojeria', 'Luminox', 'relojeria-luminox', 0);
select _cat('coleccion-relojeria', 'Relojes suizos', 'relojeria-relojes-suizos', 0);

drop function _cat(text, text, text, int);
