import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { hrAPI } from '../api/hrAPI'

export const useHrDepartmentsStore = defineStore('hrDepartments', () => {
  // State
  const state = ref({
    loading: false,
    error: null,
    departments: [],
    selectedDepartment: null,
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    },
    filters: {
      search: '',
      is_active: true,
      sortBy: 'name',
      sortOrder: 'asc',
      page: 1,
      per_page: 15
    }
  })

  // Getters
  const departments = computed(() => state.value.departments)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const selectedDepartment = computed(() => state.value.selectedDepartment)
  const meta = computed(() => state.value.meta)
  const filters = computed(() => state.value.filters)

  const activeDepartments = computed(() =>
    state.value.departments.filter(dept => dept.is_active)
  )

  // Actions
  const fetchDepartments = async (newFilters = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const mergedFilters = { ...state.value.filters, ...newFilters }
      state.value.filters = mergedFilters
      
      const response = await hrAPI.getDepartments(mergedFilters)
      
      if (response.data.success) {
        state.value.departments = response.data.data || []
        state.value.meta = response.data.pagination || response.data.meta || state.value.meta
      } else {
        throw new Error(response.data.message || 'Failed to fetch departments')
      }
    } catch (err) {
      console.error('Error fetching departments:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch departments'
      state.value.departments = []
    } finally {
      state.value.loading = false
    }
  }

  const fetchDepartment = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getDepartment(id)
      
      if (response.data.success) {
        state.value.selectedDepartment = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Department not found')
      }
    } catch (err) {
      console.error('Error fetching department:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch department'
      state.value.selectedDepartment = null
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const createDepartment = async (departmentData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.createDepartment(departmentData)
      
      if (response.data.success) {
        const newDepartment = response.data.data
        // Check if department already exists (in case of duplicate create)
        const exists = state.value.departments.find(d => d.id === newDepartment.id)
        if (!exists) {
          // Add to the beginning of the list
          state.value.departments.unshift(newDepartment)
          // Update meta total count
          if (state.value.meta) {
            state.value.meta.total = (state.value.meta.total || 0) + 1
          }
        }
        return newDepartment
      } else {
        throw new Error(response.data.message || 'Failed to create department')
      }
    } catch (err) {
      console.error('Error creating department:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to create department'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const updateDepartment = async (id, departmentData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.updateDepartment(id, departmentData)
      
      if (response.data.success) {
        const updatedDepartment = response.data.data
        const index = state.value.departments.findIndex(dept => dept.id === id)
        if (index !== -1) {
          state.value.departments[index] = updatedDepartment
        }
        if (state.value.selectedDepartment?.id === id) {
          state.value.selectedDepartment = updatedDepartment
        }
        return updatedDepartment
      } else {
        throw new Error(response.data.message || 'Failed to update department')
      }
    } catch (err) {
      console.error('Error updating department:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to update department'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const deleteDepartment = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.deleteDepartment(id)
      
      if (response.data.success) {
        const index = state.value.departments.findIndex(dept => dept.id === id)
        if (index !== -1) {
          state.value.departments.splice(index, 1)
        }
        if (state.value.selectedDepartment?.id === id) {
          state.value.selectedDepartment = null
        }
        return true
      } else {
        throw new Error(response.data.message || 'Failed to delete department')
      }
    } catch (err) {
      console.error('Error deleting department:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to delete department'
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
      is_active: true,
      sortBy: 'name',
      sortOrder: 'asc',
      page: 1,
      per_page: 15
    }
  }

  const clearSelectedDepartment = () => {
    state.value.selectedDepartment = null
  }

  return {
    // State
    departments,
    loading,
    error,
    selectedDepartment,
    meta,
    filters,
    // Getters
    activeDepartments,
    // Actions
    fetchDepartments,
    fetchDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    setFilters,
    resetFilters,
    clearSelectedDepartment
  }
})

