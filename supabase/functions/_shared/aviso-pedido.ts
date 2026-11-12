// Aviso por mail al local cuando entra un pedido confirmado (pago aprobado o
// encargo para pagar en efectivo al retirar). Sale desde una cuenta de Gmail.
//
// Secretos:
//   GMAIL_USER, GMAIL_APP_PASSWORD   cuenta que envía (contraseña de aplicación)
//   PEDIDOS_EMAIL_<LOCAL>            a quién avisar en cada local (uno o varios,
//                                    separados por coma). Sin secreto, no avisa.
import nodemailer from 'npm:nodemailer@6.9.16'
import type { SupabaseClient } from 'npm:@supabase/supabase-js@2'

const pesos = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

const FORMAS_PAGO: Record<string, string> = {
  payway: 'Tarjeta (Payway)',
  mercadopago: 'Mercado Pago',
  efectivo_local: 'Efectivo al retirar',
  transferencia_local: 'Transferencia',
}

// Los datos del cliente vienen del formulario: nunca van al HTML sin escapar.
function esc(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

function destinatarios(localSlug: string): string[] {
  const raw = Deno.env.get(`PEDIDOS_EMAIL_${localSlug.toUpperCase().replace(/-/g, '_')}`) ?? ''
  return raw.split(',').map((e) => e.trim()).filter(Boolean)
}

function fila(label: string, valor: string): string {
  return `<tr><td style="padding:4px 16px 4px 0;color:#7a6f63;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:4px 0;color:#1c1712">${valor}</td></tr>`
}

async function enviar(supabase: SupabaseClient, orderId: string): Promise<void> {
  const user = Deno.env.get('GMAIL_USER')
  const pass = Deno.env.get('GMAIL_APP_PASSWORD')
  if (!user || !pass) return

  const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single()
  if (!order?.local_slug) return
  const to = destinatarios(order.local_slug)
  if (to.length === 0) return

  const { data: items } = await supabase
    .from('order_items')
    .select('product_name_snapshot, unit_price_snapshot, quantity, line_total')
    .eq('order_id', orderId)

  const numero = String(order.id).slice(0, 8)
  const pagado = order.status === 'paid'
  const telefono = String(order.customer_phone ?? '').replace(/\D/g, '')
  const cuotas = Number(order.installments) > 1 ? ` en ${order.installments} cuotas` : ''
  const entrega = order.delivery_method === 'envio'
    ? `Envío a domicilio: ${esc(order.shipping_address)}`
    : `Retiro en ${esc(order.pickup_point ?? 'el local')}`

  const filasItems = (items ?? []).map((it) =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #eee3d6">${esc(it.product_name_snapshot)} <span style="color:#7a6f63">× ${it.quantity}</span></td><td style="padding:8px 0;border-bottom:1px solid #eee3d6;text-align:right;white-space:nowrap">${pesos.format(Number(it.line_total))}</td></tr>`
  ).join('')

  const ajustes = [
    Number(order.coupon_discount) > 0 && ['Cupón ' + esc(order.coupon_code), -Number(order.coupon_discount)],
    Number(order.discount_amount) - Number(order.coupon_discount) > 0 && ['Descuento efectivo', -(Number(order.discount_amount) - Number(order.coupon_discount))],
    Number(order.installments_surcharge) > 0 && ['Recargo cuotas', Number(order.installments_surcharge)],
    Number(order.shipping_cost) > 0 && ['Envío', Number(order.shipping_cost)],
  ].filter(Boolean) as [string, number][]
  const filasAjustes = ajustes.map(([label, monto]) =>
    `<tr><td style="padding:4px 0;color:#7a6f63">${label}</td><td style="padding:4px 0;text-align:right;color:#7a6f63;white-space:nowrap">${monto < 0 ? '− ' : ''}${pesos.format(Math.abs(monto))}</td></tr>`
  ).join('')

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#1c1712;max-width:560px">
  <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#b9814b;margin:0 0 6px">Marcelo Chavan</p>
  <h1 style="font-size:22px;font-weight:normal;margin:0 0 4px">Nuevo pedido N° ${numero}</h1>
  <p style="margin:0 0 20px;color:${pagado ? '#2f7a55' : '#a0661b'}">${pagado ? 'Pago aprobado' : 'Pendiente de pago: abona al retirar'}</p>
  <table style="border-collapse:collapse;margin-bottom:20px">
    ${fila('Cliente', esc(order.customer_name))}
    ${fila('Teléfono', telefono ? `<a href="https://wa.me/${telefono}" style="color:#b9814b">${esc(order.customer_phone)}</a>` : '—')}
    ${order.customer_email ? fila('Email', esc(order.customer_email)) : ''}
    ${fila('Pago', esc(FORMAS_PAGO[order.payment_method] ?? order.payment_method) + cuotas)}
    ${fila('Entrega', entrega)}
  </table>
  <table style="border-collapse:collapse;width:100%">
    ${filasItems}
    ${filasAjustes}
    <tr><td style="padding:12px 0 0;font-size:16px"><strong>Total</strong></td><td style="padding:12px 0 0;text-align:right;font-size:16px;white-space:nowrap"><strong>${pesos.format(Number(order.total))}</strong></td></tr>
  </table>
  <p style="margin:24px 0 0;color:#7a6f63;font-size:12px">Lo encontrás en el panel de administración, en la sección Pedidos.</p>
</div>`

  const transporter = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass } })
  await transporter.sendMail({
    from: `"Marcelo Chavan — Pedidos" <${user}>`,
    to,
    replyTo: /^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/.test(order.customer_email ?? '') ? order.customer_email : undefined,
    subject: `Nuevo pedido N° ${numero} — ${pesos.format(Number(order.total))}`,
    html,
  })
}

// No bloquea ni rompe la compra: el mail sale en segundo plano y, si falla,
// solo queda registrado en los logs de la función.
export function avisarPedido(supabase: SupabaseClient, orderId: string): Promise<void> | void {
  const tarea = enviar(supabase, orderId).catch((err) => console.error('No se pudo enviar el aviso del pedido', orderId, err))
  // deno-lint-ignore no-explicit-any
  const runtime = (globalThis as any).EdgeRuntime
  if (runtime?.waitUntil) runtime.waitUntil(tarea)
  else return tarea
}
