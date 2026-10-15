// Los tres espacios consultan al mismo número.
const WHATSAPP_NUMBER = '5493814303839'

export function whatsappHref(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function mapsHref(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
