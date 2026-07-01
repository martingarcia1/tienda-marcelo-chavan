import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'

export default function HeroSection() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 })

      /* Monograma */
      tl.from('.h-mono', {
        opacity: 0,
        scale: 0.84,
        duration: 1.3,
        ease: 'power3.out',
      })
        /* Línea superior */
        .from('.h-line-top', {
          scaleX: 0,
          duration: 1.1,
          ease: 'power3.inOut',
          transformOrigin: 'left center',
        }, '-=0.6')
        /* Nombre principal — revela desde abajo */
        .from('.h-name', {
          y: 90,
          duration: 1.2,
          ease: 'power3.out',
        }, '-=0.7')
        /* "PLATERÍA" fade + tracking expand */
        .from('.h-plateria', {
          opacity: 0,
          letterSpacing: '0.7em',
          duration: 1.0,
          ease: 'power2.out',
        }, '-=0.7')
        /* Línea inferior */
        .from('.h-line-bottom', {
          scaleX: 0,
          duration: 0.9,
          ease: 'power3.inOut',
          transformOrigin: 'left center',
        }, '-=0.6')
        /* Subtítulo */
        .from('.h-sub', {
          opacity: 0,
          y: 16,
          duration: 0.65,
          ease: 'power2.out',
        }, '-=0.5')
        /* CTAs */
        .from('.h-cta', {
          opacity: 0,
          y: 14,
          stagger: 0.15,
          duration: 0.55,
          ease: 'power2.out',
        }, '-=0.4')
        .from('.h-scroll', { opacity: 0, duration: 0.5 }, '-=0.2')

      /* Parallax sutil */
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
      {/* Esquinas decorativas */}
      <div
        className="absolute top-0 left-0 w-28 h-28 pointer-events-none"
        style={{ borderTop: '1px solid var(--border-gold)', borderLeft: '1px solid var(--border-gold)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-28 h-28 pointer-events-none"
        style={{ borderBottom: '1px solid var(--border-gold)', borderRight: '1px solid var(--border-gold)' }}
      />

      {/* Glows */}
      <div
        className="absolute top-1/3 right-[10%] w-56 h-56 rounded-full pointer-events-none"
        style={{ backgroundColor: 'var(--aqua)', filter: 'blur(72px)', opacity: 0.18 }}
      />
      <div
        className="absolute bottom-1/4 right-[28%] w-36 h-36 rounded-full pointer-events-none"
        style={{ backgroundColor: 'var(--gold-light)', filter: 'blur(52px)', opacity: 0.12 }}
      />

      {/* Contenido — alineado a la izquierda */}
      <div className="h-content relative z-10 w-full px-8 md:px-16 lg:px-24">

        {/* Monograma — replica el estilo del logo */}
        <div className="h-mono mb-6 leading-none select-none">
          {/* M grande con Ch. pequeño superpuesto — como en el logo */}
          <div className="flex items-end gap-0 leading-none">
            <span
              className="font-serif"
              style={{
                fontSize: 'clamp(4rem, 9vw, 7.5rem)',
                color: 'var(--gold)',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              M
            </span>
            <span
              className="font-serif"
              style={{
                fontSize: 'clamp(1.6rem, 3.5vw, 3rem)',
                color: 'var(--gold)',
                letterSpacing: '0.05em',
                lineHeight: 1,
                marginBottom: '0.15em',
              }}
            >
              CH.
            </span>
          </div>
        </div>

        {/* Línea superior */}
        <div
          className="h-line-top w-16 h-px mb-6"
          style={{ backgroundColor: 'var(--gold)' }}
        />

        {/* MARCELO CHAVAN — tipografía del logo */}
        <div className="overflow-hidden">
          <h1
            className="h-name font-serif"
            style={{
              fontSize: 'clamp(1.6rem, 4.5vw, 3.8rem)',
              color: 'var(--gold)',
              letterSpacing: '0.35em',
              fontWeight: 400,
              lineHeight: 1.1,
            }}
          >
            MARCELO CHAVAN
          </h1>
        </div>

        {/* PLATERÍA — igual que en el logo */}
        <p
          className="h-plateria font-elegant"
          style={{
            fontSize: 'clamp(0.65rem, 1.2vw, 0.95rem)',
            color: 'var(--navy-dim)',
            letterSpacing: '0.45em',
            marginTop: '0.5rem',
            marginBottom: '2rem',
            fontWeight: 300,
          }}
        >
          PLATERÍA
        </p>

        {/* Línea inferior */}
        <div
          className="h-line-bottom w-16 h-px mb-7"
          style={{ backgroundColor: 'var(--gold)' }}
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
          Plata 925 &amp; Acero Quirúrgico · Tucumán, Argentina
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <a
            href="#productos"
            onClick={(e) => { e.preventDefault(); document.querySelector('#productos')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="h-cta font-elegant transition-all duration-300 hover:opacity-85"
            style={{
              padding: '14px 40px',
              fontSize: '0.625rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              backgroundColor: 'var(--navy)',
              color: 'var(--bg-sand)',
            }}
          >
            Ver Colección
          </a>
          <a
            href="#quienes-somos"
            onClick={(e) => { e.preventDefault(); document.querySelector('#quienes-somos')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="h-cta font-elegant border transition-all duration-300 hover:opacity-70"
            style={{
              padding: '14px 40px',
              fontSize: '0.625rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              borderColor: 'var(--border-gold)',
              color: 'var(--navy)',
            }}
          >
            Nuestra Historia
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="h-scroll absolute bottom-8 left-8 md:left-16 lg:left-24 flex flex-col items-start gap-3"
        style={{ opacity: 0.4 }}
      >
        <span
          className="font-elegant"
          style={{ fontSize: '0.5rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--navy)' }}
        >
          Scroll
        </span>
        <div className="flex flex-col gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-px h-3" style={{ backgroundColor: 'var(--gold)', opacity: 1 - i * 0.3 }} />
          ))}
        </div>
      </div>
    </section>
  )
}
