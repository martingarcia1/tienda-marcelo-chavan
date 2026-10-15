import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useCatalog'

export default function NotFoundPage() {
  useDocumentTitle('Página no encontrada')

  return (
    <div className="flex flex-col items-center justify-center text-center px-6" style={{ minHeight: '60vh', backgroundColor: 'var(--bg-alt)' }}>
      <span className="font-serif" style={{ fontSize: '3rem', color: 'var(--gold)', opacity: 0.3 }}>◆</span>
      <h1 className="font-serif font-light mt-4" style={{ fontSize: '1.8rem', color: 'var(--navy)' }}>
        No encontramos esta página
      </h1>
      <p className="font-elegant text-xs mt-3" style={{ color: 'var(--navy-dim)' }}>
        Puede que el producto ya no esté publicado o que el link haya cambiado.
      </p>
      <Link
        to="/productos"
        className="mt-8 px-6 py-3 font-elegant transition-opacity hover:opacity-85"
        style={{ fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', backgroundColor: 'var(--gold)', color: '#fff' }}
      >
        Ver el catálogo
      </Link>
    </div>
  )
}
