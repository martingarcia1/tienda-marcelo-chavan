import { useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Ruler, Printer, Monitor } from 'lucide-react'
import RingSizeScreen from './RingSizeScreen'

const RingSize3D = lazy(() => import('./RingSize3D'))

/*
 * Fórmula validada contra la varilla medidora física de la joyería y contra su
 * guía impresa de círculos (15 puntos de datos, coinciden exactamente):
 *   circunferencia_mm = talle + 40
 *   circunferencia_mm = diámetro_mm × π
 * → talle = round(diámetro_mm × π − 40)
 * La varilla cubre del talle 1 (≈13.05mm de diámetro) al talle 36 (≈24.2mm).
 */
const MIN_TALLE = 1
const MAX_TALLE = 36
const MIN_DIAM = (MIN_TALLE + 40) / Math.PI
const MAX_DIAM = (MAX_TALLE + 40) / Math.PI

function diametroATalle(diametroMm) {
  const talle = Math.round(diametroMm * Math.PI - 40)
  return Math.min(MAX_TALLE, Math.max(MIN_TALLE, talle))
}

// Tabla de conversión internacional (ESP = España, no Argentina — por eso la
// columna AR se calcula acá con la fórmula validada contra la varilla real,
// en vez de copiarla de la fuente).
const TABLA_INTERNACIONAL = [
  { mm: 14.0, esp: 4, us: '3', uk: 'F', ger: '44 (14.0)', fr: '44', it: '4', jp: '4' },
  { mm: 14.5, esp: 5, us: '3.5', uk: 'G', ger: 'N/A', fr: 'N/A', it: '5,5', jp: '5' },
  { mm: 15.0, esp: 7, us: '4', uk: 'H', ger: '47 (15.0)', fr: '46.5', it: '7', jp: '7' },
  { mm: 15.3, esp: 8, us: '4.5', uk: 'I', ger: '48 (15.3)', fr: '48', it: '8', jp: '8' },
  { mm: 15.6, esp: 9, us: '5', uk: 'J', ger: '49 (15.6)', fr: '49.5', it: '9', jp: '9' },
  { mm: 16.2, esp: 10, us: '5.5', uk: 'K', ger: '51 (16.2)', fr: '50.5', it: '10', jp: '10' },
  { mm: 16.6, esp: 11, us: '6', uk: 'L', ger: '52 (16.6)', fr: '52', it: '11', jp: '11' },
  { mm: 16.9, esp: 12, us: '6.5', uk: 'M', ger: '53 (16.9)', fr: '53', it: '12,5', jp: '13' },
  { mm: 17.2, esp: 13, us: '7', uk: 'N', ger: '54 (17.2)', fr: '54.5', it: '14', jp: '14' },
  { mm: 17.8, esp: 14, us: '7.5', uk: 'O', ger: '56 (17.8)', fr: '55.5', it: '15', jp: '15' },
  { mm: 18.1, esp: 15, us: '8', uk: 'P', ger: '57 (18.1)', fr: '57', it: '16', jp: '16' },
  { mm: 18.5, esp: 16, us: '8.5', uk: 'Q', ger: '58 (18.5)', fr: '58', it: '17,5', jp: '17' },
  { mm: 19.1, esp: 17, us: '9', uk: 'R', ger: '60 (19.1)', fr: '59.5', it: '19', jp: '18' },
  { mm: 19.4, esp: 18, us: '9.5', uk: 'S', ger: '61 (19.4)', fr: '61', it: '20', jp: '19' },
  { mm: 19.7, esp: 19, us: '10', uk: 'T', ger: '62 (19.7)', fr: '62', it: '21,5', jp: '20' },
  { mm: 20.4, esp: 20, us: '10.5', uk: 'U', ger: '64 (20.4)', fr: '63.5', it: '23', jp: '22' },
  { mm: 20.7, esp: 21, us: '11', uk: 'V', ger: '65 (20.7)', fr: '64.5', it: '24', jp: '23' },
  { mm: 21.0, esp: 22, us: '11.5', uk: 'W', ger: '66 (21.0)', fr: '66', it: '25', jp: '24' },
  { mm: 21.6, esp: 23, us: '12', uk: 'X', ger: '68 (21.6)', fr: '67', it: '26,5', jp: '25' },
  { mm: 22.0, esp: 24, us: '12.5', uk: 'Y', ger: '69 (22.0)', fr: '68.5', it: '28', jp: '26' },
  { mm: 22.3, esp: 25, us: '13', uk: 'Z', ger: '70 (22.3)', fr: '69.5', it: '28,5', jp: '27' },
  { mm: 22.9, esp: 26, us: '13.5', uk: 'Z+2', ger: '72 (22.9)', fr: '71', it: '32', jp: 'N/A' },
  { mm: 23.2, esp: 27, us: '14', uk: 'Z+3', ger: '73 (23.2)', fr: '72.5', it: '33', jp: 'N/A' },
  { mm: 23.6, esp: 28, us: '14.5', uk: 'Z+4', ger: '74 (23.6)', fr: '73.5', it: 'N/A', jp: 'N/A' },
]

