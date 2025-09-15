import api from './api'
import { campaignsAPI } from './api'

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
  }
}

// Helper functions for email marketing data processing
export const emailMarketingHelpers = {
  // Calculate open rate percentage
  calculateOpenRate(campaign) {
    if (!campaign.sent_count || campaign.sent_count === 0) return 0
    return ((campaign.open_count / campaign.sent_count) * 100).toFixed(1)
  },

  // Calculate click rate percentage
  calculateClickRate(campaign) {
    if (!campaign.sent_count || campaign.sent_count === 0) return 0
    return ((campaign.click_count / campaign.sent_count) * 100).toFixed(1)
  },

  // Calculate bounce rate percentage
  calculateBounceRate(campaign) {
    if (!campaign.sent_count || campaign.sent_count === 0) return 0
    return ((campaign.bounce_count / campaign.sent_count) * 100).toFixed(1)
  },

  // Calculate unsubscribe rate percentage
  calculateUnsubscribeRate(campaign) {
    if (!campaign.sent_count || campaign.sent_count === 0) return 0
    return ((campaign.unsubscribe_count / campaign.sent_count) * 100).toFixed(1)
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
  }
}
