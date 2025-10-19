import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { serviceTicketsAPI } from '../api/serviceTickets'

// Types and interfaces
const TicketStatus = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
}

const TicketPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
}

const SLABadge = {
  ON_TRACK: 'on_track',
  BREACHED: 'breached'
}

// Ticket interface
const createTicket = (data = {}) => ({
  id: null,
  subject: '',
  description: '',
  status: TicketStatus.OPEN,
  priority: TicketPriority.MEDIUM,
  category: '',
  assignee_id: null,
  assignee: null,
  contact_id: null,
  contact: null,
  company_id: null,
  company: null,
  sla_status: SLABadge.ON_TRACK,
  sla_due_at: null,
  created_at: null,
  updated_at: null,
  closed_at: null,
  messages: [],
  attachments: [],
  activity_log: [],
  ...data
})

// Message interface
const createMessage = (data = {}) => ({
  id: null,
  ticket_id: null,
  user_id: null,
  user: null,
  message: '',
  is_internal: false,
  created_at: null,
  ...data
})

// Stats interface
const createStats = (data = {}) => ({
  total: 0,
  open: 0,
  in_progress: 0,
  resolved: 0,
  closed: 0,
  breached_sla: 0,
  avg_response_time: 0,
  avg_resolution_time: 0,
  ...data
})

// Filters interface
const createFilters = (data = {}) => ({
  search: '',
  status: 'all',
  priority: 'all',
  assignee_id: null,
  category: 'all',
  sla_status: 'all',
  date_from: null,
  date_to: null,
  sort: '-created_at',
  page: 1,
  per_page: 15,
  ...data
})

