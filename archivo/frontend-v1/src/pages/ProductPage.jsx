import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShoppingBag, Check, Minus, Plus, Ruler } from 'lucide-react'
import Breadcrumbs from '../components/catalog/Breadcrumbs'
import ProductGrid from '../components/catalog/ProductGrid'
import { CatalogMessage } from '../components/catalog/CatalogPageShell'
import RingSizeGuide from '../components/RingSizeGuide'
import { whatsappHref } from '../components/WhatsAppButton'
import { useCartStore } from '../store/cartStore'
import { useCatalog, useDocumentTitle } from '../hooks/useCatalog'
import { ancestorsOf, needsRingSizeGuide } from '../lib/catalog'
import NotFoundPage from './NotFoundPage'

const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

// Se remonta al cambiar de producto (ej. desde "También te puede gustar")
// para que la foto elegida y la cantidad no se arrastren al siguiente.
export default function ProductPageRoute() {
  const { slug } = useParams()
  return <ProductPage key={slug} slug={slug} />
}

function ProductPage({ slug }) {
  const { catalog, loading, error } = useCatalog()
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  const product = catalog?.products.find((p) => p.slug === slug)
  useDocumentTitle(product?.name)

  if (loading) return <div style={{ minHeight: '70vh' }}><CatalogMessage>Cargando...</CatalogMessage></div>
  if (error) return <div style={{ minHeight: '70vh' }}><CatalogMessage>No pudimos cargar el producto. Probá recargar la página.</CatalogMessage></div>
  if (!product) return <NotFoundPage />

  const category = catalog.categories.find((c) => c.id === product.categoryId)
  const chain = category ? ancestorsOf(catalog.categories, category) : []
  const showSizeGuide = category && needsRingSizeGuide(catalog.categories, category)
  const related = catalog.products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 5)
  const categoriesById = Object.fromEntries(catalog.categories.map((c) => [c.id, c]))
  const image = product.images[activeImage] || product.img
  const sinStock = product.stock <= 0

  function handleAdd() {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => { setAdded(false); openCart() }, 700)
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-alt)' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-8 pb-16">
        <Breadcrumbs
          items={[
            { label: 'Inicio', to: '/' },
            { label: 'Productos', to: '/productos' },
            ...chain.map((c) => ({ label: c.name, to: `/categoria/${c.slug}` })),
            { label: product.name },
          ]}
        />

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 mt-8">
          {/* Galería */}
          <div>
            <div className="relative overflow-hidden" style={{ aspectRatio: '1/1', backgroundColor: 'var(--bg-sand)' }}>
              {image ? (
                <img src={image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif" style={{ fontSize: '5rem', color: 'var(--gold)', opacity: 0.15 }}>◆</span>
                </div>
              )}
              {product.onSale && (
                <div className="absolute top-4 right-4 px-2.5 py-1 text-[9px] tracking-[0.2em] uppercase font-elegant" style={{ backgroundColor: 'var(--teal)', color: '#FAFAF8' }}>
                  {product.offerLabel}
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2 mt-3">
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setActiveImage(i)}
                    className="relative overflow-hidden transition-opacity"
                    style={{ aspectRatio: '1/1', outline: i === activeImage ? '1px solid var(--gold)' : 'none', opacity: i === activeImage ? 1 : 0.65 }}
                    aria-label={`Foto ${i + 1}`}
                  >
                    <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {category && (
              <p className="font-elegant mb-2" style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                {chain.map((c) => c.name).join(' · ')}
              </p>
            )}
            <h1 className="font-serif font-light" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: 'var(--navy)', lineHeight: 1.15 }}>
              {product.name}
            </h1>
            {product.tag && (
              <p className="font-elegant text-xs mt-2" style={{ color: 'var(--navy-xdim)' }}>Código: {product.tag}</p>
            )}

            <div className="mt-6">
              {product.price > 0 ? (
                product.onSale ? (
                  <p className="font-serif flex items-baseline gap-3" style={{ fontStyle: 'italic' }}>
                    <span style={{ fontSize: '1.1rem', color: 'var(--navy-xdim)', textDecoration: 'line-through' }}>{currency.format(product.listPrice)}</span>
                    <span style={{ fontSize: '1.8rem', color: 'var(--teal)' }}>{currency.format(product.price)}</span>
                  </p>
                ) : (
                  <p className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--navy)', fontStyle: 'italic' }}>{currency.format(product.price)}</p>
                )
              ) : (
                <p className="font-serif italic" style={{ fontSize: '1.3rem', color: 'var(--navy-dim)' }}>Consultar precio</p>
              )}
              {product.price > 0 && (
                <p className="font-elegant text-xs mt-2" style={{ color: 'var(--navy-dim)' }}>
                  10% de descuento pagando en efectivo en el local
                </p>
              )}
            </div>

            {product.description ? (
              <p className="font-elegant mt-8 whitespace-pre-line" style={{ fontSize: '0.88rem', lineHeight: 1.9, color: 'var(--navy-dim)' }}>
                {product.description}
              </p>
            ) : (
              <p className="font-elegant mt-8 italic" style={{ fontSize: '0.82rem', color: 'var(--navy-xdim)' }}>
                Consultanos por WhatsApp para más detalles de esta pieza.
              </p>
            )}

            {showSizeGuide && (
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="self-start inline-flex items-center gap-1.5 mt-6 font-elegant transition-opacity hover:opacity-70"
                style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--navy)' }}
              >
                <Ruler size={13} style={{ color: 'var(--gold)' }} />
                ¿No sabés tu talle? Guía de talles
              </button>
            )}

            <div className="mt-10 flex flex-col gap-3">
              {product.price > 0 && (
                sinStock ? (
                  <p className="font-elegant text-xs px-4 py-3 text-center" style={{ color: 'var(--navy-dim)', border: '1px solid var(--border)' }}>
                    Sin stock por el momento — consultanos por WhatsApp
                  </p>
                ) : (
                  <div className="flex gap-3">
                    <div className="flex items-center" style={{ border: '1px solid var(--border)' }}>
                      <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Restar" className="p-3 transition-opacity hover:opacity-60" style={{ color: 'var(--navy)' }}>
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center font-elegant text-sm" style={{ color: 'var(--navy)' }}>{qty}</span>
                      <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} aria-label="Sumar" className="p-3 transition-opacity hover:opacity-60" style={{ color: 'var(--navy)' }}>
                        <Plus size={13} />
                      </button>
                    </div>
                    <button
                      onClick={handleAdd}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 font-elegant transition-opacity hover:opacity-85"
                      style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', backgroundColor: added ? 'var(--teal)' : 'var(--gold)', color: '#fff' }}
                    >
                      {added ? <Check size={14} /> : <ShoppingBag size={14} />}
                      {added ? 'Agregado' : 'Agregar al carrito'}
                    </button>
                  </div>
                )
              )}
              <a
                href={whatsappHref(`Hola! Quiero consultar por ${product.name}.\n${window.location.href}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center py-3.5 font-elegant border transition-opacity hover:opacity-70"
                style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--navy)', borderColor: 'var(--border-gold)' }}
              >
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ backgroundColor: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 pb-24">
            <p className="font-elegant mb-8" style={{ fontSize: '0.62rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--gold)' }}>
              También te puede gustar
            </p>
            <ProductGrid products={related} categoriesById={categoriesById} />
          </div>
        </div>
      )}

      <RingSizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  )
}
