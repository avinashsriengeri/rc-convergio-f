import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { hrAPI } from '../api/hrAPI'

export const useEmployeeAnnouncementsStore = defineStore('employeeAnnouncements', () => {
  // State
  const state = ref({
    loading: false,
    error: null,
    announcements: [],
    selectedAnnouncement: null,
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    },
    filters: {
      category: null,
      sortBy: 'published_at',
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
  const meta = computed(() => state.value.meta)
  const filters = computed(() => state.value.filters)

  const newAnnouncements = computed(() =>
    state.value.announcements.filter(a => !a.is_viewed)
  )

  const acknowledgedAnnouncements = computed(() =>
    state.value.announcements.filter(a => a.is_acknowledged)
  )

  // Actions
  const fetchAnnouncements = async (newFilters = {}) => {
    state.value.loading = true
    state.value.error = null

    try {
      const mergedFilters = { ...state.value.filters, ...newFilters }
      state.value.filters = mergedFilters

      const response = await hrAPI.getEmployeeAnnouncements(mergedFilters)

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
      const response = await hrAPI.getEmployeeAnnouncement(id)

      if (response.data.success) {
        state.value.selectedAnnouncement = response.data.data
        // Auto-track view
        if (!response.data.data.is_viewed) {
          await markAsViewed(id)
        }
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

  const markAsViewed = async (id) => {
    try {
      await hrAPI.markAnnouncementAsViewed(id)
      // Update local state
      const announcement = state.value.announcements.find(a => a.id === id)
      if (announcement) {
        announcement.is_viewed = true
      }
      if (state.value.selectedAnnouncement?.id === id) {
        state.value.selectedAnnouncement.is_viewed = true
      }
    } catch (err) {
      console.error('Error marking as viewed:', err)
      // Don't throw, just log
    }
  }

  const acknowledgeAnnouncement = async (id) => {
    state.value.loading = true
    state.value.error = null

    try {
      const response = await hrAPI.acknowledgeAnnouncement(id)

      if (response.data.success) {
        // Update local state
        const announcement = state.value.announcements.find(a => a.id === id)
        if (announcement) {
          announcement.is_acknowledged = true
          announcement.acknowledgments_count = (announcement.acknowledgments_count || 0) + 1
        }
        if (state.value.selectedAnnouncement?.id === id) {
          state.value.selectedAnnouncement.is_acknowledged = true
          state.value.selectedAnnouncement.acknowledgments_count = (state.value.selectedAnnouncement.acknowledgments_count || 0) + 1
        }
        return true
      } else {
        throw new Error(response.data.message || 'Failed to acknowledge announcement')
      }
    } catch (err) {
      console.error('Error acknowledging announcement:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to acknowledge announcement'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const toggleLike = async (id) => {
    try {
      const response = await hrAPI.toggleAnnouncementLike(id)

      if (response.data.success) {
        const { is_liked, likes_count } = response.data.data
        // Update local state
        const announcement = state.value.announcements.find(a => a.id === id)
        if (announcement) {
          announcement.is_liked = is_liked
          announcement.likes_count = likes_count
        }
        if (state.value.selectedAnnouncement?.id === id) {
          state.value.selectedAnnouncement.is_liked = is_liked
          state.value.selectedAnnouncement.likes_count = likes_count
        }
        return { is_liked, likes_count }
      } else {
        throw new Error(response.data.message || 'Failed to toggle like')
      }
    } catch (err) {
      console.error('Error toggling like:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to toggle like'
      throw err
    }
  }

  const addComment = async (id, comment) => {
    state.value.loading = true
    state.value.error = null

    try {
      const response = await hrAPI.addAnnouncementComment(id, { comment })

      if (response.data.success) {
        const newComment = response.data.data
        // Update local state
        if (state.value.selectedAnnouncement?.id === id) {
          if (!state.value.selectedAnnouncement.comments) {
            state.value.selectedAnnouncement.comments = []
          }
          state.value.selectedAnnouncement.comments.push(newComment)
          state.value.selectedAnnouncement.comments_count = (state.value.selectedAnnouncement.comments_count || 0) + 1
        }
        return newComment
      } else {
        throw new Error(response.data.message || 'Failed to add comment')
      }
    } catch (err) {
      console.error('Error adding comment:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to add comment'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const deleteComment = async (announcementId, commentId) => {
    state.value.loading = true
    state.value.error = null

    try {
      const response = await hrAPI.deleteAnnouncementComment(announcementId, commentId)

      if (response.data.success) {
        // Update local state
        if (state.value.selectedAnnouncement?.id === announcementId) {
          if (state.value.selectedAnnouncement.comments) {
            state.value.selectedAnnouncement.comments = state.value.selectedAnnouncement.comments.filter(
              c => c.id !== commentId
            )
            state.value.selectedAnnouncement.comments_count = Math.max(
              (state.value.selectedAnnouncement.comments_count || 0) - 1,
              0
            )
          }
        }
        return true
      } else {
        throw new Error(response.data.message || 'Failed to delete comment')
      }
    } catch (err) {
      console.error('Error deleting comment:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to delete comment'
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
    meta,
    filters,
    // Computed
    newAnnouncements,
    acknowledgedAnnouncements,
    // Actions
    fetchAnnouncements,
    fetchAnnouncement,
    markAsViewed,
    acknowledgeAnnouncement,
    toggleLike,
    addComment,
    deleteComment,
    clearSelectedAnnouncement
  }
})

