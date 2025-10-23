import api from './api'

export interface SocialMediaPost {
  id: number
  title: string
  content: string
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok'
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  scheduled_at?: string
  published_at?: string
  media_urls?: string[]
  hashtags?: string[]
  mentions?: string[]
  engagement_metrics?: {
    likes?: number
    shares?: number
    comments?: number
    views?: number
  }
  user_id: number
  campaign_id?: number
  user?: {
    id: number
    name: string
    email: string
  }
  campaign?: {
    id: number
    name: string
  }
  created_at: string
  updated_at: string
}

export interface SocialMediaAnalytic {
  id: number
  social_media_post_id: number
  platform: string
  metric_type: 'likes' | 'shares' | 'comments' | 'views' | 'clicks' | 'impressions' | 'reach' | 'engagement_rate'
  metric_value: number
  recorded_at: string
  meta_data?: any
}

export interface SocialMediaStats {
  total_posts: number
  published_today: number
  scheduled_posts: number
  platform_distribution: Record<string, number>
}

export interface SocialMediaDashboard {
  stats: SocialMediaStats
  recent_posts: SocialMediaPost[]
  upcoming_scheduled: SocialMediaPost[]
}

export interface SocialMention {
  id: number
  platform: string
  author: string
  content: string
  sentiment: 'positive' | 'negative' | 'neutral'
  engagement: number
  created_at: string
}

export interface SocialListening {
  mentions: SocialMention[]
  sentiment_analysis: {
    positive: number
    negative: number
    neutral: number
  }
  total_mentions: number
  total_engagement: number
}

class SocialMediaService {
  // Account Connection
  async connectAccount(platform: string) {
    const response = await api.post(`/social/connect/${platform}`)
    return response.data
  }

  async disconnectAccount(platform: string) {
    const response = await api.post(`/social/disconnect/${platform}`)
    return response.data
  }

  async getConnectedAccounts() {
    const response = await api.get('/social/accounts')
    return response.data
  }

  async getAccountStatus(platform: string) {
    const response = await api.get(`/social/accounts/${platform}/status`)
    return response.data
  }

  // Posts
  async getPosts(params?: {
    platform?: string
    status?: string
    date_from?: string
    date_to?: string
    search?: string
    per_page?: number
    page?: number
  }) {
    const response = await api.get('/social-media/posts', { params })
    return response.data
  }

  async createPost(data: {
    title: string
    content: string
    platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok'
    scheduled_at?: string
    media_urls?: string[]
    hashtags?: string[]
    mentions?: string[]
    campaign_id?: number
  }) {
    const response = await api.post('/social-media/posts', data)
    return response.data
  }

  async updatePost(id: number, data: Partial<SocialMediaPost>) {
    const response = await api.put(`/social-media/posts/${id}`, data)
    return response.data
  }

  async deletePost(id: number) {
    const response = await api.delete(`/social-media/posts/${id}`)
    return response.data
  }

  async publishPost(id: number) {
    const response = await api.post(`/social-media/posts/${id}/publish`)
    return response.data
  }

  async schedulePost(id: number, scheduledAt: string) {
    const response = await api.post(`/social-media/posts/${id}/schedule`, { scheduled_at: scheduledAt })
    return response.data
  }

  // Analytics
  async getAnalytics(params?: {
    date_from?: string
    date_to?: string
    platform?: string
  }) {
    const response = await api.get('/social-media/analytics', { params })
    return response.data
  }

  async getDashboard(): Promise<{ success: boolean; data: SocialMediaDashboard }> {
    const response = await api.get('/social-media/dashboard')
    return response.data
  }

  // Social Listening
  async getSocialListening(params?: {
    keywords?: string[]
    platform?: string
  }): Promise<{ success: boolean; data: SocialListening }> {
    const response = await api.get('/social-media/listening', { params })
    return response.data
  }

