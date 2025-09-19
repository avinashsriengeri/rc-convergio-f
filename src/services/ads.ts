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
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout') || error.response?.status >= 500) {
        console.log('Ad account providers API timeout - using fallback data')
        return {
          data: [
            {
              id: 'google',
              name: 'Google Ads',
              icon: 'google',
              description: 'Google Ads platform for search and display advertising',
              auth_url: '/auth/google-ads',
              supported_features: ['search', 'display', 'video', 'shopping']
            },
            {
              id: 'facebook',
              name: 'Facebook Ads',
              icon: 'facebook',
              description: 'Facebook and Instagram advertising platform',
              auth_url: '/auth/facebook-ads',
              supported_features: ['social', 'video', 'stories', 'messenger']
            },
            {
              id: 'linkedin',
              name: 'LinkedIn Ads',
              icon: 'linkedin',
              description: 'LinkedIn advertising for B2B marketing',
              auth_url: '/auth/linkedin-ads',
              supported_features: ['b2b', 'sponsored_content', 'message_ads']
            },
            {
              id: 'twitter',
              name: 'Twitter Ads',
              icon: 'twitter',
              description: 'Twitter advertising platform',
              auth_url: '/auth/twitter-ads',
              supported_features: ['promoted_tweets', 'promoted_accounts', 'promoted_trends']
            },
            {
              id: 'instagram',
              name: 'Instagram Ads',
              icon: 'instagram',
              description: 'Instagram advertising platform',
              auth_url: '/auth/instagram-ads',
              supported_features: ['stories', 'feed', 'reels', 'shopping']
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
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout') || error.response?.status >= 500) {
        console.log('Ad accounts API timeout - using fallback data')
        return {
          data: []
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
      // Handle validation errors from backend
      if (error.response?.status === 422) {
        const errorData = error.response.data
        throw new Error(errorData.message || 'Validation failed')
      }
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
      // Handle validation errors from backend
      if (error.response?.status === 422) {
        const errorData = error.response.data
        throw new Error(errorData.message || 'Validation failed')
      }
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
      // Handle validation errors from backend
      if (error.response?.status === 422) {
        const errorData = error.response.data
        throw new Error(errorData.message || 'Validation failed')
      }
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
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout') || error.response?.status >= 500) {
        console.log('Ad campaign metrics API timeout - using fallback data')
        return {
          data: {
            campaign_id: campaignId,
            provider: 'google',
            impressions: 0,
            clicks: 0,
            conversions: 0,
            roi: 0,
            spend: 0,
            ctr: 0,
            cpc: 0,
            updated_at: new Date().toISOString()
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
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout') || error.response?.status >= 500) {
        console.log('Ads analytics API timeout - using fallback data')
        return {
          data: {
            total_accounts: 0,
            active_accounts: 0,
            providers: [],
            impressions: 0,
            clicks: 0,
            spent: 0,
            conversions: 0,
            ctr: 0,
            cpc: 0,
            conversion_rate: 0,
            cpa: 0,
            top_performing_campaigns: [],
            performance_by_provider: [],
            trends: {
              spend: [],
              impressions: [],
              clicks: [],
              conversions: []
            }
          }
        }
      }
      
      throw error
    }
  },

  // OAuth-based connection methods (NEW - for Facebook Ads)
  async getFacebookOAuthRedirect() {
    try {
      const response = await api.get('/facebook/oauth/redirect')
      
      // Log the response for debugging
      console.log('Facebook OAuth redirect response:', response.data)
      
      return response.data
    } catch (error) {
      console.error('Error getting Facebook OAuth redirect:', error)
      throw error
    }
  },

  async handleFacebookOAuthCallback(code, state) {
    try {
      const response = await api.get(`/oauth/facebook/callback?code=${code}&state=${state}`)
      return response.data
    } catch (error) {
      console.error('Error handling Facebook OAuth callback:', error)
      throw error
    }
  },

  async getFacebookAdAccounts() {
    try {
      const response = await api.get('/facebook/ad-accounts')
      return response.data
    } catch (error) {
      console.error('Error fetching Facebook ad accounts:', error)
      throw error
    }
  },

  async disconnectFacebookAccount() {
    try {
      const response = await api.post('/facebook/disconnect')
      return response.data
    } catch (error) {
      console.error('Error disconnecting Facebook account:', error)
      throw error
    }
  },

  // OAuth-based connection methods (NEW - for Google Ads)
  async getGoogleOAuthRedirect() {
    try {
      const response = await api.get('/google/oauth/redirect')
      
      // Log the response for debugging
      console.log('Google OAuth redirect response:', response.data)
      
      return response.data
    } catch (error) {
      console.error('Error getting Google OAuth redirect:', error)
      throw error
    }
  },

  async handleGoogleOAuthCallback(code, state) {
    try {
      const response = await api.get(`/oauth/google/callback?code=${code}&state=${state}`)
      return response.data
    } catch (error) {
      console.error('Error handling Google OAuth callback:', error)
      throw error
    }
  },

  async getGoogleAdAccounts() {
    try {
      const response = await api.get('/google/ad-accounts')
      return response.data
    } catch (error) {
      console.error('Error fetching Google ad accounts:', error)
      throw error
    }
  },

  async disconnectGoogleAccount() {
    try {
      const response = await api.post('/google/disconnect')
      return response.data
    } catch (error) {
      console.error('Error disconnecting Google account:', error)
      throw error
    }
  }
}

// Helper functions for ads data processing
export const adsHelpers = {
  // Get provider icon
  getProviderIcon(providerId) {
    const icons = {
      google: 'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z',
      facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
      linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
      twitter: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z',
      instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
    }
    return icons[providerId] || icons.google
  },

  // Get provider color
  getProviderColor(providerId) {
    const colors = {
      google: 'text-blue-600',
      facebook: 'text-blue-700',
      linkedin: 'text-blue-600',
      twitter: 'text-blue-400',
      instagram: 'text-pink-600'
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
