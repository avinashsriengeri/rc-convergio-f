import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { campaignsAPI } from '../services/api'
import type { Campaign, CampaignFormData, PaginationMeta, LoadingState, CampaignMetrics } from '../types'

// API Response interfaces
interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
  message?: string
}

interface CampaignsApiResponse extends ApiResponse<Campaign[]> {}
interface CampaignApiResponse extends ApiResponse<Campaign> {}
interface MetricsApiResponse extends ApiResponse<CampaignMetrics> {}

interface CampaignsState extends LoadingState {
  campaigns: Campaign[]
  meta: PaginationMeta
  filters: any
  selectedCampaign: Campaign | null
  campaignMetrics: CampaignMetrics | null
}

// Environment variable type declaration
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_API_BASE_URL?: string
    }
  }
}

export const useCampaignsStore = defineStore('campaigns', () => {
  // State
  const state = ref<CampaignsState>({
    loading: false,
    error: null,
    campaigns: [],
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
      type: 'all',
      owner_id: undefined,
      date_range: 'all',
      sort: '-created_at',
      page: 1,
      per_page: 15
    },
    selectedCampaign: null,
    campaignMetrics: null
  })

  // Getters
  const campaigns = computed(() => state.value.campaigns)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const meta = computed(() => state.value.meta)
  const filters = computed(() => state.value.filters)
  const selectedCampaign = computed(() => state.value.selectedCampaign)
  const campaignMetrics = computed(() => state.value.campaignMetrics)

  const draftCampaigns = computed(() => 
    state.value.campaigns.filter(campaign => campaign.status === 'draft')
  )

  const scheduledCampaigns = computed(() => 
    state.value.campaigns.filter(campaign => campaign.status === 'scheduled')
  )

  const sentCampaigns = computed(() => 
    state.value.campaigns.filter(campaign => campaign.status === 'sent')
  )

  const campaignsByType = computed(() => {
    const grouped: Record<string, Campaign[]> = {
      email: [],
      sms: [],
      newsletter: [],
      promotional: []
    }
    state.value.campaigns.forEach(campaign => {
      if (grouped[campaign.type]) {
        grouped[campaign.type].push(campaign)
      }
    })
    return grouped
  })

  // Actions
  const fetchCampaigns = async (newFilters?: any): Promise<void> => {
    if (newFilters) {
      state.value.filters = { ...state.value.filters, ...newFilters }
    }

    // Clean filters - remove undefined, null, empty values
    const cleanFilters = { ...state.value.filters }
    Object.keys(cleanFilters).forEach(key => {
      if (cleanFilters[key] === undefined || 
          cleanFilters[key] === null || 
          cleanFilters[key] === '' || 
          cleanFilters[key] === 'all') {
        delete cleanFilters[key]
      }
    })

    state.value.loading = true
    state.value.error = null

    try {
      console.log('Fetching campaigns with clean filters:', cleanFilters)
      const response = await campaignsAPI.getCampaigns(cleanFilters)
      console.log('Campaigns API response:', response)
      
      // Handle different response structures
      if (response.data && Array.isArray(response.data)) {
        // Direct array response
        state.value.campaigns = response.data
        console.log('Using direct array response')
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Nested data structure
        state.value.campaigns = response.data.data
        state.value.meta = response.data.meta || state.value.meta
        console.log('Using nested data structure')
      } else {
        // Empty or unexpected structure
        state.value.campaigns = []
        console.log('Empty or unexpected response structure')
      }
      
      console.log('Campaigns loaded:', state.value.campaigns.length)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string }, status?: number }, config?: any }
      state.value.error = error.response?.data?.message || 'Failed to fetch campaigns'
      console.error('Error fetching campaigns:', err)
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      })
      
      // Keep campaigns empty when API fails
      state.value.campaigns = []
      state.value.meta.total = 0
    } finally {
      state.value.loading = false
    }
  }

  const fetchCampaign = async (id: number): Promise<Campaign | null> => {
    try {
      console.log('Fetching campaign from API:', id)
      const response = await campaignsAPI.getCampaign(id)
      const campaign = response.data.data
      state.value.selectedCampaign = campaign
      console.log('Campaign fetched from API:', campaign)
      return campaign
    } catch (err: unknown) {
      console.error('Error fetching campaign from API:', err)
      return null
    }
  }

  const createCampaign = async (data: CampaignFormData): Promise<Campaign> => {
    state.value.loading = true
    state.value.error = null

    try {
      console.log('Creating campaign with data:', data)
      
      // Call the backend API
      const response = await campaignsAPI.createCampaign(data as any)
      console.log('Create campaign response:', response)
      const newCampaign = response.data.data
      console.log('New campaign created from API:', newCampaign)
      
      // Add the new campaign to the list
      state.value.campaigns.unshift(newCampaign)
      state.value.meta.total += 1
      
      return newCampaign
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string }, status?: number }, config?: any }
      console.error('API create failed:', err)
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      })
      
      state.value.error = error.response?.data?.message || 'Failed to create campaign'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const updateCampaign = async (id: number, data: Partial<CampaignFormData>): Promise<Campaign> => {
    state.value.loading = true
    state.value.error = null

    try {
      console.log('Updating campaign with data:', data)
      console.log('Campaign ID:', id)
      
      // Call the backend API
      const response = await campaignsAPI.updateCampaign(id, data as any)
      console.log('Update campaign response:', response)
      const updatedCampaign = response.data.data
      console.log('Updated campaign from API:', updatedCampaign)
      
      // Update in list
      const index = state.value.campaigns.findIndex(c => c.id === id)
      if (index !== -1) {
        state.value.campaigns[index] = updatedCampaign
        console.log('Updated campaign in local list')
      }
      
      // Update selected campaign if it's the same
      if (state.value.selectedCampaign?.id === id) {
        state.value.selectedCampaign = updatedCampaign
        console.log('Updated selected campaign')
      }
      
      return updatedCampaign
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string }, status?: number }, config?: any }
      console.error('API update failed:', err)
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      })
      
      state.value.error = error.response?.data?.message || 'Failed to update campaign'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const deleteCampaign = async (id: number): Promise<void> => {
    state.value.loading = true
    state.value.error = null

    try {
      await campaignsAPI.deleteCampaign(id)
      
      // Remove from list
      const index = state.value.campaigns.findIndex(c => c.id === id)
      if (index !== -1) {
        state.value.campaigns.splice(index, 1)
        state.value.meta.total -= 1
      }
      
      // Clear selected campaign if it's the same
      if (state.value.selectedCampaign?.id === id) {
        state.value.selectedCampaign = null
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      state.value.error = error.response?.data?.message || 'Failed to delete campaign'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const sendCampaign = async (id: number): Promise<any> => {
    try {
      const response = await campaignsAPI.sendCampaign(id)
      return response.data
    } catch (err: unknown) {
      console.error('Error sending campaign:', err)
      throw err
    }
  }

  const scheduleCampaign = async (id: number, scheduledAt: string): Promise<any> => {
    try {
      // Use unified /send endpoint with schedule_at in ISO (backend deprecated /schedule)
      const payload = scheduledAt ? { schedule_at: scheduledAt } : {}
      const response = await campaignsAPI.sendCampaign(id, payload)
      // Merge returned campaign into list if present
      const updated = response.data?.data || null
      if (updated) {
        const index = state.value.campaigns.findIndex(c => c.id === id)
        if (index !== -1) state.value.campaigns[index] = updated
      }
      return response.data
    } catch (err: unknown) {
      console.error('Error scheduling campaign:', err)
      throw err
    }
  }

  const getCampaignMetrics = async (id: number): Promise<CampaignMetrics | null> => {
    try {
      const response = await campaignsAPI.getCampaignMetrics(id)
      const metrics = response.data.data
      state.value.campaignMetrics = metrics
      return metrics
    } catch (err: unknown) {
      console.error('Error fetching campaign metrics:', err)
      return null
    }
  }

  const saveAsTemplate = async (id: number): Promise<Campaign | null> => {
    try {
      // Use PATCH to avoid overwriting other fields unexpectedly
      const response = await campaignsAPI.patchCampaign(id, { is_template: true } as any)
      const updated = response.data?.data
      if (updated) {
        const index = state.value.campaigns.findIndex(c => c.id === id)
        if (index !== -1) state.value.campaigns[index] = updated
      }
      return updated || null
    } catch (err: unknown) {
      console.error('Error saving campaign as template:', err)
      throw err
    }
  }

  // Pause campaign
  const pauseCampaign = async (id: number): Promise<any> => {
    try {
      const response = await campaignsAPI.pauseCampaign(id)
      return response.data
    } catch (err: unknown) {
      console.error('Error pausing campaign:', err)
      throw err
    }
  }

  // Resume campaign
  const resumeCampaign = async (id: number): Promise<any> => {
    try {
      const response = await campaignsAPI.resumeCampaign(id)
      return response.data
    } catch (err: unknown) {
      console.error('Error resuming campaign:', err)
      throw err
    }
  }

  // Duplicate campaign
  const duplicateCampaign = async (id: number): Promise<any> => {
    try {
      const response = await campaignsAPI.duplicateCampaign(id)
      // Add duplicated (draft) campaign to the list if backend returns it
      const duplicated = response.data?.data || null
      if (duplicated) {
        state.value.campaigns.unshift(duplicated)
        state.value.meta.total += 1
      }
      return response.data
    } catch (err: unknown) {
      console.error('Error duplicating campaign:', err)
      throw err
    }
  }

  // Get templates
  const getTemplates = async (): Promise<any> => {
    try {
      const response = await campaignsAPI.getTemplates()
      return response.data
    } catch (err: unknown) {
      console.error('Error fetching templates:', err)
      throw err
    }
  }

  // Get single template
  const getTemplate = async (id: number): Promise<any> => {
    try {
      const response = await campaignsAPI.getTemplate(id)
      return response.data
    } catch (err: unknown) {
      console.error('Error fetching template:', err)
      throw err
    }
  }

  // Create template
  const createTemplate = async (data: any): Promise<any> => {
    try {
      const response = await campaignsAPI.createTemplate(data)
      return response.data
    } catch (err: unknown) {
      console.error('Error creating template:', err)
      throw err
    }
  }

  // Update template
  const updateTemplate = async (id: number, data: any): Promise<any> => {
    try {
      const response = await campaignsAPI.updateTemplate(id, data)
      return response.data
    } catch (err: unknown) {
      console.error('Error updating template:', err)
      throw err
    }
  }

  // Instantiate template (create campaign from template)
  const instantiateTemplate = async (templateId: number, overrides: any = {}): Promise<any> => {
    try {
      const response = await campaignsAPI.instantiateTemplate(templateId, overrides)
      return response.data
    } catch (err: unknown) {
      console.error('Error instantiating template:', err)
      throw err
    }
  }

  // Delete a template (only if is_template=true)
  const deleteTemplate = async (id: number): Promise<void> => {
    if (id === undefined || id === null) {
      console.debug('[Templates][Delete][Store] invalid id', { id, typeofId: typeof id })
      throw new Error('Invalid template id')
    }
    console.debug('[Templates][Delete][Store] start', { id, typeofId: typeof id })
    try {
      const res = await campaignsAPI.deleteTemplate(id)
      console.debug('[Templates][Delete][Store] success', { status: res?.status })
      // Optimistically prune from in-memory list if present
      const index = state.value.campaigns.findIndex(c => c.id === id)
      if (index !== -1) {
        state.value.campaigns.splice(index, 1)
        state.value.meta.total = Math.max(0, state.value.meta.total - 1)
      }
    } catch (err: any) {
      console.debug('[Templates][Delete][Store] error', {
        status: err?.response?.status,
        message: err?.response?.data?.message
      })
      throw err
    } finally {
      console.debug('[Templates][Delete][Store] finally')
    }
  }

  // Get recipients for a campaign
  const getRecipients = async (id: number): Promise<any> => {
    try {
      const response = await campaignsAPI.getRecipients(id)
      return response.data
    } catch (err: unknown) {
      console.error('Error fetching recipients:', err)
      throw err
    }
  }

  // Add recipient to campaign
  const addRecipient = async (id: number, recipientData: any): Promise<any> => {
    try {
      const response = await campaignsAPI.addRecipient(id, recipientData)
      return response.data
    } catch (err: unknown) {
      console.error('Error adding recipient:', err)
      throw err
    }
  }

  // Remove recipient from campaign
  const removeRecipient = async (id: number, recipientId: number): Promise<any> => {
    try {
      const response = await campaignsAPI.removeRecipient(id, recipientId)
      return response.data
    } catch (err: unknown) {
      console.error('Error removing recipient:', err)
      throw err
    }
  }

  const setSelectedCampaign = (campaign: Campaign | null): void => {
    state.value.selectedCampaign = campaign
  }

  const clearError = (): void => {
    state.value.error = null
  }

  const resetFilters = (): void => {
    state.value.filters = {
      search: '',
      status: 'all',
      type: 'all',
      owner_id: undefined,
      date_range: 'all',
      sort: '-created_at',
      page: 1,
      per_page: 15
    }
  }

  const getCampaignAuditLogs = async (id: number, params: any = {}): Promise<any> => {
    try {
      const response = await campaignsAPI.getCampaignAuditLogs(id, params)
      return response.data
    } catch (err: any) {
      console.error('Error fetching campaign audit logs:', err)
      throw err
    }
  }

  // ============= NEW MISSING METHODS =============

  // Campaign Enhancements
  const testCampaign = async (id: number, data: any = {}): Promise<any> => {
    try {
      const response = await campaignsAPI.testCampaign(id, data)
      return response.data
    } catch (err: any) {
      console.error('Error testing campaign:', err)
      throw err
    }
  }

  const previewCampaign = async (id: number): Promise<any> => {
    try {
      const response = await campaignsAPI.previewCampaign(id)
      return response.data
    } catch (err: any) {
      console.error('Error previewing campaign:', err)
      throw err
    }
  }

  const validateCampaign = async (id: number): Promise<any> => {
    try {
      const response = await campaignsAPI.validateCampaign(id)
      return response.data
    } catch (err: any) {
      console.error('Error validating campaign:', err)
      throw err
    }
  }

  const unscheduleCampaign = async (id: number): Promise<any> => {
    try {
      const response = await campaignsAPI.unscheduleCampaign(id)
      // Update campaign in list
      const index = state.value.campaigns.findIndex(c => c.id === id)
      if (index !== -1) {
        state.value.campaigns[index].status = 'draft'
        state.value.campaigns[index].scheduled_at = null
      }
      return response.data
    } catch (err: any) {
      console.error('Error unscheduling campaign:', err)
      throw err
    }
  }

  const archiveCampaign = async (id: number): Promise<any> => {
    try {
      const response = await campaignsAPI.archiveCampaign(id)
      // Update campaign in list
      const index = state.value.campaigns.findIndex(c => c.id === id)
      if (index !== -1) {
        state.value.campaigns[index].status = 'archived'
      }
      return response.data
    } catch (err: any) {
      console.error('Error archiving campaign:', err)
      throw err
    }
  }

  const restoreCampaign = async (id: number): Promise<any> => {
    try {
      const response = await campaignsAPI.restoreCampaign(id)
      // Update campaign in list
      const index = state.value.campaigns.findIndex(c => c.id === id)
      if (index !== -1) {
        state.value.campaigns[index].status = 'draft'
      }
      return response.data
    } catch (err: any) {
      console.error('Error restoring campaign:', err)
      throw err
    }
  }

  // Bulk Operations
  const bulkSendCampaigns = async (campaignIds: number[], data: any = {}): Promise<any> => {
    try {
      const response = await campaignsAPI.bulkSendCampaigns(campaignIds, data)
      // Update campaigns in list
      campaignIds.forEach(id => {
        const index = state.value.campaigns.findIndex(c => c.id === id)
        if (index !== -1) {
          state.value.campaigns[index].status = 'sent'
          state.value.campaigns[index].sent_at = new Date().toISOString()
        }
      })
      return response.data
    } catch (err: any) {
      console.error('Error bulk sending campaigns:', err)
      throw err
    }
  }

  const bulkPauseCampaigns = async (campaignIds: number[]): Promise<any> => {
    try {
      const response = await campaignsAPI.bulkPauseCampaigns(campaignIds)
      // Update campaigns in list
      campaignIds.forEach(id => {
        const index = state.value.campaigns.findIndex(c => c.id === id)
        if (index !== -1) {
          state.value.campaigns[index].status = 'paused'
        }
      })
      return response.data
    } catch (err: any) {
      console.error('Error bulk pausing campaigns:', err)
      throw err
    }
  }

  const bulkResumeCampaigns = async (campaignIds: number[]): Promise<any> => {
    try {
      const response = await campaignsAPI.bulkResumeCampaigns(campaignIds)
      // Update campaigns in list
      campaignIds.forEach(id => {
        const index = state.value.campaigns.findIndex(c => c.id === id)
        if (index !== -1) {
          state.value.campaigns[index].status = 'active'
        }
      })
      return response.data
    } catch (err: any) {
      console.error('Error bulk resuming campaigns:', err)
      throw err
    }
  }

  const bulkArchiveCampaigns = async (campaignIds: number[]): Promise<any> => {
    try {
      const response = await campaignsAPI.bulkArchiveCampaigns(campaignIds)
      // Update campaigns in list
      campaignIds.forEach(id => {
        const index = state.value.campaigns.findIndex(c => c.id === id)
        if (index !== -1) {
          state.value.campaigns[index].status = 'archived'
        }
      })
      return response.data
    } catch (err: any) {
      console.error('Error bulk archiving campaigns:', err)
      throw err
    }
  }

  // Import/Export
  const exportCampaigns = async (params: any = {}): Promise<Blob> => {
    try {
      const response = await campaignsAPI.exportCampaigns(params)
      return response.data
    } catch (err: any) {
      console.error('Error exporting campaigns:', err)
      throw err
    }
  }

  const importCampaigns = async (file: File): Promise<any> => {
    try {
      const response = await campaignsAPI.importCampaigns(file)
      // Refresh campaigns list after import
      await fetchCampaigns()
      return response.data
    } catch (err: any) {
      console.error('Error importing campaigns:', err)
      throw err
    }
  }

  // Ad Integration
  const attachAdsToCampaign = async (id: number, adData: any): Promise<any> => {
    try {
      const response = await campaignsAPI.attachAdsToCampaign(id, adData)
      return response.data
    } catch (err: any) {
      console.error('Error attaching ads to campaign:', err)
      throw err
    }
  }

  const getCampaignAdsMetrics = async (id: number, params: any = {}): Promise<any> => {
    try {
      const response = await campaignsAPI.getCampaignAdsMetrics(id, params)
      return response.data
    } catch (err: any) {
      console.error('Error fetching campaign ads metrics:', err)
      throw err
    }
  }

  // Analytics Integration
  const getCampaignAnalytics = async (params: any = {}): Promise<any> => {
    try {
      const response = await campaignsAPI.getCampaignAnalytics(params)
      return response.data
    } catch (err: any) {
      console.error('Error fetching campaign analytics:', err)
      throw err
    }
  }

  return {
    // State
    campaigns,
    loading,
    error,
    meta,
    filters,
    selectedCampaign,
    campaignMetrics,
    draftCampaigns,
    scheduledCampaigns,
    sentCampaigns,
    campaignsByType,
    
    // Actions
    fetchCampaigns,
    fetchCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    sendCampaign,
    scheduleCampaign,
    pauseCampaign,
    resumeCampaign,
    duplicateCampaign,
    getCampaignMetrics,
    saveAsTemplate,
    getTemplates,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    instantiateTemplate,
    getRecipients,
    addRecipient,
    removeRecipient,
    getCampaignAuditLogs,
    
    // Campaign Enhancements
    testCampaign,
    previewCampaign,
    validateCampaign,
    unscheduleCampaign,
    archiveCampaign,
    restoreCampaign,
    
    // Bulk Operations
    bulkSendCampaigns,
    bulkPauseCampaigns,
    bulkResumeCampaigns,
    bulkArchiveCampaigns,
    
    // Import/Export
    exportCampaigns,
    importCampaigns,
    
    // Ad Integration
    attachAdsToCampaign,
    getCampaignAdsMetrics,
    
    // Analytics Integration
    getCampaignAnalytics,
    
    setSelectedCampaign,
    clearError,
    resetFilters
  }
})
