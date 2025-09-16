import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    // Skip authentication for public form endpoints and auth endpoints
    const isPublicFormRequest = config.url?.includes('/public/forms/')
    const isAuthRequest = config.url?.includes('/auth/')
    
    if (!isPublicFormRequest && !isAuthRequest) {
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
      
      // Check if this is a public form request
      const isPublicFormRequest = originalRequest.url?.includes('/public/forms/')
      
      if (!isPublicFormRequest) {
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
  getOwners: () => api.get('/metadata/owners'),
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
  moveDeal: (id, stageId) => api.post(`/deals/${id}/move`, { stage_id: stageId }),
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
  duplicateCampaign: (id) => api.post(`/campaigns/${id}/duplicate`),
  getRecipients: (id) => api.get(`/campaigns/${id}/recipients`),
  addRecipient: (id, recipientData) => api.post(`/campaigns/${id}/recipients`, recipientData),
  removeRecipient: (id, recipientId) => api.delete(`/campaigns/${id}/recipients/${recipientId}`),
  getCampaignAuditLogs: (id, params = {}) => api.get('/audit-logs', { params: { campaign_id: id, ...params } })
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
  checkDuplicateName: (name, excludeId = null) => {
    const params = { name, exclude_id: excludeId }
    return api.get('/lists/check-duplicate', { params })
  },
}

// Users API endpoints
export const usersAPI = {
  getUsers: (params = {}) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
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

export default api