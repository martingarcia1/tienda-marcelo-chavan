import { useEffect, useState } from 'react'
import { getCatalog } from '../lib/catalog'

export function useCatalog() {
  const [state, setState] = useState({ catalog: null, loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    getCatalog()
      .then((catalog) => { if (!cancelled) setState({ catalog, loading: false, error: null }) })
      .catch((error) => { if (!cancelled) setState({ catalog: null, loading: false, error }) })
    return () => { cancelled = true }
  }, [])

  return state
}

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Marcelo Chavan` : 'Marcelo Chavan · Joyería, Relojería y Platería'
  }, [title])
}
