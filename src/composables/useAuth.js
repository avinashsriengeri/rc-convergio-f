import { ref, computed, readonly } from 'vue'
import { authAPI } from '@/services/api'

// Reactive auth state
const user = ref(null)
const isAuthenticated = ref(false)
const loading = ref(false)

// Initialize auth state from localStorage
const initAuth = () => {
  const token = localStorage.getItem('access_token')
  const userData = localStorage.getItem('user')
  
  console.log('Initializing auth with token:', token ? 'exists' : 'missing')
  console.log('Initializing auth with user data:', userData)
  
  if (token && userData) {
    try {
      user.value = JSON.parse(userData)
      isAuthenticated.value = true
      console.log('Auth initialized with user:', user.value)
    } catch (error) {
      console.error('Failed to parse user data:', error)
      logout()
    }
  }
}

// Login function
const login = async (credentials) => {
  loading.value = true
  try {
    const response = await authAPI.login(credentials)
    console.log('Login response:', response.data)
    
    // Backend returns: { success: true, data: { access_token, user } }
    const { access_token, user: userData } = response.data.data
    
    console.log('User data from login:', userData)
    
    // Store auth data
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('user', JSON.stringify(userData))
    
    // Update reactive state
    user.value = userData
    isAuthenticated.value = true
    
    return { success: true, user: userData }
  } catch (error) {
    console.error('Login error:', error)
    const message = error.response?.data?.error || error.response?.data?.message || 'Login failed'
    return { success: false, message }
  } finally {
    loading.value = false
  }
}

// Register function
const register = async (userData) => {
  loading.value = true
  try {
    const response = await authAPI.register(userData)
    return { success: true, message: 'Registration successful' }
  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed'
    return { success: false, message }
  } finally {
    loading.value = false
  }
}

// Logout function
const logout = async () => {
  try {
    await authAPI.logout()
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    // Clear local storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    localStorage.removeItem('tenant_id')
    
    // Reset reactive state
    user.value = null
    isAuthenticated.value = false
  }
}

// Verify token
const verifyToken = async () => {
  try {
    const response = await authAPI.verify()
    user.value = response.data.user
    isAuthenticated.value = true
    return true
  } catch (error) {
    logout()
    return false
  }
}

// Forgot password
const forgotPassword = async (email) => {
  loading.value = true
  try {
    await authAPI.forgotPassword(email)
    return { success: true, message: 'Password reset link sent' }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to send reset link'
    return { success: false, message }
  } finally {
    loading.value = false
  }
}

// Reset password
const resetPassword = async (data) => {
  loading.value = true
  try {
    await authAPI.resetPassword(data)
    return { success: true, message: 'Password reset successful' }
  } catch (error) {
    const message = error.response?.data?.message || 'Password reset failed'
    return { success: false, message }
  } finally {
    loading.value = false
  }
}

// Computed properties
const userRole = computed(() => user.value?.role || 'user')
const userName = computed(() => user.value?.name || 'User')
const userEmail = computed(() => user.value?.email || '')

export function useAuth() {
  return {
    // State
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    loading: readonly(loading),
    
    // Computed
    userRole,
    userName,
    userEmail,
    
    // Methods
    initAuth,
    login,
    register,
    logout,
    verifyToken,
    forgotPassword,
    resetPassword,
  }
}
