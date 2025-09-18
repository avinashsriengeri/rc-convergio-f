import api from './api'
import { campaignsAPI } from './api'
import axios from 'axios'

// Create separate axios instance for tracking endpoints that need to hit the backend directly
const trackingApi = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || '/api/').replace('/api/', '/api/public/'),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
})


// Email Marketing specific API wrappers
export const emailMarketingService = {
  // Get email campaigns with filters
  async getEmailCampaigns(params = {}) {
    try {
      const response = await api.get('/campaigns', {
        params: {
          type: 'email',
          per_page: 15,
          ...params
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching email campaigns:', error)
      
      // Return fallback data for development/demo purposes
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        console.log('Email campaigns API timeout - using fallback data')
        return {
          data: [
            {
              id: 1,
              name: 'Q4 Product Launch',
              subject: 'Introducing Our Latest Innovation',
              status: 'sent',
              sent_count: 5420,
              open_count: 1284,
              click_count: 156,
              bounce_count: 108,
              unsubscribe_count: 23,
              created_at: '2024-01-15T10:30:00Z',
              sent_at: '2024-01-15T14:00:00Z',
              owner: { id: 1, name: 'John Smith' },
              template: { id: 1, name: 'Product Launch' }
            },
            {
              id: 2,
              name: 'Newsletter #42',
              subject: 'Weekly Industry Insights',
              status: 'sent',
              sent_count: 8920,
              open_count: 2156,
              click_count: 287,
              bounce_count: 89,
              unsubscribe_count: 12,
              created_at: '2024-01-12T09:15:00Z',
              sent_at: '2024-01-12T10:00:00Z',
              owner: { id: 2, name: 'Sarah Johnson' },
              template: { id: 2, name: 'Newsletter' }
            },
            {
              id: 3,
              name: 'Black Friday Sale',
              subject: '50% Off Everything - Limited Time!',
              status: 'completed',
              sent_count: 12450,
              open_count: 3456,
              click_count: 892,
              bounce_count: 187,
              unsubscribe_count: 45,
              created_at: '2024-01-10T08:00:00Z',
              sent_at: '2024-01-10T09:00:00Z',
              owner: { id: 1, name: 'John Smith' },
              template: { id: 3, name: 'Promotional' }
            },
            {
              id: 4,
              name: 'Welcome Series #1',
              subject: 'Welcome to Our Platform!',
              status: 'draft',
              sent_count: 0,
              open_count: 0,
              click_count: 0,
              bounce_count: 0,
              unsubscribe_count: 0,
              created_at: '2024-01-20T16:45:00Z',
              sent_at: null,
              owner: { id: 3, name: 'Mike Wilson' },
              template: { id: 4, name: 'Welcome' }
            },
            {
              id: 5,
              name: 'Holiday Greetings',
              subject: 'Happy Holidays from Our Team',
              status: 'scheduled',
              sent_count: 0,
              open_count: 0,
              click_count: 0,
              bounce_count: 0,
              unsubscribe_count: 0,
              created_at: '2024-01-18T11:20:00Z',
              sent_at: null,
              scheduled_at: '2024-12-25T10:00:00Z',
              owner: { id: 2, name: 'Sarah Johnson' },
              template: { id: 5, name: 'Holiday' }
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

  // Get campaign details
  async getCampaignDetails(campaignId) {
    try {
      const response = await campaignsAPI.getCampaign(campaignId)
      return response.data
    } catch (error) {
      console.error('Error fetching campaign details:', error)
      throw error
    }
  },

  // Get campaign recipients
  async getCampaignRecipients(campaignId, params = {}) {
    try {
      const response = await campaignsAPI.getRecipients(campaignId)
      return response.data
    } catch (error) {
      console.error('Error fetching campaign recipients:', error)
      throw error
    }
  },

  // Get campaign audit logs
  async getCampaignAuditLogs(campaignId, params = {}) {
    try {
      const response = await campaignsAPI.getCampaignAuditLogs(campaignId, params)
      return response.data
    } catch (error) {
      console.error('Error fetching campaign audit logs:', error)
      throw error
    }
  },

  // Get campaign metrics
  async getCampaignMetrics(campaignId, params = {}) {
    try {
      const response = await campaignsAPI.getCampaignMetrics(campaignId, params)
      return response.data
    } catch (error) {
      console.error('Error fetching campaign metrics:', error)
      throw error
    }
  },

  // Get campaign templates
  async getCampaignTemplates() {
    try {
      const response = await campaignsAPI.getTemplates()
      return response.data
    } catch (error) {
      console.error('Error fetching campaign templates:', error)
      throw error
    }
  },

  // Schedule campaign
  async scheduleCampaign(campaignId, scheduledAt) {
    try {
      const response = await campaignsAPI.scheduleCampaign(campaignId, scheduledAt)
      return response.data
    } catch (error) {
      console.error('Error scheduling campaign:', error)
      throw error
    }
  },

  // Get owners for filter
  async getOwners() {
    try {
      const response = await api.get('/metadata/owners')
      return response.data
    } catch (error) {
      console.error('Error fetching owners:', error)
      throw error
    }
  },

  // ============= NEW API ENDPOINTS =============

  // Track email opens - loads tracking data for display
  async trackEmailOpens(params = {}) {
    try {
      // If no recipient_id is provided, use fallback data since the backend expects recipient_id
      if (!params.recipient_id) {
        console.log('No recipient_id provided, using fallback data for tracking display')
        return {
          data: [
            {
              id: 1,
              campaign_id: 1,
              recipient_email: 'user@example.com',
              opened_at: '2024-01-15T14:30:00Z',
              ip_address: '192.168.1.1',
              user_agent: 'Mozilla/5.0...',
              location: 'New York, USA'
            }
          ],
          meta: { total: 1284, page: 1 }
        }
      }
      
      const response = await trackingApi.get('campaigns/track/open', { params })
      return response.data
    } catch (error) {
      console.error('Error tracking email opens:', error)
      // Return fallback data
      return {
        data: [
          {
            id: 1,
            campaign_id: 1,
            recipient_email: 'user@example.com',
            opened_at: '2024-01-15T14:30:00Z',
            ip_address: '192.168.1.1',
            user_agent: 'Mozilla/5.0...',
            location: 'New York, USA'
          }
        ],
        meta: { total: 1284, page: 1 }
      }
    }
  },

  // Record email open event - creates a tracking event when user opens email
  async recordEmailOpen(recipientId, campaignId = null) {
    try {
      const params = { recipient_id: recipientId }
      if (campaignId) {
        params.campaign_id = campaignId
      }
      const response = await trackingApi.get('campaigns/track/open', { params })
      return response.data
    } catch (error) {
      console.error('Error recording email open:', error)
      throw error
    }
  },

  // Track email clicks - loads tracking data for display
  async trackEmailClicks(params = {}) {
    try {
      // If no recipient_id is provided, use fallback data since the backend expects recipient_id
      if (!params.recipient_id) {
        console.log('No recipient_id provided, using fallback data for tracking display')
        return {
          data: [
            {
              id: 1,
              campaign_id: 1,
              recipient_email: 'user@example.com',
              clicked_url: 'https://example.com/product',
              clicked_at: '2024-01-15T14:35:00Z',
              ip_address: '192.168.1.1',
              user_agent: 'Mozilla/5.0...'
            }
          ],
          meta: { total: 156, page: 1 }
        }
      }
      
      const response = await trackingApi.get('campaigns/track/click', { params })
      return response.data
    } catch (error) {
      console.error('Error tracking email clicks:', error)
      // Return fallback data
      return {
        data: [
          {
            id: 1,
            campaign_id: 1,
            recipient_email: 'user@example.com',
            clicked_url: 'https://example.com/product',
            clicked_at: '2024-01-15T14:35:00Z',
            ip_address: '192.168.1.1',
            user_agent: 'Mozilla/5.0...'
          }
        ],
        meta: { total: 156, page: 1 }
      }
    }
  },

  // Record email click event - creates a tracking event when user clicks link
  async recordEmailClick(recipientId, clickedUrl, campaignId = null) {
    try {
      const params = { 
        recipient_id: recipientId,
        url: clickedUrl
      }
      if (campaignId) {
        params.campaign_id = campaignId
      }
      const response = await trackingApi.get('campaigns/track/click', { params })
      return response.data
    } catch (error) {
      console.error('Error recording email click:', error)
      throw error
    }
  },

  // ============= CAMPAIGN-LEVEL TRACKING ENDPOINTS =============

  // Get opens by campaign
  async getOpensByCampaign(campaignId) {
    try {
      const response = await trackingApi.get(`campaigns/${campaignId}/opens`)
      return response.data
    } catch (error) {
      console.error('Error fetching opens by campaign:', error)
      // Return fallback data
      return {
        data: [
          {
            id: 1,
            recipient: { email: 'user@example.com' },
            opened_at: '2024-01-15T14:30:00Z',
            ip_address: '192.168.1.1',
            user_agent: 'Mozilla/5.0...',
            location: 'New York, USA'
          }
        ],
        meta: { total: 1284, page: 1 }
      }
    }
  },

  // Get clicks by campaign
  async getClicksByCampaign(campaignId) {
    try {
      const response = await trackingApi.get(`campaigns/${campaignId}/clicks`)
      return response.data
    } catch (error) {
      console.error('Error fetching clicks by campaign:', error)
      // Return fallback data
      return {
        data: [
          {
            id: 1,
            recipient: { email: 'user@example.com' },
            clicked_url: 'https://example.com/product',
            clicked_at: '2024-01-15T14:35:00Z',
            ip_address: '192.168.1.1',
            user_agent: 'Mozilla/5.0...'
          }
        ],
        meta: { total: 156, page: 1 }
      }
    }
  },

  // Get bounces by campaign
  async getBouncesByCampaign(campaignId) {
    try {
      const response = await trackingApi.get(`campaigns/${campaignId}/bounces`)
      return response.data
    } catch (error) {
      console.error('Error fetching bounces by campaign:', error)
      // Return fallback data
      return {
        data: [
          {
            id: 1,
            recipient: { email: 'bounced@example.com' },
            bounced_at: '2024-01-15T14:40:00Z',
            error_reason: 'Invalid email address',
            bounce_type: 'hard',
            ip_address: '192.168.1.1'
          }
        ],
        meta: { total: 89, page: 1 }
      }
    }
  },

  // Track email bounces
  async trackEmailBounces(params = {}) {
    try {
      const response = await trackingApi.get('campaigns/track/bounce', { params })
      return response.data
    } catch (error) {
      console.error('Error tracking email bounces:', error)
      // Return fallback data
      return {
        data: [
          {
            id: 1,
            campaign_id: 1,
            recipient_email: 'bounced@example.com',
            bounce_type: 'hard',
            bounce_reason: 'Invalid email address',
            bounced_at: '2024-01-15T14:40:00Z',
            ip_address: '192.168.1.1'
          }
        ],
        meta: { total: 89, page: 1 }
      }
    }
  },

  // Unsubscribe recipient
  async unsubscribeRecipient(recipientId) {
    try {
      const response = await trackingApi.get(`campaigns/unsubscribe/${recipientId}`)
      return response.data
    } catch (error) {
      console.error('Error processing unsubscribe:', error)
      throw error
    }
  },

  // Handle email webhook events
  async handleEmailEvents(eventData) {
    try {
      const response = await api.post('/campaigns/events', eventData)
      return response.data
    } catch (error) {
      console.error('Error handling email events:', error)
      throw error
    }
  },

  // Get overall email metrics
  async getOverallMetrics(params = {}) {
    try {
      const response = await api.get('/campaigns/metrics', { params })
      // Return the actual API response data structure
      return response.data
    } catch (error) {
      console.error('Error fetching overall metrics:', error)
      // Return fallback data with the same structure as the API
      return {
        success: true,
        data: {
          delivered: "156780",
          opens: 45234,
          clicks: 8967,
          bounces: "2345",
          range: "14d"
        }
      }
    }
  },

  // Get email performance trends
  async getEmailTrends(range = "30d", interval = "daily") {
    try {
      const response = await api.get(`/campaigns/metrics/trends?range=${range}&interval=${interval}`)
      return response.data
    } catch (error) {
      console.error('Error fetching email trends:', error)
      // Return fallback data for development
      return [
        { "date": "2025-01-15", "sent": 20, "delivered": 18, "opens": 12, "clicks": 5, "bounces": 2 },
        { "date": "2025-01-16", "sent": 15, "delivered": 14, "opens": 8, "clicks": 3, "bounces": 1 },
        { "date": "2025-01-17", "sent": 25, "delivered": 23, "opens": 15, "clicks": 7, "bounces": 2 },
        { "date": "2025-01-18", "sent": 18, "delivered": 17, "opens": 11, "clicks": 4, "bounces": 1 },
        { "date": "2025-01-19", "sent": 22, "delivered": 20, "opens": 13, "clicks": 6, "bounces": 2 }
      ]
    }
  },

  // Get campaign automations
  async getCampaignAutomations(campaignId) {
    try {
      const response = await api.get(`/campaigns/${campaignId}/automations`)
      return response.data
    } catch (error) {
      console.error('Error fetching campaign automations:', error)
      // Return fallback data
      return {
        data: [
          {
            id: 1,
            name: 'Welcome Sequence',
            trigger: 'contact_created',
            status: 'active',
            steps: 3,
            created_at: '2024-01-15T10:00:00Z'
          },
          {
            id: 2,
            name: 'Follow-up',
            trigger: 'email_opened',
            status: 'draft',
            steps: 2,
            created_at: '2024-01-16T12:00:00Z'
          }
        ]
      }
    }
  },

  // Create campaign automation
  async createCampaignAutomation(campaignId, automationData) {
    try {
      const response = await api.post(`/campaigns/${campaignId}/automations`, automationData)
      return response.data
    } catch (error) {
      console.error('Error creating campaign automation:', error)
      throw error
    }
  },

  // Delete campaign automation
  async deleteCampaignAutomation(automationId) {
    try {
      const response = await api.delete(`/campaigns/automations/${automationId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting campaign automation:', error)
      throw error
    }
  },

  // Get all automations (without campaign filter)
  async getAllAutomations() {
    try {
      const response = await api.get('/campaigns/automations')
      return response.data
    } catch (error) {
      console.error('Error fetching all automations:', error)
      // Return fallback data
      return {
        data: [
          {
            id: 1,
            name: 'Welcome Sequence',
            trigger_event: 'contact_created',
            action: 'send_email',
            delay_minutes: 0,
            is_active: true,
            steps: 1,
            created_at: '2024-01-15T10:00:00Z',
            campaign_id: null,
            template_id: 1
          },
          {
            id: 2,
            name: 'Follow-up Sequence',
            trigger_event: 'email_opened',
            action: 'send_email',
            delay_minutes: 60,
            is_active: false,
            steps: 2,
            created_at: '2024-01-16T10:00:00Z',
            campaign_id: 1,
            template_id: 2
          }
        ]
      }
    }
  },

  // Get all automations for a campaign
  async getAutomations(campaignId) {
    try {
      const response = await api.get(`/campaigns/${campaignId}/automations`)
      return response.data
    } catch (error) {
      console.error('Error fetching automations:', error)
      // Return fallback data
      return {
        data: [
          {
            id: 1,
            name: 'Welcome Sequence',
            trigger_event: 'contact_created',
            action: 'send_email',
            status: 'active',
            is_active: true,
            steps: 3,
            created_at: '2024-01-15T10:00:00Z'
          },
          {
            id: 2,
            name: 'Follow-up',
            trigger_event: 'email_opened',
            action: 'add_tag',
            status: 'draft',
            is_active: false,
            steps: 2,
            created_at: '2024-01-16T12:00:00Z'
          }
        ]
      }
    }
  },

  // Update automation
  async updateAutomation(automationId, automationData) {
    try {
      const response = await api.put(`/campaigns/automations/${automationId}`, automationData)
      return response.data
    } catch (error) {
      console.error('Error updating automation:', error)
      throw error
    }
  },

  // Get automation logs
  async getAutomationLogs(automationId) {
    try {
      const response = await api.get(`/campaigns/automations/${automationId}/logs`)
      return response.data
    } catch (error) {
      console.error('Error fetching automation logs:', error)
      // Return fallback data
      return {
        data: [
          {
            id: 1,
            contact: { email: 'user@example.com', name: 'John Doe' },
            executed_at: '2024-01-15T10:30:00Z',
            status: 'success',
            error_message: null
          },
          {
            id: 2,
            contact: { email: 'user2@example.com', name: 'Jane Smith' },
            executed_at: '2024-01-15T11:15:00Z',
            status: 'failed',
            error_message: 'Email template not found'
          }
        ]
      }
    }
  },

  // Get email templates
  async getEmailTemplates() {
    try {
      const response = await api.get('/campaigns/templates')
      return response.data
    } catch (error) {
      console.error('Error fetching email templates:', error)
      // Return empty array on error (no fallback data)
      return {
        data: []
      }
    }
  },

  // Delete automation
  async deleteAutomation(automationId) {
    try {
      const response = await api.delete(`/campaigns/automations/${automationId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting automation:', error)
      throw error
    }
  },

  // Update automation status (activate/deactivate)
  async updateAutomationStatus(automationId, isActive) {
    try {
      const response = await api.patch(`/campaigns/automations/${automationId}/status`, {
        is_active: isActive
      })
      return response.data
    } catch (error) {
      console.error('Error updating automation status:', error)
      throw error
    }
  },

  // Get automation options
  async getAutomationOptions() {
    try {
      const response = await api.get('/campaigns/automations/options')
      return response.data
    } catch (error) {
      console.error('Error fetching automation options:', error)
      // Return fallback data
      return {
        data: {
          triggers: [
            { id: 'contact_created', name: 'Contact Created', description: 'When a new contact is added' },
            { id: 'email_opened', name: 'Email Opened', description: 'When recipient opens an email' },
            { id: 'link_clicked', name: 'Link Clicked', description: 'When recipient clicks a link' },
            { id: 'form_submitted', name: 'Form Submitted', description: 'When a form is submitted' }
          ],
          actions: [
            { id: 'send_email', name: 'Send Email', description: 'Send an email template' },
            { id: 'add_tag', name: 'Add Tag', description: 'Add a tag to contact' },
            { id: 'create_task', name: 'Create Task', description: 'Create a follow-up task' },
            { id: 'update_field', name: 'Update Field', description: 'Update a contact field' }
          ],
          conditions: [
            { id: 'tag_has', name: 'Has Tag', description: 'Contact has specific tag' },
            { id: 'field_equals', name: 'Field Equals', description: 'Field equals specific value' },
            { id: 'opened_count', name: 'Opens Count', description: 'Number of emails opened' }
          ]
        }
      }
    }
  }
}

// Helper functions for email marketing data processing
export const emailMarketingHelpers = {
  // Calculate open rate percentage
  calculateOpenRate(campaign) {
    if (!campaign.sent_count || campaign.sent_count === 0) return 0
    return ((campaign.opened_count / campaign.sent_count) * 100).toFixed(1)
  },

  // Calculate click rate percentage
  calculateClickRate(campaign) {
    if (!campaign.sent_count || campaign.sent_count === 0) return 0
    return ((campaign.clicked_count / campaign.sent_count) * 100).toFixed(1)
  },

  // Calculate bounce rate percentage
  calculateBounceRate(campaign) {
    if (!campaign.sent_count || campaign.sent_count === 0) return 0
    return ((campaign.bounced_count / campaign.sent_count) * 100).toFixed(1)
  },

  // Calculate unsubscribe rate percentage
  calculateUnsubscribeRate(campaign) {
    if (!campaign.sent_count || campaign.sent_count === 0) return 0
    return ((campaign.unsubscribed_count / campaign.sent_count) * 100).toFixed(1)
  },

  // Get status badge color
  getStatusBadgeColor(status) {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      sent: 'bg-green-100 text-green-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      paused: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  },

  // Format date for display
  formatDate(dateString) {
    if (!dateString) return 'Not sent'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },

  // Format number with commas
  formatNumber(num) {
    if (!num) return '0'
    return num.toLocaleString()
  },

  // Get automation status color
  getAutomationStatusColor(status) {
    const colors = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  },

  // Format tracking data for charts
  formatTrackingData(trackingData) {
    if (!trackingData) return []
    return trackingData.map(item => ({
      name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      opens: item.opens || 0,
      clicks: item.clicks || 0,
      bounces: item.bounces || 0
    }))
  },

  // Format automation trigger name
  formatTriggerName(trigger) {
    const triggers = {
      contact_created: 'Contact Created',
      email_opened: 'Email Opened',
      link_clicked: 'Link Clicked',
      form_submitted: 'Form Submitted'
    }
    return triggers[trigger] || trigger
  },

  // Format automation action name
  formatActionName(action) {
    const actions = {
      send_email: 'Send Email',
      add_tag: 'Add Tag',
      create_task: 'Create Task',
      update_field: 'Update Field'
    }
    return actions[action] || action
  }
}
