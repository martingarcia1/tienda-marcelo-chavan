import { Link } from 'react-router-dom'
import logo from '../../assets/logo.jpg'

const PLATA_LINKS = [
  { label: 'Promos',             slug: 'promos' },
  { label: 'Nueva Colección',    slug: 'nueva-coleccion' },
  { label: 'Aros',               slug: 'aros' },
  { label: 'Pulseras',           slug: 'pulseras' },
  { label: 'Conjuntos',          slug: 'conjuntos' },
  { label: 'Anillos',            slug: 'anillos' },
  { label: 'Medallas Religiosas', slug: 'medallas-religiosas' },
]

const ACERO_LINKS = [
  { label: 'Aros',     slug: 'aros-acero' },
  { label: 'Anillos',  slug: 'anillos-acero' },
  { label: 'Pulseras', slug: 'pulseras-acero' },
  { label: 'Cadenas',  slug: 'cadenas-acero' },
]

const INFO_LINKS = [
  { to: '/quienes-somos', label: 'Quiénes somos' },
  { to: '/productores',   label: 'Productores' },
  { to: '/envios',        label: 'Envíos y devoluciones' },
  { to: '/contacto',      label: 'Contacto' },
]

const PAYMENT_METHODS = [
  { icon: '💵', label: 'Efectivo',     detail: '10% de descuento' },
  { icon: '🏦', label: 'Transferencia', detail: 'Mismo precio' },
  { icon: '💳', label: '3 cuotas',     detail: '10% de recargo · Visa · MC · Naranja · American' },
]

function FooterCol({ title, children }) {
  return (
    <div>
      <h6 className="text-gold font-sans font-semibold text-[10px] tracking-[0.2em] uppercase mb-4">
        {title}
      </h6>
      {children}
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="bg-navy text-sand">
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">

        {/* Marca */}
        <div className="col-span-2 md:col-span-4 lg:col-span-1">
          <img src={logo} alt="Marcelo Chavan" className="h-16 w-auto object-contain brightness-0 invert mb-4" />
          <p className="text-sand/50 text-xs leading-relaxed">
            Joyería artesanal en plata y acero.<br />
            Tucumán, Argentina.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" aria-label="Instagram" className="text-sand/40 hover:text-gold transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="text-sand/40 hover:text-gold transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </a>
            <a href="https://wa.me/549" aria-label="WhatsApp" className="text-sand/40 hover:text-gold transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Plata */}
        <FooterCol title="Plata">
          <ul className="flex flex-col gap-2">
            {PLATA_LINKS.map(({ label, slug }) => (
              <li key={slug}>
                <Link
                  to={`/tienda?material=plata&categoria=${slug}`}
                  className="text-xs text-sand/50 hover:text-gold transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterCol>

        {/* Acero */}
        <FooterCol title="Acero">
          <ul className="flex flex-col gap-2">
            {ACERO_LINKS.map(({ label, slug }) => (
              <li key={slug}>
                <Link
                  to={`/tienda?material=acero&categoria=${slug}`}
                  className="text-xs text-sand/50 hover:text-gold transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterCol>

        {/* Info */}
        <FooterCol title="Información">
          <ul className="flex flex-col gap-2">
            {INFO_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-xs text-sand/50 hover:text-gold transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterCol>

        {/* Formas de pago */}
        <FooterCol title="Formas de pago">
          <ul className="flex flex-col gap-3">
            {PAYMENT_METHODS.map(({ icon, label, detail }) => (
              <li key={label} className="flex gap-2">
                <span className="text-base leading-none mt-0.5">{icon}</span>
                <div>
                  <p className="text-xs text-sand/80 font-medium">{label}</p>
                  <p className="text-[11px] text-sand/40 leading-tight">{detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </FooterCol>

      </div>

      {/* Ubicación */}
      <div className="max-w-7xl mx-auto px-6 py-5 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
        <a
          href="https://maps.app.goo.gl/82mkmcq633YWZsiq9"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-sand/40 hover:text-gold transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          Tucumán, Argentina — Ver en el mapa
        </a>
        <p className="text-[11px] text-sand/30">
          © {new Date().getFullYear()} Marcelo Chavan Platería. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
