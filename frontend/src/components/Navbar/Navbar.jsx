import { useState, useRef, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../../assets/logo.jpg'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'

const PLATA_CATS = [
  { label: 'Promos',             slug: 'promos' },
  { label: 'Nueva Colección',    slug: 'nueva-coleccion' },
  { label: 'Aros',               slug: 'aros' },
  { label: 'Pulseras',           slug: 'pulseras' },
  { label: 'Conjuntos',          slug: 'conjuntos' },
  { label: 'Anillos',            slug: 'anillos' },
  { label: 'Medallas Religiosas', slug: 'medallas-religiosas' },
]

const ACERO_CATS = [
  { label: 'Aros',      slug: 'aros-acero' },
  { label: 'Anillos',   slug: 'anillos-acero' },
  { label: 'Pulseras',  slug: 'pulseras-acero' },
  { label: 'Cadenas',   slug: 'cadenas-acero' },
]

function DropdownMenu({ items, material, onClose }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 pt-3 z-50">
      <div className="bg-white border border-sand-dark shadow-lg rounded-sm min-w-[200px] py-2">
        <div className="px-4 py-2 border-b border-sand mb-1">
          <span className="text-[10px] font-semibold text-teal tracking-[0.18em] uppercase">
            {material}
          </span>
        </div>
        {items.map(({ label, slug }) => (
          <Link
            key={slug}
            to={`/tienda?material=${material.toLowerCase()}&categoria=${slug}`}
            onClick={onClose}
            className="block px-4 py-2 text-sm text-navy hover:bg-sand hover:text-gold transition-colors duration-150"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}

function NavDropdown({ label, items, material }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1 text-sm font-medium tracking-wide transition-colors duration-200 ${
          open ? 'text-gold' : 'text-navy hover:text-gold'
        }`}
      >
        {label}
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <DropdownMenu items={items} material={material} onClose={() => setOpen(false)} />
      )}
    </div>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const itemCount = useCartStore(s => s.items.reduce((sum, i) => sum + i.quantity, 0))
  const { isAuthenticated, user, logout } = useAuthStore()

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-sand-dark shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[70px]">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Marcelo Chavan Platería"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Nav principal — desktop */}
        <nav className="hidden lg:flex items-center gap-7">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium tracking-wide transition-colors duration-200 ${isActive ? 'text-gold' : 'text-navy hover:text-gold'}`
            }
          >
            Inicio
          </NavLink>
          <NavLink
            to="/quienes-somos"
            className={({ isActive }) =>
              `text-sm font-medium tracking-wide transition-colors duration-200 ${isActive ? 'text-gold' : 'text-navy hover:text-gold'}`
            }
          >
            Quiénes somos
          </NavLink>
          <NavLink
            to="/productores"
            className={({ isActive }) =>
              `text-sm font-medium tracking-wide transition-colors duration-200 ${isActive ? 'text-gold' : 'text-navy hover:text-gold'}`
            }
          >
            Productores
          </NavLink>

          {/* Plata con dropdown */}
          <NavDropdown label="Plata" items={PLATA_CATS} material="Plata" />

          {/* Acero con dropdown */}
          <NavDropdown label="Acero" items={ACERO_CATS} material="Acero" />
        </nav>

        {/* Acciones — desktop */}
        <div className="hidden lg:flex items-center gap-5">
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-xs text-navy/60 hover:text-navy transition-colors tracking-wide uppercase">
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="text-xs text-navy/60 hover:text-navy transition-colors tracking-wide uppercase"
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-xs text-navy/60 hover:text-navy transition-colors tracking-wide uppercase"
            >
              Ingresar
            </Link>
          )}

          {/* Carrito */}
          <Link
            to="/carrito"
            id="cart-button"
            className="relative text-navy hover:text-gold transition-colors"
            aria-label="Carrito de compras"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Botón hamburguesa — mobile */}
        <button
          className="lg:hidden text-navy p-1"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Menú"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {mobileOpen
              ? <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
              : <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round"/>
            }
          </svg>
        </button>
      </div>

      {/* Menú mobile */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-sand px-6 pb-6 pt-3 flex flex-col gap-1">
          {[
            { to: '/',              label: 'Inicio' },
            { to: '/quienes-somos', label: 'Quiénes somos' },
            { to: '/productores',   label: 'Productores' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `py-2.5 text-sm font-medium border-b border-sand ${isActive ? 'text-gold' : 'text-navy'}`
              }
            >
              {label}
            </NavLink>
          ))}

          <div className="pt-2">
            <p className="text-[10px] text-teal font-semibold tracking-[0.18em] uppercase mb-2">Plata</p>
            {PLATA_CATS.map(({ label, slug }) => (
              <Link
                key={slug}
                to={`/tienda?material=plata&categoria=${slug}`}
                onClick={() => setMobileOpen(false)}
                className="block py-2 pl-3 text-sm text-navy/70 hover:text-gold border-b border-sand/50 last:border-0"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="pt-2">
            <p className="text-[10px] text-teal font-semibold tracking-[0.18em] uppercase mb-2">Acero</p>
            {ACERO_CATS.map(({ label, slug }) => (
              <Link
                key={slug}
                to={`/tienda?material=acero&categoria=${slug}`}
                onClick={() => setMobileOpen(false)}
                className="block py-2 pl-3 text-sm text-navy/70 hover:text-gold border-b border-sand/50 last:border-0"
              >
                {label}
              </Link>
            ))}
          </div>

          <Link
            to="/carrito"
            onClick={() => setMobileOpen(false)}
            className="mt-3 flex items-center gap-2 text-sm font-medium text-navy"
          >
            Carrito
            {itemCount > 0 && (
              <span className="bg-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      )}
    </header>
  )
}
