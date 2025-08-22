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
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle auth errors and token refresh
api.interceptors.response.use(
  (response) => response,
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
}

// Tasks API endpoints
export const tasksAPI = {
  getTasks: (params = {}) => api.get('/tasks', { params }),
  getTask: (id) => api.get(`/tasks/${id}`),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  completeTask: (id) => api.post(`/tasks/${id}/complete`),
}

// Deals API endpoints
export const dealsAPI = {
  getDeals: (params = {}) => api.get('/deals', { params }),
  getDeal: (id) => api.get(`/deals/${id}`),
  createDeal: (data) => api.post('/deals', data),
  updateDeal: (id, data) => api.put(`/deals/${id}`, data),
  deleteDeal: (id) => api.delete(`/deals/${id}`),
  getStages: () => api.get('/deals/stages'),
}

// Campaigns API endpoints
export const campaignsAPI = {
  getCampaigns: (params = {}) => api.get('/campaigns', { params }),
  getCampaign: (id) => api.get(`/campaigns/${id}`),
  createCampaign: (data) => api.post('/campaigns', data),
  updateCampaign: (id, data) => api.put(`/campaigns/${id}`, data),
  deleteCampaign: (id) => api.delete(`/campaigns/${id}`),
}

export default api
