import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { socialMediaService, type SocialMediaPost, type SocialMediaDashboard, type SocialListening } from '@/services/socialMedia'

export interface ConnectedAccount {
  id: string
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin'
  username: string
  connected_at: string
  status: 'active' | 'error' | 'expired'
  followers_count?: number
  profile_image?: string
}

export const useSocialMediaStore = defineStore('socialMedia', () => {
  // State
  const posts = ref<SocialMediaPost[]>([])
  const dashboard = ref<SocialMediaDashboard | null>(null)
  const socialListening = ref<SocialListening | null>(null)
  const connectedAccounts = ref<ConnectedAccount[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const activePosts = computed(() => posts.value.filter(p => p.status !== 'draft'))
  const draftPosts = computed(() => posts.value.filter(p => p.status === 'draft'))
  const scheduledPosts = computed(() => posts.value.filter(p => p.status === 'scheduled'))
  const publishedPosts = computed(() => posts.value.filter(p => p.status === 'published'))

  const connectedPlatforms = computed(() => 
    connectedAccounts.value.map(acc => acc.platform)
  )

  const isConnected = (platform: string) => 
    connectedAccounts.value.some(acc => acc.platform === platform && acc.status === 'active')

  // Actions
  const fetchDashboard = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await socialMediaService.getDashboard()
      dashboard.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch dashboard'
      console.error('Failed to fetch dashboard:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchPosts = async (filters?: any) => {
    try {
      loading.value = true
      error.value = null
      const response = await socialMediaService.getPosts(filters)
      posts.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch posts'
      console.error('Failed to fetch posts:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createPost = async (postData: any) => {
    try {
      loading.value = true
      error.value = null
      const response = await socialMediaService.createPost(postData)
      if (response.data) {
        posts.value.unshift(response.data)
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to create post'
      console.error('Failed to create post:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePost = async (id: number, postData: any) => {
    try {
      loading.value = true
      error.value = null
      const response = await socialMediaService.updatePost(id, postData)
      const index = posts.value.findIndex(p => p.id === id)
      if (index !== -1 && response.data) {
        posts.value[index] = { ...posts.value[index], ...response.data }
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to update post'
      console.error('Failed to update post:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deletePost = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      await socialMediaService.deletePost(id)
      posts.value = posts.value.filter(p => p.id !== id)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete post'
      console.error('Failed to delete post:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const publishPost = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      const response = await socialMediaService.publishPost(id)
      const index = posts.value.findIndex(p => p.id === id)
      if (index !== -1 && response.data) {
        posts.value[index] = { ...posts.value[index], ...response.data }
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to publish post'
      console.error('Failed to publish post:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchSocialListening = async (params?: any) => {
    try {
      loading.value = true
      error.value = null
      const response = await socialMediaService.getSocialListening(params)
      socialListening.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch social listening data'
      console.error('Failed to fetch social listening:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const loadConnectedAccounts = () => {
    // Load from localStorage or make API call
    const stored = localStorage.getItem('connected_social_accounts')
    if (stored) {
      try {
        connectedAccounts.value = JSON.parse(stored)
      } catch (err) {
        console.error('Failed to parse connected accounts:', err)
      }
    }
  }

  const connectAccount = (account: ConnectedAccount) => {
    const existing = connectedAccounts.value.findIndex(
      acc => acc.platform === account.platform
    )
    if (existing !== -1) {
      connectedAccounts.value[existing] = account
    } else {
      connectedAccounts.value.push(account)
    }
    // Save to localStorage
    localStorage.setItem('connected_social_accounts', JSON.stringify(connectedAccounts.value))
  }

  const disconnectAccount = (platform: string) => {
    connectedAccounts.value = connectedAccounts.value.filter(
      acc => acc.platform !== platform
    )
    // Save to localStorage
    localStorage.setItem('connected_social_accounts', JSON.stringify(connectedAccounts.value))
  }

  const clearError = () => {
    error.value = null
  }

  // Initialize
  loadConnectedAccounts()

  return {
    // State
    posts,
    dashboard,
    socialListening,
    connectedAccounts,
    loading,
    error,
    
    // Computed
    activePosts,
    draftPosts,
    scheduledPosts,
    publishedPosts,
    connectedPlatforms,
    isConnected,
    
    // Actions
    fetchDashboard,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    publishPost,
    fetchSocialListening,
    connectAccount,
    disconnectAccount,
    clearError
  }
})
