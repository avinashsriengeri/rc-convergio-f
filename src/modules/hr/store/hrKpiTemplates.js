import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { hrAPI } from '../api/hrAPI'

const createFilters = (data = {}) => ({
  search: '',
  status: '',
  department_id: null,
  designation_id: null,
  review_period: '',
  sortBy: 'created_at',
  sortOrder: 'desc',
  page: 1,
  per_page: 15,
  ...data
})

export const useHrKpiTemplatesStore = defineStore('hrKpiTemplates', () => {
  // State
  const state = ref({
    loading: false,
    error: null,
    templates: [],
    selectedTemplate: null,
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    },
    filters: createFilters()
  })

  // Getters
  const templates = computed(() => state.value.templates)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const selectedTemplate = computed(() => state.value.selectedTemplate)
  const meta = computed(() => state.value.meta)
  const filters = computed(() => state.value.filters)

  const stats = computed(() => {
    const allTemplates = state.value.templates
    return {
      total: allTemplates.length,
      published: allTemplates.filter(t => t.status === 'published').length,
      draft: allTemplates.filter(t => t.status === 'draft').length,
      active: allTemplates.filter(t => t.status === 'published' && !t.deleted_at).length
    }
  })

  // Actions
  const fetchTemplates = async (newFilters = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const mergedFilters = { ...state.value.filters, ...newFilters }
      state.value.filters = mergedFilters
      
      const response = await hrAPI.getKpiTemplates(mergedFilters)
      
      if (response.data.success) {
        state.value.templates = response.data.data || []
        state.value.meta = response.data.meta || state.value.meta
      } else {
        throw new Error(response.data.message || 'Failed to fetch templates')
      }
    } catch (err) {
      console.error('Error fetching KPI templates:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch templates'
      state.value.templates = []
    } finally {
      state.value.loading = false
    }
  }

  const fetchTemplate = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getKpiTemplate(id)
      
      if (response.data.success) {
        state.value.selectedTemplate = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Template not found')
      }
    } catch (err) {
      console.error('Error fetching KPI template:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch template'
      state.value.selectedTemplate = null
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const createTemplate = async (templateData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.createKpiTemplate(templateData)
      
      if (response.data.success) {
        const newTemplate = response.data.data
        state.value.templates.unshift(newTemplate)
        return newTemplate
      } else {
        throw new Error(response.data.message || 'Failed to create template')
      }
    } catch (err) {
      console.error('Error creating KPI template:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to create template'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const updateTemplate = async (id, templateData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.updateKpiTemplate(id, templateData)
      
      if (response.data.success) {
        const updatedTemplate = response.data.data
        const index = state.value.templates.findIndex(t => t.id === id)
        if (index !== -1) {
          state.value.templates[index] = updatedTemplate
        }
        if (state.value.selectedTemplate?.id === id) {
          state.value.selectedTemplate = updatedTemplate
        }
        return updatedTemplate
      } else {
        throw new Error(response.data.message || 'Failed to update template')
      }
    } catch (err) {
      console.error('Error updating KPI template:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to update template'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const deleteTemplate = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.deleteKpiTemplate(id)
      
      if (response.data.success) {
        const index = state.value.templates.findIndex(t => t.id === id)
        if (index !== -1) {
          state.value.templates.splice(index, 1)
        }
        if (state.value.selectedTemplate?.id === id) {
          state.value.selectedTemplate = null
        }
        return true
      } else {
        throw new Error(response.data.message || 'Failed to delete template')
      }
    } catch (err) {
      console.error('Error deleting KPI template:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to delete template'
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

  const clearSelectedTemplate = () => {
    state.value.selectedTemplate = null
  }

  return {
    // State
    templates,
    loading,
    error,
    selectedTemplate,
    meta,
    filters,
    // Getters
    stats,
    // Actions
    fetchTemplates,
    fetchTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    setFilters,
    resetFilters,
    clearSelectedTemplate
  }
})

