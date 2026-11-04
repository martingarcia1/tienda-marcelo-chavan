import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { getLocal } from './locales'
import { whatsappHref } from './whatsapp'

// Publicidad que suben los admins (imágenes o videos), de los tres locales.

export const BUCKET_PROMOS = 'promociones'
export const MAX_MB_PROMO = 50

export function promoUrl(storagePath) {
  return supabase.storage.from(BUCKET_PROMOS).getPublicUrl(storagePath).data.publicUrl
}

// A dónde lleva el botón: ruta interna, WhatsApp o enlace externo.
export function destinoBoton(promo) {
  const url = promo.boton_url?.trim()
  if (!url) return null
  if (url === 'whatsapp') {
    const local = getLocal(promo.local_slug)
    const msg = promo.titulo
      ? `Hola! Vi en la web "${promo.titulo}"${local ? ` de ${local.nombre}` : ''} y quiero consultar.`
      : `Hola! Quiero hacer una consulta${local ? ` para ${local.nombre}` : ''}.`
    return { href: whatsappHref(msg), externo: true }
  }
  if (url.startsWith('/')) return { href: url, externo: false }
  return { href: /^https?:\/\//.test(url) ? url : `https://${url}`, externo: true }
}

let promosPromise = null

async function cargarPromos() {
  const { data, error } = await supabase
    .from('promociones')
    .select('id, local_slug, tipo, storage_path, titulo, boton_texto, boton_url, sort_order, created_at')
    .eq('activo', true)
    .order('sort_order')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data.map((p) => ({ ...p, url: promoUrl(p.storage_path), local: getLocal(p.local_slug) }))
}

// Promociones activas (se piden una vez por visita).
export function usePromociones() {
  const [state, setState] = useState({ promos: [], loading: true })
  useEffect(() => {
    let cancelled = false
    if (!promosPromise) promosPromise = cargarPromos().catch((e) => { promosPromise = null; throw e })
    promosPromise
      .then((promos) => !cancelled && setState({ promos, loading: false }))
      .catch(() => !cancelled && setState({ promos: [], loading: false }))
    return () => { cancelled = true }
  }, [])
  return state
}
