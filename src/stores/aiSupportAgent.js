import { defineStore } from 'pinia'
import api from '@/services/api.js'

export const useAISupportAgentStore = defineStore('aiSupportAgent', {
  state: () => ({
    messages: [],
    loading: false,
    error: null,
    isTyping: false
  }),

  getters: {
    hasMessages: (state) => state.messages.length > 0,
    lastMessage: (state) => state.messages[state.messages.length - 1]
  },

  actions: {
    async sendMessage(message) {
      if (!message.trim()) return

      // Add user message
      this.messages.push({
        id: Date.now(),
        role: 'user',
        text: message.trim(),
        timestamp: new Date()
      })

      // Set loading state
      this.loading = true
      this.isTyping = true
      this.error = null

      try {
        console.log('Sending AI message:', message)
        
        // Try the AI endpoint first
        try {
          const response = await api.post('/ai/support-agent/message', {
            message: message.trim()
          })

          console.log('AI response:', response.data)

          // Add bot response
          this.messages.push({
            id: Date.now() + 1,
            role: 'bot',
            text: response.data.message || 'I received your message but couldn\'t process it.',
            suggestions: response.data.suggestions || [],
            confidence: response.data.confidence || 0,
            timestamp: new Date()
          })

        } catch (aiError) {
          console.log('AI endpoint not available, using intelligent fallback')
          
          // Fallback: Use help articles API to provide intelligent responses
          const intelligentResponse = await this.generateIntelligentResponse(message.trim())
          
          this.messages.push({
            id: Date.now() + 1,
            role: 'bot',
            text: intelligentResponse.message,
            suggestions: intelligentResponse.suggestions || [],
            confidence: intelligentResponse.confidence || 0,
            timestamp: new Date()
          })
        }

      } catch (error) {
        console.error('AI Support Agent error:', error)
        
        // Add error message
        this.messages.push({
          id: Date.now() + 1,
          role: 'bot',
          text: 'Sorry, I couldn\'t process your request right now. Please try again later.',
          suggestions: [],
          confidence: 0,
          timestamp: new Date(),
          isError: true
        })

        this.error = error.response?.data?.message || 'Failed to send message'
      } finally {
        this.loading = false
        this.isTyping = false
      }
    },

    async generateIntelligentResponse(message) {
      try {
        // Get tenant ID from context
        const tenantId = localStorage.getItem('tenant_id') || 42
        
        // Detect intent and adjust search terms
        const intent = this.detectIntent(message)
        const searchTerms = this.getSearchTerms(message, intent)
        
        // Search for relevant help articles
        const searchResponse = await api.get('/help/articles', {
          params: {
            tenant: tenantId,
            search: searchTerms,
            limit: 5
          }
        })

        const articles = searchResponse.data.data || []
        
        if (articles.length === 0) {
          // Provide intent-specific fallback responses
          const fallbackResponse = this.getIntentFallback(intent, message)
          return {
            message: fallbackResponse,
            suggestions: [],
            confidence: 30
          }
        }

        // Generate intelligent response based on articles
        const topArticle = articles[0]
        const otherArticles = articles.slice(1, 3)
        
        let response = `I found some helpful information about your ${intent} question:\n\n`
        
        // Add main solution
        response += `**${topArticle.title}**\n`
        if (topArticle.summary) {
          response += `${topArticle.summary}\n\n`
        }
        
        // Add step-by-step guidance if available
        if (topArticle.content) {
          const steps = this.extractSteps(topArticle.content)
          if (steps.length > 0) {
            response += `**Here's how to resolve this:**\n`
            steps.forEach((step, index) => {
              response += `${index + 1}. ${step}\n`
            })
            response += `\n`
          }
        }
        
        // Add additional resources
        if (otherArticles.length > 0) {
          response += `**Additional Resources:**\n`
          otherArticles.forEach(article => {
            response += `• ${article.title}\n`
          })
          response += `\n`
        }
        
        response += `If these steps don't resolve your issue, please create a support ticket and our team will assist you directly.`
        
        // Create suggestions from articles
        const suggestions = articles.map(article => ({
          title: article.title,
          summary: article.summary,
          url: `/help/article/${article.slug}`
        }))

        return {
          message: response,
          suggestions: suggestions,
          confidence: Math.min(85, 60 + (articles.length * 5))
        }

      } catch (error) {
        console.error('Error generating intelligent response:', error)
        return {
          message: `I understand you're asking about "${message}". I'm having trouble accessing our knowledge base right now, but I'd be happy to help you in other ways. You can:\n\n• Contact our support team directly\n• Browse our help center\n• Create a support ticket for personalized assistance\n\nIs there anything else I can help you with?`,
          suggestions: [],
          confidence: 20
        }
      }
    },

    extractSteps(content) {
      // Extract step-by-step instructions from article content
      const steps = []
      
      // Look for numbered lists
      const numberedMatches = content.match(/\d+\.\s*([^\n]+)/g)
      if (numberedMatches) {
        steps.push(...numberedMatches.map(match => match.replace(/^\d+\.\s*/, '').trim()))
      }
      
      // Look for bullet points
      const bulletMatches = content.match(/[•\-\*]\s*([^\n]+)/g)
      if (bulletMatches && steps.length === 0) {
        steps.push(...bulletMatches.map(match => match.replace(/^[•\-\*]\s*/, '').trim()))
      }
      
      // Look for "Step" patterns
      const stepMatches = content.match(/Step\s+\d+[:\-]?\s*([^\n]+)/gi)
      if (stepMatches && steps.length === 0) {
        steps.push(...stepMatches.map(match => match.replace(/^Step\s+\d+[:\-]?\s*/i, '').trim()))
      }
      
      return steps.slice(0, 5) // Limit to 5 steps
    },

    detectIntent(message) {
      const lowerMessage = message.toLowerCase()
      
      const intents = {
        login: ['login', 'signin', 'sign in', 'access', 'authenticate', 'credentials', 'password', 'account'],
        password: ['password', 'reset', 'forgot', 'change', 'update', 'new password'],
        account: ['account', 'profile', 'settings', 'user', 'personal', 'information'],
        billing: ['billing', 'payment', 'invoice', 'subscription', 'charge', 'cost'],
        technical: ['error', 'bug', 'issue', 'problem', 'not working', 'broken', 'slow'],
        support: ['help', 'support', 'assistance', 'contact', 'ticket', 'service'],
        feature: ['feature', 'functionality', 'how to', 'guide', 'tutorial', 'learn']
      }
      
      for (const [intent, keywords] of Object.entries(intents)) {
        if (keywords.some(keyword => lowerMessage.includes(keyword))) {
          return intent
        }
      }
      
      return 'general'
    },

    getSearchTerms(message, intent) {
      const intentKeywords = {
        login: 'login signin access account credentials',
        password: 'password reset forgot change',
        account: 'account profile settings user',
        billing: 'billing payment invoice subscription',
        technical: 'error bug issue problem troubleshooting',
        support: 'help support contact assistance',
        feature: 'feature functionality guide tutorial'
      }
      
      // Combine original message with intent-specific keywords
      const baseTerms = message
      const intentTerms = intentKeywords[intent] || ''
      
      return `${baseTerms} ${intentTerms}`.trim()
    },

    getIntentFallback(intent, message) {
      const fallbacks = {
        login: `I understand you're having issues with logging in. Here are some common solutions:\n\n• Check your username and password for typos\n• Ensure your account isn't locked\n• Try resetting your password if needed\n• Clear your browser cache and cookies\n\nIf these steps don't work, please create a support ticket and our team will help you directly.`,
        
        password: `I can help you with password-related issues. Here are some options:\n\n• Use the "Forgot Password" link on the login page\n• Check your email for password reset instructions\n• Contact support if you can't access your email\n• Ensure you're using the correct email address\n\nWould you like me to help you with any of these steps?`,
        
        account: `I understand you need help with your account. Here are some common account-related topics:\n\n• Updating your profile information\n• Changing account settings\n• Managing your preferences\n• Account security settings\n\nPlease let me know specifically what you'd like to do with your account, and I'll provide more targeted assistance.`,
        
        billing: `I can help you with billing and payment questions. Here are some common topics:\n\n• Viewing your invoices\n• Updating payment methods\n• Understanding charges\n• Subscription management\n• Billing history\n\nFor specific billing questions, I recommend contacting our billing team directly for the most accurate information.`,
        
        technical: `I understand you're experiencing a technical issue. Here are some troubleshooting steps:\n\n• Try refreshing the page\n• Clear your browser cache and cookies\n• Check your internet connection\n• Try using a different browser\n• Disable browser extensions temporarily\n\nIf the issue persists, please create a support ticket with details about what you were trying to do when the problem occurred.`,
        
        support: `I'm here to help! Here are some ways I can assist you:\n\n• Answer questions about our services\n• Help you find relevant help articles\n• Guide you through common tasks\n• Connect you with the right support resources\n\nWhat specific help do you need today?`,
        
        feature: `I'd be happy to help you learn about our features! Here are some ways I can assist:\n\n• Explain how specific features work\n• Provide step-by-step guides\n• Show you best practices\n• Connect you with relevant documentation\n\nWhat feature would you like to learn more about?`,
        
        general: `I understand you're asking about "${message}". While I don't have specific information about this topic right now, I'd be happy to help you in other ways. You can:\n\n• Contact our support team directly\n• Browse our help center for more topics\n• Create a support ticket for personalized assistance\n\nIs there anything else I can help you with?`
      }
      
      return fallbacks[intent] || fallbacks.general
    },

    clearChat() {
      this.messages = []
      this.error = null
      this.loading = false
      this.isTyping = false
    },

    addWelcomeMessage() {
      if (this.messages.length === 0) {
        this.messages.push({
          id: Date.now(),
          role: 'bot',
          text: 'Hello! I\'m your AI Support Assistant. How can I help you today?',
          suggestions: [],
          confidence: 100,
          timestamp: new Date()
        })
      }
    },

    addMessage(message) {
      this.messages.push(message)
    }
  }
})
