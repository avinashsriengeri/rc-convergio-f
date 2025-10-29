/**
 * Lead Scoring Service - Complete Implementation
 * Handles all lead scoring operations including rules, analytics, and bulk operations
 */

import api from './api'

// Types and Interfaces
export interface LeadScoringRule {
  id?: number
  name: string
  description?: string
  condition: any
  points: number
  priority: number
  is_active: boolean
  condition_description?: string
  created_at?: string
  updated_at?: string
}

export interface LeadScoringStats {
  total_contacts_scored: number
  average_score: number
  high_score_contacts: number
  medium_score_contacts: number
  low_score_contacts: number
  active_rules: number
  score_distribution: {
    [key: string]: number
  }
}

export interface TopContact {
  id: number
  name: string
  company: string
  score: number
  score_change: string
  last_activity: string
  email: string
  phone?: string
}

export interface LeadScoringAnalytics {
  summary: {
    total_contacts_scored: number
    conversion_rate: number
    average_score: number
    high_value_leads: number
  }
  score_distribution: {
    [range: string]: {
      count: number
      percentage: number
      trend: string
    }
  }
  top_scoring_rules: Array<{
    rule_name: string
    points_awarded: number
    times_triggered: number
  }>
  company_breakdown: Array<{
    company: string
    avg_score: number
    contacts: number
  }>
  conversion_by_score: {
    [range: string]: {
      conversion_rate: number
      revenue: number
    }
  }
}

export interface EventType {
  id: string
  name: string
  description: string
  category: string
  default_points: number
}

export interface Operator {
  id: string
  name: string
  description: string
  applicable_to: string[]
}

export interface BulkRecalculateRequest {
  contact_ids?: number[]
  rule_ids?: number[]
  all_contacts?: boolean
}

export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'pdf'
  include_scores: boolean
  include_rules: boolean
  date_range?: {
    start: string
    end: string
  }
}

// Enhanced Lead Scoring Service with All APIs
export const leadScoringService = {
  // Rules Management
  getScoringRules: (params: any = {}) => {
    return api.get('/lead-scoring/rules', { params })
  },

  getScoringRule: (id: number) => {
    return api.get(`/lead-scoring/rules/${id}`)
  },

  createScoringRule: (data: Partial<LeadScoringRule>) => {
    return api.post('/lead-scoring/rules', data)
  },

  updateScoringRule: (id: number, data: Partial<LeadScoringRule>) => {
    return api.put(`/lead-scoring/rules/${id}`, data)
  },

  deleteScoringRule: (id: number) => {
    return api.delete(`/lead-scoring/rules/${id}`)
  },

  // Bulk Operations
  bulkRecalculate: (data: BulkRecalculateRequest) => {
    return api.post('/lead-scoring/bulk-recalculate', data)
  },

  bulkActivateRules: (ruleIds: number[]) => {
    return api.post('/lead-scoring/bulk-activate', { rule_ids: ruleIds })
  },

  bulkDeactivateRules: (ruleIds: number[]) => {
    return api.post('/lead-scoring/bulk-deactivate', { rule_ids: ruleIds })
  },

  // Statistics and Analytics
  getScoringStats: () => {
    return api.get('/lead-scoring/stats')
  },

  getTopContacts: (limit: number = 10) => {
    return api.get('/lead-scoring/top-contacts', { 
      params: { limit } 
    })
  },

  getLeadScoringAnalytics: (params: any = {}) => {
    return api.get('/analytics/lead-scoring', { params })
  },

  // Individual Contact Operations
  recalculateScore: (contactId: string | number) => {
    return api.post(`/lead-scoring/recalculate/${contactId}`)
  },

  getContactScore: (contactId: number) => {
    return api.get(`/lead-scoring/contacts/${contactId}/score`)
  },

  getContactScoreHistory: (contactId: number, params: any = {}) => {
    return api.get(`/lead-scoring/contacts/${contactId}/score-history`, { params })
  },

  // Event Types and Operators
  getEventTypes: () => {
    return api.get('/lead-scoring/event-types')
  },

  getOperators: () => {
    return api.get('/lead-scoring/operators')
  },

  // Export Operations
  exportRules: (options: ExportOptions) => {
    return api.get('/lead-scoring/export', { 
      params: options,
      responseType: 'blob'
    })
  },

  exportContacts: (options: ExportOptions) => {
    return api.get('/lead-scoring/contacts/export', { 
      params: options,
      responseType: 'blob'
    })
  },

  // Import Operations
  importRules: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/lead-scoring/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Rule Testing and Validation
  testRule: (rule: Partial<LeadScoringRule>) => {
    return api.post('/lead-scoring/rules/test', rule)
  },

  validateRuleCondition: (condition: any) => {
    return api.post('/lead-scoring/rules/validate', { condition })
  },

  // Real-time Updates
  subscribeToUpdates: (callback: (data: any) => void) => {
    // WebSocket or Server-Sent Events implementation
    // This would be implemented based on your real-time infrastructure
    return null
  },

  // Advanced Analytics
  getScoringTrends: (params: any = {}) => {
    return api.get('/analytics/lead-scoring/trends', { params })
  },

  getRulePerformance: (ruleId: number, params: any = {}) => {
    return api.get(`/analytics/lead-scoring/rules/${ruleId}/performance`, { params })
  },

  getContactScoringHistory: (contactId: number, params: any = {}) => {
    return api.get(`/analytics/lead-scoring/contacts/${contactId}/history`, { params })
  }
}

