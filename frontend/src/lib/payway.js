// Integración del navegador con Payway: carga su SDK oficial (decidir.js) y
// convierte los datos de la tarjeta en un token de un solo uso. Los datos de
// la tarjeta viajan directo del navegador a Payway; nuestro servidor solo
// recibe el token.

const SANDBOX = (import.meta.env.VITE_PAYWAY_SANDBOX ?? 'true') === 'true'
const API_URL = SANDBOX ? 'https://developers.decidir.com/api/v2' : 'https://ventasonline.payway.com.ar/api/v2'
const SDK_URL = 'https://ventasonline.payway.com.ar/static/v2.6.4/decidir.js'

// Medios de pago habilitados en el sitio de Payway del comercio (verificado
// en sandbox el 2026-10-07: Amex y Naranja figuran como no habilitados).
export const MARCAS = [
  { id: 1, label: 'Visa crédito' },
  { id: 31, label: 'Visa débito' },
  { id: 104, label: 'Mastercard crédito' },
  { id: 63, label: 'Cabal' },
]

// Preselección según los primeros dígitos (el débito no se distingue por el
// número: si el cliente eligió débito, se respeta su elección).
export function marcaSugerida(numero) {
  const n = numero.replace(/\D/g, '')
  if (/^(6042|6043|6271|589657)/.test(n)) return 63
  if (/^(5[1-5]|2[2-7])/.test(n)) return 104
  if (/^4/.test(n)) return 1
  return null
}

let sdkPromise = null

function loadSdk() {
  if (window.Decidir) return Promise.resolve()
  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = SDK_URL
      script.async = true
      script.onload = resolve
      script.onerror = () => { sdkPromise = null; reject(new Error('No pudimos cargar el módulo de pago con tarjeta.')) }
      document.head.appendChild(script)
    })
  }
  return sdkPromise
}

// Llave pública de Payway de cada local (VITE_PAYWAY_PUBLIC_KEY_<LOCAL>).
function llavePublica(localSlug) {
  return import.meta.env['VITE_PAYWAY_PUBLIC_KEY_' + localSlug.toUpperCase().replace(/-/g, '_')] || ''
}

// El comercio tiene Cybersource: al crear la instancia, el SDK genera un
// identificador de dispositivo y carga el script que analiza el navegador.
// Por eso se prepara apenas aparece el formulario de tarjeta, no al pagar.
const instancias = {}

export async function prepararPayway(localSlug) {
  await loadSdk()
  if (!instancias[localSlug]) {
    const d = new window.Decidir(API_URL)
    d.setPublishableKey(llavePublica(localSlug))
    d.setTimeout(10000)
    instancias[localSlug] = d
  }
  return instancias[localSlug]
}

// form: el <form> con los inputs data-decidir (card_number, security_code, …).
export async function tokenizarTarjeta(form, localSlug) {
  const decidir = await prepararPayway(localSlug)

  return new Promise((resolve, reject) => {
    decidir.createToken(form, (status, response) => {
      if (status === 200 || status === 201) {
        resolve({ token: response.id, bin: response.bin, deviceId: decidir.device_unique_identifier })
      } else {
        const detalle = response?.error?.[0]?.error?.message || response?.error?.[0]?.param
        reject(new Error(detalle ? `Revisá los datos de la tarjeta (${detalle}).` : 'Revisá los datos de la tarjeta.'))
      }
    })
  })
}
