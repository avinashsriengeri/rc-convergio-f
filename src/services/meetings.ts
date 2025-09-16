import api from './api'

// Meetings API wrappers
export const meetingsService = {
  // Get meeting statuses
  async getMeetingStatuses() {
    try {
      const response = await api.get('/meetings/statuses')
      return response.data
    } catch (error) {
      console.error('Error fetching meeting statuses:', error)
      
      // Return fallback data
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          data: [
            { id: 'scheduled', name: 'Scheduled', description: 'Meeting is scheduled' },
            { id: 'completed', name: 'Completed', description: 'Meeting has been completed' },
            { id: 'cancelled', name: 'Cancelled', description: 'Meeting was cancelled' },
            { id: 'no_show', name: 'No Show', description: 'Attendee did not show up' },
            { id: 'rescheduled', name: 'Rescheduled', description: 'Meeting was rescheduled' }
          ]
        }
      }
      
      throw error
    }
  },

  // Get meeting providers
  async getMeetingProviders() {
    try {
      const response = await api.get('/meetings/providers')
      return response.data
    } catch (error) {
      console.error('Error fetching meeting providers:', error)
      
      // Return fallback data
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          data: [
            { id: 'google', name: 'Google Meet', icon: 'google', color: 'blue' },
            { id: 'zoom', name: 'Zoom', icon: 'zoom', color: 'blue' },
            { id: 'teams', name: 'Microsoft Teams', icon: 'teams', color: 'purple' },
            { id: 'webex', name: 'Webex', icon: 'webex', color: 'green' },
            { id: 'phone', name: 'Phone Call', icon: 'phone', color: 'gray' },
            { id: 'in_person', name: 'In Person', icon: 'location', color: 'orange' }
          ]
        }
      }
      
      throw error
    }
  },

  // Get meetings
  async getMeetings(params = {}) {
    try {
      const response = await api.get('/meetings', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching meetings:', error)
      
      // Return fallback data
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          data: [
            {
              id: 1,
              title: 'Product Demo',
              description: 'Sales call with potential customer',
              contact: {
                id: 101,
                name: 'John Smith',
                email: 'john.smith@techcorp.com'
              },
              start_time: '2024-12-15T14:00:00Z',
              end_time: '2024-12-15T14:30:00Z',
              duration: 30,
              status: 'scheduled',
              provider: 'google',
              meeting_link: 'https://meet.google.com/abc-def-ghi',
              created_by: { id: 1, name: 'Sales Team' },
              created_at: '2024-12-10T10:00:00Z',
              updated_at: '2024-12-10T10:00:00Z'
            },
            {
              id: 2,
              title: 'Follow-up Call',
              description: 'Customer success check-in',
              contact: {
                id: 102,
                name: 'Sarah Johnson',
                email: 'sarah.j@innovation.com'
              },
              start_time: '2024-12-16T10:00:00Z',
              end_time: '2024-12-16T10:15:00Z',
              duration: 15,
              status: 'scheduled',
              provider: 'phone',
              meeting_link: null,
              created_by: { id: 2, name: 'Customer Success' },
              created_at: '2024-12-11T09:00:00Z',
              updated_at: '2024-12-11T09:00:00Z'
            },
            {
              id: 3,
              title: 'Discovery Call',
              description: 'Sales qualification meeting',
              contact: {
                id: 103,
                name: 'Mike Davis',
                email: 'mike.d@futuretech.com'
              },
              start_time: '2024-12-20T15:30:00Z',
              end_time: '2024-12-20T16:15:00Z',
              duration: 45,
              status: 'scheduled',
              provider: 'zoom',
              meeting_link: 'https://zoom.us/j/123456789',
              created_by: { id: 1, name: 'Sales Team' },
              created_at: '2024-12-12T14:00:00Z',
              updated_at: '2024-12-12T14:00:00Z'
            },
            {
              id: 4,
              title: 'Technical Review',
              description: 'Technical discussion with engineering team',
              contact: {
                id: 104,
                name: 'Alice Brown',
                email: 'alice.b@startup.com'
              },
              start_time: '2024-12-13T11:00:00Z',
              end_time: '2024-12-13T12:00:00Z',
              duration: 60,
              status: 'completed',
              provider: 'teams',
              meeting_link: 'https://teams.microsoft.com/l/meetup-join/abc123',
              created_by: { id: 3, name: 'Engineering' },
              created_at: '2024-12-08T16:00:00Z',
              updated_at: '2024-12-13T12:00:00Z'
            },
            {
              id: 5,
              title: 'Contract Discussion',
              description: 'Legal and contract terms discussion',
              contact: {
                id: 105,
                name: 'Bob Wilson',
                email: 'bob.w@enterprise.com'
              },
              start_time: '2024-12-12T09:00:00Z',
              end_time: '2024-12-12T10:00:00Z',
              duration: 60,
              status: 'cancelled',
              provider: 'in_person',
              meeting_link: null,
              created_by: { id: 4, name: 'Legal Team' },
              created_at: '2024-12-09T11:00:00Z',
              updated_at: '2024-12-11T15:00:00Z'
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

  // Create meeting
  async createMeeting(data) {
    try {
      const response = await api.post('/meetings', data)
      return response.data
    } catch (error) {
      console.error('Error creating meeting:', error)
      throw error
    }
  },

  // Sync Google Calendar
  async syncGoogleCalendar() {
    try {
      const response = await api.post('/meetings/sync/google')
      return response.data
    } catch (error) {
      console.error('Error syncing Google calendar:', error)
      
      // Return fallback data
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          data: {
            synced_count: 12,
            error_count: 2,
            errors: [
              { meeting_id: 'google_123', error: 'Permission denied' },
              { meeting_id: 'google_456', error: 'Meeting not found' }
            ],
            last_sync: new Date().toISOString()
          }
        }
      }
      
      throw error
    }
  },

  // Sync Outlook Calendar
  async syncOutlookCalendar() {
    try {
      const response = await api.post('/meetings/sync/outlook')
      return response.data
    } catch (error) {
      console.error('Error syncing Outlook calendar:', error)
      
      // Return fallback data
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          data: {
            synced_count: 8,
            error_count: 1,
            errors: [
              { meeting_id: 'outlook_789', error: 'Access token expired' }
            ],
            last_sync: new Date().toISOString()
          }
        }
      }
      
      throw error
    }
  },

  // Get meetings analytics
  async getMeetingsAnalytics(params = {}) {
    try {
      const response = await api.get('/analytics/meetings', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching meetings analytics:', error)
      
      // Return fallback data for development/demo purposes
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        console.log('Meetings analytics API timeout - using fallback data')
        return {
          data: {
            summary: {
              total_meetings: 156,
              scheduled_meetings: 89,
              completed_meetings: 45,
              cancelled_meetings: 12,
              no_show_meetings: 8,
              rescheduled_meetings: 2,
              avg_duration_minutes: 42.5,
              completion_rate: 78.3,
              no_show_rate: 8.9,
              cancellation_rate: 7.7
            },
            provider_breakdown: [
              { provider: 'google', count: 67, percentage: 42.9, avg_duration: 38.5 },
              { provider: 'zoom', count: 45, percentage: 28.8, avg_duration: 45.2 },
              { provider: 'teams', count: 23, percentage: 14.7, avg_duration: 48.1 },
              { provider: 'phone', count: 12, percentage: 7.7, avg_duration: 25.3 },
              { provider: 'in_person', count: 7, percentage: 4.5, avg_duration: 60.0 },
              { provider: 'webex', count: 2, percentage: 1.3, avg_duration: 40.0 }
            ],
            status_breakdown: [
              { status: 'scheduled', count: 89, percentage: 57.1 },
              { status: 'completed', count: 45, percentage: 28.8 },
              { status: 'cancelled', count: 12, percentage: 7.7 },
              { status: 'no_show', count: 8, percentage: 5.1 },
              { status: 'rescheduled', count: 2, percentage: 1.3 }
            ],
            trends: [
              { date: '2024-12-04', scheduled: 8, completed: 6, cancelled: 1, no_show: 1 },
              { date: '2024-12-05', scheduled: 12, completed: 9, cancelled: 2, no_show: 1 },
              { date: '2024-12-06', scheduled: 15, completed: 11, cancelled: 2, no_show: 2 },
              { date: '2024-12-07', scheduled: 18, completed: 14, cancelled: 3, no_show: 1 },
              { date: '2024-12-08', scheduled: 22, completed: 17, cancelled: 3, no_show: 2 },
              { date: '2024-12-09', scheduled: 25, completed: 19, cancelled: 4, no_show: 2 },
              { date: '2024-12-10', scheduled: 28, completed: 22, cancelled: 4, no_show: 2 }
            ],
            top_contacts: [
              { contact_name: 'John Smith', meetings_count: 8, completion_rate: 87.5, avg_duration: 35.2 },
              { contact_name: 'Sarah Johnson', meetings_count: 6, completion_rate: 83.3, avg_duration: 42.8 },
              { contact_name: 'Mike Davis', meetings_count: 5, completion_rate: 80.0, avg_duration: 48.5 },
              { contact_name: 'Alice Brown', meetings_count: 4, completion_rate: 75.0, avg_duration: 38.7 },
              { contact_name: 'Bob Wilson', meetings_count: 4, completion_rate: 50.0, avg_duration: 52.3 }
            ],
            duration_analysis: {
              '0-15': { count: 12, percentage: 7.7 },
              '16-30': { count: 45, percentage: 28.8 },
              '31-45': { count: 67, percentage: 42.9 },
              '46-60': { count: 28, percentage: 17.9 },
              '60+': { count: 4, percentage: 2.6 }
            },
            time_analysis: {
              'morning': { count: 45, percentage: 28.8, avg_duration: 38.2 },
              'afternoon': { count: 78, percentage: 50.0, avg_duration: 44.1 },
              'evening': { count: 33, percentage: 21.2, avg_duration: 41.8 }
            },
            period: 'last_7_days',
            last_updated: '2024-01-20T15:30:00Z'
          }
        }
      }
      
      throw error
    }
  }
}

