import { Link } from 'react-router-dom'
import Monogram from '../components/Monogram'
import { useDocumentTitle } from '../lib/hooks'

export default function NotFoundPage() {
  useDocumentTitle('Página no encontrada')
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 pt-20" style={{ backgroundColor: 'var(--ink)' }}>
      <Monogram size={1.6} />
      <h1 className="font-serif font-light mt-8" style={{ fontSize: '2.2rem', color: 'var(--ivory)' }}>No encontramos esta página</h1>
      <p className="font-sans mt-3 text-sm" style={{ color: 'var(--ivory-dim)' }}>Puede que la pieza ya no esté publicada o que el link haya cambiado.</p>
      <Link to="/#espacios" className="mt-10 px-8 py-4 font-sans" style={{ fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', backgroundColor: 'var(--copper)', color: 'var(--ink)' }}>
        Ver nuestros espacios
      </Link>
    </div>
  )
}
