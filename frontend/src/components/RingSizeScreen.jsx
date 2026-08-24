import { useState, useEffect } from 'react'

// Estimación de píxeles por milímetro según el tipo de dispositivo (aproximado,
// como en la mayoría de los medidores online — no hay forma de saber la densidad
// de pantalla exacta sin pedirle al usuario que calibre con un objeto físico).
const DISPOSITIVOS = {
  pc: { label: 'PC / Tablet', pxPerMm: 3.8 },
  smartphone: { label: 'Smartphone', pxPerMm: 5.5 },
}

const MIN_TALLE = 1
const MAX_TALLE = 36
const MIN_DIAM = (MIN_TALLE + 40) / Math.PI
const MAX_DIAM = (MAX_TALLE + 40) / Math.PI

function diametroATalle(diametroMm) {
  const talle = Math.round(diametroMm * Math.PI - 40)
  return Math.min(MAX_TALLE, Math.max(MIN_TALLE, talle))
}

const STORAGE_KEY = 'mc_dispositivo'

export default function RingSizeScreen() {
  const [dispositivo, setDispositivo] = useState('pc')
  const [diametroMm, setDiametroMm] = useState(17)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && DISPOSITIVOS[saved]) setDispositivo(saved)
  }, [])

  function cambiarDispositivo(value) {
    setDispositivo(value)
    localStorage.setItem(STORAGE_KEY, value)
  }

  const pxPerMm = DISPOSITIVOS[dispositivo].pxPerMm
  const diametroPx = diametroMm * pxPerMm
  const talle = diametroATalle(diametroMm)
  const fueraDeRango = diametroMm < MIN_DIAM - 0.5 || diametroMm > MAX_DIAM + 0.5

  return (
    <div>
      <p className="font-elegant mb-6" style={{ fontSize: '0.85rem', lineHeight: 1.9, color: 'var(--navy-dim)' }}>
        La talla se calcula por el borde interior del anillo. Colocá el anillo centrado en la
        guía y ajustá el control al tamaño del borde interior.
      </p>

      <div className="flex items-center gap-3 mb-6">
        <label className="font-elegant" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--navy)' }}>
          Seleccioná tu dispositivo
        </label>
        <select
          value={dispositivo}
          onChange={(e) => cambiarDispositivo(e.target.value)}
          className="px-3 py-2 font-elegant text-sm"
          style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }}
        >
          {Object.entries(DISPOSITIVOS).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div
        className="relative mx-auto mb-6 flex items-center justify-center overflow-hidden"
        style={{
          width: '280px',
          height: '280px',
          backgroundImage:
            'linear-gradient(rgba(8,58,79,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(8,58,79,0.08) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        <div className="absolute top-1/2 left-0 right-0 h-px" style={{ backgroundColor: 'var(--teal)' }} />
        <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ backgroundColor: 'var(--teal)' }} />

        <div
          className="relative flex items-center justify-center"
          style={{
            width: `${diametroPx}px`,
            height: `${diametroPx}px`,
            borderRadius: '50%',
            border: '2px solid var(--gold)',
            backgroundColor: 'rgba(165,141,102,0.12)',
          }}
        >
          <span
            className="font-elegant"
            style={{ fontSize: '0.65rem', color: 'var(--navy)', backgroundColor: 'var(--bg)', padding: '1px 5px', borderRadius: '4px' }}
          >
            {diametroMm.toFixed(1)}mm
          </span>
        </div>
      </div>

      <input
        type="range"
        min={(MIN_DIAM - 1).toFixed(1)}
        max={(MAX_DIAM + 1).toFixed(1)}
        step={0.1}
        value={diametroMm}
        onChange={(e) => setDiametroMm(Number(e.target.value))}
        className="w-full mb-4"
        style={{ accentColor: 'var(--gold)' }}
      />

      <div className="py-5 px-6 text-center" style={{ backgroundColor: 'rgba(165,141,102,0.08)', border: '1px solid var(--border-gold)' }}>
        {fueraDeRango ? (
          <p className="font-elegant text-xs" style={{ color: 'var(--teal)' }}>
            Fuera del rango que manejamos — consultanos por WhatsApp.
          </p>
        ) : (
          <>
            <p className="font-elegant" style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)' }}>
              Tu talle estimado
            </p>
            <p className="font-serif" style={{ fontSize: '2rem', color: 'var(--navy)', fontStyle: 'italic' }}>
              N° {talle}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
