import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap'

export function useLenis() {
  const lenisRef = useRef(null)
  const tickerFnRef = useRef(null)

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenisRef.current.on('scroll', ScrollTrigger.update)

    tickerFnRef.current = (time) => lenisRef.current.raf(time * 1000)
    gsap.ticker.add(tickerFnRef.current)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tickerFnRef.current)
      lenisRef.current.destroy()
    }
  }, [])

  return lenisRef
}
