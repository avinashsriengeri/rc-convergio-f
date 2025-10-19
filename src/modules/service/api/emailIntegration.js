import api from '../../../services/api'

export const emailIntegrationAPI = {
  // Get all email integrations
  getIntegrations: () => api.get('/service/email/integrations'),

  // Create new email integration
  createIntegration: (data) => api.post('/service/email/integrations', data),

  // Update email integration
  updateIntegration: (id, data) => api.put(`/service/email/integrations/${id}`, data),

  // Delete email integration
  deleteIntegration: (id) => api.delete(`/service/email/integrations/${id}`),

  // Connect Gmail account
  connectGmail: (id) => api.post(`/service/email/integrations/${id}/connect`),

  // Test email integration
  testIntegration: (id) => api.post(`/service/email/integrations/${id}/test`),

  // Get integration status
  getIntegrationStatus: (id) => api.get(`/service/email/integrations/${id}/status`),

  // Sync emails manually
  syncEmails: (id) => api.post(`/service/email/integrations/${id}/sync`),

  // Get integration logs
  getIntegrationLogs: (id, params = {}) => api.get(`/service/email/integrations/${id}/logs`, { params }),

  // Disconnect integration
  disconnectIntegration: (id) => api.post(`/service/email/integrations/${id}/disconnect`),

  // Get email providers
  getEmailProviders: () => api.get('/service/email/providers'),

  // Get integration statistics
  getIntegrationStats: (id) => api.get(`/service/email/integrations/${id}/stats`)
}
