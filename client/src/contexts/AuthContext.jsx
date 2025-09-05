import { createContext, useContext, useEffect, useState } from 'react'
import { useApi } from '../hooks/useApi'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const { apiCall } = useApi()

  useEffect(() => {
    if (token) {
      validateToken()
    } else {
      setLoading(false)
    }
  }, [token])

  const validateToken = async () => {
    try {
      const response = await apiCall('/auth/validate', {
        headers: { Authorization: `Bearer ${token}` },
        suppressError: true,
      })

      if (response.data.success) {
        setUser(response.data.data.user)
      } else {
        throw new Error('Token validation failed')
      }
    } catch (error) {
      console.error('Token validation failed:', error)
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        data: { email, password },
      })

      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed')
      }

      const { user: userData, token: authToken } = response.data.data

      localStorage.setItem('token', authToken)
      setToken(authToken)
      setUser(userData)

      return response.data
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await apiCall('/auth/register', {
        method: 'POST',
        data: userData,
      })

      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed')
      }

      const { user: newUser, token: authToken } = response.data.data

      localStorage.setItem('token', authToken)
      setToken(authToken)
      setUser(newUser)

      return response.data
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    } catch (error) {
      throw error
    }
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}