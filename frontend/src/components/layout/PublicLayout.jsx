import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AnnouncementBar from './AnnouncementBar'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from '../WhatsAppButton'
import CartDrawer from '../CartDrawer'
import PaymentResultModal from '../PaymentResultModal'
import { scrollToTarget } from '../../hooks/useLenis'

const HEADER_OFFSET = -90

// Al cambiar de página vuelve arriba; si la dirección trae #seccion (por
// ejemplo "Quiénes Somos" desde la página de un producto), la busca y scrollea
// hasta ella cuando termina de renderizarse.
function useScrollOnNavigate() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      scrollToTarget(0, { immediate: true })
      return
    }
    let tries = 0
    const timer = setInterval(() => {
      const el = document.querySelector(hash)
      if (el || ++tries > 20) {
        clearInterval(timer)
        if (el) scrollToTarget(el, { offset: HEADER_OFFSET })
      }
    }, 100)
    return () => clearInterval(timer)
  }, [pathname, hash])
}

export default function PublicLayout() {
  useScrollOnNavigate()

  return (
    <>
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <Navbar />
      </div>

      <main>
        <Outlet />
      </main>

      <Footer />
      <WhatsAppButton />
      <CartDrawer />
      <PaymentResultModal />
    </>
  )
}
