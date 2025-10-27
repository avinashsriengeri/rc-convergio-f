import { defineStore } from 'pinia'
import { liveChatAPI } from '../api/liveChat'

export const useLiveChatStore = defineStore('liveChat', {
  state: () => ({
    // Integration data
    liveChatSnippet: null,
    
    // Conversations
    conversations: [],
    activeConversation: null,
    conversationMessages: [],
    
    // Statistics
    stats: {
      totalConversations: 0,
      activeConversations: 0,
      closedConversations: 0,
      averageResponseTime: 0,
      customerSatisfaction: 0
    },
    
    // Available agents
    availableAgents: [],
    
    // Loading states
    loading: {
      conversations: false,
      messages: false,
      sending: false,
      snippet: false,
      stats: false,
      agents: false
    },
    
    // Error states
    errors: {
      conversations: null,
      messages: null,
      sending: null,
      snippet: null,
      stats: null,
      agents: null
    },
    
    // UI state
    selectedConversation: null,
    showConversationModal: false,
    isTyping: false,
    typingUsers: []
  }),

  getters: {
    // Get conversations by status
    activeConversations: (state) => state.conversations.filter(conv => conv.status === 'active'),
    closedConversations: (state) => state.conversations.filter(conv => conv.status === 'closed'),
    unassignedConversations: (state) => state.conversations.filter(conv => !conv.assigned_agent_id),
    assignedConversations: (state) => state.conversations.filter(conv => conv.assigned_agent_id),
    
    // Get conversation by ID
    getConversationById: (state) => (id) => {
      return state.conversations.find(conv => conv.id === id)
    },
    
    // Get messages for current conversation
    currentConversationMessages: (state) => {
      if (!state.activeConversation) return []
      return state.conversationMessages.filter(msg => msg.conversation_id === state.activeConversation.id)
    },
    
    // Get conversation status color
    getStatusColor: (state) => (status) => {
      const colors = {
        'active': 'green',
        'closed': 'gray',
        'waiting': 'yellow',
        'assigned': 'blue'
      }
      return colors[status] || 'gray'
    },
    
    // Get conversation priority color
    getPriorityColor: (state) => (priority) => {
      const colors = {
        'low': 'green',
        'medium': 'yellow',
        'high': 'orange',
        'urgent': 'red'
      }
      return colors[priority] || 'gray'
    }
  },

  actions: {
    // Get Live Chat snippet for integration
    async fetchLiveChatSnippet() {
      this.loading.snippet = true
      this.errors.snippet = null
      
      try {
        const response = await liveChatAPI.getLiveChatSnippet()
        this.liveChatSnippet = response.data.data
        return { success: true, data: response.data.data }
      } catch (error) {
        console.error('Failed to fetch live chat snippet:', error)
        this.errors.snippet = error.message || 'Failed to load live chat snippet'
        return { success: false, error: this.errors.snippet }
      } finally {
        this.loading.snippet = false
      }
    },

    // Fetch all conversations
    async fetchConversations(params = {}) {
      this.loading.conversations = true
      this.errors.conversations = null
      
      try {
        const response = await liveChatAPI.getConversations(params)
        this.conversations = response.data.data || []
        return { success: true, data: this.conversations }
      } catch (error) {
        console.error('Failed to fetch conversations:', error)
        this.errors.conversations = error.message || 'Failed to load conversations'
        return { success: false, error: this.errors.conversations }
      } finally {
        this.loading.conversations = false
      }
    },

    // Fetch conversation details
    async fetchConversationDetails(conversationId) {
      this.loading.messages = true
      this.errors.messages = null
      
      try {
        const response = await liveChatAPI.getConversationDetails(conversationId)
        this.activeConversation = response.data.data
        this.conversationMessages = response.data.data.messages || []
        return { success: true, data: this.activeConversation }
      } catch (error) {
        console.error('Failed to fetch conversation details:', error)
        this.errors.messages = error.message || 'Failed to load conversation details'
        return { success: false, error: this.errors.messages }
      } finally {
        this.loading.messages = false
      }
    },

    // Send agent message
    async sendAgentMessage(conversationId, message) {
      this.loading.sending = true
      this.errors.sending = null
      
      try {
        const response = await liveChatAPI.sendAgentMessage(conversationId, {
          message,
          sender_type: 'agent'
        })
        
        // Add message to local state
        const newMessage = response.data.data
        this.conversationMessages.push(newMessage)
        
        return { success: true, data: newMessage }
      } catch (error) {
        console.error('Failed to send message:', error)
        this.errors.sending = error.message || 'Failed to send message'
        return { success: false, error: this.errors.sending }
      } finally {
        this.loading.sending = false
      }
    },

    // Assign conversation to agent
    async assignConversation(conversationId, agentId) {
      try {
        const response = await liveChatAPI.assignConversation(conversationId, { agent_id: agentId })
        
        // Update conversation in local state
        const conversation = this.conversations.find(conv => conv.id === conversationId)
        if (conversation) {
          conversation.assigned_agent_id = agentId
          conversation.status = 'assigned'
        }
        
        return { success: true, data: response.data.data }
      } catch (error) {
        console.error('Failed to assign conversation:', error)
        return { success: false, error: error.message || 'Failed to assign conversation' }
      }
    },

    // Close conversation
    async closeConversation(conversationId) {
      try {
        const response = await liveChatAPI.closeConversation(conversationId)
        
        // Update conversation in local state
        const conversation = this.conversations.find(conv => conv.id === conversationId)
        if (conversation) {
          conversation.status = 'closed'
          conversation.closed_at = new Date().toISOString()
        }
        
        return { success: true, data: response.data.data }
      } catch (error) {
        console.error('Failed to close conversation:', error)
        return { success: false, error: error.message || 'Failed to close conversation' }
      }
    },

    // Mark conversation as read
    async markAsRead(conversationId) {
      try {
        await liveChatAPI.markAsRead(conversationId)
        
        // Update conversation in local state
        const conversation = this.conversations.find(conv => conv.id === conversationId)
        if (conversation) {
          conversation.unread_count = 0
        }
        
        return { success: true }
      } catch (error) {
        console.error('Failed to mark as read:', error)
        return { success: false, error: error.message || 'Failed to mark as read' }
      }
    },

    // Fetch live chat statistics
    async fetchLiveChatStats() {
      this.loading.stats = true
      this.errors.stats = null
      
      try {
        const response = await liveChatAPI.getLiveChatStats()
        this.stats = response.data.data
        return { success: true, data: this.stats }
      } catch (error) {
        console.error('Failed to fetch live chat stats:', error)
        this.errors.stats = error.message || 'Failed to load live chat statistics'
        return { success: false, error: this.errors.stats }
      } finally {
        this.loading.stats = false
      }
    },

    // Fetch available agents
    async fetchAvailableAgents() {
      this.loading.agents = true
      this.errors.agents = null
      
      try {
        const response = await liveChatAPI.getAvailableAgents()
        this.availableAgents = response.data.data || []
        return { success: true, data: this.availableAgents }
      } catch (error) {
        console.error('Failed to fetch available agents:', error)
        this.errors.agents = error.message || 'Failed to load available agents'
        return { success: false, error: this.errors.agents }
      } finally {
        this.loading.agents = false
      }
    },

    // Set selected conversation
    setSelectedConversation(conversation) {
      this.selectedConversation = conversation
    },

    // Toggle conversation modal
    toggleConversationModal(show = null) {
      this.showConversationModal = show !== null ? show : !this.showConversationModal
    },

    // Set typing status
    setTyping(isTyping, userId = null) {
      this.isTyping = isTyping
      if (userId && isTyping) {
        if (!this.typingUsers.includes(userId)) {
          this.typingUsers.push(userId)
        }
      } else if (userId && !isTyping) {
        this.typingUsers = this.typingUsers.filter(id => id !== userId)
      }
    },

    // Clear errors
    clearErrors() {
      this.errors = {
        conversations: null,
        messages: null,
        sending: null,
        snippet: null,
        stats: null,
        agents: null
      }
    },

    // Refresh all data
    async refreshData() {
      await Promise.all([
        this.fetchConversations(),
        this.fetchLiveChatStats(),
        this.fetchAvailableAgents()
      ])
    }
  }
})
