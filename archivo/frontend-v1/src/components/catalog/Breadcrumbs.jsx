import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

// items: [{ label, to }] — el último es la página actual (sin link).
export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Ruta" className="flex flex-wrap items-center gap-1.5 font-elegant" style={{ fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
      {items.map((item, i) => {
        const last = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1.5">
            {last || !item.to ? (
              <span style={{ color: last ? 'var(--navy)' : 'var(--navy-dim)' }}>{item.label}</span>
            ) : (
              <Link to={item.to} className="transition-opacity hover:opacity-60" style={{ color: 'var(--navy-dim)' }}>{item.label}</Link>
            )}
            {!last && <ChevronRight size={11} style={{ color: 'var(--gold)' }} />}
          </span>
        )
      })}
    </nav>
  )
}
