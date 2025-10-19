import { ref, computed } from 'vue'
import { helpAPI } from '@/modules/service/api/helpAPI.js'

export function useArticles() {
  const articles = ref([])
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Article suggestions for tickets
  const getArticleSuggestions = async (ticketId, query = '') => {
    try {
      loading.value = true
      error.value = null
      
      const response = await helpAPI.getArticleSuggestions(ticketId, query)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch article suggestions'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Advanced search
  const searchArticles = async (filters = {}) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await helpAPI.searchArticlesAdvanced(filters)
      articles.value = response.data.data || response.data.articles || []
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to search articles'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get article attachments
  const getArticleAttachments = async (articleId) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await helpAPI.getArticleAttachments(articleId)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch attachments'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Upload attachment
  const uploadAttachment = async (articleId, file) => {
    try {
      loading.value = true
      error.value = null
      
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await helpAPI.uploadAttachment(articleId, formData)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to upload attachment'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete attachment
  const deleteAttachment = async (articleId, attachmentId) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await helpAPI.deleteAttachment(articleId, attachmentId)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete attachment'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Notify subscribers
  const notifySubscribers = async (articleId) => {
    try {
      loading.value = true
      error.value = null
      
      console.log('Notifying subscribers for article:', articleId)
      const response = await helpAPI.notifySubscribers(articleId)
      console.log('Notify subscribers response:', response)
      return response.data
    } catch (err) {
      console.error('Notify subscribers error:', err)
      error.value = err.response?.data?.message || 'Failed to notify subscribers'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get article versions
  const getArticleVersions = async (articleId) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await helpAPI.getArticleVersions(articleId)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch article versions'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Compare versions
  const compareVersions = async (articleId, version1, version2) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await helpAPI.compareVersions(articleId, version1, version2)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to compare versions'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Restore version
  const restoreVersion = async (articleId, versionId) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await helpAPI.restoreVersion(articleId, versionId)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to restore version'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Computed properties
  const hasArticles = computed(() => articles.value.length > 0)
  const hasCategories = computed(() => categories.value.length > 0)

  return {
    // State
    articles,
    categories,
    loading,
    error,
    
    // Computed
    hasArticles,
    hasCategories,
    
    // Methods
    getArticleSuggestions,
    searchArticles,
    getArticleAttachments,
    uploadAttachment,
    deleteAttachment,
    notifySubscribers,
    getArticleVersions,
    compareVersions,
    restoreVersion
  }
}
