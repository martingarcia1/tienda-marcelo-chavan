import { supabase } from './supabase'
import { precioFinal, etiquetaOferta, tieneOfertaVigente } from './pricing'

// El catálogo público es chico (decenas de productos): se trae una sola vez
// por visita y las páginas filtran en memoria.
let catalogPromise = null

export function imageUrl(storagePath) {
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
    listPrice: p.price,
    price: enOferta ? precioFinal(p) : p.price,
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
  const [{ data: cats, error: catError }, { data: prods, error: prodError }] = await Promise.all([
    supabase
      .from('categories')
      .select('id, name, slug, parent_id, sort_order, cover_path, description')
      .eq('active', true)
      .order('sort_order'),
    supabase
      .from('products')
      .select('id, slug, name, price, stock, tag, description, category_id, product_images(storage_path, sort_order), discount_type, discount_value, discount_label, discount_from, discount_until')
      .eq('active', true)
      .order('name'),
  ])
  if (catError || prodError) throw new Error(catError?.message || prodError?.message)

  const categories = cats.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    parentId: c.parent_id,
    description: c.description || '',
    coverUrl: imageUrl(c.cover_path),
  }))
  return { categories, products: prods.map(mapProduct) }
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

// ── Helpers del árbol ──────────────────────────────────────────

export function childrenOf(categories, parentId) {
  return categories.filter((c) => c.parentId === parentId)
}

export function descendantIds(categories, id) {
  const ids = [id]
  for (let i = 0; i < ids.length; i++) {
    for (const c of categories) if (c.parentId === ids[i]) ids.push(c.id)
  }
  return ids
}

export function ancestorsOf(categories, category) {
  const byId = Object.fromEntries(categories.map((c) => [c.id, c]))
  const chain = []
  let current = category
  while (current) {
    chain.unshift(current)
    current = current.parentId ? byId[current.parentId] : null
  }
  return chain
}

export function productsInTree(catalog, categoryId) {
  const ids = new Set(descendantIds(catalog.categories, categoryId))
  return catalog.products.filter((p) => ids.has(p.categoryId))
}

// Portada: la foto cargada para la categoría o, si no tiene, la del primer
// producto con foto de su rama.
export function coverFor(catalog, category) {
  if (category.coverUrl) return category.coverUrl
  return productsInTree(catalog, category.id).find((p) => p.img)?.img || null
}

// Los anillos y alianzas muestran el acceso a la guía de talles.
export function needsRingSizeGuide(categories, category) {
  return ancestorsOf(categories, category).some((c) => /anillo|alianza/i.test(c.name))
}
