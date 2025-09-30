import api from './api'

// Lead Scoring API wrappers - DYNAMIC DATA ONLY
export const leadScoringService = {
  // Get event types
  async getEventTypes() {
    try {
      const response = await api.get('/lead-scoring/event-types')
      return response.data
    } catch (error) {
      console.error('Error fetching event types:', error)
      throw error
    }
  },

  // Get operators
  async getOperators() {
    try {
      const response = await api.get('/lead-scoring/operators')
      return response.data
    } catch (error) {
      console.error('Error fetching operators:', error)
      throw error
    }
  },

  // Get scoring rules
  async getScoringRules(params = {}) {
    try {
      const response = await api.get('/lead-scoring/rules', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching scoring rules:', error)
      throw error
    }
  },

  // Create scoring rule
  async createScoringRule(data) {
    try {
      const response = await api.post('/lead-scoring/rules', data)
      return response.data
    } catch (error) {
      console.error('Error creating scoring rule:', error)
      throw error
    }
  },

  // Update scoring rule
  async updateScoringRule(id, data) {
    try {
      const response = await api.put(`/lead-scoring/rules/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating scoring rule:', error)
      throw error
    }
  },

  // Delete scoring rule
  async deleteScoringRule(id) {
    try {
      const response = await api.delete(`/lead-scoring/rules/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting scoring rule:', error)
      throw error
    }
  },

  // Recalculate score for contact
  async recalculateScore(contactId) {
    try {
      const response = await api.post(`/lead-scoring/recalculate/${contactId}`)
      return response.data
    } catch (error) {
      console.error('Error recalculating score:', error)
      throw error
    }
  },

  // Get scoring stats
  async getScoringStats() {
    try {
      const response = await api.get('/lead-scoring/stats')
      return response.data
    } catch (error) {
      console.error('Error fetching scoring stats:', error)
      throw error
    }
  },

  // Get top scoring contacts
  async getTopContacts(limit = 10) {
    try {
      const response = await api.get('/lead-scoring/top-contacts', { params: { limit } })
      return response.data
    } catch (error) {
      console.error('Error fetching top contacts:', error)
      throw error
    }
  },

  // Get lead scoring analytics
  async getLeadScoringAnalytics(params = {}) {
    try {
      const response = await api.get('/analytics/lead-scoring', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching lead scoring analytics:', error)
      throw error
    }
  },

  // Bulk recalculate scores for multiple contacts
  async bulkRecalculateScores(contactIds = []) {
    try {
      const response = await api.post('/lead-scoring/bulk-recalculate', { contact_ids: contactIds })
      return response.data
    } catch (error) {
      console.error('Error bulk recalculating scores:', error)
      throw error
    }
  },

  // Bulk activate scoring rules
  async bulkActivateRules(ruleIds) {
    try {
      const response = await api.post('/lead-scoring/bulk-activate', { rule_ids: ruleIds })
      return response.data
    } catch (error) {
      console.error('Error bulk activating rules:', error)
      throw error
    }
  },

  // Bulk deactivate scoring rules
  async bulkDeactivateRules(ruleIds) {
    try {
      const response = await api.post('/lead-scoring/bulk-deactivate', { rule_ids: ruleIds })
      return response.data
    } catch (error) {
      console.error('Error bulk deactivating rules:', error)
      throw error
    }
  },

  // Export scoring rules
  async exportRules(params = {}) {
    try {
      const response = await api.get('/lead-scoring/export', { 
        params,
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error('Error exporting rules:', error)
      throw error
    }
  },

  // Import scoring rules
  async importRules(file) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await api.post('/lead-scoring/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error importing rules:', error)
      throw error
    }
  },

  // Recalculate score for contact by email
  async recalculateScoreByEmail(contactEmail) {
    try {
      const response = await api.post(`/lead-scoring/recalculate-by-email`, { email: contactEmail })
      return response.data
    } catch (error) {
      console.error('Error recalculating score by email:', error)
      throw error
    }
  },

  // Get contact score by ID
  async getContactScore(contactId) {
    try {
      const response = await api.get(`/contacts/${contactId}/score`)
      return response.data
    } catch (error) {
      console.error('Error fetching contact score:', error)
      throw error
    }
  },

  // Get contact score by email
  async getContactScoreByEmail(email) {
    try {
      const response = await api.post('/lead-scoring/score-by-email', { email })
      return response.data
    } catch (error) {
      console.error('Error fetching contact score by email:', error)
      throw error
    }
  },

  // Get available time windows for scoring rules
  async getTimeWindows() {
    try {
      const response = await api.get('/lead-scoring/time-windows')
      return response.data
    } catch (error) {
      console.error('Error fetching time windows:', error)
      return [
        { value: '1h', label: '1 Hour' },
        { value: '24h', label: '24 Hours' },
        { value: '7d', label: '7 Days' },
        { value: '30d', label: '30 Days' },
        { value: '90d', label: '90 Days' }
      ]
    }
  },

  // Validate a scoring condition
  async validateCondition(condition) {
    try {
      const response = await api.post('/lead-scoring/validate-condition', { condition })
      return { valid: true, data: response.data }
    } catch (error) {
      if (error.response?.data?.errors) {
        return { valid: false, errors: error.response.data.errors }
      }
      console.error('Error validating condition:', error)
      return { valid: false, errors: ['Failed to validate condition'] }
    }
  },

  // Get detailed scoring information for a contact
  async getContactScoringDetails(contactId) {
    try {
      const response = await api.get(`/contacts/${contactId}/scoring-details`)
      return response.data
    } catch (error) {
      console.error('Error fetching contact scoring details:', error)
      throw error
    }
  },

  // Recalculate score for a single contact by ID
  async recalculateContactScore(contactId) {
    try {
      const response = await api.post(`/contacts/${contactId}/recalculate-score`)
      return response.data
    } catch (error) {
      console.error('Error recalculating contact score:', error)
      throw error
    }
  },

  // Bulk recalculate scores by emails
  async bulkRecalculateScoresByEmails(contactEmails = []) {
    try {
      const response = await api.post('/lead-scoring/bulk-recalculate-by-emails', { emails: contactEmails })
      return response.data
    } catch (error) {
      console.error('Error bulk recalculating scores by emails:', error)
      throw error
    }
  },

  // Export contacts with their scores
  async exportContactsWithScores(params = {}) {
    try {
      const response = await api.get('/lead-scoring/contacts/export', { 
        params,
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error('Error exporting contacts with scores:', error)
      throw error
    }
  },

  // Get enhanced scoring statistics
  async getEnhancedScoringStats() {
    try {
      const response = await api.get('/lead-scoring/enhanced-stats')
      return response.data
    } catch (error) {
      console.error('Error fetching enhanced scoring stats:', error)
      throw error
    }
  },

  // Get detailed contact scoring information
  async getContactScoringDetails(contactId) {
    try {
      const response = await api.get(`/lead-scoring/contacts/${contactId}/details`)
      return response.data
    } catch (error) {
      console.error('Error fetching contact scoring details:', error)
      throw error
    }
  },

  // Get scoring trends and historical data
  async getScoringTrends(params = {}) {
    try {
      const response = await api.get('/lead-scoring/trends', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching scoring trends:', error)
      throw error
    }
  }
}

// Helper functions for lead scoring data processing
export const leadScoringHelpers = {
  // Get priority color
  getPriorityColor(priority) {
    const colors = {
      1: 'bg-red-100 text-red-800',
      2: 'bg-orange-100 text-orange-800',
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-blue-100 text-blue-800',
      5: 'bg-gray-100 text-gray-800'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800'
  },

  // Get priority name
  getPriorityName(priority) {
    const names = {
      1: 'Critical',
      2: 'High',
      3: 'Medium',
      4: 'Low',
      5: 'Minimal'
    }
    return names[priority] || 'Unknown'
  },

  // Get status color
  getStatusColor(isActive) {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  },

  // Get status text
  getStatusText(isActive) {
    return isActive ? 'Active' : 'Inactive'
  },

  // Get score color based on value
  getScoreColor(score) {
    if (score >= 80) return 'text-red-600 font-bold'
    if (score >= 60) return 'text-orange-600 font-semibold'
    if (score >= 40) return 'text-yellow-600 font-medium'
    return 'text-gray-600'
  },

  // Format date
  formatDate(dateString) {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  },

  // Format number with commas
  formatNumber(num) {
    if (typeof num !== 'number') return num
    return num.toLocaleString()
  },

  // Validate JSON condition
  validateCondition(condition) {
    try {
      if (typeof condition === 'string') {
        JSON.parse(condition)
      }
      return true
    } catch (error) {
      return false
    }
  },

  // Format condition for display
  formatCondition(condition) {
    if (typeof condition === 'string') {
      try {
        condition = JSON.parse(condition)
      } catch (error) {
        return 'Invalid condition'
      }
    }

    if (!condition || typeof condition !== 'object') {
      return 'No condition set'
    }

    const { event_type, operator, value, time_window } = condition
    
    let formatted = `${event_type || 'Unknown'} ${operator || 'Unknown'} ${value || 'Unknown'}`
    
    if (time_window) {
      formatted += ` (${time_window})`
    }
    
    return formatted
  },

  // Get score change color
  getScoreChangeColor(change) {
    if (!change) return 'text-gray-500'
    if (change.startsWith('+')) return 'text-green-600'
    if (change.startsWith('-')) return 'text-red-600'
    return 'text-gray-500'
  }
}