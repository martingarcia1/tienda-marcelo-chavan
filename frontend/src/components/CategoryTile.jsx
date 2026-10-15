import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal from './Reveal'

// Portada de una categoría dentro de la vidriera de un local.
export default function CategoryTile({ localSlug, category, delay = 0 }) {
  return (
    <Reveal delay={Math.min(delay, 6) * 0.08}>
      <Link
        to={`/espacios/${localSlug}/categoria/${category.slug}`}
        className="theme-dark group relative block overflow-hidden"
        style={{ aspectRatio: '4/5', backgroundColor: 'var(--ink-3)' }}
      >
        {category.cover ? (
          <img
            src={category.cover}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.07]"
            style={{ filter: 'brightness(0.7) saturate(0.9)' }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-sign" style={{ color: 'var(--copper)', opacity: 0.2, fontSize: '2.4rem' }}>MCH.</div>
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(12,10,8,0.92) 0%, rgba(12,10,8,0.25) 55%, transparent 80%)' }} />
        <div className="absolute inset-3 pointer-events-none transition-colors duration-700 group-hover:border-[var(--line-strong)]" style={{ border: '1px solid var(--line)' }} />

        <div className="absolute inset-x-0 bottom-0 p-6">
          <p className="font-serif font-light" style={{ fontSize: 'clamp(1.4rem, 2.2vw, 1.9rem)', lineHeight: 1.1, color: 'var(--ivory)' }}>
            {category.name}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="font-sans" style={{ fontSize: '0.56rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--ivory-dim)' }}>
              {category.count === 0 ? 'Próximamente' : `${category.count} ${category.count === 1 ? 'pieza' : 'piezas'}`}
            </span>
            <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1" style={{ color: 'var(--copper)' }} />
          </div>
        </div>
      </Link>
    </Reveal>
  )
}
