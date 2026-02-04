import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { hrAPI } from '../api/hrAPI'

const createFilters = (data = {}) => ({
  search: '',
  category: '',
  is_active: true,
  is_mandatory: '',
  employee_can_upload: '',
  sortBy: 'name',
  sortOrder: 'asc',
  page: 1,
  per_page: 15,
  ...data
})

export const useHrDocumentTypesStore = defineStore('hrDocumentTypes', () => {
  // State
  const state = ref({
    loading: false,
    error: null,
    documentTypes: [],
    selectedDocumentType: null,
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    },
    filters: createFilters()
  })

  // Getters
  const documentTypes = computed(() => state.value.documentTypes)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const selectedDocumentType = computed(() => state.value.selectedDocumentType)
  const meta = computed(() => state.value.meta)
  const filters = computed(() => state.value.filters)

  const activeDocumentTypes = computed(() => 
    state.value.documentTypes.filter(dt => dt.is_active)
  )

  const mandatoryDocumentTypes = computed(() =>
    state.value.documentTypes.filter(dt => dt.is_mandatory && dt.is_active)
  )

  // Actions
  const fetchDocumentTypes = async (newFilters = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const mergedFilters = { ...state.value.filters, ...newFilters }
      state.value.filters = mergedFilters
      
      const response = await hrAPI.getDocumentTypes(mergedFilters)
      
      if (response.data.success) {
        state.value.documentTypes = response.data.data || []
        state.value.meta = response.data.meta || state.value.meta
      } else {
        throw new Error(response.data.message || 'Failed to fetch document types')
      }
    } catch (err) {
      console.error('Error fetching document types:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch document types'
      state.value.documentTypes = []
    } finally {
      state.value.loading = false
    }
  }

  const fetchDocumentType = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getDocumentType(id)
      
      if (response.data.success) {
        state.value.selectedDocumentType = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch document type')
      }
    } catch (err) {
      console.error('Error fetching document type:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch document type'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const createDocumentType = async (data) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.createDocumentType(data)
      
      if (response.data.success) {
        // Add to list
        state.value.documentTypes.unshift(response.data.data)
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to create document type')
      }
    } catch (err) {
      console.error('Error creating document type:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to create document type'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const updateDocumentType = async (id, data) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.updateDocumentType(id, data)
      
      if (response.data.success) {
        // Update in list
        const index = state.value.documentTypes.findIndex(dt => dt.id === id)
        if (index !== -1) {
          state.value.documentTypes[index] = response.data.data
        }
        if (state.value.selectedDocumentType?.id === id) {
          state.value.selectedDocumentType = response.data.data
        }
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to update document type')
      }
    } catch (err) {
      console.error('Error updating document type:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to update document type'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const deleteDocumentType = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.deleteDocumentType(id)
      
      if (response.data.success) {
        // Remove from list
        const index = state.value.documentTypes.findIndex(dt => dt.id === id)
        if (index !== -1) {
          state.value.documentTypes.splice(index, 1)
        }
        if (state.value.selectedDocumentType?.id === id) {
          state.value.selectedDocumentType = null
        }
        return true
      } else {
        throw new Error(response.data.message || 'Failed to delete document type')
      }
    } catch (err) {
      console.error('Error deleting document type:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to delete document type'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const setFilters = (newFilters) => {
    state.value.filters = { ...state.value.filters, ...newFilters }
  }

  const resetFilters = () => {
    state.value.filters = createFilters()
  }

  const clearSelectedDocumentType = () => {
    state.value.selectedDocumentType = null
  }

  return {
    // State
    documentTypes,
    loading,
    error,
    selectedDocumentType,
    meta,
    filters,
    // Computed
    activeDocumentTypes,
    mandatoryDocumentTypes,
    // Actions
    fetchDocumentTypes,
    fetchDocumentType,
    createDocumentType,
    updateDocumentType,
    deleteDocumentType,
    setFilters,
    resetFilters,
    clearSelectedDocumentType
  }
})

