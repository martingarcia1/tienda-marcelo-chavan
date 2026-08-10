import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import heroVideo from '../../assets/WhatsApp Video 2026-08-10 at 11.57.44.mp4'

export default function HeroSection() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 })

      /* Monograma — entrada con presencia */
      tl.from('.h-mono', {
        opacity: 0,
        scale: 0.8,
        y: 30,
        duration: 1.5,
        ease: 'power3.out',
      })
        .from('.h-mono-ring', {
          opacity: 0,
          scale: 0.7,
          duration: 1.6,
          ease: 'power2.out',
        }, '-=1.2')
        .from('.h-line-top', {
          scaleX: 0,
          duration: 1.1,
          ease: 'power3.inOut',
          transformOrigin: 'left center',
        }, '-=0.8')
        .from('.h-name', {
          y: 90,
          duration: 1.2,
          ease: 'power3.out',
        }, '-=0.7')
        .from('.h-plateria', {
          opacity: 0,
          letterSpacing: '0.8em',
          duration: 1.0,
          ease: 'power2.out',
        }, '-=0.7')
        .from('.h-line-bottom', {
          scaleX: 0,
          duration: 0.9,
          ease: 'power3.inOut',
          transformOrigin: 'left center',
        }, '-=0.6')
        .from('.h-sub', { opacity: 0, y: 16, duration: 0.65, ease: 'power2.out' }, '-=0.5')
        .from('.h-cta', { opacity: 0, y: 14, stagger: 0.15, duration: 0.55, ease: 'power2.out' }, '-=0.4')
        .from('.h-scroll', { opacity: 0, duration: 0.5 }, '-=0.2')

      /* Brillo pulsante sutil en el monograma */
      gsap.to('.h-mono-glow', {
        opacity: 0.5,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      /* Parallax */
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          gsap.set('.h-content', { y: self.progress * 60 })
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: 'var(--bg-alt)' }}
    >
      {/* Video de fondo */}
      <video
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Velo translúcido para mantener legible el contenido */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: 'var(--bg-alt)', opacity: 0.100 }}
      />

      {/* Esquinas decorativas */}
      <div
        className="absolute top-0 left-0 w-28 h-28 pointer-events-none"
        style={{ borderTop: '1px solid var(--border-gold)', borderLeft: '1px solid var(--border-gold)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-28 h-28 pointer-events-none"
        style={{ borderBottom: '1px solid var(--border-gold)', borderRight: '1px solid var(--border-gold)' }}
      />

      {/* Glows de fondo */}
      <div
        className="absolute top-1/4 right-[8%] w-72 h-72 rounded-full pointer-events-none"
        style={{ backgroundColor: 'var(--gold-light)', filter: 'blur(90px)', opacity: 0.16 }}
      />
      <div
        className="absolute bottom-1/4 right-[30%] w-44 h-44 rounded-full pointer-events-none"
        style={{ backgroundColor: 'var(--aqua)', filter: 'blur(64px)', opacity: 0.14 }}
      />

      {/* Contenido — alineado a la izquierda */}
      <div className="h-content relative z-10 w-full px-8 md:px-16 lg:px-24 py-24">

        {/* ── Monograma destacado ── */}
        <div className="h-mono relative inline-block mb-8 select-none">
          {/* Glow dorado detrás del monograma */}
          <div
            className="h-mono-glow absolute pointer-events-none"
            style={{
              inset: '-30%',
              background: 'radial-gradient(circle at 40% 50%, rgba(201,168,76,0.28) 0%, transparent 65%)',
              opacity: 0.25,
              filter: 'blur(12px)',
            }}
          />
          {/* Anillo decorativo */}
          <div
            className="h-mono-ring absolute pointer-events-none hidden md:block"
            style={{
              width: '190%',
              height: '135%',
              top: '-18%',
              left: '-42%',
              border: '1px solid rgba(165,141,102,0.22)',
              borderRadius: '50%',
              transform: 'rotate(-8deg)',
            }}
          />
          {/* M + CH. con shimmer */}
          <div className="relative flex items-end leading-none">
            <span
              className="font-serif text-gold-shimmer"
              style={{
                fontSize: 'clamp(5.5rem, 13vw, 11rem)',
                letterSpacing: '-0.02em',
                lineHeight: 0.9,
                filter: 'drop-shadow(0 4px 24px rgba(165,141,102,0.35))',
              }}
            >
              M
            </span>
            <span
              className="font-serif text-gold-shimmer"
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 4.4rem)',
                letterSpacing: '0.05em',
                lineHeight: 1,
                marginBottom: '0.12em',
                marginLeft: '-0.08em',
                filter: 'drop-shadow(0 3px 16px rgba(165,141,102,0.3))',
              }}
            >
              CH.
            </span>
          </div>
        </div>

        {/* Línea superior */}
        <div
          className="h-line-top h-px mb-6"
          style={{
            width: '120px',
            background: 'linear-gradient(90deg, var(--gold) 0%, rgba(165,141,102,0.15) 100%)',
          }}
        />

        {/* MARCELO CHAVAN */}
        <div className="overflow-hidden">
          <h1
            className="h-name font-serif"
            style={{
              fontSize: 'clamp(1.7rem, 4.8vw, 4.2rem)',
              color: 'var(--gold)',
              letterSpacing: '0.35em',
              fontWeight: 500,
              lineHeight: 1.1,
              textShadow: '0 2px 20px rgba(165,141,102,0.25)',
            }}
          >
            MARCELO CHAVAN
          </h1>
        </div>

        {/* DESDE 1957 */}
        <p
          className="h-plateria font-elegant"
          style={{
            fontSize: 'clamp(0.7rem, 1.3vw, 1rem)',
            color: 'var(--navy)',
            letterSpacing: '0.5em',
            marginTop: '0.6rem',
            marginBottom: '2rem',
            fontWeight: 400,
            opacity: 0.75,
          }}
        >
          DESDE 1957
        </p>

        {/* Línea inferior */}
        <div
          className="h-line-bottom h-px mb-7"
          style={{
            width: '120px',
            background: 'linear-gradient(90deg, var(--gold) 0%, rgba(165,141,102,0.15) 100%)',
          }}
        />

        {/* Subtítulo */}
        <p
          className="h-sub font-elegant"
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.28em',
            color: 'var(--navy-dim)',
            textTransform: 'uppercase',
            marginBottom: '3rem',
          }}
        >
          Joyería · Relojería · Platería · Tucumán, Argentina
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <a
            href="#productos"
            onClick={(e) => { e.preventDefault(); document.querySelector('#productos')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="h-cta font-elegant transition-all duration-300 hover:opacity-85 hover:-translate-y-0.5"
            style={{
              padding: '14px 40px',
              fontSize: '0.625rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              backgroundColor: 'var(--gold)',
              color: '#FFFFFF',
              boxShadow: '0 8px 28px rgba(165,141,102,0.35)',
            }}
          >
            Ver Colección
          </a>
          <a
            href="#quienes-somos"
            onClick={(e) => { e.preventDefault(); document.querySelector('#quienes-somos')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="h-cta font-elegant border transition-all duration-300 hover:opacity-70 hover:-translate-y-0.5"
            style={{
              padding: '14px 40px',
              fontSize: '0.625rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              borderColor: 'var(--gold)',
              color: 'var(--navy)',
            }}
          >
            Nuestra Historia
          </a>
        </div>
      </div>

      {/* Scroll indicator
      <div
        className="h-scroll absolute bottom-8 left-8 md:left-16 lg:left-24 flex flex-col items-start gap-3"
        style={{ opacity: 0.4 }}
      >
        <span
          className="font-elegant"
          style={{ fontSize: '0.5rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--navy)' }}
        >

        </span>
        <div className="flex flex-col gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-px h-3" style={{ backgroundColor: 'var(--gold)', opacity: 1 - i * 0.3 }} />
          ))}
        </div>
      </div> */}
    </section>
  )
}
