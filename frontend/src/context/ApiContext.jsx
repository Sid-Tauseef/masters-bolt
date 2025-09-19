import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const ApiContext = createContext()

export const useApi = () => {
  const context = useContext(ApiContext)
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider')
  }
  return context
}

export const ApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Cache for API responses
  const [cache, setCache] = useState({
    courses: null,
    toppers: null,
    achievements: null,
    gallery: null,
    home: null
  })

  const clearError = () => setError(null)

  const fetchWithCache = async (endpoint, cacheKey) => {
    try {
      setLoading(true)
      setError(null)

      // Return cached data if available and not expired (5 minutes)
      if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < 5 * 60 * 1000) {
        return cache[cacheKey].data
      }

      const response = await api.get(endpoint)
      const data = response.data.data

      // Update cache
      setCache(prev => ({
        ...prev,
        [cacheKey]: {
          data,
          timestamp: Date.now()
        }
      }))

      return data
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const fetchCourses = (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = `/courses${queryString ? `?${queryString}` : ''}`
    return fetchWithCache(endpoint, 'courses')
  }

  const fetchToppers = (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = `/toppers${queryString ? `?${queryString}` : ''}`
    return fetchWithCache(endpoint, 'toppers')
  }

  const fetchAchievements = (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = `/achievements${queryString ? `?${queryString}` : ''}`
    return fetchWithCache(endpoint, 'achievements')
  }

  const fetchGallery = (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = `/gallery${queryString ? `?${queryString}` : ''}`
    return fetchWithCache(endpoint, 'gallery')
  }

  const fetchHomeSections = () => {
    return fetchWithCache('/home', 'home')
  }

  const submitContact = async (contactData) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await api.post('/contact', contactData)
      return response.data
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to submit contact form'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const clearCache = (cacheKey = null) => {
    if (cacheKey) {
      setCache(prev => ({
        ...prev,
        [cacheKey]: null
      }))
    } else {
      setCache({
        courses: null,
        toppers: null,
        achievements: null,
        gallery: null,
        home: null
      })
    }
  }

  const value = {
    loading,
    error,
    clearError,
    fetchCourses,
    fetchToppers,
    fetchAchievements,
    fetchGallery,
    fetchHomeSections,
    submitContact,
    clearCache
  }

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  )
}