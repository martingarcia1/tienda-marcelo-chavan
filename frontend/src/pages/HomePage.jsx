import { Link } from 'react-router-dom'
import heroImg from '../assets/hero.png'

// ─── Datos mock (reemplazar con API cuando haya productos reales) ─────────────
const NUEVA_COLECCION = [
  { id: 1, name: 'Aros Argolla Lisa',    price: 4500, badge: 'Nuevo',      material: 'Plata 925',  gradient: 'from-sand to-aqua/60' },
  { id: 2, name: 'Anillo Solitario',     price: 6800, badge: 'Destacado',  material: 'Plata 925',  gradient: 'from-aqua to-teal/40' },
  { id: 3, name: 'Pulsera Esclava',      price: 5200, badge: null,         material: 'Plata 925',  gradient: 'from-sand-dark to-sand' },
  { id: 4, name: 'Cadena Veneziana',     price: 8900, badge: 'Nuevo',      material: 'Plata 950',  gradient: 'from-aqua/50 to-aqua-dark' },
]

const MAS_VENDIDOS = [
  { id: 5, name: 'Aros Mariposa',        price: 3800, badge: 'Más vendido', material: 'Plata 925', gradient: 'from-sand to-aqua/60' },
  { id: 6, name: 'Anillo Corazón',       price: 5500, badge: null,          material: 'Plata 925', gradient: 'from-aqua to-teal/40' },
  { id: 7, name: 'Pulsera Figaro',       price: 7200, badge: 'Más vendido', material: 'Acero',     gradient: 'from-navy/20 to-teal/30' },
  { id: 8, name: 'Aros Perla',           price: 4100, badge: null,          material: 'Plata 950', gradient: 'from-sand-dark to-sand' },
]

const CATEGORIAS_PLATA = [
  { name: 'Aros',      slug: 'aros',      bg: 'bg-teal/20',      text: 'Aros artesanales en plata 925' },
  { name: 'Anillos',   slug: 'anillos',   bg: 'bg-aqua/40',      text: 'Anillos únicos, tallados a mano' },
  { name: 'Pulseras',  slug: 'pulseras',  bg: 'bg-sand-dark',    text: 'Pulseras y esclavas en plata' },
  { name: 'Conjuntos', slug: 'conjuntos', bg: 'bg-navy/10',      text: 'Sets completos de platería' },
]

const TESTIMONIOS = [
  { name: 'Valentina R.', city: 'Tucumán', text: 'Las joyas son increíbles, la calidad de la plata se nota desde el primer momento. Las uso todos los días.' },
  { name: 'Lucía M.',     city: 'Buenos Aires', text: 'Compré un conjunto para mi casamiento y superó todas mis expectativas. Artesanía única.' },
  { name: 'Sofía P.',     city: 'Mendoza', text: 'Me llegaron perfectas y en tiempo récord. El packaging es hermoso, parecen joyas de boutique.' },
]

// ─── Componentes reutilizables ────────────────────────────────────────────────

function JewelryIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="22" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <circle cx="40" cy="40" r="14" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <circle cx="40" cy="40" r="4" fill="currentColor" opacity="0.3" />
      <path d="M40 18 L40 14M40 66 L40 62M18 40 L14 40M66 40 L62 40" stroke="currentColor" strokeWidth="1.5" opacity="0.3" strokeLinecap="round"/>
    </svg>
  )
}

function SectionHeader({ eyebrow, title, linkTo, linkLabel = 'Ver todo' }) {
  return (
    <div className="flex items-end justify-between mb-8 md:mb-10">
      <div>
        {eyebrow && (
          <p className="text-[11px] font-sans font-semibold text-teal tracking-[0.2em] uppercase mb-2">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy leading-tight">
          {title}
        </h2>
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="hidden md:flex items-center gap-2 text-sm text-navy/50 hover:text-gold transition-colors group"
        >
          {linkLabel}
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      )}
    </div>
  )
}

