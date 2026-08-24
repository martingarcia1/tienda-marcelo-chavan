import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore, selectTotalPrice } from '../store/cartStore'
import { whatsappHref } from './WhatsAppButton'

const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

function mensajePedido(items, total) {
  const lineas = items.map((i) => `• ${i.qty}x ${i.name}${i.price > 0 ? ` — ${currency.format(i.price * i.qty)}` : ''}`)
  const totalLinea = total > 0 ? `\n\nTotal: ${currency.format(total)}` : ''
  return `Hola! Quiero hacer este pedido:\n\n${lineas.join('\n')}${totalLinea}`
}

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const items = useCartStore((s) => s.items)
  const updateQty = useCartStore((s) => s.updateQty)
  const removeItem = useCartStore((s) => s.removeItem)
  const total = useCartStore(selectTotalPrice)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(8,58,79,0.55)' }}
            onClick={closeCart}
          />

          <motion.div
            className="relative h-full w-full max-w-md flex flex-col"
            style={{ backgroundColor: 'var(--bg)', boxShadow: '-20px 0 60px rgba(8,58,79,0.3)' }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
              <h3 className="font-serif font-light" style={{ fontSize: '1.4rem', color: 'var(--navy)' }}>
                Tu carrito
              </h3>
              <button onClick={closeCart} aria-label="Cerrar" className="p-1 transition-opacity hover:opacity-60" style={{ color: 'var(--navy)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                  <ShoppingBag size={28} style={{ color: 'var(--border-gold)' }} />
                  <p className="font-elegant text-sm" style={{ color: 'var(--navy-dim)' }}>
                    Todavía no agregaste productos.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div
                        className="flex-shrink-0 overflow-hidden"
                        style={{ width: '72px', height: '72px', backgroundColor: 'var(--bg-sand)' }}
                      >
                        {item.img ? (
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--gold)', opacity: 0.3 }}>◆</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-sm leading-tight mb-1" style={{ color: 'var(--navy)' }}>
                          {item.name}
                        </p>
                        {item.price > 0 && (
                          <p className="font-elegant text-xs mb-2" style={{ color: 'var(--navy-dim)' }}>
                            {currency.format(item.price)}
                          </p>
                        )}

                        <div className="flex items-center gap-3">
                          <div className="flex items-center" style={{ border: '1px solid var(--border)' }}>
                            <button
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              aria-label="Restar"
                              className="p-1.5 transition-opacity hover:opacity-60"
                              style={{ color: 'var(--navy)' }}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center font-elegant text-xs" style={{ color: 'var(--navy)' }}>
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              aria-label="Sumar"
                              className="p-1.5 transition-opacity hover:opacity-60"
                              style={{ color: 'var(--navy)' }}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            aria-label="Quitar"
                            className="p-1.5 transition-opacity hover:opacity-60"
                            style={{ color: 'var(--teal)' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-6" style={{ borderTop: '1px solid var(--border)' }}>
                {total > 0 && (
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-elegant text-xs uppercase" style={{ letterSpacing: '0.2em', color: 'var(--navy-dim)' }}>
                      Total
                    </span>
                    <span className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--navy)', fontStyle: 'italic' }}>
                      {currency.format(total)}
                    </span>
                  </div>
                )}
                <a
                  href={whatsappHref(mensajePedido(items, total))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-3.5 font-elegant transition-opacity hover:opacity-85"
                  style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', backgroundColor: 'var(--gold)', color: '#fff' }}
                >
                  Finalizar por WhatsApp
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
