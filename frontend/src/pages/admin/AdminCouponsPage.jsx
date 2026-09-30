import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

const BLANK = {
  code: '', discount_type: 'percentage', discount_value: '', min_purchase: '',
  max_uses: '', valid_from: '', valid_until: '', active: true,
}

const inputStyle = { border: '1px solid var(--border)', backgroundColor: 'var(--bg-alt)', color: 'var(--navy)' }

function estadoCupon(c, usos) {
  const hoy = new Date().toISOString().slice(0, 10)
  if (!c.active) return { label: 'Pausado', color: 'var(--navy-xdim)' }
  if (c.valid_until && hoy > c.valid_until) return { label: 'Vencido', color: 'var(--navy-xdim)' }
  if (c.valid_from && hoy < c.valid_from) return { label: 'Programado', color: 'var(--navy-dim)' }
  if (c.max_uses && usos >= c.max_uses) return { label: 'Agotado', color: 'var(--navy-xdim)' }
  return { label: 'Activo', color: 'var(--teal)' }
}

function CouponFormModal({ coupon, onClose, onSaved }) {
  const [form, setForm] = useState(
    coupon
      ? {
          code: coupon.code,
          discount_type: coupon.discount_type,
          discount_value: coupon.discount_value,
          min_purchase: coupon.min_purchase ?? '',
          max_uses: coupon.max_uses ?? '',
          valid_from: coupon.valid_from ?? '',
          valid_until: coupon.valid_until ?? '',
          active: coupon.active,
        }
      : BLANK
  )
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const code = form.code.trim().toUpperCase().replace(/\s+/g, '')
    const value = Number(form.discount_value)
    if (code.length < 3) { setError('El código debe tener al menos 3 caracteres.'); return }
    if (!value || value <= 0) { setError('Ingresá un descuento mayor a 0.'); return }
    if (form.discount_type === 'percentage' && value >= 100) { setError('El porcentaje debe ser menor a 100.'); return }
    if (form.valid_from && form.valid_until && form.valid_from > form.valid_until) {
      setError('La fecha "desde" no puede ser posterior a "hasta".'); return
    }

    const payload = {
      code,
      discount_type: form.discount_type,
      discount_value: value,
      min_purchase: form.min_purchase ? Number(form.min_purchase) : null,
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      valid_from: form.valid_from || null,
      valid_until: form.valid_until || null,
      active: form.active,
    }

    setSaving(true)
    const { error: err } = coupon
      ? await supabase.from('coupons').update(payload).eq('id', coupon.id)
      : await supabase.from('coupons').insert(payload)
    setSaving(false)
    if (err) {
      setError(err.code === '23505' ? 'Ya existe un cupón con ese código.' : err.message)
      return
    }
    onSaved()
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(8,58,79,0.55)' }} onClick={onClose} />
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto p-8" style={{ backgroundColor: 'var(--bg)', boxShadow: '0 30px 80px rgba(8,58,79,0.35)' }}>
        <button onClick={onClose} aria-label="Cerrar" className="absolute top-5 right-5 p-1 transition-opacity hover:opacity-60" style={{ color: 'var(--navy)' }}>
          <X size={20} />
        </button>
        <h3 className="font-serif font-light mb-6" style={{ fontSize: '1.4rem', color: 'var(--navy)' }}>
          {coupon ? 'Editar cupón' : 'Nuevo cupón'}
        </h3>

        {error && (
          <p className="font-elegant text-xs mb-4 px-4 py-3" style={{ color: 'var(--teal)', backgroundColor: 'rgba(64,126,140,0.08)' }}>{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Código</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => update('code', e.target.value.toUpperCase())}
              placeholder="Ej: DIADELAMADRE"
              className="w-full px-3 py-2.5 font-elegant text-sm uppercase"
              style={{ ...inputStyle, letterSpacing: '0.1em' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Tipo</label>
              <select value={form.discount_type} onChange={(e) => update('discount_type', e.target.value)} className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle}>
                <option value="percentage">Porcentaje</option>
                <option value="fixed_amount">Monto fijo</option>
              </select>
            </div>
            <div>
              <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>
                Descuento {form.discount_type === 'percentage' ? '(%)' : '($)'}
              </label>
              <input type="number" min="0" value={form.discount_value} onChange={(e) => update('discount_value', e.target.value)} className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Compra mínima ($)</label>
              <input type="number" min="0" value={form.min_purchase} onChange={(e) => update('min_purchase', e.target.value)} className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle} />
              <p className="font-elegant text-[10px] mt-1" style={{ color: 'var(--navy-xdim)' }}>Opcional</p>
            </div>
            <div>
              <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Usos máximos</label>
              <input type="number" min="1" value={form.max_uses} onChange={(e) => update('max_uses', e.target.value)} className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle} />
              <p className="font-elegant text-[10px] mt-1" style={{ color: 'var(--navy-xdim)' }}>Vacío = ilimitado</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Desde</label>
              <input type="date" value={form.valid_from} onChange={(e) => update('valid_from', e.target.value)} className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle} />
            </div>
            <div>
              <label className="block font-elegant mb-1.5 text-xs" style={{ color: 'var(--navy-dim)' }}>Hasta</label>
              <input type="date" value={form.valid_until} onChange={(e) => update('valid_until', e.target.value)} className="w-full px-3 py-2.5 font-elegant text-sm" style={inputStyle} />
            </div>
          </div>

          <label className="flex items-center gap-2 font-elegant text-sm" style={{ color: 'var(--navy-dim)' }}>
            <input type="checkbox" checked={form.active} onChange={(e) => update('active', e.target.checked)} />
            Activo (los clientes lo pueden usar)
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 font-elegant transition-opacity hover:opacity-85 disabled:opacity-50"
            style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', backgroundColor: 'var(--gold)', color: '#fff' }}
          >
            {saving ? 'Guardando...' : coupon ? 'Guardar cambios' : 'Crear cupón'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([])
  const [usosPorCodigo, setUsosPorCodigo] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  async function load() {
    setLoading(true)
    const [{ data: cs, error: cErr }, { data: os }] = await Promise.all([
      supabase.from('coupons').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('coupon_code, coupon_discount').not('coupon_code', 'is', null).neq('status', 'cancelled'),
    ])
    if (cErr) setError(cErr.message)
    else setCoupons(cs)
    const usos = {}
    for (const o of os || []) {
      if (!usos[o.coupon_code]) usos[o.coupon_code] = { count: 0, total: 0 }
      usos[o.coupon_code].count += 1
      usos[o.coupon_code].total += Number(o.coupon_discount)
    }
    setUsosPorCodigo(usos)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(c) {
    if (!confirm(`¿Eliminar el cupón "${c.code}"? Los pedidos que ya lo usaron no se modifican.`)) return
    const { error: err } = await supabase.from('coupons').delete().eq('id', c.id)
    if (err) { setError(err.message); return }
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif font-light" style={{ fontSize: '1.8rem', color: 'var(--navy)' }}>Cupones</h1>
          <p className="font-elegant text-xs mt-1" style={{ color: 'var(--navy-xdim)' }}>
            Códigos de descuento que el cliente ingresa al finalizar la compra. Compartidos entre todos los admins.
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-5 py-2.5 font-elegant transition-opacity hover:opacity-85"
          style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', backgroundColor: 'var(--gold)', color: '#fff' }}
        >
          <Plus size={14} /> Nuevo cupón
        </button>
      </div>

      {error && (
        <p className="font-elegant text-xs mb-4 px-4 py-3" style={{ color: 'var(--teal)', backgroundColor: 'rgba(64,126,140,0.08)' }}>{error}</p>
      )}

      {loading ? (
        <p className="font-elegant text-sm" style={{ color: 'var(--navy-dim)' }}>Cargando...</p>
      ) : coupons.length === 0 ? (
        <p className="font-elegant text-sm" style={{ color: 'var(--navy-dim)' }}>Todavía no hay cupones. Creá el primero con "Nuevo cupón".</p>
      ) : (
        <div style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
          {coupons.map((c) => {
            const usos = usosPorCodigo[c.code] || { count: 0, total: 0 }
            const estado = estadoCupon(c, usos.count)
            const vigencia = c.valid_from || c.valid_until
              ? `${c.valid_from ? new Date(c.valid_from + 'T00:00').toLocaleDateString('es-AR') : '—'} → ${c.valid_until ? new Date(c.valid_until + 'T00:00').toLocaleDateString('es-AR') : '—'}`
              : 'Sin vencimiento'
            return (
              <div key={c.id} className="flex items-center gap-4 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex-1 min-w-0">
                  <p className="font-elegant text-sm" style={{ color: 'var(--navy)', letterSpacing: '0.1em' }}>{c.code}</p>
                  <p className="font-elegant text-xs" style={{ color: 'var(--navy-dim)' }}>
                    {c.discount_type === 'percentage' ? `${Number(c.discount_value)}% off` : `${currency.format(c.discount_value)} off`}
                    {c.min_purchase ? ` · mínimo ${currency.format(c.min_purchase)}` : ''}
                    {' · '}{vigencia}
                  </p>
                </div>
                <p className="font-elegant text-xs w-32 text-right" style={{ color: 'var(--navy-dim)' }}>
                  {usos.count}{c.max_uses ? ` / ${c.max_uses}` : ''} uso(s)
                  {usos.total > 0 && <><br />{currency.format(usos.total)} descontado</>}
                </p>
                <span className="font-elegant text-[10px] px-2 py-1 uppercase w-24 text-center" style={{ color: estado.color, border: `1px solid ${estado.color}` }}>
                  {estado.label}
                </span>
                <button onClick={() => setEditing(c)} aria-label="Editar" className="p-2 transition-opacity hover:opacity-70" style={{ color: 'var(--gold)' }}>
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(c)} aria-label="Eliminar" className="p-2 transition-opacity hover:opacity-70" style={{ color: 'var(--teal)' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {(editing || creating) && (
        <CouponFormModal
          coupon={editing}
          onClose={() => { setEditing(null); setCreating(false) }}
          onSaved={() => { setEditing(null); setCreating(false); load() }}
        />
      )}
    </div>
  )
}
