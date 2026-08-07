import { motion } from 'framer-motion'
import { MapPin, Gem, Award, Truck, ArrowUpRight } from 'lucide-react'
import photoFamilia from '../../assets/photo-familia.png'
import photoPropietaria from '../../assets/photo-propietaria.png'

const HIGHLIGHTS = [
  { icon: Gem,   title: 'Oro & Plata', sub: 'Alta gama' },
  { icon: Award, title: 'Desde 1957',  sub: 'Tradición' },
  { icon: MapPin,title: 'Tucumán',     sub: 'Tres locales' },
  { icon: Truck, title: 'Envíos',      sub: 'A todo el país' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 0.61, 0.36, 1] } },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.1, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

export default function AboutSection() {
  return (
    <section
      id="quienes-somos"
      className="relative py-28 md:py-40 overflow-hidden"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* Marca de agua tipográfica de fondo */}
      <div
        aria-hidden
        className="absolute pointer-events-none select-none hidden lg:block"
        style={{
          top: '4rem',
          right: '-2rem',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: '16rem',
          lineHeight: 1,
          color: 'rgba(165,141,102,0.05)',
          fontWeight: 500,
        }}
      >
        MCh.
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative">

        {/* ── Encabezado editorial — alineado a la izquierda ── */}
        <motion.div
          className="mb-20 md:mb-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <div className="flex items-center gap-5 mb-6">
            <span
              className="font-elegant"
              style={{ fontSize: '0.6rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--gold)' }}
            >
              01 — Nuestra Historia
            </span>
            <div className="flex-1 h-px max-w-[200px]" style={{ backgroundColor: 'var(--border-gold)' }} />
          </div>
          <h2
            className="font-serif font-light"
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)',
              color: 'var(--navy)',
              letterSpacing: '0.04em',
              lineHeight: 1.05,
            }}
          >
            Quiénes{' '}
            <em className="text-gold-shimmer" style={{ fontStyle: 'italic' }}>
              Somos
            </em>
          </h2>
        </motion.div>

        {/* ── Bloque 1: texto editorial + foto familia ── */}
        <div className="grid md:grid-cols-12 gap-10 md:gap-8 items-start mb-28 md:mb-36">

          {/* TEXTO — 6 columnas izquierda */}
          <motion.div
            className="md:col-span-6 lg:col-span-5 space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
          >
            {/* Cita grande editorial */}
            <blockquote
              className="font-serif font-light"
              style={{
                fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)',
                color: 'var(--navy)',
                letterSpacing: '0.01em',
                lineHeight: 1.4,
              }}
            >
              Cada pieza que creamos nace de una tradición familiar y la pasión por la joyería
              <span style={{ color: 'var(--gold)' }}> tucumana</span>.
            </blockquote>

            <div className="w-14 h-px" style={{ backgroundColor: 'var(--gold)' }} />

            <div className="space-y-6">
              <p
                className="font-elegant"
                style={{ fontSize: '0.85rem', lineHeight: 2.1, color: 'var(--navy-dim)', fontWeight: 300 }}
              >
                Somos <strong style={{ color: 'var(--navy)', fontWeight: 500 }}>Marcelo Chavan</strong>, una
                joyería tucumana con tradición y calidad desde 1957, vinculada a la Familia Siufi. Ofrecemos
                joyería de alta gama, relojería suiza y japonesa, y platería fina, acompañando a generaciones
                de familias tucumanas.
              </p>
              <p
                className="font-elegant"
                style={{ fontSize: '0.85rem', lineHeight: 2.1, color: 'var(--navy-dim)', fontWeight: 300 }}
              >
                Trabajamos con <strong style={{ color: 'var(--navy)', fontWeight: 500 }}>Oro 18K, Plata y Acero</strong>,{' '}
                <strong style={{ color: 'var(--navy)', fontWeight: 500 }}>Diamantes</strong>, y marcas exclusivas
                como Victorinox, TAG Heuer, Longines y Gucci. Joyas con alma y una atención personalizada
                que marca la diferencia.
              </p>
            </div>

            {/* Firma decorativa */}
            <div className="pt-2">
              <p
                className="font-serif"
                style={{
                  fontSize: '1.6rem',
                  color: 'var(--gold)',
                  fontStyle: 'italic',
                  letterSpacing: '0.06em',
                }}
              >
                Familia Siufi
              </p>
              <p
                className="font-elegant mt-1"
                style={{ fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--navy-xdim)' }}
              >
                Tradición desde 1957
              </p>
            </div>
          </motion.div>

          {/* FOTO FAMILIA — 6 columnas derecha, con offset editorial */}
          <motion.div
            className="md:col-span-6 lg:col-span-6 lg:col-start-7 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeIn}
          >
            {/* Marco desplazado */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: '20px', left: '20px', right: '-20px', bottom: '-20px',
                border: '1px solid var(--border-gold)',
              }}
            />
            {/* Panel de color detrás */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: '40px', left: '-24px', width: '45%', bottom: '-40px',
                backgroundColor: 'var(--bg-sand)', zIndex: -1,
              }}
            />
            <img
              src={photoFamilia}
              alt="Familia Marcelo Chavan"
              className="relative w-full object-cover"
              style={{
                aspectRatio: '4/5',
                objectPosition: 'center top',
                boxShadow: '0 30px 80px rgba(8,58,79,0.14)',
              }}
            />
            {/* Caption flotante */}
            <div
              className="absolute -bottom-5 left-6 px-6 py-4"
              style={{
                backgroundColor: 'var(--bg)',
                boxShadow: '0 12px 40px rgba(8,58,79,0.12)',
                borderLeft: '2px solid var(--gold)',
              }}
            >
              <p
                className="font-elegant"
                style={{ fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--gold)' }}
              >
                La Familia Chavan
              </p>
              <p className="font-serif mt-1" style={{ fontSize: '0.95rem', color: 'var(--navy)', fontStyle: 'italic' }}>
                Tucumán, Argentina
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Bloque 2: locales — foto izquierda, texto derecha (editorial alternado) ── */}
        <div className="grid md:grid-cols-12 gap-10 md:gap-8 items-center mb-28 md:mb-36">

          {/* TEXTO LOCALES — izquierda */}
          <motion.div
            className="md:col-span-6 lg:col-span-5 space-y-8 order-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
          >
            <div className="flex items-center gap-5">
              <span
                className="font-elegant"
                style={{ fontSize: '0.6rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--gold)' }}
              >
                02 — Nuestros Locales
              </span>
              <div className="flex-1 h-px max-w-[120px]" style={{ backgroundColor: 'var(--border-gold)' }} />
            </div>

            <h3
              className="font-serif font-light"
              style={{
                fontSize: 'clamp(1.9rem, 3.8vw, 3rem)',
                color: 'var(--navy)',
                letterSpacing: '0.03em',
                lineHeight: 1.2,
              }}
            >
              Nuestros espacios{' '}
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>en Tucumán</em>
            </h3>

            <p
              className="font-elegant"
              style={{ fontSize: '0.85rem', lineHeight: 2.1, color: 'var(--navy-dim)', fontWeight: 300 }}
            >
              Encontrá joyería de alta gama, relojería suiza y japonesa, y platería fina en nuestros locales
              en pleno centro de San Miguel de Tucumán. Cada espacio está pensado para brindarte una
              experiencia de compra cálida y personalizada, donde podés ver, tocar y elegir la pieza perfecta.
            </p>

            {/* Cards de locales refinadas */}
            <div className="space-y-3">
              {[
                { ciudad: 'Galería Áncel · Local 11', detalle: 'Muñecas 132/6 · Sede central', num: 'I', direccion: 'Galería Áncel Local 11, Muñecas 132, San Miguel de Tucumán' },
                { ciudad: 'Galería Áncel · Local 9', detalle: 'Platería Fina', num: 'II', direccion: 'Galería Áncel Local 9, Muñecas 132, San Miguel de Tucumán' },
                { ciudad: 'Peatonal Mendoza', detalle: 'Joyería General · Relojería Japonesa', num: 'III', direccion: 'Peatonal Mendoza, San Miguel de Tucumán' },
              ].map(({ ciudad, detalle, num, direccion }) => (
                <a
                  key={ciudad}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-5 p-5 transition-all duration-400"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 4px 20px rgba(8,58,79,0.05)',
                  }}
                >
                  <span
                    className="font-serif flex-shrink-0"
                    style={{ fontSize: '1.5rem', color: 'var(--gold)', fontStyle: 'italic', width: '28px' }}
                  >
                    {num}
                  </span>
                  <div className="flex-1">
                    <p
                      className="font-elegant"
                      style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--navy)', fontWeight: 500 }}
                    >
                      {ciudad}
                    </p>
                    <p className="font-elegant mt-0.5" style={{ fontSize: '0.65rem', color: 'var(--navy-dim)' }}>
                      {detalle}
                    </p>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ color: 'var(--gold)' }}
                  />
                </a>
              ))}
            </div>
          </motion.div>

          {/* FOTO PROPIETARIA — derecha */}
          <motion.div
            className="md:col-span-6 lg:col-span-6 lg:col-start-7 relative order-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeIn}
          >
            <div
              className="absolute pointer-events-none"
              style={{
                top: '-20px', right: '-20px', left: '20px', bottom: '20px',
                border: '1px solid var(--border-gold)',
              }}
            />
            <img
              src={photoPropietaria}
              alt="Propietaria de los locales Marcelo Chavan"
              className="relative w-full object-cover"
              style={{
                aspectRatio: '4/5',
                objectPosition: 'center 20%',
                boxShadow: '0 30px 80px rgba(8,58,79,0.14)',
              }}
            />
            <div
              className="absolute -bottom-5 right-6 px-6 py-4 text-right"
              style={{
                backgroundColor: 'var(--bg)',
                boxShadow: '0 12px 40px rgba(8,58,79,0.12)',
                borderRight: '2px solid var(--gold)',
              }}
            >
              <p
                className="font-elegant"
                style={{ fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--gold)' }}
              >
                Nuestros locales
              </p>
              <p className="font-serif mt-1" style={{ fontSize: '0.95rem', color: 'var(--navy)', fontStyle: 'italic' }}>
                San Miguel de Tucumán, Argentina
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Formas de pago — banda elegante ── */}
        <motion.div
          className="mb-24 md:mb-28"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeUp}
        >
          <div
            className="grid md:grid-cols-3"
            style={{ border: '1px solid var(--border-gold)' }}
          >
            {[
              { title: 'Efectivo', detail: '10% de descuento', accent: true },
              { title: 'Transferencia', detail: 'Precio de lista', accent: false },
              { title: '3 Cuotas sin sorpresas', detail: 'Visa · Mastercard · Naranja · Amex', accent: false },
            ].map(({ title, detail, accent }, i) => (
              <div
                key={title}
                className="py-8 px-8 text-center"
                style={{
                  backgroundColor: accent ? 'rgba(165,141,102,0.07)' : 'transparent',
                  borderLeft: i > 0 ? '1px solid var(--border-gold)' : 'none',
                }}
              >
                <p
                  className="font-serif mb-1.5"
                  style={{ fontSize: '1.25rem', color: 'var(--navy)', fontStyle: 'italic' }}
                >
                  {title}
                </p>
                <p
                  className="font-elegant"
                  style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: accent ? 'var(--gold)' : 'var(--navy-dim)' }}
                >
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Highlights minimalistas ── */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-px"
          style={{ backgroundColor: 'var(--border)' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={stagger}
        >
          {HIGHLIGHTS.map(({ icon: Icon, title, sub }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="group text-center py-10 px-4 transition-colors duration-500"
              style={{ backgroundColor: 'var(--bg)' }}
            >
              <Icon
                size={19}
                className="mx-auto mb-4 transition-transform duration-500 group-hover:scale-110"
                style={{ color: 'var(--gold)' }}
              />
              <p
                className="font-elegant mb-1"
                style={{ fontSize: '0.62rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--navy)', fontWeight: 500 }}
              >
                {title}
              </p>
              <p className="font-elegant" style={{ fontSize: '0.62rem', color: 'var(--navy-dim)' }}>
                {sub}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
