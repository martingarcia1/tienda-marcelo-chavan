import Reveal from '../components/Reveal'
import retrato from '../assets/marcelo-chavan-retrato.avif'
import familia from '../assets/photo-familia.png'

const P = ({ children }) => (
  <p className="font-sans" style={{ fontSize: '0.86rem', lineHeight: 2.05, color: 'var(--ivory-dim)', fontWeight: 300 }}>{children}</p>
)

function FramedPhoto({ src, alt, caption, sub, align = 'left' }) {
  return (
    <div className="relative">
      <div
        className="absolute pointer-events-none"
        style={{ inset: align === 'left' ? '-18px 18px 18px -18px' : '18px -18px -18px 18px', border: '1px solid var(--line-strong)' }}
      />
      <img src={src} alt={alt} className="relative w-full object-cover" style={{ aspectRatio: '4/5', objectPosition: 'center top', filter: 'saturate(0.9) contrast(1.03)', boxShadow: '0 40px 90px rgba(0,0,0,0.55)' }} />
      <div
        className={`absolute -bottom-6 ${align === 'left' ? 'right-6 text-right' : 'left-6'} px-6 py-4`}
        style={{ backgroundColor: 'var(--ink-2)', border: '1px solid var(--line)', [align === 'left' ? 'borderRight' : 'borderLeft']: '2px solid var(--copper)' }}
      >
        <p className="eyebrow" style={{ fontSize: '0.55rem' }}>{caption}</p>
        <p className="font-serif italic mt-1" style={{ fontSize: '1rem', color: 'var(--ivory)' }}>{sub}</p>
      </div>
    </div>
  )
}

export default function Historia() {
  return (
    <section id="historia" className="relative py-28 md:py-40 overflow-hidden" style={{ backgroundColor: 'var(--ink)' }}>
      <div aria-hidden className="absolute hidden lg:block pointer-events-none select-none font-sign" style={{ top: '3rem', right: '-1rem', fontSize: '15rem', lineHeight: 1, color: 'rgba(219,163,107,0.035)' }}>
        1957
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-10">
        {/* Bloque 1 — fundador */}
        <div className="grid md:grid-cols-12 gap-14 md:gap-10 items-start">
          <Reveal className="md:col-span-5 lg:col-span-4">
            <FramedPhoto src={retrato} alt="Marcelo Chaván, fundador" caption="Marcelo Chaván" sub="Fundador" />
          </Reveal>

          <div className="md:col-span-7 lg:col-start-6 space-y-8 pt-4">
            <Reveal>
              <p className="eyebrow">La historia</p>
              <h2 className="font-serif font-light mt-5" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', lineHeight: 1.1, color: 'var(--ivory)' }}>
                Una historia que comenzó <em className="text-copper-shimmer">en 1957</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="space-y-6">
              <P>
                En 1957, Marcelo Chaván decidió transformar su experiencia y pasión por la joyería en un proyecto propio. Así nació una
                marca que, con el paso de los años, se convertiría en un referente de la joyería y relojería en Tucumán.
              </P>
              <P>
                Desde sus comienzos entendió que detrás de cada pieza existe algo más que un objeto: hay una historia, una celebración
                y un vínculo que merece ser cuidado. A lo largo de su trayectoria enfrentó grandes desafíos, incluso importantes
                pérdidas a causa de robos, y eligió seguir adelante con la misma determinación que lo llevó a comenzar.
              </P>
              <P>
                Su historia también estuvo marcada por la amistad y la generosidad. En 1960, luego de un robo que afectó gravemente a
                Joyería Siufi, Marcelo decidió ayudar a quienes habían sido sus maestros, poniendo a disposición productos y recursos
                de su propio negocio. Ese gesto fortaleció un vínculo que perduraría durante generaciones.
              </P>
              <P>
                En 1999, Marcelo confió el futuro de su marca a Miguel Siufi, dando comienzo a una nueva etapa. Hoy, Marcelo Chavan
                sigue creciendo sin perder de vista aquello que le dio origen: la excelencia, la confianza, la dedicación y el valor
                de las relaciones humanas.
              </P>
            </Reveal>
            <Reveal delay={0.2}>
              <blockquote className="font-serif italic pl-6" style={{ fontSize: 'clamp(1.4rem, 2.6vw, 1.9rem)', lineHeight: 1.45, color: 'var(--copper)', borderLeft: '1px solid var(--copper)' }}>
                Las mejores historias merecen ser acompañadas por algo que perdure.
              </blockquote>
            </Reveal>
          </div>
        </div>

        {/* Bloque 2 — familia */}
        <div className="grid md:grid-cols-12 gap-14 md:gap-10 items-center mt-36 md:mt-48">
          <div className="md:col-span-6 lg:col-span-5 space-y-8 order-2 md:order-1">
            <Reveal>
              <p className="eyebrow">La familia Siufi</p>
              <blockquote className="font-serif font-light mt-5" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', lineHeight: 1.35, color: 'var(--ivory)' }}>
                Cada pieza nace de una tradición familiar y de la pasión por la joyería <span style={{ color: 'var(--copper)' }}>tucumana</span>.
              </blockquote>
            </Reveal>
            <Reveal delay={0.1} className="space-y-6">
              <P>
                Ofrecemos joyería de alta gama, relojería suiza y japonesa, y platería fina, acompañando a generaciones de familias
                tucumanas. Trabajamos con oro 18K, plata, acero y diamantes, y con marcas exclusivas como Victorinox, TAG Heuer,
                Longines y Gucci.
              </P>
              <P>Joyas con alma y una atención personalizada que marca la diferencia.</P>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-script" style={{ fontSize: '2.4rem', color: 'var(--copper)' }}>Familia Siufi</p>
            </Reveal>
          </div>
          <Reveal className="md:col-span-6 lg:col-start-7 order-1 md:order-2">
            <FramedPhoto src={familia} alt="Familia Siufi" caption="La familia Siufi" sub="Tucumán, Argentina" align="right" />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
