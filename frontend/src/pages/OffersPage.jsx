import CatalogPageShell, { CatalogMessage } from '../components/catalog/CatalogPageShell'
import ProductGrid from '../components/catalog/ProductGrid'
import { useCatalog, useDocumentTitle } from '../hooks/useCatalog'

// Se arma sola: todos los productos con una oferta vigente hoy.
export default function OffersPage() {
  const { catalog, loading, error } = useCatalog()
  useDocumentTitle('Promos y ofertas')

  const products = catalog ? catalog.products.filter((p) => p.onSale) : []
  const categoriesById = catalog ? Object.fromEntries(catalog.categories.map((c) => [c.id, c])) : {}

  return (
    <CatalogPageShell
      breadcrumbs={[{ label: 'Inicio', to: '/' }, { label: 'Productos', to: '/productos' }, { label: 'Ofertas' }]}
      eyebrow="Promos y ofertas"
      title="Piezas con descuento"
      description="Precios especiales por tiempo limitado. El descuento ya está aplicado y se suma al 10% extra pagando en efectivo en el local."
    >
      {loading && <CatalogMessage>Cargando...</CatalogMessage>}
      {error && <CatalogMessage>No pudimos cargar las ofertas. Probá recargar la página.</CatalogMessage>}
      {catalog && (products.length > 0
        ? <ProductGrid products={products} categoriesById={categoriesById} />
        : <CatalogMessage>No hay ofertas vigentes en este momento. ¡Volvé pronto!</CatalogMessage>)}
    </CatalogPageShell>
  )
}
