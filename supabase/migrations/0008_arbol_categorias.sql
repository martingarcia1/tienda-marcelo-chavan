-- Categorías en árbol (Oro › Anillos › Lisos), con foto de portada y
-- descripción, y reasignación del catálogo existente a la nueva estructura
-- definida por el cliente.

alter table categories add column parent_id uuid references categories(id) on delete restrict;
alter table categories add column cover_path text;
alter table categories add column description text;
create index categories_parent_id_idx on categories(parent_id);

-- ── Categorías principales ────────────────────────────────────
-- Se reutilizan las que ya existían (Abridores, Alianzas, Plata, Relojes) para
-- no romper referencias; el resto se crea.
update categories set name = 'Relojería', slug = 'relojeria' where slug = 'relojes';

insert into categories (name, slug, sort_order) values
  ('Oro', 'oro', 0),
  ('Acero', 'acero', 2);

update categories set sort_order = 1 where slug = 'plata';
update categories set sort_order = 3 where slug = 'abridores';
update categories set sort_order = 4 where slug = 'alianzas';
update categories set sort_order = 5 where slug = 'relojeria';

-- Categorías viejas que no siguen en la estructura nueva: quedan inactivas
-- (conservan los productos de ejemplo ocultos que tienen asignados).
update categories set active = false, sort_order = 90
where slug in ('anillos-iniciales', 'personalizados', 'pulseras', 'promos-y-ofertas');

-- ── Subcategorías ─────────────────────────────────────────────
create function _crear_sub(p_parent_slug text, p_name text, p_slug text, p_order int)
returns void as $$
  insert into categories (name, slug, sort_order, parent_id)
  select p_name, p_slug, p_order, id from categories where slug = p_parent_slug;
$$ language sql;

-- Oro y Plata comparten la misma estructura
select _crear_sub('oro', 'Anillos', 'oro-anillos', 0);
select _crear_sub('oro-anillos', 'Lisos', 'oro-anillos-lisos', 0);
select _crear_sub('oro-anillos', 'Con piedras', 'oro-anillos-con-piedras', 1);
select _crear_sub('oro-anillos', 'De compromiso', 'oro-anillos-de-compromiso', 2);
select _crear_sub('oro', 'Aros', 'oro-aros', 1);
select _crear_sub('oro', 'Cadenas y dijes', 'oro-cadenas-y-dijes', 2);
select _crear_sub('oro', 'Pulseras', 'oro-pulseras', 3);

select _crear_sub('plata', 'Anillos', 'plata-anillos', 0);
select _crear_sub('plata-anillos', 'Lisos', 'plata-anillos-lisos', 0);
select _crear_sub('plata-anillos', 'Con piedras', 'plata-anillos-con-piedras', 1);
select _crear_sub('plata-anillos', 'De compromiso', 'plata-anillos-de-compromiso', 2);
select _crear_sub('plata', 'Aros', 'plata-aros', 1);
select _crear_sub('plata', 'Cadenas y dijes', 'plata-cadenas-y-dijes', 2);
select _crear_sub('plata', 'Pulseras', 'plata-pulseras', 3);

select _crear_sub('acero', 'Anillos', 'acero-anillos', 0);
select _crear_sub('acero', 'Aros', 'acero-aros', 1);
select _crear_sub('acero', 'Cadenas', 'acero-cadenas', 2);
select _crear_sub('acero', 'Pulseras', 'acero-pulseras', 3);

select _crear_sub('abridores', 'Plata', 'abridores-plata', 0);
select _crear_sub('abridores', 'Oro', 'abridores-oro', 1);

select _crear_sub('alianzas', 'Plata', 'alianzas-plata', 0);
select _crear_sub('alianzas', 'Plata y oro', 'alianzas-plata-y-oro', 1);
select _crear_sub('alianzas', 'Oro', 'alianzas-oro', 2);

select _crear_sub('relojeria', 'Citizen', 'relojeria-citizen', 0);
select _crear_sub('relojeria', 'Festina', 'relojeria-festina', 1);
select _crear_sub('relojeria', 'Casio', 'relojeria-casio', 2);
select _crear_sub('relojeria', 'Tissot', 'relojeria-tissot', 3);
select _crear_sub('relojeria', 'Alta gama', 'relojeria-alta-gama', 4);
select _crear_sub('relojeria-alta-gama', 'Gucci', 'relojeria-gucci', 0);
select _crear_sub('relojeria-alta-gama', 'Longines', 'relojeria-longines', 1);
select _crear_sub('relojeria-alta-gama', 'Movado', 'relojeria-movado', 2);
select _crear_sub('relojeria-alta-gama', 'Victorinox', 'relojeria-victorinox', 3);
select _crear_sub('relojeria-alta-gama', 'Swiss Military', 'relojeria-swiss-military', 4);
select _crear_sub('relojeria-alta-gama', 'Tag Heuer', 'relojeria-tag-heuer', 5);

drop function _crear_sub(text, text, text, int);

-- ── Productos de ejemplo del arranque del sitio: se ocultan ───
update products
set active = false,
    discount_type = null, discount_value = null, discount_label = null,
    discount_from = null, discount_until = null
where name in (
  'Abridor Diamante', 'Abridor Liso', 'Abridor Texturado',
  'Alianza Clásica', 'Alianza Diamante', 'Alianza Oro Blanco', 'Alianzas', 'Alianzas oro blanco',
  'Anillo Inicial A', 'Anillo Inicial Doble', 'Anillo Inicial M',
  'Cadenas personalizadas', 'Cadena Plata', 'Pulsera Plata', 'Pulseras',
  'Reloj Clásico', 'Reloj Deportivo', 'Reloj Elegance'
);

-- ── Reasignación del catálogo real ────────────────────────────
create function _mover(p_slug text) returns uuid as $$
  select id from categories where slug = p_slug;
$$ language sql;

update products set category_id = _mover('abridores-oro')
where name ilike 'Abridor%' and active;

update products set category_id = _mover('alianzas-plata')
where name in ('Alianza clasica de plata 925', 'Alianza de plata 925 diseño cinta');

update products set category_id = _mover('alianzas-oro')
where name in ('Alianza oro 18k modelo cinta 4gr', 'Alianzas oro 18k clasica de 4gr');

update products set category_id = _mover('plata-anillos')
where name = 'Anillo Geometrico';

update products set category_id = _mover('relojeria-citizen')
where name in (
  'Analogico para Hombre - Modelo Eco Drive',
  'Analogico para Mujer - Modelo Eco Drive',
  'Analogico para Mujer - Modelo Quartz',
  'Automatico para Hombre - Modelo Mechanical Tsuyosa',
  'Cronografo para Hombre - Modelo Quartz',
  'Reloj Citizen Eco Drive Super Titanium',
  'Reloj deportivo Eco-Drive “Red Wave”'
);

update products set category_id = _mover('relojeria-festina')
where name ilike '%festina%';

update products set category_id = _mover('relojeria-tissot')
where name ilike '%tissot%' or name = 'Reloj de mujer T-Classic Stylis-T';

update products set category_id = _mover('relojeria-casio')
where active
  and category_id = _mover('relojeria')
  and (name ilike '%casio%' or name ilike '%g shock%' or name ilike '%g-shock%');

drop function _mover(text);
