import { useState, useEffect } from 'react'

const ANNOUNCEMENTS = [
  'Envíos a todo el país · Joyería artesanal · Tucumán, Argentina',
  '10% de descuento pagando en efectivo o transferencia',
  'Cuotas con Visa · Mastercard · Naranja · American Express',
  'Plata 925 elaborada a mano por artesanos tucumanos',
]

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % ANNOUNCEMENTS.length)
        setVisible(true)
      }, 300)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-navy text-sand py-2 px-4 text-center text-[11px] font-sans tracking-[0.15em] uppercase overflow-hidden">
      <span
        className="inline-block transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <span className="text-gold mr-2">✦</span>
        {ANNOUNCEMENTS[current]}
        <span className="text-gold ml-2">✦</span>
      </span>
    </div>
  )
}
