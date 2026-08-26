import { Navigate, NavLink, Outlet } from 'react-router-dom'
import { LogOut, Package, Tag } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import logo from '../../assets/logo.jpg'

const NAV_LINKS = [
  { to: '/admin/productos', label: 'Productos', icon: Package },
  { to: '/admin/categorias', label: 'Categorías', icon: Tag },
]

export default function AdminLayout() {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const signOut = useAuthStore((s) => s.signOut)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-alt)' }}>
        <p className="font-elegant text-sm" style={{ color: 'var(--navy-dim)' }}>Cargando...</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/admin/login" replace />

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-alt)' }}>
      {/* Sidebar */}
      <aside
        className="w-56 flex-shrink-0 flex flex-col"
        style={{ backgroundColor: 'var(--bg)', borderRight: '1px solid var(--border)' }}
      >
        <div className="px-6 py-6" style={{ borderBottom: '1px solid var(--border)' }}>
          <img src={logo} alt="Marcelo Chavan" style={{ height: '36px', width: 'auto' }} />
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className="flex items-center gap-3 px-3 py-2.5 font-elegant text-sm transition-colors"
              style={({ isActive }) => ({
                color: isActive ? 'var(--gold)' : 'var(--navy-dim)',
                backgroundColor: isActive ? 'rgba(165,141,102,0.08)' : 'transparent',
              })}
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="px-3 mb-2 font-elegant text-xs truncate" style={{ color: 'var(--navy-xdim)' }}>{user.email}</p>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-3 py-2 font-elegant text-sm w-full transition-opacity hover:opacity-70"
            style={{ color: 'var(--navy-dim)' }}
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
