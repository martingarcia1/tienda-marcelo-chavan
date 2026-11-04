import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { MediaPromo, BotonPromo } from '../sections/Novedades'
import { LOCALES } from '../lib/locales'
import { usePromociones } from '../lib/promociones'
import { useDocumentTitle } from '../lib/hooks'

// Todas las novedades de los tres locales, con filtro por local.
export default function NovedadesPage() {
  useDocumentTitle('Novedades')
  const { promos, loading } = usePromociones()
  const [filtro, setFiltro] = useState(null)
  const conPromos = LOCALES.filter((l) => promos.some((p) => p.local_slug === l.slug))
  const visibles = filtro ? promos.filter((p) => p.local_slug === filtro) : promos

  const chip = (activo) => ({
    fontSize: '0.6rem', letterSpacing: '0.24em', textTransform: 'uppercase',
    border: '1px solid', borderColor: activo ? 'var(--copper)' : 'var(--line)',
    color: activo ? 'var(--copper)' : 'var(--ivory-dim)',
  })

  return (
    <div style={{ backgroundColor: 'var(--ink)' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-24">
        <nav className="font-sans flex gap-2 mb-10" style={{ fontSize: '0.58rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--ivory-xdim)' }}>
          <Link to="/" className="hover:text-[var(--copper)] transition-colors">Inicio</Link>
          <span>/</span>
          <span style={{ color: 'var(--ivory-dim)' }}>Novedades</span>
        </nav>

        <Reveal>
          <p className="eyebrow">Marcelo Chavan</p>
          <h1 className="font-serif font-light mt-4" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', lineHeight: 1.05, color: 'var(--ivory)' }}>Novedades</h1>
          <p className="font-sans mt-5 max-w-xl" style={{ fontSize: '0.86rem', lineHeight: 2, color: 'var(--ivory-dim)', fontWeight: 300 }}>
            Colecciones, lanzamientos y propuestas de nuestros espacios.
          </p>
        </Reveal>

        {conPromos.length > 1 && (
          <div className="flex flex-wrap gap-2 mt-10">
            <button onClick={() => setFiltro(null)} className="px-4 py-2 font-sans" style={chip(!filtro)}>Todos</button>
            {conPromos.map((l) => (
              <button key={l.slug} onClick={() => setFiltro(l.slug)} className="px-4 py-2 font-sans" style={chip(filtro === l.slug)}>{l.nombre}</button>
            ))}
          </div>
        )}

        {loading && <p className="font-sans text-sm py-16 text-center" style={{ color: 'var(--ivory-dim)' }}>Cargando...</p>}
        {!loading && promos.length === 0 && (
          <div className="text-center py-24">
            <p className="font-serif italic" style={{ fontSize: '1.6rem', color: 'var(--ivory)' }}>Próximamente</p>
            <p className="font-sans mt-3 text-sm" style={{ color: 'var(--ivory-dim)' }}>Muy pronto vas a ver acá las novedades de nuestros espacios.</p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {visibles.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i, 6) * 0.08} className="flex flex-col" >
              <div className="theme-dark relative overflow-hidden" style={{ aspectRatio: '4/5', backgroundColor: 'var(--ink-3)', border: '1px solid var(--line)' }}>
                <MediaPromo promo={p} loop />
              </div>
              <div className="pt-5">
                {p.local && (
                  <Link to={`/espacios/${p.local.slug}`} className="eyebrow hover:opacity-75 transition-opacity" style={{ fontSize: '0.56rem' }}>{p.local.nombre}</Link>
                )}
                {p.titulo && <p className="font-serif mt-2" style={{ fontSize: '1.35rem', lineHeight: 1.25, color: 'var(--ivory)' }}>{p.titulo}</p>}
                <BotonPromo promo={p} className="mt-4" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
