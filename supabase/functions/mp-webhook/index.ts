// Recibe el aviso de Mercado Pago y confirma el pago consultando de nuevo su API
// (nunca se confía en el contenido del aviso en sí, podría ser falsificado).
import { createClient } from 'npm:@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN')!

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url)
    let paymentId = url.searchParams.get('data.id') || url.searchParams.get('id')
    let topic = url.searchParams.get('type') || url.searchParams.get('topic')

    if (!paymentId) {
      const body = await req.json().catch(() => null)
      paymentId = body?.data?.id ?? null
      topic = body?.type ?? topic
    }

    // Ignoramos notificaciones que no son de pago (merchant_order, etc.) con 200
    // para que Mercado Pago no las reintente en loop.
    if (topic !== 'payment' || !paymentId) {
      return new Response('ok', { status: 200 })
    }

    const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
    })
    if (!paymentRes.ok) return new Response('ok', { status: 200 })

    const payment = await paymentRes.json()
    const orderId = payment.external_reference
    if (!orderId) return new Response('ok', { status: 200 })

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    const { data: order } = await supabase.from('orders').select('id, status').eq('id', orderId).single()
    if (!order) return new Response('ok', { status: 200 })

    const newStatus =
      payment.status === 'approved' ? 'paid' :
      payment.status === 'rejected' ? 'cancelled' :
      order.status

    if (newStatus !== order.status) {
      await supabase
        .from('orders')
        .update({ status: newStatus, mp_payment_id: String(payment.id) })
        .eq('id', order.id)

      if (newStatus === 'paid') {
        const { data: items } = await supabase
          .from('order_items')
          .select('product_id, quantity')
          .eq('order_id', order.id)

        for (const item of items ?? []) {
          if (!item.product_id) continue
          await supabase.rpc('decrementar_stock', {
            p_product_id: item.product_id,
            p_cantidad: item.quantity,
          })
        }
      }
    }

    return new Response('ok', { status: 200 })
  } catch (err) {
    console.error(err)
    // 200 igual: si devolvemos error, Mercado Pago reintenta en loop.
    return new Response('ok', { status: 200 })
  }
})