export const useServiceTicketsStore = defineStore('serviceTickets', () => {
  // State
  const state = ref({
    loading: false,
    error: null,
    tickets: [],
    selectedTicket: null,
    stats: null,
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 0,
      to: 0
    },
    filters: createFilters(),
    categories: [],
    priorities: [],
    statuses: []
  })

  // Getters
  const tickets = computed(() => state.value.tickets)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const selectedTicket = computed(() => state.value.selectedTicket)
  const stats = computed(() => state.value.stats)
  const meta = computed(() => state.value.meta)
  const filters = computed(() => state.value.filters)
  const categories = computed(() => state.value.categories)
  const priorities = computed(() => state.value.priorities)
  const statuses = computed(() => state.value.statuses)

  // Filtered tickets
  const openTickets = computed(() => 
    state.value.tickets.filter(ticket => ticket.status === TicketStatus.OPEN)
  )

  const inProgressTickets = computed(() => 
    state.value.tickets.filter(ticket => ticket.status === TicketStatus.IN_PROGRESS)
  )

  const resolvedTickets = computed(() => 
    state.value.tickets.filter(ticket => ticket.status === TicketStatus.RESOLVED)
  )

  const closedTickets = computed(() => 
    state.value.tickets.filter(ticket => ticket.status === TicketStatus.CLOSED)
  )

  const breachedSLATickets = computed(() => 
    state.value.tickets.filter(ticket => ticket.sla_status === SLABadge.BREACHED)
  )

  const ticketsByPriority = computed(() => {
    const grouped = {}
    Object.values(TicketPriority).forEach(priority => {
      grouped[priority] = state.value.tickets.filter(ticket => ticket.priority === priority)
    })
    return grouped
  })

  const ticketsByAssignee = computed(() => {
    const grouped = {}
    state.value.tickets.forEach(ticket => {
      const assigneeId = ticket.assignee_id || 'unassigned'
      if (!grouped[assigneeId]) {
        grouped[assigneeId] = []
      }
      grouped[assigneeId].push(ticket)
    })
    return grouped
  })

  // Actions
  const fetchTickets = async (newFilters = {}) => {
    if (Object.keys(newFilters).length > 0) {
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
      console.log('Fetching tickets with filters:', cleanFilters)
      const response = await serviceTicketsAPI.getTickets(cleanFilters)
      
      // Handle different response structures
      if (response.data && Array.isArray(response.data)) {
        state.value.tickets = response.data
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        state.value.tickets = response.data.data
        state.value.meta = response.data.meta || state.value.meta
      } else {
        state.value.tickets = []
      }
      
      console.log('Tickets loaded:', state.value.tickets.length)
    } catch (err) {
      const error = err.response?.data?.message || 'Failed to fetch tickets'
      state.value.error = error
      console.error('Error fetching tickets:', err)
      state.value.tickets = []
      state.value.meta.total = 0
    } finally {
      state.value.loading = false
    }
  }

  const fetchTicket = async (id) => {
    try {
      console.log('Fetching ticket:', id)
      const response = await serviceTicketsAPI.getTicket(id)
      
      const ticket = response.data.data || response.data
      state.value.selectedTicket = ticket
      
      console.log('Ticket fetched:', ticket)
      return ticket
    } catch (err) {
      console.error('Error fetching ticket:', err)
      return null
    }
  }

  const createTicket = async (data) => {
    state.value.loading = true
    state.value.error = null

    try {
      console.log('Creating ticket:', data)
      const response = await serviceTicketsAPI.createTicket(data)
      const newTicket = response.data.data || response.data
      
      // Add to list
      state.value.tickets.unshift(newTicket)
      state.value.meta.total += 1
      
      return newTicket
    } catch (err) {
      const error = err.response?.data?.message || 'Failed to create ticket'
      state.value.error = error
      console.error('Error creating ticket:', err)
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const updateTicket = async (id, data) => {
    state.value.loading = true
    state.value.error = null

    try {
      console.log('Updating ticket:', id, data)
      const response = await serviceTicketsAPI.updateTicket(id, data)
      const updatedTicket = response.data.data || response.data
      
      // Update in list
      const index = state.value.tickets.findIndex(t => t.id === id)
      if (index !== -1) {
        state.value.tickets[index] = updatedTicket
      }
      
      // Update selected ticket if it's the same
      if (state.value.selectedTicket?.id === id) {
        state.value.selectedTicket = updatedTicket
      }
      
      return updatedTicket
    } catch (err) {
      const error = err.response?.data?.message || 'Failed to update ticket'
      state.value.error = error
      console.error('Error updating ticket:', err)
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const addMessage = async (ticketId, messageData) => {
    try {
      console.log('Adding message to ticket:', ticketId, messageData)
      const response = await serviceTicketsAPI.addMessage(ticketId, messageData)
      const newMessage = response.data.data || response.data
      
      // Add message to selected ticket
      if (state.value.selectedTicket?.id === ticketId) {
        if (!state.value.selectedTicket.messages) {
          state.value.selectedTicket.messages = []
        }
        state.value.selectedTicket.messages.push(newMessage)
      }
      
      // Update ticket in list
      const index = state.value.tickets.findIndex(t => t.id === ticketId)
      if (index !== -1) {
        if (!state.value.tickets[index].messages) {
          state.value.tickets[index].messages = []
        }
        state.value.tickets[index].messages.push(newMessage)
      }
      
      return newMessage
    } catch (err) {
      console.error('Error adding message:', err)
      throw err
    }
  }

  const closeTicket = async (id, reason = '') => {
    try {
      console.log('Closing ticket:', id, reason)
      const response = await serviceTicketsAPI.closeTicket(id, reason)
      
      // Handle different response formats
      let updatedTicket
      if (response.data.ticket) {
        updatedTicket = response.data.ticket
      } else if (response.data.data) {
        updatedTicket = response.data.data
      } else {
        updatedTicket = response.data
      }
      
      // Update in list
      const index = state.value.tickets.findIndex(t => t.id === id)
      if (index !== -1) {
        state.value.tickets[index] = updatedTicket
      }
      
      // Update selected ticket if it's the same
      if (state.value.selectedTicket?.id === id) {
        state.value.selectedTicket = updatedTicket
      }
      
      return updatedTicket
    } catch (err) {
      console.error('Error closing ticket:', err)
      throw err
    }
  }

  const assignTicket = async (id, assigneeId) => {
    try {
      console.log('Assigning ticket:', id, assigneeId)
      const response = await serviceTicketsAPI.assignTicket(id, assigneeId)
      
      // Handle different response formats
      let updatedTicket
      if (response.data.ticket) {
        // Backend returns { message: "...", ticket: {...} }
        updatedTicket = response.data.ticket
      } else if (response.data.data) {
        // Backend returns { data: {...} }
        updatedTicket = response.data.data
      } else {
        // Backend returns ticket directly
        updatedTicket = response.data
      }
      
      console.log('Updated ticket data:', updatedTicket)
      
      // Update in list
      const index = state.value.tickets.findIndex(t => t.id === id)
      if (index !== -1) {
        state.value.tickets[index] = updatedTicket
      }
      
      // Update selected ticket if it's the same
      if (state.value.selectedTicket?.id === id) {
        state.value.selectedTicket = updatedTicket
      }
      
      return updatedTicket
    } catch (err) {
      console.error('Error assigning ticket:', err)
      throw err
    }
  }

  const updatePriority = async (id, priority) => {
    try {
      console.log('Updating ticket priority:', id, priority)
      const response = await serviceTicketsAPI.updatePriority(id, priority)
      
      // Handle different response formats
      let updatedTicket
      if (response.data.ticket) {
        updatedTicket = response.data.ticket
      } else if (response.data.data) {
        updatedTicket = response.data.data
      } else {
        updatedTicket = response.data
      }
      
      // Update in list
      const index = state.value.tickets.findIndex(t => t.id === id)
      if (index !== -1) {
        state.value.tickets[index] = updatedTicket
      }
      
      // Update selected ticket if it's the same
      if (state.value.selectedTicket?.id === id) {
        state.value.selectedTicket = updatedTicket
      }
      
      return updatedTicket
    } catch (err) {
      console.error('Error updating priority:', err)
      throw err
    }
  }

  const updateStatus = async (id, status) => {
    try {
      console.log('Updating ticket status:', id, status)
      const response = await serviceTicketsAPI.updateStatus(id, status)
      
      // Handle different response formats
      let updatedTicket
      if (response.data.ticket) {
        updatedTicket = response.data.ticket
      } else if (response.data.data) {
        updatedTicket = response.data.data
      } else {
        updatedTicket = response.data
      }
      
      // Update in list
      const index = state.value.tickets.findIndex(t => t.id === id)
      if (index !== -1) {
        state.value.tickets[index] = updatedTicket
      }
      
      // Update selected ticket if it's the same
      if (state.value.selectedTicket?.id === id) {
        state.value.selectedTicket = updatedTicket
      }
      
      return updatedTicket
    } catch (err) {
      console.error('Error updating status:', err)
      throw err
    }
  }

  const fetchStats = async () => {
    try {
      console.log('Fetching ticket stats')
      const response = await serviceTicketsAPI.getStats()
      state.value.stats = response.data.data || response.data
      return state.value.stats
    } catch (err) {
      console.error('Error fetching stats:', err)
      return null
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await serviceTicketsAPI.getCategories()
      state.value.categories = response.data.data || response.data
      return state.value.categories
    } catch (err) {
      console.error('Error fetching categories:', err)
      return []
    }
  }

  const fetchPriorities = async () => {
    try {
      const response = await serviceTicketsAPI.getPriorities()
      state.value.priorities = response.data.data || response.data
      return state.value.priorities
    } catch (err) {
      console.error('Error fetching priorities:', err)
      return []
    }
  }

  const fetchStatuses = async () => {
    try {
      const response = await serviceTicketsAPI.getStatuses()
      state.value.statuses = response.data.data || response.data
      return state.value.statuses
    } catch (err) {
      console.error('Error fetching statuses:', err)
      return []
    }
  }

  const searchTickets = async (query, params = {}) => {
    try {
      const response = await serviceTicketsAPI.searchTickets(query, params)
      return response.data.data || response.data
    } catch (err) {
      console.error('Error searching tickets:', err)
      return []
    }
  }

  const bulkUpdate = async (ticketIds, data) => {
    try {
      const response = await serviceTicketsAPI.bulkUpdate(ticketIds, data)
      
      // Update tickets in list
      ticketIds.forEach(ticketId => {
        const index = state.value.tickets.findIndex(t => t.id === ticketId)
        if (index !== -1) {
          state.value.tickets[index] = { ...state.value.tickets[index], ...data }
        }
      })
      
      return response.data
    } catch (err) {
      console.error('Error bulk updating tickets:', err)
      throw err
    }
  }

  const exportTickets = async (params = {}) => {
    try {
      const response = await serviceTicketsAPI.exportTickets(params)
      
      // Create download link
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tickets-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      return true
    } catch (err) {
      console.error('Error exporting tickets:', err)
      throw err
    }
  }

  const setSelectedTicket = (ticket) => {
    state.value.selectedTicket = ticket
  }

  const clearError = () => {
    state.value.error = null
  }

  const resetFilters = () => {
    state.value.filters = createFilters()
  }

  return {
    // State
    tickets,
    loading,
    error,
    selectedTicket,
    stats,
    meta,
    filters,
    categories,
    priorities,
    statuses,
    
    // Computed
    openTickets,
    inProgressTickets,
    resolvedTickets,
    closedTickets,
    breachedSLATickets,
    ticketsByPriority,
    ticketsByAssignee,
    
    // Actions
    fetchTickets,
    fetchTicket,
    createTicket,
    updateTicket,
    addMessage,
    closeTicket,
    assignTicket,
    updatePriority,
    updateStatus,
    fetchStats,
    fetchCategories,
    fetchPriorities,
    fetchStatuses,
    searchTickets,
    bulkUpdate,
    exportTickets,
    setSelectedTicket,
    clearError,
    resetFilters
  }
})
