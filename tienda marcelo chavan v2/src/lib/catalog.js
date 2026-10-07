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

function descendantIds(categories, id) {
  const ids = [id]
  for (let i = 0; i < ids.length; i++) {
    for (const c of categories) if (c.parent_id === ids[i]) ids.push(c.id)
  }
  return ids
}

async function loadCatalog() {
  const [{ data: cats, error: catError }, { data: prods, error: prodError }] = await Promise.all([
    supabase.from('categories').select('id, slug, name, parent_id').eq('active', true),
    supabase
      .from('products')
      .select('id, slug, name, price, stock, tag, description, category_id, product_images(storage_path, sort_order), discount_type, discount_value, discount_label, discount_from, discount_until')
      .eq('active', true)
      .order('name'),
  ])
  if (catError || prodError) throw new Error(catError?.message || prodError?.message)

  const products = prods.map(mapProduct)
  const bySlug = Object.fromEntries(cats.map((c) => [c.slug, c]))

  // Vidriera de cada local: sus secciones (cada una con su rama completa).
  const vidrieras = {}
  for (const local of LOCALES) {
    const secciones = local.secciones
      .map((s) => {
        const cat = bySlug[s.slug]
        if (!cat) return null
        const ids = new Set(descendantIds(cats, cat.id))
        return { ...s, products: products.filter((p) => ids.has(p.categoryId)) }
      })
      .filter((s) => s && s.products.length > 0)
    vidrieras[local.slug] = {
      secciones,
      products: secciones.flatMap((s) => s.products),
    }
  }

  return { products, vidrieras }
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
