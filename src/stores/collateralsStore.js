import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { collateralsAPI } from '@/services/api'
import { success, error } from '@/utils/notifications'

export const useCollateralsStore = defineStore('collaterals', () => {
  // State
  const state = ref({
    loading: false,
    error: null,
    collaterals: [],
    selected: null,
    types: [],
    pagination: {
      current_page: 1,
      per_page: 15,
      total: 0,
      last_page: 1,
      from: 0,
      to: 0
    },
    filters: {
      product_id: '',
      collateral_type: '',
      is_active: true,
      search: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    }
  })

  // Getters
  const collaterals = computed(() => state.value.collaterals)
  const selected = computed(() => state.value.selected)
  const loading = computed(() => state.value.loading)
  const types = computed(() => state.value.types)
  const error = computed(() => state.value.error)
  const pagination = computed(() => state.value.pagination)
  const filters = computed(() => state.value.filters)

  // Actions
  const fetchTypes = async () => {
    try {
      const response = await collateralsAPI.getTypes()
      state.value.types = response.data.data || []
    } catch (err) {
      console.error('Error fetching collateral types:', err)
      state.value.types = []
    }
  }

  const fetchCollaterals = async (params = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const mergedParams = { ...state.value.filters, ...params }
      
      // Clean params: remove empty strings, undefined, and null values
      // This prevents backend from receiving null values for string-required scopes
      const cleanParams = Object.keys(mergedParams).reduce((acc, key) => {
        const value = mergedParams[key]
        // Only include non-empty, defined values
        // For boolean values, include them as-is
        // For string/number values, exclude empty strings and null
        if (value !== '' && value !== undefined && value !== null) {
          acc[key] = value
        }
        return acc
      }, {})
      
      const response = await collateralsAPI.getCollaterals(cleanParams)
      
      if (response.data && response.data.data) {
        state.value.collaterals = response.data.data
        if (response.data.meta) {
          state.value.pagination = {
            current_page: response.data.meta.current_page || 1,
            per_page: response.data.meta.per_page || 15,
            total: response.data.meta.total || 0,
            last_page: response.data.meta.last_page || 1,
            from: response.data.meta.from || 0,
            to: response.data.meta.to || 0
          }
        }
      } else {
        state.value.collaterals = []
      }
    } catch (err) {
      state.value.error = 'Failed to fetch collaterals'
      console.error('Error fetching collaterals:', err)
      error('Failed to load collaterals')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const getCollateral = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await collateralsAPI.getCollateral(id)
      state.value.selected = response.data.data || response.data
      return state.value.selected
    } catch (err) {
      state.value.error = 'Failed to fetch collateral'
      console.error('Error fetching collateral:', err)
      error('Failed to load collateral')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const uploadCollateral = async (formData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await collateralsAPI.uploadCollateral(formData)
      const newCollateral = response.data.data || response.data
      state.value.collaterals.unshift(newCollateral)
      success('Collateral uploaded successfully')
      return newCollateral
    } catch (err) {
      state.value.error = 'Failed to upload collateral'
      console.error('Error uploading collateral:', err)
      const errorMessage = err.response?.data?.message || 'Failed to upload collateral'
      error(errorMessage)
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const updateCollateral = async (id, data) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await collateralsAPI.updateCollateral(id, data)
      const updatedCollateral = response.data.data || response.data
      
      const index = state.value.collaterals.findIndex(c => c.id === id)
      if (index !== -1) {
        state.value.collaterals[index] = updatedCollateral
      }
      
      if (state.value.selected && state.value.selected.id === id) {
        state.value.selected = updatedCollateral
      }
      
      success('Collateral updated successfully')
      return updatedCollateral
    } catch (err) {
      state.value.error = 'Failed to update collateral'
      console.error('Error updating collateral:', err)
      const errorMessage = err.response?.data?.message || 'Failed to update collateral'
      error(errorMessage)
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const deleteCollateral = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      await collateralsAPI.deleteCollateral(id)
      state.value.collaterals = state.value.collaterals.filter(c => c.id !== id)
      
      if (state.value.selected && state.value.selected.id === id) {
        state.value.selected = null
      }
      
      success('Collateral deleted successfully')
    } catch (err) {
      state.value.error = 'Failed to delete collateral'
      console.error('Error deleting collateral:', err)
      error('Failed to delete collateral')
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const getCollateralsByProduct = async (productId, params = {}) => {
    try {
      const response = await collateralsAPI.getCollateralsByProduct(productId, params)
      return response.data.data || []
    } catch (err) {
      console.error('Error fetching collaterals by product:', err)
      return []
    }
  }

  const sendCollateral = async (data) => {
    try {
      const response = await collateralsAPI.sendCollateral(data)
      success('Collateral sent successfully')
      return response.data
    } catch (err) {
      console.error('Error sending collateral:', err)
      const errorMessage = err.response?.data?.message || 'Failed to send collateral'
      error(errorMessage)
      throw err
    }
  }

  const getSentCollaterals = async (contactId) => {
    try {
      const response = await collateralsAPI.getSentCollaterals(contactId)
      return response.data.data || []
    } catch (err) {
      console.error('Error fetching sent collaterals:', err)
      return []
    }
  }

  const previewCollateral = async (id) => {
    try {
      const response = await collateralsAPI.previewCollateral(id)
      return response
    } catch (err) {
      console.error('Error previewing collateral:', err)
      error('Failed to preview collateral')
      throw err
    }
  }

  const downloadCollateral = async (id) => {
    try {
      const response = await collateralsAPI.downloadCollateral(id)
      return response
    } catch (err) {
      console.error('Error downloading collateral:', err)
      error('Failed to download collateral')
      throw err
    }
  }

  const setFilters = (newFilters) => {
    state.value.filters = { ...state.value.filters, ...newFilters }
  }

  const clearFilters = () => {
    state.value.filters = {
      product_id: '',
      collateral_type: '',
      is_active: true,
      search: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    }
  }

  const resetState = () => {
    state.value.collaterals = []
    state.value.selected = null
    state.value.error = null
    state.value.loading = false
  }

  return {
    // State
    collaterals,
    selected,
    loading,
    types,
    error,
    pagination,
    filters,
    // Actions
    fetchTypes,
    fetchCollaterals,
    getCollateral,
    uploadCollateral,
    updateCollateral,
    deleteCollateral,
    getCollateralsByProduct,
    sendCollateral,
    getSentCollaterals,
    previewCollateral,
    downloadCollateral,
    setFilters,
    clearFilters,
    resetState
  }
})

