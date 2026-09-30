import { useState } from 'react'
import CatalogPageShell, { CatalogMessage } from '../components/catalog/CatalogPageShell'
import ProductGrid from '../components/catalog/ProductGrid'
import { useCatalog, useDocumentTitle } from '../hooks/useCatalog'
import { childrenOf, descendantIds } from '../lib/catalog'

// "Ver todo": el catálogo completo, con filtro por colección principal.
export default function CatalogPage() {
  const { catalog, loading, error } = useCatalog()
  const [active, setActive] = useState(null)
  useDocumentTitle('Catálogo')

  const roots = catalog ? childrenOf(catalog.categories, null) : []
  const categoriesById = catalog ? Object.fromEntries(catalog.categories.map((c) => [c.id, c])) : {}
  let products = catalog?.products || []
  if (catalog && active) {
    const ids = new Set(descendantIds(catalog.categories, active))
    products = products.filter((p) => ids.has(p.categoryId))
  }

  return (
    <CatalogPageShell
      breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Productos' }]}
      eyebrow="Ver todo"
      title="Catálogo completo"
    >
      {loading && <CatalogMessage>Cargando...</CatalogMessage>}
      {error && <CatalogMessage>No pudimos cargar el catálogo. Probá recargar la página.</CatalogMessage>}
      {catalog && (
        <>
          <div className="flex flex-wrap gap-2 mb-10">
            {[{ id: null, name: 'Todos' }, ...roots].map((c) => (
              <button
                key={c.id ?? 'todos'}
                onClick={() => setActive(c.id)}
                className="px-4 py-1.5 text-[9px] tracking-[0.3em] uppercase font-elegant transition-all"
                style={
                  active === c.id
                    ? { backgroundColor: 'var(--gold)', color: '#FAFAF8', border: '1px solid var(--gold)' }
                    : { backgroundColor: 'transparent', color: 'var(--navy-dim)', border: '1px solid var(--border)' }
                }
              >
                {c.name}
              </button>
            ))}
          </div>
          {products.length > 0
            ? <ProductGrid key={active ?? 'todos'} products={products} categoriesById={categoriesById} />
            : <CatalogMessage>No hay piezas publicadas en esta colección todavía.</CatalogMessage>}
        </>
      )}
    </CatalogPageShell>
  )
}
