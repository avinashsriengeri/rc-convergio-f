import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { hrAPI } from '../api/hrAPI'

export const useHrKpiAnalyticsStore = defineStore('hrKpiAnalytics', () => {
  // State
  const state = ref({
    loading: false,
    error: null,
    analytics: null
  })

  // Getters
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const analytics = computed(() => state.value.analytics)

  // Actions
  const fetchAnalytics = async (params = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getKpiAnalytics(params)
      
      if (response.data.success) {
        state.value.analytics = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch analytics')
      }
    } catch (err) {
      console.error('Error fetching KPI analytics:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch analytics'
      state.value.analytics = null
      throw err
    } finally {
      state.value.loading = false
    }
  }

  return {
    loading,
    error,
    analytics,
    fetchAnalytics
  }
})

