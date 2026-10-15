import { Link, Navigate, NavLink, Outlet } from 'react-router-dom'
import { LogOut, Package, Tag, ClipboardList, LayoutDashboard, Ticket, ExternalLink } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useMyLocal } from '../../lib/myLocal'
import Monogram from '../../components/Monogram'
import ThemeToggle from '../../components/ThemeToggle'

const NAV_LINKS = [
  { to: '/admin/tablero', label: 'Tablero', icon: LayoutDashboard },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ClipboardList },
  { to: '/admin/productos', label: 'Productos', icon: Package },
  { to: '/admin/categorias', label: 'Categorías', icon: Tag },
  { to: '/admin/cupones', label: 'Cupones', icon: Ticket },
]

const linkStyle = ({ isActive }) => ({
  color: isActive ? 'var(--copper)' : 'var(--ivory-dim)',
  backgroundColor: isActive ? 'rgba(219,163,107,0.1)' : 'transparent',
})

function LocalBadge({ local }) {
  if (!local) return null
  return (
    <div>
      <p className="font-sans" style={{ fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--ivory-xdim)' }}>Tu local</p>
      <p className="font-serif mt-1" style={{ fontSize: '1.15rem', color: 'var(--ivory)' }}>
        <span className="italic mr-1.5" style={{ color: 'var(--copper)' }}>{local.numero}</span>{local.nombre}
      </p>
      <Link to={`/espacios/${local.slug}`} target="_blank" className="inline-flex items-center gap-1.5 mt-2 font-sans transition-opacity hover:opacity-70" style={{ fontSize: '0.66rem', color: 'var(--copper)' }}>
        Ver mi vidriera <ExternalLink size={11} />
      </Link>
    </div>
  )
}

export default function AdminLayout() {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const signOut = useAuthStore((s) => s.signOut)
  const { local } = useMyLocal()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ink)' }}>
        <p className="font-sans text-sm" style={{ color: 'var(--ivory-dim)' }}>Cargando...</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/admin/login" replace />

  return (
    <div className="min-h-screen md:flex" style={{ backgroundColor: 'var(--ink)' }}>
      {/* Barra superior en celular */}
      <header className="md:hidden sticky top-0 z-40" style={{ backgroundColor: 'var(--ink-2)', borderBottom: '1px solid var(--line)' }}>
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/"><Monogram size={0.7} /></Link>
          <div className="flex items-center gap-1">
            {local && <span className="font-serif text-sm mr-2" style={{ color: 'var(--ivory)' }}>{local.nombre}</span>}
            <ThemeToggle />
            <button onClick={signOut} aria-label="Cerrar sesión" className="p-2" style={{ color: 'var(--ivory-dim)' }}><LogOut size={16} /></button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className="flex items-center gap-1.5 px-3 py-2 font-sans text-xs whitespace-nowrap" style={linkStyle}>
              <Icon size={13} /> {label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Barra lateral en escritorio */}
      <aside className="hidden md:flex w-60 flex-shrink-0 flex-col sticky top-0 h-screen" style={{ backgroundColor: 'var(--ink-2)', borderRight: '1px solid var(--line)' }}>
        <div className="px-6 py-6 space-y-6" style={{ borderBottom: '1px solid var(--line)' }}>
          <Link to="/" className="flex items-center gap-3">
            <Monogram size={0.85} />
            <span className="font-sans" style={{ fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--ivory-xdim)' }}>Panel</span>
          </Link>
          <LocalBadge local={local} />
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className="flex items-center gap-3 px-3 py-2.5 font-sans text-sm transition-colors" style={linkStyle}>
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 space-y-1" style={{ borderTop: '1px solid var(--line)' }}>
          <ThemeToggle withLabel className="px-3 w-full" />
          <p className="px-3 pt-2 font-sans text-xs truncate" style={{ color: 'var(--ivory-xdim)' }}>{user.email}</p>
          <button onClick={signOut} className="flex items-center gap-2 px-3 py-2 font-sans text-sm w-full transition-opacity hover:opacity-70" style={{ color: 'var(--ivory-dim)' }}>
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}
