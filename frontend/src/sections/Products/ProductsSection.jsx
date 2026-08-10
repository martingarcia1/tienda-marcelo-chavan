import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { whatsappHref } from '../../components/WhatsAppButton'
import alianzaClasica from '../../assets/products/alianza-clasica.jpg'
import alianzaDiamante from '../../assets/products/alianza-diamante.jpg'
import alianzaOroBlanco from '../../assets/products/alianza-oro-blanco.jpg'
import abridorLiso from '../../assets/products/abridor-liso.jpg'
import abridorTexturado from '../../assets/products/abridor-texturado.jpg'
import abridorDiamante from '../../assets/products/abridor-diamante.jpg'
import pulseraPlata from '../../assets/products/pulsera-plata.jpg'
import cadenaPlata from '../../assets/products/cadena-plata.jpg'

/* ── Datos ─────────────────────────────────────────────────── */
const CATS = ['Todos', 'Alianzas', 'Anillos Iniciales', 'Abridores', 'Relojes', 'Plata']

const PRODUCTS = [
  { id: 1,  name: 'Alianza Clásica',      cat: 'Alianzas',           tag: '', img: alianzaClasica },
  { id: 2,  name: 'Alianza Diamante',     cat: 'Alianzas',           tag: '', img: alianzaDiamante },
  { id: 3,  name: 'Alianza Oro Blanco',   cat: 'Alianzas',           tag: '', img: alianzaOroBlanco },
  { id: 4,  name: 'Anillo Inicial A',     cat: 'Anillos Iniciales',  tag: '' },
  { id: 5,  name: 'Anillo Inicial M',     cat: 'Anillos Iniciales',  tag: '' },
  { id: 6,  name: 'Anillo Inicial Doble', cat: 'Anillos Iniciales',  tag: '' },
  { id: 7,  name: 'Abridor Liso',         cat: 'Abridores',          tag: '', img: abridorLiso },
  { id: 8,  name: 'Abridor Texturado',    cat: 'Abridores',          tag: '', img: abridorTexturado },
  { id: 9,  name: 'Abridor Diamante',     cat: 'Abridores',          tag: '', img: abridorDiamante },
  { id: 10, name: 'Reloj Clásico',        cat: 'Relojes',            tag: '' },
  { id: 11, name: 'Reloj Deportivo',      cat: 'Relojes',            tag: '' },
  { id: 12, name: 'Reloj Elegance',       cat: 'Relojes',            tag: '' },
  { id: 13, name: 'Pulsera Plata',        cat: 'Plata',              tag: '', img: pulseraPlata },
  { id: 14, name: 'Cadena Plata',         cat: 'Plata',              tag: '', img: cadenaPlata },
]

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

function ProductCard({ product, accentColor, delay }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: delay * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
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

        {/* Overlay hover — consulta por WhatsApp */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{ backgroundColor: 'rgba(8,58,79,0.08)' }}
        >
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

  const filtered = active === 'Todos'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.cat === active)

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
      </motion.div>

      {/* Catálogo */}
      <div className="py-4 pb-28" style={{ backgroundColor: 'var(--bg-alt)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10">

          {/* Filtros */}
          <CategoryPills cats={CATS} active={active} onChange={setActive} accent="var(--gold)" />

          {/* Grid de productos */}
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-10"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} accentColor="var(--gold)" delay={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
