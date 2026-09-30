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

// Misma lógica que frontend/src/lib/pricing.js — si el producto tiene una
// oferta vigente hoy, ese es el precio real a cobrar, no el de lista.
function precioConOferta(product: {
  price: number
  discount_type: string | null
  discount_value: number | null
  discount_from: string | null
  discount_until: string | null
}): number {
  const hoy = new Date().toISOString().slice(0, 10)
  if (!product.discount_type || !product.discount_value) return product.price
  if (product.discount_from && hoy < product.discount_from) return product.price
  if (product.discount_until && hoy > product.discount_until) return product.price
  if (product.discount_type === 'percentage') {
    return Math.max(0, Math.round(product.price * (1 - product.discount_value / 100)))
  }
  if (product.discount_type === 'fixed_amount') {
    return Math.max(0, product.price - product.discount_value)
  }
  return product.price
}

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
    const { customer_name, customer_phone, customer_email, payment_method, items, coupon_code, dry_run } = await req.json()

    // dry_run: solo calcula totales (para mostrar el cupón aplicado en el checkout)
    // sin crear el pedido, así que no exige nombre/teléfono.
    if (!Array.isArray(items) || items.length === 0) {
      return jsonError('Faltan datos del pedido.', 400)
    }
    if (!dry_run && (!customer_name?.trim() || !customer_phone?.trim())) {
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
      .select('id, name, price, stock, active, discount_type, discount_value, discount_from, discount_until')
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
      const unitPrice = precioConOferta(product)
      const lineTotal = unitPrice * qty
      subtotal += lineTotal
      orderItems.push({
        product_id: product.id,
        product_name_snapshot: product.name,
        unit_price_snapshot: unitPrice,
        quantity: qty,
        line_total: lineTotal,
      })
    }

    // Cupón: se aplica sobre el subtotal (ya con ofertas); el 10% de efectivo
    // se calcula después, sobre lo que queda.
    let couponCode: string | null = null
    let couponDiscount = 0
    const codigoIngresado = typeof coupon_code === 'string' ? coupon_code.trim().toUpperCase() : ''

    if (codigoIngresado) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('code, discount_type, discount_value, min_purchase, max_uses, valid_from, valid_until, active')
        .eq('code', codigoIngresado)
        .maybeSingle()

      const hoy = new Date().toISOString().slice(0, 10)
      if (!coupon || !coupon.active) return jsonError('El cupón no existe o no está activo.', 400)
      if (coupon.valid_from && hoy < coupon.valid_from) return jsonError('El cupón todavía no está vigente.', 400)
      if (coupon.valid_until && hoy > coupon.valid_until) return jsonError('El cupón está vencido.', 400)
      if (coupon.min_purchase && subtotal < coupon.min_purchase) {
        return jsonError(`El cupón requiere una compra mínima de $${Number(coupon.min_purchase).toLocaleString('es-AR')}.`, 400)
      }
      if (coupon.max_uses) {
        const { count } = await supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('coupon_code', coupon.code)
          .neq('status', 'cancelled')
        if ((count ?? 0) >= coupon.max_uses) return jsonError('El cupón ya alcanzó su límite de usos.', 400)
      }

      couponDiscount = coupon.discount_type === 'percentage'
        ? Math.round(subtotal * Number(coupon.discount_value) / 100)
        : Math.min(Number(coupon.discount_value), subtotal)
      couponCode = coupon.code
    }

    const afterCoupon = subtotal - couponDiscount
    const efectivoDiscount = payment_method === 'efectivo_local' ? Math.round(afterCoupon * DESCUENTO_EFECTIVO) : 0
    const discountAmount = couponDiscount + efectivoDiscount
    const total = subtotal - discountAmount

    if (dry_run) {
      return new Response(JSON.stringify({ subtotal, couponCode, couponDiscount, efectivoDiscount, total }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

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
        coupon_code: couponCode,
        coupon_discount: couponDiscount,
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
    // Mercado Pago no acepta ítems negativos: si hay descuento, se cobra un
    // único ítem por el total ya descontado.
    const mpItems = discountAmount > 0
      ? [{
          title: `Pedido Marcelo Chavan N° ${order.id.slice(0, 8)}${couponCode ? ` (cupón ${couponCode})` : ''}`,
          quantity: 1,
          unit_price: total,
          currency_id: 'ARS',
        }]
      : orderItems.map((it) => ({
          title: it.product_name_snapshot,
          quantity: it.quantity,
          unit_price: it.unit_price_snapshot,
          currency_id: 'ARS',
        }))

    const preference: Record<string, unknown> = {
      items: mpItems,
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
