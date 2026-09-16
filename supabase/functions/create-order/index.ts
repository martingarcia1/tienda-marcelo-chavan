// Crea un pedido validando precios/stock reales contra la base (nunca confía en lo
// que mande el navegador) y, si la forma de pago es Mercado Pago, genera la
// preferencia de Checkout Pro y devuelve la URL de pago.
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN')!
// Mercado Pago siempre devuelve sandbox_init_point e init_point en la
// preferencia, sin importar el tipo de credencial — no hay forma confiable
// de distinguir "modo prueba" a partir de la respuesta. Por eso lo hacemos
// explícito con este secreto: 'true' mientras probamos (usuario/vendedor de
// prueba o token TEST-), 'false' cuando pasemos a producción.
const MP_SANDBOX = (Deno.env.get('MP_SANDBOX') ?? 'true') === 'true'

const DESCUENTO_EFECTIVO = 0.10
const FORMAS_DE_PAGO = ['mercadopago', 'efectivo_local', 'transferencia_local']

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { customer_name, customer_phone, customer_email, payment_method, items } = await req.json()

    if (!customer_name?.trim() || !customer_phone?.trim() || !Array.isArray(items) || items.length === 0) {
      return jsonError('Faltan datos del pedido.', 400)
    }
    if (!FORMAS_DE_PAGO.includes(payment_method)) {
      return jsonError('Forma de pago inválida.', 400)
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    // Precios y stock reales — nunca los que mande el carrito del navegador.
    const productIds = items.map((i: { product_id: string }) => i.product_id)
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('id, name, price, stock, active')
      .in('id', productIds)

    if (prodError) return jsonError('No pudimos validar el carrito.', 500)

    const productById = Object.fromEntries((products ?? []).map((p) => [p.id, p]))
    const orderItems: {
      product_id: string
      product_name_snapshot: string
      unit_price_snapshot: number
      quantity: number
      line_total: number
    }[] = []
    let subtotal = 0

    for (const item of items as { product_id: string; qty: number }[]) {
      const product = productById[item.product_id]
      const qty = Number(item.qty)
      if (!product || !product.active || !Number.isInteger(qty) || qty <= 0) {
        return jsonError('Uno de los productos del carrito ya no está disponible.', 400)
      }
      if (product.stock < qty) {
        return jsonError(`No hay suficiente stock de "${product.name}".`, 400)
      }
      const lineTotal = product.price * qty
      subtotal += lineTotal
      orderItems.push({
        product_id: product.id,
        product_name_snapshot: product.name,
        unit_price_snapshot: product.price,
        quantity: qty,
        line_total: lineTotal,
      })
    }

    const discountAmount = payment_method === 'efectivo_local' ? Math.round(subtotal * DESCUENTO_EFECTIVO) : 0
    const total = subtotal - discountAmount

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: customer_name.trim(),
        customer_phone: customer_phone.trim(),
        customer_email: customer_email?.trim() || null,
        payment_method,
        status: 'pending',
        subtotal,
        discount_amount: discountAmount,
        total,
      })
      .select()
      .single()

    if (orderError || !order) return jsonError('No se pudo crear el pedido.', 500)

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems.map((it) => ({ ...it, order_id: order.id })))

    if (itemsError) return jsonError('No se pudieron guardar los productos del pedido.', 500)

    if (payment_method !== 'mercadopago') {
      return new Response(JSON.stringify({ orderId: order.id, total }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Mercado Pago Checkout Pro
    const origin = req.headers.get('origin') || 'http://localhost:5173'
    const preference: Record<string, unknown> = {
      items: orderItems.map((it) => ({
        title: it.product_name_snapshot,
        quantity: it.quantity,
        unit_price: it.unit_price_snapshot,
        currency_id: 'ARS',
      })),
      external_reference: order.id,
      back_urls: {
        success: `${origin}/?pago=exito&pedido=${order.id}`,
        failure: `${origin}/?pago=fallo&pedido=${order.id}`,
        pending: `${origin}/?pago=pendiente&pedido=${order.id}`,
      },
      notification_url: `${SUPABASE_URL}/functions/v1/mp-webhook`,
    }

    // Mercado Pago exige back_urls.success en https para usar auto_return.
    // En desarrollo local (http://localhost) lo omitimos: el pago funciona
    // igual, solo que no vuelve solo — el usuario hace click para volver.
    if (origin.startsWith('https://')) {
      preference.auto_return = 'approved'
    }

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    })

    const mpData = await mpResponse.json()

    if (!mpResponse.ok) {
      await supabase.from('orders').update({ status: 'cancelled' }).eq('id', order.id)
      console.error('Error creando preferencia MP:', mpData)
      return jsonError('No se pudo iniciar el pago con Mercado Pago.', 502)
    }

    await supabase.from('orders').update({ mp_preference_id: mpData.id }).eq('id', order.id)

    const redirectUrl = MP_SANDBOX ? mpData.sandbox_init_point : mpData.init_point

    return new Response(JSON.stringify({ orderId: order.id, redirectUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return jsonError('Error inesperado procesando el pedido.', 500)
  }
})
