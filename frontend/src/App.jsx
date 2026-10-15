import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LocalPage from './pages/LocalPage'
import ProductPage from './pages/ProductPage'
import LocalCategoryPage from './pages/LocalCategoryPage'
import NotFoundPage from './pages/NotFoundPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import AdminCouponsPage from './pages/admin/AdminCouponsPage'
import { useAuthStore } from './store/authStore'

export default function App() {
  const initAuth = useAuthStore((s) => s.init)
  useEffect(() => { initAuth() }, [initAuth])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/espacios/:slug" element={<LocalPage />} />
          <Route path="/espacios/:slug/categoria/:catSlug" element={<LocalCategoryPage />} />
          <Route path="/espacios/:slug/producto/:productSlug" element={<ProductPage />} />
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
    </BrowserRouter>
  )
}
