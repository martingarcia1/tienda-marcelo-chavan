import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (product, qty = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, qty: i.qty + qty } : i
              ),
            }
          }
          return {
            items: [
              ...state.items,
              { id: product.id, name: product.name, price: product.price, img: product.img, qty },
            ],
          }
        })
      },

      updateQty: (id, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'mc-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)

export const selectTotalItems = (state) => state.items.reduce((sum, i) => sum + i.qty, 0)
export const selectTotalPrice = (state) => state.items.reduce((sum, i) => sum + i.qty * i.price, 0)
