import api from './api'

// Ads Management API wrappers
export const adsService = {
  // Get ad account providers
  async getAdAccountProviders() {
    try {
      const response = await api.get('/ad-accounts/providers')
      return response.data
    } catch (error) {
      console.error('Error fetching ad account providers:', error)
      
      // Return fallback data for development/demo purposes
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        console.log('Ad account providers API timeout - using fallback data')
        return {
          data: [
            {
              id: 'google_ads',
              name: 'Google Ads',
              icon: 'google',
              description: 'Google Ads platform for search and display advertising',
              auth_url: '/auth/google-ads',
              supported_features: ['search', 'display', 'video', 'shopping']
            },
            {
              id: 'facebook_ads',
              name: 'Facebook Ads',
              icon: 'facebook',
              description: 'Facebook and Instagram advertising platform',
              auth_url: '/auth/facebook-ads',
              supported_features: ['social', 'video', 'stories', 'messenger']
            },
            {
              id: 'linkedin_ads',
              name: 'LinkedIn Ads',
              icon: 'linkedin',
              description: 'LinkedIn advertising for B2B marketing',
              auth_url: '/auth/linkedin-ads',
              supported_features: ['b2b', 'sponsored_content', 'message_ads']
            },
            {
              id: 'twitter_ads',
              name: 'Twitter Ads',
              icon: 'twitter',
              description: 'Twitter advertising platform',
              auth_url: '/auth/twitter-ads',
              supported_features: ['promoted_tweets', 'promoted_accounts', 'promoted_trends']
            }
          ]
        }
      }
      
      throw error
    }
  },

  // Get ad accounts
  async getAdAccounts() {
    try {
      const response = await api.get('/ad-accounts')
      return response.data
    } catch (error) {
      console.error('Error fetching ad accounts:', error)
      
      // Return fallback data for development/demo purposes
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        console.log('Ad accounts API timeout - using fallback data')
        return {
          data: [
            {
              id: 1,
              provider: 'google_ads',
              account_id: '123-456-7890',
              account_name: 'Google Ads Account',
              is_active: true,
              budget: 5000,
              currency: 'USD',
              connected_at: '2024-01-15T10:30:00Z',
              last_sync: '2024-01-20T14:22:00Z',
              provider_info: {
                id: 'google_ads',
                name: 'Google Ads',
                icon: 'google'
              }
            },
            {
              id: 2,
              provider: 'facebook_ads',
              account_id: '987-654-3210',
              account_name: 'Facebook Ads Account',
              is_active: true,
              budget: 3500,
              currency: 'USD',
              connected_at: '2024-01-10T09:15:00Z',
              last_sync: '2024-01-20T12:45:00Z',
              provider_info: {
                id: 'facebook_ads',
                name: 'Facebook Ads',
                icon: 'facebook'
              }
            },
            {
              id: 3,
              provider: 'linkedin_ads',
              account_id: '456-789-1230',
              account_name: 'LinkedIn Ads Account',
              is_active: false,
              budget: 2000,
              currency: 'USD',
              connected_at: '2024-01-05T16:20:00Z',
              last_sync: '2024-01-18T11:30:00Z',
              provider_info: {
                id: 'linkedin_ads',
                name: 'LinkedIn Ads',
                icon: 'linkedin'
              }
            }
          ]
        }
      }
      
      throw error
    }
  },

  // Create ad account
  async createAdAccount(data) {
    try {
      const response = await api.post('/ad-accounts', data)
      return response.data
    } catch (error) {
      console.error('Error creating ad account:', error)
      throw error
    }
  },

  // Update ad account
  async updateAdAccount(id, data) {
    try {
      const response = await api.put(`/ad-accounts/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating ad account:', error)
      throw error
    }
  },

  // Delete ad account
  async deleteAdAccount(id) {
    try {
      const response = await api.delete(`/ad-accounts/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting ad account:', error)
      throw error
    }
  },

  // Create ad campaign settings
  async createAdCampaignSettings(campaignId, data) {
    try {
      const response = await api.post(`/campaigns/${campaignId}/ads`, data)
      return response.data
    } catch (error) {
      console.error('Error creating ad campaign settings:', error)
      throw error
    }
  },

  // Get ad campaign metrics
  async getAdCampaignMetrics(campaignId) {
    try {
      const response = await api.get(`/campaigns/${campaignId}/ads-metrics`)
      return response.data
    } catch (error) {
      console.error('Error fetching ad campaign metrics:', error)
      
      // Return fallback data for development/demo purposes
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        console.log('Ad campaign metrics API timeout - using fallback data')
        return {
          data: {
            campaign_id: campaignId,
            impressions: 2400000,
            clicks: 48920,
            ctr: 2.04,
            cpc: 0.85,
            spend: 41582,
            conversions: 1250,
            conversion_rate: 2.55,
            roi: 4.2,
            period: 'last_30_days',
            last_updated: '2024-01-20T15:30:00Z'
          }
        }
      }
      
      throw error
    }
  },

  // Get ads analytics
  async getAdsAnalytics(params = {}) {
    try {
      const response = await api.get('/analytics/ads', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching ads analytics:', error)
      
      // Return fallback data for development/demo purposes
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        console.log('Ads analytics API timeout - using fallback data')
        return {
          data: {
            total_spend: 125000,
            total_impressions: 8500000,
            total_clicks: 170000,
            total_conversions: 4250,
            avg_ctr: 2.0,
            avg_cpc: 0.74,
            avg_conversion_rate: 2.5,
            avg_roi: 3.8,
            top_performing_campaigns: [
              {
                id: 1,
                name: 'Summer Sale Campaign',
                spend: 25000,
                impressions: 1800000,
                clicks: 36000,
                conversions: 900,
                ctr: 2.0,
                cpc: 0.69,
                conversion_rate: 2.5,
                roi: 4.2
              },
              {
                id: 2,
                name: 'Brand Awareness',
                spend: 20000,
                impressions: 2200000,
                clicks: 33000,
                conversions: 660,
                ctr: 1.5,
                cpc: 0.61,
                conversion_rate: 2.0,
                roi: 3.5
              }
            ],
            performance_by_provider: [
              {
                provider: 'google_ads',
                spend: 75000,
                impressions: 4500000,
                clicks: 90000,
                conversions: 2250,
                ctr: 2.0,
                cpc: 0.83,
                conversion_rate: 2.5,
                roi: 3.6
              },
              {
                provider: 'facebook_ads',
                spend: 35000,
                impressions: 2800000,
                clicks: 56000,
                conversions: 1400,
                ctr: 2.0,
                cpc: 0.63,
                conversion_rate: 2.5,
                roi: 4.0
              },
              {
                provider: 'linkedin_ads',
                spend: 15000,
                impressions: 1200000,
                clicks: 24000,
                conversions: 600,
                ctr: 2.0,
                cpc: 0.63,
                conversion_rate: 2.5,
                roi: 4.0
              }
            ],
            trends: {
              spend: [15000, 18000, 22000, 25000, 28000, 32000],
              impressions: [1200000, 1400000, 1600000, 1800000, 2000000, 2200000],
              clicks: [24000, 28000, 32000, 36000, 40000, 44000],
              conversions: [600, 700, 800, 900, 1000, 1100]
            },
            period: 'last_30_days',
            last_updated: '2024-01-20T15:30:00Z'
          }
        }
      }
      
      throw error
    }
  }
}

// Helper functions for ads data processing
export const adsHelpers = {
  // Get provider icon
  getProviderIcon(providerId) {
    const icons = {
      google_ads: 'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z',
      facebook_ads: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
      linkedin_ads: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
      twitter_ads: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z'
    }
    return icons[providerId] || icons.google_ads
  },

  // Get provider color
  getProviderColor(providerId) {
    const colors = {
      google_ads: 'text-blue-600',
      facebook_ads: 'text-blue-700',
      linkedin_ads: 'text-blue-600',
      twitter_ads: 'text-blue-400'
    }
    return colors[providerId] || 'text-gray-600'
  },

  // Get status badge color
  getStatusBadgeColor(isActive) {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800'
  },

  // Format currency
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  },

  // Format number with commas
  formatNumber(num) {
    if (!num) return '0'
    return num.toLocaleString()
  },

  // Format percentage
  formatPercentage(num, decimals = 1) {
    if (!num) return '0%'
    return `${num.toFixed(decimals)}%`
  },

  // Format date
  formatDate(dateString) {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },

  // Calculate ROI
  calculateROI(revenue, cost) {
    if (!cost || cost === 0) return 0
    return ((revenue - cost) / cost * 100).toFixed(1)
  }
}
