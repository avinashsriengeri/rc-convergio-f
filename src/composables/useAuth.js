import { ref, computed, readonly } from 'vue'
import { authAPI } from '@/services/api'

// Reactive auth state
const user = ref(null)
const isAuthenticated = ref(false)
const loading = ref(false)
const verificationLoading = ref(false)
const currentOrgName = ref('RC')

// Fetch current user organization data
const fetchCurrentUserData = async () => {
  // Only fetch if we have a valid token and are authenticated
  const token = localStorage.getItem('access_token')
  if (!token || !isAuthenticated.value) {
    console.log('Skipping fetchCurrentUserData: no token or not authenticated')
    currentOrgName.value = 'RC'
    return
  }

  try {
    const response = await authAPI.getCurrentUser()
    const userData = response.data.data || response.data
    
    // Extract organization name with priority: organization_name -> organization.name -> current_organization.name
    let orgName = userData.organization_name || 
                  userData.organization?.name || 
                  userData.current_organization?.name
    
    // Use fallback if no organization found
    if (!orgName || orgName.trim() === '') {
      orgName = 'RC'
    }
    
    currentOrgName.value = orgName
    console.log('Organization name fetched:', orgName)
  } catch (error) {
    console.warn('Failed to fetch current user data:', error)
    // Use fallback on any error
    currentOrgName.value = 'RC'
    
    // If it's an auth error, don't logout during init
    if (error.response?.status === 401) {
      console.log('Auth error during fetchCurrentUserData, but not logging out during init')
    }
  }
}

// Initialize auth state from localStorage
const initAuth = () => {
  const token = localStorage.getItem('access_token')
  const userData = localStorage.getItem('user')
  
  console.log('Initializing auth with token:', token ? 'exists' : 'missing')
  console.log('Initializing auth with user data:', userData ? 'exists' : 'null')
  
  if (token && userData) {
    try {
      user.value = JSON.parse(userData)
      isAuthenticated.value = true
      console.log('Auth initialized with user:', user.value)
      
      // Only fetch current user data if we have a valid token and user
      if (token && user.value) {
        fetchCurrentUserData().catch((error) => {
          console.warn('Failed to fetch current user data during init:', error)
          // Don't logout on init fetch failure, just use cached data
        })
      }
    } catch (error) {
      console.error('Failed to parse user data:', error)
      // Clear invalid data
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      localStorage.removeItem('tenant_id')
      user.value = null
      isAuthenticated.value = false
    }
  } else {
    // Ensure state is properly reset if no valid auth data
    user.value = null
    isAuthenticated.value = false
  }
}

// Login function with email verification handling
const login = async (credentials) => {
  loading.value = true
  try {
    const response = await authAPI.login(credentials)
    console.log('Login response:', response.data)
    
    // Check for email verification requirement
    if (response.data.status === 403 && response.data.message?.includes('email not verified')) {
      return { 
        success: false, 
        requiresVerification: true, 
        message: 'Please verify your email before logging in.',
        user: response.data.user || null 
      }
    }
    
    // Backend returns: { success: true, data: { access_token, user } }
    const { access_token, user: userData } = response.data.data
    
    console.log('User data from login:', userData)
    console.log('User roles from login:', userData.roles)
    
    // Store auth data
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('user', JSON.stringify(userData))
    
    // Update reactive state
    user.value = userData
    isAuthenticated.value = true
    
    console.log('User role after login:', userRole.value)
    console.log('Authentication state updated:', { 
      isAuthenticated: isAuthenticated.value, 
      user: user.value?.name,
      email_verified: user.value?.email_verified_at 
    })
    
    // Fetch current user data to get organization info
    fetchCurrentUserData()
    
    // Trigger metadata refresh for current tenant
    try {
      const { useRefsStore } = await import('../stores/refs')
      const { useStagesStore } = await import('../stores/stages')
      const refsStore = useRefsStore()
      const stagesStore = useStagesStore()
      await Promise.all([
        refsStore.initializeData(),
        stagesStore.fetchStages()
      ])
    } catch (e) {
      console.warn('Post-login metadata refresh failed:', e)
    }
    
    return { success: true, user: userData }
  } catch (error) {
    console.error('Login error:', error)
    
    // Handle specific email verification error
    if (error.response?.status === 403 && error.response?.data?.message?.includes('email not verified')) {
      return { 
        success: false, 
        requiresVerification: true, 
        message: 'Please verify your email before logging in.',
        user: error.response.data.user || null 
      }
    }
    
    // Handle 429 Too Many Requests
    if (error.response?.status === 429) {
      return { 
        success: false, 
        message: 'Too many login attempts. Please wait a few minutes before trying again.' 
      }
    }
    
    const message = error.response?.data?.error || error.response?.data?.message || 'Login failed'
    return { success: false, message }
  } finally {
    loading.value = false
  }
}

// Resend verification email
const resendVerification = async (email) => {
  verificationLoading.value = true
  try {
    const response = await authAPI.resendVerification({ email })
    return { success: true, message: 'Verification email resent successfully.' }
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to resend verification email'
    return { success: false, message }
  } finally {
    verificationLoading.value = false
  }
}

// Register function
const register = async (userData) => {
  loading.value = true
  try {
    const response = await authAPI.register(userData)
    return { success: true, message: 'Check your Gmail inbox to verify your email' }
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

    // Reset cached metadata
    try {
      const { useRefsStore } = await import('../stores/refs')
      const { useStagesStore } = await import('../stores/stages')
      const refsStore = useRefsStore()
      const stagesStore = useStagesStore()
      refsStore.reset()
      stagesStore.reset()
    } catch (e) {
      console.warn('Post-logout store reset failed:', e)
    }
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
    return { success: true, message: 'If the email exists, a reset link has been sent to your Gmail' }
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
const userRole = computed(() => {
  // Handle nested roles array from backend
  if (user.value?.roles && user.value.roles.length > 0) {
    // Check if roles array contains objects with .name property
    if (typeof user.value.roles[0] === 'object' && user.value.roles[0]?.name) {
      console.log('userRole computed: Using object.name format:', user.value.roles[0].name)
      return user.value.roles[0].name
    }
    // Handle case where roles array contains strings directly
    if (typeof user.value.roles[0] === 'string') {
      console.log('userRole computed: Using string format:', user.value.roles[0])
      return user.value.roles[0]
    }
  }
  // Fallback to flat role property
  console.log('userRole computed: Using fallback role:', user.value?.role || 'user')
  return user.value?.role || 'user'
})
const userName = computed(() => user.value?.name || 'User')
const userEmail = computed(() => user.value?.email || '')

// Email verification computed properties
const isEmailVerified = computed(() => {
  return user.value?.email_verified_at !== null && user.value?.email_verified_at !== undefined
})

const requiresEmailVerification = computed(() => {
  return isAuthenticated.value && !isEmailVerified.value
})

export function useAuth() {
  return {
    // State
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    loading: readonly(loading),
    verificationLoading: readonly(verificationLoading),
    currentOrgName: readonly(currentOrgName),
    
    // Computed
    userRole,
    userName,
    userEmail,
    isEmailVerified,
    requiresEmailVerification,
    
    // Methods
    initAuth,
    login,
    register,
    logout,
    verifyToken,
    forgotPassword,
    resetPassword,
    resendVerification,
    fetchCurrentUserData,
  }
}
