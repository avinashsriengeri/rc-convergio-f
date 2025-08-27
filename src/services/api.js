import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor - add auth token and tenant ID
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    config.headers['X-Tenant-ID'] = localStorage.getItem('tenant_id') || '1'
    
    // Debug logging
    console.log('API Request:', {
      method: config.method,
      url: config.baseURL + config.url,
      headers: config.headers,
      params: config.params
    })
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle auth errors and token refresh
api.interceptors.response.use(
  (response) => {
    // Debug logging for successful responses
    console.log('API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    })
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      // Clear stored auth data
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      localStorage.removeItem('tenant_id')
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    // Debug logging for errors
    console.error('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    })

    // Handle 422 Validation errors
    if (error.response?.status === 422) {
      // Validation errors are handled by components
      return Promise.reject(error)
    }

    // Handle 500 Server errors
    if (error.response?.status >= 500) {
      console.error('Server Error:', error.response?.data)
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
}

// Dashboard API endpoints
export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
  getDealsSummary: (range = '7d') => api.get(`/deals/summary?range=${range}`),
  getTodayTasks: () => api.get('/tasks/today'),
  getRecentContacts: (limit = 5) => api.get(`/contacts/recent?limit=${limit}`),
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
  searchContacts: (query, params = {}) => api.get('/contacts/search', { 
    params: { q: query, ...params } 
  }),
  importCSV: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/contacts/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  getImportStatus: (jobId) => api.get(`/contacts/import/status/${jobId}`),
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
  searchCompanies: (query, params = {}) => api.get('/companies/search', { 
    params: { q: query, ...params } 
  }),
  checkDuplicates: (data) => api.post('/companies/check-duplicates', data),
  bulkCreate: (data) => api.post('/companies/bulk-create', data),
  importCSV: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/companies/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  getImportStatus: (jobId) => api.get(`/companies/import/status/${jobId}`),
  attachContact: (companyId, contactId) => api.post(`/companies/${companyId}/contacts`, { contact_ids: [contactId] }),
  detachContact: (companyId, contactId) => api.delete(`/companies/${companyId}/contacts/${contactId}`),
  getCompanyContacts: (companyId) => api.get(`/companies/${companyId}/contacts`),
  getActivityLog: (companyId) => api.get(`/companies/${companyId}/activity-log`),
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
  moveDeal: (id, stageId) => api.patch(`/deals/${id}/move`, { stage_id: stageId }),
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
  bulkUpdate: (taskIds, data) => api.patch('/tasks/bulk-update', { task_ids: taskIds, ...data }),
  bulkComplete: (taskIds) => api.post('/tasks/bulk-complete', { task_ids: taskIds }),
}

// Campaigns API endpoints
export const campaignsAPI = {
  getCampaigns: (params = {}) => api.get('/campaigns', { params }),
  getCampaign: (id) => api.get(`/campaigns/${id}`),
  createCampaign: (data) => api.post('/campaigns', data),
  updateCampaign: (id, data) => api.put(`/campaigns/${id}`, data),
  deleteCampaign: (id) => api.delete(`/campaigns/${id}`),
  sendCampaign: (id) => api.post(`/campaigns/${id}/send`),
  scheduleCampaign: (id, scheduledAt) => api.post(`/campaigns/${id}/schedule`, { scheduled_at: scheduledAt }),
  pauseCampaign: (id) => api.post(`/campaigns/${id}/pause`),
  resumeCampaign: (id) => api.post(`/campaigns/${id}/resume`),
  getCampaignMetrics: (id) => api.get(`/campaigns/${id}/metrics`),
  getCampaignRecipients: (id, params = {}) => api.get(`/campaigns/${id}/recipients`, { params }),
  addRecipients: (id, recipientIds) => api.post(`/campaigns/${id}/recipients`, { recipient_ids: recipientIds }),
  removeRecipients: (id, recipientIds) => api.delete(`/campaigns/${id}/recipients`, { data: { recipient_ids: recipientIds } }),
  getCampaignEvents: (id) => api.get(`/campaigns/${id}/events`),
  getWebhookEvents: (params = {}) => api.get('/campaigns/events', { params }),
  getCampaignTemplates: () => api.get('/campaigns/templates'),
  duplicateCampaign: (id) => api.post(`/campaigns/${id}/duplicate`),
}

export default api