function ProductCard({ name, price, badge, material, gradient, id }) {
  return (
    <Link to={`/producto/${id}`} className="group block">
      {/* Imagen */}
      <div className={`relative aspect-[3/4] bg-gradient-to-br ${gradient} overflow-hidden mb-3`}>
        <JewelryIcon className="absolute inset-0 m-auto w-16 h-16 text-navy" />

        {/* Badge */}
        {badge && (
          <span className="absolute top-3 left-3 bg-navy text-sand text-[10px] font-semibold tracking-[0.1em] uppercase px-2 py-1">
            {badge}
          </span>
        )}

        {/* Quick add */}
        <div className="absolute bottom-0 left-0 right-0 bg-navy text-sand text-xs font-medium tracking-widest uppercase text-center py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          Ver producto
        </div>
      </div>

      {/* Info */}
      <p className="text-[10px] font-sans text-teal tracking-[0.15em] uppercase mb-1">{material}</p>
      <p className="text-sm font-medium text-navy group-hover:text-gold transition-colors">{name}</p>
      <p className="text-sm text-gold font-medium mt-0.5">${price.toLocaleString('es-AR')}</p>
    </Link>
  )
}

function CategoryTile({ name, slug, bg, text, material = 'plata' }) {
  return (
    <Link
      to={`/tienda?material=${material}&categoria=${slug}`}
      className="group relative aspect-[3/4] block overflow-hidden"
    >
      {/* Fondo placeholder */}
      <div className={`absolute inset-0 ${bg} transition-transform duration-500 group-hover:scale-105`} />
      <JewelryIcon className="absolute inset-0 m-auto w-20 h-20 text-navy opacity-20" />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/75 via-navy/10 to-transparent" />

      {/* Texto */}
      <div className="absolute bottom-0 left-0 p-5 md:p-6">
        <p className="text-[10px] font-sans text-sand/60 tracking-[0.2em] uppercase mb-1">Explorar</p>
        <h3 className="font-display text-2xl md:text-3xl font-semibold text-white leading-tight">{name}</h3>
        <p className="text-xs text-sand/50 mt-1 hidden md:block">{text}</p>
        <span className="inline-block mt-3 text-xs text-gold group-hover:gap-3 tracking-widest">
          Ver colección →
        </span>
      </div>
    </Link>
  )
}

