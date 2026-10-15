import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppFloat from './WhatsAppFloat'
import CartDrawer from './CartDrawer'
import PaymentResultModal from './PaymentResultModal'

const HEADER_HEIGHT = 80

// Al cambiar de página vuelve arriba; si trae #seccion (por ejemplo
// "Nuestros espacios" desde la página de un local), la busca y baja hasta ella.
function useScrollOnNavigate() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    let tries = 0
    const timer = setInterval(() => {
      const el = document.querySelector(hash)
      if (el || ++tries > 20) {
        clearInterval(timer)
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT, behavior: 'smooth' })
      }
    }, 80)
    return () => clearInterval(timer)
  }, [pathname, hash])
}

export default function Layout() {
  useScrollOnNavigate()
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
      <CartDrawer />
      <PaymentResultModal />
    </>
  )
}
