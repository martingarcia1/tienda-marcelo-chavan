import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Un carrito por local: cada espacio tendría su propia pasarela de pago, así
// que nunca se mezclan productos de distintos locales en una misma compra.
export const useCartStore = create(
  persist(
    (set) => ({
      carts: {},
      openFor: null,

      openCart: (local) => set({ openFor: local }),
      closeCart: () => set({ openFor: null }),

      addItem: (local, product, qty = 1) =>
        set((state) => {
          const items = state.carts[local] || []
          const existing = items.find((i) => i.id === product.id)
          const next = existing
            ? items.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i))
            : [...items, { id: product.id, slug: product.slug, name: product.name, price: product.price, img: product.img, qty }]
          return { carts: { ...state.carts, [local]: next } }
        }),

      updateQty: (local, id, qty) =>
        set((state) => {
          const items = state.carts[local] || []
          const next = qty <= 0 ? items.filter((i) => i.id !== id) : items.map((i) => (i.id === id ? { ...i, qty } : i))
          return { carts: { ...state.carts, [local]: next } }
        }),

      clearCart: (local) => set((state) => ({ carts: { ...state.carts, [local]: [] } })),
    }),
    { name: 'mc-v2-carts', partialize: (s) => ({ carts: s.carts }) }
  )
)

export const cartCount = (items = []) => items.reduce((n, i) => n + i.qty, 0)
export const cartTotal = (items = []) => items.reduce((n, i) => n + i.qty * i.price, 0)