// ─── HomePage ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="bg-white">

      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <section className="min-h-[85vh] bg-white grid md:grid-cols-2">

        {/* Lado izquierdo — texto */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16 md:py-0 order-2 md:order-1">
          {/* Línea decorativa dorada */}
          <div className="w-12 h-0.5 bg-gold mb-8" />

          <p className="text-[11px] font-sans font-semibold text-teal tracking-[0.25em] uppercase mb-5">
            Tucumán, Argentina · Plata 925
          </p>

          <h1 className="font-display text-5xl md:text-5xl lg:text-6xl font-semibold text-navy leading-[1.1] mb-6">
            Platería<br />
            <em className="font-normal italic text-gold">artesanal</em>
          </h1>

          <p className="text-navy/55 text-base leading-relaxed mb-10 max-w-sm">
            Piezas únicas elaboradas a mano por artesanos tucumanos.
            Plata 925 y acero quirúrgico de calidad premium.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/tienda?material=plata"
              className="bg-navy text-white px-8 py-3.5 text-sm font-medium tracking-widest uppercase hover:bg-navy-dark transition-colors duration-200 text-center"
            >
              Ver Plata
            </Link>
            <Link
              to="/tienda?material=acero"
              className="border border-gold text-gold px-8 py-3.5 text-sm font-medium tracking-widest uppercase hover:bg-gold hover:text-white transition-colors duration-200 text-center"
            >
              Ver Acero
            </Link>
          </div>

          {/* Datos de confianza */}
          <div className="flex gap-6 mt-12 pt-8 border-t border-sand">
            {[
              { num: '925', label: 'Plata pura' },
              { num: '100%', label: 'Artesanal' },
              { num: 'Tuc.', label: 'Origen' },
            ].map(({ num, label }) => (
              <div key={label}>
                <p className="font-display text-xl font-semibold text-gold">{num}</p>
                <p className="text-[10px] text-navy/40 tracking-widest uppercase">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lado derecho — imagen editorial */}
        <div className="relative min-h-[50vh] md:min-h-full order-1 md:order-2 bg-sand overflow-hidden">
          <img
            src={heroImg}
            alt="Marcelo Chavan Platería"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Badge flotante */}
          <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm px-5 py-3 shadow-sm">
            <p className="text-[10px] text-teal tracking-[0.2em] uppercase font-semibold">Nueva Colección</p>
            <p className="font-display text-navy font-semibold">Primavera 2026</p>
          </div>
        </div>

      </section>

      {/* ── 2. NUEVA COLECCIÓN ──────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            eyebrow="Recién llegados"
            title="Nueva Colección"
            linkTo="/tienda?categoria=nueva-coleccion"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {NUEVA_COLECCION.map(p => <ProductCard key={p.id} {...p} />)}
          </div>
        </div>
      </section>

      {/* ── 3. BANNERS PROMOCIONALES 3-col ──────────────────── */}
      <section className="py-6 bg-sand">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-4">
          {[
            { title: 'Promos',           sub: 'Ofertas seleccionadas',       slug: 'promos',        bg: 'bg-navy', text: 'text-white', btn: 'border-gold text-gold' },
            { title: 'Nueva Colección',  sub: 'Plata 925 recién llegada',    slug: 'nueva-coleccion', bg: 'bg-white', text: 'text-navy', btn: 'border-navy text-navy' },
            { title: 'Medallas',         sub: 'Religiosidad y tradición',    slug: 'medallas-religiosas', bg: 'bg-teal', text: 'text-white', btn: 'border-white text-white' },
          ].map(({ title, sub, slug, bg, text, btn }) => (
            <Link
              key={slug}
              to={`/tienda?material=plata&categoria=${slug}`}
              className={`group ${bg} p-8 flex flex-col justify-between min-h-[160px] hover:shadow-md transition-shadow`}
            >
              <div>
                <p className={`text-[10px] font-sans tracking-[0.2em] uppercase opacity-60 ${text} mb-2`}>
                  Platería Chavan
                </p>
                <h3 className={`font-display text-2xl font-semibold ${text} leading-tight`}>{title}</h3>
                <p className={`text-xs mt-1 opacity-60 ${text}`}>{sub}</p>
              </div>
              <span className={`inline-block border text-xs tracking-widest uppercase px-4 py-2 mt-4 w-fit group-hover:opacity-80 transition-opacity ${btn}`}>
                Ver más
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 4. CATEGORÍAS EDITORIALES (BRUNA style) ─────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            eyebrow="Plata 925"
            title="Explorar por Categoría"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {CATEGORIAS_PLATA.map(cat => <CategoryTile key={cat.slug} {...cat} />)}
          </div>

          {/* Acero — mini grid */}
          <div className="mt-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-sand-dark" />
              <p className="text-[11px] font-sans font-semibold text-teal tracking-[0.2em] uppercase">
                Acero Quirúrgico
              </p>
              <div className="flex-1 h-px bg-sand-dark" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                { name: 'Aros',     slug: 'aros-acero',    bg: 'bg-navy/10' },
                { name: 'Anillos',  slug: 'anillos-acero', bg: 'bg-teal/15' },
                { name: 'Pulseras', slug: 'pulseras-acero', bg: 'bg-aqua/50' },
                { name: 'Cadenas',  slug: 'cadenas-acero', bg: 'bg-sand-dark' },
              ].map(cat => (
                <CategoryTile key={cat.slug} {...cat} text="" material="acero" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. MÁS VENDIDOS ─────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-sand">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader
            eyebrow="Lo más elegido"
            title="Más Vendidos"
            linkTo="/tienda?featured=true"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {MAS_VENDIDOS.map(p => <ProductCard key={p.id} {...p} />)}
          </div>
        </div>
      </section>

      {/* ── 6. BANNER EDITORIAL SPLIT ───────────────────────── */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2">
          {/* Imagen left */}
          <div className="relative aspect-square md:aspect-auto bg-gradient-to-br from-navy/20 to-teal/30 flex items-center justify-center">
            <JewelryIcon className="w-32 h-32 text-navy opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-br from-aqua/40 to-teal/20" />
          </div>

          {/* Texto right */}
          <div className="px-10 md:px-16 py-16 md:py-20 flex flex-col justify-center bg-sand">
            <p className="text-[11px] font-sans font-semibold text-teal tracking-[0.2em] uppercase mb-4">
              Nuestra historia
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-navy leading-tight mb-6">
              Plata artesanal<br />
              <em className="font-normal italic text-gold">de Tucumán</em>
            </h2>
            <p className="text-navy/60 text-base leading-relaxed mb-4 max-w-sm">
              Cada pieza nace de las manos de artesanos tucumanos con décadas de oficio.
              Trabajamos la plata 925 y 950 con técnicas tradicionales que se transmiten de generación en generación.
            </p>
            <p className="text-navy/50 text-sm leading-relaxed mb-8 max-w-sm">
              Nuestro taller en Tucumán es el corazón de cada joya — desde el diseño hasta el pulido final,
              todo se hace con dedicación y cuidado artesanal.
            </p>
            <Link
              to="/quienes-somos"
              className="w-fit border border-navy text-navy px-8 py-3.5 text-sm font-medium tracking-widest uppercase hover:bg-navy hover:text-sand transition-colors duration-200"
            >
              Nuestra Historia
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. FORMAS DE PAGO ───────────────────────────────── */}
      <section className="py-12 bg-navy">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {[
              { icon: '💵', title: '10% de descuento',  sub: 'Pagando en efectivo' },
              { icon: '🏦', title: 'Mismo precio',      sub: 'Pagando por transferencia' },
              { icon: '💳', title: '3 cuotas',          sub: '10% recargo · Visa · MC · Naranja · American' },
            ].map(({ icon, title, sub }) => (
              <div key={title} className="flex items-center gap-4 px-8 py-6 md:py-4">
                <span className="text-3xl">{icon}</span>
                <div>
                  <p className="text-sand font-display font-semibold text-lg leading-tight">{title}</p>
                  <p className="text-sand/50 text-xs mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. TESTIMONIOS ──────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader eyebrow="Clientes" title="Lo que dicen de nosotros" />
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIOS.map(({ name, city, text }) => (
              <div key={name} className="bg-sand p-8 flex flex-col gap-4">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-gold text-sm">★</span>
                  ))}
                </div>
                <p className="text-navy/70 text-sm leading-relaxed italic font-display">"{text}"</p>
                <div className="mt-auto pt-4 border-t border-sand-dark">
                  <p className="text-navy font-medium text-sm">{name}</p>
                  <p className="text-navy/40 text-xs">{city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. NEWSLETTER ───────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-aqua/30 border-t border-aqua-dark/20">
        <div className="max-w-xl mx-auto px-6 text-center">
          <p className="text-[11px] font-sans font-semibold text-teal tracking-[0.2em] uppercase mb-3">
            Novedades
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy mb-3">
            Recibí las últimas novedades
          </h2>
          <p className="text-navy/50 text-sm mb-8">
            Enterate de nuevas colecciones, promos y eventos antes que nadie.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3"
            onSubmit={e => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-5 py-3.5 bg-white border border-sand-dark text-navy text-sm outline-none focus:border-teal transition-colors placeholder:text-navy/30"
            />
            <button
              type="submit"
              className="bg-navy text-sand px-8 py-3.5 text-sm font-medium tracking-widest uppercase hover:bg-navy-dark transition-colors duration-200 whitespace-nowrap"
            >
              Suscribirme
            </button>
          </form>
          <p className="text-navy/30 text-xs mt-4">Sin spam. Cancelá cuando quieras.</p>
        </div>
      </section>

    </div>
  )
}
