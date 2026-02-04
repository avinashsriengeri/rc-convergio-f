import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { hrAPI } from '../api/hrAPI'

export const useHrAnnouncementsStore = defineStore('hrAnnouncements', () => {
  // State
  const state = ref({
    loading: false,
    error: null,
    announcements: [],
    selectedAnnouncement: null,
    analytics: null,
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    },
    filters: {
      status: null,
      category: null,
      search: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
      page: 1,
      per_page: 15
    }
  })

  // Getters
  const announcements = computed(() => state.value.announcements)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const selectedAnnouncement = computed(() => state.value.selectedAnnouncement)
  const analytics = computed(() => state.value.analytics)
  const meta = computed(() => state.value.meta)
  const filters = computed(() => state.value.filters)

  const publishedAnnouncements = computed(() =>
    state.value.announcements.filter(a => a.status === 'published')
  )

  const draftAnnouncements = computed(() =>
    state.value.announcements.filter(a => a.status === 'draft')
  )

  const archivedAnnouncements = computed(() =>
    state.value.announcements.filter(a => a.status === 'archived')
  )

  // Actions
  const fetchAnnouncements = async (newFilters = {}) => {
    state.value.loading = true
    state.value.error = null

    try {
      const mergedFilters = { ...state.value.filters, ...newFilters }
      state.value.filters = mergedFilters

      const response = await hrAPI.getAnnouncements(mergedFilters)

      if (response.data.success) {
        state.value.announcements = response.data.data || []
        state.value.meta = response.data.meta || state.value.meta
      } else {
        throw new Error(response.data.message || 'Failed to fetch announcements')
      }
    } catch (err) {
      console.error('Error fetching announcements:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch announcements'
      state.value.announcements = []
    } finally {
      state.value.loading = false
    }
  }

  const fetchAnnouncement = async (id) => {
    state.value.loading = true
    state.value.error = null

    try {
      const response = await hrAPI.getAnnouncement(id)

      if (response.data.success) {
        state.value.selectedAnnouncement = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch announcement')
      }
    } catch (err) {
      console.error('Error fetching announcement:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch announcement'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const createAnnouncement = async (announcementData) => {
    state.value.loading = true
    state.value.error = null

    try {
      const response = await hrAPI.createAnnouncement(announcementData)

      if (response.data.success) {
        const newAnnouncement = response.data.data
        state.value.announcements.unshift(newAnnouncement)
        return newAnnouncement
      } else {
        throw new Error(response.data.message || 'Failed to create announcement')
      }
    } catch (err) {
      console.error('Error creating announcement:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to create announcement'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const updateAnnouncement = async (id, announcementData) => {
    state.value.loading = true
    state.value.error = null

    try {
      const response = await hrAPI.updateAnnouncement(id, announcementData)

      if (response.data.success) {
        const updatedAnnouncement = response.data.data
        const index = state.value.announcements.findIndex(a => a.id === id)
        if (index !== -1) {
          state.value.announcements[index] = updatedAnnouncement
        }
        if (state.value.selectedAnnouncement?.id === id) {
          state.value.selectedAnnouncement = updatedAnnouncement
        }
        return updatedAnnouncement
      } else {
        throw new Error(response.data.message || 'Failed to update announcement')
      }
    } catch (err) {
      console.error('Error updating announcement:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to update announcement'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const deleteAnnouncement = async (id) => {
    state.value.loading = true
    state.value.error = null

    try {
      const response = await hrAPI.deleteAnnouncement(id)

      if (response.data.success) {
        state.value.announcements = state.value.announcements.filter(a => a.id !== id)
        if (state.value.selectedAnnouncement?.id === id) {
          state.value.selectedAnnouncement = null
        }
        return true
      } else {
        throw new Error(response.data.message || 'Failed to delete announcement')
      }
    } catch (err) {
      console.error('Error deleting announcement:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to delete announcement'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const publishAnnouncement = async (id) => {
    state.value.loading = true
    state.value.error = null

    try {
      const response = await hrAPI.publishAnnouncement(id)

      if (response.data.success) {
        const updatedAnnouncement = response.data.data
        const index = state.value.announcements.findIndex(a => a.id === id)
        if (index !== -1) {
          state.value.announcements[index] = updatedAnnouncement
        }
        if (state.value.selectedAnnouncement?.id === id) {
          state.value.selectedAnnouncement = updatedAnnouncement
        }
        return updatedAnnouncement
      } else {
        throw new Error(response.data.message || 'Failed to publish announcement')
      }
    } catch (err) {
      console.error('Error publishing announcement:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to publish announcement'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const archiveAnnouncement = async (id) => {
    state.value.loading = true
    state.value.error = null

    try {
      const response = await hrAPI.archiveAnnouncement(id)

      if (response.data.success) {
        const updatedAnnouncement = response.data.data
        const index = state.value.announcements.findIndex(a => a.id === id)
        if (index !== -1) {
          state.value.announcements[index] = updatedAnnouncement
        }
        if (state.value.selectedAnnouncement?.id === id) {
          state.value.selectedAnnouncement = updatedAnnouncement
        }
        return updatedAnnouncement
      } else {
        throw new Error(response.data.message || 'Failed to archive announcement')
      }
    } catch (err) {
      console.error('Error archiving announcement:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to archive announcement'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const fetchAnalytics = async (params = {}) => {
    state.value.loading = true
    state.value.error = null

    try {
      const response = await hrAPI.getAnnouncementAnalytics(params)

      if (response.data.success) {
        state.value.analytics = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch analytics')
      }
    } catch (err) {
      console.error('Error fetching analytics:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch analytics'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const sendReminders = async (id) => {
    state.value.loading = true
    state.value.error = null

    try {
      const response = await hrAPI.sendAnnouncementReminders(id)

      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to send reminders')
      }
    } catch (err) {
      console.error('Error sending reminders:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to send reminders'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const clearSelectedAnnouncement = () => {
    state.value.selectedAnnouncement = null
  }

  return {
    // State
    announcements,
    loading,
    error,
    selectedAnnouncement,
    analytics,
    meta,
    filters,
    // Computed
    publishedAnnouncements,
    draftAnnouncements,
    archivedAnnouncements,
    // Actions
    fetchAnnouncements,
    fetchAnnouncement,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    publishAnnouncement,
    archiveAnnouncement,
    fetchAnalytics,
    sendReminders,
    clearSelectedAnnouncement
  }
})