  // Removed fallback methods - now using only real API data
  private _removedGetFallbackPosts(params?: any) {
    const mockPosts = [
      {
        id: 1,
        title: 'Product Launch Announcement',
        content: 'Excited to announce our new product! Check it out at our website. #productlaunch #innovation',
        platform: 'facebook',
        status: 'published',
        scheduled_at: undefined,
        published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        media_urls: ['https://example.com/image1.jpg'],
        hashtags: ['productlaunch', 'innovation'],
        mentions: ['@company'],
        engagement_metrics: {
          likes: 45,
          shares: 12,
          comments: 8,
          views: 234
        },
        user_id: 1,
        user: { id: 1, name: 'John Smith', email: 'john@example.com' },
        campaign: { id: 1, name: 'Q4 Launch' },
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        title: 'Behind the Scenes',
        content: 'Take a look at our team working hard on the latest features! #behindthescenes #teamwork',
        platform: 'instagram',
        status: 'published',
        scheduled_at: undefined,
        published_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        media_urls: ['https://example.com/image2.jpg', 'https://example.com/image3.jpg'],
        hashtags: ['behindthescenes', 'teamwork'],
        mentions: [],
        engagement_metrics: {
          likes: 89,
          shares: 23,
          comments: 15,
          views: 456
        },
        user_id: 2,
        user: { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com' },
        campaign: null,
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        title: 'Industry Insights',
        content: 'Our latest blog post about industry trends and how they affect your business. Read more: [link]',
        platform: 'linkedin',
        status: 'scheduled',
        scheduled_at: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        published_at: undefined,
        media_urls: [],
        hashtags: ['industry', 'insights', 'business'],
        mentions: [],
        engagement_metrics: null,
        user_id: 1,
        user: { id: 1, name: 'John Smith', email: 'john@example.com' },
        campaign: { id: 2, name: 'Content Marketing' },
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 4,
        title: 'Customer Success Story',
        content: 'Amazing results from our client! See how they increased their ROI by 300% with our solution.',
        platform: 'twitter',
        status: 'draft',
        scheduled_at: undefined,
        published_at: undefined,
        media_urls: ['https://example.com/infographic.jpg'],
        hashtags: ['customersuccess', 'roi', 'results'],
        mentions: ['@client'],
        engagement_metrics: null,
        user_id: 3,
        user: { id: 3, name: 'Mike Wilson', email: 'mike@example.com' },
        campaign: { id: 3, name: 'Success Stories' },
        created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
      }
    ]

    // Apply filters
    let filteredPosts = mockPosts
    
    if (params?.platform) {
      filteredPosts = filteredPosts.filter(post => post.platform === params.platform)
    }
    
    if (params?.status) {
      filteredPosts = filteredPosts.filter(post => post.status === params.status)
    }
    
    if (params?.search) {
      const search = params.search.toLowerCase()
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(search) || 
        post.content.toLowerCase().includes(search)
      )
    }

    const perPage = params?.per_page || 15
    const currentPage = params?.page || 1
    const total = filteredPosts.length
    const offset = (currentPage - 1) * perPage
    const items = filteredPosts.slice(offset, offset + perPage)

    return {
      success: true,
      data: items,
      meta: {
        current_page: currentPage,
        last_page: Math.ceil(total / perPage),
        per_page: perPage,
        total: total,
        from: offset + 1,
        to: Math.min(offset + perPage, total)
      }
    }
  }

  private _removedGetFallbackAnalytics(_params?: any) {
    const platformStats = {
      facebook: {
        total_posts: 15,
        published: 12,
        total_engagement: 1250
      },
      instagram: {
        total_posts: 8,
        published: 6,
        total_engagement: 890
      },
      linkedin: {
        total_posts: 5,
        published: 4,
        total_engagement: 340
      },
      twitter: {
        total_posts: 12,
        published: 10,
        total_engagement: 560
      }
    }

    const totalPosts = Object.values(platformStats).reduce((sum, stat) => sum + stat.total_posts, 0)
    const publishedPosts = Object.values(platformStats).reduce((sum, stat) => sum + stat.published, 0)
    const totalEngagement = Object.values(platformStats).reduce((sum, stat) => sum + stat.total_engagement, 0)

    return {
      success: true,
      data: {
        summary: {
          total_posts: totalPosts,
          published_posts: publishedPosts,
          scheduled_posts: totalPosts - publishedPosts,
          engagement_rate: publishedPosts > 0 ? Math.round(totalEngagement / publishedPosts * 100) / 100 : 0
        },
        platform_stats: platformStats,
        recent_posts: [
          {
            id: 1,
            title: 'Product Launch Announcement',
            platform: 'facebook',
            status: 'published',
            engagement_metrics: { likes: 45, shares: 12, comments: 8 }
          },
          {
            id: 2,
            title: 'Behind the Scenes',
            platform: 'instagram',
            status: 'published',
            engagement_metrics: { likes: 89, shares: 23, comments: 15 }
          }
        ]
      }
    }
  }

