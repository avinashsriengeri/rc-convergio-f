import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    // Skip authentication for public form endpoints, auth endpoints, public event endpoints, and commerce checkout

    // Debug logging for help articles requests
    if (config.url?.includes('help/articles')) {
      console.log('API Request:', {
        url: config.url,
        baseURL: config.baseURL,
        fullURL: config.baseURL + config.url,
        method: config.method,
        data: config.data
      })
    }
    
    // Handle FormData - let axios set Content-Type automatically for multipart/form-data
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    
    // Skip authentication for public form endpoints, auth endpoints, and public event endpoints

    const isPublicFormRequest = config.url?.includes('/public/forms/')
    const isAuthRequest = config.url?.includes('/auth/')
    const isPublicEventRequest = config.url?.includes('/public/events/')
    const isEventTypesRequest = config.url?.includes('/events/types')
    const isCommerceCheckoutRequest = config.url?.includes('/commerce/payment-links/') && config.method === 'get'
    
    if (!isPublicFormRequest && !isAuthRequest && !isPublicEventRequest && !isEventTypesRequest && !isCommerceCheckoutRequest) {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      } else {
        // For requests that require authentication but no token is available,
        // only warn if we're not on the login page
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/forgot-password') {
          console.warn('Making authenticated request without token:', config.url)
        }
      }
    }
    
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - handle auth errors and token refresh
api.interceptors.response.use(
  (response) => {
    // Debug logging removed for production
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      // Check if this is a public form request, public event request, or event types request
      const isPublicFormRequest = originalRequest.url?.includes('/public/forms/')
      const isPublicEventRequest = originalRequest.url?.includes('/public/events/')
      const isEventTypesRequest = originalRequest.url?.includes('/events/types')
      
      if (!isPublicFormRequest && !isPublicEventRequest && !isEventTypesRequest) {
        // Clear stored auth data only for authenticated requests
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        localStorage.removeItem('tenant_id')
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
      // For public form requests, just let the component handle the 401 error
    }

    // Debug logging removed for production

    // Handle 422 Validation errors
    if (error.response?.status === 422) {
      // Validation errors are handled by components
      return Promise.reject(error)
    }

    // Handle 500 Server errors
    if (error.response?.status >= 500) {
      // Server Error logged (console.error removed for production)
    }

    return Promise.reject(error)
  }
)

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verify: () => api.get('/auth/verify'),
  forgotPassword: (email) => api.post('/auth/forgot', { email }),
  resetPassword: (data) => api.post('/auth/reset', data),
  logout: () => api.post('/auth/logout'),
  resendVerification: (data) => api.post('/auth/resend-verification', data),
  getCurrentUser: () => api.get('/users/me'),
}

// Dashboard API endpoints
export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
  getDealsSummary: (range = '7d') => api.get(`/deals/summary?range=${range}`),
  getTodayTasks: () => api.get('/tasks/today'),
  getRecentContacts: (limit = 5) => {
    // TODO: Temporary suppression for contact detail navigation; remove when no longer needed
    if (typeof window !== 'undefined' && window.__RC_SUPPRESS_RECENT_CONTACTS__) {
      return Promise.resolve({ data: { data: [] } })
    }
    return api.get(`/contacts/recent?limit=${limit}`)
  },
  getCampaignMetrics: (range = '14d') => api.get(`/campaigns/metrics?range=${range}`),
}

// Contacts API endpoints
export const contactsAPI = {
  getContacts: (params = {}) => api.get('/contacts', { params }),
  getContact: (id) => api.get(`/contacts/${id}`),
  createContact: (data) => api.post('/contacts', data),
  updateContact: (id, data) => api.put(`/contacts/${id}`, data),
  deleteContact: (id) => api.delete(`/contacts/${id}`),
  restoreContact: (id) => api.post(`/contacts/${id}/restore`),
  searchContacts: (query, params = {}) => api.get('/contacts/search', { params: { q: query, ...params } }),
  importCSV: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/contacts/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  getImportStatus: (jobId) => api.get(`/contacts/import/status/${jobId}`),
  // Contact-specific endpoints
  getContactDeals: (contactId, params = {}) => api.get(`/contacts/${contactId}/deals`, { params }),
  getContactActivities: (contactId, params = {}) => api.get(`/contacts/${contactId}/activities`, { params }),
  getContactCompany: (contactId) => api.get(`/contacts/${contactId}/company`),
}

