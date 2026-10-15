import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Store, Ticket, Lock, Truck, MapPin, Banknote } from 'lucide-react'
import { useCartStore, cartTotal } from '../store/cartStore'
import { supabase } from '../lib/supabase'
import { whatsappHref } from '../lib/whatsapp'
import { COSTO_ENVIO, ZONA_ENVIO } from '../lib/locales'
import { MARCAS, TIPOS, marcaDe, tokenizarTarjeta, prepararPayway } from '../lib/payway'

const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
const RECARGO_CUOTAS = { 1: 0, 3: 0.1 }
const inputStyle = { border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }

// Campos de tarjeta para Payway. Los atributos data-decidir son los que lee
// su SDK para tokenizar; no tienen "name" para que nunca se envíen a otro lado.
// marca: { brand, tipo } — el código de Payway sale de MARCAS[brand].tipos[tipo].
function CardFields({ localSlug, marca, setMarca, cuotas, setCuotas }) {
  const [numero, setNumero] = useState('')

  useEffect(() => {
    prepararPayway(localSlug).catch(() => { /* el error se informa al intentar pagar */ })
  }, [localSlug])

  function onNumero(e) {
    const v = e.target.value.replace(/[^\d ]/g, '')
    setNumero(v)
    const brand = marcaDe(v)
    setMarca((m) => {
      if (!brand) return { brand: null, tipo: m.tipo }
      const tipos = Object.keys(MARCAS[brand].tipos)
      return { brand, tipo: tipos.includes(m.tipo) ? m.tipo : tipos[0] }
    })
  }

  const tiposDisponibles = marca.brand ? Object.keys(MARCAS[marca.brand].tipos) : Object.keys(TIPOS)
  const soloUnPago = marca.tipo !== 'credito'

  useEffect(() => {
    if (soloUnPago && cuotas !== 1) setCuotas(1)
  }, [soloUnPago, cuotas, setCuotas])

  return (
    <div className="space-y-4 p-4" style={{ border: '1px solid var(--border-gold)', backgroundColor: 'rgba(219,163,107,0.05)' }}>
      <p className="flex items-center gap-2 font-elegant text-xs" style={{ color: 'var(--navy-dim)' }}>
        <Lock size={12} style={{ color: 'var(--gold)' }} /> Los datos de tu tarjeta van directo a Payway, de forma segura.
      </p>
      <div>
        <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Número de tarjeta</label>
        <input data-decidir="card_number" inputMode="numeric" autoComplete="cc-number" value={numero} onChange={onNumero} placeholder="0000 0000 0000 0000" className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Mes</label>
          <input data-decidir="card_expiration_month" inputMode="numeric" autoComplete="cc-exp-month" maxLength={2} placeholder="MM" className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle} />
        </div>
        <div>
          <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Año</label>
          <input data-decidir="card_expiration_year" inputMode="numeric" autoComplete="cc-exp-year" maxLength={2} placeholder="AA" className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle} />
        </div>
        <div>
          <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Código</label>
          <input data-decidir="security_code" inputMode="numeric" autoComplete="cc-csc" maxLength={4} placeholder="CVV" className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle} />
        </div>
      </div>
      <div>
        <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Nombre como figura en la tarjeta</label>
        <input data-decidir="card_holder_name" autoComplete="cc-name" className="w-full px-3 py-2.5 font-elegant text-sm uppercase" style={inputStyle} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Documento</label>
          <select data-decidir="card_holder_doc_type" defaultValue="dni" className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle}>
            <option value="dni">DNI</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Número de documento</label>
          <input data-decidir="card_holder_doc_number" inputMode="numeric" className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>
            Tipo de tarjeta{marca.brand ? ` · ${MARCAS[marca.brand].label}` : ''}
          </label>
          <select value={marca.tipo} onChange={(e) => setMarca((m) => ({ ...m, tipo: e.target.value }))} className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle}>
            {tiposDisponibles.map((t) => <option key={t} value={t}>{TIPOS[t]}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Cuotas</label>
          <select value={cuotas} onChange={(e) => setCuotas(Number(e.target.value))} disabled={soloUnPago} className="w-full px-3 py-2.5 font-elegant text-sm disabled:opacity-60" style={inputStyle}>
            <option value={1}>1 pago</option>
            {!soloUnPago && <option value={3}>3 cuotas (+10%)</option>}
          </select>
        </div>
      </div>
      {numero.replace(/\D/g, '').length >= 6 && !marca.brand && (
        <p className="font-elegant text-xs" style={{ color: 'var(--teal)' }}>
          No reconocemos esta tarjeta. Aceptamos Visa, Mastercard, Maestro y Cabal.
        </p>
      )}
    </div>
  )
}

