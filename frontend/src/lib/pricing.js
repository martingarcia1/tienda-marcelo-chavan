// Calcula el precio final de un producto según su oferta (si tiene una
// activa hoy) y la etiqueta a mostrar. Misma lógica duplicada en
// supabase/functions/create-order/index.ts para que el cobro real coincida
// con lo que se ve en el catálogo.

function ofertaVigente(product, hoyISO) {
  if (!product.discount_type || !product.discount_value) return false
  if (product.discount_from && hoyISO < product.discount_from) return false
  if (product.discount_until && hoyISO > product.discount_until) return false
  return true
}

export function precioFinal(product, now = new Date()) {
  const hoyISO = now.toISOString().slice(0, 10)
  if (!ofertaVigente(product, hoyISO)) return product.price

  if (product.discount_type === 'percentage') {
    return Math.max(0, Math.round(product.price * (1 - product.discount_value / 100)))
  }
  if (product.discount_type === 'fixed_amount') {
    return Math.max(0, product.price - product.discount_value)
  }
  return product.price
}

export function etiquetaOferta(product, now = new Date()) {
  const hoyISO = now.toISOString().slice(0, 10)
  if (!ofertaVigente(product, hoyISO)) return null
  if (product.discount_label) return product.discount_label
  if (product.discount_type === 'percentage') return `${product.discount_value}% OFF`
  if (product.discount_type === 'fixed_amount') return `-${product.discount_value}`
  return null
}

export function tieneOfertaVigente(product, now = new Date()) {
  const hoyISO = now.toISOString().slice(0, 10)
  return ofertaVigente(product, hoyISO)
}
