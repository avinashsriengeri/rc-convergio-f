import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { hrAPI } from '../api/hrAPI'

const createFilters = (data = {}) => ({
  status: '',
  sortBy: 'created_at',
  sortOrder: 'desc',
  page: 1,
  per_page: 15,
  ...data
})

export const useManagerKpiReviewsStore = defineStore('managerKpiReviews', () => {
  // State
  const state = ref({
    loading: false,
    error: null,
    reviews: [],
    selectedReview: null,
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    },
    filters: createFilters()
  })

  // Getters
  const reviews = computed(() => state.value.reviews)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const selectedReview = computed(() => state.value.selectedReview)
  const meta = computed(() => state.value.meta)
  const filters = computed(() => state.value.filters)

  // Actions
  const fetchMyTeamReviews = async (newFilters = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const mergedFilters = { ...state.value.filters, ...newFilters }
      state.value.filters = mergedFilters
      
      const response = await hrAPI.getMyTeamKpiReviews(mergedFilters)
      
      if (response.data.success) {
        state.value.reviews = response.data.data || []
        state.value.meta = response.data.meta || state.value.meta
      } else {
        throw new Error(response.data.message || 'Failed to fetch team reviews')
      }
    } catch (err) {
      console.error('Error fetching team reviews:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch team reviews'
      state.value.reviews = []
    } finally {
      state.value.loading = false
    }
  }

  const fetchReview = async (id) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getKpiReview(id)
      
      if (response.data.success) {
        state.value.selectedReview = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Review not found')
      }
    } catch (err) {
      console.error('Error fetching review:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch review'
      state.value.selectedReview = null
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const submitManagerReview = async (id, reviewData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.submitManagerReview(id, reviewData)
      
      if (response.data.success) {
        // Update the review in the list
        const index = state.value.reviews.findIndex(r => r.id === id)
        if (index !== -1) {
          await fetchReview(id)
          const updatedReview = state.value.selectedReview
          state.value.reviews[index] = { ...state.value.reviews[index], manager_review: updatedReview, status: 'completed' }
        }
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to submit manager review')
      }
    } catch (err) {
      console.error('Error submitting manager review:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to submit manager review'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const setFilters = (newFilters) => {
    state.value.filters = { ...state.value.filters, ...newFilters }
  }

  const clearSelectedReview = () => {
    state.value.selectedReview = null
  }

  return {
    // State
    reviews,
    loading,
    error,
    selectedReview,
    meta,
    filters,
    // Actions
    fetchMyTeamReviews,
    fetchReview,
    submitManagerReview,
    setFilters,
    clearSelectedReview
  }
})

