import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCartStore, cartTotal } from '../store/cartStore'
import { getLocal } from '../lib/locales'
import { withModo } from '../lib/catalog'
import { currency, useCatalog } from '../lib/hooks'
import CheckoutModal from './CheckoutModal'

const EMPTY = []

// Carrito de un local: cada local cobra en su propia billetera, así que nunca
// se mezclan piezas de distintos locales en una misma compra.
export default function CartDrawer() {
  const openFor = useCartStore((s) => s.openFor)
  const items = useCartStore((s) => (openFor && s.carts[openFor]) || EMPTY)
  const closeCart = useCartStore((s) => s.closeCart)
  const updateQty = useCartStore((s) => s.updateQty)
  const { catalog } = useCatalog()
  const local = openFor ? withModo(getLocal(openFor), catalog) : null
  const total = cartTotal(items)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  return (
    <>
      <AnimatePresence>
        {local && (
          <motion.div className="fixed inset-0 z-[70] flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ backgroundColor: 'var(--overlay)' }} onClick={closeCart} />
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
                <button onClick={closeCart} aria-label="Cerrar" className="p-1 transition-opacity hover:opacity-60" style={{ color: 'var(--ivory)' }}>
                  <X size={20} strokeWidth={1.4} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-7 py-6">
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
                          <div className="flex items-center justify-between mt-2">
                            <div className="inline-flex items-center" style={{ border: '1px solid var(--line)' }}>
                              <button onClick={() => updateQty(local.slug, it.id, it.qty - 1)} aria-label="Restar" className="p-1.5" style={{ color: 'var(--ivory)' }}><Minus size={12} /></button>
                              <span className="w-8 text-center font-sans text-xs" style={{ color: 'var(--ivory)' }}>{it.qty}</span>
                              <button onClick={() => updateQty(local.slug, it.id, it.qty + 1)} aria-label="Sumar" className="p-1.5" style={{ color: 'var(--ivory)' }}><Plus size={12} /></button>
                            </div>
                            <button
                              onClick={() => updateQty(local.slug, it.id, 0)}
                              aria-label={`Quitar ${it.name} del carrito`}
                              className="flex items-center gap-1.5 p-1.5 font-sans transition-colors hover:text-[var(--copper)]"
                              style={{ fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ivory-xdim)' }}
                            >
                              <Trash2 size={13} strokeWidth={1.5} /> Quitar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <div className="px-7 py-6 space-y-5" style={{ borderTop: '1px solid var(--line)' }}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-sans" style={{ fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--ivory-dim)' }}>Total</span>
                    <span className="font-serif italic" style={{ fontSize: '1.7rem', color: 'var(--ivory)' }}>{currency.format(total)}</span>
                  </div>
                  <button
                    onClick={() => setCheckoutOpen(true)}
                    disabled={local.modo !== 'online'}
                    className="w-full py-4 font-sans transition-opacity hover:opacity-85 disabled:opacity-40"
                    style={{ fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', backgroundColor: 'var(--copper)', color: 'var(--on-copper)', fontWeight: 500 }}
                  >
                    Finalizar compra
                  </button>
                </div>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {local && local.modo === 'online' && (
        <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} local={local} />
      )}
    </>
  )
}
