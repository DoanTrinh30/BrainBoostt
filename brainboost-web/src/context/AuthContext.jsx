import { createContext, useState, useEffect } from 'react'
import api from '../services/api'

export const AuthContext = createContext()

// ✅ Hàm decode JWT token
function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('❌ Token decode error:', error)
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    try {
      const storedUser = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      
      if (storedUser && storedUser !== 'undefined' && storedUser !== '') {
        try {
          const userData = JSON.parse(storedUser)
          console.log('👤 User loaded from localStorage:', userData)
          setUser(userData)
        } catch (parseError) {
          console.warn('⚠️ Invalid user data, clearing localStorage')
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        }
      } else if (token) {
        // ✅ Nếu chỉ có token, decode nó để lấy user data
        const decodedToken = decodeToken(token)
        if (decodedToken) {
          console.log('👤 User loaded from token:', decodedToken)
          localStorage.setItem('user', JSON.stringify(decodedToken))
          setUser(decodedToken)
        }
      }
    } catch (err) {
      console.error('❌ Auth check error:', err)
    }
    setLoading(false)
  }

  const login = async (email, password) => {
    try {
      console.log('🔑 Attempting login with:', email)
      
      const res = await api.post('/auth/sign-in', { 
        email, 
        password 
      })
      
      console.log('📦 Backend response:', res.data)
      
      // ✅ FIX: Lấy token từ response
      const token = res.data.token
      
      if (!token) {
        throw new Error('No token in response')
      }

      // ✅ Decode token để lấy user data
      const userData = decodeToken(token)
      
      if (!userData || !userData.id) {
        throw new Error('Invalid token data')
      }

      console.log('✅ Login success:', userData)
      
      // Lưu vào localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)

      return {
        success: true,
        user: userData,
        role: userData.role || 'teacher'
      }
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Login failed'
      }
    }
  }

  const logout = () => {
    console.log('🚪 Logging out...')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user,
      role: user?.role || 'teacher'
    }}>
      {children}
    </AuthContext.Provider>
  )
}