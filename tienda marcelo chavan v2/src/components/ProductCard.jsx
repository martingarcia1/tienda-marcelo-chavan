import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Plus } from 'lucide-react'
import Reveal from './Reveal'
import { useCartStore } from '../store/cartStore'
import { whatsappHref } from '../lib/whatsapp'
import { currency } from '../lib/hooks'

export default function ProductCard({ product, local, delay = 0 }) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)
  const puedeComprar = local.modo === 'online' && product.price > 0 && product.stock > 0

  function handleAction(e) {
    e.preventDefault()
    e.stopPropagation()
    if (puedeComprar) {
      addItem(local.slug, product)
      setAdded(true)
      setTimeout(() => setAdded(false), 1300)
    } else {
      window.open(whatsappHref(`Hola! Quiero consultar por ${product.name} (${local.nombre}).`), '_blank', 'noopener')
    }
  }

  return (
    <Reveal delay={Math.min(delay, 8) * 0.05} y={24}>
      <Link to={`/espacios/${local.slug}/producto/${product.slug}`} className="group block">
        <div className="relative overflow-hidden" style={{ aspectRatio: '4/5', backgroundColor: 'var(--ink-3)' }}>
          {product.img ? (
            <img
              src={product.img}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center font-sign" style={{ color: 'var(--copper)', opacity: 0.25, fontSize: '2.5rem' }}>MCH.</div>
          )}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(to top, rgba(12,10,8,0.65), transparent 55%)' }} />

          {product.onSale && (
            <span className="absolute top-3 left-3 px-2.5 py-1 font-sans" style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', backgroundColor: 'var(--copper)', color: 'var(--ink)' }}>
              {product.offerLabel}
            </span>
          )}

          <button
            onClick={handleAction}
            className="absolute bottom-3 inset-x-3 py-2.5 font-sans flex items-center justify-center gap-2 transition-all duration-500 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0"
            style={{
              fontSize: '0.58rem', letterSpacing: '0.28em', textTransform: 'uppercase',
              backgroundColor: added ? 'var(--copper)' : 'rgba(12,10,8,0.82)',
              color: added ? 'var(--ink)' : 'var(--ivory)',
              border: '1px solid var(--line-strong)',
              backdropFilter: 'blur(6px)',
            }}
          >
            {puedeComprar ? (added ? <><Check size={12} /> Agregado</> : <><Plus size={12} /> Agregar</>) : 'Consultar'}
          </button>
        </div>

        <div className="pt-4">
          <p className="font-serif leading-snug transition-colors group-hover:text-[var(--copper)]" style={{ fontSize: '1.08rem', color: 'var(--ivory)' }}>
            {product.name}
          </p>
          {product.price > 0 ? (
            <p className="font-sans mt-1.5 flex items-baseline gap-2" style={{ fontSize: '0.74rem' }}>
              {product.onSale && <span style={{ color: 'var(--ivory-xdim)', textDecoration: 'line-through' }}>{currency.format(product.listPrice)}</span>}
              <span style={{ color: product.onSale ? 'var(--copper)' : 'var(--ivory-dim)' }}>{currency.format(product.price)}</span>
            </p>
          ) : (
            <p className="font-sans mt-1.5 italic" style={{ fontSize: '0.72rem', color: 'var(--ivory-xdim)' }}>Consultar precio</p>
          )}
        </div>
      </Link>
    </Reveal>
  )
}
