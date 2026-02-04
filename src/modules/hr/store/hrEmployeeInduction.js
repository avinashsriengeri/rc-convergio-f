import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { hrAPI } from '../api/hrAPI'

export const useHrEmployeeInductionStore = defineStore('hrEmployeeInduction', () => {
  // State
  const state = ref({
    loading: false,
    error: null,
    myInduction: null,
    selectedContent: null,
    viewingAssignment: null
  })

  // Getters
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const myInduction = computed(() => state.value.myInduction)
  const selectedContent = computed(() => state.value.selectedContent)
  const viewingAssignment = computed(() => state.value.viewingAssignment)
  const progress = computed(() => state.value.myInduction?.progress || {
    total: 0,
    completed: 0,
    pending: 0,
    in_progress: 0,
    overdue: 0,
    percentage: 0,
    mandatory: {
      total: 0,
      completed: 0,
      all_completed: false
    }
  })
  const items = computed(() => state.value.myInduction?.items || [])

  // Actions
  const fetchMyInduction = async () => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getMyInduction()
      
      if (response.data.success) {
        state.value.myInduction = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch induction items')
      }
    } catch (err) {
      console.error('Error fetching my induction:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch induction items'
      state.value.myInduction = null
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const viewContent = async (assignmentId) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.viewInductionContent(assignmentId)
      
      if (response.data.success) {
        state.value.viewingAssignment = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to load content')
      }
    } catch (err) {
      console.error('Error viewing content:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to load content'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const startContent = async (assignmentId) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.startInductionContent(assignmentId)
      
      if (response.data.success) {
        // Update local state
        if (state.value.myInduction?.items) {
          const item = state.value.myInduction.items.find(i => i.assignment_id === assignmentId)
          if (item) {
            item.status = 'in_progress'
            item.started_at = response.data.data.started_at
          }
        }
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to start content')
      }
    } catch (err) {
      console.error('Error starting content:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to start content'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const acknowledgeContent = async (assignmentId, notes = '') => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.acknowledgeInductionContent(assignmentId, { notes })
      
      if (response.data.success) {
        // Update local state
        if (state.value.myInduction?.items) {
          const item = state.value.myInduction.items.find(i => i.assignment_id === assignmentId)
          if (item) {
            item.status = 'completed'
            item.completed_at = response.data.data.completed_at
          }
        }
        // Update progress
        if (response.data.progress && state.value.myInduction) {
          state.value.myInduction.progress = response.data.progress
        }
        return response.data
      } else {
        throw new Error(response.data.message || 'Failed to acknowledge content')
      }
    } catch (err) {
      console.error('Error acknowledging content:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to acknowledge content'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const clearViewingAssignment = () => {
    state.value.viewingAssignment = null
  }

  return {
    // State
    loading,
    error,
    myInduction,
    selectedContent,
    viewingAssignment,
    progress,
    items,
    // Actions
    fetchMyInduction,
    viewContent,
    startContent,
    acknowledgeContent,
    clearViewingAssignment
  }
})

