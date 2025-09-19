import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      verifyToken()
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async () => {
    try {
      const response = await api.get('/auth/verify')
      setAdmin(response.data.data.admin)
      setIsAuthenticated(true)
    } catch (error) {
      localStorage.removeItem('adminToken')
      setAdmin(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, admin } = response.data.data
      
      localStorage.setItem('adminToken', token)
      setAdmin(admin)
      setIsAuthenticated(true)
      
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setAdmin(null)
    setIsAuthenticated(false)
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password change failed')
    }
  }

  const value = {
    admin,
    isAuthenticated,
    loading,
    login,
    logout,
    changePassword,
    verifyToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}