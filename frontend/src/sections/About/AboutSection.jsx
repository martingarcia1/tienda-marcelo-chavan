import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import photoFamilia from '../../assets/photo-familia.png'
import photoMarcelo from '../../assets/marcelo-chavan-retrato.avif'

// Sitio oficial de cada marca — el de Argentina cuando existe uno dedicado
// (verificado: TAG Heuer y Montblanc sí tienen; el resto no, van al sitio global).
const MARCA_URLS = {
  'gucci': 'https://www.gucci.com/',
  'longines': 'https://www.longines.com/es',
  'luminox': 'https://www.luminox.com/',
  'montblanc': 'https://www.montblanc.com/es-ar',
  'movado': 'https://www.movado.com/',
  'swiss alpine military': 'https://www.swissalpinemilitary.ch/en',
  'tag heuer': 'https://www.tagheuer.com/ar/es/',
  'victorinox': 'https://www.victorinox.com/',
}

// Logos de marcas — se recortan del archivo que suba el cliente a assets/brands/.
// Mientras no existan, MARCAS queda vacío y la sección no se renderiza.
const MARCAS = Object.entries(
  import.meta.glob('../../assets/brands/*.{png,jpg,jpeg,webp,avif}', { eager: true, import: 'default' })
)
  .map(([path, src]) => {
    const name = path.split('/').pop().replace(/\.[^.]+$/, '').replace(/-/g, ' ')
    return { src, name, url: MARCA_URLS[name] || null }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

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


        {/* ── Bloque 1.5: La Historia — retrato + relato largo ── */}
        <div className="grid md:grid-cols-12 gap-10 md:gap-8 items-start mb-28 md:mb-36">

          {/* RETRATO — 5 columnas izquierda */}
          <motion.div
            className="md:col-span-5 lg:col-span-4 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeIn}
          >
            <div
              className="absolute pointer-events-none"
              style={{
                top: '-20px', left: '-20px', right: '20px', bottom: '20px',
                border: '1px solid var(--border-gold)',
              }}
            />
            {photoMarcelo ? (
              <img
                src={photoMarcelo}
                alt="Marcelo Chaván, fundador de Joyería Marcelo Chavan"
                className="relative w-full object-cover"
                style={{
                  aspectRatio: '4/5',
                  objectPosition: 'center top',
                  boxShadow: '0 30px 80px rgba(8,58,79,0.14)',
                }}
              />
            ) : (
              <div
                className="relative w-full flex items-center justify-center"
                style={{ aspectRatio: '4/5', backgroundColor: 'var(--bg-sand)', boxShadow: '0 30px 80px rgba(8,58,79,0.14)' }}
              >
                <span className="font-serif" style={{ fontSize: '3rem', color: 'var(--gold)', opacity: 0.25 }}>◆</span>
              </div>
            )}
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
                Marcelo Chaván
              </p>
              <p className="font-serif mt-1" style={{ fontSize: '0.95rem', color: 'var(--navy)', fontStyle: 'italic' }}>
                Fundador
              </p>
            </div>
          </motion.div>

          {/* TEXTO — 7 columnas derecha */}
          <motion.div
            className="md:col-span-7 lg:col-span-7 lg:col-start-6 space-y-8"
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
                La Historia
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
              La historia de{' '}
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Joyería Marcelo Chavan</em>
            </h3>

            <blockquote
              className="font-serif font-light"
              style={{ fontSize: 'clamp(1.2rem, 2.2vw, 1.6rem)', color: 'var(--navy)', lineHeight: 1.4 }}
            >
              Una historia que comenzó en 1957
            </blockquote>

            <div className="space-y-6">
              <p className="font-elegant" style={{ fontSize: '0.85rem', lineHeight: 2.1, color: 'var(--navy-dim)', fontWeight: 300 }}>
                En 1957, Marcelo Chaván decidió transformar su experiencia y pasión por la joyería en un
                proyecto propio. Así nació una marca que, con el paso de los años, se convertiría en un
                referente de la joyería y relojería en Tucumán.
              </p>
              <p className="font-elegant" style={{ fontSize: '0.85rem', lineHeight: 2.1, color: 'var(--navy-dim)', fontWeight: 300 }}>
                Desde sus comienzos, Marcelo entendió que detrás de cada pieza existe algo más que un
                objeto: hay una historia, una celebración y un vínculo que merece ser cuidado.
              </p>
              <p className="font-elegant" style={{ fontSize: '0.85rem', lineHeight: 2.1, color: 'var(--navy-dim)', fontWeight: 300 }}>
                A lo largo de su trayectoria enfrentó grandes desafíos, incluso importantes pérdidas a
                causa de robos. Sin embargo, eligió seguir adelante con la misma determinación que lo
                llevó a comenzar.
              </p>
              <p className="font-elegant" style={{ fontSize: '0.85rem', lineHeight: 2.1, color: 'var(--navy-dim)', fontWeight: 300 }}>
                Su historia también estuvo marcada por la amistad y la generosidad. En 1960, luego de un
                robo que afectó gravemente a Joyería Siufi, Marcelo decidió ayudar a quienes habían sido
                sus maestros, poniendo a disposición productos y recursos de su propio negocio. Ese gesto
                fortaleció un vínculo que perduraría durante generaciones.
              </p>
              <p className="font-elegant" style={{ fontSize: '0.85rem', lineHeight: 2.1, color: 'var(--navy-dim)', fontWeight: 300 }}>
                En 1999, Marcelo confió el futuro de su marca a Miguel Siufi, dando comienzo a una nueva
                etapa en la historia de la joyería.
              </p>
              <p className="font-elegant" style={{ fontSize: '0.85rem', lineHeight: 2.1, color: 'var(--navy-dim)', fontWeight: 300 }}>
                Hoy, Marcelo Chaván continúa creciendo sin perder de vista aquello que le dio origen: la
                excelencia, la confianza, la dedicación y el valor de las relaciones humanas.
              </p>
              <p className="font-elegant" style={{ fontSize: '0.85rem', lineHeight: 2.1, color: 'var(--navy-dim)', fontWeight: 300 }}>
                Más de seis décadas después, seguimos creyendo en lo mismo:
              </p>
            </div>

            <blockquote
              className="font-serif"
              style={{
                fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                color: 'var(--gold)',
                fontStyle: 'italic',
                lineHeight: 1.5,
                borderLeft: '2px solid var(--gold)',
                paddingLeft: '1.5rem',
              }}
            >
              Las mejores historias merecen ser acompañadas por algo que perdure.
            </blockquote>
          </motion.div>
        </div>

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
                La Familia Siufi
              </p>
              <p className="font-serif mt-1" style={{ fontSize: '0.95rem', color: 'var(--navy)', fontStyle: 'italic' }}>
                Tucumán, Argentina
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Bloque 2: locales — a todo lo ancho, con foco en los espacios ── */}
        <div className="mb-28 md:mb-36">

          {/* Encabezado centrado */}
          <motion.div
            className="max-w-2xl mx-auto text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
          >
            <div className="flex items-center justify-center gap-5 mb-6">
              <div className="flex-1 h-px max-w-[80px]" style={{ backgroundColor: 'var(--border-gold)' }} />
              <span
                className="font-elegant"
                style={{ fontSize: '0.6rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--gold)' }}
              >
                Nuestros Locales
              </span>
              <div className="flex-1 h-px max-w-[80px]" style={{ backgroundColor: 'var(--border-gold)' }} />
            </div>

            <h3
              className="font-serif font-light mb-6"
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
          </motion.div>

          {/* Tarjetas de locales — a todo lo ancho */}
          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            {[
              { ciudad: 'Sede Central', detalle: 'Ubicada en Muñecas 136, Galería Áncel, Local 11', num: 'I', direccion: 'Joyería Marcelo Chavan' },
              { ciudad: 'Peatonal Mendoza', detalle: 'Joyería General · Relojería Japonesa', num: 'II', direccion: 'Peatonal Mendoza 612, San Miguel de Tucumán' },
              { ciudad: 'Galería Áncel · Local 9', detalle: 'Toda una línea de productos especializados en Platería Fina disponible, en Muñecas 136 Galería Áncel, Local 9 y en Av. Aconquija 688, Local 7. Pulseras, pendientes, anillos, collares y mucho más.', num: 'III', direccion: 'Galería Áncel Local 9, Muñecas 132, San Miguel de Tucumán' },
            ].map(({ ciudad, detalle, num, direccion }) => (
              <motion.a
                key={ciudad}
                variants={fadeUp}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col h-full p-8 transition-all duration-400 hover:-translate-y-1"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 4px 20px rgba(8,58,79,0.05)',
                }}
              >
                <span
                  className="font-serif block mb-6"
                  style={{ fontSize: '2.2rem', color: 'var(--gold)', fontStyle: 'italic', opacity: 0.7 }}
                >
                  {num}
                </span>
                <p
                  className="font-serif mb-3"
                  style={{ fontSize: '1.4rem', color: 'var(--navy)', letterSpacing: '0.02em' }}
                >
                  {ciudad}
                </p>
                <p
                  className="font-elegant flex-1"
                  style={{ fontSize: '0.78rem', lineHeight: 1.9, color: 'var(--navy-dim)', fontWeight: 300 }}
                >
                  {detalle}
                </p>
                <div
                  className="flex items-center gap-2 mt-6 pt-5 font-elegant"
                  style={{
                    borderTop: '1px solid var(--border)',
                    fontSize: '0.62rem',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                  }}
                >
                  Ver en el mapa
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </motion.a>
            ))}
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

        {/* ── Carrusel de marcas ── */}
        {MARCAS.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
          >
            <div className="flex items-center gap-5 mb-12">
              <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-gold)' }} />
              <span
                className="font-elegant flex-shrink-0"
                style={{ fontSize: '0.6rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--gold)' }}
              >
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-gold)' }} />
            </div>

            <div
              className="overflow-hidden"
              style={{
                maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
                WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
              }}
            >
              <div
                className="flex items-center gap-8 md:gap-16 whitespace-nowrap w-max"
                style={{ animation: 'marquee 32s linear infinite' }}
              >
                {[...MARCAS, ...MARCAS].map(({ src, name, url }, i) => {
                  const img = (
                    <img
                      src={src}
                      alt={name}
                      className="flex-shrink-0"
                      style={{
                        height: 'clamp(48px, 14vw, 170px)',
                        width: 'auto',
                        objectFit: 'contain',
                      }}
                    />
                  )
                  return url ? (
                    <a
                      key={`${name}-${i}`}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0"
                      aria-label={`Sitio oficial de ${name}`}
                    >
                      {img}
                    </a>
                  ) : (
                    <span key={`${name}-${i}`}>{img}</span>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  )
}
