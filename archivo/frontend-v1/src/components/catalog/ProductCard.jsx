import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Check } from 'lucide-react'
import { whatsappHref } from '../WhatsAppButton'
import { useCartStore } from '../../store/cartStore'

const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

export default function ProductCard({ product, categoryName, delay = 0 }) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)

  function handleAddToCart(e) {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: Math.min(delay, 8) * 0.05, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link to={`/producto/${product.slug}`} className="group block">
        <div className="relative overflow-hidden mb-3" style={{ aspectRatio: '1/1', backgroundColor: 'var(--bg-sand)' }}>
          {product.img ? (
            <img
              src={product.img}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif select-none" style={{ fontSize: '3rem', color: 'var(--gold)', opacity: 0.12 }}>◆</span>
            </div>
          )}

          {product.tag && (
            <div
              className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[8px] tracking-[0.3em] uppercase font-elegant"
              style={{ backgroundColor: 'var(--navy)', color: '#FAFAF8' }}
            >
              {product.tag}
            </div>
          )}
          {product.onSale && (
            <div
              className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[8px] tracking-[0.2em] uppercase font-elegant"
              style={{ backgroundColor: 'var(--teal)', color: '#FAFAF8' }}
            >
              {product.offerLabel}
            </div>
          )}

          {/* Acciones rápidas: solo con hover real de mouse (en táctil quedan
              ocultas para no taparle el toque a la tarjeta). */}
          <div
            className="hidden md:flex absolute inset-0 flex-col items-center justify-center gap-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300"
            style={{ backgroundColor: 'rgba(8,58,79,0.08)' }}
          >
            {product.price > 0 && (
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-1.5 text-[9px] tracking-[0.3em] uppercase font-elegant px-4 py-2 transition-opacity hover:opacity-85"
                style={{ color: '#fff', backgroundColor: added ? 'var(--teal)' : 'var(--gold)' }}
              >
                {added ? <Check size={12} /> : <ShoppingBag size={12} />}
                {added ? 'Agregado' : 'Agregar al carrito'}
              </button>
            )}
            <span
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                window.open(whatsappHref(`Hola! Quiero consultar por ${product.name}.`), '_blank', 'noopener')
              }}
              className="text-[9px] tracking-[0.4em] uppercase font-elegant px-4 py-2 border transition-opacity hover:opacity-70 cursor-pointer"
              style={{ color: 'var(--navy)', borderColor: 'var(--border-gold)', backgroundColor: 'rgba(250,250,248,0.85)' }}
            >
              Consultar
            </span>
          </div>
        </div>

        {categoryName && (
          <p className="text-[9px] tracking-[0.3em] uppercase font-elegant mb-1" style={{ color: 'var(--gold)' }}>
            {categoryName}
          </p>
        )}
        <p className="text-sm font-serif leading-tight" style={{ color: 'var(--navy)' }}>{product.name}</p>
        {product.price > 0 ? (
          product.onSale ? (
            <p className="text-xs font-elegant mt-1 flex items-center gap-2">
              <span style={{ color: 'var(--navy-xdim)', textDecoration: 'line-through' }}>{currency.format(product.listPrice)}</span>
              <span style={{ color: 'var(--teal)' }}>{currency.format(product.price)}</span>
            </p>
          ) : (
            <p className="text-xs font-elegant mt-1" style={{ color: 'var(--navy-dim)' }}>{currency.format(product.price)}</p>
          )
        ) : (
          <p className="text-xs font-elegant mt-1 italic" style={{ color: 'var(--navy-xdim)' }}>Consultar precio</p>
        )}
      </Link>
    </motion.div>
  )
}
