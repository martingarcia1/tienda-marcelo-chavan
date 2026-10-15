import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Reveal from '../components/Reveal'
import CategoryTile from '../components/CategoryTile'
import ProductCard from '../components/ProductCard'
import { getLocal } from '../lib/locales'
import { useCatalog, useDocumentTitle } from '../lib/hooks'
import { withModo, categoriesOfLocal, categoryChain, productsInBranch } from '../lib/catalog'
import NotFoundPage from './NotFoundPage'

// Una categoría dentro de la vidriera de un local: sus subcategorías (solo
// las que tienen piezas de este local) y todas las piezas de la rama.
export default function LocalCategoryPage() {
  const { slug, catSlug } = useParams()
  const { catalog, loading, error } = useCatalog()
  const local = withModo(getLocal(slug), catalog)
  const category = catalog?.categories.find((c) => c.slug === catSlug)
  useDocumentTitle(category && local ? `${category.name} · ${local.nombre}` : null)

  if (!local) return <NotFoundPage />
  if (loading) return <div className="min-h-[70vh] pt-40 text-center font-sans text-sm" style={{ color: 'var(--ivory-dim)' }}>Cargando...</div>
  if (error) return <div className="min-h-[70vh] pt-40 text-center font-sans text-sm" style={{ color: 'var(--ivory-dim)' }}>No pudimos cargar la vidriera. Probá recargar la página.</div>
  if (!category) return <NotFoundPage />

  const chain = categoryChain(catalog, category.id)
  const hijas = categoriesOfLocal(catalog, local.slug, category.id)
  const products = productsInBranch(catalog, local.slug, category.id)
  const padre = chain.length > 1 ? chain[chain.length - 2] : null
  const volver = padre ? `/espacios/${local.slug}/categoria/${padre.slug}` : `/espacios/${local.slug}#vidriera`

  return (
    <div style={{ backgroundColor: 'var(--ink)' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-24">
        <nav className="font-sans flex flex-wrap gap-2 mb-10" style={{ fontSize: '0.58rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--ivory-xdim)' }}>
          <Link to="/" className="hover:text-[var(--copper)] transition-colors">Inicio</Link>
          <span>/</span>
          <Link to={`/espacios/${local.slug}`} className="hover:text-[var(--copper)] transition-colors">{local.nombre}</Link>
          {chain.map((c, i) => (
            <span key={c.id} className="flex gap-2">
              <span>/</span>
              {i === chain.length - 1
                ? <span style={{ color: 'var(--ivory-dim)' }}>{c.name}</span>
                : <Link to={`/espacios/${local.slug}/categoria/${c.slug}`} className="hover:text-[var(--copper)] transition-colors">{c.name}</Link>}
            </span>
          ))}
        </nav>

        <Reveal>
          <p className="eyebrow">{local.nombre}</p>
          <h1 className="font-serif font-light mt-4" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', lineHeight: 1.05, color: 'var(--ivory)' }}>
            {category.name}
          </h1>
          {category.description && (
            <p className="font-sans mt-5 max-w-2xl" style={{ fontSize: '0.86rem', lineHeight: 2, color: 'var(--ivory-dim)', fontWeight: 300 }}>{category.description}</p>
          )}
          <Link to={volver} className="inline-flex items-center gap-2 mt-6 font-sans transition-colors hover:text-[var(--copper)]" style={{ fontSize: '0.62rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--ivory-dim)' }}>
            <ArrowLeft size={13} /> {padre ? padre.name : 'Volver a la vidriera'}
          </Link>
        </Reveal>

        {hijas.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 mt-14">
            {hijas.map((c, i) => <CategoryTile key={c.id} localSlug={local.slug} category={c} delay={i} />)}
          </div>
        )}

        {products.length > 0 ? (
          <div className="mt-16">
            {hijas.length > 0 && (
              <p className="eyebrow mb-10">Todas las piezas de {category.name} · {products.length}</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
              {products.map((p, i) => <ProductCard key={p.id} product={p} local={local} delay={i} />)}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-serif italic" style={{ fontSize: '1.6rem', color: 'var(--ivory)' }}>No hay piezas publicadas en esta categoría</p>
            <Link to={`/espacios/${local.slug}#vidriera`} className="inline-block mt-6 font-sans" style={{ fontSize: '0.62rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--copper)' }}>
              Ver la vidriera completa
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
