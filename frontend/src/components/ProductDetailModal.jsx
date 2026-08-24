import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Check } from 'lucide-react'
import { useState } from 'react'
import { whatsappHref } from './WhatsAppButton'
import { useCartStore } from '../store/cartStore'

const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

export default function ProductDetailModal({ product, onClose }) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)

  function handleAddToCart() {
    if (!product) return
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[65] flex items-center justify-center p-4"
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
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto grid md:grid-cols-2"
            style={{ backgroundColor: 'var(--bg)', boxShadow: '0 30px 80px rgba(8,58,79,0.35)' }}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute top-4 right-4 p-1.5 z-10 transition-opacity hover:opacity-70"
              style={{ color: '#fff', backgroundColor: 'rgba(8,58,79,0.4)', borderRadius: '50%' }}
            >
              <X size={18} />
            </button>

            {/* Foto */}
            <div className="relative" style={{ aspectRatio: '1/1', backgroundColor: 'var(--bg-sand)' }}>
              {product.img ? (
                <img src={product.img} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif" style={{ fontSize: '4rem', color: 'var(--gold)', opacity: 0.15 }}>◆</span>
                </div>
              )}
              {product.tag && (
                <div
                  className="absolute top-4 left-4 px-2.5 py-1 text-[8px] tracking-[0.3em] uppercase font-elegant"
                  style={{ backgroundColor: product.tag === 'Promos' ? 'var(--teal)' : 'var(--navy)', color: '#FAFAF8' }}
                >
                  {product.tag}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-8 flex flex-col">
              <p
                className="font-elegant mb-2"
                style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)' }}
              >
                {product.cat}
              </p>
              <h3 className="font-serif font-light mb-3" style={{ fontSize: '1.7rem', color: 'var(--navy)' }}>
                {product.name}
              </h3>

              {product.price > 0 && (
                <p className="font-serif mb-5" style={{ fontSize: '1.3rem', color: 'var(--navy)', fontStyle: 'italic' }}>
                  {currency.format(product.price)}
                </p>
              )}

              {product.description ? (
                <p className="font-elegant mb-8" style={{ fontSize: '0.85rem', lineHeight: 1.9, color: 'var(--navy-dim)' }}>
                  {product.description}
                </p>
              ) : (
                <p className="font-elegant mb-8 italic" style={{ fontSize: '0.8rem', color: 'var(--navy-xdim)' }}>
                  Consultanos por WhatsApp para más detalles de esta pieza.
                </p>
              )}

              <div className="mt-auto flex flex-col gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 py-3 font-elegant transition-opacity hover:opacity-85"
                  style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', backgroundColor: added ? 'var(--teal)' : 'var(--gold)', color: '#fff' }}
                >
                  {added ? <Check size={14} /> : <ShoppingBag size={14} />}
                  {added ? 'Agregado al carrito' : 'Agregar al carrito'}
                </button>
                <a
                  href={whatsappHref(`Hola! Quiero consultar por ${product.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center py-3 font-elegant border transition-opacity hover:opacity-70"
                  style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--navy)', borderColor: 'var(--border-gold)' }}
                >
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
