import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        localStorage.setItem('mc_token', token)
        set({ user, token, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('mc_token')
        localStorage.removeItem('mc_user')
        set({ user: null, token: null, isAuthenticated: false })
      },

      isAdmin: () => {
        const state = useAuthStore.getState()
        return state.user?.role === 'admin'
      }
    }),
    {
      name: 'mc_user',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated })
    }
  )
)
