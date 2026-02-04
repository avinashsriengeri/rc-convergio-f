import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { hrAPI } from '../api/hrAPI'

export const useHrOnboardingTemplatesStore = defineStore('hrOnboardingTemplates', () => {
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
    filters: {
      search: '',
      category: '',
      is_active: true,
      page: 1,
      per_page: 15
    }
  })

  // Getters
  const templates = computed(() => state.value.templates)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const selectedTemplate = computed(() => state.value.selectedTemplate)
  const meta = computed(() => state.value.meta)
  const filters = computed(() => state.value.filters)
  const activeTemplates = computed(() => state.value.templates.filter(t => t.is_active))

  // Actions
  const fetchTemplates = async (newFilters = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const mergedFilters = { ...state.value.filters, ...newFilters }
      state.value.filters = mergedFilters
      
      const response = await hrAPI.getOnboardingTemplates(mergedFilters)
      
      if (response.data.success) {
        state.value.templates = response.data.data || []
        state.value.meta = response.data.pagination || response.data.meta || state.value.meta
      } else {
        throw new Error(response.data.message || 'Failed to fetch templates')
      }
    } catch (err) {
      console.error('Error fetching templates:', err)
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
      const response = await hrAPI.getOnboardingTemplate(id)
      
      if (response.data.success) {
        state.value.selectedTemplate = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch template')
      }
    } catch (err) {
      console.error('Error fetching template:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch template'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const createTemplate = async (templateData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.createOnboardingTemplate(templateData)
      
      if (response.data.success) {
        const newTemplate = response.data.data
        state.value.templates.unshift(newTemplate)
        state.value.meta.total++
        return newTemplate
      } else {
        throw new Error(response.data.message || 'Failed to create template')
      }
    } catch (err) {
      console.error('Error creating template:', err)
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
      const response = await hrAPI.updateOnboardingTemplate(id, templateData)
      
      if (response.data.success) {
        const index = state.value.templates.findIndex(t => t.id === id)
        if (index !== -1) {
          state.value.templates[index] = response.data.data
        }
        if (state.value.selectedTemplate?.id === id) {
          state.value.selectedTemplate = response.data.data
        }
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to update template')
      }
    } catch (err) {
      console.error('Error updating template:', err)
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
      const response = await hrAPI.deleteOnboardingTemplate(id)
      
      if (response.data.success) {
        state.value.templates = state.value.templates.filter(t => t.id !== id)
        state.value.meta.total--
        if (state.value.selectedTemplate?.id === id) {
          state.value.selectedTemplate = null
        }
        return true
      } else {
        throw new Error(response.data.message || 'Failed to delete template')
      }
    } catch (err) {
      console.error('Error deleting template:', err)
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
    state.value.filters = {
      search: '',
      category: '',
      is_active: true,
      page: 1,
      per_page: 15
    }
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
    activeTemplates,
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


