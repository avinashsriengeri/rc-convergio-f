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
      
      // Return fallback data for development/demo purposes
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout') || error.response?.status >= 500) {
        console.log('Meeting statuses API failed - using fallback data')
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
      
      // Return fallback data for development/demo purposes
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout') || error.response?.status >= 500) {
        console.log('Meeting providers API failed - using fallback data')
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
      throw error
    }
  },

  // Get meetings analytics
  async getMeetingsAnalytics(params = {}) {
    try {
      const response = await api.get('/meetings/analytics', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching meetings analytics:', error)
      throw error
    }
  },

  // Update meeting
  async updateMeeting(id, data) {
    try {
      const response = await api.put(`/meetings/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating meeting:', error)
      throw error
    }
  },

  // Delete meeting
  async deleteMeeting(id) {
    try {
      const response = await api.delete(`/meetings/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting meeting:', error)
      throw error
    }
  },

  // Get meeting details
  async getMeetingDetails(id) {
    try {
      const response = await api.get(`/meetings/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching meeting details:', error)
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
