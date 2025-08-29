import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { activitiesAPI } from '../services/api'
import type { Activity, ActivityFormData, PaginationMeta, LoadingState } from '../types'

// Import auth composable to get current user
import { useAuth } from '@/composables/useAuth'

// API Response interfaces
interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
  message?: string
}

interface ActivitiesApiResponse extends ApiResponse<Activity[]> {}
interface ActivityApiResponse extends ApiResponse<Activity> {}

interface ActivitiesState extends LoadingState {
  activities: Activity[]
  meta: PaginationMeta
  filters: any
  selectedActivity: Activity | null
}

// Environment variable type declaration
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_API_BASE_URL?: string
    }
  }
}

export const useActivitiesStore = defineStore('activities', () => {
  // State
  const state = ref<ActivitiesState>({
    loading: false,
    error: null,
    activities: [],
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
      type: 'all',
      status: 'all',
      sort: '-scheduled_at',
      page: 1,
      per_page: 15
    },
    selectedActivity: null
  })

  // Getters
  const activities = computed(() => state.value.activities)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const meta = computed(() => state.value.meta)
  const filters = computed(() => state.value.filters)
  const selectedActivity = computed(() => state.value.selectedActivity)

  const scheduledActivities = computed(() => 
    state.value.activities.filter(activity => activity.status === 'scheduled')
  )

  const completedActivities = computed(() => 
    state.value.activities.filter(activity => activity.status === 'completed')
  )

  const cancelledActivities = computed(() => 
    state.value.activities.filter(activity => activity.status === 'cancelled')
  )

  const upcomingActivities = computed(() => 
    state.value.activities.filter(activity => {
      if (activity.status === 'completed' || activity.status === 'cancelled') return false
      if (!activity.scheduled_at) return false
      const scheduledDate = new Date(activity.scheduled_at)
      const now = new Date()
      return scheduledDate > now
    })
  )

  const activitiesByType = computed(() => {
    const grouped: Record<string, Activity[]> = {
      call: [],
      email: [],
      meeting: [],
      task: [],
      note: [],
      other: []
    }
    state.value.activities.forEach(activity => {
      if (grouped[activity.type]) {
        grouped[activity.type].push(activity)
      }
    })
    return grouped
  })

  // Actions
  const fetchActivities = async (newFilters?: any): Promise<void> => {
    // Update filters if provided
    if (newFilters) {
      state.value.filters = { ...state.value.filters, ...newFilters }
    }

    // Use the provided filters directly (they should already be normalized)
    const apiFilters = newFilters || state.value.filters

    state.value.loading = true
    state.value.error = null

    try {
      console.log('Fetching activities with API filters:', apiFilters)
      const response = await activitiesAPI.getActivities(apiFilters)
      console.log('Activities API response:', response)
      
      // Handle different response structures and map backend fields to frontend fields
      let activitiesData: any[] = []
      
      if (response.data && Array.isArray(response.data)) {
        // Direct array response
        activitiesData = response.data
        console.log('Using direct array response')
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Nested data structure
        activitiesData = response.data.data
        state.value.meta = response.data.meta || state.value.meta
        console.log('Using nested data structure')
      } else {
        // Empty or unexpected structure
        activitiesData = []
        console.log('Empty or unexpected response structure')
      }
      
      // Map backend fields to frontend fields
      state.value.activities = activitiesData.map(activity => ({
        ...activity,
        title: activity.subject || activity.title || '', // Map subject → title
        description: activity.description || '',
        type: activity.type || 'other',
        status: activity.status || 'scheduled',
        scheduled_at: activity.scheduled_at || '',
        duration: activity.duration || activity.metadata?.duration_minutes || null,
        owner: activity.owner || null,
        notes: activity.notes || activity.metadata?.notes || '',
        completed_at: activity.completed_at || null
      }))
      
      console.log('Activities loaded:', state.value.activities.length)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string }, status?: number }, config?: any }
      state.value.error = error.response?.data?.message || 'Failed to fetch activities'
      console.error('Error fetching activities:', err)
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      })
      
      // Keep activities empty when API fails
      state.value.activities = []
      state.value.meta.total = 0
    } finally {
      state.value.loading = false
    }
  }

  const fetchActivity = async (id: number): Promise<Activity | null> => {
    try {
      console.log('Fetching activity from API:', id)
      const response = await activitiesAPI.getActivity(id)
      const activityData = response.data.data
      
      // Map backend fields to frontend fields
      const activity = {
        ...activityData,
        title: activityData.subject || activityData.title || '', // Map subject → title
        description: activityData.description || '',
        type: activityData.type || 'other',
        status: activityData.status || 'scheduled',
        scheduled_at: activityData.scheduled_at || '',
        duration: activityData.duration || activityData.metadata?.duration_minutes || null,
        owner: activityData.owner || null,
        notes: activityData.notes || activityData.metadata?.notes || '',
        completed_at: activityData.completed_at || null
      }
      
      state.value.selectedActivity = activity
      console.log('Activity fetched from API:', activity)
      return activity
    } catch (err: unknown) {
      console.error('Error fetching activity from API:', err)
      return null
    }
  }

  const fetchActivityById = async (id: number): Promise<Activity | null> => {
    return fetchActivity(id)
  }

  const createActivity = async (data: ActivityFormData): Promise<Activity> => {
    state.value.loading = true
    state.value.error = null

    try {
      console.log('Creating activity with original data:', data)
      
      // Get current user for owner_id
      const { user } = useAuth()
      if (!user.value?.id) {
        throw new Error('User not authenticated')
      }
      
             // Map UI fields to backend fields
       const mappedData: any = {
         subject: data.title, // Map title → subject
         description: data.description,
         type: data.type,
         scheduled_at: data.scheduled_at, // Already combined in the view
         status: data.status,
         // Note: owner_id and tenant_id are enforced by backend
         // Store additional data in metadata
         metadata: {
           duration_minutes: data.duration,
           notes: data.notes,
           tags: data.tags
         }
       }

       // Only include related fields if they are provided
       if (data.related_entity_type && data.related_entity_id) {
         mappedData.related_type = data.related_entity_type
         mappedData.related_id = data.related_entity_id
       }
      
      console.log('Creating activity with mapped data:', mappedData)
      
      // Call the backend API
      const response = await activitiesAPI.createActivity(mappedData)
      console.log('Create activity response:', response)
      const activityData = response.data.data
      
      // Map backend response to frontend format
      const newActivity = {
        ...activityData,
        title: activityData.subject || activityData.title || '', // Map subject → title
        description: activityData.description || '',
        type: activityData.type || 'other',
        status: activityData.status || 'scheduled',
        scheduled_at: activityData.scheduled_at || '',
        duration: activityData.duration || activityData.metadata?.duration_minutes || null,
        owner: activityData.owner || null,
        notes: activityData.notes || activityData.metadata?.notes || '',
        completed_at: activityData.completed_at || null
      }
      
      console.log('New activity created from API:', newActivity)
      
      // Add the new activity to the list
      state.value.activities.unshift(newActivity)
      state.value.meta.total += 1
      
      return newActivity
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string }, status?: number }, config?: any }
      console.error('API create failed:', err)
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      })
      
      state.value.error = error.response?.data?.message || 'Failed to create activity'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const updateActivity = async (id: number, data: Partial<ActivityFormData>): Promise<Activity> => {
    state.value.loading = true
    state.value.error = null

    try {
      console.log('Updating activity with original data:', data)
      console.log('Activity ID:', id)
      
      // Get current user for owner_id (if not provided)
      const { user } = useAuth()
      if (!user.value?.id) {
        throw new Error('User not authenticated')
      }
      
      // Map UI fields to backend fields
      const mappedData: any = {}
      
      if (data.title !== undefined) mappedData.subject = data.title
      if (data.description !== undefined) mappedData.description = data.description
      if (data.type !== undefined) mappedData.type = data.type
      if (data.scheduled_at !== undefined) mappedData.scheduled_at = data.scheduled_at
      if (data.status !== undefined) mappedData.status = data.status
             // Only include related fields if they are provided
       if (data.related_entity_type && data.related_entity_id) {
         mappedData.related_type = data.related_entity_type
         mappedData.related_id = data.related_entity_id
       }
      
             // Note: owner_id and tenant_id are enforced by backend
      
      // Store additional data in metadata
      const metadata: any = {}
      if (data.duration !== undefined) metadata.duration_minutes = data.duration
      if (data.notes !== undefined) metadata.notes = data.notes
      if (data.tags !== undefined) metadata.tags = data.tags
      
      if (Object.keys(metadata).length > 0) {
        mappedData.metadata = metadata
      }
      
      console.log('Updating activity with mapped data:', mappedData)
      
      // Call the backend API
      const response = await activitiesAPI.updateActivity(id, mappedData)
      console.log('Update activity response:', response)
      const activityData = response.data.data
      
      // Map backend response to frontend format
      const updatedActivity = {
        ...activityData,
        title: activityData.subject || activityData.title || '', // Map subject → title
        description: activityData.description || '',
        type: activityData.type || 'other',
        status: activityData.status || 'scheduled',
        scheduled_at: activityData.scheduled_at || '',
        duration: activityData.duration || activityData.metadata?.duration_minutes || null,
        owner: activityData.owner || null,
        notes: activityData.notes || activityData.metadata?.notes || '',
        completed_at: activityData.completed_at || null
      }
      
      console.log('Updated activity from API:', updatedActivity)
      
      // Update in list
      const index = state.value.activities.findIndex(a => a.id === id)
      if (index !== -1) {
        state.value.activities[index] = updatedActivity
        console.log('Updated activity in local list')
      }
      
      // Update selected activity if it's the same
      if (state.value.selectedActivity?.id === id) {
        state.value.selectedActivity = updatedActivity
        console.log('Updated selected activity')
      }
      
      return updatedActivity
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string }, status?: number }, config?: any }
      console.error('API update failed:', err)
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      })
      
      state.value.error = error.response?.data?.message || 'Failed to update activity'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const deleteActivity = async (id: number): Promise<void> => {
    state.value.loading = true
    state.value.error = null

    try {
      await activitiesAPI.deleteActivity(id)
      
      // Remove from list
      const index = state.value.activities.findIndex(a => a.id === id)
      if (index !== -1) {
        state.value.activities.splice(index, 1)
        state.value.meta.total -= 1
      }
      
      // Clear selected activity if it's the same
      if (state.value.selectedActivity?.id === id) {
        state.value.selectedActivity = null
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      state.value.error = error.response?.data?.message || 'Failed to delete activity'
      throw err
    } finally {
      state.value.loading = false
    }
  }

    const markCompleted = async (id: number): Promise<Activity> => {
    try {
      const response = await activitiesAPI.markCompleted(id)
      const activityData = response.data.data
      
      // Map backend response to frontend format
      const updatedActivity = {
        ...activityData,
        title: activityData.subject || activityData.title || '', // Map subject → title
        description: activityData.description || '',
        type: activityData.type || 'other',
        status: activityData.status || 'scheduled',
        scheduled_at: activityData.scheduled_at || '',
        duration: activityData.duration || activityData.metadata?.duration_minutes || null,
        owner: activityData.owner || null,
        notes: activityData.notes || activityData.metadata?.notes || '',
        completed_at: activityData.completed_at || null
      }

      // Update in list
      const index = state.value.activities.findIndex(a => a.id === id)
      if (index !== -1) {
        state.value.activities[index] = updatedActivity
      }

      // Update selected activity if it's the same
      if (state.value.selectedActivity?.id === id) {
        state.value.selectedActivity = updatedActivity
      }

      return updatedActivity
    } catch (err: unknown) {
      console.error('Error marking activity as completed:', err)
      throw err
    }
  }

  const getActivitiesByEntity = async (entityType: string, entityId: number): Promise<Activity[]> => {
    try {
      const response = await activitiesAPI.getActivitiesByEntity(entityType, entityId)
      const activitiesData = response.data.data || []
      
      // Map backend fields to frontend fields
      return activitiesData.map((activity: any) => ({
        ...activity,
        title: activity.subject || activity.title || '', // Map subject → title
        description: activity.description || '',
        type: activity.type || 'other',
        status: activity.status || 'scheduled',
        scheduled_at: activity.scheduled_at || '',
        duration: activity.duration || activity.metadata?.duration_minutes || null,
        owner: activity.owner || null,
        notes: activity.notes || activity.metadata?.notes || '',
        completed_at: activity.completed_at || null
      }))
    } catch (err: unknown) {
      console.error('Error fetching activities by entity:', err)
      return []
    }
  }

  const getUpcomingActivities = async (params = {}): Promise<Activity[]> => {
    try {
      const response = await activitiesAPI.getUpcomingActivities(params)
      const activitiesData = response.data.data || []
      
      // Map backend fields to frontend fields
      return activitiesData.map((activity: any) => ({
        ...activity,
        title: activity.subject || activity.title || '', // Map subject → title
        description: activity.description || '',
        type: activity.type || 'other',
        status: activity.status || 'scheduled',
        scheduled_at: activity.scheduled_at || '',
        duration: activity.duration || activity.metadata?.duration_minutes || null,
        owner: activity.owner || null,
        notes: activity.notes || activity.metadata?.notes || '',
        completed_at: activity.completed_at || null
      }))
    } catch (err: unknown) {
      console.error('Error fetching upcoming activities:', err)
      return []
    }
  }

  // Fetch timeline activities
  const fetchTimeline = async (): Promise<void> => {
    try {
      const response = await activitiesAPI.getActivityTimeline()
      const activitiesData = response.data.data || []
      
      // Map backend fields to frontend fields
      state.value.activities = activitiesData.map((activity: any) => ({
        ...activity,
        title: activity.subject || activity.title || '', // Map subject → title
        description: activity.description || '',
        type: activity.type || 'other',
        status: activity.status || 'scheduled',
        scheduled_at: activity.scheduled_at || '',
        duration: activity.duration || activity.metadata?.duration_minutes || null,
        owner: activity.owner || null,
        notes: activity.notes || activity.metadata?.notes || '',
        completed_at: activity.completed_at || null
      }))
    } catch (err: unknown) {
      console.error('Error fetching timeline activities:', err)
      state.value.activities = []
    }
  }

  // Fetch upcoming activities
  const fetchUpcoming = async (): Promise<void> => {
    try {
      const response = await activitiesAPI.getUpcomingActivities()
      const activitiesData = response.data.data || []
      
      // Map backend fields to frontend fields
      state.value.activities = activitiesData.map((activity: any) => ({
        ...activity,
        title: activity.subject || activity.title || '', // Map subject → title
        description: activity.description || '',
        type: activity.type || 'other',
        status: activity.status || 'scheduled',
        scheduled_at: activity.scheduled_at || '',
        duration: activity.duration || activity.metadata?.duration_minutes || null,
        owner: activity.owner || null,
        notes: activity.notes || activity.metadata?.notes || '',
        completed_at: activity.completed_at || null
      }))
    } catch (err: unknown) {
      console.error('Error fetching upcoming activities:', err)
      state.value.activities = []
    }
  }

  // Fetch entity-specific activities
  const fetchEntityActivities = async (entityType: string, entityId: number): Promise<void> => {
    try {
      const response = await activitiesAPI.getActivitiesByEntity(entityType, entityId)
      const activitiesData = response.data.data || []
      
      // Map backend fields to frontend fields
      state.value.activities = activitiesData.map((activity: any) => ({
        ...activity,
        title: activity.subject || activity.title || '', // Map subject → title
        description: activity.description || '',
        type: activity.type || 'other',
        status: activity.status || 'scheduled',
        scheduled_at: activity.scheduled_at || '',
        duration: activity.duration || activity.metadata?.duration_minutes || null,
        owner: activity.owner || null,
        notes: activity.notes || activity.metadata?.notes || '',
        completed_at: activity.completed_at || null
      }))
    } catch (err: unknown) {
      console.error('Error fetching entity activities:', err)
      state.value.activities = []
    }
  }

  const setSelectedActivity = (activity: Activity | null): void => {
    state.value.selectedActivity = activity
  }

  const clearError = (): void => {
    state.value.error = null
  }

  const resetFilters = (): void => {
    state.value.filters = {
      search: '',
      type: 'all',
      status: 'all',
      sort: '-scheduled_at',
      page: 1,
      per_page: 15
    }
  }

  // Complete a single activity
  const completeActivity = async (id: number): Promise<Activity> => {
    try {
      const response = await activitiesAPI.completeActivity(id)
      const activityData = response.data.data
      
      // Map backend response to frontend format
      const updatedActivity = {
        ...activityData,
        title: activityData.subject || activityData.title || '', // Map subject → title
        description: activityData.description || '',
        type: activityData.type || 'other',
        status: activityData.status || 'scheduled',
        scheduled_at: activityData.scheduled_at || '',
        duration: activityData.duration || activityData.metadata?.duration_minutes || null,
        owner: activityData.owner || null,
        notes: activityData.notes || activityData.metadata?.notes || '',
        completed_at: activityData.completed_at || null
      }

      // Update in list
      const index = state.value.activities.findIndex(a => a.id === id)
      if (index !== -1) {
        state.value.activities[index] = updatedActivity
      }

      // Update selected activity if it's the same
      if (state.value.selectedActivity?.id === id) {
        state.value.selectedActivity = updatedActivity
      }

      return updatedActivity
    } catch (err: unknown) {
      console.error('Error completing activity:', err)
      throw err
    }
  }

  // Bulk complete activities
  const bulkComplete = async (ids: number[]): Promise<void> => {
    try {
      await activitiesAPI.bulkComplete(ids)
      
      // Update activities in the list
      state.value.activities = state.value.activities.map(activity => {
        if (ids.includes(activity.id)) {
          return {
            ...activity,
            status: 'completed',
            completed_at: new Date().toISOString()
          }
        }
        return activity
      })
    } catch (err: unknown) {
      console.error('Error bulk completing activities:', err)
      throw err
    }
  }

  // Bulk delete activities
  const bulkDelete = async (ids: number[]): Promise<void> => {
    try {
      await activitiesAPI.bulkDelete(ids)
      
      // Remove activities from the list
      state.value.activities = state.value.activities.filter(activity => !ids.includes(activity.id))
      
      // Update meta total
      state.value.meta.total -= ids.length
    } catch (err: unknown) {
      console.error('Error bulk deleting activities:', err)
      throw err
    }
  }

  // Bulk update activities
  const bulkUpdate = async (data: { ids: number[], status?: string, scheduled_at?: string, duration?: number, notes?: string }): Promise<void> => {
    try {
      await activitiesAPI.bulkUpdate(data)
      
      // Update activities in the list
      state.value.activities = state.value.activities.map(activity => {
        if (data.ids.includes(activity.id)) {
          return {
            ...activity,
            ...(data.status && { status: data.status as any }),
            ...(data.scheduled_at && { scheduled_at: data.scheduled_at }),
            ...(data.duration && { duration: data.duration }),
            ...(data.notes && { notes: data.notes })
          }
        }
        return activity
      })
    } catch (err: unknown) {
      console.error('Error bulk updating activities:', err)
      throw err
    }
  }

  // Export activities
  const exportActivities = async (params: any): Promise<any> => {
    try {
      return await activitiesAPI.exportActivities(params)
    } catch (err: unknown) {
      console.error('Error exporting activities:', err)
      throw err
    }
  }

  return {
    // State
    activities,
    loading,
    error,
    meta,
    filters,
    selectedActivity,
    scheduledActivities,
    completedActivities,
    cancelledActivities,
    upcomingActivities,
    activitiesByType,
    
    // Actions
    fetchActivities,
    fetchActivity,
    fetchActivityById,
    createActivity,
    updateActivity,
    deleteActivity,
    markCompleted,
    getActivitiesByEntity,
    getUpcomingActivities,
    fetchTimeline,
    fetchUpcoming,
    fetchEntityActivities,
    setSelectedActivity,
    clearError,
    resetFilters,
    completeActivity,
    bulkComplete,
    bulkDelete,
    bulkUpdate,
    exportActivities
  }
})
