import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { hrAPI } from '../api/hrAPI'

export const useHrOnboardingStore = defineStore('hrOnboarding', () => {
  // State
  const state = ref({
    loading: false,
    error: null,
    onboardingEmployees: [],
    selectedEmployeeOnboarding: null,
    checklist: [],
    tasks: [],
    myTasks: [],
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    },
    filters: {
      search: '',
      department_id: null,
      manager_id: null,
      status: 'onboarding',
      page: 1,
      per_page: 15
    }
  })

  // Getters
  const onboardingEmployees = computed(() => state.value.onboardingEmployees)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const selectedEmployeeOnboarding = computed(() => state.value.selectedEmployeeOnboarding)
  const checklist = computed(() => state.value.checklist)
  const tasks = computed(() => state.value.tasks)
  const myTasks = computed(() => state.value.myTasks)
  const meta = computed(() => state.value.meta)
  const filters = computed(() => state.value.filters)

  // Actions
  const fetchOnboardingEmployees = async (newFilters = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const mergedFilters = { ...state.value.filters, ...newFilters }
      state.value.filters = mergedFilters
      
      const response = await hrAPI.getOnboardingEmployees(mergedFilters)
      
      if (response.data.success) {
        state.value.onboardingEmployees = response.data.data || []
        state.value.meta = response.data.pagination || response.data.meta || state.value.meta
      } else {
        throw new Error(response.data.message || 'Failed to fetch onboarding employees')
      }
    } catch (err) {
      console.error('Error fetching onboarding employees:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch onboarding employees'
      state.value.onboardingEmployees = []
    } finally {
      state.value.loading = false
    }
  }

  const fetchEmployeeOnboardingProgress = async (employeeId) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getEmployeeOnboardingProgress(employeeId)
      
      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch onboarding progress')
      }
    } catch (err) {
      console.error('Error fetching onboarding progress:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch onboarding progress'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const fetchEmployeeOnboarding = async (employeeId) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getEmployeeOnboarding(employeeId)
      
      if (response.data.success) {
        state.value.selectedEmployeeOnboarding = response.data.data
        // Also update checklist and tasks from the response if available
        if (response.data.data.checklists) {
          state.value.checklist = response.data.data.checklists
        }
        if (response.data.data.tasks) {
          state.value.tasks = response.data.data.tasks
        }
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch employee onboarding')
      }
    } catch (err) {
      console.error('Error fetching employee onboarding:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch employee onboarding'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const fetchEmployeeOnboardingChecklist = async (employeeId) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getEmployeeOnboardingChecklist(employeeId)
      
      if (response.data.success) {
        state.value.checklist = response.data.data || []
        return state.value.checklist
      } else {
        throw new Error(response.data.message || 'Failed to fetch checklist')
      }
    } catch (err) {
      console.error('Error fetching checklist:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch checklist'
      state.value.checklist = []
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const fetchEmployeeOnboardingTasks = async (employeeId) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getEmployeeOnboardingTasks(employeeId)
      
      if (response.data.success) {
        state.value.tasks = response.data.data || []
        return state.value.tasks
      } else {
        throw new Error(response.data.message || 'Failed to fetch tasks')
      }
    } catch (err) {
      console.error('Error fetching tasks:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch tasks'
      state.value.tasks = []
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const completeChecklistItem = async (employeeId, itemId, data = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.completeChecklistItem(employeeId, itemId, data)
      
      if (response.data.success) {
        // Update checklist item
        const index = state.value.checklist.findIndex(item => item.id === itemId)
        if (index !== -1) {
          state.value.checklist[index] = response.data.data
        }
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to complete checklist item')
      }
    } catch (err) {
      console.error('Error completing checklist item:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to complete checklist item'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const updateOnboardingTask = async (employeeId, taskId, data) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.updateOnboardingTask(employeeId, taskId, data)
      
      if (response.data.success) {
        // Update task in list
        const index = state.value.tasks.findIndex(task => task.id === taskId)
        if (index !== -1) {
          state.value.tasks[index] = response.data.data
        }
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to update task')
      }
    } catch (err) {
      console.error('Error updating task:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to update task'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const completeOnboarding = async (employeeId, data = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.completeOnboarding(employeeId, data)
      
      if (response.data.success) {
        // Update selected employee onboarding
        if (state.value.selectedEmployeeOnboarding) {
          state.value.selectedEmployeeOnboarding = response.data.data
        }
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to complete onboarding')
      }
    } catch (err) {
      console.error('Error completing onboarding:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to complete onboarding'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const fetchMyOnboardingTasks = async (newFilters = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const mergedFilters = { ...state.value.filters, ...newFilters }
      
      const response = await hrAPI.getMyOnboardingTasks(mergedFilters)
      
      if (response.data.success) {
        state.value.myTasks = response.data.data || []
        return state.value.myTasks
      } else {
        throw new Error(response.data.message || 'Failed to fetch my tasks')
      }
    } catch (err) {
      console.error('Error fetching my tasks:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch my tasks'
      state.value.myTasks = []
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const sendOnboardingReminder = async (employeeId) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.sendOnboardingReminder(employeeId)
      
      if (response.data.success) {
        return response.data
      } else {
        throw new Error(response.data.message || 'Failed to send reminder')
      }
    } catch (err) {
      console.error('Error sending reminder:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to send reminder'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const setFilters = (newFilters) => {
    state.value.filters = { ...state.value.filters, ...newFilters }
  }

  const resetFilters = () => {
    state.value.filters = {
      search: '',
      department_id: null,
      manager_id: null,
      status: 'onboarding',
      page: 1,
      per_page: 15
    }
  }

  const clearSelectedEmployeeOnboarding = () => {
    state.value.selectedEmployeeOnboarding = null
    state.value.checklist = []
    state.value.tasks = []
  }

  return {
    // State
    onboardingEmployees,
    loading,
    error,
    selectedEmployeeOnboarding,
    checklist,
    tasks,
    myTasks,
    meta,
    filters,
    // Actions
    fetchOnboardingEmployees,
    fetchEmployeeOnboardingProgress,
    fetchEmployeeOnboarding,
    fetchEmployeeOnboardingChecklist,
    fetchEmployeeOnboardingTasks,
    completeChecklistItem,
    updateOnboardingTask,
    completeOnboarding,
    fetchMyOnboardingTasks,
    sendOnboardingReminder,
    setFilters,
    resetFilters,
    clearSelectedEmployeeOnboarding
  }
})