function mensajePedidoLocal(orderId, items, total, formaPago, cupon, localNombre, puntoRetiro) {
  const lineas = items.map((i) => `• ${i.qty}x ${i.name}`)
  const formaPagoTexto = 'Efectivo al retirar (10% off)'
  const cuponLinea = cupon ? `\nCupón: ${cupon}` : ''
  const totalLinea = total > 0 ? `\nTotal: ${currency.format(total)}` : ''
  return `Hola! Quiero retirar y pagar en ${puntoRetiro ? puntoRetiro.nombre + ' (' + puntoRetiro.direccion + ')' : localNombre} este pedido (N° ${orderId.slice(0, 8)}):\n\n${lineas.join('\n')}${cuponLinea}${totalLinea}\nForma de pago: ${formaPagoTexto}`
}

const EMPTY = []

// Checkout de un local: cobra en la billetera de ese local (Payway o Mercado
// Pago) o deja el pedido para retirar y pagar en el local.
export default function CheckoutModal({ open, onClose, local }) {
  const ONLINE_PROVIDER = local.paymentProvider
  const items = useCartStore((s) => s.carts[local.slug] || EMPTY)
  const total = cartTotal(items)
  const clear = useCartStore((s) => s.clearCart)
  const closeCart = useCartStore((s) => s.closeCart)
  const clearCart = () => { clear(local.slug); closeCart() }

  const [form, setForm] = useState({ customer_name: '', customer_phone: '', customer_email: '' })
  const [paymentMethod, setPaymentMethod] = useState(ONLINE_PROVIDER)
  const [marca, setMarca] = useState({ brand: null, tipo: 'credito' })
  const [cuotas, setCuotas] = useState(1)
  const isCard = paymentMethod === 'payway'
  const puntos = local.puntosRetiro || []
  const [entrega, setEntrega] = useState('retiro')
  const [punto, setPunto] = useState(puntos[0]?.id ?? null)
  const [direccion, setDireccion] = useState({ calle: '', depto: '', referencias: '' })
  const [confirmaZona, setConfirmaZona] = useState(false)

  // El efectivo es solo para retiro: con envío se paga online.
  useEffect(() => {
    if (entrega === 'envio' && paymentMethod === 'efectivo_local') setPaymentMethod(ONLINE_PROVIDER)
  }, [entrega, paymentMethod, ONLINE_PROVIDER])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const [couponError, setCouponError] = useState('')
  const [preview, setPreview] = useState(null)
  const [checkingCoupon, setCheckingCoupon] = useState(false)

  const cartPayload = items.map((i) => ({ product_id: i.id, qty: i.qty }))

  async function fetchPreview(code, method) {
    const { data, error: fnError } = await supabase.functions.invoke('create-order', {
      body: { dry_run: true, local_slug: local.slug, delivery_method: 'retiro', coupon_code: code, payment_method: method, items: cartPayload },
    })
    if (fnError || data?.error) {
      let msg = data?.error
      if (!msg && fnError?.context) {
        try { msg = (await fnError.context.json()).error } catch { /* sin cuerpo */ }
      }
      return { error: msg || 'No pudimos validar el cupón.' }
    }
    return { data }
  }

  async function handleApplyCoupon() {
    const code = couponInput.trim().toUpperCase()
    if (!code) return
    setCouponError('')
    setCheckingCoupon(true)
    const { data, error: err } = await fetchPreview(code, paymentMethod)
    setCheckingCoupon(false)
    if (err) {
      setCouponError(err)
      return
    }
    setAppliedCoupon(code)
    setPreview(data)
  }

  function handleRemoveCoupon() {
    setAppliedCoupon('')
    setCouponInput('')
    setPreview(null)
    setCouponError('')
  }

  // El 10% de efectivo se calcula sobre el total con cupón, así que la vista
  // previa se recalcula al cambiar la forma de pago.
  useEffect(() => {
    if (!appliedCoupon) return
    let cancelled = false
    fetchPreview(appliedCoupon, paymentMethod).then(({ data, error: err }) => {
      if (cancelled) return
      if (err) { handleRemoveCoupon(); setCouponError(err) } else setPreview(data)
    })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod])

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  // Mismo cálculo que el servidor (que es el que manda): base con cupón y
  // efectivo, más el recargo de cuotas si paga con tarjeta en 3.
  const base = preview ? preview.total : paymentMethod === 'efectivo_local' ? Math.round(total * 0.9) : total
  const recargo = isCard ? Math.round(base * RECARGO_CUOTAS[cuotas]) : 0
  const envioCosto = entrega === 'envio' ? COSTO_ENVIO : 0
  const totalFinal = base + recargo + envioCosto
  const direccionTexto = [
    direccion.calle.trim(),
    direccion.depto.trim() && `Piso/depto ${direccion.depto.trim()}`,
    direccion.referencias.trim() && `Ref: ${direccion.referencias.trim()}`,
    'San Miguel de Tucumán',
  ].filter(Boolean).join(' · ')
  const puntoElegido = puntos.find((p) => p.id === punto)
  const mensajeFueraDeZona = [
    `Hola! Quiero hacer una compra por la web en ${local.nombre}, pero mi dirección está fuera de la zona de envíos.`,
    '',
    'Productos:',
    ...items.map((i) => `• ${i.qty}x ${i.name}`),
    ...(direccion.calle.trim() ? ['', `Mi dirección: ${direccionTexto}`] : []),
    '',
    '¿Qué opciones de entrega tienen?',
  ].join('\n')

  async function handleSubmit(e) {
    e.preventDefault()
    const formEl = e.currentTarget
    setError('')

    if (!form.customer_name.trim() || !form.customer_phone.trim()) {
      setError('Completá tu nombre y teléfono para continuar.')
      return
    }
    if (entrega === 'envio' && direccion.calle.trim().length < 5) {
      setError('Completá la calle y el número para el envío.')
      return
    }
    if (entrega === 'envio' && !confirmaZona) {
      setError('Confirmá que tu dirección está dentro de la zona de envíos.')
      return
    }
    if (entrega === 'retiro' && !punto) {
      setError('Elegí dónde vas a retirar tu pedido.')
      return
    }
    if (isCard && !form.customer_email.trim()) {
      setError('Para pagar con tarjeta necesitamos tu email.')
      return
    }
    const paymentMethodId = marca.brand ? MARCAS[marca.brand].tipos[marca.tipo] : null
    if (isCard && !paymentMethodId) {
      setError('Revisá el número de tarjeta: aceptamos Visa, Mastercard, Maestro y Cabal.')
      return
    }

    setSubmitting(true)

    // Con tarjeta: primero Payway devuelve un token de un solo uso.
    let payway = null
    if (isCard) {
      try {
        const { token, bin, deviceId } = await tokenizarTarjeta(formEl, local.slug)
        payway = { token, bin, payment_method_id: paymentMethodId, device_id: deviceId }
      } catch (err) {
        setSubmitting(false)
        setError(err.message)
        return
      }
    }

    const { data, error: fnError } = await supabase.functions.invoke('create-order', {
      body: {
        ...form,
        payment_method: paymentMethod,
        coupon_code: appliedCoupon || null,
        local_slug: local.slug,
        delivery_method: entrega,
        pickup_point: entrega === 'retiro' ? punto : null,
        shipping_address: entrega === 'envio' ? direccionTexto : null,
        items: cartPayload,
        ...(isCard ? { installments: cuotas, payway } : {}),
      },
    })
    setSubmitting(false)

    if (fnError || data?.error) {
      let msg = data?.error
      if (!msg && fnError?.context) {
        try { msg = (await fnError.context.json()).error } catch { /* sin cuerpo */ }
      }
      setError(msg || 'No pudimos procesar el pedido. Probá de nuevo.')
      return
    }

    if (paymentMethod === 'mercadopago' && data.redirectUrl) {
      clearCart()
      window.location.href = data.redirectUrl
      return
    }

    if (isCard && data.status === 'approved') {
      clearCart()
      window.location.href = `/espacios/${local.slug}?pago=exito&pedido=${data.orderId}`
      return
    }

    // Retiro en el local: abrimos WhatsApp con el resumen y cerramos todo.
    const mensaje = mensajePedidoLocal(data.orderId, items, data.total, paymentMethod, appliedCoupon, local.nombre, puntoElegido)
    window.open(whatsappHref(mensaje), '_blank')
    clearCart()
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: 'var(--overlay)' }}
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-8"
            style={{ backgroundColor: 'var(--bg)', boxShadow: '0 30px 80px var(--shadow)' }}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute top-5 right-5 p-1 transition-opacity hover:opacity-60"
              style={{ color: 'var(--navy)' }}
            >
              <X size={20} />
            </button>

            <h3 className="font-serif font-light mb-6" style={{ fontSize: '1.5rem', color: 'var(--navy)' }}>
              Finalizar compra
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Nombre y apellido</label>
                <input
                  type="text"
                  value={form.customer_name}
                  onChange={(e) => updateField('customer_name', e.target.value)}
                  className="w-full px-3 py-2.5 font-elegant text-sm"
                  style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Teléfono</label>
                  <input
                    type="tel"
                    value={form.customer_phone}
                    onChange={(e) => updateField('customer_phone', e.target.value)}
                    className="w-full px-3 py-2.5 font-elegant text-sm"
                    style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }}
                  />
                </div>
                <div>
                  <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>{isCard ? 'Email' : 'Email (opcional)'}</label>
                  <input
                    type="email"
                    value={form.customer_email}
                    onChange={(e) => updateField('customer_email', e.target.value)}
                    className="w-full px-3 py-2.5 font-elegant text-sm"
                    style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block font-elegant mb-3 text-xs" style={{ color: 'var(--navy-dim)' }}>Entrega</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'retiro', Icon: Store, titulo: 'Retiro en el local', sub: 'Sin costo' },
                    { id: 'envio', Icon: Truck, titulo: 'Envío a domicilio', sub: currency.format(COSTO_ENVIO) },
                  ].map(({ id, Icon, titulo, sub }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setEntrega(id)}
                      className="flex items-center gap-3 p-4 text-left transition-colors"
                      style={{
                        border: `1px solid ${entrega === id ? 'var(--gold)' : 'var(--border)'}`,
                        backgroundColor: entrega === id ? 'rgba(219,163,107,0.1)' : 'transparent',
                      }}
                    >
                      <Icon size={18} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                      <div>
                        <p className="font-elegant text-sm" style={{ color: 'var(--navy)' }}>{titulo}</p>
                        <p className="font-elegant text-xs" style={{ color: 'var(--navy-dim)' }}>{sub}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {entrega === 'retiro' ? (
                  <div className="mt-3 space-y-2">
                    {puntos.map((p) => (
                      <label key={p.id} className="flex items-start gap-3 p-3 cursor-pointer" style={{ border: `1px solid ${punto === p.id ? 'var(--border-gold)' : 'var(--border)'}` }}>
                        <input type="radio" name="punto-retiro" checked={punto === p.id} onChange={() => setPunto(p.id)} className="mt-1" />
                        <span>
                          <span className="block font-elegant text-sm" style={{ color: 'var(--navy)' }}>{p.nombre}</span>
                          <span className="flex items-center gap-1.5 font-elegant text-xs mt-0.5" style={{ color: 'var(--navy-dim)' }}>
                            <MapPin size={11} style={{ color: 'var(--gold)' }} /> {p.direccion}
                          </span>
                        </span>
                      </label>
                    ))}
                    <p className="font-elegant text-xs" style={{ color: 'var(--navy-xdim)' }}>Te avisamos por WhatsApp cuando tu pedido esté listo para retirar.</p>
                  </div>
                ) : (
                  <div className="mt-3 space-y-3 p-4" style={{ border: '1px solid var(--border-gold)' }}>
                    <div className="p-3" style={{ backgroundColor: 'rgba(219,163,107,0.06)' }}>
                      <p className="flex items-center gap-2 font-elegant text-sm" style={{ color: 'var(--navy)' }}>
                        <Truck size={14} style={{ color: 'var(--gold)' }} /> Envíos en San Miguel de Tucumán
                      </p>
                      <p className="font-elegant text-xs mt-2" style={{ color: 'var(--navy-dim)' }}>
                        Realizamos envíos a domicilio dentro de la zona comprendida entre las siguientes avenidas:
                      </p>
                      <ul className="mt-2 space-y-1">
                        {ZONA_ENVIO.limites.map((l) => (
                          <li key={l.lado} className="font-elegant text-xs" style={{ color: 'var(--navy-dim)' }}>
                            <strong style={{ color: 'var(--navy)', fontWeight: 500 }}>{l.lado}:</strong> {l.avenidas}.
                          </li>
                        ))}
                      </ul>
                      <p className="font-elegant text-xs mt-2" style={{ color: 'var(--navy-dim)' }}>{ZONA_ENVIO.nota}</p>
                      <p className="font-elegant text-xs mt-2" style={{ color: 'var(--navy-dim)' }}>
                        Si tu dirección está fuera de esta zona,{' '}
                        <a href={whatsappHref(mensajeFueraDeZona)} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--gold)' }}>
                          consultanos por WhatsApp
                        </a>{' '}
                        para coordinar otras opciones de entrega.
                      </p>
                    </div>
                    <div>
                      <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Calle y número</label>
                      <input type="text" value={direccion.calle} onChange={(e) => setDireccion((d) => ({ ...d, calle: e.target.value }))} placeholder="Ej: San Martín 850" className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Piso / depto (opcional)</label>
                        <input type="text" value={direccion.depto} onChange={(e) => setDireccion((d) => ({ ...d, depto: e.target.value }))} className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle} />
                      </div>
                      <div>
                        <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Referencias (opcional)</label>
                        <input type="text" value={direccion.referencias} onChange={(e) => setDireccion((d) => ({ ...d, referencias: e.target.value }))} placeholder="Entre calles, timbre…" className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle} />
                      </div>
                    </div>
                    <label className="flex items-start gap-2 font-elegant text-xs cursor-pointer" style={{ color: 'var(--navy-dim)' }}>
                      <input type="checkbox" checked={confirmaZona} onChange={(e) => setConfirmaZona(e.target.checked)} className="mt-0.5" />
                      <span>Confirmo que mi dirección está dentro de la zona de envíos.</span>
                    </label>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-elegant mb-3 text-xs" style={{ color: 'var(--navy-dim)' }}>Forma de pago</label>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod(ONLINE_PROVIDER)}
                    className="w-full flex items-center gap-3 p-4 text-left transition-colors"
                    style={{
                      border: `1px solid ${paymentMethod === ONLINE_PROVIDER ? 'var(--gold)' : 'var(--border)'}`,
                      backgroundColor: paymentMethod === ONLINE_PROVIDER ? 'rgba(219,163,107,0.1)' : 'transparent',
                    }}
                  >
                    <CreditCard size={18} style={{ color: 'var(--gold)' }} />
                    <div>
                      {ONLINE_PROVIDER === 'payway' ? (
                        <>
                          <p className="font-elegant text-sm" style={{ color: 'var(--navy)' }}>Pagar online con tarjeta</p>
                          <p className="font-elegant text-xs" style={{ color: 'var(--navy-dim)' }}>Crédito o débito · 1 pago o 3 cuotas · Payway</p>
                        </>
                      ) : (
                        <>
                          <p className="font-elegant text-sm" style={{ color: 'var(--navy)' }}>Pagar online con Mercado Pago</p>
                          <p className="font-elegant text-xs" style={{ color: 'var(--navy-dim)' }}>Tarjeta, cuotas, dinero en cuenta</p>
                        </>
                      )}
                    </div>
                  </button>

                  {isCard && <CardFields localSlug={local.slug} marca={marca} setMarca={setMarca} cuotas={cuotas} setCuotas={setCuotas} />}

                  {entrega === 'retiro' && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('efectivo_local')}
                      className="w-full flex items-center gap-3 p-4 text-left transition-colors"
                      style={{
                        border: `1px solid ${paymentMethod === 'efectivo_local' ? 'var(--gold)' : 'var(--border)'}`,
                        backgroundColor: paymentMethod === 'efectivo_local' ? 'rgba(219,163,107,0.1)' : 'transparent',
                      }}
                    >
                      <Banknote size={18} style={{ color: 'var(--gold)' }} />
                      <div>
                        <p className="font-elegant text-sm" style={{ color: 'var(--navy)' }}>Efectivo al retirar</p>
                        <p className="font-elegant text-xs" style={{ color: 'var(--navy-dim)' }}>10% de descuento · pagás en el punto de retiro</p>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>¿Tenés un cupón?</label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between px-3 py-2.5" style={{ border: '1px solid var(--teal)', backgroundColor: 'rgba(64,126,140,0.06)' }}>
                    <span className="flex items-center gap-2 font-elegant text-sm" style={{ color: 'var(--teal)' }}>
                      <Ticket size={14} /> {appliedCoupon} aplicado
                    </span>
                    <button type="button" onClick={handleRemoveCoupon} className="font-elegant text-xs transition-opacity hover:opacity-70" style={{ color: 'var(--navy-dim)' }}>
                      Quitar
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon() } }}
                      placeholder="CÓDIGO"
                      className="flex-1 px-3 py-2.5 font-elegant text-sm uppercase"
                      style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)', letterSpacing: '0.1em' }}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={checkingCoupon || !couponInput.trim()}
                      className="px-4 font-elegant text-xs uppercase transition-opacity hover:opacity-80 disabled:opacity-40"
                      style={{ letterSpacing: '0.15em', border: '1px solid var(--gold)', color: 'var(--gold)' }}
                    >
                      {checkingCoupon ? '...' : 'Aplicar'}
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="font-elegant text-xs mt-1.5" style={{ color: 'var(--teal)' }}>{couponError}</p>
                )}
              </div>

              {total > 0 && (
                <div className="py-4 space-y-1.5" style={{ borderTop: '1px solid var(--border)' }}>
                  {preview && (
                    <>
                      <div className="flex justify-between font-elegant text-xs" style={{ color: 'var(--navy-dim)' }}>
                        <span>Subtotal</span><span>{currency.format(preview.subtotal)}</span>
                      </div>
                      <div className="flex justify-between font-elegant text-xs" style={{ color: 'var(--teal)' }}>
                        <span>Cupón {preview.couponCode}</span><span>-{currency.format(preview.couponDiscount)}</span>
                      </div>
                      {preview.efectivoDiscount > 0 && (
                        <div className="flex justify-between font-elegant text-xs" style={{ color: 'var(--teal)' }}>
                          <span>10% efectivo</span><span>-{currency.format(preview.efectivoDiscount)}</span>
                        </div>
                      )}
                    </>
                  )}
                  {recargo > 0 && (
                    <div className="flex justify-between font-elegant text-xs" style={{ color: 'var(--navy-dim)' }}>
                      <span>Recargo 3 cuotas (10%)</span><span>+{currency.format(recargo)}</span>
                    </div>
                  )}
                  {envioCosto > 0 && (
                    <div className="flex justify-between font-elegant text-xs" style={{ color: 'var(--navy-dim)' }}>
                      <span>Envío a domicilio</span><span>+{currency.format(envioCosto)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-elegant text-xs uppercase" style={{ letterSpacing: '0.2em', color: 'var(--navy-dim)' }}>
                      {!preview && paymentMethod === 'efectivo_local' ? 'Total con 10% off' : 'Total'}
                    </span>
                    <span className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--navy)', fontStyle: 'italic' }}>
                      {currency.format(totalFinal)}
                    </span>
                  </div>
                  {isCard && cuotas === 3 && (
                    <p className="font-elegant text-xs text-right" style={{ color: 'var(--navy-dim)' }}>
                      3 cuotas de {currency.format(Math.round(totalFinal / 3))}
                    </p>
                  )}
                </div>
              )}

              {error && (
                <p className="font-elegant text-xs" style={{ color: 'var(--teal)' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 font-elegant transition-opacity hover:opacity-85 disabled:opacity-50"
                style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', backgroundColor: 'var(--gold)', color: 'var(--on-copper)' }}
              >
                {submitting ? 'Procesando...' : 'Confirmar pedido'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
