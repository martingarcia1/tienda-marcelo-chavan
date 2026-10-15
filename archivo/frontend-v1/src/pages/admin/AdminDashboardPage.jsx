import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
const VENDIDO_STATUSES = ['paid', 'ready_for_pickup', 'completed']
const STOCK_BAJO_UMBRAL = 5

const ESTADOS = {
  pending: 'Pendiente',
  paid: 'Pagado',
  ready_for_pickup: 'Listo para retirar',
  completed: 'Entregado',
  cancelled: 'Cancelado',
}

function startOfDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function StatCard({ label, value, sub }) {
  return (
    <div className="p-5" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
      <p className="font-elegant text-[10px] uppercase mb-2" style={{ letterSpacing: '0.15em', color: 'var(--navy-dim)' }}>
        {label}
      </p>
      <p className="font-serif" style={{ fontSize: '1.6rem', color: 'var(--navy)' }}>{value}</p>
      {sub && <p className="font-elegant text-xs mt-1" style={{ color: 'var(--navy-xdim)' }}>{sub}</p>}
    </div>
  )
}

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([])
  const [items, setItems] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: os }, { data: it }, { data: ps }] = await Promise.all([
        supabase.from('orders').select('id, customer_name, status, total, discount_amount, coupon_code, created_at').order('created_at', { ascending: false }),
        supabase.from('order_items').select('product_name_snapshot, quantity, line_total, order:orders(status)'),
        supabase.from('products').select('id, active, stock'),
      ])
      setOrders(os || [])
      setItems(it || [])
      setProducts(ps || [])
      setLoading(false)
    }
    load()
  }, [])

  const stats = useMemo(() => {
    const hoy = startOfDay(new Date())
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)

    const vendidos = orders.filter((o) => VENDIDO_STATUSES.includes(o.status))
    const vendidosHoy = vendidos.filter((o) => new Date(o.created_at) >= hoy)
    const vendidosMes = vendidos.filter((o) => new Date(o.created_at) >= inicioMes)

    const totalHoy = vendidosHoy.reduce((s, o) => s + Number(o.total), 0)
    const totalMes = vendidosMes.reduce((s, o) => s + Number(o.total), 0)
    const descuentosMes = vendidosMes.reduce((s, o) => s + Number(o.discount_amount || 0), 0)
    const usosCuponMes = vendidosMes.filter((o) => o.coupon_code).length
    const ticketPromedio = vendidosMes.length > 0 ? totalMes / vendidosMes.length : 0

    const porEstado = { pending: 0, paid: 0, ready_for_pickup: 0, completed: 0, cancelled: 0 }
    for (const o of orders) porEstado[o.status] = (porEstado[o.status] || 0) + 1

    // Últimos 14 días
    const dias = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date(hoy)
      d.setDate(d.getDate() - i)
      dias.push(d)
    }
    const serie = dias.map((d) => {
      const next = new Date(d)
      next.setDate(next.getDate() + 1)
      const total = vendidos
        .filter((o) => new Date(o.created_at) >= d && new Date(o.created_at) < next)
        .reduce((s, o) => s + Number(o.total), 0)
      return { fecha: d, total }
    })

    // Más vendido (solo ítems de pedidos vendidos)
    const porProducto = {}
    for (const it of items) {
      if (!VENDIDO_STATUSES.includes(it.order?.status)) continue
      const key = it.product_name_snapshot
      if (!porProducto[key]) porProducto[key] = { nombre: key, cantidad: 0, total: 0 }
      porProducto[key].cantidad += it.quantity
      porProducto[key].total += Number(it.line_total)
    }
    const masVendido = Object.values(porProducto).sort((a, b) => b.cantidad - a.cantidad).slice(0, 5)

    const activos = products.filter((p) => p.active).length
    const ocultos = products.filter((p) => !p.active).length
    const sinStock = products.filter((p) => p.active && p.stock === 0).length
    const stockBajo = products.filter((p) => p.active && p.stock > 0 && p.stock <= STOCK_BAJO_UMBRAL).length

    return {
      totalHoy, totalMes, ticketPromedio, descuentosMes, usosCuponMes,
      pedidosHoy: vendidosHoy.length, pedidosMes: vendidosMes.length,
      porEstado, serie, masVendido, activos, ocultos, sinStock, stockBajo,
    }
  }, [orders, items, products])

  if (loading) {
    return (
      <div className="p-8">
        <p className="font-elegant text-sm" style={{ color: 'var(--navy-dim)' }}>Cargando...</p>
      </div>
    )
  }

  const maxSerie = Math.max(...stats.serie.map((d) => d.total), 1)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif font-light" style={{ fontSize: '1.8rem', color: 'var(--navy)' }}>
          Tablero
        </h1>
        <p className="font-elegant text-xs mt-1" style={{ color: 'var(--navy-xdim)' }}>
          Cómo viene el negocio, de un vistazo.
        </p>
      </div>

      {/* Fila 1: ventas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard label="Vendido hoy" value={currency.format(stats.totalHoy)} sub={`${stats.pedidosHoy} pedido(s)`} />
        <StatCard label="Este mes" value={currency.format(stats.totalMes)} sub={`${stats.pedidosMes} pedido(s)`} />
        <StatCard label="Ticket promedio" value={currency.format(stats.ticketPromedio)} />
        <StatCard label="Descuentos dados" value={currency.format(stats.descuentosMes)} sub={`este mes · ${stats.usosCuponMes} uso(s) de cupón`} />
      </div>

      {/* Fila 2: estados de pedidos */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {Object.entries(ESTADOS).map(([key, label]) => (
          <div key={key} className="p-4 text-center" style={{ backgroundColor: 'var(--bg-alt)', border: '1px solid var(--border)' }}>
            <p className="font-elegant text-[10px] uppercase mb-1" style={{ letterSpacing: '0.1em', color: 'var(--navy-dim)' }}>{label}</p>
            <p className="font-serif" style={{ fontSize: '1.3rem', color: 'var(--navy)' }}>{stats.porEstado[key]}</p>
          </div>
        ))}
      </div>

      {/* Gráfico */}
      <div className="p-6 mb-8" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
        <p className="font-serif mb-4" style={{ fontSize: '1.1rem', color: 'var(--navy)' }}>Ventas de los últimos 14 días</p>
        <div className="flex items-end gap-2" style={{ height: '140px' }}>
          {stats.serie.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full" title={`${d.fecha.toLocaleDateString('es-AR')}: ${currency.format(d.total)}`}>
              <div
                className="w-full transition-opacity hover:opacity-70"
                style={{
                  height: `${Math.max((d.total / maxSerie) * 100, d.total > 0 ? 4 : 1)}%`,
                  backgroundColor: d.total > 0 ? 'var(--gold)' : 'var(--border)',
                }}
              />
              <span className="font-elegant mt-1" style={{ fontSize: '0.55rem', color: 'var(--navy-xdim)' }}>
                {d.fecha.getDate()}/{d.fecha.getMonth() + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Últimos pedidos */}
        <div className="p-6" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="font-serif" style={{ fontSize: '1.1rem', color: 'var(--navy)' }}>Últimos pedidos</p>
            <Link to="/admin/pedidos" className="font-elegant text-xs transition-opacity hover:opacity-70" style={{ color: 'var(--teal)' }}>
              Ver todos
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="font-elegant text-xs" style={{ color: 'var(--navy-xdim)' }}>Todavía no hay pedidos.</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center justify-between">
                  <p className="font-elegant text-xs" style={{ color: 'var(--navy)' }}>{o.customer_name}</p>
                  <div className="flex items-center gap-3">
                    <span className="font-elegant text-xs" style={{ color: 'var(--navy-dim)' }}>{currency.format(o.total)}</span>
                    <span className="font-elegant text-[10px] px-2 py-0.5 uppercase" style={{ color: 'var(--gold)', border: '1px solid var(--border-gold)' }}>
                      {ESTADOS[o.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lo más vendido */}
        <div className="p-6" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
          <p className="font-serif mb-4" style={{ fontSize: '1.1rem', color: 'var(--navy)' }}>Lo más vendido</p>
          {stats.masVendido.length === 0 ? (
            <p className="font-elegant text-xs" style={{ color: 'var(--navy-xdim)' }}>Sin ventas confirmadas todavía.</p>
          ) : (
            <div className="space-y-3">
              {stats.masVendido.map((p) => (
                <div key={p.nombre} className="flex items-center justify-between">
                  <p className="font-elegant text-xs" style={{ color: 'var(--navy)' }}>{p.nombre}</p>
                  <p className="font-elegant text-xs" style={{ color: 'var(--navy-dim)' }}>{p.cantidad} u. · {currency.format(p.total)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Catálogo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Productos activos" value={stats.activos} />
        <StatCard label="Ocultos" value={stats.ocultos} />
        <StatCard label="Sin stock" value={stats.sinStock} />
        <StatCard label="Stock bajo" value={stats.stockBajo} />
      </div>
    </div>
  )
}
