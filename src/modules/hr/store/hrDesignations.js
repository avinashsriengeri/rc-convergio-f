import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { hrAPI } from '../api/hrAPI'

export const useHrDesignationsStore = defineStore('hrDesignations', () => {
  // State
  const state = ref({
    loading: false,
    error: null,
    designations: [],
    selectedDesignation: null,
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    },
    filters: {
      search: '',
      is_active: true,
      department_id: null, // NEW: Filter by department
      sortBy: 'name',
      sortOrder: 'asc',
      page: 1,
      per_page: 15
    }
  })

  // Getters
  const designations = computed(() => state.value.designations)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const selectedDesignation = computed(() => state.value.selectedDesignation)
  const meta = computed(() => state.value.meta)
  const filters = computed(() => state.value.filters)

  const activeDesignations = computed(() =>
    state.value.designations.filter(des => des.is_active)
  )

  // Actions
  const fetchDesignations = async (newFilters = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const mergedFilters = { ...state.value.filters, ...newFilters }
      state.value.filters = mergedFilters
      
      const response = await hrAPI.getDesignations(mergedFilters)
      
      if (response.data.success) {
        state.value.designations = response.data.data || []
        state.value.meta = response.data.pagination || response.data.meta || state.value.meta
      } else {
        throw new Error(response.data.message || 'Failed to fetch designations')
      }
    } catch (err) {
      console.error('Error fetching designations:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch designations'
      state.value.designations = []
    } finally {
      state.value.loading = false
    }
  }

  const fetchDesignation = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getDesignation(id)
      
      if (response.data.success) {
        state.value.selectedDesignation = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Designation not found')
      }
    } catch (err) {
      console.error('Error fetching designation:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch designation'
      state.value.selectedDesignation = null
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const createDesignation = async (designationData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.createDesignation(designationData)
      
      if (response.data.success) {
        const newDesignation = response.data.data
        // Check if designation already exists (in case of duplicate create)
        const exists = state.value.designations.find(d => d.id === newDesignation.id)
        if (!exists) {
          // Add to the beginning of the list
          state.value.designations.unshift(newDesignation)
          // Update meta total count
          if (state.value.meta) {
            state.value.meta.total = (state.value.meta.total || 0) + 1
          }
        }
        return newDesignation
      } else {
        throw new Error(response.data.message || 'Failed to create designation')
      }
    } catch (err) {
      console.error('Error creating designation:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to create designation'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const updateDesignation = async (id, designationData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.updateDesignation(id, designationData)
      
      if (response.data.success) {
        const updatedDesignation = response.data.data
        const index = state.value.designations.findIndex(des => des.id === id)
        if (index !== -1) {
          state.value.designations[index] = updatedDesignation
        }
        if (state.value.selectedDesignation?.id === id) {
          state.value.selectedDesignation = updatedDesignation
        }
        return updatedDesignation
      } else {
        throw new Error(response.data.message || 'Failed to update designation')
      }
    } catch (err) {
      console.error('Error updating designation:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to update designation'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const deleteDesignation = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.deleteDesignation(id)
      
      if (response.data.success) {
        const index = state.value.designations.findIndex(des => des.id === id)
        if (index !== -1) {
          state.value.designations.splice(index, 1)
        }
        if (state.value.selectedDesignation?.id === id) {
          state.value.selectedDesignation = null
        }
        return true
      } else {
        throw new Error(response.data.message || 'Failed to delete designation')
      }
    } catch (err) {
      console.error('Error deleting designation:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to delete designation'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const fetchDesignationsByDepartment = async (departmentId) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getDesignationsByDepartment(departmentId)
      
      if (response.data.success) {
        return response.data.data || []
      } else {
        throw new Error(response.data.message || 'Failed to fetch designations')
      }
    } catch (err) {
      console.error('Error fetching designations by department:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch designations'
      return []
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
      department_id: null,
      sortBy: 'name',
      sortOrder: 'asc',
      page: 1,
      per_page: 15
    }
  }

  const clearSelectedDesignation = () => {
    state.value.selectedDesignation = null
  }

  return {
    // State
    designations,
    loading,
    error,
    selectedDesignation,
    meta,
    filters,
    // Getters
    activeDesignations,
    // Actions
    fetchDesignations,
    fetchDesignation,
    createDesignation,
    updateDesignation,
    deleteDesignation,
    setFilters,
    resetFilters,
    clearSelectedDesignation,
    fetchDesignationsByDepartment
  }
})

