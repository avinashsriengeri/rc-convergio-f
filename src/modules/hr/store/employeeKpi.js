import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { hrAPI } from '../api/hrAPI'

const createFilters = (data = {}) => ({
  status: '',
  review_period_value: '',
  sortBy: 'created_at',
  sortOrder: 'desc',
  page: 1,
  per_page: 15,
  ...data
})

export const useEmployeeKpiStore = defineStore('employeeKpi', () => {
  // State
  const state = ref({
    loading: false,
    error: null,
    assignments: [],
    selectedAssignment: null,
    history: [],
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    },
    filters: createFilters()
  })

  // Getters
  const assignments = computed(() => state.value.assignments)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const selectedAssignment = computed(() => state.value.selectedAssignment)
  const history = computed(() => state.value.history)
  const meta = computed(() => state.value.meta)
  const filters = computed(() => state.value.filters)

  const stats = computed(() => {
    const allAssignments = state.value.assignments
    return {
      active: allAssignments.filter(a => a.status === 'self_review_pending').length,
      pending: allAssignments.filter(a => a.status === 'self_review_submitted' || a.status === 'manager_review_pending').length,
      completed: allAssignments.filter(a => a.status === 'completed').length
    }
  })

  // Actions
  const fetchMyAssignments = async (newFilters = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const mergedFilters = { ...state.value.filters, ...newFilters }
      state.value.filters = mergedFilters
      
      const response = await hrAPI.getMyKpiAssignments(mergedFilters)
      
      if (response.data.success) {
        state.value.assignments = response.data.data || []
        state.value.meta = response.data.meta || state.value.meta
      } else {
        throw new Error(response.data.message || 'Failed to fetch assignments')
      }
    } catch (err) {
      console.error('Error fetching KPI assignments:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch assignments'
      state.value.assignments = []
    } finally {
      state.value.loading = false
    }
  }

  const fetchAssignment = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getMyKpiAssignment(id)
      
      if (response.data.success) {
        state.value.selectedAssignment = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Assignment not found')
      }
    } catch (err) {
      console.error('Error fetching KPI assignment:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch assignment'
      state.value.selectedAssignment = null
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const submitSelfReview = async (id, reviewData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.submitSelfReview(id, reviewData)
      
      if (response.data.success) {
        // Update the assignment in the list
        const index = state.value.assignments.findIndex(a => a.id === id)
        if (index !== -1) {
          await fetchAssignment(id)
          const updatedAssignment = state.value.selectedAssignment
          state.value.assignments[index] = { ...state.value.assignments[index], self_review: updatedAssignment, status: 'self_review_submitted' }
        }
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to submit self review')
      }
    } catch (err) {
      console.error('Error submitting self review:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to submit self review'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const fetchHistory = async (newFilters = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const mergedFilters = { ...state.value.filters, ...newFilters }
      
      const response = await hrAPI.getMyKpiHistory(mergedFilters)
      
      if (response.data.success) {
        state.value.history = response.data.data || []
        state.value.meta = response.data.meta || state.value.meta
      } else {
        throw new Error(response.data.message || 'Failed to fetch history')
      }
    } catch (err) {
      console.error('Error fetching KPI history:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch history'
      state.value.history = []
    } finally {
      state.value.loading = false
    }
  }

  const setFilters = (newFilters) => {
    state.value.filters = { ...state.value.filters, ...newFilters }
  }

  const clearSelectedAssignment = () => {
    state.value.selectedAssignment = null
  }

  return {
    // State
    assignments,
    loading,
    error,
    selectedAssignment,
    history,
    meta,
    filters,
    // Getters
    stats,
    // Actions
    fetchMyAssignments,
    fetchAssignment,
    submitSelfReview,
    fetchHistory,
    setFilters,
    clearSelectedAssignment
  }
})

