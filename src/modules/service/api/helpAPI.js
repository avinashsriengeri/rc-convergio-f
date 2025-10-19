import api from '@/services/api'

// Help Center API endpoints
export const helpAPI = {
  // Public endpoints (no authentication required)
  
  // Get all categories
  getCategories: (tenantId) => api.get('/help/categories', { 
    params: { tenant: tenantId } 
  }),
  
  // Get all articles with optional filters (public - published only)
  getArticles: (tenantId, query = '', page = 1, categoryId = null) => {
    const params = { tenant: tenantId, page }
    if (query) params.query = query
    if (categoryId) params.category = categoryId
    return api.get('/help/articles', { params })
  },
  
  // Get a specific article by slug
  getArticle: (slug, tenantId) => api.get(`/help/articles/${slug}`, {
    params: { tenant: tenantId }
  }),
  
  // Submit feedback for an article
  postFeedback: (articleId, feedback, tenantId) => api.post(`/help/articles/${articleId}/feedback`, {
    feedback: feedback,
    tenant: tenantId
  }),

  // Admin endpoints (authentication required)
  
  // Get all articles for admin (includes drafts)
  getAdminArticles: () => {
    console.log('HelpAPI: Making request to GET /admin/help/articles')
    return api.get('/admin/help/articles')
  },
  
  // Create a new article
  createArticle: (data) => api.post('/admin/help/articles', data),
  
  // Update an existing article
  updateArticle: (id, data) => api.put(`/admin/help/articles/${id}`, data),
  
  // Delete an article
  deleteArticle: (id) => api.delete(`/admin/help/articles/${id}`),
  
  // Get analytics/statistics
  getAnalytics: () => api.get('/admin/help/stats/overview'),
  
  // Get individual article details with stats
  getArticleDetails: (id) => api.get(`/admin/help/articles/${id}`),

  // Category management endpoints (admin only)
  
  // Get all categories for admin
  getAdminCategories: (tenantId) => api.get('/admin/help/categories', {
    params: { tenant: tenantId }
  }),
  
  // Create a new category
  createCategory: (data) => api.post('/admin/help/categories', data),
  
  // Update an existing category
  updateCategory: (id, data) => api.put(`/admin/help/categories/${id}`, data),
  
  // Delete a category
  deleteCategory: (id) => api.delete(`/admin/help/categories/${id}`),

  // Enhanced features endpoints

  // Article suggestions for tickets
  getArticleSuggestions: (ticketId, query = '') => api.get(`/service/tickets/${ticketId}/article-suggestions`, {
    params: { query }
  }),

  // Advanced search
  searchArticlesAdvanced: (filters = {}) => api.get('/help/search/advanced', {
    params: filters
  }),

  // Article attachments
  getArticleAttachments: (articleId) => api.get(`/admin/help/articles/${articleId}/attachments`),
  uploadAttachment: (articleId, formData) => api.post(`/admin/help/articles/${articleId}/attachments`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteAttachment: (articleId, attachmentId) => api.delete(`/admin/help/articles/${articleId}/attachments/${attachmentId}`),

  // Email notifications
  notifySubscribers: (articleId) => api.post(`/admin/help/articles/${articleId}/notify`),

  // Article versioning
  getArticleVersions: (articleId) => api.get(`/admin/help/articles/${articleId}/versions`),
  compareVersions: (articleId, version1, version2) => api.get(`/admin/help/articles/${articleId}/compare-versions`, {
    params: { version1, version2 }
  }),
  restoreVersion: (articleId, versionId) => api.post(`/admin/help/articles/${articleId}/restore-version`, {
    version_id: versionId
  })
}

export default helpAPI
