import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { LOCALES } from '../lib/locales'

const ease = [0.22, 0.61, 0.36, 1]
const enter = (delay, y = 30) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.2, delay, ease },
})

export default function Hero() {
  return (
    <section id="inicio" className="theme-dark relative min-h-[100svh] flex flex-col overflow-hidden grain" style={{ backgroundColor: '#140f0c' }}>
      {/* Luz cobriza de fondo */}
      <div className="absolute pointer-events-none" style={{ top: '12%', right: '6%', width: '34rem', height: '34rem', borderRadius: '50%', background: 'radial-gradient(circle, rgba(224,160,106,0.22) 0%, transparent 65%)', filter: 'blur(30px)' }} />
      <div className="absolute pointer-events-none" style={{ bottom: '-10%', left: '-8%', width: '30rem', height: '30rem', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,95,49,0.18) 0%, transparent 65%)', filter: 'blur(40px)' }} />

      {/* Marcos de esquina como el cartel */}
      <motion.div {...enter(0.2, 0)} className="hidden md:block absolute top-24 left-10 w-24 h-24 pointer-events-none" style={{ borderTop: '1px solid var(--line-strong)', borderLeft: '1px solid var(--line-strong)' }} />
      <motion.div {...enter(0.2, 0)} className="hidden md:block absolute bottom-24 right-10 w-24 h-24 pointer-events-none" style={{ borderBottom: '1px solid var(--line-strong)', borderRight: '1px solid var(--line-strong)' }} />

      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-16">
          <motion.div {...enter(0.3, 40)} className="inline-flex items-end leading-none select-none mb-8" style={{ filter: 'drop-shadow(0 6px 30px rgba(224,160,106,0.35))' }}>
            <span className="font-sign text-copper-shimmer" style={{ fontSize: 'clamp(5.5rem, 13vw, 11rem)', lineHeight: 0.9, letterSpacing: '-0.02em' }}>M</span>
            <span className="font-sign text-copper-shimmer" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.4rem)', marginBottom: '0.12em', marginLeft: '-0.08em', letterSpacing: '0.05em' }}>CH.</span>
          </motion.div>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.1, delay: 0.9, ease }} className="copper-rule w-32 mb-7 origin-left" />

          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, delay: 1.0, ease }}
              className="font-sign"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 4.4rem)', color: 'var(--copper)', letterSpacing: '0.26em', fontWeight: 600, lineHeight: 1.1, textShadow: '0 2px 24px rgba(224,160,106,0.3)' }}
            >
              MARCELO CHAVAN
            </motion.h1>
          </div>

          <motion.p {...enter(1.35, 16)} className="font-script" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.4rem)', color: 'var(--copper-soft)', lineHeight: 1.1, marginTop: '0.3rem' }}>
            Desde 1957
          </motion.p>

          <motion.p {...enter(1.6, 14)} className="font-sans mt-8 max-w-md" style={{ fontSize: '0.8rem', lineHeight: 2, color: 'var(--ivory-dim)', fontWeight: 300 }}>
            Joyería, relojería y platería fina. Tres espacios en el centro de San Miguel de Tucumán, una misma tradición familiar.
          </motion.p>

          <motion.div {...enter(1.8, 14)} className="flex flex-wrap gap-4 mt-10">
            <Link
              to="/#espacios"
              className="px-8 py-4 font-sans transition-all duration-300 hover:shadow-[0_0_40px_rgba(224,160,106,0.35)]"
              style={{ fontSize: '0.62rem', letterSpacing: '0.32em', textTransform: 'uppercase', backgroundColor: 'var(--copper)', color: 'var(--on-copper)', fontWeight: 500 }}
            >
              Conocé nuestros espacios
            </Link>
            <Link
              to="/#historia"
              className="px-8 py-4 font-sans transition-colors duration-300 hover:bg-[rgba(219,163,107,0.08)]"
              style={{ fontSize: '0.62rem', letterSpacing: '0.32em', textTransform: 'uppercase', border: '1px solid var(--line-strong)', color: 'var(--ivory)' }}
            >
              Nuestra historia
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Accesos directos a los tres espacios */}
      <motion.div {...enter(2.1, 10)} className="relative z-10" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 sm:grid-cols-3">
          {LOCALES.map((l, i) => (
            <Link
              key={l.slug}
              to={`/espacios/${l.slug}`}
              className="group flex items-baseline gap-4 py-5 sm:py-6 sm:px-6 first:sm:pl-0 transition-colors"
              style={{ borderLeft: i > 0 ? '1px solid var(--line)' : 'none' }}
            >
              <span className="font-serif italic" style={{ color: 'var(--copper)', fontSize: '1rem' }}>{l.numero}</span>
              <span>
                <span className="block font-serif transition-colors group-hover:text-[var(--copper)]" style={{ fontSize: '1.15rem', color: 'var(--ivory)' }}>{l.nombre}</span>
                <span className="block font-sans mt-0.5" style={{ fontSize: '0.56rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ivory-xdim)' }}>{l.rubro}</span>
              </span>
            </Link>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 2.6, duration: 1 }, y: { delay: 2.6, duration: 2.2, repeat: Infinity } }}
        className="hidden md:block absolute right-10 bottom-32 z-10"
        style={{ color: 'var(--ivory-xdim)' }}
      >
        <ArrowDown size={18} strokeWidth={1.2} />
      </motion.div>
    </section>
  )
}
