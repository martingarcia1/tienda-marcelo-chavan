import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Check, MapPin } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { WhatsAppIcon } from '../components/WhatsAppFloat'
import { getLocal } from '../lib/locales'
import { whatsappHref, mapsHref } from '../lib/whatsapp'
import { useCatalog, useDocumentTitle, currency } from '../lib/hooks'
import { withModo, categoryChain } from '../lib/catalog'
import { useCartStore } from '../store/cartStore'
import NotFoundPage from './NotFoundPage'

// Se remonta al cambiar de producto para no arrastrar foto elegida ni cantidad.
export default function ProductPageRoute() {
  const { slug, productSlug } = useParams()
  return <ProductPage key={`${slug}/${productSlug}`} localSlug={slug} productSlug={productSlug} />
}

function ProductPage({ localSlug, productSlug }) {
  const { catalog, loading, error } = useCatalog()
  const local = withModo(getLocal(localSlug), catalog)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const [active, setActive] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const vidriera = local && catalog?.vidrieras[local.slug]
  const product = vidriera?.products.find((p) => p.slug === productSlug)
  useDocumentTitle(product?.name)

  if (!local) return <NotFoundPage />
  if (loading) return <div className="min-h-[70vh] pt-40 text-center font-sans text-sm" style={{ color: 'var(--ivory-dim)' }}>Cargando...</div>
  if (error) return <div className="min-h-[70vh] pt-40 text-center font-sans text-sm" style={{ color: 'var(--ivory-dim)' }}>No pudimos cargar la pieza. Probá recargar la página.</div>
  if (!product) return <NotFoundPage />

  const chain = categoryChain(catalog, product.categoryId)
  const categoria = chain[chain.length - 1]
  const related = vidriera.products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4)
  const image = product.images[active] || product.img
  const puedeComprar = local.modo === 'online' && product.price > 0
  const sinStock = product.stock <= 0
  const consulta = whatsappHref(`Hola! Quiero consultar por ${product.name} (${local.nombre}).\n${window.location.href}`)

  function handleAdd() {
    addItem(local.slug, product, qty)
    setAdded(true)
    setTimeout(() => { setAdded(false); openCart(local.slug) }, 650)
  }

  return (
    <div style={{ backgroundColor: 'var(--ink)' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-24">
        <nav className="font-sans flex flex-wrap gap-2 mb-10" style={{ fontSize: '0.58rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--ivory-xdim)' }}>
          <Link to="/" className="hover:text-[var(--copper)] transition-colors">Inicio</Link>
          <span>/</span>
          <Link to={`/espacios/${local.slug}`} className="hover:text-[var(--copper)] transition-colors">{local.nombre}</Link>
          {chain.map((c) => (
            <span key={c.id} className="flex gap-2">
              <span>/</span>
              <Link to={`/espacios/${local.slug}/categoria/${c.slug}`} className="hover:text-[var(--copper)] transition-colors">{c.name}</Link>
            </span>
          ))}
        </nav>

        <div className="grid md:grid-cols-12 gap-12 md:gap-16">
          <div className="md:col-span-7">
            <div className="relative overflow-hidden" style={{ aspectRatio: '1/1', backgroundColor: 'var(--ink-3)' }}>
              {image && <img src={image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />}
              {product.onSale && (
                <span className="absolute top-4 left-4 px-3 py-1.5 font-sans" style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', backgroundColor: 'var(--copper)', color: 'var(--on-copper)' }}>
                  {product.offerLabel}
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-3 mt-3">
                {product.images.map((src, i) => (
                  <button key={src} onClick={() => setActive(i)} aria-label={`Foto ${i + 1}`} className="relative overflow-hidden transition-opacity" style={{ aspectRatio: '1/1', outline: i === active ? '1px solid var(--copper)' : 'none', opacity: i === active ? 1 : 0.55 }}>
                    <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-5 flex flex-col">
            <p className="eyebrow">{chain.length ? chain.map((c) => c.name).join(' · ') : local.rubro}</p>
            <h1 className="font-serif font-light mt-4" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)', lineHeight: 1.12, color: 'var(--ivory)' }}>
              {product.name}
            </h1>
            {product.tag && <p className="font-sans mt-3" style={{ fontSize: '0.68rem', color: 'var(--ivory-xdim)' }}>Código {product.tag}</p>}

            <div className="mt-8 pb-8" style={{ borderBottom: '1px solid var(--line)' }}>
              {product.price > 0 ? (
                <p className="flex items-baseline gap-4">
                  {product.onSale && <span className="font-serif" style={{ fontSize: '1.2rem', color: 'var(--ivory-xdim)', textDecoration: 'line-through' }}>{currency.format(product.listPrice)}</span>}
                  <span className="font-serif italic" style={{ fontSize: '2.2rem', color: product.onSale ? 'var(--copper)' : 'var(--ivory)' }}>{currency.format(product.price)}</span>
                </p>
              ) : (
                <p className="font-serif italic" style={{ fontSize: '1.5rem', color: 'var(--ivory-dim)' }}>Consultar precio</p>
              )}
              {product.price > 0 && <p className="font-sans mt-2" style={{ fontSize: '0.7rem', color: 'var(--ivory-xdim)' }}>10% de descuento pagando en efectivo en el local</p>}
            </div>

            <p className="font-sans mt-8 whitespace-pre-line" style={{ fontSize: '0.86rem', lineHeight: 2, color: 'var(--ivory-dim)', fontWeight: 300 }}>
              {product.description || 'Consultanos por WhatsApp para conocer todos los detalles de esta pieza.'}
            </p>

            <div className="mt-10 flex flex-col gap-3">
              {puedeComprar && (sinStock ? (
                <p className="font-sans text-center py-4" style={{ fontSize: '0.72rem', color: 'var(--ivory-dim)', border: '1px solid var(--line)' }}>Sin stock por el momento — consultanos</p>
              ) : (
                <div className="flex gap-3">
                  <div className="flex items-center" style={{ border: '1px solid var(--line-strong)' }}>
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Restar" className="p-4" style={{ color: 'var(--ivory)' }}><Minus size={13} /></button>
                    <span className="w-8 text-center font-sans text-sm" style={{ color: 'var(--ivory)' }}>{qty}</span>
                    <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} aria-label="Sumar" className="p-4" style={{ color: 'var(--ivory)' }}><Plus size={13} /></button>
                  </div>
                  <button
                    onClick={handleAdd}
                    className="flex-1 flex items-center justify-center gap-2.5 font-sans transition-all duration-300 hover:shadow-[0_0_40px_rgba(224,160,106,0.3)]"
                    style={{ fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', backgroundColor: 'var(--copper)', color: 'var(--on-copper)', fontWeight: 500 }}
                  >
                    {added ? <><Check size={14} /> Agregado</> : <><ShoppingBag size={14} /> Agregar a la compra</>}
                  </button>
                </div>
              ))}
              <a
                href={consulta}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 py-4 font-sans transition-colors hover:bg-[rgba(219,163,107,0.08)]"
                style={{
                  fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase',
                  ...(puedeComprar
                    ? { border: '1px solid var(--line-strong)', color: 'var(--ivory)' }
                    : { backgroundColor: 'var(--copper)', color: 'var(--on-copper)', fontWeight: 500 }),
                }}
              >
                <WhatsAppIcon style={{ width: 15, height: 15 }} /> Consultar por WhatsApp
              </a>
            </div>

            <a href={mapsHref(local.mapsQuery)} target="_blank" rel="noopener noreferrer" className="flex gap-3 mt-10 font-sans transition-colors hover:text-[var(--copper)]" style={{ fontSize: '0.74rem', color: 'var(--ivory-dim)' }}>
              <MapPin size={15} strokeWidth={1.4} style={{ color: 'var(--copper)', flexShrink: 0, marginTop: 2 }} />
              <span>Disponible en <strong style={{ color: 'var(--ivory)', fontWeight: 500 }}>{local.nombre}</strong><br />{local.direccion}</span>
            </a>
            {(local.otrasDirecciones || []).map((d) => (
              <a key={d.direccion} href={mapsHref(d.mapsQuery)} target="_blank" rel="noopener noreferrer" className="flex gap-3 mt-4 font-sans transition-colors hover:text-[var(--copper)]" style={{ fontSize: '0.74rem', color: 'var(--ivory-dim)' }}>
                <MapPin size={15} strokeWidth={1.4} style={{ color: 'var(--copper)', flexShrink: 0, marginTop: 2 }} />
                <span>También en <strong style={{ color: 'var(--ivory)', fontWeight: 500 }}>{d.ciudad}</strong><br />{d.direccion}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="py-20 md:py-24" style={{ backgroundColor: 'var(--ink-2)', borderTop: '1px solid var(--line)' }}>
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <p className="eyebrow mb-10">También en {categoria?.name ?? local.nombre}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-12">
              {related.map((p, i) => <ProductCard key={p.id} product={p} local={local} delay={i} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
