import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Ruler, ShoppingBag, Check } from 'lucide-react'
import { whatsappHref } from '../../components/WhatsAppButton'
import { supabase } from '../../lib/supabase'
import RingSizeGuide from '../../components/RingSizeGuide'
import ProductDetailModal from '../../components/ProductDetailModal'
import { useCartStore } from '../../store/cartStore'

const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

function getImageUrl(storagePath) {
  if (!storagePath) return null
  return supabase.storage.from('product-images').getPublicUrl(storagePath).data.publicUrl
}

/* ── Sub-componentes ────────────────────────────────────────── */
function CategoryPills({ cats, active, onChange, accent }) {
  return (
    <div className="flex flex-wrap gap-2 mb-10">
      {cats.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className="px-4 py-1.5 text-[9px] tracking-[0.3em] uppercase font-elegant transition-all duration-250"
          style={
            active === cat
              ? { backgroundColor: accent, color: '#FAFAF8', border: `1px solid ${accent}` }
              : { backgroundColor: 'transparent', color: 'var(--navy-dim)', border: '1px solid var(--border)' }
          }
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

function ProductCard({ product, accentColor, delay, onOpenDetail }) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)

  function handleAddToCart(e) {
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: delay * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group cursor-pointer"
      onClick={() => onOpenDetail(product)}
    >
      {/* Imagen */}
      <div
        className="relative overflow-hidden mb-3"
        style={{ aspectRatio: '1/1', backgroundColor: 'var(--bg-sand)' }}
      >
        {product.img ? (
          <img
            src={product.img}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Ornamento central — placeholder mientras no hay foto real */
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-serif select-none transition-all duration-500 group-hover:scale-110 group-hover:opacity-25"
              style={{ fontSize: '3rem', color: accentColor, opacity: 0.12 }}
            >
              ◆
            </span>
          </div>
        )}

        {/* Shimmer al hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at 50% 50%, ${accentColor}18 0%, transparent 70%)` }}
        />

        {/* Tag badge */}
        {product.tag && (
          <div
            className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[8px] tracking-[0.3em] uppercase font-elegant"
            style={{
              backgroundColor: product.tag === 'Promos' ? 'var(--teal)' : 'var(--navy)',
              color: '#FAFAF8',
            }}
          >
            {product.tag}
          </div>
        )}

        {/* Overlay hover — agregar al carrito + consulta por WhatsApp. Solo aparece
            (y solo es clickeable) con hover real de mouse; en táctil, que no tiene
            hover, queda oculto e inerte para no taparle el toque a la tarjeta. */}
        <div
          className="hidden md:flex absolute inset-0 flex-col items-center justify-center gap-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-400"
          style={{ backgroundColor: 'rgba(8,58,79,0.08)' }}
        >
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 text-[9px] tracking-[0.3em] uppercase font-elegant px-4 py-2 transition-opacity hover:opacity-85"
            style={{ color: '#fff', backgroundColor: added ? 'var(--teal)' : accentColor }}
          >
            {added ? <Check size={12} /> : <ShoppingBag size={12} />}
            {added ? 'Agregado' : 'Agregar al carrito'}
          </button>
          <a
            href={whatsappHref(`Hola! Quiero consultar por ${product.name}.`)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[9px] tracking-[0.4em] uppercase font-elegant px-4 py-2 border transition-opacity hover:opacity-70"
            style={{ color: 'var(--navy)', borderColor: 'var(--border-gold)', backgroundColor: 'rgba(250,250,248,0.85)' }}
          >
            Consultar
          </a>
        </div>
      </div>

      {/* Info */}
      <p
        className="text-[9px] tracking-[0.3em] uppercase font-elegant mb-1"
        style={{ color: accentColor }}
      >
        {product.cat}
      </p>
      <p
        className="text-sm font-serif leading-tight"
        style={{ color: 'var(--navy)' }}
      >
        {product.name}
      </p>
      {product.price > 0 && (
        <p className="text-xs font-elegant mt-1" style={{ color: 'var(--navy-dim)' }}>
          {currency.format(product.price)}
        </p>
      )}
      {/* Línea animada */}
      <div
        className="h-px mt-2 transition-all duration-400"
        style={{
          backgroundColor: accentColor,
          width: 0,
        }}
        ref={(el) => {
          if (!el) return
          const parent = el.closest('.group')
          if (!parent) return
          const show = () => (el.style.width = '40px')
          const hide = () => (el.style.width = '0')
          parent.addEventListener('mouseenter', show)
          parent.addEventListener('mouseleave', hide)
        }}
      />
    </motion.div>
  )
}

/* ── Sección principal ──────────────────────────────────────── */
export default function ProductsSection() {
  const [active, setActive] = useState('Todos')
  const [categoryNames, setCategoryNames] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      const [{ data: cats, error: catError }, { data: prods, error: prodError }] = await Promise.all([
        supabase.from('categories').select('name').eq('active', true).order('sort_order'),
        supabase
          .from('products')
          .select('id, name, price, tag, description, category:categories(name), product_images(storage_path, sort_order)')
          .eq('active', true)
          .order('name'),
      ])

      if (cancelled) return

      if (catError || prodError) {
        setError(catError?.message || prodError?.message)
        setLoading(false)
        return
      }

      setCategoryNames(cats.map((c) => c.name))
      setProducts(
        prods.map((p) => {
          const images = [...(p.product_images || [])].sort((a, b) => a.sort_order - b.sort_order)
          return {
            id: p.id,
            name: p.name,
            price: p.price,
            cat: p.category?.name,
            tag: p.tag || '',
            description: p.description || '',
            img: getImageUrl(images[0]?.storage_path),
          }
        })
      )
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [])

  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const cats = ['Todos', ...categoryNames]
  const filtered = active === 'Todos'
    ? products
    : products.filter((p) => p.cat === active)

  return (
    <section id="productos">

      {/* Encabezado general */}
      <motion.div
        className="text-center py-16"
        style={{ backgroundColor: 'var(--bg)' }}
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.75 }}
      >
        <p
          className="text-[9px] tracking-[0.5em] uppercase font-elegant mb-4"
          style={{ color: 'var(--gold)' }}
        >
          Colecciones
        </p>
        <h2
          className="font-serif font-light"
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            color: 'var(--navy)',
            letterSpacing: '0.06em',
          }}
        >
          Nuestros Productos
        </h2>
        <div className="w-12 h-px mx-auto mt-6" style={{ backgroundColor: 'var(--gold)' }} />
        <p
          className="text-xs font-elegant mt-5 max-w-md mx-auto"
          style={{ color: 'var(--navy-dim)' }}
        >
          Explorá nuestra colección · Seleccioná una categoría
        </p>
        <button
          onClick={() => setSizeGuideOpen(true)}
          className="inline-flex items-center gap-1.5 mt-5 font-elegant transition-opacity hover:opacity-70"
          style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--navy)' }}
        >
          <Ruler size={13} style={{ color: 'var(--gold)' }} />
          ¿No sabés tu talle? Guía de talles
        </button>
      </motion.div>

      <RingSizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

      {/* Catálogo */}
      <div className="py-4 pb-28" style={{ backgroundColor: 'var(--bg-alt)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10">

          {/* Filtros */}
          <CategoryPills cats={cats} active={active} onChange={setActive} accent="var(--gold)" />

          {error && (
            <p className="text-xs font-elegant py-10 text-center" style={{ color: 'var(--navy-dim)' }}>
              No pudimos cargar el catálogo. Probá recargar la página.
            </p>
          )}

          {!error && loading && (
            <p className="text-xs font-elegant py-10 text-center" style={{ color: 'var(--navy-dim)' }}>
              Cargando productos...
            </p>
          )}

          {/* Grid de productos */}
          {!error && !loading && (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-10"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} accentColor="var(--gold)" delay={i} onOpenDetail={setSelectedProduct} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </section>
  )
}