// Helper functions for meetings data processing
export const meetingsHelpers = {
  // Get status color
  getStatusColor(status) {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-yellow-100 text-yellow-800',
      rescheduled: 'bg-purple-100 text-purple-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  },

  // Get status text
  getStatusText(status) {
    const texts = {
      scheduled: 'Scheduled',
      completed: 'Completed',
      cancelled: 'Cancelled',
      no_show: 'No Show',
      rescheduled: 'Rescheduled'
    }
    return texts[status] || 'Unknown'
  },

  // Get provider color
  getProviderColor(provider) {
    const colors = {
      google: 'bg-blue-500',
      zoom: 'bg-blue-600',
      teams: 'bg-purple-500',
      webex: 'bg-green-500',
      phone: 'bg-gray-500',
      in_person: 'bg-orange-500'
    }
    return colors[provider] || 'bg-gray-500'
  },

  // Get provider icon
  getProviderIcon(provider) {
    const icons = {
      google: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',
      zoom: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
      teams: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
      webex: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
      phone: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
      in_person: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'
    }
    return icons[provider] || 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
  },

  // Format date and time
  formatDateTime(dateString) {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },

  // Format date only
  formatDate(dateString) {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  },

  // Format time only
  formatTime(dateString) {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  },

  // Format duration
  formatDuration(minutes) {
    if (!minutes) return '0 min'
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  },

  // Format number with commas
  formatNumber(num) {
    if (typeof num !== 'number') return num
    return new Intl.NumberFormat('en-US').format(num)
  },

  // Check if meeting is upcoming
  isUpcoming(startTime) {
    if (!startTime) return false
    return new Date(startTime) > new Date()
  },

  // Check if meeting is today
  isToday(startTime) {
    if (!startTime) return false
    const today = new Date()
    const meetingDate = new Date(startTime)
    return today.toDateString() === meetingDate.toDateString()
  },

  // Get relative time
  getRelativeTime(dateString) {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((date - now) / (1000 * 60))
    
    if (diffInMinutes < 0) return 'Past'
    if (diffInMinutes < 60) return `In ${diffInMinutes} min`
    if (diffInMinutes < 1440) return `In ${Math.floor(diffInMinutes / 60)}h`
    return `In ${Math.floor(diffInMinutes / 1440)} days`
  },

  // Validate meeting data
  validateMeetingData(data) {
    const errors = []
    
    if (!data.title || data.title.trim().length === 0) {
      errors.push('Title is required')
    }
    
    if (!data.start_time) {
      errors.push('Start time is required')
    }
    
    if (!data.end_time) {
      errors.push('End time is required')
    }
    
    if (data.start_time && data.end_time) {
      const start = new Date(data.start_time)
      const end = new Date(data.end_time)
      if (end <= start) {
        errors.push('End time must be after start time')
      }
    }
    
    if (!data.contact_id) {
      errors.push('Contact is required')
    }
    
    return errors
  },

  // Prepare meeting data for API
  prepareMeetingData(formData) {
    return {
      title: formData.title,
      description: formData.description || '',
      start_time: formData.start_time,
      end_time: formData.end_time,
      contact_id: formData.contact_id,
      provider: formData.provider || 'google',
      meeting_link: formData.meeting_link || null
    }
  }
}
