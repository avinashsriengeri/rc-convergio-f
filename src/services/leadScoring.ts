import api from './api'

// Lead Scoring API wrappers
export const leadScoringService = {
  // Get event types
  async getEventTypes() {
    try {
      const response = await api.get('/lead-scoring/event-types')
      return response.data
    } catch (error) {
      console.error('Error fetching event types:', error)
      
      // Return fallback data
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          data: [
            { id: 'email_open', name: 'Email Open', description: 'Contact opened an email' },
            { id: 'email_click', name: 'Email Click', description: 'Contact clicked a link in an email' },
            { id: 'page_view', name: 'Page View', description: 'Contact viewed a page' },
            { id: 'form_submit', name: 'Form Submit', description: 'Contact submitted a form' },
            { id: 'download', name: 'Download', description: 'Contact downloaded a resource' },
            { id: 'demo_request', name: 'Demo Request', description: 'Contact requested a demo' },
            { id: 'pricing_view', name: 'Pricing View', description: 'Contact viewed pricing page' },
            { id: 'trial_signup', name: 'Trial Signup', description: 'Contact signed up for trial' },
            { id: 'webinar_attend', name: 'Webinar Attend', description: 'Contact attended a webinar' },
            { id: 'social_engagement', name: 'Social Engagement', description: 'Contact engaged on social media' }
          ]
        }
      }
      
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
      
      // Return fallback data
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          data: [
            { id: 'equals', name: 'Equals', description: 'Value equals exactly' },
            { id: 'not_equals', name: 'Not Equals', description: 'Value does not equal' },
            { id: 'greater_than', name: 'Greater Than', description: 'Value is greater than' },
            { id: 'less_than', name: 'Less Than', description: 'Value is less than' },
            { id: 'contains', name: 'Contains', description: 'Value contains text' },
            { id: 'not_contains', name: 'Not Contains', description: 'Value does not contain text' },
            { id: 'is_empty', name: 'Is Empty', description: 'Value is empty or null' },
            { id: 'is_not_empty', name: 'Is Not Empty', description: 'Value is not empty' }
          ]
        }
      }
      
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
      
      // Return fallback data
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          data: [
            {
              id: 1,
              name: 'Email Engagement Score',
              description: 'Scoring based on email interactions',
              points: 30,
              priority: 1,
              is_active: true,
              condition: {
                event_type: 'email_open',
                operator: 'greater_than',
                value: 5,
                time_window: '30_days'
              },
              created_at: '2024-11-15T10:00:00Z',
              updated_at: '2024-12-10T14:30:00Z',
              created_by: { id: 1, name: 'John Smith' }
            },
            {
              id: 2,
              name: 'Website Behavior Score',
              description: 'Scoring based on website interactions',
              points: 50,
              priority: 2,
              is_active: true,
              condition: {
                event_type: 'pricing_view',
                operator: 'equals',
                value: 1,
                time_window: '7_days'
              },
              created_at: '2024-11-10T09:00:00Z',
              updated_at: '2024-12-08T16:45:00Z',
              created_by: { id: 2, name: 'Sarah Johnson' }
            },
            {
              id: 3,
              name: 'Form Submission Score',
              description: 'Scoring for form completions',
              points: 25,
              priority: 3,
              is_active: true,
              condition: {
                event_type: 'form_submit',
                operator: 'greater_than',
                value: 0,
                time_window: '14_days'
              },
              created_at: '2024-11-20T11:30:00Z',
              updated_at: '2024-12-05T10:15:00Z',
              created_by: { id: 1, name: 'John Smith' }
            },
            {
              id: 4,
              name: 'Demo Request Score',
              description: 'High-value scoring for demo requests',
              points: 75,
              priority: 1,
              is_active: true,
              condition: {
                event_type: 'demo_request',
                operator: 'equals',
                value: 1,
                time_window: '30_days'
              },
              created_at: '2024-11-25T13:20:00Z',
              updated_at: '2024-12-12T09:30:00Z',
              created_by: { id: 3, name: 'Mike Wilson' }
            },
            {
              id: 5,
              name: 'Social Media Engagement',
              description: 'Scoring for social media interactions',
              points: 15,
              priority: 4,
              is_active: false,
              condition: {
                event_type: 'social_engagement',
                operator: 'greater_than',
                value: 3,
                time_window: '7_days'
              },
              created_at: '2024-12-01T08:45:00Z',
              updated_at: '2024-12-01T08:45:00Z',
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
      
      // Return fallback data
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          data: {
            total_contacts_scored: 1247,
            average_score: 42.5,
            high_score_contacts: 156,
            medium_score_contacts: 342,
            low_score_contacts: 749,
            active_rules: 4,
            inactive_rules: 1,
            total_points_awarded: 52840,
            score_distribution: {
              '0-25': 749,
              '26-50': 342,
              '51-75': 156,
              '76-100': 89,
              '100+': 11
            }
          }
        }
      }
      
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
      
      // Return fallback data
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          data: [
            {
              id: 101,
              name: 'John Smith',
              email: 'john.smith@techcorp.com',
              company: 'Tech Corp Inc.',
              score: 95,
              last_updated: '2024-12-10T14:30:00Z',
              score_change: '+12'
            },
            {
              id: 102,
              name: 'Sarah Johnson',
              email: 'sarah.j@innovation.com',
              company: 'Innovation Labs',
              score: 87,
              last_updated: '2024-12-10T12:15:00Z',
              score_change: '+8'
            },
            {
              id: 103,
              name: 'Mike Wilson',
              email: 'mike.w@futuretech.com',
              company: 'Future Tech Solutions',
              score: 82,
              last_updated: '2024-12-10T10:45:00Z',
              score_change: '+15'
            },
            {
              id: 104,
              name: 'Emily Davis',
              email: 'emily.d@startup.io',
              company: 'Startup.io',
              score: 78,
              last_updated: '2024-12-10T09:30:00Z',
              score_change: '+5'
            },
            {
              id: 105,
              name: 'David Brown',
              email: 'david.b@enterprise.com',
              company: 'Enterprise Solutions',
              score: 75,
              last_updated: '2024-12-10T08:20:00Z',
              score_change: '+3'
            },
            {
              id: 106,
              name: 'Lisa Anderson',
              email: 'lisa.a@retail.com',
              company: 'Retail Innovations',
              score: 72,
              last_updated: '2024-12-09T16:30:00Z',
              score_change: '+7'
            },
            {
              id: 107,
              name: 'Robert Taylor',
              email: 'robert.t@finance.com',
              company: 'Finance Corp',
              score: 68,
              last_updated: '2024-12-09T14:15:00Z',
              score_change: '+2'
            },
            {
              id: 108,
              name: 'Jennifer Martinez',
              email: 'jennifer.m@health.com',
              company: 'Health Systems',
              score: 65,
              last_updated: '2024-12-09T11:45:00Z',
              score_change: '+9'
            },
            {
              id: 109,
              name: 'William Garcia',
              email: 'william.g@education.com',
              company: 'Education Tech',
              score: 62,
              last_updated: '2024-12-09T09:30:00Z',
              score_change: '+4'
            },
            {
              id: 110,
              name: 'Amanda Rodriguez',
              email: 'amanda.r@travel.com',
              company: 'Travel Solutions',
              score: 58,
              last_updated: '2024-12-08T17:20:00Z',
              score_change: '+6'
            }
          ]
        }
      }
      
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
      
      // Return fallback data for development/demo purposes
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        console.log('Lead scoring analytics API timeout - using fallback data')
        return {
          data: {
            summary: {
              total_contacts_scored: 2847,
              average_score: 58.7,
              high_score_contacts: 456,
              medium_score_contacts: 892,
              low_score_contacts: 1499,
              active_rules: 8,
              inactive_rules: 2,
              total_points_awarded: 167420,
              conversion_rate: 15.2
            },
            score_distribution: {
              '0-25': { count: 1499, percentage: 52.7, trend: '-5%' },
              '26-50': { count: 892, percentage: 31.3, trend: '+8%' },
              '51-75': { count: 312, percentage: 11.0, trend: '+12%' },
              '76-100': { count: 134, percentage: 4.7, trend: '+15%' },
              '100+': { count: 10, percentage: 0.3, trend: '+25%' }
            },
            top_scoring_rules: [
              { rule_name: 'Demo Request Score', points_awarded: 45600, times_triggered: 608, avg_score_impact: 75.0 },
              { rule_name: 'Email Engagement Score', points_awarded: 34200, times_triggered: 1140, avg_score_impact: 30.0 },
              { rule_name: 'Website Behavior Score', points_awarded: 28900, times_triggered: 578, avg_score_impact: 50.0 },
              { rule_name: 'Form Submission Score', points_awarded: 23400, times_triggered: 936, avg_score_impact: 25.0 },
              { rule_name: 'Pricing View Score', points_awarded: 18900, times_triggered: 378, avg_score_impact: 50.0 }
            ],
            score_trends: [
              { date: '2024-12-04', avg_score: 56.2, new_scores: 45, high_scores: 8 },
              { date: '2024-12-05', avg_score: 57.1, new_scores: 52, high_scores: 12 },
              { date: '2024-12-06', avg_score: 58.3, new_scores: 48, high_scores: 15 },
              { date: '2024-12-07', avg_score: 59.1, new_scores: 61, high_scores: 18 },
              { date: '2024-12-08', avg_score: 58.7, new_scores: 55, high_scores: 14 },
              { date: '2024-12-09', avg_score: 59.5, new_scores: 67, high_scores: 22 },
              { date: '2024-12-10', avg_score: 60.2, new_scores: 73, high_scores: 25 }
            ],
            company_breakdown: [
              { company: 'Tech Corp Inc.', contacts: 234, avg_score: 72.5, high_scores: 45 },
              { company: 'Innovation Labs', contacts: 189, avg_score: 68.2, high_scores: 32 },
              { company: 'Future Tech Solutions', contacts: 156, avg_score: 65.8, high_scores: 28 },
              { company: 'Enterprise Solutions', contacts: 134, avg_score: 62.1, high_scores: 21 },
              { company: 'Startup.io', contacts: 98, avg_score: 59.7, high_scores: 15 }
            ],
            rule_performance: [
              { rule_name: 'Demo Request Score', trigger_rate: 21.4, conversion_rate: 18.5, avg_points: 75.0 },
              { rule_name: 'Email Engagement Score', trigger_rate: 40.1, conversion_rate: 12.3, avg_points: 30.0 },
              { rule_name: 'Website Behavior Score', trigger_rate: 20.3, conversion_rate: 15.8, avg_points: 50.0 },
              { rule_name: 'Form Submission Score', trigger_rate: 32.9, conversion_rate: 8.9, avg_points: 25.0 },
              { rule_name: 'Pricing View Score', trigger_rate: 13.3, conversion_rate: 11.2, avg_points: 50.0 }
            ],
            period: 'last_7_days',
            last_updated: '2024-01-20T15:30:00Z'
          }
        }
      }
      
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
