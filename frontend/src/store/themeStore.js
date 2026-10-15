import { create } from 'zustand'

const KEY = 'mc-theme'

function readStored() {
  try {
    return localStorage.getItem(KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

function apply(theme) {
  if (theme === 'light') document.documentElement.dataset.theme = 'light'
  else delete document.documentElement.dataset.theme
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', theme === 'light' ? '#f6f1e9' : '#0c0a08')
}

// El tema inicial ya lo aplicó el script de index.html antes de dibujar la
// página; acá solo se sincroniza el estado y se guarda cada cambio.
export const useThemeStore = create((set, get) => ({
  theme: readStored(),
  toggle: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    apply(next)
    try { localStorage.setItem(KEY, next) } catch { /* modo privado: solo esta visita */ }
    set({ theme: next })
  },
}))
