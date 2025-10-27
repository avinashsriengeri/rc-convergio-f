import { ref, computed, onMounted } from 'vue'
import { useAuth } from './useAuth'
import api from '@/services/api'

// Global feature state
const features = ref([])
const loading = ref(false)
const error = ref(null)
const initialized = ref(false)

// Feature access cache for performance
const featureCache = new Map()

export function useFeatures() {
  const { user, isAuthenticated } = useAuth()

  // Fetch all feature statuses from backend
  const fetchFeatures = async () => {
    if (!isAuthenticated.value) {
      console.log('User not authenticated, skipping feature fetch')
      return
    }

    loading.value = true
    error.value = null

    try {
      console.log('Fetching feature statuses...')
      const response = await api.get('/features/status')
      
      // Handle both response formats
      const featuresData = response.data.data || response.data
      
      if (Array.isArray(featuresData)) {
        features.value = featuresData
        console.log('Features loaded:', featuresData.length, 'features')
        
        // Clear cache when features are refreshed
        featureCache.clear()
        
        // Log feature status for debugging
        features.value.forEach(feature => {
          console.log(`Feature: ${feature.feature}, Enabled: ${feature.enabled}`)
        })
      } else {
        console.error('Invalid features response format:', featuresData)
        features.value = []
      }
      
      initialized.value = true
    } catch (err) {
      console.error('Failed to fetch features:', err)
      error.value = err.response?.data?.message || err.message || 'Failed to load feature access'
      
      // Fallback to default features if API fails
      features.value = getDefaultFeatures()
      initialized.value = true
    } finally {
      loading.value = false
    }
  }

  // Check if user has access to a specific feature
  const hasFeature = (featureName) => {
    // Check cache first for performance
    if (featureCache.has(featureName)) {
      return featureCache.get(featureName)
    }

    // Find feature in loaded features
    const feature = features.value.find(f => f.feature === featureName)
    
    if (!feature) {
      console.warn(`Feature '${featureName}' not found in feature list`)
      const result = false
      featureCache.set(featureName, result)
      return result
    }

    // Check if feature is enabled
    if (!feature.enabled) {
      console.log(`Feature '${featureName}' is disabled:`, feature.reason)
      featureCache.set(featureName, false)
      return false
    }

    // Check role restrictions
    if (feature.restrictions?.roles && user.value?.roles) {
      const userRoles = Array.isArray(user.value.roles) 
        ? user.value.roles.map(role => typeof role === 'object' ? role.name : role)
        : [user.value.role]
      
      const hasRequiredRole = feature.restrictions.roles.some(requiredRole => 
        userRoles.includes(requiredRole)
      )
      
      if (!hasRequiredRole) {
        console.log(`Feature '${featureName}' restricted by role. User roles:`, userRoles, 'Required:', feature.restrictions.roles)
        featureCache.set(featureName, false)
        return false
      }
    }

    // Check domain restrictions
    if (feature.restrictions?.domains && user.value?.organization_name) {
      const userDomain = user.value.organization_name.toLowerCase()
      const hasRequiredDomain = feature.restrictions.domains.some(requiredDomain => 
        userDomain.includes(requiredDomain.toLowerCase())
      )
      
      if (!hasRequiredDomain) {
        console.log(`Feature '${featureName}' restricted by domain. User domain:`, userDomain, 'Required:', feature.restrictions.domains)
        featureCache.set(featureName, false)
        return false
      }
    }

    // Feature is accessible
    featureCache.set(featureName, true)
    return true
  }

  // Check multiple features at once
  const hasAnyFeature = (featureNames) => {
    return featureNames.some(feature => hasFeature(feature))
  }

  const hasAllFeatures = (featureNames) => {
    return featureNames.every(feature => hasFeature(feature))
  }

  // Get feature details
  const getFeature = (featureName) => {
    return features.value.find(f => f.feature === featureName) || null
  }

  // Refresh features (useful after login/logout)
  const refreshFeatures = async () => {
    await fetchFeatures()
  }

  // Clear features (useful on logout)
  const clearFeatures = () => {
    features.value = []
    featureCache.clear()
    initialized.value = false
    error.value = null
  }

  // Default features for fallback when API fails
  const getDefaultFeatures = () => {
    return [
      {
        feature: 'manage_users',
        enabled: true,
        restrictions: { roles: ['admin'] }
      },
      {
        feature: 'manage_campaigns',
        enabled: true,
        restrictions: { roles: ['admin', 'manager'] }
      },
      {
        feature: 'export_data',
        enabled: true,
        restrictions: { roles: ['admin', 'manager'] }
      },
      {
        feature: 'bulk_operations',
        enabled: true,
        restrictions: { roles: ['admin', 'manager'] }
      },
      {
        feature: 'system_settings',
        enabled: true,
        restrictions: { roles: ['admin'] }
      },
      {
        feature: 'advanced_analytics',
        enabled: true,
        restrictions: { roles: ['admin', 'manager'] }
      }
    ]
  }

  // Computed properties
  const isReady = computed(() => initialized.value && !loading.value)
  const hasErrors = computed(() => !!error.value)

  // Initialize features when composable is used
  onMounted(() => {
    if (isAuthenticated.value && !initialized.value) {
      fetchFeatures()
    }
  })

  return {
    // State
    features: computed(() => features.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isReady: computed(() => isReady.value),
    hasErrors: computed(() => hasErrors.value),
    
    // Methods
    hasFeature,
    hasAnyFeature,
    hasAllFeatures,
    getFeature,
    fetchFeatures,
    refreshFeatures,
    clearFeatures
  }
}

// Export for global use
export default useFeatures