// Companies API endpoints
export const companiesAPI = {
  getCompanies: (params = {}) => api.get('/companies', { params }),
  getCompany: (id) => api.get(`/companies/${id}?t=${Date.now()}`),
  createCompany: (data) => api.post('/companies', data),
  updateCompany: (id, data) => api.put(`/companies/${id}`, data),
  deleteCompany: (id) => api.delete(`/companies/${id}`),
  restoreCompany: (id) => api.post(`/companies/${id}/restore`),
  getDeletedCompanies: (params = {}) => api.get('/companies/deleted', { params }),
  searchCompanies: (query, params = {}) => api.get('/companies/search', { params: { q: query, ...params } }),
  checkDuplicates: (data) => api.post('/companies/check-duplicates', data),
  bulkCreate: (data) => api.post('/companies/bulk-create', data),
  importCSV: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/companies/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  getImportStatus: (jobId) => api.get(`/companies/import/status/${jobId}`),
  attachContact: (companyId, contactId) => api.post(`/companies/${companyId}/contacts`, { contact_ids: [contactId] }),
  detachContact: (companyId, contactId) => api.delete(`/companies/${companyId}/contacts/${contactId}`),
  getCompanyContacts: (companyId) => api.get(`/companies/${companyId}/contacts`),
  getCompanyDeals: (companyId, params = {}) => api.get(`/companies/${companyId}/deals`, { params }),
  getActivityLog: (companyId) => api.get(`/companies/${companyId}/activity-log`),
  enrichCompany: (domain) => api.get(`/companies/enrich?domain=${domain}`),
}

// Metadata API endpoints
export const metadataAPI = {
  getIndustries: () => api.get('/metadata/industries'),
  getCompanyTypes: () => api.get('/metadata/company-types'),
  getOwners: () => api.get('/users/for-assignment'),
  getLeadSources: () => api.get('/metadata/lead-sources'),
  getContactTypes: () => api.get('/metadata/contact-types'),
  getDealStages: () => api.get('/metadata/deal-stages'),
  getDealStatuses: () => api.get('/metadata/deal-statuses'),
  getTaskPriorities: () => api.get('/metadata/task-priorities'),
  getTaskStatuses: () => api.get('/metadata/task-statuses'),
  getActivityTypes: () => api.get('/metadata/activity-types'),
  getCampaignTypes: () => api.get('/metadata/campaign-types'),
  getCampaignStatuses: () => api.get('/metadata/campaign-statuses'),
  getCurrencies: () => api.get('/metadata/currencies'),
}

// Pipelines API endpoints
export const pipelinesAPI = {
  getPipelines: (params = {}) => api.get('/pipelines', { params }),
  getPipeline: (id) => api.get(`/pipelines/${id}`),
  createPipeline: (data) => api.post('/pipelines', data),
  updatePipeline: (id, data) => api.put(`/pipelines/${id}`, data),
  deletePipeline: (id) => api.delete(`/pipelines/${id}`),
  toggleActive: (id) => api.patch(`/pipelines/${id}/toggle-active`),
  getActivePipelines: () => api.get('/pipelines/active'),
  getKanban: (id) => api.get(`/pipelines/${id}/kanban`),
}

// Stages API endpoints
export const stagesAPI = {
  getStages: (params = {}) => api.get('/stages', { params }),
  getStage: (id) => api.get(`/stages/${id}`),
  createStage: (data) => api.post('/stages', data),
  updateStage: (id, data) => api.put(`/stages/${id}`, data),
  deleteStage: (id) => api.delete(`/stages/${id}`),
  getStagesByPipeline: (pipelineId) => api.get(`/pipelines/${pipelineId}/stages`),
  reorderStages: (pipelineId, stageIds) => api.post(`/pipelines/${pipelineId}/stages/reorder`, { stage_ids: stageIds }),
}

// Deals API endpoints
export const dealsAPI = {
  getDeals: (params = {}) => api.get('/deals', { params }),
  getDeal: (id) => api.get(`/deals/${id}`),
  createDeal: (data) => api.post('/deals', data),
  updateDeal: (id, data) => api.put(`/deals/${id}`, data),
  deleteDeal: (id) => api.delete(`/deals/${id}`),
  moveDeal: (id, stageId, reason) => api.post(`/deals/${id}/move`, { stage_id: stageId, reason: reason }),
  getDealStageHistory: (id, params = {}) => api.get(`/deals/${id}/stage-history`, { params }),
  getDealsByStage: (stageId) => api.get(`/stages/${stageId}/deals`),
  getDealsByPipeline: (pipelineId) => api.get(`/pipelines/${pipelineId}/deals`),
  getDealsSummary: (range = '7d') => api.get(`/deals/summary?range=${range}`),
  getDealsChart: (range = '30d') => api.get(`/deals/chart?range=${range}`),
  bulkUpdate: (dealIds, data) => api.patch('/deals/bulk-update', { deal_ids: dealIds, ...data }),
  exportDeals: (params = {}) => api.get('/deals/export', { params, responseType: 'blob' }),
}

// Activities API endpoints
export const activitiesAPI = {
  getActivities: (params = {}) => api.get('/activities', { params }),
  getActivity: (id) => api.get(`/activities/${id}`),
  createActivity: (data) => api.post('/activities', data),
  updateActivity: (id, data) => api.put(`/activities/${id}`, data),
  deleteActivity: (id) => api.delete(`/activities/${id}`),
  getActivitiesByEntity: (entityType, entityId) => api.get(`/activities/${entityType}/${entityId}`),
  getActivityTimeline: (params = {}) => api.get('/activities/timeline', { params }),
  getUpcomingActivities: (params = {}) => api.get('/activities/upcoming', { params }),
  markCompleted: (id) => api.patch(`/activities/${id}/complete`),
  completeActivity: (id) => api.patch(`/activities/${id}/complete`),
  bulkComplete: (ids) => api.post('/activities/bulk-complete', { ids }),
  bulkDelete: (ids) => api.delete('/activities/bulk-delete', { data: { ids } }),
  bulkUpdate: (data) => api.patch('/activities/bulk-update', data),
  exportActivities: (params) => api.get('/activities/export', { params, responseType: 'blob' }),
}

