import { motion } from 'framer-motion'
import { MapPin, Gem, Award, Truck } from 'lucide-react'
import photoFamilia from '../../assets/photo-familia.png'
import photoPropietaria from '../../assets/photo-propietaria.png'

const HIGHLIGHTS = [
  { icon: Gem,   title: 'Plata 925',  sub: 'Certificada' },
  { icon: Award, title: 'Calidad',    sub: 'Piezas únicas' },
  { icon: MapPin,title: 'San Miguel', sub: 'Tucumán' },
  { icon: Truck, title: 'Envíos',     sub: 'A todo el país' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
}

export default function AboutSection() {
  return (
    <section
      id="quienes-somos"
      className="py-28 md:py-36"
      style={{ backgroundColor: 'var(--bg-alt)' }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* ── Encabezado ── */}
        <motion.div
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <p
            className="text-[9px] tracking-[0.5em] uppercase font-elegant mb-4"
            style={{ color: 'var(--gold)' }}
          >
            Nuestra Historia
          </p>
          <h2
            className="font-serif font-light"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              color: 'var(--navy)',
              letterSpacing: '0.06em',
            }}
          >
            Quiénes Somos
          </h2>
          <div className="w-12 h-px mx-auto mt-6" style={{ backgroundColor: 'var(--gold)' }} />
        </motion.div>

        {/* ── Texto (izquierda) + Foto familia (derecha) ── */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center mb-20">

          {/* TEXTO — columna izquierda */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            className="space-y-7"
          >
            {/* Comilla + cita */}
            <div>
              <span
                className="block font-serif leading-none select-none mb-2"
                style={{ fontSize: '5rem', color: 'var(--gold-dim)', lineHeight: 0.8 }}
              >
                "
              </span>
              <blockquote
                className="font-serif font-light leading-relaxed"
                style={{
                  fontSize: 'clamp(1.35rem, 2.5vw, 1.9rem)',
                  color: 'var(--navy)',
                  letterSpacing: '0.02em',
                }}
              >
                Cada pieza que creamos nace del cariño de nuestra familia y la pasión por la platería tucumana.
              </blockquote>
            </div>

            <div className="w-10 h-px" style={{ backgroundColor: 'var(--border-gold)' }} />

            <p
              className="text-sm leading-[2] font-elegant"
              style={{ color: 'var(--navy-dim)' }}
            >
              Somos <strong style={{ color: 'var(--navy)' }}>Marcelo Chavan Platería Fina</strong>, un emprendimiento familiar tucumano nacido de la pasión por la joyería y la platería. Llevamos años diseñando y fabricando piezas únicas que combinan tradición y estilo contemporáneo, con el orgullo de ser 100% argentinos.
            </p>
            <p
              className="text-sm leading-[2] font-elegant"
              style={{ color: 'var(--navy-dim)' }}
            >
              Trabajamos con <strong style={{ color: 'var(--navy)' }}>Plata 925 certificada</strong> y <strong style={{ color: 'var(--navy)' }}>Acero Quirúrgico de alta calidad</strong>, materiales que garantizan durabilidad, elegancia y bienestar en cada uso. Cada pieza que sale de nuestro taller está pensada para perdurar en el tiempo.
            </p>

            {/* Formas de pago */}
            <div
              className="p-5 border"
              style={{ borderColor: 'var(--border-gold)', backgroundColor: 'rgba(165,141,102,0.04)' }}
            >
              <p
                className="text-[8px] tracking-[0.45em] uppercase font-elegant mb-3"
                style={{ color: 'var(--gold)' }}
              >
                Formas de Pago
              </p>
              <div className="space-y-2">
                {[
                  ['Efectivo', '10% de descuento'],
                  ['Transferencia', 'Precio de lista'],
                  ['3 Cuotas', 'Visa · Mastercard · Naranja · Amex'],
                ].map(([m, d]) => (
                  <div key={m} className="flex justify-between items-baseline">
                    <span className="text-xs font-elegant" style={{ color: 'var(--navy)' }}>{m}</span>
                    <span className="text-[10px] font-elegant" style={{ color: 'var(--navy-dim)' }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* FOTO FAMILIA — columna derecha */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={{
              hidden: { opacity: 0, y: 48 },
              visible: { opacity: 1, y: 0, transition: { delay: 0.18, duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
            className="relative"
          >
            <div
              className="absolute -top-3 -right-3 w-full h-full pointer-events-none"
              style={{ border: '1px solid var(--border-gold)' }}
            />
            <img
              src={photoFamilia}
              alt="Familia Marcelo Chavan Platería"
              className="relative w-full object-cover"
              style={{ aspectRatio: '3/4', objectPosition: 'center top' }}
            />
          </motion.div>
        </div>

        {/* ── Locales — Texto (izquierda) + Foto propietaria (derecha) ── */}
        <motion.div
          className="grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.14 } } }}
        >
          {/* TEXTO LOCALES — izquierda */}
          <motion.div variants={fadeUp} className="space-y-6">
            <p
              className="text-[9px] tracking-[0.5em] uppercase font-elegant"
              style={{ color: 'var(--gold)' }}
            >
              Nuestros Locales
            </p>
            <h3
              className="font-serif font-light"
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                color: 'var(--navy)',
                letterSpacing: '0.04em',
              }}
            >
              Dos locales en Tucumán para estar más cerca tuyo
            </h3>
            <div className="w-10 h-px" style={{ backgroundColor: 'var(--gold)' }} />
            <p
              className="text-sm leading-[2] font-elegant"
              style={{ color: 'var(--navy-dim)' }}
            >
              Podés encontrar toda nuestra colección de joyas en plata y acero en nuestros dos locales en Tucumán. Ambos espacios están pensados para brindarte una experiencia de compra cálida y personalizada, donde podés ver, tocar y elegir la pieza perfecta.
            </p>

            <div className="space-y-4 mt-2">
              {[
                { ciudad: 'San Miguel de Tucumán', detalle: 'Local céntrico' },
                { ciudad: 'Yerba Buena', detalle: 'Local norte' },
              ].map(({ ciudad, detalle }) => (
                <div
                  key={ciudad}
                  className="flex items-start gap-4 p-4 border"
                  style={{ borderColor: 'var(--border-gold)' }}
                >
                  <MapPin size={16} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p className="text-xs tracking-widest uppercase font-elegant" style={{ color: 'var(--navy)' }}>
                      {ciudad}
                    </p>
                    <p className="text-[10px] font-elegant mt-0.5" style={{ color: 'var(--navy-dim)' }}>
                      {detalle}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="https://maps.app.goo.gl/82mkmcq633YWZsiq9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-elegant hover:opacity-70 transition-opacity"
              style={{ color: 'var(--teal)' }}
            >
              Ver en Google Maps →
            </a>
          </motion.div>

          {/* FOTO PROPIETARIA — derecha */}
          <motion.div variants={fadeUp} className="relative">
            <div
              className="absolute -bottom-3 -right-3 w-full h-full pointer-events-none"
              style={{ border: '1px solid var(--border-gold)' }}
            />
            <img
              src={photoPropietaria}
              alt="Propietaria de locales Marcelo Chavan"
              className="relative w-full object-cover"
              style={{ aspectRatio: '9/16', objectPosition: 'center top', maxHeight: '800px' }}
            />
          </motion.div>
        </motion.div>

        {/* ── Highlights ── */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={stagger}
        >
          {HIGHLIGHTS.map(({ icon: Icon, title, sub }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="text-center py-8 px-4 border"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--bg-card)',
                transition: 'border-color 0.3s ease',
              }}
              whileHover={{ borderColor: 'var(--gold)' }}
            >
              <Icon size={18} className="mx-auto mb-4" style={{ color: 'var(--gold)' }} />
              <p className="text-[10px] tracking-[0.35em] uppercase font-elegant mb-1" style={{ color: 'var(--navy)' }}>
                {title}
              </p>
              <p className="text-[10px] font-elegant" style={{ color: 'var(--navy-dim)' }}>
                {sub}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
