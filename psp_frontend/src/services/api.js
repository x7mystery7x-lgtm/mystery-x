import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Add any additional headers if needed
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        await api.post('/auth/refresh')
        // Retry the original request
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, redirect to login or handle logout
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  getMe: () => api.get('/auth/me'),
}

// User Profile
export const userAPI = {
  getProfile: (id) => api.get(`/user/profile/${id}`),
  updateProfile: (data) => api.patch('/user/me/profile', data),
  changePassword: (data) => api.patch('/user/me/password', data),
  deleteAccount: (id) => api.delete(`/user/profile/${id}`),
}

// Address
export const addressAPI = {
  getAddress: () => api.get('/user/me/address'),
  createAddress: (data) => api.post('/user/me/address', data),
  updateAddress: (data) => api.patch('/user/me/address', data),
  deleteAddress: () => api.delete('/user/me/address'),
}

// Payments
export const paymentAPI = {
  getUserPayments: (filters = {}) => api.get('/user/me/payments', { params: filters }),
  getPayment: (id) => api.get(`/user/me/payments/${id}`),
  createPayment: (data) => api.post('/user/me/payments', data),
  createMockPayment: (data) => api.post('/user/me/payments/mock-pay', data),
  getAllPayments: (filters = {}) => api.get('/admin/payments', { params: filters }),
  updatePaymentStatus: (id, data) => api.patch(`/admin/payments/${id}`, data),
}

// Messages
export const messageAPI = {
  getUserMessages: () => api.get('/user/me/messages'),
  sendMessage: (data) => api.post('/user/me/messages', data),
  markAsRead: (id) => api.patch(`/user/me/messages/${id}/read`),
  getAllMessages: (filters = {}) => api.get('/admin/messages', { params: filters }),
  sendAdminMessage: (data) => api.post('/admin/messages', data),
}

// Admin
export const adminAPI = {
  getClients: (filters = {}) => api.get('/admin/clients', { params: filters }),
  getClient: (id) => api.get(`/admin/clients/${id}`),
  updateClient: (id, data) => api.patch(`/admin/clients/${id}`, data),
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
}

// Public
export const publicAPI = {
  getInfo: () => api.get('/public/info'),
  healthCheck: () => api.get('/public/health'),
}

export default api
