import api from './api'

// Buyer Intent Tracking API wrappers
export const buyerIntentService = {
  // Get tracking actions
  async getTrackingActions() {
    try {
      const response = await api.get('/tracking/actions')
      return response.data
    } catch (error) {
      console.error('Error fetching tracking actions:', error)
      
      // Return fallback data
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          data: [
            { id: 'page_view', name: 'Page View', description: 'User viewed a page' },
            { id: 'download', name: 'Download', description: 'User downloaded a resource' },
            { id: 'form_submit', name: 'Form Submit', description: 'User submitted a form' },
            { id: 'email_open', name: 'Email Open', description: 'User opened an email' },
            { id: 'email_click', name: 'Email Click', description: 'User clicked email link' },
            { id: 'demo_request', name: 'Demo Request', description: 'User requested a demo' },
            { id: 'pricing_view', name: 'Pricing View', description: 'User viewed pricing page' },
            { id: 'contact_view', name: 'Contact View', description: 'User viewed contact page' },
            { id: 'product_view', name: 'Product View', description: 'User viewed product page' },
            { id: 'blog_read', name: 'Blog Read', description: 'User read blog post' }
          ]
        }
      }
      
      throw error
    }
  },

  // Get intent levels
  async getIntentLevels() {
    try {
      const response = await api.get('/tracking/intent-levels')
      return response.data
    } catch (error) {
      console.error('Error fetching intent levels:', error)
      
      // Return fallback data
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          data: [
            { id: 'high', name: 'High Intent', description: 'Strong buying signals', min_score: 80, color: 'red' },
            { id: 'medium', name: 'Medium Intent', description: 'Moderate buying signals', min_score: 50, color: 'yellow' },
            { id: 'low', name: 'Low Intent', description: 'Weak buying signals', min_score: 20, color: 'blue' }
          ]
        }
      }
      
      throw error
    }
  },

  // Log test event
  async logTestEvent(eventData) {
    try {
      const response = await api.post('/tracking/events', eventData)
      return response.data
    } catch (error) {
      console.error('Error logging test event:', error)
      throw error
    }
  },

  // Get intent tracking data
  async getIntentTracking(params = {}) {
    try {
      const response = await api.get('/tracking/intent', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching intent tracking:', error)
      
      // Return fallback data
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          data: [
            {
              id: 1,
              timestamp: '2024-12-10T14:30:00Z',
              contact: {
                id: 101,
                name: 'John Smith',
                email: 'john.smith@techcorp.com'
              },
              company: {
                id: 201,
                name: 'Tech Corp Inc.',
                industry: 'Technology'
              },
              page_url: '/pricing/enterprise',
              action: 'page_view',
              score: 85,
              intent_level: 'high',
              session_id: 'sess_123456',
              ip_address: '192.168.1.100',
              user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            {
              id: 2,
              timestamp: '2024-12-10T14:25:00Z',
              contact: {
                id: 102,
                name: 'Sarah Johnson',
                email: 'sarah.j@innovation.com'
              },
              company: {
                id: 202,
                name: 'Innovation Labs',
                industry: 'Software'
              },
              page_url: '/products/analytics',
              action: 'download',
              score: 72,
              intent_level: 'medium',
              session_id: 'sess_123457',
              ip_address: '192.168.1.101',
              user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            },
            {
              id: 3,
              timestamp: '2024-12-10T14:20:00Z',
              contact: {
                id: 103,
                name: 'Mike Wilson',
                email: 'mike.w@futuretech.com'
              },
              company: {
                id: 203,
                name: 'Future Tech Solutions',
                industry: 'Consulting'
              },
              page_url: '/contact',
              action: 'form_submit',
              score: 95,
              intent_level: 'high',
              session_id: 'sess_123458',
              ip_address: '192.168.1.102',
              user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
            },
            {
              id: 4,
              timestamp: '2024-12-10T14:15:00Z',
              contact: {
                id: 104,
                name: 'Emily Davis',
                email: 'emily.d@startup.io'
              },
              company: {
                id: 204,
                name: 'Startup.io',
                industry: 'Fintech'
              },
              page_url: '/blog/ai-trends-2024',
              action: 'blog_read',
              score: 35,
              intent_level: 'low',
              session_id: 'sess_123459',
              ip_address: '192.168.1.103',
              user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
            },
            {
              id: 5,
              timestamp: '2024-12-10T14:10:00Z',
              contact: {
                id: 105,
                name: 'David Brown',
                email: 'david.b@enterprise.com'
              },
              company: {
                id: 205,
                name: 'Enterprise Solutions',
                industry: 'Manufacturing'
              },
              page_url: '/demo',
              action: 'demo_request',
              score: 90,
              intent_level: 'high',
              session_id: 'sess_123460',
              ip_address: '192.168.1.104',
              user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0'
            },
            {
              id: 6,
              timestamp: '2024-12-10T14:05:00Z',
              contact: {
                id: 106,
                name: 'Lisa Anderson',
                email: 'lisa.a@retail.com'
              },
              company: {
                id: 206,
                name: 'Retail Innovations',
                industry: 'Retail'
              },
              page_url: '/products/crm',
              action: 'product_view',
              score: 68,
              intent_level: 'medium',
              session_id: 'sess_123461',
              ip_address: '192.168.1.105',
              user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36'
            }
          ],
          meta: {
            current_page: 1,
            last_page: 3,
            per_page: 15,
            total: 42,
            from: 1,
            to: 15
          }
        }
      }
      
      throw error
    }
  },

  // Get tracking analytics
  async getTrackingAnalytics(params = {}) {
    try {
      const response = await api.get('/tracking/analytics', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching tracking analytics:', error)
      
      // Return fallback data
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          data: {
            overview: {
              total_events: 1247,
              unique_contacts: 892,
              unique_companies: 456,
              high_intent_count: 156,
              medium_intent_count: 342,
              low_intent_count: 749,
              average_score: 62.5,
              conversion_rate: 12.5
            },
            action_breakdown: [
              { action: 'page_view', count: 456, percentage: 36.6 },
              { action: 'download', count: 234, percentage: 18.8 },
              { action: 'form_submit', count: 178, percentage: 14.3 },
              { action: 'email_open', count: 156, percentage: 12.5 },
              { action: 'email_click', count: 98, percentage: 7.9 },
              { action: 'demo_request', count: 67, percentage: 5.4 },
              { action: 'pricing_view', count: 45, percentage: 3.6 },
              { action: 'contact_view', count: 13, percentage: 1.0 }
            ],
            top_pages: [
              { page: '/pricing/enterprise', views: 234, intent_score: 85.2 },
              { page: '/products/analytics', views: 198, intent_score: 78.5 },
              { page: '/demo', views: 156, intent_score: 92.1 },
              { page: '/contact', views: 134, intent_score: 88.7 },
              { page: '/products/crm', views: 112, intent_score: 72.3 },
              { page: '/blog/ai-trends-2024', views: 98, intent_score: 45.6 },
              { page: '/pricing/startup', views: 87, intent_score: 68.9 },
              { page: '/about', views: 76, intent_score: 32.1 }
            ],
            intent_trend: [
              { date: '2024-12-04', high: 12, medium: 28, low: 45 },
              { date: '2024-12-05', high: 15, medium: 32, low: 52 },
              { date: '2024-12-06', high: 18, medium: 35, low: 48 },
              { date: '2024-12-07', high: 22, medium: 38, low: 41 },
              { date: '2024-12-08', high: 25, medium: 42, low: 38 },
              { date: '2024-12-09', high: 28, medium: 45, low: 35 },
              { date: '2024-12-10', high: 32, medium: 48, low: 32 }
            ]
          }
        }
      }
      
      throw error
    }
  }
}

