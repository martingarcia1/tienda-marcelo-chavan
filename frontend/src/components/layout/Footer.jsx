import { Globe, MapPin, Phone } from 'lucide-react'
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
              alt="Marcelo Chavan"
              style={{ width: '140px', height: 'auto', mixBlendMode: 'multiply', marginBottom: '12px' }}
            />
            <p
              className="text-xs leading-loose font-elegant"
              style={{ color: 'var(--navy-dim)' }}
            >
              Joyería, relojería y platería<br />desde 1957.<br />Tucumán, Argentina.
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
                { city: 'Galería Áncel · Local 11', detail: 'Muñecas 132/6 · Sede central', direccion: 'Galería Áncel Local 11, Muñecas 132, San Miguel de Tucumán' },
                { city: 'Galería Áncel · Local 9', detail: 'Platería Fina', direccion: 'Galería Áncel Local 9, Muñecas 132, San Miguel de Tucumán' },
                { city: 'Peatonal Mendoza', detail: 'Joyería General · Relojería Japonesa', direccion: 'Peatonal Mendoza, San Miguel de Tucumán' },
              ].map(({ city, detail, direccion }) => (
                <a
                  key={city}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`}
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
                href="https://instagram.com/joyeriamarcelochavan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 mt-2 hover:opacity-70 transition-opacity"
              >
                <Globe size={12} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                <span className="text-[11px] font-elegant" style={{ color: 'var(--navy-dim)' }}>
                  @joyeriamarcelochavan
                </span>
              </a>

              <a
                href="tel:+543814303839"
                className="flex items-center gap-3 hover:opacity-70 transition-opacity"
              >
                <Phone size={12} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                <span className="text-[11px] font-elegant" style={{ color: 'var(--navy-dim)' }}>
                  381 430 3839
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
            © {new Date().getFullYear()} Marcelo Chavan · Tucumán, Argentina
          </p>
          <p
            className="text-[9px] tracking-widest font-elegant"
            style={{ color: 'var(--navy-xdim)' }}
          >
            Joyería · Relojería · Platería · Desde 1957
          </p>
        </div>
      </div>
    </footer>
  )
}
