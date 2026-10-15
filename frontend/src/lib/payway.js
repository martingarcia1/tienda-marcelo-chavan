// Integración del navegador con Payway: carga su SDK oficial (decidir.js) y
// convierte los datos de la tarjeta en un token de un solo uso. Los datos de
// la tarjeta viajan directo del navegador a Payway; nuestro servidor solo
// recibe el token.

const SANDBOX = (import.meta.env.VITE_PAYWAY_SANDBOX ?? 'true') === 'true'
const API_URL = SANDBOX ? 'https://developers.decidir.com/api/v2' : 'https://ventasonline.payway.com.ar/api/v2'
const SDK_URL = 'https://ventasonline.payway.com.ar/static/v2.6.4/decidir.js'

// Códigos de medio de pago de Payway por marca y tipo (tabla oficial de
// "Medios de pago"). Payway valida que coincidan con los primeros dígitos de
// la tarjeta: por eso la marca se detecta sola y el cliente elige el tipo
// (por ejemplo, la tarjeta de Mercado Pago es una Mastercard prepaga = 116).
export const MARCAS = {
  visa: { label: 'Visa', tipos: { credito: 1, debito: 31 } },
  mastercard: { label: 'Mastercard', tipos: { credito: 104, debito: 105, prepaga: 116 } },
  maestro: { label: 'Maestro', tipos: { debito: 106 } },
  cabal: { label: 'Cabal', tipos: { credito: 63, debito: 108 } },
}

export const TIPOS = { credito: 'Crédito', debito: 'Débito', prepaga: 'Prepaga' }

export function marcaDe(numero) {
  const n = numero.replace(/\D/g, '')
  if (n.length < 2) return null
  if (/^(6042|6043|6271|5896)/.test(n)) return 'cabal'
  if (/^(5018|5020|5038|5893|6304|6759|676[1-3])/.test(n)) return 'maestro'
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard'
  if (/^4/.test(n)) return 'visa'
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
