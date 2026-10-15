import { supabase } from './supabase'
import { precioFinal, etiquetaOferta, tieneOfertaVigente } from './pricing'
import { LOCALES } from './locales'

// Solo lectura: categorías y productos activos del catálogo real. Se traen
// una vez por visita y cada página filtra en memoria.
let catalogPromise = null

function imageUrl(storagePath) {
  if (!storagePath) return null
  return supabase.storage.from('product-images').getPublicUrl(storagePath).data.publicUrl
}

function mapProduct(p) {
  const images = [...(p.product_images || [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => imageUrl(i.storage_path))
  const enOferta = tieneOfertaVigente(p)
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    categoryId: p.category_id,
    listPrice: Number(p.price),
    price: enOferta ? precioFinal(p) : Number(p.price),
    onSale: enOferta,
    offerLabel: enOferta ? etiquetaOferta(p) : null,
    tag: p.tag || '',
    description: p.description || '',
    stock: p.stock,
    images,
    img: images[0] || null,
  }
}

async function loadCatalog() {
  const [
    { data: cats, error: catError },
    { data: prods, error: prodError },
    { data: locs, error: locError },
  ] = await Promise.all([
    supabase.from('categories').select('id, slug, name, parent_id, sort_order, cover_path, description').eq('active', true),
    supabase
      .from('products')
      .select('id, slug, name, price, stock, tag, description, category_id, created_by, product_images(storage_path, sort_order), discount_type, discount_value, discount_label, discount_from, discount_until')
      .eq('active', true)
      .order('name'),
    supabase.from('locales').select('slug, owner_id, modo_compra, payment_provider'),
  ])
  if (catError || prodError || locError) throw new Error((catError || prodError || locError).message)

  // Árbol de categorías compartido por los tres locales.
  const categories = cats
    .map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      parentId: c.parent_id,
      sortOrder: c.sort_order,
      description: c.description || '',
      coverUrl: imageUrl(c.cover_path),
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))

  const products = prods.map((p) => ({ ...mapProduct(p), ownerId: p.created_by }))

  // Vidriera de cada local: solo lo que cargó la cuenta de su dueño.
  const vidrieras = {}
  for (const local of LOCALES) {
    const row = locs.find((l) => l.slug === local.slug)
    vidrieras[local.slug] = {
      modo: row?.modo_compra === 'online' && row?.payment_provider ? 'online' : 'vidriera',
      paymentProvider: row?.payment_provider ?? null,
      products: row?.owner_id ? products.filter((p) => p.ownerId === row.owner_id) : [],
    }
  }

  return { categories, products, vidrieras }
}

// ── Árbol de categorías dentro de un local ───────────────────────────────
// Las categorías son compartidas, pero cada local solo muestra las ramas en
// las que su dueño cargó productos.

function branchIds(categories, id) {
  const ids = [id]
  for (let i = 0; i < ids.length; i++) {
    for (const c of categories) if (c.parentId === ids[i]) ids.push(c.id)
  }
  return new Set(ids)
}

export function productsInBranch(catalog, localSlug, categoryId) {
  const ids = branchIds(catalog.categories, categoryId)
  return (catalog.vidrieras[localSlug]?.products || []).filter((p) => ids.has(p.categoryId))
}

// Hijas de `parentId` (null = principales) que tienen piezas de este local,
// con su portada: la foto de la categoría o, si no tiene, la de su primera pieza.
export function categoriesOfLocal(catalog, localSlug, parentId = null) {
  return catalog.categories
    .filter((c) => c.parentId === parentId)
    .map((c) => {
      const products = productsInBranch(catalog, localSlug, c.id)
      return { ...c, count: products.length, cover: c.coverUrl || products.find((p) => p.img)?.img || null }
    })
    .filter((c) => c.count > 0)
}

export function categoryChain(catalog, categoryId) {
  const byId = Object.fromEntries(catalog.categories.map((c) => [c.id, c]))
  const chain = []
  let c = byId[categoryId]
  while (c) {
    chain.unshift(c)
    c = c.parentId ? byId[c.parentId] : null
  }
  return chain
}

// Contenido del local + su modo de venta real (de la base). Mientras el
// catálogo carga, se asume vidriera (consulta por WhatsApp).
export function withModo(local, catalog) {
  if (!local) return null
  const v = catalog?.vidrieras[local.slug]
  return { ...local, modo: v?.modo ?? 'vidriera', paymentProvider: v?.paymentProvider ?? null }
}

export function getCatalog() {
  if (!catalogPromise) {
    catalogPromise = loadCatalog().catch((err) => {
      catalogPromise = null
      throw err
    })
  }
  return catalogPromise
}
