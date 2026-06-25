import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' }
})

// Interceptor: agrega el JWT automáticamente si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mc_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Interceptor: maneja errores globales
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mc_token')
      localStorage.removeItem('mc_user')
      // El store de auth detectará el cambio
    }
    return Promise.reject(err)
  }
)

// ─── Productos ────────────────────────────────────────────────────────────────
export const productsApi = {
  getAll: (params) => api.get('/api/products', { params }),
  getById: (id) => api.get(`/api/products/${id}`),
  create: (data) => api.post('/api/products', data),
  update: (id, data) => api.put(`/api/products/${id}`, data),
  delete: (id) => api.delete(`/api/products/${id}`)
}

// ─── Categorías ───────────────────────────────────────────────────────────────
export const categoriesApi = {
  getAll: () => api.get('/api/categories')
}

// ─── Pedidos ──────────────────────────────────────────────────────────────────
export const ordersApi = {
  create: (data) => api.post('/api/orders', data),
  getAll: (params) => api.get('/api/orders', { params }),
  getById: (id) => api.get(`/api/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/api/orders/${id}/status`, { status })
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data)
}

// ─── Reseñas ──────────────────────────────────────────────────────────────────
export const reviewsApi = {
  getByProduct: (productId) => api.get(`/api/reviews?productId=${productId}`),
  create: (data) => api.post('/api/reviews', data),
  approve: (id) => api.patch(`/api/reviews/${id}/approve`)
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
export const blogApi = {
  getAll: (params) => api.get('/api/blog', { params }),
  getBySlug: (slug) => api.get(`/api/blog/${slug}`),
  create: (data) => api.post('/api/blog', data),
  update: (id, data) => api.put(`/api/blog/${id}`, data)
}

export default api
