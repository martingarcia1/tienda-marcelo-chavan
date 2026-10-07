import Reveal from '../components/Reveal'

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

const MARCAS = Object.entries(import.meta.glob('../assets/brands/*.{png,jpg,jpeg,webp,avif}', { eager: true, import: 'default' }))
  .map(([path, src]) => {
    const name = path.split('/').pop().replace(/\.[^.]+$/, '').replace(/-/g, ' ')
    return { src, name, url: MARCA_URLS[name] || null }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

const PAGOS = [
  { title: 'Efectivo', detail: '10% de descuento', accent: true },
  { title: 'Transferencia', detail: 'Precio de lista' },
  { title: '3 cuotas', detail: 'Visa · Mastercard · Naranja · Amex' },
]

export default function PagosMarcas() {
  return (
    <>
      <section className="py-20 md:py-24" style={{ backgroundColor: 'var(--ink)' }}>
        <Reveal className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-3" style={{ border: '1px solid var(--line-strong)' }}>
            {PAGOS.map(({ title, detail, accent }, i) => (
              <div
                key={title}
                className="py-10 px-8 text-center"
                style={{ backgroundColor: accent ? 'rgba(219,163,107,0.07)' : 'transparent', borderLeft: i > 0 ? '1px solid var(--line)' : 'none' }}
              >
                <p className="font-serif italic" style={{ fontSize: '1.6rem', color: 'var(--ivory)' }}>{title}</p>
                <p className="font-sans mt-2" style={{ fontSize: '0.6rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: accent ? 'var(--copper)' : 'var(--ivory-xdim)' }}>
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Los logos son a color sobre fondo claro: van en una franja marfil para que se lean. */}
      {MARCAS.length > 0 && (
        <section className="py-14 md:py-16" style={{ backgroundColor: 'var(--ivory)' }}>
          <p className="text-center font-sans mb-10" style={{ fontSize: '0.6rem', letterSpacing: '0.42em', textTransform: 'uppercase', color: 'var(--copper-deep)' }}>
            Marcas que nos acompañan
          </p>
          <div className="overflow-hidden" style={{ maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)' }}>
            <div className="flex items-center gap-10 md:gap-20 w-max animate-marquee">
              {[...MARCAS, ...MARCAS].map(({ src, name, url }, i) => {
                const img = <img src={src} alt={name} className="flex-shrink-0" style={{ height: 'clamp(56px, 10vw, 120px)', width: 'auto', objectFit: 'contain' }} />
                return url ? (
                  <a key={`${name}-${i}`} href={url} target="_blank" rel="noopener noreferrer" aria-label={`Sitio oficial de ${name}`} className="flex-shrink-0">{img}</a>
                ) : (
                  <span key={`${name}-${i}`}>{img}</span>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
