import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Ruler } from 'lucide-react'
import CatalogPageShell, { CatalogMessage } from '../components/catalog/CatalogPageShell'
import CategoryCard from '../components/catalog/CategoryCard'
import ProductGrid from '../components/catalog/ProductGrid'
import RingSizeGuide from '../components/RingSizeGuide'
import { whatsappHref } from '../components/WhatsAppButton'
import { useCatalog, useDocumentTitle } from '../hooks/useCatalog'
import { ancestorsOf, childrenOf, coverFor, needsRingSizeGuide, productsInTree } from '../lib/catalog'
import NotFoundPage from './NotFoundPage'

export default function CategoryPage() {
  const { slug } = useParams()
  const { catalog, loading, error } = useCatalog()
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  const category = catalog?.categories.find((c) => c.slug === slug)
  useDocumentTitle(category?.name)

  if (loading) return <CatalogPageShell><CatalogMessage>Cargando...</CatalogMessage></CatalogPageShell>
  if (error) return <CatalogPageShell><CatalogMessage>No pudimos cargar el catálogo. Probá recargar la página.</CatalogMessage></CatalogPageShell>
  if (!category) return <NotFoundPage />

  const chain = ancestorsOf(catalog.categories, category)
  const children = childrenOf(catalog.categories, category.id)
  const products = productsInTree(catalog, category.id)
  const categoriesById = Object.fromEntries(catalog.categories.map((c) => [c.id, c]))
  const showSizeGuide = needsRingSizeGuide(catalog.categories, category)

  const breadcrumbs = [
    { label: 'Inicio', to: '/' },
    { label: 'Productos', to: '/productos' },
    ...chain.map((c) => ({ label: c.name, to: `/categoria/${c.slug}` })),
  ]

  return (
    <CatalogPageShell
      breadcrumbs={breadcrumbs}
      eyebrow={chain.length > 1 ? chain.slice(0, -1).map((c) => c.name).join(' · ') : 'Colección'}
      title={category.name}
      description={category.description}
      actions={showSizeGuide && (
        <button
          onClick={() => setSizeGuideOpen(true)}
          className="inline-flex items-center gap-1.5 font-elegant transition-opacity hover:opacity-70"
          style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--navy)' }}
        >
          <Ruler size={13} style={{ color: 'var(--gold)' }} />
          ¿No sabés tu talle? Guía de talles
        </button>
      )}
    >
      {children.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 mb-16">
          {children.map((c, i) => {
            const count = productsInTree(catalog, c.id).length
            return (
              <CategoryCard
                key={c.id}
                to={`/categoria/${c.slug}`}
                name={c.name}
                cover={coverFor(catalog, c)}
                subtitle={count > 0 ? `${count} ${count === 1 ? 'pieza' : 'piezas'}` : 'Próximamente'}
                delay={i}
              />
            )
          })}
        </div>
      )}

      {products.length > 0 ? (
        <>
          {children.length > 0 && (
            <p className="font-elegant mb-8" style={{ fontSize: '0.62rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--navy-dim)' }}>
              Todas las piezas de {category.name} · {products.length}
            </p>
          )}
          <ProductGrid products={products} categoriesById={categoriesById} />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="font-serif font-light" style={{ fontSize: '1.3rem', color: 'var(--navy)' }}>
            Estamos preparando esta colección
          </p>
          <p className="font-elegant text-xs mt-3" style={{ color: 'var(--navy-dim)' }}>
            Consultanos por WhatsApp: tenemos piezas en el local que todavía no están publicadas.
          </p>
          <a
            href={whatsappHref(`Hola! Quiero consultar por ${chain.map((c) => c.name).join(' › ')}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 px-6 py-3 font-elegant transition-opacity hover:opacity-85"
            style={{ fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', backgroundColor: 'var(--gold)', color: '#fff' }}
          >
            Consultar
          </a>
        </div>
      )}

      <RingSizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </CatalogPageShell>
  )
}
