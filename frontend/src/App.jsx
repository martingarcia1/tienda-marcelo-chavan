import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useLenis } from './hooks/useLenis'
import { useAuthStore } from './store/authStore'
import PublicLayout from './components/layout/PublicLayout'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import CategoryPage from './pages/CategoryPage'
import ProductPage from './pages/ProductPage'
import OffersPage from './pages/OffersPage'
import NotFoundPage from './pages/NotFoundPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminCouponsPage from './pages/admin/AdminCouponsPage'

function AppInner() {
  useLenis()
  const initAuth = useAuthStore((s) => s.init)

  useEffect(() => {
    initAuth()
  }, [initAuth])

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<CatalogPage />} />
        <Route path="/categoria/:slug" element={<CategoryPage />} />
        <Route path="/producto/:slug" element={<ProductPage />} />
        <Route path="/ofertas" element={<OffersPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/tablero" replace />} />
        <Route path="tablero" element={<AdminDashboardPage />} />
        <Route path="pedidos" element={<AdminOrdersPage />} />
        <Route path="productos" element={<AdminProductsPage />} />
        <Route path="categorias" element={<AdminCategoriesPage />} />
        <Route path="cupones" element={<AdminCouponsPage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