// Tasks API endpoints
export const tasksAPI = {
  getTasks: (params = {}) => api.get('/tasks', { params }),
  getTask: (id) => api.get(`/tasks/${id}`),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  completeTask: (id) => api.post(`/tasks/${id}/complete`),
  getTasksByAssignee: (assigneeId) => api.get(`/tasks/assignee/${assigneeId}`),
  getTasksByOwner: (ownerId) => api.get(`/tasks/owner/${ownerId}`),
  getTodayTasks: () => api.get('/tasks/today'),
  getOverdueTasks: () => api.get('/tasks/overdue'),
  getUpcomingTasks: (days = 7) => api.get(`/tasks/upcoming?days=${days}`),
  bulkUpdate: (taskIds, data) => api.patch('/tasks/bulk-update', { ids: taskIds, ...data }),
  bulkComplete: (taskIds) => api.post('/tasks/bulk-complete', { task_ids: taskIds }),
  exportTasks: (params) => api.get('/tasks/export', { params, responseType: 'blob' }),
  getDealsByContact: (contactId) => api.get(`/tasks/deals`, { params: { contact_id: contactId } }),
  getQuotesByContact: (contactId) => api.get(`/tasks/quotes`, { params: { contact_id: contactId } }),
}

// Campaigns API endpoints
export const campaignsAPI = {
  getCampaigns: (params = {}) => api.get('/campaigns', { params }),
  getCampaign: (id) => api.get(`/campaigns/${id}`),
  createCampaign: (data) => api.post('/campaigns', data),
  updateCampaign: (id, data) => api.put(`/campaigns/${id}`, data),
  patchCampaign: (id, data) => api.patch(`/campaigns/${id}`, data),
  deleteCampaign: (id) => {
    const url = `/campaigns/${id}`
    console.debug('[Templates][Delete][API] sending', { method: 'delete', url })
    return api.delete(url).then((res) => {
      console.debug('[Templates][Delete][API] response', { status: res?.status })
      return res
    })
  },
  // Backward compatible: sendCampaign now accepts optional data (e.g., { schedule_at })
  sendCampaign: (id, data) => api.post(`/campaigns/${id}/send`, data),
  // Deprecated on backend, kept for backward compatibility in older UIs
  scheduleCampaign: (id, scheduledAt) => api.post(`/campaigns/${id}/schedule`, { scheduled_at: scheduledAt }),
  pauseCampaign: (id) => api.post(`/campaigns/${id}/pause`),
  resumeCampaign: (id) => api.post(`/campaigns/${id}/resume`),
  getCampaignMetrics: (id, params = {}) => api.get(`/campaigns/${id}/metrics`, { params }),
  getTemplates: () => api.get('/campaigns/templates'),
  getTemplate: (id) => api.get(`/campaigns/templates/${id}`),
  createTemplate: (data) => api.post('/campaigns/templates', data),
  updateTemplate: (id, data) => api.put(`/campaigns/templates/${id}`, data),
  deleteTemplate: (id) => api.delete(`/campaigns/templates/${id}`),
  instantiateTemplate: (id, overrides = {}) => api.post(`/campaigns/templates/${id}/instantiate`, overrides),
  previewTemplate: (data) => api.post('/templates/preview', data),
  updateTemplateContent: (data) => api.put('/templates/update-content', data),
  duplicateCampaign: (id) => api.post(`/campaigns/${id}/duplicate`),
  getRecipients: (id) => api.get(`/campaigns/${id}/recipients`),
  addRecipient: (id, recipientData) => api.post(`/campaigns/${id}/recipients`, recipientData),
  removeRecipient: (id, recipientId) => api.delete(`/campaigns/${id}/recipients/${recipientId}`),
  getCampaignAuditLogs: (id, params = {}) => api.get('/audit-logs', { params: { campaign_id: id, ...params } }),
  
  // ============= NEW MISSING ENDPOINTS =============
  
  // Campaign Enhancements
  testCampaign: (id, data = {}) => api.post(`/campaigns/${id}/test`, data),
  previewCampaign: (id) => api.get(`/campaigns/${id}/preview`),
  validateCampaign: (id) => api.post(`/campaigns/${id}/validate`),
  unscheduleCampaign: (id) => api.post(`/campaigns/${id}/unschedule`),
  archiveCampaign: (id) => api.post(`/campaigns/${id}/archive`),
  restoreCampaign: (id) => api.post(`/campaigns/${id}/restore`),
  
  // Bulk Operations
  bulkSendCampaigns: (campaignIds, data = {}) => api.post('/campaigns/bulk-send', { campaign_ids: campaignIds, ...data }),
  bulkPauseCampaigns: (campaignIds) => api.post('/campaigns/bulk-pause', { campaign_ids: campaignIds }),
  bulkResumeCampaigns: (campaignIds) => api.post('/campaigns/bulk-resume', { campaign_ids: campaignIds }),
  bulkArchiveCampaigns: (campaignIds) => api.post('/campaigns/bulk-archive', { campaign_ids: campaignIds }),
  
  // Import/Export
  exportCampaigns: (params = {}) => api.get('/campaigns/export', { params, responseType: 'blob' }),
  importCampaigns: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/campaigns/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  // Ad Integration
  attachAdsToCampaign: (id, adData) => api.post(`/campaigns/${id}/ads`, adData),
  getCampaignAdsMetrics: (id, params = {}) => api.get(`/campaigns/${id}/ads-metrics`, { params }),
  
  // Analytics Integration
  getCampaignAnalytics: (params = {}) => api.get('/analytics/campaigns', { params })
}

