import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Clock, X } from 'lucide-react'

const CONTENIDO = {
  exito: {
    Icon: CheckCircle2,
    color: 'var(--gold)',
    titulo: '¡Gracias por tu compra!',
    texto: 'Tu pago fue aprobado. Te vamos a contactar para coordinar la entrega.',
  },
  pendiente: {
    Icon: Clock,
    color: 'var(--teal)',
    titulo: 'Pago en proceso',
    texto: 'Tu pago está siendo procesado. Te avisamos apenas se confirme.',
  },
  fallo: {
    Icon: XCircle,
    color: 'var(--teal)',
    titulo: 'No pudimos procesar el pago',
    texto: 'Algo falló con el pago. Podés intentar de nuevo o consultarnos por WhatsApp.',
  },
}

export default function PaymentResultModal() {
  const [resultado, setResultado] = useState(null)
  const [pedidoId, setPedidoId] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const pago = params.get('pago')
    if (pago && CONTENIDO[pago]) {
      setResultado(pago)
      setPedidoId(params.get('pedido'))
      // Limpiamos la URL para que un refresh no vuelva a mostrar el modal.
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  const contenido = resultado ? CONTENIDO[resultado] : null

  return (
    <AnimatePresence>
      {contenido && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(8,58,79,0.6)' }}
            onClick={() => setResultado(null)}
          />

          <motion.div
            className="relative w-full max-w-sm p-8 text-center"
            style={{ backgroundColor: 'var(--bg)', boxShadow: '0 30px 80px rgba(8,58,79,0.35)' }}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setResultado(null)}
              aria-label="Cerrar"
              className="absolute top-4 right-4 p-1 transition-opacity hover:opacity-60"
              style={{ color: 'var(--navy)' }}
            >
              <X size={18} />
            </button>

            <contenido.Icon size={40} className="mx-auto mb-5" style={{ color: contenido.color }} />

            <h3 className="font-serif font-light mb-3" style={{ fontSize: '1.5rem', color: 'var(--navy)' }}>
              {contenido.titulo}
            </h3>
            <p className="font-elegant text-sm mb-2" style={{ color: 'var(--navy-dim)', lineHeight: 1.8 }}>
              {contenido.texto}
            </p>
            {pedidoId && (
              <p className="font-elegant text-xs mt-4" style={{ color: 'var(--navy-xdim)' }}>
                Pedido N° {pedidoId.slice(0, 8)}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
