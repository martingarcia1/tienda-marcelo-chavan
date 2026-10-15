// Carga las 5 categorías y los 14 productos actuales (+ 8 fotos reales) en Supabase.
// Uso: node --env-file=.env scripts/seed.mjs   (corriendo desde la carpeta frontend/)

import { createClient } from '@supabase/supabase-js'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS_DIR = path.join(__dirname, '..', 'src', 'assets', 'products')

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
const adminEmail = process.env.SEED_ADMIN_EMAIL
const adminPassword = process.env.SEED_ADMIN_PASSWORD

if (!supabaseUrl || !supabaseAnonKey || !adminEmail || !adminPassword) {
  console.error(
    'Faltan variables de entorno. Revisá frontend/.env: hacen falta VITE_SUPABASE_URL, ' +
    'VITE_SUPABASE_ANON_KEY, SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD.'
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function slugify(text) {
  return text
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const CATEGORIES = ['Alianzas', 'Anillos Iniciales', 'Abridores', 'Relojes', 'Plata']

const PRODUCTS = [
  { name: 'Alianza Clásica',      category: 'Alianzas',          file: 'alianza-clasica.jpg' },
  { name: 'Alianza Diamante',     category: 'Alianzas',          file: 'alianza-diamante.jpg' },
  { name: 'Alianza Oro Blanco',   category: 'Alianzas',          file: 'alianza-oro-blanco.jpg' },
  { name: 'Anillo Inicial A',     category: 'Anillos Iniciales', file: null },
  { name: 'Anillo Inicial M',     category: 'Anillos Iniciales', file: null },
  { name: 'Anillo Inicial Doble', category: 'Anillos Iniciales', file: null },
  { name: 'Abridor Liso',         category: 'Abridores',         file: 'abridor-liso.jpg' },
  { name: 'Abridor Texturado',    category: 'Abridores',         file: 'abridor-texturado.jpg' },
  { name: 'Abridor Diamante',     category: 'Abridores',         file: 'abridor-diamante.jpg' },
  { name: 'Reloj Clásico',        category: 'Relojes',           file: null },
  { name: 'Reloj Deportivo',      category: 'Relojes',           file: null },
  { name: 'Reloj Elegance',       category: 'Relojes',           file: null },
  { name: 'Pulsera Plata',        category: 'Plata',             file: 'pulsera-plata.jpg' },
  { name: 'Cadena Plata',         category: 'Plata',             file: 'cadena-plata.jpg' },
]

async function main() {
  console.log('Iniciando sesión como admin...')
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  })
  if (authError) throw new Error(`No se pudo iniciar sesión: ${authError.message}`)

  console.log('Cargando categorías...')
  const categoryRows = CATEGORIES.map((name, i) => ({ name, slug: slugify(name), sort_order: i }))
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .upsert(categoryRows, { onConflict: 'slug' })
    .select()
  if (catError) throw new Error(`Error cargando categorías: ${catError.message}`)
  const categoryIdByName = Object.fromEntries(categories.map((c) => [c.name, c.id]))

  console.log('Cargando productos...')
  for (const p of PRODUCTS) {
    const slug = slugify(p.name)
    const { data: product, error: prodError } = await supabase
      .from('products')
      .upsert(
        {
          category_id: categoryIdByName[p.category],
          name: p.name,
          slug,
          price: 0,
          stock: 10,
          active: true,
        },
        { onConflict: 'slug' }
      )
      .select()
      .single()
    if (prodError) throw new Error(`Error cargando "${p.name}": ${prodError.message}`)

    if (p.file) {
      const storagePath = `${slug}.jpg`
      const fileBuffer = await readFile(path.join(ASSETS_DIR, p.file))
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(storagePath, fileBuffer, { contentType: 'image/jpeg', upsert: true })
      if (uploadError) throw new Error(`Error subiendo foto de "${p.name}": ${uploadError.message}`)

      await supabase.from('product_images').delete().eq('product_id', product.id)
      const { error: imgError } = await supabase
        .from('product_images')
        .insert({ product_id: product.id, storage_path: storagePath, sort_order: 0 })
      if (imgError) throw new Error(`Error guardando foto de "${p.name}": ${imgError.message}`)
      console.log(`  ✓ ${p.name} (con foto)`)
    } else {
      console.log(`  ✓ ${p.name} (sin foto todavía)`)
    }
  }

  console.log('Listo. Catálogo cargado en Supabase.')
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
