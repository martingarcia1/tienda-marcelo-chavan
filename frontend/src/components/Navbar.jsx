import { useEffect, useState } from 'react'
import { Link, useLocation, useMatch } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, ShoppingBag, ChevronDown } from 'lucide-react'
import Monogram from './Monogram'
import { LOCALES, getLocal } from '../lib/locales'
import { useCartStore, cartCount } from '../store/cartStore'
import { useCatalog } from '../lib/hooks'
import { withModo } from '../lib/catalog'

function CartButton({ localSlug }) {
  const items = useCartStore((s) => s.carts[localSlug])
  const openCart = useCartStore((s) => s.openCart)
  const count = cartCount(items)
  return (
    <button
      onClick={() => openCart(localSlug)}
      aria-label="Ver carrito"
      className="relative p-2 transition-opacity hover:opacity-70"
      style={{ color: 'var(--ivory)' }}
    >
      <ShoppingBag size={18} strokeWidth={1.4} />
      {count > 0 && (
        <span
          className="absolute -top-0.5 -right-0.5 flex items-center justify-center font-sans"
          style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: 'var(--copper)', color: 'var(--ink)', fontSize: '0.55rem', fontWeight: 500 }}
        >
          {count}
        </span>
      )}
    </button>
  )
}

export default function Navbar() {
  const { pathname } = useLocation()
  const localMatch = useMatch('/espacios/:slug/*')
  const { catalog } = useCatalog()
  const local = localMatch ? withModo(getLocal(localMatch.params.slug), catalog) : null
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [espaciosOpen, setEspaciosOpen] = useState(false)

  const onHome = pathname === '/'
  const solid = scrolled || !onHome

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setEspaciosOpen(false) }, [pathname])

  const linkStyle = { fontSize: '0.62rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--ivory)' }

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: solid ? 'rgba(12,10,8,0.86)' : 'transparent',
        backdropFilter: solid ? 'blur(14px)' : 'none',
        borderBottom: `1px solid ${solid ? 'var(--line)' : 'transparent'}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 transition-opacity hover:opacity-80">
          <Monogram size={0.85} />
          <span className="hidden sm:block font-sign" style={{ fontSize: '0.7rem', letterSpacing: '0.38em', color: 'var(--ivory-dim)' }}>
            MARCELO CHAVAN
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-9 font-sans">
            <Link to="/#historia" className="link-line" style={linkStyle}>Historia</Link>
            <div className="relative" onMouseEnter={() => setEspaciosOpen(true)} onMouseLeave={() => setEspaciosOpen(false)}>
              <Link to="/#espacios" className="link-line inline-flex items-center gap-1.5" style={linkStyle}>
                Nuestros espacios <ChevronDown size={11} />
              </Link>
              <AnimatePresence>
                {espaciosOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full pt-4"
                  >
                    <div className="w-72 py-3" style={{ backgroundColor: 'var(--ink-2)', border: '1px solid var(--line)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                      {LOCALES.map((l) => (
                        <Link key={l.slug} to={`/espacios/${l.slug}`} className="group flex items-baseline gap-4 px-5 py-3 transition-colors hover:bg-[var(--ink-3)]">
                          <span className="font-serif italic" style={{ color: 'var(--copper)', fontSize: '1.1rem', width: '1.4rem' }}>{l.numero}</span>
                          <span>
                            <span className="block font-serif" style={{ fontSize: '1.15rem', color: 'var(--ivory)' }}>{l.nombre}</span>
                            <span className="block font-sans mt-0.5" style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ivory-xdim)' }}>{l.rubro}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {local?.modo === 'online' && <CartButton localSlug={local.slug} />}

          <button className="md:hidden p-2" onClick={() => setMenuOpen((v) => !v)} aria-label="Menú" style={{ color: 'var(--ivory)' }}>
            {menuOpen ? <X size={20} strokeWidth={1.4} /> : <Menu size={20} strokeWidth={1.4} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-x-0 top-20 bottom-0 px-8 py-10 flex flex-col gap-8"
            style={{ backgroundColor: 'var(--ink)' }}
          >
            <Link to="/" className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--ivory)' }}>Inicio</Link>
            <Link to="/#historia" className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--ivory)' }}>Historia</Link>
            <div>
              <p className="eyebrow mb-5">Nuestros espacios</p>
              <div className="flex flex-col gap-5">
                {LOCALES.map((l) => (
                  <Link key={l.slug} to={`/espacios/${l.slug}`} className="flex items-baseline gap-4">
                    <span className="font-serif italic" style={{ color: 'var(--copper)', fontSize: '1.2rem', width: '1.6rem' }}>{l.numero}</span>
                    <span className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--ivory)' }}>{l.nombre}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
