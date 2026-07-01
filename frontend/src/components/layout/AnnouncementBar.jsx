const ITEMS = [
  '✦ Plata 925 Certificada',
  '✦ Envíos a todo el país',
  '✦ Efectivo: 10% de descuento',
  '✦ 3 Cuotas con Visa, Mastercard y Naranja',
  '✦ Acero Quirúrgico Premium',
  '✦ San Miguel de Tucumán · Yerba Buena',
]

export default function AnnouncementBar() {
  return (
    <div
      className="overflow-hidden py-2.5"
      style={{ backgroundColor: 'var(--gold)', borderBottom: '1px solid rgba(165,141,102,0.4)' }}
    >
      <div className="flex gap-14 whitespace-nowrap animate-marquee">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span
            key={i}
            className="text-[10px] tracking-[0.35em] uppercase font-elegant flex-shrink-0"
            style={{ color: 'rgba(255,255,255,0.92)' }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
