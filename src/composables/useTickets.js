import { ref, computed } from 'vue'
import api from '@/services/api.js'

export function useTickets() {
  const tickets = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Get article suggestions for a ticket
  const getArticleSuggestions = async (ticketId, query = '') => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get(`/service/tickets/${ticketId}/article-suggestions`, {
        params: { query }
      })
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch article suggestions'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get ticket details
  const getTicket = async (ticketId) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get(`/service/tickets/${ticketId}`)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch ticket'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create ticket
  const createTicket = async (ticketData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post('/service/tickets', ticketData)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create ticket'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update ticket
  const updateTicket = async (ticketId, ticketData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.put(`/service/tickets/${ticketId}`, ticketData)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update ticket'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Computed properties
  const hasTickets = computed(() => tickets.value.length > 0)

  return {
    // State
    tickets,
    loading,
    error,
    
    // Computed
    hasTickets,
    
    // Methods
    getArticleSuggestions,
    getTicket,
    createTicket,
    updateTicket
  }
}
