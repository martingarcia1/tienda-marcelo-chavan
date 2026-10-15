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

// Sección de la vidriera a la que pertenece un producto: su colección
// principal (Plata, Alianzas…), salvo en Relojería, que se separa por marca.
function seccionDe(categoryId, byId) {
  const chain = []
  let c = byId[categoryId]
  while (c) {
    chain.unshift(c)
    c = c.parent_id ? byId[c.parent_id] : null
  }
  if (chain.length === 0) return { slug: 'otros', label: 'Otros' }
  const pick = chain[0].slug === 'relojeria' && chain[1] ? chain[1] : chain[0]
  return { slug: pick.slug, label: pick.name }
}

async function loadCatalog() {
  const [
    { data: cats, error: catError },
    { data: prods, error: prodError },
    { data: locs, error: locError },
  ] = await Promise.all([
    supabase.from('categories').select('id, slug, name, parent_id, sort_order').eq('active', true),
    supabase
      .from('products')
      .select('id, slug, name, price, stock, tag, description, category_id, created_by, product_images(storage_path, sort_order), discount_type, discount_value, discount_label, discount_from, discount_until')
      .eq('active', true)
      .order('name'),
    supabase.from('locales').select('slug, owner_id, modo_compra'),
  ])
  if (catError || prodError || locError) throw new Error((catError || prodError || locError).message)

  const byId = Object.fromEntries(cats.map((c) => [c.id, c]))
  const products = prods.map((p) => ({ ...mapProduct(p), ownerId: p.created_by }))

  // Vidriera de cada local: lo que cargó la cuenta de su dueño, agrupado en
  // secciones según la categoría de cada pieza.
  const vidrieras = {}
  for (const local of LOCALES) {
    const row = locs.find((l) => l.slug === local.slug)
    const own = row?.owner_id ? products.filter((p) => p.ownerId === row.owner_id) : []
    const map = new Map()
    for (const p of own) {
      const s = seccionDe(p.categoryId, byId)
      if (!map.has(s.slug)) map.set(s.slug, { ...s, products: [] })
      map.get(s.slug).products.push(p)
    }
    vidrieras[local.slug] = {
      modo: row?.modo_compra === 'online' ? 'online' : 'vidriera',
      secciones: [...map.values()].sort((a, b) => b.products.length - a.products.length),
      products: own,
    }
  }

  return { products, vidrieras }
}

// Contenido del local + su modo de venta real (de la base). Mientras el
// catálogo carga, se asume vidriera (consulta por WhatsApp).
export function withModo(local, catalog) {
  if (!local) return null
  return { ...local, modo: catalog?.vidrieras[local.slug]?.modo ?? 'vidriera' }
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
