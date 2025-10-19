import { defineStore } from 'pinia'
import { helpAPI } from '../api/helpAPI.js'
import { demoCategories, demoArticles, demoAnalytics } from '@/data/help-demo-data.js'

export const useHelpStore = defineStore('help', {
  state: () => ({
    articles: [],
    categories: [],
    selectedArticle: null,
    analytics: {},
    loading: false,
    error: null,
    success: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0
    },
    searchQuery: '',
    selectedCategory: null
  }),

  getters: {
    filteredArticles: (state) => {
      let filtered = state.articles
      
      if (state.selectedCategory) {
        filtered = filtered.filter(article => 
          article.category_id === state.selectedCategory.id
        )
      }
      
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        filtered = filtered.filter(article => 
          article.title.toLowerCase().includes(query) ||
          article.summary.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query)
        )
      }
      
      return filtered
    },
    
    publishedArticles: (state) => state.articles.filter(article => article.status === 'published'),
    
    draftArticles: (state) => state.articles.filter(article => article.status === 'draft')
  },

  actions: {
    async fetchCategories(tenantId) {
      try {
        this.loading = true
        this.error = null
        
        console.log('Fetching categories from API for tenant:', tenantId)
        const response = await helpAPI.getCategories(tenantId)
        
        console.log('Categories API response:', response.data)
        this.categories = response.data.data || response.data
        return response.data
      } catch (error) {
        console.error('Failed to fetch categories from API:', error)
        this.error = error.response?.data?.message || 'Failed to load categories'
        
        // Don't use demo data - let the UI handle empty state
        console.warn('No categories loaded from API - categories will be empty')
        
        throw error
      } finally {
        this.loading = false
      }
    },

    // Force refresh categories from API (for form usage)
    async refreshCategories(tenantId) {
      try {
        this.loading = true
        this.error = null
        
        console.log('Force refreshing categories from API for tenant:', tenantId)
        const response = await helpAPI.getCategories(tenantId)
        
        console.log('Categories refresh response:', response.data)
        this.categories = response.data.data || response.data
        return response.data
      } catch (error) {
        console.error('Failed to refresh categories from API:', error)
        this.error = error.response?.data?.message || 'Failed to refresh categories'
        // Don't use demo data - let the UI handle empty state
        console.warn('Failed to refresh categories from API - categories will be empty')
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchArticles(tenantId, query = '', page = 1, categoryId = null) {
      try {
        this.loading = true
        this.error = null
        
        console.log('Fetching articles from API:', { tenantId, query, page, categoryId })
        const response = await helpAPI.getArticles(tenantId, query, page, categoryId)
        
        const rawArticles = response.data.data || response.data.articles || []
        
        // Deduplicate articles by ID to prevent duplicates
        this.articles = rawArticles.filter((article, index, self) => 
          index === self.findIndex(a => a.id === article.id)
        )
        this.pagination = {
          current_page: response.data.current_page || 1,
          last_page: response.data.last_page || 1,
          per_page: response.data.per_page || 10,
          total: response.data.total || 0
        }
        
        return response.data
      } catch (error) {
        console.error('Failed to fetch articles from API:', error)
        this.error = error.response?.data?.message || 'Failed to load articles'
        // Don't use demo data - let the UI handle empty state
        console.warn('No articles loaded from API - articles will be empty')
        this.articles = []
        this.pagination = {
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0
        }
        throw error
      } finally {
        this.loading = false
      }
    },

    // Admin method to fetch all articles (including drafts)
    async fetchAdminArticles() {
      try {
        this.loading = true
        this.error = null
        
        console.log('Help Store: Fetching admin articles from API - calling GET /api/admin/help/articles')
        const response = await helpAPI.getAdminArticles()
        console.log('Help Store: Admin articles API response:', response.data)
        
        const rawArticles = response.data.data || response.data.articles || []
        
        // Deduplicate articles by ID to prevent duplicates
        this.articles = rawArticles.filter((article, index, self) => 
          index === self.findIndex(a => a.id === article.id)
        )
        this.pagination = {
          current_page: response.data.current_page || 1,
          last_page: response.data.last_page || 1,
          per_page: response.data.per_page || 10,
          total: response.data.total || 0
        }
        
        return response.data
      } catch (error) {
        console.error('Failed to fetch admin articles from API:', error)
        this.error = error.response?.data?.message || 'Failed to load articles'
        // Don't use demo data - let the UI handle empty state
        console.warn('No admin articles loaded from API - articles will be empty')
        this.articles = []
        this.pagination = {
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0
        }
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchArticle(slug, tenantId) {
      try {
        this.loading = true
        this.error = null
        
        const response = await helpAPI.getArticle(slug, tenantId)
        
        this.selectedArticle = response.data.data || response.data
        return response.data
      } catch (error) {
        console.error('Failed to fetch article from API:', error)
        this.error = error.response?.data?.message || 'Failed to load article'
        // Don't use demo data - let the UI handle empty state
        console.warn('Article not found in API - will show error')
        this.selectedArticle = null
        throw error
      } finally {
        this.loading = false
      }
    },

    async postFeedback(articleId, feedback, tenantId) {
      try {
        this.loading = true
        this.error = null
        
        const response = await helpAPI.postFeedback(articleId, feedback, tenantId)
        
        // Update the article's feedback count
        if (this.selectedArticle && this.selectedArticle.id === articleId) {
          if (feedback === 'helpful') {
            this.selectedArticle.helpful_count = (this.selectedArticle.helpful_count || 0) + 1
          } else {
            this.selectedArticle.not_helpful_count = (this.selectedArticle.not_helpful_count || 0) + 1
          }
        }
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to submit feedback'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchAnalytics() {
      try {
        this.loading = true
        this.error = null
        
        console.log('Fetching analytics from API')
        const response = await helpAPI.getAnalytics()
        this.analytics = response.data.data || response.data
        return response.data
      } catch (error) {
        console.error('Failed to fetch analytics from API:', error)
        this.error = error.response?.data?.message || 'Failed to load analytics'
        // Don't use demo data - let the UI handle empty state
        console.warn('No analytics loaded from API - analytics will be empty')
        this.analytics = {}
        throw error
      } finally {
        this.loading = false
      }
    },

    // Advanced search for analytics
    async searchArticlesAdvanced(filters = {}) {
      try {
        this.loading = true
        this.error = null
        
        const response = await helpAPI.searchArticlesAdvanced(filters)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to search articles'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Fetch detailed article stats for admin view
    async fetchArticleDetails(articleId) {
      try {
        this.loading = true
        this.error = null
        
        console.log('Fetching article details from API for ID:', articleId)
        const response = await helpAPI.getArticleDetails(articleId)
        return response.data.data || response.data
      } catch (error) {
        console.error('Failed to fetch article details from API:', error)
        this.error = error.response?.data?.message || 'Failed to load article details'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Admin actions
    async createArticle(articleData) {
      try {
        this.loading = true
        this.error = null
        
        console.log('Help Store: Creating article with data:', articleData)
        console.log('Help Store: Making request to /api/admin/help/articles')
        
        // Ensure we're using the correct endpoint
        const endpoint = '/api/admin/help/articles'
        console.log('Help Store: Using endpoint:', endpoint)
        
        const response = await helpAPI.createArticle(articleData)
        
        // Add to articles list
        this.articles.unshift(response.data.data || response.data)
        
        return response.data
      } catch (error) {
        console.error('Help Store: Error creating article:', error)
        console.error('Help Store: Error response:', error.response)
        console.error('Help Store: Error config:', error.config)
        this.error = error.response?.data?.message || 'Failed to create article'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateArticle(articleId, articleData) {
      try {
        this.loading = true
        this.error = null
        
        const response = await helpAPI.updateArticle(articleId, articleData)
        
        // Update in articles list
        const index = this.articles.findIndex(article => article.id === articleId)
        if (index !== -1) {
          this.articles[index] = response.data.data || response.data
        }
        
        // Update selected article if it's the same
        if (this.selectedArticle && this.selectedArticle.id === articleId) {
          this.selectedArticle = response.data.data || response.data
        }
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update article'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteArticle(articleId) {
      try {
        this.loading = true
        this.error = null
        
        await helpAPI.deleteArticle(articleId)
        
        // Remove from articles list
        this.articles = this.articles.filter(article => article.id !== articleId)
        
        // Clear selected article if it's the same
        if (this.selectedArticle && this.selectedArticle.id === articleId) {
          this.selectedArticle = null
        }
        
        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete article'
        throw error
      } finally {
        this.loading = false
      }
    },

    setSearchQuery(query) {
      this.searchQuery = query
    },

    setSelectedCategory(category) {
      this.selectedCategory = category
    },

    clearFilters() {
      this.searchQuery = ''
      this.selectedCategory = null
    },

    clearError() {
      this.error = null
    },

    // Category management methods
    
    async createCategory(categoryData) {
      try {
        this.loading = true
        this.error = null
        
        console.log('Creating category with data:', categoryData)
        const response = await helpAPI.createCategory(categoryData)
        
        // Add to categories list
        this.categories.push(response.data.data || response.data)
        
        return response.data
      } catch (error) {
        console.error('Failed to create category:', error)
        this.error = error.response?.data?.message || 'Failed to create category'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCategory(categoryId, categoryData) {
      try {
        this.loading = true
        this.error = null
        
        const response = await helpAPI.updateCategory(categoryId, categoryData)
        
        // Update in categories list
        const index = this.categories.findIndex(category => category.id === categoryId)
        if (index !== -1) {
          this.categories[index] = response.data.data || response.data
        }
        
        return response.data
      } catch (error) {
        console.error('Failed to update category:', error)
        this.error = error.response?.data?.message || 'Failed to update category'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteCategory(categoryId) {
      try {
        this.loading = true
        this.error = null
        this.success = null
        
        await helpAPI.deleteCategory(categoryId)
        
        // Remove from categories list
        this.categories = this.categories.filter(category => category.id !== categoryId)
        
        this.success = 'Category deleted successfully'
        return true
      } catch (error) {
        console.error('Failed to delete category:', error)
        this.error = error.response?.data?.message || 'Failed to delete category'
        this.success = null
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
