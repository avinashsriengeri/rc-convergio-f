import { defineStore } from 'pinia'
import { copilotService } from '@/services/copilotService'

export const useCopilotStore = defineStore('copilot', {
  state: () => ({
    // Chat state
    isOpen: false,
    messages: [],
    isTyping: false,
    unreadCount: 0,
    
    // Features and suggestions
    availableFeatures: [],
    showFeatureCards: false,
    quickStartSuggestions: [],
    
    // Conversation history
    conversationHistory: [],
    currentConversation: null,
    
    // User preferences
    preferences: {
      showWelcomeMessage: true,
      enableNotifications: true,
      autoSuggestions: true,
      theme: 'light'
    },
    
    // Analytics
    stats: {
      totalConversations: 0,
      userConversations: 0,
      popularFeatures: [],
      recentActivity: []
    },
    
    // Context
    currentPage: '/dashboard',
    lastActivity: null,
    
    // Loading states
    loading: {
      features: false,
      history: false,
      stats: false
    },
    
    // Error state
    error: null
  }),

  getters: {
    // Get recent messages (last 10)
    recentMessages: (state) => {
      return state.messages.slice(-10)
    },
    
    // Get unread messages count
    unreadMessagesCount: (state) => {
      return state.unreadCount
    },
    
    // Check if copilot is available
    isAvailable: (state) => {
      return !state.error && state.availableFeatures.length > 0
    },
    
    // Get contextual suggestions based on current page
    contextualSuggestions: (state) => {
      const pageSuggestions = {
        '/dashboard': [
          { name: 'Create Contact', query: 'How do I create a contact?' },
          { name: 'Create Deal', query: 'How do I create a deal?' },
          { name: 'View Analytics', query: 'Show me analytics' }
        ],
        '/contacts': [
          { name: 'Add Contact', query: 'How do I add a new contact?' },
          { name: 'Import Contacts', query: 'How do I import contacts?' },
          { name: 'Contact Segments', query: 'How do I create contact segments?' }
        ],
        '/deals': [
          { name: 'Create Deal', query: 'How do I create a deal?' },
          { name: 'Move Deal', query: 'How do I move a deal to next stage?' },
          { name: 'Deal Pipeline', query: 'How does the deal pipeline work?' }
        ],
        '/marketing': [
          { name: 'Email Campaign', query: 'How do I create an email campaign?' },
          { name: 'Lead Scoring', query: 'How do I set up lead scoring?' },
          { name: 'Analytics', query: 'Show me marketing analytics' }
        ],
        '/cms': [
          { name: 'Create Page', query: 'How do I create a new page?' },
          { name: 'Page Templates', query: 'How do I use page templates?' },
          { name: 'SEO Settings', query: 'How do I optimize SEO?' }
        ]
      }
      
      return pageSuggestions[state.currentPage] || []
    },
    
    // Get conversation summary
    conversationSummary: (state) => {
      return {
        totalMessages: state.messages.length,
        userMessages: state.messages.filter(m => m.role === 'user').length,
        assistantMessages: state.messages.filter(m => m.role === 'assistant').length,
        lastMessage: state.messages[state.messages.length - 1]
      }
    }
  },

  actions: {
    // Initialize the copilot store
    async initialize() {
      try {
        await this.loadFeatures()
        await this.loadHistory()
        await this.loadStats()
        this.setCurrentPage(window.location.pathname)
      } catch (error) {
        console.error('Failed to initialize copilot store:', error)
        this.setError('Failed to initialize Copilot')
      }
    },

    // Load available features
    async loadFeatures() {
      this.loading.features = true
      try {
        const response = await copilotService.getFeatures()
        this.availableFeatures = response.data.features || []
      } catch (error) {
        console.error('Failed to load features:', error)
      } finally {
        this.loading.features = false
      }
    },

    // Load conversation history
    async loadHistory() {
      this.loading.history = true
      try {
        const response = await copilotService.getHistory(20)
        this.conversationHistory = response.data.conversations || []
      } catch (error) {
        console.error('Failed to load history:', error)
      } finally {
        this.loading.history = false
      }
    },

    // Load usage statistics
    async loadStats() {
      this.loading.stats = true
      try {
        const response = await copilotService.getStats()
        this.stats = response.data
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        this.loading.stats = false
      }
    },

    // Add a new message
    addMessage(message) {
      const newMessage = {
        id: Date.now() + Math.random(),
        role: message.role,
        content: message.content,
        timestamp: message.timestamp || new Date(),
        type: message.type || null,
        steps: message.steps || [],
        suggestions: message.suggestions || [],
        quick_actions: message.quick_actions || [],
        navigation: message.navigation || null,
        feature: message.feature || null,
        action: message.action || null,
        confidence: message.confidence || 0.8
      }
      
      this.messages.push(newMessage)
      
      // Increment unread count if not from user
      if (message.role === 'assistant') {
        this.unreadCount++
      }
      
      // Save to conversation history
      this.saveToHistory(newMessage)
    },

    // Save message to history
    async saveToHistory(message) {
      // DISABLED: Commented out to prevent API calls
      // try {
      //   await copilotService.saveConversation({
      //     message: message.content,
      //     role: message.role,
      //     timestamp: message.timestamp,
      //     page: this.currentPage
      //   })
      // } catch (error) {
      //   console.error('Failed to save to history:', error)
      // }
    },

    // Mark messages as read
    markAsRead() {
      this.unreadCount = 0
    },

    // Toggle chat window
    toggleChat() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.markAsRead()
      }
    },

    // Set current page
    setCurrentPage(page) {
      this.currentPage = page
      this.lastActivity = new Date()
    },

    // Show feature cards
    showFeatures() {
      this.showFeatureCards = true
    },

    // Hide feature cards
    hideFeatures() {
      this.showFeatureCards = false
    },

    // Set typing state
    setTyping(typing) {
      this.isTyping = typing
    },

    // Clear conversation
    clearConversation() {
      this.messages = []
      this.currentConversation = null
    },

    // Set error state
    setError(error) {
      this.error = error
    },

    // Clear error
    clearError() {
      this.error = null
    },

    // Update preferences
    updatePreferences(preferences) {
      this.preferences = { ...this.preferences, ...preferences }
      // Save to localStorage
      localStorage.setItem('copilot_preferences', JSON.stringify(this.preferences))
    },

    // Load preferences from localStorage
    loadPreferences() {
      try {
        const saved = localStorage.getItem('copilot_preferences')
        if (saved) {
          this.preferences = { ...this.preferences, ...JSON.parse(saved) }
        }
      } catch (error) {
        console.error('Failed to load preferences:', error)
      }
    },

    // Get contextual help for current page
    async getContextualHelp() {
      try {
        const response = await copilotService.getContextualHelp(this.currentPage)
        return response.data
      } catch (error) {
        console.error('Failed to get contextual help:', error)
        return null
      }
    },

    // Search help articles
    async searchHelp(query) {
      try {
        const response = await copilotService.searchHelp(query)
        return response.data.results || []
      } catch (error) {
        console.error('Failed to search help:', error)
        return []
      }
    },

    // Provide feedback
    async provideFeedback(conversationId, helpful, feedback = '') {
      try {
        await copilotService.provideFeedback(conversationId, helpful, feedback)
      } catch (error) {
        console.error('Failed to provide feedback:', error)
      }
    },

    // Get recommendations
    async getRecommendations() {
      try {
        const response = await copilotService.getRecommendations()
        return response.data.recommendations || []
      } catch (error) {
        console.error('Failed to get recommendations:', error)
        return []
      }
    },

    // Reset store
    reset() {
      this.messages = []
      this.conversationHistory = []
      this.unreadCount = 0
      this.isOpen = false
      this.error = null
    }
  }
})
