import api from './api'

// Type definitions for buyer intent
interface EventData {
  page_url: string
  action: string
  score: number
  contact_id?: number
  company_id?: number
  metadata?: Record<string, any>
}

interface Params {
  [key: string]: any
}

interface JobData {
  [key: string]: any
}

interface SettingsData {
  [key: string]: any
}

// Buyer Intent Tracking API wrappers - Complete 33 APIs Implementation
export const buyerIntentService = {
  // =============================================================================
  // 1. CORE TRACKING APIs (7 APIs)
  // =============================================================================

  // 1.1 Log Visitor Event
  async postEvent(eventData: EventData) {
    try {
      const response = await api.post('/tracking/events', eventData)
      return response.data
    } catch (error) {
      console.error('Error logging visitor event:', error)
      throw error
    }
  },

  // 1.2 Get Intent Signals
  async getIntent(params: Params = {}) {
    try {
      const response = await api.get('/tracking/intent', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching intent signals:', error)
      throw error
    }
  },

  // 1.3 Get Intent Analytics
  async getAnalytics(params: Params = {}) {
    try {
      const response = await api.get('/tracking/analytics', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching intent analytics:', error)
      throw error
    }
  },

  // 1.4 Get Available Actions
  async getActions() {
    try {
      const response = await api.get('/tracking/actions')
      return response.data
    } catch (error) {
      console.error('Error fetching available actions:', error)
      throw error
    }
  },

  // 1.5 Get Intent Levels
  async getIntentLevels() {
    try {
      const response = await api.get('/tracking/intent-levels')
      return response.data
    } catch (error) {
      console.error('Error fetching intent levels:', error)
      throw error
    }
  },

  // 1.6 Get Visitor Analytics
  async getVisitorAnalytics(params: Params = {}) {
    try {
      const response = await api.get('/tracking/visitor-intent-analytics', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching visitor analytics:', error)
      throw error
    }
  },

  // 1.7 Get Visitor Stats
  async getVisitorStats() {
    try {
      const response = await api.get('/tracking/visitor-stats')
      return response.data
    } catch (error) {
      console.error('Error fetching visitor stats:', error)
      throw error
    }
  },

  // 1.8 Get Tracking Script
  async getTrackingScript() {
    try {
      const response = await api.get('/tracking/script')
      return response.data
    } catch (error) {
      console.error('Error fetching tracking script:', error)
      throw error
    }
  },

  // =============================================================================
  // 2. SCORING APIs (5 APIs)
  // =============================================================================

  // 2.1 Get Scoring Config
  async getScoringConfig() {
    try {
      const response = await api.get('/tracking/scoring/config', {
        timeout: 30000 // Increase timeout to 30 seconds for scoring config
      })
      return response.data
    } catch (error) {
      console.error('Error fetching scoring config:', error)
      throw error
    }
  },

  // 2.2 Update Scoring Config
  async updateScoringConfig(data: JobData) {
    try {
      const response = await api.put('/tracking/scoring/config', data, {
        timeout: 30000 // Increase timeout to 30 seconds for scoring config updates
      })
      return response.data
    } catch (error) {
      console.error('Error updating scoring config:', error)
      throw error
    }
  },

  // 2.3 Get Scoring Stats
  async getScoringStats() {
    try {
      const response = await api.get('/tracking/scoring/stats')
      return response.data
    } catch (error) {
      console.error('Error fetching scoring stats:', error)
      throw error
    }
  },

  // 2.4 Test Scoring
  async testScoring(data: JobData) {
    try {
      const response = await api.post('/tracking/scoring/test', data)
      return response.data
    } catch (error) {
      console.error('Error testing scoring:', error)
      throw error
    }
  },

  // 2.5 Get URL Stats
  async getUrlStats() {
    try {
      const response = await api.get('/tracking/url-stats')
      return response.data
    } catch (error) {
      console.error('Error fetching URL stats:', error)
      throw error
    }
  },

  // =============================================================================
  // 3. EXPORTS APIs (4 APIs)
  // =============================================================================

  // 3.1 Create Export
  async createExport(data: JobData) {
    try {
      const response = await api.post('/tracking/export', data)
      return response.data
    } catch (error) {
      console.error('Error creating export:', error)
      throw error
    }
  },

  // 3.2 Get Export Status
  async getExportStatus(jobId: string) {
    try {
      const response = await api.get(`/tracking/export/${jobId}/status`)
      return response.data
    } catch (error) {
      console.error('Error fetching export status:', error)
      throw error
    }
  },

  // 3.3 List Exports
  async listExports(params: Params = {}) {
    try {
      const response = await api.get('/tracking/exports', { params })
      return response.data
    } catch (error) {
      console.error('Error listing exports:', error)
      throw error
    }
  },

  // 3.4 Download Export
  async downloadExport(jobId: string) {
    try {
      const response = await api.get(`/tracking/export/${jobId}/download`, { responseType: 'blob' })
      return response.data
    } catch (error) {
      console.error('Error downloading export:', error)
      throw error
    }
  },

  // =============================================================================
  // 4. REPORTS APIs (4 APIs)
  // =============================================================================

  // 4.1 Create Report
  async createReport(data: JobData) {
    try {
      const response = await api.post('/tracking/reports', data)
      return response.data
    } catch (error) {
      console.error('Error creating report:', error)
      throw error
    }
  },

  // 4.2 Get Report Status
  async getReportStatus(jobId: string) {
    try {
      const response = await api.get(`/tracking/reports/${jobId}/status`)
      return response.data
    } catch (error) {
      console.error('Error fetching report status:', error)
      throw error
    }
  },

  // 4.3 List Reports
  async listReports(params: Params = {}) {
    try {
      const response = await api.get('/tracking/reports', { params })
      return response.data
    } catch (error) {
      console.error('Error listing reports:', error)
      throw error
    }
  },

  // 4.4 Download Report
  async downloadReport(jobId: string) {
    try {
      const response = await api.get(`/tracking/reports/${jobId}/download`, { responseType: 'blob' })
      return response.data
    } catch (error) {
      console.error('Error downloading report:', error)
      throw error
    }
  },

  // =============================================================================
  // 5. EVENT CRUD APIs (3 APIs)
  // =============================================================================

  // 5.1 Get Event
  async getEvent(id: string | number) {
    try {
      const response = await api.get(`/tracking/events/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching event:', error)
      throw error
    }
  },

  // 5.2 Update Event
  async updateEvent(id: string | number, data: JobData) {
    try {
      const response = await api.put(`/tracking/events/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  },

  // 5.3 Delete Event
  async deleteEvent(id: string | number) {
    try {
      const response = await api.delete(`/tracking/events/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  },

  // =============================================================================
  // 6. MODULE INTEGRATION APIs (4 APIs)
  // =============================================================================

  // 6.1 Get Contact Intent
  async getContactIntent(id: string | number) {
    try {
      const response = await api.get(`/tracking/contacts/${id}/intent`)
      return response.data
    } catch (error) {
      console.error('Error fetching contact intent:', error)
      throw error
    }
  },

  // 6.2 Get Company Intent
  async getCompanyIntent(id: string | number) {
    try {
      const response = await api.get(`/tracking/companies/${id}/intent`)
      return response.data
    } catch (error) {
      console.error('Error fetching company intent:', error)
      throw error
    }
  },

  // 6.3 Get Campaign Intent
  async getCampaignIntent(id: string | number) {
    try {
      const response = await api.get(`/tracking/campaigns/${id}/intent`)
      return response.data
    } catch (error) {
      console.error('Error fetching campaign intent:', error)
      throw error
    }
  },

  // 6.4 Get Event Intent
  async getEventIntent(id: string | number) {
    try {
      const response = await api.get(`/tracking/events/${id}/intent`)
      return response.data
    } catch (error) {
      console.error('Error fetching event intent:', error)
      throw error
    }
  },

  // =============================================================================
  // 7. CAMPAIGN INTEGRATION APIs (2 APIs)
  // =============================================================================

  // 7.1 Post Campaign Webhook
  async postCampaignWebhook(data: JobData) {
    try {
      const response = await api.post('/campaigns/intent-webhook', data)
      return response.data
    } catch (error) {
      console.error('Error posting campaign webhook:', error)
      throw error
    }
  },

  // 7.2 Get Campaign Stats
  async getCampaignStats(params: Params = {}) {
    try {
      const response = await api.get('/campaigns/intent-stats', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching campaign stats:', error)
      throw error
    }
  },

  // =============================================================================
  // 8. LEGACY APIs (4 APIs) - for backward compatibility
  // =============================================================================

  // 8.1 Legacy Export
  async legacyExport(params: Params = {}) {
    try {
      const response = await api.get('/tracking/export', { params })
      return response.data
    } catch (error) {
      console.error('Error with legacy export:', error)
      throw error
    }
  },

  // 8.2 Bulk Delete Events
  async bulkDeleteEvents(data: JobData) {
    try {
      const response = await api.post('/tracking/bulk-delete', data)
      return response.data
    } catch (error) {
      console.error('Error bulk deleting events:', error)
      throw error
    }
  },

  // 8.3 Legacy Reports
  async legacyReports(params: Params = {}) {
    try {
      const response = await api.get('/tracking/reports', { params })
      return response.data
    } catch (error) {
      console.error('Error with legacy reports:', error)
      throw error
    }
  },

  // 8.4 Update Tracking Settings
  async updateTrackingSettings(data: SettingsData) {
    try {
      const response = await api.post('/tracking/settings', data)
      return response.data
    } catch (error) {
      console.error('Error updating tracking settings:', error)
      throw error
    }
  },

  // =============================================================================
  // BACKWARD COMPATIBILITY METHODS
  // =============================================================================

  // Legacy method names for backward compatibility
  logVisitorEvent: function(eventData: EventData) { return this.postEvent(eventData) },
  getIntentSignals: function(params: Params) { return this.getIntent(params) },
  getIntentAnalytics: function(params: Params) { return this.getAnalytics(params) },
  getAvailableActions: function() { return this.getActions() },
  getVisitorIntentAnalytics: function(params: Params) { return this.getVisitorAnalytics(params) },
  getIntentEventDetails: function(eventId: string | number) { return this.getEvent(eventId) },
  updateIntentEvent: function(eventId: string | number, updateData: JobData) { return this.updateEvent(eventId, updateData) },
  deleteIntentEvent: function(eventId: string | number) { return this.deleteEvent(eventId) },
  exportIntentData: function(params: Params) { return this.legacyExport(params) },
  generateReports: function(params: Params) { return this.legacyReports(params) },
  updateSettings: function(settingsData: SettingsData) { return this.updateTrackingSettings(settingsData) },
  
  // Additional legacy methods
  getTrackingActions: function() { return this.getActions() },
  logTestEvent: function(eventData: EventData) { return this.postEvent(eventData) },
  getIntentTracking: function(params: Params) { return this.getIntent(params) },
  getTrackingAnalytics: function(params: Params) { return this.getAnalytics(params) }
}

// Helper functions for buyer intent data processing
export const buyerIntentHelpers = {
  // Get intent level color - HubSpot Style
  getIntentLevelColor(level: string): string {
    const colors: Record<string, string> = {
      very_high: 'bg-red-100 text-red-800 border border-red-200',
      high: 'bg-orange-100 text-orange-800 border border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      low: 'bg-green-100 text-green-800 border border-green-200',
      very_low: 'bg-gray-100 text-gray-800 border border-gray-200'
    }
    return colors[level] || 'bg-gray-100 text-gray-800 border border-gray-200'
  },

  // Get score color based on value
  getScoreColor(score: number): string {
    if (score >= 80) return 'text-red-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-blue-600'
  },

  // Get action icon
  getActionIcon(action: string): string {
    const icons: Record<string, string> = {
      page_view: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
      download: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      form_submit: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      email_open: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      email_click: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      demo_request: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
      pricing_view: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
      contact_view: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      product_view: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      blog_read: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    }
    return icons[action] || 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },

  // Format timestamp
  formatTimestamp(timestamp: string | Date): string {
    if (!timestamp) return 'Unknown'
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },

  // Format page URL for display
  formatPageUrl(url: string): string {
    if (!url) return 'Unknown'
    return url.replace(/^https?:\/\/[^\/]+/, '') || '/'
  },

  // Format number with commas
  formatNumber(num: number): string | number {
    if (typeof num !== 'number') return num
    return num.toLocaleString()
  },

  // Calculate percentage
  calculatePercentage(value: number, total: number): number {
    if (!total || total === 0) return 0
    return Math.round((value / total) * 100)
  },

  // Get page title from URL
  getPageTitle(url: string): string {
    if (!url) return 'Unknown Page'
    
    const titles: Record<string, string> = {
      '/pricing/enterprise': 'Enterprise Pricing',
      '/products/analytics': 'Analytics Product',
      '/demo': 'Demo Request',
      '/contact': 'Contact Us',
      '/products/crm': 'CRM Product',
      '/blog/ai-trends-2024': 'AI Trends 2024 Blog',
      '/pricing/startup': 'Startup Pricing',
      '/about': 'About Us'
    }
    
    return titles[url] || url.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown Page'
  },

  // Get action name from action ID
  getActionName(actionId: string): string {
    const actionMap: Record<string, string> = {
      'page_view': 'Page View',
      'form_submit': 'Form Submit',
      'download': 'Download',
      'click': 'Click',
      'scroll': 'Scroll',
      'time_on_page': 'Time on Page',
      'visit': 'Visit',
      'bounce': 'Bounce',
      'conversion': 'Conversion',
      'email_open': 'Email Open',
      'email_click': 'Email Click',
      'demo_request': 'Demo Request',
      'pricing_view': 'Pricing View',
      'contact_view': 'Contact View',
      'product_view': 'Product View',
      'blog_read': 'Blog Read'
    }
    return actionMap[actionId] || actionId
  }
}
