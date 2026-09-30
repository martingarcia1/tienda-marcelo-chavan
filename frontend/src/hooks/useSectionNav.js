import { useLocation, useNavigate } from 'react-router-dom'
import { scrollToTarget } from './useLenis'

// Links a secciones de la home (#inicio, #quienes-somos, #productos) que
// funcionan desde cualquier página: en la home scrollean, en otra navegan.
export function useSectionNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (e, hash) => {
    e?.preventDefault()
    if (pathname === '/') {
      const el = document.querySelector(hash)
      if (el) scrollToTarget(el, { offset: -90 })
      window.history.replaceState(null, '', hash === '#inicio' ? '/' : hash)
    } else {
      navigate(hash === '#inicio' ? '/' : `/${hash}`)
    }
  }
}
