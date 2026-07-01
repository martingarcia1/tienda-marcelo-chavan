import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import logo from '../../assets/logo.jpg'

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Quiénes Somos', href: '#quienes-somos' },
  { label: 'Productos', href: '#productos' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      style={{
        backgroundColor: 'rgba(250,250,248,0.97)',
        borderBottom: '1px solid var(--border)',
        boxShadow: scrolled ? '0 2px 20px rgba(8,58,79,0.07)' : 'none',
        transition: 'box-shadow 0.4s ease',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">

        {/* Logo imagen */}
        <a
          href="#inicio"
          onClick={(e) => scrollTo(e, '#inicio')}
          className="transition-opacity duration-300 hover:opacity-75"
        >
          <img
            src={logo}
            alt="Marcelo Chavan Platería"
            style={{
              height: '44px',
              width: 'auto',
              mixBlendMode: 'multiply',
            }}
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => scrollTo(e, href)}
              className="text-[10px] tracking-[0.28em] uppercase font-elegant hover-line transition-opacity duration-300 hover:opacity-60"
              style={{ color: 'var(--navy)' }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 transition-opacity hover:opacity-60"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menú"
          style={{ color: 'var(--navy)' }}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="md:hidden animate-fade-down"
          style={{
            backgroundColor: 'var(--bg)',
            borderTop: '1px solid var(--border)',
          }}
        >
          <nav className="flex flex-col items-center gap-7 py-10">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => scrollTo(e, href)}
                className="text-[11px] tracking-[0.4em] uppercase font-elegant hover:opacity-60 transition-opacity"
                style={{ color: 'var(--navy)' }}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