// Helper Functions
export const leadScoringHelpers = {
  getPriorityColor: (priority: number) => {
    const colors = {
      1: 'bg-red-100 text-red-800',
      2: 'bg-orange-100 text-orange-800', 
      3: 'bg-yellow-100 text-yellow-800',
      4: 'bg-blue-100 text-blue-800',
      5: 'bg-green-100 text-green-800'
    }
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  },

  getStatusColor: (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800'
  },

  getScoreColor: (score: number) => {
    if (score >= 80) return 'text-red-600 font-bold'
    if (score >= 60) return 'text-orange-600 font-semibold'
    if (score >= 40) return 'text-yellow-600 font-medium'
    return 'text-blue-600'
  },

  getScoreChangeColor: (change: string) => {
    if (!change || typeof change !== 'string') return 'text-gray-600'
    if (change.startsWith('+')) return 'text-green-600'
    if (change.startsWith('-')) return 'text-red-600'
    return 'text-gray-600'
  },

  formatDate: (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },

  formatNumber: (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  },

  getScoreCategory: (score: number) => {
    if (score >= 80) return { label: 'Sales Ready', color: 'text-red-600', bg: 'bg-red-50' }
    if (score >= 60) return { label: 'Hot Lead', color: 'text-orange-600', bg: 'bg-orange-50' }
    if (score >= 40) return { label: 'Warm Lead', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    return { label: 'Cold Lead', color: 'text-blue-600', bg: 'bg-blue-50' }
  },

  generateRuleCondition: (eventType: string, operator: string, value: any, timeWindow?: string) => {
    const condition: any = {
      event: eventType,
      operator,
      value
    }
    
    if (timeWindow) {
      condition.time_window = timeWindow
    }
    
    return condition
  },

  validateRuleCondition: (condition: any) => {
    try {
      if (!condition.event) return { valid: false, error: 'Event type is required' }
      if (!condition.operator) return { valid: false, error: 'Operator is required' }
      if (condition.value === undefined || condition.value === null) {
        return { valid: false, error: 'Value is required' }
      }
      return { valid: true }
    } catch (error) {
      return { valid: false, error: 'Invalid condition format' }
    }
  },

  // Templates Management
  getTemplates: () => {
    return api.get('/lead-scoring/templates')
  },

  getTemplate: (key: string) => {
    return api.get(`/lead-scoring/templates/${key}`)
  },

  activateTemplate: (key: string) => {
    return api.post(`/lead-scoring/templates/${key}/activate`)
  },

  getTemplateCategories: () => {
    return api.get('/lead-scoring/templates/categories')
  },

  // Smart Suggestions
  getSuggestions: () => {
    return api.get('/lead-scoring/suggestions')
  },

  createFromSuggestions: (suggestions: any[]) => {
    return api.post('/lead-scoring/suggestions/create', { suggestions })
  },

  // Auto-Detection
  detectEmailEvent: (data: any) => {
    return api.post('/lead-scoring/auto-detect/email', data)
  },

  detectWebsiteEvent: (data: any) => {
    return api.post('/lead-scoring/auto-detect/website', data)
  },

  detectFormEvent: (data: any) => {
    return api.post('/lead-scoring/auto-detect/form', data)
  },

  detectDealEvent: (data: any) => {
    return api.post('/lead-scoring/auto-detect/deal', data)
  },

  detectMeetingEvent: (data: any) => {
    return api.post('/lead-scoring/auto-detect/meeting', data)
  },

  getAutoDetectSuggestions: () => {
    return api.get('/lead-scoring/auto-detect/suggestions')
  },

  testAutoDetection: (data: any) => {
    return api.post('/lead-scoring/auto-detect/test', data)
  }
}

// Real-time Notifications
export const leadScoringNotifications = {
  subscribeToScoreUpdates: (callback: (notification: any) => void) => {
    // Implementation for real-time score updates
    // This would integrate with your WebSocket or SSE infrastructure
    return null
  },

  subscribeToRuleUpdates: (callback: (notification: any) => void) => {
    // Implementation for real-time rule updates
    return null
  }
}

export default leadScoringService