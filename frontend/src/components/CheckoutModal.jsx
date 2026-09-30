import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Store, Ticket } from 'lucide-react'
import { useCartStore, selectTotalPrice } from '../store/cartStore'
import { supabase } from '../lib/supabase'
import { whatsappHref } from './WhatsAppButton'

const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

function mensajePedidoLocal(orderId, items, total, formaPago, cupon) {
  const lineas = items.map((i) => `• ${i.qty}x ${i.name}`)
  const formaPagoTexto = formaPago === 'efectivo_local' ? 'Efectivo (10% off)' : 'Transferencia'
  const cuponLinea = cupon ? `\nCupón: ${cupon}` : ''
  const totalLinea = total > 0 ? `\nTotal: ${currency.format(total)}` : ''
  return `Hola! Quiero retirar y pagar en el local este pedido (N° ${orderId.slice(0, 8)}):\n\n${lineas.join('\n')}${cuponLinea}${totalLinea}\nForma de pago: ${formaPagoTexto}`
}

export default function CheckoutModal({ open, onClose }) {
  const items = useCartStore((s) => s.items)
  const total = useCartStore(selectTotalPrice)
  const clearCart = useCartStore((s) => s.clearCart)

  const [form, setForm] = useState({ customer_name: '', customer_phone: '', customer_email: '' })
  const [paymentMethod, setPaymentMethod] = useState('mercadopago')
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
      body: { dry_run: true, coupon_code: code, payment_method: method, items: cartPayload },
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

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.customer_name.trim() || !form.customer_phone.trim()) {
      setError('Completá tu nombre y teléfono para continuar.')
      return
    }

    setSubmitting(true)
    const { data, error: fnError } = await supabase.functions.invoke('create-order', {
      body: {
        ...form,
        payment_method: paymentMethod,
        coupon_code: appliedCoupon || null,
        items: cartPayload,
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

    // Retiro en el local: abrimos WhatsApp con el resumen y cerramos todo.
    const mensaje = mensajePedidoLocal(data.orderId, items, data.total, paymentMethod, appliedCoupon)
    window.open(whatsappHref(mensaje), '_blank')
    clearCart()
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[75] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(8,58,79,0.55)' }}
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-8"
            style={{ backgroundColor: 'var(--bg)', boxShadow: '0 30px 80px rgba(8,58,79,0.35)' }}
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
                  <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Email (opcional)</label>
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
                <label className="block font-elegant mb-3 text-xs" style={{ color: 'var(--navy-dim)' }}>Forma de pago</label>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mercadopago')}
                    className="w-full flex items-center gap-3 p-4 text-left transition-colors"
                    style={{
                      border: `1px solid ${paymentMethod === 'mercadopago' ? 'var(--gold)' : 'var(--border)'}`,
                      backgroundColor: paymentMethod === 'mercadopago' ? 'rgba(165,141,102,0.08)' : 'transparent',
                    }}
                  >
                    <CreditCard size={18} style={{ color: 'var(--gold)' }} />
                    <div>
                      <p className="font-elegant text-sm" style={{ color: 'var(--navy)' }}>Pagar online con Mercado Pago</p>
                      <p className="font-elegant text-xs" style={{ color: 'var(--navy-dim)' }}>Tarjeta, cuotas, dinero en cuenta</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('efectivo_local')}
                    className="w-full flex items-center gap-3 p-4 text-left transition-colors"
                    style={{
                      border: `1px solid ${paymentMethod === 'efectivo_local' ? 'var(--gold)' : 'var(--border)'}`,
                      backgroundColor: paymentMethod === 'efectivo_local' ? 'rgba(165,141,102,0.08)' : 'transparent',
                    }}
                  >
                    <Store size={18} style={{ color: 'var(--gold)' }} />
                    <div>
                      <p className="font-elegant text-sm" style={{ color: 'var(--navy)' }}>Retirar en el local — Efectivo</p>
                      <p className="font-elegant text-xs" style={{ color: 'var(--navy-dim)' }}>10% de descuento, te contactamos por WhatsApp</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transferencia_local')}
                    className="w-full flex items-center gap-3 p-4 text-left transition-colors"
                    style={{
                      border: `1px solid ${paymentMethod === 'transferencia_local' ? 'var(--gold)' : 'var(--border)'}`,
                      backgroundColor: paymentMethod === 'transferencia_local' ? 'rgba(165,141,102,0.08)' : 'transparent',
                    }}
                  >
                    <Store size={18} style={{ color: 'var(--gold)' }} />
                    <div>
                      <p className="font-elegant text-sm" style={{ color: 'var(--navy)' }}>Retirar en el local — Transferencia</p>
                      <p className="font-elegant text-xs" style={{ color: 'var(--navy-dim)' }}>Precio de lista, te contactamos por WhatsApp</p>
                    </div>
                  </button>
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
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-elegant text-xs uppercase" style={{ letterSpacing: '0.2em', color: 'var(--navy-dim)' }}>
                      {!preview && paymentMethod === 'efectivo_local' ? 'Total con 10% off' : 'Total'}
                    </span>
                    <span className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--navy)', fontStyle: 'italic' }}>
                      {currency.format(preview ? preview.total : paymentMethod === 'efectivo_local' ? Math.round(total * 0.9) : total)}
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <p className="font-elegant text-xs" style={{ color: 'var(--teal)' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 font-elegant transition-opacity hover:opacity-85 disabled:opacity-50"
                style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', backgroundColor: 'var(--gold)', color: '#fff' }}
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
