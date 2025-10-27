import api from './api'

// Copilot Service - Following existing service patterns
export const copilotService = {
  /**
   * Ask a question to the Copilot
   * @param {Object} params - Query parameters
   * @param {string} params.query - The user's question
   * @param {string} params.current_page - Current page path
   * @returns {Promise<Object>} Copilot response
   */
  askQuestion: ({ query, current_page }) => {
    return api.post('/copilot/ask', { query, current_page })
  },

  /**
   * Get available features
   * @returns {Promise<Array>} List of available features
   */
  getFeatures: () => {
    return api.get('/copilot/features')
  },

  /**
   * Get conversation history
   * @param {number} limit - Number of conversations to fetch
   * @returns {Promise<Array>} Conversation history
   */
  getHistory: (limit = 10) => {
    return api.get(`/copilot/history?limit=${limit}`)
  },

  /**
   * Get usage statistics
   * @returns {Promise<Object>} Usage statistics
   */
  getStats: () => {
    return api.get('/copilot/stats')
  },

  /**
   * Save conversation for history
   * @param {Object} conversation - Conversation data
   * @returns {Promise<Object>} Saved conversation
   */
  saveConversation: (conversation) => {
    return api.post('/copilot/conversations', conversation)
  },

  /**
   * Get contextual help based on current page
   * @param {string} page - Current page path
   * @returns {Promise<Object>} Contextual help
   */
  getContextualHelp: (page) => {
    return api.get(`/copilot/contextual-help?page=${encodeURIComponent(page)}`)
  },

  /**
   * Search help articles
   * @param {string} query - Search query
   * @returns {Promise<Array>} Search results
   */
  searchHelp: (query) => {
    return api.get(`/copilot/search?q=${encodeURIComponent(query)}`)
  },

  /**
   * Get step-by-step guidance for a feature
   * @param {string} feature - Feature name
   * @param {string} action - Action to perform
   * @returns {Promise<Object>} Step-by-step guidance
   */
  getStepByStepGuidance: (feature, action) => {
    return api.get(`/copilot/guidance?feature=${encodeURIComponent(feature)}&action=${encodeURIComponent(action)}`)
  },

  /**
   * Provide feedback on copilot response
   * @param {string} conversationId - Conversation ID
   * @param {boolean} helpful - Whether the response was helpful
   * @param {string} feedback - Additional feedback
   * @returns {Promise<Object>} Feedback response
   */
  provideFeedback: (conversationId, helpful, feedback = '') => {
    return api.post('/copilot/feedback', {
      conversation_id: conversationId,
      helpful,
      feedback
    })
  },

  /**
   * Get personalized recommendations
   * @returns {Promise<Array>} Personalized recommendations
   */
  getRecommendations: () => {
    return api.get('/copilot/recommendations')
  },

  /**
   * Check if copilot is available
   * @returns {Promise<boolean>} Availability status
   */
  checkAvailability: () => {
    return api.get('/copilot/health')
  }
}

// Legacy support - maintain backward compatibility
export const useCopilotService = () => copilotService

export default copilotService
