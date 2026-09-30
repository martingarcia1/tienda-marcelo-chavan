import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap'

let lenisInstance = null

// Para que la navegación entre páginas pueda mover el scroll a través de
// Lenis (si se usa window.scrollTo directo, Lenis vuelve a su posición vieja).
export function scrollToTarget(target, options = {}) {
  if (lenisInstance) lenisInstance.scrollTo(target, options)
  else if (typeof target === 'number') window.scrollTo(0, target)
  else target?.scrollIntoView?.({ behavior: options.immediate ? 'auto' : 'smooth' })
}

export function useLenis() {
  const lenisRef = useRef(null)
  const tickerFnRef = useRef(null)

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenisInstance = lenisRef.current
    lenisRef.current.on('scroll', ScrollTrigger.update)

    tickerFnRef.current = (time) => lenisRef.current.raf(time * 1000)
    gsap.ticker.add(tickerFnRef.current)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tickerFnRef.current)
      lenisRef.current.destroy()
      lenisInstance = null
    }
  }, [])

  return lenisRef
}
