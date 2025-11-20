import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dealsAPI } from '../services/api'
import type { Deal, DealFilters, DealsSummary, PaginationMeta, LoadingState, DealFormData } from '../types'

// API Response interfaces
interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
  message?: string
}

interface DealsApiResponse extends ApiResponse<Deal[]> {}
interface DealApiResponse extends ApiResponse<Deal> {}
interface SummaryApiResponse extends ApiResponse<DealsSummary> {}

interface DealsState extends LoadingState {
  deals: Deal[]
  meta: PaginationMeta
  filters: DealFilters
  summary: DealsSummary | null
  selectedDeal: Deal | null
}

// Environment variable type declaration
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_API_BASE_URL?: string
    }
  }
}

export const useDealsStore = defineStore('deals', () => {
  // State
  const state = ref<DealsState>({
    loading: false,
    error: null,
    deals: [],
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 0,
      to: 0
    },
    filters: {
      search: '',
      status: 'all',
      pipeline_id: undefined,
      stage_id: undefined,
      owner_id: undefined,
      value_min: undefined,
      value_max: undefined,
      date_from: undefined,
      date_to: undefined,
      sort: '-created_at',
      page: 1,
      per_page: 15
    },
    summary: null,
    selectedDeal: null
  })

  // Getters
  const deals = computed(() => state.value.deals)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const meta = computed(() => state.value.meta)
  const filters = computed(() => state.value.filters)
  const summary = computed(() => state.value.summary)
  const selectedDeal = computed(() => state.value.selectedDeal)

  const openDeals = computed(() => 
    state.value.deals.filter(deal => deal.status === 'open')
  )

  const wonDeals = computed(() => 
    state.value.deals.filter(deal => deal.status === 'won')
  )

  const lostDeals = computed(() => 
    state.value.deals.filter(deal => deal.status === 'lost')
  )

  const closedDeals = computed(() => 
    state.value.deals.filter(deal => deal.status === 'closed')
  )

  const dealsByStage = computed(() => {
    const grouped: Record<number, Deal[]> = {}
    state.value.deals.forEach(deal => {
      if (!grouped[deal.stage_id]) {
        grouped[deal.stage_id] = []
      }
      grouped[deal.stage_id].push(deal)
    })
    return grouped
  })

  const dealsByPipeline = computed(() => {
    const grouped: Record<number, Deal[]> = {}
    state.value.deals.forEach(deal => {
      if (!grouped[deal.pipeline_id]) {
        grouped[deal.pipeline_id] = []
      }
      grouped[deal.pipeline_id].push(deal)
    })
    return grouped
  })

  const totalValue = computed(() => 
    state.value.deals.reduce((sum, deal) => sum + (deal.value || 0), 0)
  )

  const averageDealSize = computed(() => 
    state.value.deals.length > 0 ? totalValue.value / state.value.deals.length : 0
  )

  // Actions
  const fetchDeals = async (newFilters?: Partial<DealFilters>): Promise<void> => {
    if (newFilters) {
      state.value.filters = { ...state.value.filters, ...newFilters }
    }

    // Clean filters - remove undefined, null, empty values, and 'all'
    const cleanFilters = { ...state.value.filters }
    Object.keys(cleanFilters).forEach(key => {
      const value = cleanFilters[key as keyof DealFilters]
      // Remove if undefined, null, empty string, 'all', or NaN
      if (value === undefined || 
          value === null || 
          value === '' || 
          value === 'all' ||
          (typeof value === 'number' && isNaN(value))) {
        delete cleanFilters[key as keyof DealFilters]
      }
    })

    state.value.loading = true
    state.value.error = null

    try {
      console.log('Fetching deals with clean filters:', cleanFilters)
      console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/')
      console.log('Full API URL:', `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/'}deals`)
      
      const response = await dealsAPI.getDeals(cleanFilters)
      console.log('Deals API response:', response)
      console.log('Response data:', response.data)
      console.log('Response data.data:', response.data.data)
      console.log('Response data.meta:', response.data.meta)
      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)
      
      // Handle different response structures
      if (response.data && Array.isArray(response.data)) {
        // Direct array response
        state.value.deals = response.data
        console.log('Using direct array response')
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Nested data structure
        state.value.deals = response.data.data
        state.value.meta = response.data.meta || state.value.meta
        console.log('Using nested data structure')
      } else {
        // Empty or unexpected structure
        state.value.deals = []
        console.log('Empty or unexpected response structure')
      }
      
      console.log('Final deals array:', state.value.deals)
      console.log('Deals loaded:', state.value.deals.length)
      
      // If API returns empty data, keep it empty (no sample data)
      if (state.value.deals.length === 0) {
        console.log('API returned empty data - no deals found')
      }
      
      console.log('Final deals loaded:', state.value.deals.length)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string }, status?: number }, config?: any }
      state.value.error = error.response?.data?.message || 'Failed to fetch deals'
      console.error('Error fetching deals:', err)
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      })
      
      // Keep deals empty when API fails
      console.log('API failed - keeping deals empty')
      state.value.deals = []
      state.value.meta.total = 0
    } finally {
      state.value.loading = false
    }
  }

  const fetchDeal = async (id: number): Promise<Deal | null> => {
    try {
      console.log('Fetching deal from API:', id)
      const response = await dealsAPI.getDeal(id)
      console.log('Full deal API response:', response)
      
      // Extract deal data and documents from the response
      const deal = response.data.data
      const documents = response.data.documents || []
      
      // Add documents to the deal object if they exist
      if (documents.length > 0) {
        deal.documents = documents
        console.log(`Deal store: Added ${documents.length} documents to deal ${deal.id}`)
        console.log('Deal store: Documents data:', documents)
      }
      
      state.value.selectedDeal = deal
      console.log('Deal fetched from API with documents:', deal)
      return deal
    } catch (err: unknown) {
      console.error('Error fetching deal from API:', err)
      return null
    }
  }

  const createDeal = async (data: DealFormData): Promise<Deal> => {
    state.value.loading = true
    state.value.error = null

    try {
      console.log('Creating deal with data:', data)
      console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/')
      
      // Call the backend API
      const response = await dealsAPI.createDeal(data)
      console.log('Create deal response:', response)
      const newDeal = response.data.data
      console.log('New deal created from API:', newDeal)
      
      // Add the new deal to the list
      console.log('Adding new deal to local list')
      state.value.deals.unshift(newDeal)
      state.value.meta.total += 1
      
      return newDeal
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string }, status?: number }, config?: any }
      console.error('API create failed:', err)
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      })
      
      state.value.error = error.response?.data?.message || 'Failed to create deal'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const updateDeal = async (id: number, data: Partial<DealFormData>): Promise<Deal> => {
    state.value.loading = true
    state.value.error = null

    try {
      console.log('Updating deal with data:', data)
      console.log('Deal ID:', id)
      
      // Call the backend API
      const response = await dealsAPI.updateDeal(id, data)
      console.log('Update deal response:', response)
      const updatedDeal = response.data.data
      console.log('Updated deal from API:', updatedDeal)
      
      // Update in list
      const index = state.value.deals.findIndex(d => d.id === id)
      if (index !== -1) {
        state.value.deals[index] = updatedDeal
        console.log('Updated deal in local list')
      }
      
      // Update selected deal if it's the same
      if (state.value.selectedDeal?.id === id) {
        state.value.selectedDeal = updatedDeal
        console.log('Updated selected deal')
      }
      
      return updatedDeal
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string }, status?: number }, config?: any }
      console.error('API update failed:', err)
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      })
      
      state.value.error = error.response?.data?.message || 'Failed to update deal'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const deleteDeal = async (id: number): Promise<void> => {
    state.value.loading = true
    state.value.error = null

    try {
      await dealsAPI.deleteDeal(id)
      
      // Remove from list
      const index = state.value.deals.findIndex(d => d.id === id)
      if (index !== -1) {
        state.value.deals.splice(index, 1)
        state.value.meta.total -= 1
      }
      
      // Clear selected deal if it's the same
      if (state.value.selectedDeal?.id === id) {
        state.value.selectedDeal = null
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      state.value.error = error.response?.data?.message || 'Failed to delete deal'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const moveDeal = async (id: number, stageId: number, reason: string): Promise<Deal> => {
    try {
      const response = await dealsAPI.moveDeal(id, stageId, reason)
      const updatedDeal = response.data.data
      
      // Store stage_movement if provided in response (for immediate UI updates)
      if (response.data.stage_movement) {
        // Can be used by components to show movement info immediately
      }
      
      // Update in list
      const index = state.value.deals.findIndex(d => d.id === id)
      if (index !== -1) {
        state.value.deals[index] = updatedDeal
      }
      
      // Update selected deal if it's the same
      if (state.value.selectedDeal?.id === id) {
        state.value.selectedDeal = updatedDeal
      }
      
      return updatedDeal
    } catch (err: unknown) {
      console.error('Error moving deal:', err)
      throw err
    }
  }

  const fetchDealStageHistory = async (id: number, params = {}): Promise<any[]> => {
    try {
      const response = await dealsAPI.getDealStageHistory(id, params)
      return response.data.data || []
    } catch (err: unknown) {
      console.error('Error fetching stage history:', err)
      return []
    }
  }

  const fetchDealsByStage = async (stageId: number): Promise<Deal[]> => {
    try {
      const response = await dealsAPI.getDealsByStage(stageId)
      return response.data.data
    } catch (err: unknown) {
      console.error('Error fetching deals by stage:', err)
      return []
    }
  }

  const fetchDealsByPipeline = async (pipelineId: number): Promise<Deal[]> => {
    try {
      const response = await dealsAPI.getDealsByPipeline(pipelineId)
      return response.data.data
    } catch (err: unknown) {
      console.error('Error fetching deals by pipeline:', err)
      return []
    }
  }

  const fetchSummary = async (range: string = '30d'): Promise<DealsSummary | null> => {
    try {
      const response = await dealsAPI.getDealsSummary(range)
      state.value.summary = response.data.data
      return response.data.data
    } catch (err: unknown) {
      console.error('Error fetching deals summary:', err)
      return null
    }
  }

  const bulkUpdate = async (dealIds: number[], data: Partial<DealFormData>): Promise<any> => {
    try {
      const response = await dealsAPI.bulkUpdate(dealIds, data)
      
      // Update deals in list
      dealIds.forEach(dealId => {
        const index = state.value.deals.findIndex(d => d.id === dealId)
        if (index !== -1) {
          state.value.deals[index] = { ...state.value.deals[index], ...data }
        }
      })
      
      return response.data
    } catch (err: unknown) {
      console.error('Error bulk updating deals:', err)
      throw err
    }
  }

  const exportDeals = async (params: DealFilters = {}): Promise<boolean> => {
    try {
      const response = await dealsAPI.exportDeals(params)
      
      // Create download link
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `deals-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      return true
    } catch (err: unknown) {
      console.error('Error exporting deals:', err)
      throw err
    }
  }

  const setSelectedDeal = (deal: Deal | null): void => {
    state.value.selectedDeal = deal
  }

  const clearError = (): void => {
    state.value.error = null
  }

  const resetFilters = (): void => {
    state.value.filters = {
      search: '',
      status: 'all',
      pipeline_id: undefined,
      stage_id: undefined,
      owner_id: undefined,
      value_min: undefined,
      value_max: undefined,
      date_from: undefined,
      date_to: undefined,
      sort: '-created_at',
      page: 1,
      per_page: 15
    }
  }

  // Helper function to check if a deal matches current filters
  const matchesFilters = (deal: Deal, filters: DealFilters): boolean => {
    if (filters.status && filters.status !== 'all' && deal.status !== filters.status) {
      return false
    }
    if (filters.pipeline_id && deal.pipeline_id !== filters.pipeline_id) {
      return false
    }
    if (filters.stage_id && deal.stage_id !== filters.stage_id) {
      return false
    }
    if (filters.owner_id && deal.owner_id !== filters.owner_id) {
      return false
    }
    if (filters.value_min && (deal.value || 0) < filters.value_min) {
      return false
    }
    if (filters.value_max && (deal.value || 0) > filters.value_max) {
      return false
    }
    return true
  }

  return {
    // State
    deals,
    loading,
    error,
    meta,
    filters,
    summary,
    selectedDeal,
    openDeals,
    wonDeals,
    lostDeals,
    closedDeals,
    dealsByStage,
    dealsByPipeline,
    totalValue,
    averageDealSize,
    
    // Actions
    fetchDeals,
    fetchDeal,
    createDeal,
    updateDeal,
    deleteDeal,
    moveDeal,
    fetchDealsByStage,
    fetchDealsByPipeline,
    fetchSummary,
    bulkUpdate,
    exportDeals,
    setSelectedDeal,
    clearError,
    resetFilters
  }
})
