import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Datos ─────────────────────────────────────────────────── */
const PLATA_CATS = ['Todos', 'Promos', 'Nueva Colección', 'Aros', 'Pulseras', 'Conjuntos', 'Anillos', 'Medallas Religiosas']
const ACERO_CATS = ['Todos', 'Aros', 'Anillos', 'Pulseras', 'Cadenas']

const PLATA_PRODUCTS = [
  { id: 1,  name: 'Argolla Clásica',        cat: 'Aros',               tag: '' },
  { id: 2,  name: 'Aro Perla',              cat: 'Aros',               tag: 'Nueva Colección' },
  { id: 3,  name: 'Aro Corazón',            cat: 'Aros',               tag: '' },
  { id: 4,  name: 'Aro Mariposa',           cat: 'Aros',               tag: 'Promos' },
  { id: 5,  name: 'Pulsera Eslabón',        cat: 'Pulseras',           tag: '' },
  { id: 6,  name: 'Pulsera ID Grabada',     cat: 'Pulseras',           tag: '' },
  { id: 7,  name: 'Pulsera Corazón',        cat: 'Pulseras',           tag: 'Promos' },
  { id: 8,  name: 'Pulsera Triple',         cat: 'Pulseras',           tag: 'Nueva Colección' },
  { id: 9,  name: 'Anillo Solitario',       cat: 'Anillos',            tag: '' },
  { id: 10, name: 'Anillo Banda Plana',     cat: 'Anillos',            tag: '' },
  { id: 11, name: 'Anillo Cruz',            cat: 'Anillos',            tag: 'Nueva Colección' },
  { id: 12, name: 'Conjunto Argollas',      cat: 'Conjuntos',          tag: '' },
  { id: 13, name: 'Conjunto Perla',         cat: 'Conjuntos',          tag: 'Nueva Colección' },
  { id: 14, name: 'Medalla Virgen María',   cat: 'Medallas Religiosas',tag: '' },
  { id: 15, name: 'Medalla San Expedito',   cat: 'Medallas Religiosas',tag: '' },
  { id: 16, name: 'Medalla Crucifijo',      cat: 'Medallas Religiosas',tag: '' },
]

const ACERO_PRODUCTS = [
  { id: 1, name: 'Aro Presión Dorado',   cat: 'Aros',     tag: '' },
  { id: 2, name: 'Aro Minimalista',      cat: 'Aros',     tag: 'Nueva Colección' },
  { id: 3, name: 'Aro Gota',             cat: 'Aros',     tag: '' },
  { id: 4, name: 'Anillo Banda',         cat: 'Anillos',  tag: '' },
  { id: 5, name: 'Anillo Triángulo',     cat: 'Anillos',  tag: 'Nueva Colección' },
  { id: 6, name: 'Pulsera Cubana',       cat: 'Pulseras', tag: '' },
  { id: 7, name: 'Pulsera Rígida',       cat: 'Pulseras', tag: '' },
  { id: 8, name: 'Cadena Figaro',        cat: 'Cadenas',  tag: 'Nueva Colección' },
  { id: 9, name: 'Cadena Serpiente',     cat: 'Cadenas',  tag: '' },
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
      className="group cursor-pointer"
    >
      {/* Imagen placeholder */}
      <div
        className="relative overflow-hidden mb-3"
        style={{ aspectRatio: '1/1', backgroundColor: 'var(--bg-sand)' }}
      >
        {/* Ornamento central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-serif select-none transition-all duration-500 group-hover:scale-110 group-hover:opacity-25"
            style={{ fontSize: '3rem', color: accentColor, opacity: 0.12 }}
          >
            ◆
          </span>
        </div>

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

        {/* Overlay hover */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400"
          style={{ backgroundColor: 'rgba(8,58,79,0.08)' }}
        >
          <span
            className="text-[9px] tracking-[0.4em] uppercase font-elegant px-4 py-2 border"
            style={{ color: 'var(--navy)', borderColor: 'var(--border-gold)', backgroundColor: 'rgba(250,250,248,0.85)' }}
          >
            Ver más
          </span>
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

function MaterialSection({ title, eyebrow, products, cats, accent, bgColor }) {
  const [active, setActive] = useState('Todos')

  const filtered = active === 'Todos'
    ? products
    : products.filter((p) => p.cat === active || p.tag === active)

  return (
    <div className="py-20 md:py-28" style={{ backgroundColor: bgColor }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Header sección */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <p
            className="text-[8px] tracking-[0.5em] uppercase font-elegant mb-2"
            style={{ color: accent }}
          >
            {eyebrow}
          </p>
          <div className="flex items-end gap-6">
            <h3
              className="font-serif font-light"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: 'var(--navy)',
                letterSpacing: '0.06em',
              }}
            >
              {title}
            </h3>
            <div className="flex-1 h-px mb-3" style={{ backgroundColor: 'var(--border)' }} />
          </div>
        </motion.div>

        {/* Filtros */}
        <CategoryPills cats={cats} active={active} onChange={setActive} accent={accent} />

        {/* Grid de productos */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-10"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} accentColor={accent} delay={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

/* ── Sección principal ──────────────────────────────────────── */
export default function ProductsSection() {
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
          Explorá nuestra colección · Seleccioná el material y la categoría
        </p>
      </motion.div>

      {/* Plata 925 */}
      <MaterialSection
        title="Plata 925"
        eyebrow="Material"
        products={PLATA_PRODUCTS}
        cats={PLATA_CATS}
        accent="var(--gold)"
        bgColor="var(--bg-alt)"
      />

      {/* Acero Quirúrgico */}
      <MaterialSection
        title="Acero Quirúrgico"
        eyebrow="Material"
        products={ACERO_PRODUCTS}
        cats={ACERO_CATS}
        accent="var(--teal)"
        bgColor="var(--bg)"
      />
    </section>
  )
}
