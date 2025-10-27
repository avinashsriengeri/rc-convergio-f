import api from '../../../services/api'

export const liveChatAPI = {
  // Integration API (for getting widget snippet)
  getLiveChatSnippet: () => api.get('/integration/livechat-snippet'),

  // Public Live Chat APIs (no auth required)
  createConversation: (data) => api.post('/livechat/conversations', data),
  sendMessage: (conversationId, data) => api.post(`/livechat/conversations/${conversationId}/messages`, data),
  getConversation: (conversationId) => api.get(`/livechat/conversations/${conversationId}`),

  // Agent Live Chat APIs (auth required)
  getConversations: (params = {}) => api.get('/service/livechat/conversations', { params }),
  getConversationDetails: (conversationId) => api.get(`/service/livechat/conversations/${conversationId}`),
  sendAgentMessage: (conversationId, data) => api.post(`/service/livechat/conversations/${conversationId}/messages`, data),
  assignConversation: (conversationId, data) => api.post(`/service/livechat/conversations/${conversationId}/assign`, data),
  closeConversation: (conversationId) => api.post(`/service/livechat/conversations/${conversationId}/close`),
  markAsRead: (conversationId) => api.post(`/service/livechat/conversations/${conversationId}/mark-read`),
  getLiveChatStats: () => api.get('/service/livechat/stats'),

  // Conversation management
  updateConversationStatus: (conversationId, data) => api.put(`/service/livechat/conversations/${conversationId}`, data),
  getConversationHistory: (conversationId) => api.get(`/service/livechat/conversations/${conversationId}/history`),
  
  // Agent management
  getAvailableAgents: () => api.get('/service/livechat/agents'),
  updateAgentStatus: (data) => api.post('/service/livechat/agents/status', data),

  // Analytics
  getConversationAnalytics: (params = {}) => api.get('/service/livechat/analytics', { params }),
  getAgentPerformance: (params = {}) => api.get('/service/livechat/agent-performance', { params })
}
