import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

const ESTADOS = {
  pending: { label: 'Pendiente', color: 'var(--gold)' },
  paid: { label: 'Pagado', color: 'var(--teal)' },
  ready_for_pickup: { label: 'Listo para retirar', color: 'var(--teal)' },
  completed: { label: 'Entregado', color: 'var(--navy-dim)' },
  cancelled: { label: 'Cancelado', color: 'var(--navy-xdim)' },
}

const FORMAS_PAGO = {
  mercadopago: 'Mercado Pago',
  efectivo_local: 'Efectivo (retiro)',
  transferencia_local: 'Transferencia (retiro)',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [itemsByOrder, setItemsByOrder] = useState({})
  const [filter, setFilter] = useState('all')

  async function load() {
    setLoading(true)
    const { data, error: err } = await supabase
      .from('orders')
      .select('id, customer_name, customer_phone, customer_email, payment_method, status, subtotal, discount_amount, coupon_code, coupon_discount, total, created_at')
      .order('created_at', { ascending: false })
    if (err) setError(err.message)
    else setOrders(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function toggleExpand(orderId) {
    if (expanded === orderId) {
      setExpanded(null)
      return
    }
    setExpanded(orderId)
    if (!itemsByOrder[orderId]) {
      const { data } = await supabase
        .from('order_items')
        .select('id, product_name_snapshot, unit_price_snapshot, quantity, line_total')
        .eq('order_id', orderId)
      setItemsByOrder((m) => ({ ...m, [orderId]: data || [] }))
    }
  }

  async function changeStatus(orderId, newStatus) {
    const prev = orders
    setOrders((os) => os.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
    const { error: err } = await supabase.rpc('actualizar_estado_pedido', { p_order_id: orderId, p_status: newStatus })
    if (err) {
      setError(err.message)
      setOrders(prev)
    }
  }

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif font-light" style={{ fontSize: '1.8rem', color: 'var(--navy)' }}>
          Pedidos
        </h1>
      </div>

      {error && (
        <p className="font-elegant text-xs mb-4 px-4 py-3" style={{ color: 'var(--teal)', backgroundColor: 'rgba(64,126,140,0.08)' }}>
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'paid', 'ready_for_pickup', 'completed', 'cancelled'].map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className="px-3 py-1.5 font-elegant text-xs uppercase transition-colors"
            style={{
              letterSpacing: '0.1em',
              border: `1px solid ${filter === key ? 'var(--gold)' : 'var(--border)'}`,
              backgroundColor: filter === key ? 'rgba(165,141,102,0.08)' : 'transparent',
              color: filter === key ? 'var(--gold)' : 'var(--navy-dim)',
            }}
          >
            {key === 'all' ? 'Todos' : ESTADOS[key].label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="font-elegant text-sm" style={{ color: 'var(--navy-dim)' }}>Cargando...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="font-elegant text-sm" style={{ color: 'var(--navy-dim)' }}>No hay pedidos en este estado.</p>
      ) : (
        <div style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
          {filteredOrders.map((o) => {
            const estado = ESTADOS[o.status]
            const isOpen = expanded === o.id
            return (
              <div key={o.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <button
                  onClick={() => toggleExpand(o.id)}
                  className="w-full flex items-center gap-4 px-4 py-3 text-left transition-opacity hover:opacity-80"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-sm truncate" style={{ color: 'var(--navy)' }}>{o.customer_name}</p>
                    <p className="font-elegant text-xs" style={{ color: 'var(--navy-dim)' }}>
                      {o.customer_phone} · {FORMAS_PAGO[o.payment_method]} · {new Date(o.created_at).toLocaleString('es-AR')}
                    </p>
                  </div>

                  <p className="font-elegant text-sm w-28 text-right" style={{ color: 'var(--navy)' }}>
                    {currency.format(o.total)}
                  </p>

                  <span
                    className="font-elegant text-[10px] px-2 py-1 uppercase w-36 text-center"
                    style={{ color: estado.color, border: `1px solid ${estado.color}` }}
                  >
                    {estado.label}
                  </span>

                  {isOpen ? <ChevronUp size={16} style={{ color: 'var(--navy-dim)' }} /> : <ChevronDown size={16} style={{ color: 'var(--navy-dim)' }} />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4">
                    <div className="p-4 mb-3" style={{ backgroundColor: 'var(--bg-alt)' }}>
                      <p className="font-elegant text-xs mb-2" style={{ color: 'var(--navy-dim)' }}>
                        {o.customer_email && <>Email: {o.customer_email}<br /></>}
                        Subtotal: {currency.format(o.subtotal)}
                        {o.coupon_code && <> · Cupón {o.coupon_code}: -{currency.format(o.coupon_discount)}</>}
                        {o.discount_amount - o.coupon_discount > 0 && <> · Efectivo: -{currency.format(o.discount_amount - o.coupon_discount)}</>}
                      </p>
                      <div className="space-y-1 mt-3">
                        {(itemsByOrder[o.id] || []).map((it) => (
                          <p key={it.id} className="font-elegant text-xs" style={{ color: 'var(--navy)' }}>
                            {it.quantity}x {it.product_name_snapshot} — {currency.format(it.line_total)}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {Object.entries(ESTADOS).map(([key, { label }]) => (
                        <button
                          key={key}
                          onClick={() => changeStatus(o.id, key)}
                          disabled={o.status === key}
                          className="px-3 py-1.5 font-elegant text-xs transition-opacity hover:opacity-80 disabled:opacity-40"
                          style={{
                            border: '1px solid var(--border-gold)',
                            color: 'var(--navy)',
                            backgroundColor: o.status === key ? 'rgba(165,141,102,0.12)' : 'transparent',
                          }}
                        >
                          Marcar {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
