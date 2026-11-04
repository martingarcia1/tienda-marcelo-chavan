import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import Reveal from '../components/Reveal'
import { usePromociones, destinoBoton } from '../lib/promociones'

const SEGUNDOS_IMAGEN = 6
// Tope por si un video no avisa que terminó.
const SEGUNDOS_MAX_VIDEO = 40

export function BotonPromo({ promo, className = '', style }) {
  const destino = destinoBoton(promo)
  if (!destino || !promo.boton_texto) return null
  const props = {
    className: `inline-flex items-center gap-2 px-6 py-3 font-sans transition-opacity hover:opacity-85 ${className}`,
    style: { fontSize: '0.6rem', letterSpacing: '0.28em', textTransform: 'uppercase', backgroundColor: 'var(--copper)', color: 'var(--on-copper)', fontWeight: 500, ...style },
  }
  const contenido = <>{promo.boton_texto} <ArrowUpRight size={13} /></>
  return destino.externo
    ? <a href={destino.href} target="_blank" rel="noopener noreferrer" {...props}>{contenido}</a>
    : <Link to={destino.href} {...props}>{contenido}</Link>
}

// Imagen o video de una promo. Las verticales (reels) y las horizontales se
// ven completas sobre un fondo desenfocado de la misma imagen.
export function MediaPromo({ promo, videoRef, onEnded, loop = false }) {
  if (promo.tipo === 'video') {
    return (
      <video
        ref={videoRef}
        src={promo.url}
        className="absolute inset-0 w-full h-full object-contain"
        autoPlay
        muted
        playsInline
        loop={loop}
        onEnded={onEnded}
      />
    )
  }
  return (
    <>
      <img src={promo.url} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover scale-110" style={{ filter: 'blur(28px) brightness(0.45)' }} />
      <img src={promo.url} alt={promo.titulo || ''} className="absolute inset-0 w-full h-full object-contain" />
    </>
  )
}

export default function Novedades() {
  const { promos } = usePromociones()
  const [actual, setActual] = useState(0)
  const [pausado, setPausado] = useState(false)
  const videoRef = useRef(null)

  const total = promos.length
  const promo = promos[actual % Math.max(total, 1)]
  const ir = (i) => setActual(((i % total) + total) % total)

  // Avance automático: imágenes por tiempo, videos al terminar (con tope).
  useEffect(() => {
    if (total < 2 || pausado || !promo) return
    const segundos = promo.tipo === 'video' ? SEGUNDOS_MAX_VIDEO : SEGUNDOS_IMAGEN
    const t = setTimeout(() => setActual((a) => (a + 1) % total), segundos * 1000)
    return () => clearTimeout(t)
  }, [actual, total, pausado, promo])

  if (total === 0) return null

  return (
    <section className="py-20 md:py-28" style={{ backgroundColor: 'var(--ink)' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <Reveal className="flex items-end justify-between gap-6 mb-10">
          <div>
            <p className="eyebrow">Novedades</p>
            <h2 className="font-serif font-light mt-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.05, color: 'var(--ivory)' }}>
              Lo nuevo en <em className="italic" style={{ color: 'var(--copper)' }}>nuestros espacios</em>
            </h2>
          </div>
          <Link to="/novedades" className="hidden sm:inline-flex items-center gap-2 font-sans link-line flex-shrink-0" style={{ fontSize: '0.62rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--ivory-dim)' }}>
            Ver todas <ArrowRight size={13} />
          </Link>
        </Reveal>

        <div
          className="theme-dark relative overflow-hidden aspect-[4/5] sm:aspect-[16/9] max-h-[78svh] w-full"
          style={{ backgroundColor: 'var(--ink-3)', border: '1px solid var(--line)' }}
          onMouseEnter={() => setPausado(true)}
          onMouseLeave={() => setPausado(false)}
        >
          <AnimatePresence initial={false}>
            <motion.div key={promo.id} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
              <MediaPromo promo={promo} videoRef={videoRef} loop={total < 2} onEnded={() => total > 1 && ir(actual + 1)} />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: '55%', background: 'linear-gradient(to top, rgba(12,10,8,0.88) 0%, rgba(12,10,8,0.3) 55%, transparent 100%)' }} />

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div className="max-w-xl">
              {promo.local && <p className="eyebrow" style={{ fontSize: '0.56rem' }}>{promo.local.nombre}</p>}
              {promo.titulo && (
                <p className="font-serif font-light mt-3" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', lineHeight: 1.15, color: 'var(--ivory)' }}>{promo.titulo}</p>
              )}
              <BotonPromo promo={promo} className="mt-5" />
            </div>

            {total > 1 && (
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  {promos.map((p, i) => (
                    <button key={p.id} onClick={() => ir(i)} aria-label={`Ver novedad ${i + 1}`} className="h-[3px] transition-all duration-500" style={{ width: i === actual ? 28 : 12, backgroundColor: i === actual ? 'var(--copper)' : 'rgba(239,230,218,0.35)' }} />
                  ))}
                </div>
                <button onClick={() => ir(actual - 1)} aria-label="Anterior" className="p-2.5 transition-colors hover:text-[var(--copper)]" style={{ border: '1px solid var(--line-strong)', color: 'var(--ivory)' }}><ArrowLeft size={15} /></button>
                <button onClick={() => ir(actual + 1)} aria-label="Siguiente" className="p-2.5 transition-colors hover:text-[var(--copper)]" style={{ border: '1px solid var(--line-strong)', color: 'var(--ivory)' }}><ArrowRight size={15} /></button>
              </div>
            )}
          </div>
        </div>

        <Link to="/novedades" className="sm:hidden inline-flex items-center gap-2 mt-6 font-sans" style={{ fontSize: '0.62rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--ivory-dim)' }}>
          Ver todas las novedades <ArrowRight size={13} />
        </Link>
      </div>
    </section>
  )
}
