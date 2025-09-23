import api from './api'

// Events Management API wrappers
export const eventsService = {
  // Get events with filters
  async getEvents(params = {}) {
    try {
      const response = await api.get('/events', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching events:', error)
      throw error
    }
  },

  // Get event types
  async getEventTypes() {
    try {
      const response = await api.get('/events/types')
      return response.data
    } catch (error) {
      console.error('Error fetching event types:', error)
      throw error
    }
  },

  // Get RSVP statuses
  async getRsvpStatuses() {
    try {
      const response = await api.get('/events/rsvp-statuses')
      return response.data
    } catch (error) {
      console.error('Error fetching RSVP statuses:', error)
      throw error
    }
  },

  // Create event
  async createEvent(data) {
    try {
      const response = await api.post('/events', data)
      return response.data
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  },

  // Get event details
  async getEvent(id) {
    try {
      const response = await api.get(`/events/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching event details:', error)
      throw error
    }
  },

  // Update event
  async updateEvent(id, data) {
    try {
      const response = await api.put(`/events/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  },

  // Delete event
  async deleteEvent(id) {
    try {
      const response = await api.delete(`/events/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  },

  // Add attendee to event
  async addAttendee(eventId, attendeeData) {
    try {
      const response = await api.post(`/events/${eventId}/attendees`, attendeeData)
      return response.data
    } catch (error) {
      console.error('Error adding attendee:', error)
      throw error
    }
  },

  // Get event attendees
  async getEventAttendees(eventId, params = {}) {
    try {
      const response = await api.get(`/events/${eventId}/attendees`, { params })
      return response.data
    } catch (error) {
      console.error('Error fetching event attendees:', error)
      throw error
    }
  },

  // Mark attendee as attended
  async markAttended(eventId, attendeeId) {
    try {
      const response = await api.post(`/events/${eventId}/attendees/${attendeeId}/attended`)
      return response.data
    } catch (error) {
      console.error('Error marking attendee as attended:', error)
      throw error
    }
  },

  // Get events analytics
  async getEventsAnalytics(params = {}) {
    try {
      const response = await api.get('/events/analytics', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching events analytics:', error)
      throw error
    }
  },

  // Public event registration
  async publicRegister(eventId, attendeeData) {
    try {
      const response = await api.post(`/public/events/${eventId}/register`, attendeeData)
      return response.data
    } catch (error) {
      console.error('Error registering for event:', error)
      throw error
    }
  },

  // Get event share link
  async getEventShareLink(eventId) {
    try {
      const response = await api.get(`/events/${eventId}/share-link`)
      return response.data
    } catch (error) {
      console.error('Error fetching event share link:', error)
      throw error
    }
  },

  // Get event QR code
  async getEventQRCode(eventId) {
    try {
      const response = await api.get(`/events/${eventId}/qr-code`)
      return response.data
    } catch (error) {
      console.error('Error fetching event QR code:', error)
      throw error
    }
  },

  // Get event calendar links
  async getEventCalendarLinks(eventId) {
    try {
      const response = await api.get(`/events/${eventId}/calendar`)
      return response.data
    } catch (error) {
      console.error('Error fetching event calendar links:', error)
      throw error
    }
  },

  // Send event invitations
  async sendEventInvitations(eventId, invitationData) {
    try {
      const response = await api.post(`/events/${eventId}/send-invitations`, invitationData)
      return response.data
    } catch (error) {
      console.error('Error sending event invitations:', error)
      throw error
    }
  },

  // Get event analytics
  async getEventAnalytics(eventId) {
    try {
      const response = await api.get(`/events/${eventId}/analytics`)
      return response.data
    } catch (error) {
      console.error('Error fetching event analytics:', error)
      throw error
    }
  },

  // Get public event details (no auth required)
  async getPublicEvent(eventId) {
    try {
      const response = await api.get(`/public/events/${eventId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching public event details:', error)
      throw error
    }
  },

  // Get email templates for invitations
  async getEmailTemplates() {
    try {
      const response = await api.get('/campaigns/templates')
      return response.data
    } catch (error) {
      console.error('Error fetching email templates:', error)
      throw error
    }
  },

  // Get contacts for invitations
  async getContacts(params = {}) {
    try {
      const response = await api.get('/contacts', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching contacts:', error)
      throw error
    }
  },

  // Process RSVP response (for public RSVP confirmation)
  async processRSVP(eventId, rsvpData) {
    try {
      const response = await api.post(`/public/events/${eventId}/rsvp`, rsvpData)
      return response.data
    } catch (error) {
      console.error('Error processing RSVP:', error)
      throw error
    }
  }
}

// Helper functions for events data processing
export const eventsHelpers = {
  // Get event type color
  getEventTypeColor(type) {
    const colors = {
      webinar: 'bg-blue-100 text-blue-800',
      conference: 'bg-purple-100 text-purple-800',
      workshop: 'bg-green-100 text-green-800',
      demo: 'bg-orange-100 text-orange-800',
      meeting: 'bg-gray-100 text-gray-800',
      networking: 'bg-pink-100 text-pink-800',
      training: 'bg-indigo-100 text-indigo-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  },

  // Get event status color
  getEventStatusColor(status) {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  },

  // Get RSVP status color
  getRsvpStatusColor(status) {
    const colors = {
      going: 'bg-green-100 text-green-800',
      interested: 'bg-yellow-100 text-yellow-800',
      declined: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  },

  // Format date and time
  formatDateTime(dateString) {
    if (!dateString) return 'Not scheduled'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },

  // Format duration in minutes to readable format
  formatDuration(minutes) {
    if (!minutes) return 'Not specified'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    if (hours === 0) {
      return `${mins}m`
    } else if (mins === 0) {
      return `${hours}h`
    } else {
      return `${hours}h ${mins}m`
    }
  },

  // Calculate utilization rate
  calculateUtilizationRate(event) {
    if (!event.max_attendees || event.max_attendees === 0) return 0
    const totalRsvps = event.rsvp_going + event.rsvp_interested
    return Math.round((totalRsvps / event.max_attendees) * 100)
  },

  // Format number with commas
  formatNumber(num) {
    if (!num) return '0'
    return num.toLocaleString()
  },

  // Check if event is upcoming
  isEventUpcoming(event) {
    if (!event.scheduled_at) return false
    return new Date(event.scheduled_at) > new Date()
  },

  // Check if event is completed
  isEventCompleted(event) {
    if (!event.scheduled_at) return false
    return new Date(event.scheduled_at) <= new Date()
  }
}