const TABS = [
  { key: 'calculadora', label: 'Calculadora', icon: Ruler },
  { key: 'pantalla', label: 'Ajustar en pantalla', icon: Monitor },
  { key: 'imprimir', label: 'Guía para imprimir', icon: Printer },
]

export default function RingSizeGuide({ open, onClose }) {
  const [tab, setTab] = useState('calculadora')
  const [diametro, setDiametro] = useState('')
  const [resultado, setResultado] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  function handleCalcular(e) {
    e.preventDefault()
    const mm = parseFloat(diametro.replace(',', '.'))
    if (!mm || Number.isNaN(mm)) {
      setErrorMsg('Ingresá un número válido en milímetros.')
      setResultado(null)
      return
    }
    if (mm < MIN_DIAM - 0.5 || mm > MAX_DIAM + 0.5) {
      setErrorMsg(
        `Ese diámetro está fuera del rango que manejamos (entre ${MIN_DIAM.toFixed(1)} y ${MAX_DIAM.toFixed(1)}mm). Volvé a medir o consultanos por WhatsApp.`
      )
      setResultado(null)
      return
    }
    setErrorMsg('')
    setResultado(diametroATalle(mm))
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 no-print"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(8,58,79,0.55)' }}
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: 'var(--bg)', boxShadow: '0 30px 80px rgba(8,58,79,0.35)' }}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute top-5 right-5 p-1 transition-opacity hover:opacity-60 z-10"
              style={{ color: 'var(--navy)' }}
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-12">
              <p
                className="font-elegant mb-2"
                style={{ fontSize: '0.6rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--gold)' }}
              >
                Ayuda
              </p>
              <h3
                className="font-serif font-light mb-8"
                style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', color: 'var(--navy)' }}
              >
                Guía de talles de anillos
              </h3>

              {/* Selector de pestañas */}
              <div className="flex gap-2 mb-10 no-print">
                {TABS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className="flex items-center gap-2 px-5 py-2.5 font-elegant transition-all duration-250"
                    style={
                      tab === key
                        ? { backgroundColor: 'var(--gold)', color: '#FAFAF8', border: '1px solid var(--gold)' }
                        : { backgroundColor: 'transparent', color: 'var(--navy-dim)', border: '1px solid var(--border)' }
                    }
                  >
                    <Icon size={13} />
                    <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{label}</span>
                  </button>
                ))}
              </div>

              {tab === 'calculadora' && (
                <div className="grid md:grid-cols-12 gap-10 items-center">
                  <div className="md:col-span-7">
                    <p className="font-elegant mb-6" style={{ fontSize: '0.85rem', lineHeight: 1.9, color: 'var(--navy-dim)' }}>
                      Con una regla, medí el <strong style={{ color: 'var(--navy)' }}>diámetro interno</strong> (de
                      borde a borde, por dentro) de un anillo que te quede bien, en milímetros:
                    </p>

                    <form onSubmit={handleCalcular} className="flex gap-3 mb-4">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={diametro}
                        onChange={(e) => setDiametro(e.target.value)}
                        placeholder="Ej: 17.4"
                        className="flex-1 px-4 py-3 font-elegant text-sm"
                        style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }}
                      />
                      <span className="flex items-center font-elegant text-sm" style={{ color: 'var(--navy-dim)' }}>mm</span>
                      <button
                        type="submit"
                        className="px-6 font-elegant transition-opacity hover:opacity-85"
                        style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', backgroundColor: 'var(--gold)', color: '#fff' }}
                      >
                        Calcular
                      </button>
                    </form>

                    {errorMsg && (
                      <p className="font-elegant text-xs mb-4" style={{ color: 'var(--teal)' }}>{errorMsg}</p>
                    )}

                    {resultado && (
                      <div className="py-5 px-6" style={{ backgroundColor: 'rgba(165,141,102,0.08)', border: '1px solid var(--border-gold)' }}>
                        <p className="font-elegant" style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)' }}>
                          Tu talle estimado
                        </p>
                        <p className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--navy)', fontStyle: 'italic' }}>
                          N° {resultado}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-5 flex items-center justify-center">
                    <Suspense
                      fallback={
                        <p className="font-elegant text-xs" style={{ color: 'var(--navy-dim)' }}>
                          Cargando escena 3D...
                        </p>
                      }
                    >
                      <RingSize3D talle={resultado} minTalle={MIN_TALLE} maxTalle={MAX_TALLE} />
                    </Suspense>
                  </div>
                </div>
              )}

              {tab === 'pantalla' && <RingSizeScreen />}

              {tab === 'imprimir' && (
                <div>
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-3 no-print">
                    <p className="font-elegant" style={{ fontSize: '0.85rem', lineHeight: 1.8, color: 'var(--navy-dim)', maxWidth: '32rem' }}>
                      Tabla de equivalencias entre el <strong style={{ color: 'var(--gold)' }}>talle argentino</strong>{' '}
                      (el que usamos acá, calculado con la misma fórmula que la calculadora) y los
                      sistemas de España, Estados Unidos, Reino Unido, Alemania, Francia, Italia y Japón.
                    </p>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-2 px-6 py-2.5 font-elegant transition-opacity hover:opacity-85 flex-shrink-0"
                      style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', backgroundColor: 'var(--navy)', color: '#fff' }}
                    >
                      <Printer size={14} />
                      Imprimir tabla
                    </button>
                  </div>

                  <div className="print-area overflow-x-auto">
                    <table className="w-full font-elegant" style={{ fontSize: '0.72rem', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--bg-alt)' }}>
                          {['mm', 'AR', 'ESP', 'US', 'UK', 'GER', 'FR', 'IT', 'JP'].map((h) => (
                            <th
                              key={h}
                              className="px-3 py-2 text-center"
                              style={{ color: 'var(--navy)', borderBottom: '1px solid var(--border-gold)', letterSpacing: '0.1em' }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {TABLA_INTERNACIONAL.map((row, i) => (
                          <tr key={row.mm} style={{ backgroundColor: i % 2 ? 'var(--bg-alt)' : 'transparent' }}>
                            <td className="px-3 py-2 text-center" style={{ color: 'var(--navy-dim)' }}>{row.mm}</td>
                            <td className="px-3 py-2 text-center" style={{ color: 'var(--gold)', fontWeight: 600 }}>
                              N° {diametroATalle(row.mm)}
                            </td>
                            <td className="px-3 py-2 text-center" style={{ color: 'var(--navy-dim)' }}>{row.esp}</td>
                            <td className="px-3 py-2 text-center" style={{ color: 'var(--navy-dim)' }}>{row.us}</td>
                            <td className="px-3 py-2 text-center" style={{ color: 'var(--navy-dim)' }}>{row.uk}</td>
                            <td className="px-3 py-2 text-center" style={{ color: 'var(--navy-dim)' }}>{row.ger}</td>
                            <td className="px-3 py-2 text-center" style={{ color: 'var(--navy-dim)' }}>{row.fr}</td>
                            <td className="px-3 py-2 text-center" style={{ color: 'var(--navy-dim)' }}>{row.it}</td>
                            <td className="px-3 py-2 text-center" style={{ color: 'var(--navy-dim)' }}>{row.jp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