// Forms API endpoints
export const formsAPI = {
  getForms: (params = {}) => api.get('/forms', { params }),
  getForm: (id) => api.get(`/forms/${id}`),
  createForm: (data) => api.post('/forms', data),
  updateForm: (id, data) => api.put(`/forms/${id}`, data),
  deleteForm: (id) => api.delete(`/forms/${id}`),
  getFormSubmissions: (id, params = {}) => api.get(`/forms/${id}/submissions`, { params }),
  getFormSubmission: (formId, submissionId) => api.get(`/forms/${formId}/submissions/${submissionId}`),
  getPublicForm: (id) => api.get(`/public/forms/${id}`),
  submitPublicForm: (id, data) => api.post(`/public/forms/${id}/submit`, data),
  reprocessSubmission: (formId, submissionId) => api.post(`/forms/${formId}/submissions/${submissionId}/reprocess`),
  // Form Settings
  getFormSettings: (id) => api.get(`/forms/${id}/settings`),
  updateFormSettings: (id, data) => api.put(`/forms/${id}/settings`, data),
  // Form Field Mapping
  getFormFieldMapping: (id) => api.get(`/forms/${id}/mapping`),
  updateFormFieldMapping: (id, data) => api.put(`/forms/${id}/mapping`, data),
  // Contact Form Submissions
  getContactFormSubmissions: (contactId) => api.get(`/contacts/${contactId}/form-submissions`),
  checkDuplicateName: (name, excludeId = null) => {
    const params = { name, exclude_id: excludeId }
    return api.get('/forms/check-duplicate', { params })
  },
}

// Lists/Segments API endpoints
export const listsAPI = {
  getLists: (params = {}) => api.get('/lists', { params }),
  getList: (id) => api.get(`/lists/${id}`),
  createList: (data) => api.post('/lists', data),
  updateList: (id, data) => api.put(`/lists/${id}`, data),
  deleteList: (id) => api.delete(`/lists/${id}`),
  getListMembers: (id, params = {}) => api.get(`/lists/${id}/members`, { params }),
  addListMember: (id, data) => api.post(`/lists/${id}/members`, data),
  removeListMember: (id, contactId) => api.delete(`/lists/${id}/members/${contactId}`),
  checkDuplicateName: (name, type, excludeId = null) => {
    const params = { name, type, exclude_id: excludeId }
    return api.get('/lists/check-duplicate', { params })
  },
}

// Quotes/CPQ API endpoints
export const quotesAPI = {
  getQuotes: (params = {}) => api.get('/quotes', { params }),
  getQuote: (id) => api.get(`/quotes/${id}`),
  createQuote: (data) => api.post('/quotes', data),
  updateQuote: (id, data) => api.put(`/quotes/${id}`, data),
  deleteQuote: (id) => api.delete(`/quotes/${id}`),
  sendQuote: (id, data = {}) => api.post(`/quotes/${id}/send`, data),
  acceptQuote: (id, data = {}) => api.post(`/quotes/${id}/accept`, data),
  rejectQuote: (id, data = {}) => api.post(`/quotes/${id}/reject`, data),
  downloadPdf: (id) => api.get(`/quotes/${id}/pdf`, { responseType: 'blob' }),
  // Preview prices with currency conversion
  previewPrices: (data) => api.post('/quotes/preview-prices', data),
  // Products
  getProducts: (params = {}) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  // Templates
  getTemplates: (params = {}) => api.get('/quote-templates', { params }),
  getTemplate: (id) => api.get(`/quote-templates/${id}`),
  createTemplate: (data) => api.post('/quote-templates', data),
  updateTemplate: (id, data) => api.put(`/quote-templates/${id}`, data),
  deleteTemplate: (id) => api.delete(`/quote-templates/${id}`),
  previewTemplate: (id) => api.get(`/quote-templates/${id}/preview`, { responseType: 'blob' }),
}

// Exchange Rates API endpoints
export const exchangeRatesAPI = {
  getRate: (fromCurrency, toCurrency) => api.get('/exchange-rates/rate', {
    params: { from_currency: fromCurrency, to_currency: toCurrency }
  }),
  refreshRate: (fromCurrency, toCurrency) => api.post('/exchange-rates/refresh', {
    from_currency: fromCurrency,
    to_currency: toCurrency
  }),
}

