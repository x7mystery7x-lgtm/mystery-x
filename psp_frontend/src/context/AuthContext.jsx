import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

export const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('psp_user')
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated on app load
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const storedUser = localStorage.getItem('psp_user')
      if (storedUser) {
        // Verify session is still valid and fetch full user data
        const res = await api.get('/auth/me')
        if (res.data && res.data.user) {
          const u = {
            id: res.data.user._id,
            role: res.data.user.role,
            name: res.data.user.name,
            email: res.data.user.email
          }
          setUser(u)
        } else {
          // Session invalid, clear localStorage
          localStorage.removeItem('psp_user')
          setUser(null)
        }
      }
    } catch (error) {
      // Try to refresh token
      try {
        await api.post('/auth/refresh')
        // If refresh succeeds, try to get user data again
        const res = await api.get('/auth/me')
        if (res.data && res.data.user) {
          const u = {
            id: res.data.user._id,
            role: res.data.user.role,
            name: res.data.user.name,
            email: res.data.user.email
          }
          setUser(u)
        } else {
          localStorage.removeItem('psp_user')
          setUser(null)
        }
      } catch (refreshError) {
        // Refresh failed, clear session
        localStorage.removeItem('psp_user')
        setUser(null)
      }
    } finally {
      setLoading(false)
    }
  }

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    if (res.data && res.data.user) {
      // Fetch full user data
      try {
        const userRes = await api.get('/auth/me')
        if (userRes.data && userRes.data.user) {
          const u = {
            id: res.data.user.id,
            role: res.data.user.role,
            name: userRes.data.user.name,
            email: userRes.data.user.email
          }
          setUser(u)
          try { localStorage.setItem('psp_user', JSON.stringify(u)) } catch (e) {}
        }
      } catch (error) {
        // Fallback to basic user data
        const u = { id: res.data.user.id, role: res.data.user.role }
        setUser(u)
        try { localStorage.setItem('psp_user', JSON.stringify(u)) } catch (e) {}
      }
    }
    return res
  }

  async function register(email, password, name, address, role = 'client', confirmPassword) {
    const payload = { name, email, password, confirmPassword, role, ...address }
    const res = await api.post('/auth/register', payload)
    if (res.data && res.data.user) {
      const u = {
        id: res.data.user.id,
        role: res.data.user.role,
        name: res.data.user.name,
        email: res.data.user.email
      }
      setUser(u)
      try { localStorage.setItem('psp_user', JSON.stringify(u)) } catch (e) {}
    }
    return res
  }

  async function logout() {
    try { await api.post('/auth/logout') } catch (e) {}
    setUser(null)
    try { localStorage.removeItem('psp_user') } catch (e) {}
  }

  const value = { user, login, register, logout, loading }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext

