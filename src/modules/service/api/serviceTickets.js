import api from '@/services/api'

// Service Tickets API endpoints
export const serviceTicketsAPI = {
  // Get all tickets with optional filters
  getTickets: (params = {}) => api.get('/service/tickets', { params }),
  
  // Get a specific ticket by ID
  getTicket: (id) => api.get(`/service/tickets/${id}`),
  
  // Create a new ticket
  createTicket: (data) => api.post('/service/tickets', data),
  
  // Update an existing ticket
  updateTicket: (id, data) => api.put(`/service/tickets/${id}`, data),
  
  // Add a message/reply to a ticket
  addMessage: (id, data) => api.post(`/service/tickets/${id}/messages`, data),
  
  // Close a ticket with optional reason
  closeTicket: (id, reason = '') => api.post(`/service/tickets/${id}/close`, { reason }),
  
  // Reopen a closed ticket
  reopenTicket: (id) => api.post(`/service/tickets/${id}/reopen`),
  
  // Assign ticket to an agent
  assignTicket: (id, assigneeId) => api.post(`/service/tickets/${id}/assign`, { assignee_id: assigneeId }),
  
  // Update ticket priority
  updatePriority: (id, priority) => api.patch(`/service/tickets/${id}/priority`, { priority }),
  
  // Update ticket status
  updateStatus: (id, status) => api.patch(`/service/tickets/${id}/status`, { status }),
  
  // Get ticket statistics/overview
  getStats: () => api.get('/service/tickets/stats/overview'),
  
  // Get tickets by status
  getTicketsByStatus: (status, params = {}) => api.get(`/service/tickets/status/${status}`, { params }),
  
  // Get tickets by priority
  getTicketsByPriority: (priority, params = {}) => api.get(`/service/tickets/priority/${priority}`, { params }),
  
  // Get tickets assigned to a specific agent
  getTicketsByAssignee: (assigneeId, params = {}) => api.get(`/service/tickets/assignee/${assigneeId}`, { params }),
  
  // Search tickets
  searchTickets: (query, params = {}) => api.get('/service/tickets/search', { params: { q: query, ...params } }),
  
  // Bulk operations
  bulkUpdate: (ticketIds, data) => api.patch('/service/tickets/bulk-update', { ticket_ids: ticketIds, ...data }),
  bulkAssign: (ticketIds, assigneeId) => api.post('/service/tickets/bulk-assign', { ticket_ids: ticketIds, assignee_id: assigneeId }),
  bulkClose: (ticketIds, reason = '') => api.post('/service/tickets/bulk-close', { ticket_ids: ticketIds, reason }),
  
  // Export tickets
  exportTickets: (params = {}) => api.get('/service/tickets/export', { params, responseType: 'blob' }),
  
  // Get ticket categories/types
  getCategories: () => api.get('/service/tickets/categories'),
  
  // Get ticket priorities
  getPriorities: () => api.get('/service/tickets/priorities'),
  
  // Get ticket statuses
  getStatuses: () => api.get('/service/tickets/statuses'),
  
  // Get SLA information for a ticket
  getSLA: (id) => api.get(`/service/tickets/${id}/sla`),
  
  // Get ticket activity log
  getActivityLog: (id) => api.get(`/service/tickets/${id}/activity-log`),
  
  // Add attachment to ticket
  addAttachment: (id, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`/service/tickets/${id}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  // Remove attachment from ticket
  removeAttachment: (id, attachmentId) => api.delete(`/service/tickets/${id}/attachments/${attachmentId}`),
  
  // Download attachment
  downloadAttachment: (id, attachmentId) => api.get(`/service/tickets/${id}/attachments/${attachmentId}`, { responseType: 'blob' }),

  // Survey & Feedback Analytics endpoints
  
  // Ticket Survey Integration
  getTicketSurvey: (id) => api.get(`/service/tickets/${id}/survey`),
  getTicketSurveyResponses: (id) => api.get(`/service/tickets/${id}/survey-responses`),
  getTicketSurveyStatus: (id) => api.get(`/service/tickets/${id}/survey-status`),
  
  // Enhanced Analytics
  getSurveySummary: () => api.get('/service/analytics/survey-summary'),
  getTicketsWithCSAT: (params = {}) => api.get('/service/analytics/tickets-with-csat', { params }),
  getCSATTrends: (params = {}) => api.get('/service/analytics/csat-trends', { params }),
  getAgentPerformance: (params = {}) => api.get('/service/analytics/agent-performance', { params }),
  
  // Survey Management
  getActiveSurveys: () => api.get('/service/surveys/active'),
  getPostTicketSurveys: () => api.get('/service/surveys/post-ticket'),
  sendSurveyReminder: (id) => api.post(`/service/surveys/${id}/send-reminder`)
}

export default serviceTicketsAPI

