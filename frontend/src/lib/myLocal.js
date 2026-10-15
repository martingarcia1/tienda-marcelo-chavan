import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { getLocal } from './locales'
import { useAuthStore } from '../store/authStore'

// Local del admin logueado (según la tabla `locales`). null si la cuenta no
// es dueña de ningún local (por ejemplo, la cuenta de soporte).
export function useMyLocal() {
  const user = useAuthStore((s) => s.user)
  const [state, setState] = useState({ local: null, loading: true })

  useEffect(() => {
    if (!user) return
    let cancelled = false
    supabase
      .from('locales')
      .select('slug, modo_compra, payment_provider')
      .eq('owner_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return
        setState({ local: data ? { ...getLocal(data.slug), ...data } : null, loading: false })
      })
    return () => { cancelled = true }
  }, [user])

  return state
}

// Filtro de pedidos para el panel: los del local del admin más los pedidos
// anteriores a la división por locales (sin local asignado).
export function filtrarPorLocal(query, local) {
  return local ? query.or(`local_slug.eq.${local.slug},local_slug.is.null`) : query
}
