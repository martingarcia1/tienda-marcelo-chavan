// Carga descripciones por categoría en los productos existentes.
// Uso: node --env-file=.env scripts/update-descriptions.mjs   (corriendo desde frontend/)

import { createClient } from '@supabase/supabase-js'

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

// Texto tal como lo describió el cliente. "Anillos Iniciales" queda afuera
// a propósito hasta que se defina su descripción.
const DESCRIPCIONES = {
  'Alianzas':
    'Nuestras alianzas están disponibles en tres opciones de material: plata 925, plata y oro, ' +
    'u oro 18k. Las de plata se mandan a fabricar a medida del cliente, en modelo bombé o modelo ' +
    'cinta. Las de plata y oro ya vienen listas y se encargan según las medidas. Las de oro también ' +
    'se mandan a fabricar, en modelo bombé o cinta.',
  'Abridores':
    'Los abridores pueden ser de plata, de oro, o de oro con tapita (tic) enchapado. Contamos con ' +
    'muchos modelos para elegir.',
  'Relojes':
    'Trabajamos con marcas como Tressa, Casio, Citizen, Festina, Tissot, Victorinox, Movado, Gucci ' +
    'y Tag Heuer.',
  'Plata':
    'Todos nuestros productos en plata 925 son de excelente calidad y diseño. Contamos con diversos ' +
    'estilos: plata con piedras para fiestas, plata con piedras naturales, plata y oro, plata sin ' +
    'piedras, y plata inflada. El material mantiene siempre la misma calidad; lo que varía son los ' +
    'diseños y los estilos.',
}

async function main() {
  console.log('Iniciando sesión como admin...')
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  })
  if (authError) throw new Error(`No se pudo iniciar sesión: ${authError.message}`)

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, category:categories(name)')
  if (error) throw new Error(`Error leyendo productos: ${error.message}`)

  for (const p of products) {
    const descripcion = DESCRIPCIONES[p.category?.name]
    if (!descripcion) {
      console.log(`  – ${p.name}: sin descripción todavía (categoría "${p.category?.name}")`)
      continue
    }
    const { error: updError } = await supabase
      .from('products')
      .update({ description: descripcion })
      .eq('id', p.id)
    if (updError) throw new Error(`Error actualizando "${p.name}": ${updError.message}`)
    console.log(`  ✓ ${p.name}`)
  }

  console.log('Listo.')
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
