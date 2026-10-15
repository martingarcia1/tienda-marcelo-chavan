import { Link } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import Reveal from '../components/Reveal'
import { LOCALES, nombresDuenos } from '../lib/locales'
import { mapsHref } from '../lib/whatsapp'
import { useCatalog } from '../lib/hooks'
import { withModo } from '../lib/catalog'

function EspacioCard({ local, cover, count, delay }) {
  return (
    <Reveal delay={delay} className="flex flex-col">
      <Link to={`/espacios/${local.slug}`} className="group relative block overflow-hidden" style={{ aspectRatio: '3/4', backgroundColor: 'var(--ink-3)' }}>
        {cover && (
          <img src={cover} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.07]" style={{ filter: 'brightness(0.62) saturate(0.85)' }} />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(12,10,8,0.95) 0%, rgba(12,10,8,0.35) 50%, rgba(12,10,8,0.2) 100%)' }} />
        <div className="absolute inset-4 pointer-events-none transition-colors duration-700 group-hover:border-[var(--line-strong)]" style={{ border: '1px solid var(--line)' }} />

        <div className="absolute inset-0 p-8 md:p-9 flex flex-col">
          <span className="font-serif italic" style={{ fontSize: '3rem', lineHeight: 1, color: 'var(--copper)' }}>{local.numero}</span>
          <div className="mt-auto">
            <p className="eyebrow" style={{ fontSize: '0.56rem' }}>{local.rubro}</p>
            <h3 className="font-serif font-light mt-3" style={{ fontSize: 'clamp(1.8rem, 2.6vw, 2.4rem)', lineHeight: 1.1, color: 'var(--ivory)' }}>
              {local.nombre}
            </h3>
            <p className="font-sans mt-3" style={{ fontSize: '0.74rem', color: 'var(--ivory-dim)' }}>
              {nombresDuenos(local)}
            </p>
            <div className="flex items-center justify-between mt-7 pt-5" style={{ borderTop: '1px solid var(--line)' }}>
              <span className="font-sans" style={{ fontSize: '0.58rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--ivory-xdim)' }}>
                {local.modo === 'vidriera' ? 'Vidriera virtual' : 'Compra online'}{count > 0 ? ` · ${count} piezas` : ''}
              </span>
              <span className="flex items-center gap-2 font-sans transition-all duration-500 group-hover:gap-3" style={{ fontSize: '0.6rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--copper)' }}>
                Entrar <ArrowRight size={13} />
              </span>
            </div>
          </div>
        </div>
      </Link>

      <a
        href={mapsHref(local.mapsQuery)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 mt-4 font-sans transition-colors hover:text-[var(--copper)]"
        style={{ fontSize: '0.72rem', color: 'var(--ivory-dim)' }}
      >
        <MapPin size={13} strokeWidth={1.4} style={{ color: 'var(--copper)' }} />
        {local.direccion}
      </a>
    </Reveal>
  )
}

export default function Espacios() {
  const { catalog } = useCatalog()

  return (
    <section id="espacios" className="relative py-28 md:py-40 grain" style={{ backgroundColor: 'var(--ink-2)', borderTop: '1px solid var(--line)' }}>
      <div className="relative max-w-7xl mx-auto px-6 md:px-10">
        <Reveal className="max-w-2xl mx-auto text-center mb-16 md:mb-20">
          <p className="eyebrow">Nuestros locales</p>
          <h2 className="font-serif font-light mt-5" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', lineHeight: 1.1, color: 'var(--ivory)' }}>
            Nuestros espacios <em className="text-copper-shimmer">en Tucumán</em>
          </h2>
          <p className="font-sans mt-6" style={{ fontSize: '0.84rem', lineHeight: 2, color: 'var(--ivory-dim)', fontWeight: 300 }}>
            Tres espacios en pleno centro de San Miguel de Tucumán, cada uno con su especialidad y su gente. Entrá a cada uno para
            conocer su historia y recorrer su vidriera.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
          {LOCALES.map((l, i) => {
            const v = catalog?.vidrieras[l.slug]
            return <EspacioCard key={l.slug} local={withModo(l, catalog)} cover={v?.products.find((p) => p.img)?.img} count={v?.products.length || 0} delay={i * 0.12} />
          })}
        </div>
      </div>
    </section>
  )
}