// Helper functions for buyer intent data processing
export const buyerIntentHelpers = {
  // Get intent level color
  getIntentLevelColor(level) {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  },

  // Get score color based on value
  getScoreColor(score) {
    if (score >= 80) return 'text-red-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-blue-600'
  },

  // Get action icon
  getActionIcon(action) {
    const icons = {
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
  formatTimestamp(timestamp) {
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
  formatPageUrl(url) {
    if (!url) return 'Unknown'
    return url.replace(/^https?:\/\/[^\/]+/, '') || '/'
  },

  // Format number with commas
  formatNumber(num) {
    if (typeof num !== 'number') return num
    return num.toLocaleString()
  },

  // Calculate percentage
  calculatePercentage(value, total) {
    if (!total || total === 0) return 0
    return Math.round((value / total) * 100)
  },

  // Get page title from URL
  getPageTitle(url) {
    if (!url) return 'Unknown Page'
    
    const titles = {
      '/pricing/enterprise': 'Enterprise Pricing',
      '/products/analytics': 'Analytics Product',
      '/demo': 'Demo Request',
      '/contact': 'Contact Us',
      '/products/crm': 'CRM Product',
      '/blog/ai-trends-2024': 'AI Trends 2024 Blog',
      '/pricing/startup': 'Startup Pricing',
      '/about': 'About Us'
    }
    
    return titles[url] || url.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }
}
