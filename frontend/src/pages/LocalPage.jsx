import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight, MapPin, Clock, ShoppingBag } from 'lucide-react'
import Reveal from '../components/Reveal'
import ProductCard from '../components/ProductCard'
import { WhatsAppIcon } from '../components/WhatsAppFloat'
import { LOCALES, getLocal, nombresDuenos } from '../lib/locales'
import { whatsappHref, mapsHref } from '../lib/whatsapp'
import { useCatalog, useDocumentTitle } from '../lib/hooks'
import { withModo, categoriesOfLocal } from '../lib/catalog'
import CategoryTile from '../components/CategoryTile'
import NotFoundPage from './NotFoundPage'

const ease = [0.22, 0.61, 0.36, 1]

function initials(nombre) {
  return nombre.split(' ').map((p) => p[0]).join('').slice(0, 2)
}

// Se remonta al cambiar de local para que no se arrastre la sección filtrada.
export default function LocalPageRoute() {
  const { slug } = useParams()
  return <LocalPage key={slug} slug={slug} />
}

function LocalPage({ slug }) {
  const { catalog, loading, error } = useCatalog()
  const local = withModo(getLocal(slug), catalog)
  useDocumentTitle(local?.nombre)

  if (!local) return <NotFoundPage />

  const vidriera = catalog?.vidrieras[local.slug]
  const cover = vidriera?.products.find((p) => p.img)?.img
  const raices = catalog && local ? categoriesOfLocal(catalog, local.slug) : []
  const otros = LOCALES.filter((l) => l.slug !== local.slug)

  return (
    <>
      {/* ── Portada del local ── */}
      <section className="theme-dark relative min-h-[88svh] flex items-end overflow-hidden grain" style={{ backgroundColor: 'var(--ink)' }}>
        {cover && (
          <motion.img
            key={cover}
            src={cover}
            alt=""
            initial={{ scale: 1.12, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.2, ease }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.38) saturate(0.8)' }}
          />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--ink) 0%, rgba(12,10,8,0.55) 45%, rgba(12,10,8,0.35) 100%)' }} />
        <div className="absolute pointer-events-none" style={{ top: '15%', right: '10%', width: '28rem', height: '28rem', borderRadius: '50%', background: 'radial-gradient(circle, rgba(224,160,106,0.16) 0%, transparent 65%)', filter: 'blur(30px)' }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pt-36 pb-16 md:pb-20">
          <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 1 }} className="font-sans flex flex-wrap gap-2 mb-12" style={{ fontSize: '0.58rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--ivory-xdim)' }}>
            <Link to="/" className="hover:text-[var(--copper)] transition-colors">Inicio</Link>
            <span>/</span>
            <Link to="/#espacios" className="hover:text-[var(--copper)] transition-colors">Nuestros espacios</Link>
            <span>/</span>
            <span style={{ color: 'var(--ivory-dim)' }}>{local.nombre}</span>
          </motion.nav>

          <motion.span initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.3, ease }} className="block font-serif italic" style={{ fontSize: 'clamp(4rem, 9vw, 7rem)', lineHeight: 0.9, color: 'var(--copper)' }}>
            {local.numero}
          </motion.span>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }} className="eyebrow mt-6">{local.rubro}</motion.p>
          <div className="overflow-hidden mt-4">
            <motion.h1 initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.2, delay: 0.5, ease }} className="font-serif font-light" style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)', lineHeight: 1, color: 'var(--ivory)' }}>
              {local.nombre}
            </motion.h1>
          </div>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 1, ease }} className="font-serif italic mt-5" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: 'var(--ivory-dim)' }}>
            {nombresDuenos(local)}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 1, ease }} className="flex flex-wrap gap-4 mt-10">
            <a
              href="#vidriera"
              className="flex items-center gap-2.5 px-8 py-4 font-sans transition-all duration-300 hover:shadow-[0_0_40px_rgba(224,160,106,0.35)]"
              style={{ fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', backgroundColor: 'var(--copper)', color: 'var(--on-copper)', fontWeight: 500 }}
            >
              Ver la vidriera <ArrowDown size={13} />
            </a>
            <a
              href={mapsHref(local.mapsQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-8 py-4 font-sans transition-colors hover:bg-[rgba(219,163,107,0.08)]"
              style={{ fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', border: '1px solid var(--line-strong)', color: 'var(--ivory)' }}
            >
              <MapPin size={13} /> Cómo llegar
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Historia + quiénes lo atienden ── */}
      <section className="py-24 md:py-32" style={{ backgroundColor: 'var(--ink)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-16 md:gap-10">
          <Reveal className="md:col-span-7 lg:col-span-6">
            <p className="eyebrow">Historia del local</p>
            <div className="copper-rule w-20 mt-5 mb-8" />
            <div className="space-y-6">
              {local.historia.map((p, i) => (
                <p key={i} className={i === 0 ? 'font-serif font-light' : 'font-sans'} style={i === 0 ? { fontSize: 'clamp(1.4rem, 2.4vw, 1.9rem)', lineHeight: 1.45, color: 'var(--ivory)' } : { fontSize: '0.86rem', lineHeight: 2.05, color: 'var(--ivory-dim)', fontWeight: 300 }}>
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15} className="md:col-span-5 lg:col-start-8">
            <p className="eyebrow">Quiénes lo atienden</p>
            <div className="copper-rule w-20 mt-5 mb-8" />
            <div className="space-y-4">
              {local.duenos.map((d) => (
                <div key={d.nombre} className="flex items-center gap-5 p-5" style={{ backgroundColor: 'var(--ink-2)', border: '1px solid var(--line)' }}>
                  <div className="flex-shrink-0 flex items-center justify-center font-sign" style={{ width: 64, height: 64, borderRadius: '50%', border: '1px solid var(--line-strong)', color: 'var(--copper)', fontSize: '1.2rem', background: 'radial-gradient(circle at 30% 30%, rgba(224,160,106,0.14), transparent 70%)' }}>
                    {initials(d.nombre)}
                  </div>
                  <div>
                    <p className="font-serif" style={{ fontSize: '1.35rem', color: 'var(--ivory)' }}>{d.nombre}</p>
                    <p className="font-sans mt-1" style={{ fontSize: '0.66rem', letterSpacing: '0.12em', color: 'var(--ivory-xdim)' }}>{d.rol}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-4 font-sans" style={{ fontSize: '0.78rem', color: 'var(--ivory-dim)' }}>
              <a href={mapsHref(local.mapsQuery)} target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-[var(--copper)] transition-colors">
                <MapPin size={15} strokeWidth={1.4} style={{ color: 'var(--copper)', flexShrink: 0, marginTop: 2 }} />
                <span>{local.direccion}<br /><span style={{ color: 'var(--ivory-xdim)' }}>{local.ciudad}</span></span>
              </a>
              <p className="flex gap-3">
                <Clock size={15} strokeWidth={1.4} style={{ color: 'var(--copper)', flexShrink: 0, marginTop: 2 }} />
                {local.horario}
              </p>
              <a href={whatsappHref(`Hola! Quiero hacer una consulta para ${local.nombre}.`)} target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-[var(--copper)] transition-colors">
                <WhatsAppIcon style={{ width: 15, height: 15, color: 'var(--copper)', flexShrink: 0, marginTop: 2 }} />
                381 430 3839
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Vidriera ── */}
      <section id="vidriera" className="py-24 md:py-32 grain relative" style={{ backgroundColor: 'var(--ink-2)', borderTop: '1px solid var(--line)' }}>
        <div className="relative max-w-7xl mx-auto px-6 md:px-10">
          <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
            <div>
              <p className="eyebrow">La vidriera</p>
              <h2 className="font-serif font-light mt-4" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', lineHeight: 1.1, color: 'var(--ivory)' }}>
                Piezas de <em className="text-copper-shimmer">{local.nombre}</em>
              </h2>
            </div>
            <div className="flex items-start gap-3 max-w-sm p-4" style={{ border: '1px solid var(--line)', backgroundColor: 'var(--ink)' }}>
              {local.modo === 'online' ? (
                <>
                  <ShoppingBag size={16} strokeWidth={1.4} style={{ color: 'var(--copper)', flexShrink: 0, marginTop: 2 }} />
                  <p className="font-sans" style={{ fontSize: '0.72rem', lineHeight: 1.8, color: 'var(--ivory-dim)' }}>
                    <strong style={{ color: 'var(--ivory)', fontWeight: 500 }}>Compra online · demostración.</strong> Podés armar tu compra para ver cómo funcionaría; en esta versión no se cobra nada.
                  </p>
                </>
              ) : (
                <>
                  <WhatsAppIcon style={{ width: 16, height: 16, color: 'var(--copper)', flexShrink: 0, marginTop: 2 }} />
                  <p className="font-sans" style={{ fontSize: '0.72rem', lineHeight: 1.8, color: 'var(--ivory-dim)' }}>
                    <strong style={{ color: 'var(--ivory)', fontWeight: 500 }}>Vidriera virtual.</strong> Consultá cada pieza por WhatsApp y te asesoramos personalmente.
                  </p>
                </>
              )}
            </div>
          </Reveal>

          {loading && <p className="font-sans text-sm py-16 text-center" style={{ color: 'var(--ivory-dim)' }}>Cargando la vidriera...</p>}
          {error && <p className="font-sans text-sm py-16 text-center" style={{ color: 'var(--ivory-dim)' }}>No pudimos cargar la vidriera. Probá recargar la página.</p>}

          {vidriera && vidriera.products.length === 0 && (
            <div className="text-center py-16">
              <p className="font-serif italic" style={{ fontSize: '1.6rem', color: 'var(--ivory)' }}>Estamos preparando esta vidriera</p>
              <p className="font-sans mt-3 text-sm" style={{ color: 'var(--ivory-dim)' }}>Consultanos por WhatsApp: tenemos piezas en el local que todavía no están publicadas.</p>
            </div>
          )}

          {vidriera && vidriera.products.length > 0 && (
            <>
              {raices.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 mb-20">
                  {raices.map((c, i) => <CategoryTile key={c.id} localSlug={local.slug} category={c} delay={i} />)}
                </div>
              )}
              <p className="eyebrow mb-10">Todas las piezas · {vidriera.products.length}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
                {vidriera.products.map((p, i) => <ProductCard key={p.id} product={p} local={local} delay={i} />)}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Otros espacios ── */}
      <section className="py-20" style={{ backgroundColor: 'var(--ink)', borderTop: '1px solid var(--line)' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="eyebrow mb-8">Otros espacios</p>
          <div className="grid md:grid-cols-2 gap-px" style={{ backgroundColor: 'var(--line)' }}>
            {otros.map((l) => (
              <Link key={l.slug} to={`/espacios/${l.slug}`} className="group flex items-center justify-between gap-6 p-8 transition-colors hover:bg-[var(--ink-2)]" style={{ backgroundColor: 'var(--ink)' }}>
                <div className="flex items-baseline gap-5">
                  <span className="font-serif italic" style={{ fontSize: '2rem', color: 'var(--copper)' }}>{l.numero}</span>
                  <div>
                    <p className="font-serif" style={{ fontSize: '1.6rem', color: 'var(--ivory)' }}>{l.nombre}</p>
                    <p className="font-sans mt-1" style={{ fontSize: '0.58rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--ivory-xdim)' }}>{l.rubro}</p>
                  </div>
                </div>
                <ArrowRight size={18} className="transition-transform duration-500 group-hover:translate-x-1.5" style={{ color: 'var(--copper)' }} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