  private _removedGetFallbackDashboard(): Promise<{ success: boolean; data: SocialMediaDashboard }> {
    return Promise.resolve({
      success: true,
      data: {
        stats: {
          total_posts: 40,
          published_today: 3,
          scheduled_posts: 8,
          platform_distribution: {
            facebook: 15,
            instagram: 8,
            linkedin: 5,
            twitter: 12
          }
        },
        recent_posts: [
          {
            id: 1,
            title: 'Product Launch Announcement',
            content: 'Excited to announce our new product!',
            platform: 'facebook',
            status: 'published',
            scheduled_at: undefined,
            published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            media_urls: [],
            hashtags: ['productlaunch'],
            mentions: [],
            engagement_metrics: { likes: 45, shares: 12, comments: 8, views: 234 },
            user_id: 1,
            user: { id: 1, name: 'John Smith', email: 'john@example.com' },
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            title: 'Behind the Scenes',
            content: 'Take a look at our team working hard!',
            platform: 'instagram',
            status: 'published',
            scheduled_at: undefined,
            published_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            media_urls: [],
            hashtags: ['behindthescenes'],
            mentions: [],
            engagement_metrics: { likes: 89, shares: 23, comments: 15, views: 456 },
            user_id: 2,
            user: { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com' },
            created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
          }
        ],
        upcoming_scheduled: [
          {
            id: 3,
            title: 'Industry Insights',
            content: 'Our latest blog post about industry trends',
            platform: 'linkedin',
            status: 'scheduled',
            scheduled_at: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
            published_at: undefined,
            media_urls: [],
            hashtags: ['industry'],
            mentions: [],
            user_id: 1,
            user: { id: 1, name: 'John Smith', email: 'john@example.com' },
            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      }
    })
  }

  private _removedGetFallbackSocialListening(params?: any): Promise<{ success: boolean; data: SocialListening }> {
    const mentions = [
      {
        id: 1,
        platform: 'twitter',
        author: '@user123',
        content: 'Just tried the new product, amazing!',
        sentiment: 'positive' as const,
        engagement: 25,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        platform: 'facebook',
        author: 'John Doe',
        content: 'Having issues with the service...',
        sentiment: 'negative' as const,
        engagement: 12,
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        platform: 'instagram',
        author: '@influencer',
        content: 'Love this brand! #awesome',
        sentiment: 'positive' as const,
        engagement: 150,
        created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 4,
        platform: 'linkedin',
        author: 'Business User',
        content: 'Checking out this new service.',
        sentiment: 'neutral' as const,
        engagement: 8,
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    ]

    let filteredMentions = mentions
    if (params?.platform && params.platform !== 'all') {
      filteredMentions = mentions.filter(mention => mention.platform === params.platform)
    }

    const sentimentAnalysis = {
      positive: filteredMentions.filter(m => m.sentiment === 'positive').length,
      negative: filteredMentions.filter(m => m.sentiment === 'negative').length,
      neutral: filteredMentions.filter(m => m.sentiment === 'neutral').length
    }

    return Promise.resolve({
      success: true,
      data: {
        mentions: filteredMentions,
        sentiment_analysis: sentimentAnalysis,
        total_mentions: filteredMentions.length,
        total_engagement: filteredMentions.reduce((sum, m) => sum + m.engagement, 0)
      }
    })
  }
}

export const socialMediaService = new SocialMediaService()

// Helper functions
export const socialMediaHelpers = {
  getPlatformIcon(platform: string): string {
    const icons = {
      facebook: 'fab fa-facebook',
      twitter: 'fab fa-twitter',
      instagram: 'fab fa-instagram',
      linkedin: 'fab fa-linkedin',
      youtube: 'fab fa-youtube',
      tiktok: 'fab fa-tiktok'
    }
    return icons[platform as keyof typeof icons] || 'fas fa-share-alt'
  },

  getPlatformColor(platform: string): string {
    const colors = {
      facebook: 'text-blue-600 bg-blue-100',
      twitter: 'text-sky-600 bg-sky-100',
      instagram: 'text-pink-600 bg-pink-100',
      linkedin: 'text-blue-700 bg-blue-100',
      youtube: 'text-red-600 bg-red-100',
      tiktok: 'text-gray-900 bg-gray-100'
    }
    return colors[platform as keyof typeof colors] || 'text-gray-600 bg-gray-100'
  },

  getStatusColor(status: string): string {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100'
      case 'scheduled': return 'text-blue-600 bg-blue-100'
      case 'draft': return 'text-gray-600 bg-gray-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  },

  getSentimentColor(sentiment: string): string {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100'
      case 'negative': return 'text-red-600 bg-red-100'
      case 'neutral': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  },

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  },

  calculateEngagementRate(metrics?: { likes?: number; shares?: number; comments?: number; views?: number }): number {
    if (!metrics || !metrics.views) return 0
    const engagement = (metrics.likes || 0) + (metrics.shares || 0) + (metrics.comments || 0)
    return (engagement / metrics.views) * 100
  },

  truncateContent(content: string, maxLength: number = 100): string {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }
}