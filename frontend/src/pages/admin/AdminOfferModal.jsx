import { useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { precioFinal } from '../../lib/pricing'

const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

export default function AdminOfferModal({ product, onClose, onSaved }) {
  const [discountType, setDiscountType] = useState(product.discount_type || 'percentage')
  const [discountValue, setDiscountValue] = useState(product.discount_value ?? '')
  const [label, setLabel] = useState(product.discount_label || '')
  const [from, setFrom] = useState(product.discount_from || '')
  const [until, setUntil] = useState(product.discount_until || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const tieneOfertaActual = !!product.discount_type

  const valorNumerico = Number(discountValue) || 0
  const preview = valorNumerico > 0
    ? precioFinal({ price: product.price, discount_type: discountType, discount_value: valorNumerico, discount_from: null, discount_until: null })
    : product.price

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    if (!valorNumerico || valorNumerico <= 0) {
      setError('Ingresá un descuento mayor a 0.')
      return
    }
    if (discountType === 'percentage' && valorNumerico >= 100) {
      setError('El porcentaje debe ser menor a 100.')
      return
    }
    if (discountType === 'fixed_amount' && valorNumerico >= product.price) {
      setError('El descuento no puede ser mayor o igual al precio de lista.')
      return
    }

    setSaving(true)
    const { error: err } = await supabase
      .from('products')
      .update({
        discount_type: discountType,
        discount_value: valorNumerico,
        discount_label: label.trim() || null,
        discount_from: from || null,
        discount_until: until || null,
      })
      .eq('id', product.id)
    setSaving(false)
    if (err) { setError(err.message); return }
    onSaved()
  }

  async function handleRemove() {
    setSaving(true)
    const { error: err } = await supabase
      .from('products')
      .update({ discount_type: null, discount_value: null, discount_label: null, discount_from: null, discount_until: null })
      .eq('id', product.id)
    setSaving(false)
    if (err) { setError(err.message); return }
    onSaved()
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(8,58,79,0.55)' }} onClick={onClose} />

      <div
        className="relative w-full max-w-md p-8"
        style={{ backgroundColor: 'var(--bg)', boxShadow: '0 30px 80px rgba(8,58,79,0.35)' }}
      >
        <button onClick={onClose} aria-label="Cerrar" className="absolute top-5 right-5 p-1 transition-opacity hover:opacity-60" style={{ color: 'var(--navy)' }}>
          <X size={20} />
        </button>

        <h3 className="font-serif font-light mb-1" style={{ fontSize: '1.4rem', color: 'var(--navy)' }}>
          Oferta
        </h3>
        <p className="font-elegant text-sm mb-1" style={{ color: 'var(--navy)' }}>{product.name}</p>
        <p className="font-elegant text-xs mb-6" style={{ color: 'var(--navy-dim)' }}>
          Precio de lista: {currency.format(product.price)}
        </p>

        {error && (
          <p className="font-elegant text-xs mb-4 px-4 py-3" style={{ color: 'var(--teal)', backgroundColor: 'rgba(64,126,140,0.08)' }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Definir por</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full px-3 py-2.5 font-elegant text-sm"
                style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }}
              >
                <option value="percentage">Porcentaje de descuento</option>
                <option value="fixed_amount">Monto fijo de descuento</option>
              </select>
            </div>
            <div>
              <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>
                Descuento {discountType === 'percentage' ? '(%)' : '($)'}
              </label>
              <input
                type="number"
                min="0"
                step={discountType === 'percentage' ? '1' : '0.01'}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full px-3 py-2.5 font-elegant text-sm"
                style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }}
              />
            </div>
          </div>

          <div>
            <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Etiqueta</label>
            <input
              type="text"
              placeholder={discountType === 'percentage' && valorNumerico > 0 ? `${valorNumerico}% OFF` : 'Se calcula sola si la dejás vacía'}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2.5 font-elegant text-sm"
              style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }}
            />
            <p className="font-elegant text-[10px] mt-1" style={{ color: 'var(--navy-xdim)' }}>Se muestra en la tarjeta. Si la dejás vacía, se calcula sola.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Desde</label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full px-3 py-2.5 font-elegant text-sm"
                style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }}
              />
              <p className="font-elegant text-[10px] mt-1" style={{ color: 'var(--navy-xdim)' }}>Opcional</p>
            </div>
            <div>
              <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Hasta</label>
              <input
                type="date"
                value={until}
                onChange={(e) => setUntil(e.target.value)}
                className="w-full px-3 py-2.5 font-elegant text-sm"
                style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }}
              />
              <p className="font-elegant text-[10px] mt-1" style={{ color: 'var(--navy-xdim)' }}>Opcional</p>
            </div>
          </div>

          {valorNumerico > 0 && (
            <p className="font-elegant text-xs px-4 py-3" style={{ color: 'var(--teal)', backgroundColor: 'rgba(64,126,140,0.08)' }}>
              El cliente paga {currency.format(preview)} en lugar de {currency.format(product.price)}. Ahorra {currency.format(product.price - preview)}.
            </p>
          )}

          <div className="flex items-center gap-3 pt-2">
            {tieneOfertaActual && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={saving}
                className="px-4 py-3 font-elegant transition-opacity hover:opacity-85 disabled:opacity-50"
                style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--teal)', border: '1px solid var(--teal)' }}
              >
                Quitar oferta
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 font-elegant transition-opacity hover:opacity-85"
              style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--navy-dim)', border: '1px solid var(--border)' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 font-elegant transition-opacity hover:opacity-85 disabled:opacity-50"
              style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', backgroundColor: 'var(--gold)', color: '#fff' }}
            >
              {saving ? 'Guardando...' : 'Guardar oferta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
