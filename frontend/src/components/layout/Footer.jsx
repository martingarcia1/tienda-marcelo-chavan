import { Globe, MapPin } from 'lucide-react'
import logo from '../../assets/logo.jpg'

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-alt)',
        borderTop: '1px solid var(--border-gold)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">

          {/* Marca */}
          <div>
            <img
              src={logo}
              alt="Marcelo Chavan Platería"
              style={{ width: '140px', height: 'auto', mixBlendMode: 'multiply', marginBottom: '12px' }}
            />
            <p
              className="text-xs leading-loose font-elegant"
              style={{ color: 'var(--navy-dim)' }}
            >
              Joyería en Plata 925<br />y Acero Quirúrgico.<br />Tucumán, Argentina.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <p
              className="text-[8px] tracking-[0.45em] uppercase font-elegant mb-5"
              style={{ color: 'var(--gold)' }}
            >
              Navegación
            </p>
            <nav className="space-y-3">
              {[
                { label: 'Inicio', href: '#inicio' },
                { label: 'Quiénes Somos', href: '#quienes-somos' },
                { label: 'Productos', href: '#productos' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={(e) => {
                    e.preventDefault()
                    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="block text-[11px] tracking-widest font-elegant hover:opacity-60 transition-opacity"
                  style={{ color: 'var(--navy-dim)' }}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contacto */}
          <div>
            <p
              className="text-[8px] tracking-[0.45em] uppercase font-elegant mb-5"
              style={{ color: 'var(--gold)' }}
            >
              Nuestros Locales
            </p>
            <div className="space-y-4">
              {[
                { city: 'San Miguel de Tucumán', detail: 'Local céntrico' },
                { city: 'Yerba Buena', detail: 'Local norte' },
              ].map(({ city, detail }) => (
                <a
                  key={city}
                  href="https://maps.app.goo.gl/82mkmcq633YWZsiq9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 hover:opacity-70 transition-opacity"
                >
                  <MapPin size={12} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p className="text-[11px] font-elegant" style={{ color: 'var(--navy)' }}>
                      {city}
                    </p>
                    <p className="text-[9px] font-elegant" style={{ color: 'var(--navy-dim)' }}>
                      {detail}
                    </p>
                  </div>
                </a>
              ))}

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 mt-2 hover:opacity-70 transition-opacity"
              >
                <Globe size={12} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                <span className="text-[11px] font-elegant" style={{ color: 'var(--navy-dim)' }}>
                  @marcelochavan
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Divisor */}
        <div className="h-px mb-8" style={{ backgroundColor: 'var(--border)' }} />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p
            className="text-[9px] tracking-widest uppercase font-elegant"
            style={{ color: 'var(--navy-xdim)' }}
          >
            © {new Date().getFullYear()} Marcelo Chavan Platería · Tucumán, Argentina
          </p>
          <p
            className="text-[9px] tracking-widest font-elegant"
            style={{ color: 'var(--navy-xdim)' }}
          >
            Plata 925 · Acero Quirúrgico
          </p>
        </div>
      </div>
    </footer>
  )
}
