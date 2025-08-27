import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { pipelinesAPI } from '@/services/api'
import type { Pipeline, PipelineFilters, PaginationMeta, LoadingState } from '@/types'

interface PipelinesState extends LoadingState {
  pipelines: Pipeline[]
  meta: PaginationMeta
  filters: PipelineFilters
}

export const usePipelinesStore = defineStore('pipelines', () => {
  // State
  const state = ref<PipelinesState>({
    loading: false,
    error: null,
    pipelines: [],
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 0,
      to: 0
    },
    filters: {
      page: 1,
      per_page: 15,
      sort: '-created_at'
    }
  })

  // Getters
  const pipelines = computed(() => state.value.pipelines)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const meta = computed(() => state.value.meta)
  const filters = computed(() => state.value.filters)

  const activePipelines = computed(() => 
    state.value.pipelines.filter(pipeline => pipeline.is_active)
  )

  // Actions
  const fetchPipelines = async (newFilters?: Partial<PipelineFilters>) => {
    if (newFilters) {
      state.value.filters = { ...state.value.filters, ...newFilters }
    }

    state.value.loading = true
    state.value.error = null

    try {
      const response = await pipelinesAPI.getPipelines(state.value.filters)
      state.value.pipelines = response.data.data
      state.value.meta = response.data.meta || state.value.meta
    } catch (err: any) {
      state.value.error = err.response?.data?.message || 'Failed to fetch pipelines'
      console.error('Error fetching pipelines:', err)
      
      // Add sample data for testing when API fails
      state.value.pipelines = [
        {
          id: 1,
          name: 'Sales Pipeline',
          description: 'Standard sales process',
          is_active: true,
          deals_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Lead Generation',
          description: 'Lead qualification process',
          is_active: true,
          deals_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    } finally {
      state.value.loading = false
    }
  }

  const fetchPipeline = async (id: number): Promise<Pipeline | null> => {
    try {
      const response = await pipelinesAPI.getPipeline(id)
      return response.data.data
    } catch (err: any) {
      console.error('Error fetching pipeline:', err)
      return null
    }
  }

  const createPipeline = async (data: { name: string; description?: string; is_active?: boolean }) => {
    state.value.loading = true
    state.value.error = null

    try {
      const response = await pipelinesAPI.createPipeline(data)
      const newPipeline = response.data.data
      
      // Add to list if it matches current filters
      if (newPipeline.is_active || !state.value.filters.is_active) {
        state.value.pipelines.unshift(newPipeline)
        state.value.meta.total += 1
      }
      
      return newPipeline
    } catch (err: any) {
      state.value.error = err.response?.data?.message || 'Failed to create pipeline'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const updatePipeline = async (id: number, data: Partial<{ name: string; description: string; is_active: boolean }>) => {
    state.value.loading = true
    state.value.error = null

    try {
      const response = await pipelinesAPI.updatePipeline(id, data)
      const updatedPipeline = response.data.data
      
      // Update in list
      const index = state.value.pipelines.findIndex(p => p.id === id)
      if (index !== -1) {
        state.value.pipelines[index] = updatedPipeline
      }
      
      return updatedPipeline
    } catch (err: any) {
      state.value.error = err.response?.data?.message || 'Failed to update pipeline'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const deletePipeline = async (id: number) => {
    state.value.loading = true
    state.value.error = null

    try {
      await pipelinesAPI.deletePipeline(id)
      
      // Remove from list
      const index = state.value.pipelines.findIndex(p => p.id === id)
      if (index !== -1) {
        state.value.pipelines.splice(index, 1)
        state.value.meta.total -= 1
      }
    } catch (err: any) {
      state.value.error = err.response?.data?.message || 'Failed to delete pipeline'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const toggleActive = async (id: number) => {
    try {
      const response = await pipelinesAPI.toggleActive(id)
      const updatedPipeline = response.data.data
      
      // Update in list
      const index = state.value.pipelines.findIndex(p => p.id === id)
      if (index !== -1) {
        state.value.pipelines[index] = updatedPipeline
      }
      
      return updatedPipeline
    } catch (err: any) {
      console.error('Error toggling pipeline active status:', err)
      throw err
    }
  }

  const fetchActivePipelines = async () => {
    try {
      const response = await pipelinesAPI.getActivePipelines()
      return response.data.data
    } catch (err: any) {
      console.error('Error fetching active pipelines:', err)
      return []
    }
  }

  const clearError = () => {
    state.value.error = null
  }

  const resetFilters = () => {
    state.value.filters = {
      page: 1,
      per_page: 15,
      sort: '-created_at'
    }
  }

  return {
    // State
    pipelines,
    loading,
    error,
    meta,
    filters,
    activePipelines,
    
    // Actions
    fetchPipelines,
    fetchPipeline,
    createPipeline,
    updatePipeline,
    deletePipeline,
    toggleActive,
    fetchActivePipelines,
    clearError,
    resetFilters
  }
})
