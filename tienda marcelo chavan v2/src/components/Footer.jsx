import { Link } from 'react-router-dom'
import Monogram from './Monogram'
import { LOCALES } from '../lib/locales'
import { whatsappHref, mapsHref } from '../lib/whatsapp'

export default function Footer() {
  return (
    <footer className="relative grain" style={{ backgroundColor: 'var(--ink)', borderTop: '1px solid var(--line)' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-20 pb-10">
        <div className="grid md:grid-cols-12 gap-14 mb-16">
          <div className="md:col-span-4">
            <Monogram size={1.3} />
            <p className="font-sign mt-5" style={{ fontSize: '0.8rem', letterSpacing: '0.4em', color: 'var(--ivory)' }}>MARCELO CHAVAN</p>
            <p className="font-script mt-1" style={{ fontSize: '1.9rem', color: 'var(--copper)' }}>Desde 1957</p>
            <p className="font-sans mt-6 max-w-xs" style={{ fontSize: '0.74rem', lineHeight: 1.9, color: 'var(--ivory-xdim)' }}>
              Joyería, relojería y platería fina. Tradición y confianza de la Familia Siufi en San Miguel de Tucumán.
            </p>
          </div>

          <div className="md:col-span-5">
            <p className="eyebrow mb-6">Nuestros espacios</p>
            <div className="space-y-5">
              {LOCALES.map((l) => (
                <div key={l.slug} className="flex gap-4">
                  <span className="font-serif italic" style={{ color: 'var(--copper)', width: '1.6rem' }}>{l.numero}</span>
                  <div>
                    <Link to={`/espacios/${l.slug}`} className="font-serif link-line" style={{ fontSize: '1.15rem', color: 'var(--ivory)' }}>{l.nombre}</Link>
                    <a href={mapsHref(l.mapsQuery)} target="_blank" rel="noopener noreferrer" className="block font-sans mt-1 transition-opacity hover:opacity-70" style={{ fontSize: '0.7rem', color: 'var(--ivory-xdim)' }}>
                      {l.direccion}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow mb-6">Contacto</p>
            <a href={whatsappHref('Hola! Quiero hacer una consulta.')} target="_blank" rel="noopener noreferrer" className="block font-serif link-line w-fit" style={{ fontSize: '1.3rem', color: 'var(--ivory)' }}>
              381 430 3839
            </a>
            <p className="font-sans mt-2" style={{ fontSize: '0.7rem', color: 'var(--ivory-xdim)' }}>WhatsApp · Lunes a sábados</p>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between gap-3 font-sans" style={{ borderTop: '1px solid var(--line)', fontSize: '0.62rem', letterSpacing: '0.18em', color: 'var(--ivory-xdim)' }}>
          <span>© {new Date().getFullYear()} MARCELO CHAVAN · TUCUMÁN, ARGENTINA</span>
          <span>FAMILIA SIUFI</span>
        </div>
      </div>
    </footer>
  )
}
