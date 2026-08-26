import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'

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
          y: 14,
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
      style={{ backgroundColor: '#1d1512' }}
    >
      {/* Esquinas decorativas */}
      <div
        className="absolute top-0 left-0 w-28 h-28 pointer-events-none"
        style={{ borderTop: '1px solid rgba(224,160,106,0.35)', borderLeft: '1px solid rgba(224,160,106,0.35)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-28 h-28 pointer-events-none"
        style={{ borderBottom: '1px solid rgba(224,160,106,0.35)', borderRight: '1px solid rgba(224,160,106,0.35)' }}
      />

      {/* Glows de fondo */}
      <div
        className="absolute top-1/4 right-[8%] w-72 h-72 rounded-full pointer-events-none"
        style={{ backgroundColor: '#e0a06a', filter: 'blur(100px)', opacity: 0.14 }}
      />
      <div
        className="absolute bottom-1/4 right-[30%] w-44 h-44 rounded-full pointer-events-none"
        style={{ backgroundColor: '#c97b4a', filter: 'blur(70px)', opacity: 0.12 }}
      />

      {/* Contenido — alineado a la izquierda */}
      <div className="h-content relative z-10 w-full px-8 md:px-16 lg:px-24 py-24">

        {/* ── Monograma destacado ── */}
        <div className="h-mono relative inline-block mb-8 select-none">
          {/* Glow cobrizo detrás del monograma */}
          <div
            className="h-mono-glow absolute pointer-events-none"
            style={{
              inset: '-30%',
              background: 'radial-gradient(circle at 40% 50%, rgba(224,160,106,0.32) 0%, transparent 65%)',
              opacity: 0.3,
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
              border: '1px solid rgba(224,160,106,0.25)',
              borderRadius: '50%',
              transform: 'rotate(-8deg)',
            }}
          />
          {/* M + CH. con shimmer cobrizo */}
          <div className="relative flex items-end leading-none">
            <span
              className="font-sign text-copper-shimmer"
              style={{
                fontSize: 'clamp(5.5rem, 13vw, 11rem)',
                letterSpacing: '-0.02em',
                lineHeight: 0.9,
                filter: 'drop-shadow(0 4px 24px rgba(224,160,106,0.4))',
              }}
            >
              M
            </span>
            <span
              className="font-sign text-copper-shimmer"
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 4.4rem)',
                letterSpacing: '0.05em',
                lineHeight: 1,
                marginBottom: '0.12em',
                marginLeft: '-0.08em',
                filter: 'drop-shadow(0 3px 16px rgba(224,160,106,0.35))',
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
            background: 'linear-gradient(90deg, #e0a06a 0%, rgba(224,160,106,0.15) 100%)',
          }}
        />

        {/* MARCELO CHAVAN */}
        <div className="overflow-hidden">
          <h1
            className="h-name font-sign"
            style={{
              fontSize: 'clamp(1.7rem, 4.8vw, 4.2rem)',
              color: '#dba36b',
              letterSpacing: '0.28em',
              fontWeight: 600,
              lineHeight: 1.1,
              textShadow: '0 2px 20px rgba(224,160,106,0.3)',
            }}
          >
            MARCELO CHAVAN
          </h1>
        </div>

        {/* Desde 1957 */}
        <p
          className="h-plateria font-script"
          style={{
            fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
            color: '#e0a06a',
            marginTop: '0.4rem',
            marginBottom: '1.8rem',
            lineHeight: 1,
            textShadow: '0 2px 16px rgba(224,160,106,0.3)',
          }}
        >
          Desde 1957
        </p>

        {/* Línea inferior */}
        <div
          className="h-line-bottom h-px mb-7"
          style={{
            width: '120px',
            background: 'linear-gradient(90deg, #e0a06a 0%, rgba(224,160,106,0.15) 100%)',
          }}
        />

        {/* Subtítulo */}
        <p
          className="h-sub font-elegant"
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.28em',
            color: 'rgba(240,225,213,0.65)',
            textTransform: 'uppercase',
            marginBottom: '3rem',
          }}
        >
          Joyería · Relojería · Platería · Tucumán, Argentina
        </p>
      </div>
    </section>
  )
}
