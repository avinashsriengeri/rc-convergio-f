import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { hrAPI } from '../api/hrAPI'

export const useHrInductionStore = defineStore('hrInduction', () => {
  // State
  const state = ref({
    loading: false,
    error: null,
    contents: [],
    selectedContent: null,
    tracking: [],
    summary: {
      total_assignments: 0,
      completed: 0,
      pending: 0,
      in_progress: 0,
      overdue: 0,
      completion_rate: 0
    },
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    },
    filters: {
      search: '',
      status: '',
      category: '',
      page: 1,
      per_page: 15
    },
    trackingFilters: {
      employee_id: null,
      department_id: null,
      content_id: null,
      status: '',
      overdue: null,
      page: 1,
      per_page: 15
    }
  })

  // Getters
  const contents = computed(() => state.value.contents)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const selectedContent = computed(() => state.value.selectedContent)
  const tracking = computed(() => state.value.tracking)
  const summary = computed(() => state.value.summary)
  const meta = computed(() => state.value.meta)
  const filters = computed(() => state.value.filters)
  const trackingFilters = computed(() => state.value.trackingFilters)

  // Actions
  const fetchContents = async (newFilters = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const mergedFilters = { ...state.value.filters, ...newFilters }
      state.value.filters = mergedFilters
      
      const response = await hrAPI.getInductionContents(mergedFilters)
      
      if (response.data.success) {
        state.value.contents = response.data.data || []
        state.value.meta = response.data.meta || response.data.pagination || state.value.meta
      } else {
        throw new Error(response.data.message || 'Failed to fetch contents')
      }
    } catch (err) {
      console.error('Error fetching contents:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch contents'
      state.value.contents = []
    } finally {
      state.value.loading = false
    }
  }

  const fetchContent = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getInductionContent(id)
      
      if (response.data.success) {
        state.value.selectedContent = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch content')
      }
    } catch (err) {
      console.error('Error fetching content:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch content'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const createContent = async (contentData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.createInductionContent(contentData)
      
      if (response.data.success) {
        const newContent = response.data.data
        state.value.contents.unshift(newContent)
        state.value.meta.total++
        return newContent
      } else {
        throw new Error(response.data.message || 'Failed to create content')
      }
    } catch (err) {
      console.error('Error creating content:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to create content'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const updateContent = async (id, contentData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.updateInductionContent(id, contentData)
      
      if (response.data.success) {
        const updatedContent = response.data.data
        const index = state.value.contents.findIndex(c => c.id === id)
        if (index !== -1) {
          state.value.contents[index] = updatedContent
        }
        if (state.value.selectedContent?.id === id) {
          state.value.selectedContent = updatedContent
        }
        return updatedContent
      } else {
        throw new Error(response.data.message || 'Failed to update content')
      }
    } catch (err) {
      console.error('Error updating content:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to update content'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const publishContent = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.publishInductionContent(id)
      
      if (response.data.success) {
        const publishedContent = response.data.data
        const index = state.value.contents.findIndex(c => c.id === id)
        if (index !== -1) {
          state.value.contents[index] = publishedContent
        }
        if (state.value.selectedContent?.id === id) {
          state.value.selectedContent = publishedContent
        }
        return {
          content: publishedContent,
          assignedCount: response.data.assigned_count || 0
        }
      } else {
        throw new Error(response.data.message || 'Failed to publish content')
      }
    } catch (err) {
      console.error('Error publishing content:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to publish content'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const deleteContent = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.deleteInductionContent(id)
      
      if (response.data.success) {
        state.value.contents = state.value.contents.filter(c => c.id !== id)
        state.value.meta.total--
        if (state.value.selectedContent?.id === id) {
          state.value.selectedContent = null
        }
        return true
      } else {
        throw new Error(response.data.message || 'Failed to delete content')
      }
    } catch (err) {
      console.error('Error deleting content:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to delete content'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const fetchTracking = async (newFilters = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const mergedFilters = { ...state.value.trackingFilters, ...newFilters }
      state.value.trackingFilters = mergedFilters
      
      const response = await hrAPI.getInductionTracking(mergedFilters)
      
      if (response.data.success) {
        state.value.tracking = response.data.data || []
        state.value.summary = response.data.summary || state.value.summary
        state.value.meta = response.data.meta || response.data.pagination || state.value.meta
      } else {
        throw new Error(response.data.message || 'Failed to fetch tracking data')
      }
    } catch (err) {
      console.error('Error fetching tracking:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch tracking data'
      state.value.tracking = []
    } finally {
      state.value.loading = false
    }
  }

  const fetchEmployeeProgress = async (employeeId) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getEmployeeInductionProgress(employeeId)
      
      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch employee progress')
      }
    } catch (err) {
      console.error('Error fetching employee progress:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch employee progress'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const sendReminders = async (reminderData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.sendInductionReminders(reminderData)
      
      if (response.data.success) {
        return {
          sentCount: response.data.sent_count || 0,
          message: response.data.message
        }
      } else {
        throw new Error(response.data.message || 'Failed to send reminders')
      }
    } catch (err) {
      console.error('Error sending reminders:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to send reminders'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const setFilters = (newFilters) => {
    state.value.filters = { ...state.value.filters, ...newFilters }
  }

  const setTrackingFilters = (newFilters) => {
    state.value.trackingFilters = { ...state.value.trackingFilters, ...newFilters }
  }

  const resetFilters = () => {
    state.value.filters = {
      search: '',
      status: '',
      category: '',
      page: 1,
      per_page: 15
    }
  }

  const resetTrackingFilters = () => {
    state.value.trackingFilters = {
      employee_id: null,
      department_id: null,
      content_id: null,
      status: '',
      overdue: null,
      page: 1,
      per_page: 15
    }
  }

  const clearSelectedContent = () => {
    state.value.selectedContent = null
  }

  return {
    // State
    contents,
    loading,
    error,
    selectedContent,
    tracking,
    summary,
    meta,
    filters,
    trackingFilters,
    // Actions
    fetchContents,
    fetchContent,
    createContent,
    updateContent,
    publishContent,
    deleteContent,
    fetchTracking,
    fetchEmployeeProgress,
    sendReminders,
    setFilters,
    setTrackingFilters,
    resetFilters,
    resetTrackingFilters,
    clearSelectedContent
  }
})

