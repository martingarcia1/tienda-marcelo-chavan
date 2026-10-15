import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, CheckCircle2 } from 'lucide-react'
import { useCartStore, cartTotal } from '../store/cartStore'
import { getLocal, nombresDuenos } from '../lib/locales'
import { currency } from '../lib/hooks'

const inputStyle = { backgroundColor: 'var(--ink-3)', border: '1px solid var(--line)', color: 'var(--ivory)' }

// Checkout de DEMOSTRACIÓN: no llama a ningún servidor ni cobra nada. Muestra
// cómo se vería la compra en un local con pasarela propia.
function DemoCheckout({ local, items, total, done, onConfirm, onDone }) {
  const [form, setForm] = useState({ nombre: '', telefono: '' })

  if (done) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-10">
        <CheckCircle2 size={40} strokeWidth={1.2} style={{ color: 'var(--copper)' }} />
        <p className="font-serif mt-6" style={{ fontSize: '1.7rem', color: 'var(--ivory)' }}>¡Gracias, {done.split(' ')[0]}!</p>
        <p className="font-sans mt-4" style={{ fontSize: '0.76rem', lineHeight: 1.9, color: 'var(--ivory-dim)' }}>
          Esto es una <strong style={{ color: 'var(--copper)', fontWeight: 500 }}>demostración</strong>: no se realizó ningún cobro.
          En la versión final, este pago de {currency.format(total)} se acreditaría directamente en la cuenta de {local.nombre} ({nombresDuenos(local)}).
        </p>
        <button
          onClick={onDone}
          className="mt-8 px-8 py-3.5 font-sans transition-opacity hover:opacity-85"
          style={{ fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', backgroundColor: 'var(--copper)', color: 'var(--on-copper)' }}
        >
          Cerrar
        </button>
      </div>
    )
  }

  return (
    <form
      className="px-7 py-6 space-y-4"
      style={{ borderTop: '1px solid var(--line)' }}
      onSubmit={(e) => { e.preventDefault(); if (form.nombre.trim() && form.telefono.trim()) onConfirm(form.nombre) }}
    >
      <p className="eyebrow">Finalizar compra · demo</p>
      <input required placeholder="Nombre y apellido" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full px-4 py-3 font-sans text-sm outline-none focus:border-[var(--copper)]" style={inputStyle} />
      <input required placeholder="Teléfono" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className="w-full px-4 py-3 font-sans text-sm outline-none focus:border-[var(--copper)]" style={inputStyle} />
      <div className="flex justify-between items-baseline pt-2">
        <span className="font-sans" style={{ fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--ivory-dim)' }}>Total</span>
        <span className="font-serif italic" style={{ fontSize: '1.7rem', color: 'var(--ivory)' }}>{currency.format(total)}</span>
      </div>
      <button
        type="submit"
        disabled={items.length === 0}
        className="w-full py-4 font-sans transition-opacity hover:opacity-85 disabled:opacity-40"
        style={{ fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', backgroundColor: 'var(--copper)', color: 'var(--on-copper)' }}
      >
        Pagar (demostración)
      </button>
      <p className="font-sans text-center" style={{ fontSize: '0.64rem', color: 'var(--ivory-xdim)' }}>
        Versión de presentación: no se cobra nada.
      </p>
    </form>
  )
}

const EMPTY = []

export default function CartDrawer() {
  const openFor = useCartStore((s) => s.openFor)
  const items = useCartStore((s) => (openFor && s.carts[openFor]) || EMPTY)
  const closeCart = useCartStore((s) => s.closeCart)
  const updateQty = useCartStore((s) => s.updateQty)
  const clearCart = useCartStore((s) => s.clearCart)
  const local = openFor ? getLocal(openFor) : null
  const total = cartTotal(items)
  // Nombre del cliente una vez "pagado" (demo); mientras tanto, null.
  const [doneName, setDoneName] = useState(null)

  function handleClose() {
    if (doneName) finish()
    else closeCart()
  }

  function finish() {
    clearCart(local.slug)
    setDoneName(null)
    closeCart()
  }

  return (
    <AnimatePresence>
      {local && (
        <motion.div className="fixed inset-0 z-[70] flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0" style={{ backgroundColor: 'var(--overlay)' }} onClick={handleClose} />
          <motion.aside
            className="relative h-full w-full max-w-md flex flex-col"
            style={{ backgroundColor: 'var(--ink-2)', borderLeft: '1px solid var(--line)' }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <div className="flex items-start justify-between px-7 py-6" style={{ borderBottom: '1px solid var(--line)' }}>
              <div>
                <p className="eyebrow">Tu compra en</p>
                <p className="font-serif mt-1.5" style={{ fontSize: '1.5rem', color: 'var(--ivory)' }}>{local.nombre}</p>
              </div>
              <button onClick={handleClose} aria-label="Cerrar" className="p-1 transition-opacity hover:opacity-60" style={{ color: 'var(--ivory)' }}>
                <X size={20} strokeWidth={1.4} />
              </button>
            </div>

            {!doneName && <div className="flex-1 overflow-y-auto px-7 py-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-3">
                  <ShoppingBag size={26} strokeWidth={1.2} style={{ color: 'var(--copper)' }} />
                  <p className="font-sans text-sm" style={{ color: 'var(--ivory-dim)' }}>Todavía no agregaste piezas de este espacio.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((it) => (
                    <div key={it.id} className="flex gap-4">
                      <div className="flex-shrink-0 overflow-hidden" style={{ width: 72, height: 72, backgroundColor: 'var(--ink-3)' }}>
                        {it.img && <img src={it.img} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif leading-tight" style={{ fontSize: '1.05rem', color: 'var(--ivory)' }}>{it.name}</p>
                        <p className="font-sans text-xs mt-1" style={{ color: 'var(--ivory-dim)' }}>{currency.format(it.price)}</p>
                        <div className="inline-flex items-center mt-2" style={{ border: '1px solid var(--line)' }}>
                          <button onClick={() => updateQty(local.slug, it.id, it.qty - 1)} aria-label="Restar" className="p-1.5" style={{ color: 'var(--ivory)' }}><Minus size={12} /></button>
                          <span className="w-8 text-center font-sans text-xs" style={{ color: 'var(--ivory)' }}>{it.qty}</span>
                          <button onClick={() => updateQty(local.slug, it.id, it.qty + 1)} aria-label="Sumar" className="p-1.5" style={{ color: 'var(--ivory)' }}><Plus size={12} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>}

            {items.length > 0 && (
              <DemoCheckout
                key={local.slug}
                local={local}
                items={items}
                total={total}
                done={doneName}
                onConfirm={setDoneName}
                onDone={finish}
              />
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
