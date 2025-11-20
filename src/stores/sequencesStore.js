import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sequencesAPI } from '@/services/api'
import { success, error } from '@/utils/notifications'

export const useSequencesStore = defineStore('sequences', () => {
  // State
  const state = ref({
    loading: false,
    error: null,
    sequences: [],
    selectedSequence: null,
    steps: [],
    enrollments: [],
    logs: [],
    pagination: {
      page: 1,
      per_page: 15,
      total: 0,
      last_page: 1,
      from: 0,
      to: 0
    },
    filters: {
      search: '',
      is_active: ''
    }
  })

  // Getters
  const sequences = computed(() => state.value.sequences)
  const selectedSequence = computed(() => state.value.selectedSequence)
  const steps = computed(() => state.value.steps)
  const enrollments = computed(() => state.value.enrollments)
  const logs = computed(() => state.value.logs)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const pagination = computed(() => state.value.pagination)
  const filters = computed(() => state.value.filters)

  // Actions
  const fetchSequences = async (params = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const mergedParams = { ...state.value.filters, ...params }
      const response = await sequencesAPI.list(mergedParams)
      
      if (response.data && response.data.data) {
        state.value.sequences = response.data.data
        state.value.pagination = {
          page: response.data.current_page || 1,
          per_page: response.data.per_page || 15,
          total: response.data.total || 0,
          last_page: response.data.last_page || 1,
          from: response.data.from || 0,
          to: response.data.to || 0
        }
      } else {
        state.value.sequences = []
      }
    } catch (err) {
      state.value.error = 'Failed to fetch sequences'
      console.error('Error fetching sequences:', err)
      error('Failed to load sequences')
    } finally {
      state.value.loading = false
    }
  }

  const getSequence = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await sequencesAPI.get(id)
      state.value.selectedSequence = response.data.data || response.data
      return state.value.selectedSequence
    } catch (err) {
      state.value.error = 'Failed to fetch sequence'
      console.error('Error fetching sequence:', err)
      error('Failed to load sequence')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const createSequence = async (payload) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await sequencesAPI.create(payload)
      const newSequence = response.data.data || response.data
      
      // Add to sequences list
      state.value.sequences.unshift(newSequence)
      
      success('Sequence created successfully')
      return newSequence
    } catch (err) {
      state.value.error = 'Failed to create sequence'
      console.error('Error creating sequence:', err)
      error('Failed to create sequence')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const updateSequence = async (id, payload) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await sequencesAPI.update(id, payload)
      const updatedSequence = response.data.data || response.data
      
      // Update in sequences list
      const index = state.value.sequences.findIndex(s => s.id === id)
      if (index !== -1) {
        state.value.sequences[index] = updatedSequence
      }
      
      // Update selected if it's the same sequence
      if (state.value.selectedSequence && state.value.selectedSequence.id === id) {
        state.value.selectedSequence = updatedSequence
      }
      
      success('Sequence updated successfully')
      return updatedSequence
    } catch (err) {
      state.value.error = 'Failed to update sequence'
      console.error('Error updating sequence:', err)
      error('Failed to update sequence')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const deleteSequence = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      await sequencesAPI.remove(id)
      
      // Remove from sequences list
      state.value.sequences = state.value.sequences.filter(s => s.id !== id)
      
      // Clear selected if it's the deleted sequence
      if (state.value.selectedSequence && state.value.selectedSequence.id === id) {
        state.value.selectedSequence = null
      }
      
      success('Sequence deleted successfully')
    } catch (err) {
      state.value.error = 'Failed to delete sequence'
      console.error('Error deleting sequence:', err)
      error('Failed to delete sequence')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const addStep = async (sequenceId, payload) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await sequencesAPI.addStep(sequenceId, payload)
      const newStep = response.data.data || response.data
      
      // Add to steps list
      state.value.steps.push(newStep)
      
      success('Step added successfully')
      return newStep
    } catch (err) {
      state.value.error = 'Failed to add step'
      console.error('Error adding step:', err)
      error('Failed to add step')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const updateStep = async (stepId, payload) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await sequencesAPI.updateStep(stepId, payload)
      const updatedStep = response.data.data || response.data
      
      // Update in steps list
      const index = state.value.steps.findIndex(s => s.id === stepId)
      if (index !== -1) {
        state.value.steps[index] = updatedStep
      }
      
      success('Step updated successfully')
      return updatedStep
    } catch (err) {
      state.value.error = 'Failed to update step'
      console.error('Error updating step:', err)
      error('Failed to update step')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const deleteStep = async (stepId) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      await sequencesAPI.deleteStep(stepId)
      
      // Remove from steps list
      state.value.steps = state.value.steps.filter(s => s.id !== stepId)
      
      success('Step deleted successfully')
    } catch (err) {
      state.value.error = 'Failed to delete step'
      console.error('Error deleting step:', err)
      error('Failed to delete step')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const enrollTarget = async (sequenceId, payload) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await sequencesAPI.enroll(sequenceId, payload)
      const newEnrollment = response.data.data || response.data
      
      // Add to enrollments list
      state.value.enrollments.push(newEnrollment)
      
      success('Target enrolled successfully')
      return newEnrollment
    } catch (err) {
      state.value.error = 'Failed to enroll target'
      console.error('Error enrolling target:', err)
      error('Failed to enroll target')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const pauseEnrollment = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await sequencesAPI.pause(id)
      const updatedEnrollment = response.data.data || response.data
      
      // Update in enrollments list
      const index = state.value.enrollments.findIndex(e => e.id === id)
      if (index !== -1) {
        state.value.enrollments[index] = updatedEnrollment
      }
      
      success('Enrollment paused successfully')
      return updatedEnrollment
    } catch (err) {
      state.value.error = 'Failed to pause enrollment'
      console.error('Error pausing enrollment:', err)
      error('Failed to pause enrollment')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const resumeEnrollment = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await sequencesAPI.resume(id)
      const updatedEnrollment = response.data.data || response.data
      
      // Update in enrollments list
      const index = state.value.enrollments.findIndex(e => e.id === id)
      if (index !== -1) {
        state.value.enrollments[index] = updatedEnrollment
      }
      
      success('Enrollment resumed successfully')
      return updatedEnrollment
    } catch (err) {
      state.value.error = 'Failed to resume enrollment'
      console.error('Error resuming enrollment:', err)
      error('Failed to resume enrollment')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const cancelEnrollment = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await sequencesAPI.cancel(id)
      const updatedEnrollment = response.data.data || response.data
      
      // Update in enrollments list
      const index = state.value.enrollments.findIndex(e => e.id === id)
      if (index !== -1) {
        state.value.enrollments[index] = updatedEnrollment
      }
      
      success('Enrollment cancelled successfully')
      return updatedEnrollment
    } catch (err) {
      state.value.error = 'Failed to cancel enrollment'
      console.error('Error cancelling enrollment:', err)
      error('Failed to cancel enrollment')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const fetchLogs = async (sequenceId) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await sequencesAPI.logs(sequenceId)
      state.value.logs = response.data.data || response.data || []
    } catch (err) {
      state.value.error = 'Failed to fetch logs'
      console.error('Error fetching logs:', err)
      // Don't show error notification for logs, just set empty logs
      state.value.logs = []
      throw err
    } finally {
      state.value.loading = false
    }
  }

  // Filter management
  const setFilters = (newFilters) => {
    state.value.filters = { ...state.value.filters, ...newFilters }
  }

  const clearFilters = () => {
    state.value.filters = {
      search: '',
      is_active: ''
    }
  }

  // Reset state
  const resetState = () => {
    state.value.sequences = []
    state.value.selectedSequence = null
    state.value.steps = []
    state.value.enrollments = []
    state.value.logs = []
    state.value.error = null
    state.value.loading = false
  }

  return {
    // State
    sequences,
    selectedSequence,
    steps,
    enrollments,
    logs,
    loading,
    error,
    pagination,
    filters,
    
    // Actions
    fetchSequences,
    getSequence,
    createSequence,
    updateSequence,
    deleteSequence,
    addStep,
    updateStep,
    deleteStep,
    enrollTarget,
    pauseEnrollment,
    resumeEnrollment,
    cancelEnrollment,
    fetchLogs,
    setFilters,
    clearFilters,
    resetState
  }
})