// Users API endpoints
export const usersAPI = {
  getUsers: (params = {}) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  getUsersForAssignment: (params = {}) => api.get('/users/for-assignment', { params }),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getCurrentUser: () => api.get('/users/me'),
  getRoles: () => api.get('/roles'),
}

// Search API endpoints
export const searchAPI = {
  globalSearch: (query, types = 'contacts,companies,deals', limit = 10) => 
    api.get('/search', { params: { q: query, types, limit } }),
}

// Sequences API endpoints
export const sequencesAPI = {
  list: (params = {}) => api.get('/sequences', { params }),
  get: (id) => api.get(`/sequences/${id}`),
  create: (data) => api.post('/sequences', data),
  update: (id, data) => api.put(`/sequences/${id}`, data),
  remove: (id) => api.delete(`/sequences/${id}`),
  addStep: (id, data) => api.post(`/sequences/${id}/steps`, data),
  updateStep: (id, data) => api.put(`/sequences/steps/${id}`, data),
  deleteStep: (id) => api.delete(`/sequences/steps/${id}`),
  enroll: (id, data) => api.post(`/sequences/${id}/enroll`, data),
  pause: (id) => api.post(`/sequences/enrollments/${id}/pause`),
  resume: (id) => api.post(`/sequences/enrollments/${id}/resume`),
  cancel: (id) => api.post(`/sequences/enrollments/${id}/cancel`),
  logs: (id) => api.get(`/sequences/${id}/logs`),
}

// Analytics API endpoints
export const analyticsAPI = {
  // Configuration endpoints
  getModules: () => api.get('/analytics/modules'),
  getPeriods: () => api.get('/analytics/periods'),
  
  // Dashboard endpoint
  getDashboard: (params = {}) => api.get('/analytics/dashboard', { params }),
  
  // Module-specific analytics
  getContactsAnalytics: (params = {}) => api.get('/analytics/contacts', { params }),
  getCompaniesAnalytics: (params = {}) => api.get('/analytics/companies', { params }),
  getDealsAnalytics: (params = {}) => api.get('/analytics/deals', { params }),
  getCampaignsAnalytics: (params = {}) => api.get('/analytics/campaigns', { params }),
  getAdsAnalytics: (params = {}) => api.get('/analytics/ads', { params }),
  getEventsAnalytics: (params = {}) => api.get('/analytics/events', { params }),
  getMeetingsAnalytics: (params = {}) => api.get('/analytics/meetings', { params }),
  getTasksAnalytics: (params = {}) => api.get('/analytics/tasks', { params }),
  getForecastAnalytics: (params = {}) => api.get('/analytics/forecast', { params }),
  getLeadScoringAnalytics: (params = {}) => api.get('/analytics/lead-scoring', { params }),
  getJourneysAnalytics: (params = {}) => api.get('/analytics/journeys', { params }),
  getVisitorIntentAnalytics: (params = {}) => api.get('/analytics/visitor-intent', { params }),
  
  // Generic module endpoint
  getModuleAnalytics: (module, params = {}) => api.get(`/analytics/${module}`, { params }),
  
  // Export & Reports
  exportAnalytics: (params = {}) => api.get('/analytics/export', { params, responseType: 'blob' }),
  generateReport: (data) => api.post('/analytics/reports', data),
  scheduleReport: (data) => api.post('/analytics/schedule-report', data),
  getScheduledReports: (params = {}) => api.get('/analytics/scheduled-reports', { params }),
  deleteScheduledReport: (id) => api.delete(`/analytics/scheduled-reports/${id}`),
  updateScheduledReport: (id, data) => api.put(`/analytics/scheduled-reports/${id}`, data),
}

// Tracking/Visitor Intent API endpoints
export const trackingAPI = {
  // Visitor intent tracking
  getIntentData: (params = {}) => api.get('/tracking/intent', { params }),
  getTrackingAnalytics: (params = {}) => api.get('/tracking/analytics', { params }),
  getActions: (params = {}) => api.get('/tracking/actions', { params }),
  getIntentLevels: () => api.get('/tracking/intent-levels'),
  getVisitorIntentAnalytics: (params = {}) => api.get('/tracking/visitor-intent-analytics', { params }),
  
  // Track events
  trackEvent: (data) => api.post('/tracking/events', data),
  trackPageView: (data) => api.post('/tracking/page-views', data),
}

