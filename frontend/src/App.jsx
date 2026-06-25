import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AnnouncementBar from './components/AnnouncementBar/AnnouncementBar'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import HomePage from './pages/HomePage'
import StorePage from './pages/StorePage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import AdminPage from './pages/AdminPage'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <AnnouncementBar />
      <Navbar />
      <main>
        <Routes>
          <Route path="/"               element={<HomePage />} />
          <Route path="/tienda"         element={<StorePage />} />
          <Route path="/producto/:id"   element={<ProductPage />} />
          <Route path="/carrito"        element={<CartPage />} />
          <Route path="/checkout"       element={<CheckoutPage />} />
          <Route path="/blog"           element={<BlogPage />} />
          <Route path="/blog/:slug"     element={<BlogPostPage />} />
          <Route path="/quienes-somos"  element={<div className="min-h-screen flex items-center justify-center"><p className="text-navy/40">Quiénes somos — próximamente</p></div>} />
          <Route path="/productores"    element={<div className="min-h-screen flex items-center justify-center"><p className="text-navy/40">Productores — próximamente</p></div>} />
          <Route path="/contacto"       element={<div className="min-h-screen flex items-center justify-center"><p className="text-navy/40">Contacto — próximamente</p></div>} />
          <Route path="/admin/*"        element={<AdminPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
