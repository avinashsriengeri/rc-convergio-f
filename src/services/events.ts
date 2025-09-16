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
      
      // Return fallback data for development/demo purposes
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        console.log('Events API timeout - using fallback data')
        return {
          data: [
            {
              id: 1,
              name: 'Q4 Product Launch Webinar',
              description: 'Join us for an exclusive look at our latest product features and roadmap updates.',
              type: 'webinar',
              status: 'upcoming',
              scheduled_at: '2024-12-15T14:00:00Z',
              duration: 60,
              location: 'Virtual',
              max_attendees: 200,
              rsvp_going: 127,
              rsvp_interested: 23,
              rsvp_declined: 8,
              attended: 0,
              created_at: '2024-11-01T10:30:00Z',
              created_by: { id: 1, name: 'John Smith' }
            },
            {
              id: 2,
              name: 'Customer Success Summit 2025',
              description: 'Annual customer success conference featuring industry leaders and best practices.',
              type: 'conference',
              status: 'upcoming',
              scheduled_at: '2025-01-20T09:00:00Z',
              duration: 480,
              location: 'San Francisco, CA',
              max_attendees: 500,
              rsvp_going: 89,
              rsvp_interested: 45,
              rsvp_declined: 12,
              attended: 0,
              created_at: '2024-10-15T14:20:00Z',
              created_by: { id: 2, name: 'Sarah Johnson' }
            },
            {
              id: 3,
              name: 'Sales Training Workshop',
              description: 'Interactive workshop on advanced sales techniques and CRM optimization.',
              type: 'workshop',
              status: 'completed',
              scheduled_at: '2024-11-28T10:00:00Z',
              duration: 240,
              location: 'New York, NY',
              max_attendees: 50,
              rsvp_going: 42,
              rsvp_interested: 8,
              rsvp_declined: 3,
              attended: 38,
              created_at: '2024-10-01T08:15:00Z',
              created_by: { id: 1, name: 'John Smith' }
            },
            {
              id: 4,
              name: 'Demo Day - New Features',
              description: 'Live demonstration of our latest platform features and integrations.',
              type: 'demo',
              status: 'completed',
              scheduled_at: '2024-11-15T15:30:00Z',
              duration: 90,
              location: 'Virtual',
              max_attendees: 100,
              rsvp_going: 76,
              rsvp_interested: 15,
              rsvp_declined: 4,
              attended: 71,
              created_at: '2024-10-20T11:45:00Z',
              created_by: { id: 3, name: 'Mike Wilson' }
            },
            {
              id: 5,
              name: 'Partner Network Meeting',
              description: 'Quarterly meeting with our partner network to discuss collaboration opportunities.',
              type: 'meeting',
              status: 'upcoming',
              scheduled_at: '2024-12-30T11:00:00Z',
              duration: 120,
              location: 'Chicago, IL',
              max_attendees: 75,
              rsvp_going: 34,
              rsvp_interested: 12,
              rsvp_declined: 2,
              attended: 0,
              created_at: '2024-11-10T16:30:00Z',
              created_by: { id: 2, name: 'Sarah Johnson' }
            }
          ],
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 5,
            from: 1,
            to: 5
          }
        }
      }
      
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
      
      // Return fallback data
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          data: [
            { id: 'webinar', name: 'Webinar', description: 'Online presentation or training session' },
            { id: 'conference', name: 'Conference', description: 'Large-scale professional gathering' },
            { id: 'workshop', name: 'Workshop', description: 'Interactive training or learning session' },
            { id: 'demo', name: 'Demo', description: 'Product demonstration or showcase' },
            { id: 'meeting', name: 'Meeting', description: 'Business or team meeting' },
            { id: 'networking', name: 'Networking', description: 'Professional networking event' },
            { id: 'training', name: 'Training', description: 'Educational or skill development session' }
          ]
        }
      }
      
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
      
      // Return fallback data
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          data: [
            { id: 'going', name: 'Going', description: 'Confirmed attendance' },
            { id: 'interested', name: 'Interested', description: 'Interested but not confirmed' },
            { id: 'declined', name: 'Declined', description: 'Cannot attend' }
          ]
        }
      }
      
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
      
      // Return fallback data
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          data: [
            {
              id: 1,
              name: 'Alice Johnson',
              email: 'alice.johnson@example.com',
              company: 'Tech Corp',
              rsvp_status: 'going',
              attended: false,
              registered_at: '2024-11-01T10:35:00Z'
            },
            {
              id: 2,
              name: 'Bob Smith',
              email: 'bob.smith@example.com',
              company: 'Innovation Inc',
              rsvp_status: 'going',
              attended: false,
              registered_at: '2024-11-02T14:20:00Z'
            },
            {
              id: 3,
              name: 'Carol Davis',
              email: 'carol.davis@example.com',
              company: 'Future Systems',
              rsvp_status: 'interested',
              attended: false,
              registered_at: '2024-11-03T09:15:00Z'
            }
          ]
        }
      }
      
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
      const response = await api.get('/analytics/events', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching events analytics:', error)
      
      // Return fallback data for development/demo purposes
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        console.log('Events analytics API timeout - using fallback data')
        return {
          data: {
            total_events: 25,
            upcoming_events: 8,
            completed_events: 17,
            total_attendees: 1247,
            total_rsvps: 2156,
            avg_attendance_rate: 78.5,
            avg_rsvp_rate: 85.2,
            events_by_type: [
              {
                type: 'webinar',
                count: 12,
                total_attendees: 456,
                avg_attendance_rate: 82.1
              },
              {
                type: 'conference',
                count: 3,
                total_attendees: 234,
                avg_attendance_rate: 75.8
              },
              {
                type: 'workshop',
                count: 6,
                total_attendees: 312,
                avg_attendance_rate: 79.2
              },
              {
                type: 'demo',
                count: 4,
                total_attendees: 245,
                avg_attendance_rate: 76.5
              }
            ],
            top_performing_events: [
              {
                id: 1,
                name: 'Q4 Product Launch Webinar',
                type: 'webinar',
                total_rsvps: 158,
                total_attendees: 127,
                attendance_rate: 80.4,
                scheduled_at: '2024-12-15T14:00:00Z'
              },
              {
                id: 2,
                name: 'Customer Success Summit 2025',
                type: 'conference',
                total_rsvps: 146,
                total_attendees: 89,
                attendance_rate: 61.0,
                scheduled_at: '2025-01-20T09:00:00Z'
              },
              {
                id: 3,
                name: 'Sales Training Workshop',
                type: 'workshop',
                total_rsvps: 53,
                total_attendees: 38,
                attendance_rate: 71.7,
                scheduled_at: '2024-11-28T10:00:00Z'
              }
            ],
            monthly_trends: [
              {
                month: '2024-09',
                events_count: 3,
                total_attendees: 156,
                avg_attendance_rate: 78.2
              },
              {
                month: '2024-10',
                events_count: 5,
                total_attendees: 234,
                avg_attendance_rate: 76.8
              },
              {
                month: '2024-11',
                events_count: 7,
                total_attendees: 312,
                avg_attendance_rate: 79.1
              },
              {
                month: '2024-12',
                events_count: 4,
                total_attendees: 189,
                avg_attendance_rate: 81.3
              },
              {
                month: '2025-01',
                events_count: 6,
                total_attendees: 356,
                avg_attendance_rate: 77.9
              }
            ],
            period: 'last_6_months',
            last_updated: '2024-01-20T15:30:00Z'
          }
        }
      }
      
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