// Commerce Platform API endpoints
export const commerceAPI = {
  // Orders API endpoints
  getOrders: (params = {}) => api.get('/commerce/orders', { params }),
  getOrder: (id) => api.get(`/commerce/orders/${id}`),
  createOrder: (data) => api.post('/commerce/orders', data),
  updateOrder: (id, data) => api.put(`/commerce/orders/${id}`, data),
  deleteOrder: (id) => api.delete(`/commerce/orders/${id}`),
  getOrderStats: () => api.get('/commerce/orders/stats'),
  
  // Payment Links API endpoints
  getPaymentLinks: (params = {}) => api.get('/commerce/payment-links', { params }),
  getPaymentLink: (id) => api.get(`/commerce/payment-links/${id}`),
  createPaymentLink: (data) => api.post('/commerce/payment-links', data),
  updatePaymentLink: (id, data) => api.put(`/commerce/payment-links/${id}`, data),
  deletePaymentLink: (id) => api.delete(`/commerce/payment-links/${id}`),
  activatePaymentLink: (id) => api.post(`/commerce/payment-links/${id}/activate`),
  deactivatePaymentLink: (id) => api.post(`/commerce/payment-links/${id}/deactivate`),
  completePaymentLink: (id) => api.post(`/commerce/payment-links/${id}/complete`),
  sendPaymentLinkEmail: (id, data) => api.post(`/commerce/payment-links/${id}/send-email`, data),
  sendBulkPaymentLinkEmails: (data) => api.post('/commerce/payment-links/send-bulk-emails', data),
  
  // Settings API endpoints
  getSettings: () => api.get('/commerce/settings'),
  updateSettings: (data) => api.post('/commerce/settings', data),
  testConnection: () => api.post('/commerce/settings/test-connection'),
  resetSettings: () => api.post('/commerce/settings/reset'),
  sendTestEmail: (data) => api.post('/commerce/settings/send-test-email', data),
  
  // Analytics endpoints
  getCommerceAnalytics: (params = {}) => api.get('/commerce/analytics', { params }),
  getRevenueChart: (params = {}) => api.get('/commerce/analytics/revenue', { params }),
  
  // Subscription Plans API endpoints
  getSubscriptionPlans: (params = {}) => api.get('/commerce/subscription-plans', { params }),
  createSubscriptionPlan: (data) => api.post('/commerce/subscription-plans', data),
  updateSubscriptionPlan: (id, data) => api.put(`/commerce/subscription-plans/${id}`, data),
  deleteSubscriptionPlan: (id) => api.delete(`/commerce/subscription-plans/${id}`),
  
  // Subscriptions API endpoints
  getSubscriptions: (params = {}) => api.get('/commerce/subscriptions', { params }),
  getSubscription: (id) => api.get(`/commerce/subscriptions/${id}`),
  getSubscriptionActivity: (id) => api.get(`/commerce/subscriptions/${id}/activity`),
  cancelSubscription: (id, data) => api.post(`/commerce/subscriptions/${id}/cancel`, data),
  changePlan: (id, data) => api.post(`/commerce/subscriptions/${id}/change-plan`, data),
  openPortal: (id) => api.post(`/commerce/subscriptions/${id}/portal`),
  
  // Public checkout endpoints
  createCheckoutSession: (data) => api.post('/public/commerce/checkout/create-subscription-session', data),
  getCheckoutSession: (sessionId) => api.get(`/public/commerce/checkout/session/${sessionId}`),
  
  // Branding API endpoints
  getBranding: () => api.get('/commerce/branding'),
  updateBranding: (data) => {
    // Check if data is FormData (for file uploads)
    if (data instanceof FormData) {
      return api.put('/commerce/branding', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
    // Regular JSON data
    return api.put('/commerce/branding', data)
  },
  resetBranding: () => api.post('/commerce/branding/reset'),
  
  // Invoice API endpoints
  viewInvoicePDF: (invoiceId) => api.get(`/commerce/invoices/${invoiceId}/preview`),
  downloadInvoicePDF: (invoiceId) => api.get(`/commerce/invoices/${invoiceId}/download`, { responseType: 'blob' }),
  sendInvoiceEmail: (invoiceId) => api.post(`/commerce/invoices/${invoiceId}/send-email`),
}

// CMS / Content Platform API endpoints
export const cmsAPI = {
  // Pages Management
  getPages: (params = {}) => api.get('/cms/pages', { params }),
  getPage: (id) => api.get(`/cms/pages/${id}`),
  createPage: (data) => api.post('/cms/pages', data),
  updatePage: (id, data) => api.put(`/cms/pages/${id}`, data),
  deletePage: (id) => api.delete(`/cms/pages/${id}`),
  publishPage: (id) => api.post(`/cms/pages/${id}/publish`),
  unpublishPage: (id) => api.post(`/cms/pages/${id}/unpublish`),
  duplicatePage: (id) => api.post(`/cms/pages/${id}/duplicate`),
  archivePage: (id) => api.post(`/cms/pages/${id}/archive`),
  restorePage: (id) => api.post(`/cms/pages/${id}/restore`),
  getPageVersions: (id, params = {}) => api.get(`/cms/pages/${id}/versions`, { params }),
  restorePageVersion: (id, versionId) => api.post(`/cms/pages/${id}/versions/${versionId}/restore`),
  getPageAnalytics: (id, params = {}) => api.get(`/cms/pages/${id}/analytics`, { params }),
  previewPage: (id) => api.get(`/cms/pages/${id}/preview`),
 
  // Templates Management
  getTemplates: (params = {}) => api.get('/cms/templates', { params }),
  getTemplate: (id) => api.get(`/cms/templates/${id}`),
  createTemplate: (data) => api.post('/cms/templates', data),
  updateTemplate: (id, data) => api.put(`/cms/templates/${id}`, data),
  deleteTemplate: (id) => api.delete(`/cms/templates/${id}`),
  duplicateTemplate: (id) => api.post(`/cms/templates/${id}/duplicate`),
  publishTemplate: (id) => api.post(`/cms/templates/${id}/publish`),
  unpublishTemplate: (id) => api.post(`/cms/templates/${id}/unpublish`),
  getTemplatePreview: (id) => api.get(`/cms/templates/${id}/preview`),
  useTemplate: (id, data = {}) => api.post(`/cms/templates/${id}/use`, data),
 
  // SEO Tools
  analyzeSeo: (data) => api.post('/cms/seo/analyze', data),
  getSeoSuggestions: (pageId) => api.get(`/cms/seo/suggestions/${pageId}`),
  getSeoScore: (pageId) => api.get(`/cms/seo/score/${pageId}`),
  optimizeSeo: (pageId, data) => api.post(`/cms/seo/optimize/${pageId}`, data),
  bulkAnalyzeSeo: (data) => api.post('/cms/seo/bulk-analyze', data),
  getSeoReport: (params = {}) => api.get('/cms/seo/report', { params }),
  exportSeoReport: (params = {}) => api.get('/cms/seo/export', { params, responseType: 'blob' }),
 
  // Personalization & Smart Content
  getPersonalizationRules: (pageId) => api.get(`/cms/personalization/${pageId}`),
  createPersonalizationRule: (data) => api.post('/cms/personalization', data),
  updatePersonalizationRule: (id, data) => api.put(`/cms/personalization/${id}`, data),
  deletePersonalizationRule: (id) => api.delete(`/cms/personalization/${id}`),
  togglePersonalizationRule: (id) => api.post(`/cms/personalization/${id}/toggle`),
  testPersonalizationRule: (id, data) => api.post(`/cms/personalization/${id}/test`, data),
  getPersonalizationAnalytics: (id, params = {}) => api.get(`/cms/personalization/${id}/analytics`, { params }),
 
  // A/B Testing (Adaptive Testing)
  getAbTests: (params = {}) => api.get('/cms/abtesting', { params }),
  getAbTest: (id) => api.get(`/cms/abtesting/${id}`),
  createAbTest: (data) => api.post('/cms/abtesting', data),
  updateAbTest: (id, data) => api.put(`/cms/abtesting/${id}`, data),
  deleteAbTest: (id) => api.delete(`/cms/abtesting/${id}`),
  startAbTest: (id) => api.post(`/cms/abtesting/${id}/start`),
  stopAbTest: (id) => api.post(`/cms/abtesting/${id}/stop`),
  setAbTestWinner: (id) => api.post(`/cms/abtesting/${id}/winner`),
  getAbTestResults: (id) => api.get(`/cms/abtesting/${id}/results`),
  getAbTestAnalytics: (id, params = {}) => api.get(`/cms/abtesting/${id}/analytics`, { params }),
 
  // Memberships & Access Control
  getMemberships: (params = {}) => api.get('/cms/memberships', { params }),
  getMembership: (id) => api.get(`/cms/memberships/${id}`),
  createMembership: (data) => api.post('/cms/memberships', data),
  updateMembership: (id, data) => api.put(`/cms/memberships/${id}`, data),
  deleteMembership: (id) => api.delete(`/cms/memberships/${id}`),
  getMembershipMembers: (id, params = {}) => api.get(`/cms/memberships/${id}/members`, { params }),
  addMembershipMember: (id, data) => api.post(`/cms/memberships/${id}/members`, data),
  removeMembershipMember: (id, memberId) => api.delete(`/cms/memberships/${id}/members/${memberId}`),
  getMembershipPages: (id, params = {}) => api.get(`/cms/memberships/${id}/pages`, { params }),
  assignPageToMembership: (id, pageId) => api.post(`/cms/memberships/${id}/pages/${pageId}`),
  removePageFromMembership: (id, pageId) => api.delete(`/cms/memberships/${id}/pages/${pageId}`),
 
  // Domains Management
  getDomains: (params = {}) => api.get('/cms/domains', { params }),
  getDomain: (id) => api.get(`/cms/domains/${id}`),
  createDomain: (data) => api.post('/cms/domains', data),
  updateDomain: (id, data) => api.put(`/cms/domains/${id}`, data),
  deleteDomain: (id) => api.delete(`/cms/domains/${id}`),
  setPrimaryDomain: (id) => api.post(`/cms/domains/${id}/set-primary`),
  verifyDomain: (id) => api.post(`/cms/domains/${id}/verify`),
  getDomainDnsRecords: (id) => api.get(`/cms/domains/${id}/dns`),
  enableDomainSsl: (id) => api.post(`/cms/domains/${id}/enable-ssl`),
 
  // Languages & Localization
  getLanguages: (params = {}) => api.get('/cms/languages', { params }),
  getLanguage: (code) => api.get(`/cms/languages/${code}`),
  createLanguage: (data) => api.post('/cms/languages', data),
  updateLanguage: (code, data) => api.put(`/cms/languages/${code}`, data),
  deleteLanguage: (code) => api.delete(`/cms/languages/${code}`),
  setDefaultLanguage: (code) => api.post(`/cms/languages/${code}/set-default`),
  translatePage: (pageId, targetLanguage) => api.post(`/cms/pages/${pageId}/translate`, { target_language: targetLanguage }),
  getTranslations: (pageId, params = {}) => api.get(`/cms/pages/${pageId}/translations`, { params }),
 
  // Media Library
  getMedia: (params = {}) => api.get('/cms/media', { params }),
  uploadMedia: (file, data = {}) => {
    const formData = new FormData()
    formData.append('file', file)
    Object.keys(data).forEach(key => formData.append(key, data[key]))
    return api.post('/cms/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  deleteMedia: (id) => api.delete(`/cms/media/${id}`),
  updateMediaMetadata: (id, data) => api.put(`/cms/media/${id}`, data),
  getMediaFolders: () => api.get('/cms/media/folders'),
  createMediaFolder: (data) => api.post('/cms/media/folders', data),
 
  // Forms (CMS-specific forms, distinct from marketing forms)
  getCmsForms: (params = {}) => api.get('/cms/forms', { params }),
  getCmsForm: (id) => api.get(`/cms/forms/${id}`),
  createCmsForm: (data) => api.post('/cms/forms', data),
  updateCmsForm: (id, data) => api.put(`/cms/forms/${id}`, data),
  deleteCmsForm: (id) => api.delete(`/cms/forms/${id}`),
  getCmsFormSubmissions: (id, params = {}) => api.get(`/cms/forms/${id}/submissions`, { params }),
  exportCmsFormSubmissions: (id, params = {}) => api.get(`/cms/forms/${id}/submissions/export`, { params, responseType: 'blob' }),
 
  // Navigation & Menus
  getMenus: (params = {}) => api.get('/cms/menus', { params }),
  getMenu: (id) => api.get(`/cms/menus/${id}`),
  createMenu: (data) => api.post('/cms/menus', data),
  updateMenu: (id, data) => api.put(`/cms/menus/${id}`, data),
  deleteMenu: (id) => api.delete(`/cms/menus/${id}`),
  reorderMenuItems: (id, items) => api.post(`/cms/menus/${id}/reorder`, { items }),
 
  // Site Settings
  getSiteSettings: () => api.get('/cms/settings'),
  updateSiteSettings: (data) => api.put('/cms/settings', data),
  getSiteSeoSettings: () => api.get('/cms/settings/seo'),
  updateSiteSeoSettings: (data) => api.put('/cms/settings/seo', data),
  getSiteAnalytics: (params = {}) => api.get('/cms/analytics', { params }),
 
  // Content Blocks (Reusable Components)
  getContentBlocks: (params = {}) => api.get('/cms/content-blocks', { params }),
  getContentBlock: (id) => api.get(`/cms/content-blocks/${id}`),
  createContentBlock: (data) => api.post('/cms/content-blocks', data),
  updateContentBlock: (id, data) => api.put(`/cms/content-blocks/${id}`, data),
  deleteContentBlock: (id) => api.delete(`/cms/content-blocks/${id}`),
 
  // Redirects & URL Management
  getRedirects: (params = {}) => api.get('/cms/redirects', { params }),
  createRedirect: (data) => api.post('/cms/redirects', data),
  updateRedirect: (id, data) => api.put(`/cms/redirects/${id}`, data),
  deleteRedirect: (id) => api.delete(`/cms/redirects/${id}`),
  bulkImportRedirects: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/cms/redirects/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
 
  // Bulk Operations
  bulkPublishPages: (pageIds) => api.post('/cms/pages/bulk-publish', { page_ids: pageIds }),
  bulkUnpublishPages: (pageIds) => api.post('/cms/pages/bulk-unpublish', { page_ids: pageIds }),
  bulkDeletePages: (pageIds) => api.post('/cms/pages/bulk-delete', { page_ids: pageIds }),
  bulkArchivePages: (pageIds) => api.post('/cms/pages/bulk-archive', { page_ids: pageIds }),
 
  // Export & Import
  exportPages: (params = {}) => api.get('/cms/pages/export', { params, responseType: 'blob' }),
  importPages: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/cms/pages/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  exportSite: (params = {}) => api.get('/cms/export', { params, responseType: 'blob' }),
  importSite: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/cms/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
 
  // Webhooks
  getWebhooks: (params = {}) => api.get('/cms/webhooks', { params }),
  createWebhook: (data) => api.post('/cms/webhooks', data),
  updateWebhook: (id, data) => api.put(`/cms/webhooks/${id}`, data),
  deleteWebhook: (id) => api.delete(`/cms/webhooks/${id}`),
  testWebhook: (id) => api.post(`/cms/webhooks/${id}/test`),
  getWebhookLogs: (id, params = {}) => api.get(`/cms/webhooks/${id}/logs`, { params }),
}

export default api