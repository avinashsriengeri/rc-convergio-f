import { defineStore } from 'pinia'
import { serviceTicketsAPI } from '../api/serviceTickets'

export const useFeedbackAnalyticsStore = defineStore('feedbackAnalytics', {
  state: () => ({
    // Survey Summary Data
    surveySummary: {
      totalSurveys: 0,
      responseRate: 0,
      averageCSAT: 0,
      totalResponses: 0,
      lastUpdated: null
    },
    
    // CSAT Trends Data
    csatTrends: {
      daily: [],
      weekly: [],
      monthly: [],
      period: '30d'
    },
    
    // Tickets with CSAT
    ticketsWithCSAT: [],
    ticketsWithCSATLoading: false,
    ticketsWithCSATError: null,
    
    // Agent Performance
    agentPerformance: [],
    agentPerformanceLoading: false,
    agentPerformanceError: null,
    
    // Survey Management
    activeSurveys: [],
    postTicketSurveys: [],
    
    // Loading States
    loading: {
      summary: false,
      trends: false,
      tickets: false,
      agents: false,
      surveys: false
    },
    
    // Error States
    errors: {
      summary: null,
      trends: null,
      tickets: null,
      agents: null,
      surveys: null
    }
  }),

  getters: {
    // CSAT Score Categories
    csatCategories: (state) => {
      const summary = state.surveySummary
      return {
        excellent: summary.averageCSAT >= 4.5 ? 'Excellent' : null,
        good: summary.averageCSAT >= 3.5 && summary.averageCSAT < 4.5 ? 'Good' : null,
        average: summary.averageCSAT >= 2.5 && summary.averageCSAT < 3.5 ? 'Average' : null,
        poor: summary.averageCSAT < 2.5 ? 'Poor' : null
      }
    },
    
    // Response Rate Status
    responseRateStatus: (state) => {
      const rate = state.surveySummary.responseRate
      if (rate >= 80) return { status: 'excellent', color: 'green' }
      if (rate >= 60) return { status: 'good', color: 'blue' }
      if (rate >= 40) return { status: 'average', color: 'yellow' }
      return { status: 'poor', color: 'red' }
    },
    
    // Top Performing Agents
    topAgents: (state) => {
      return state.agentPerformance
        .sort((a, b) => b.averageCSAT - a.averageCSAT)
        .slice(0, 5)
    },
    
    // Recent CSAT Trends
    recentTrends: (state) => {
      return state.csatTrends.daily.slice(-7) // Last 7 days
    }
  },

  actions: {
    // Fetch Survey Summary
    async fetchSurveySummary() {
      this.loading.summary = true
      this.errors.summary = null
      
      try {
        const response = await serviceTicketsAPI.getSurveySummary()
        const data = response.data.data
        
        // Calculate response rate from the actual data
        const totalResponses = data.responses?.total_responses || 0
        const totalSurveys = data.surveys?.total_surveys || 0
        const responseRate = totalSurveys > 0 ? Math.round((totalResponses / totalSurveys) * 100) : 0
        
        this.surveySummary = {
          totalSurveys: data.surveys?.total_surveys || 0,
          responseRate: responseRate,
          averageCSAT: data.csat?.average_csat_score || 0,
          totalResponses: data.responses?.total_responses || 0,
          lastUpdated: new Date().toISOString()
        }
      } catch (error) {
        console.error('Failed to fetch survey summary:', error)
        this.errors.summary = error.message || 'Failed to load survey summary'
      } finally {
        this.loading.summary = false
      }
    },

    // Fetch CSAT Trends
    async fetchCSATTrends(period = '30d') {
      this.loading.trends = true
      this.errors.trends = null
      
      try {
        const response = await serviceTicketsAPI.getCSATTrends({ period })
        const data = response.data.data
        
        // Handle the actual response structure
        this.csatTrends = {
          daily: data.trends || [],
          weekly: data.trends || [],
          monthly: data.trends || [],
          period,
          summary: data.summary || {}
        }
      } catch (error) {
        console.error('Failed to fetch CSAT trends:', error)
        this.errors.trends = error.message || 'Failed to load CSAT trends'
      } finally {
        this.loading.trends = false
      }
    },

    // Fetch Tickets with CSAT
    async fetchTicketsWithCSAT(params = {}) {
      this.ticketsWithCSATLoading = true
      this.ticketsWithCSATError = null
      
      try {
        const response = await serviceTicketsAPI.getTicketsWithCSAT(params)
        const tickets = response.data.data?.tickets || []
        
        // Transform the data to match the expected format
        this.ticketsWithCSAT = tickets.map(ticket => ({
          id: ticket.ticket_id,
          subject: ticket.subject,
          customer_name: ticket.assignee_name || 'Unassigned',
          customer_email: '', // Not provided in API response
          csat_rating: parseFloat(ticket.csat_score),
          feedback_text: ticket.feedback,
          feedback_date: ticket.response_date,
          status: ticket.status,
          priority: ticket.priority,
          created_at: ticket.ticket_created_at,
          closed_at: ticket.ticket_closed_at
        }))
      } catch (error) {
        console.error('Failed to fetch tickets with CSAT:', error)
        this.ticketsWithCSATError = error.message || 'Failed to load tickets with CSAT'
      } finally {
        this.ticketsWithCSATLoading = false
      }
    },

    // Fetch Agent Performance
    async fetchAgentPerformance(params = {}) {
      this.agentPerformanceLoading = true
      this.agentPerformanceError = null
      
      try {
        const response = await serviceTicketsAPI.getAgentPerformance(params)
        const agents = response.data.data?.agents || []
        
        // Transform the data to match the expected format
        this.agentPerformance = agents.map(agent => ({
          id: agent.agent_id,
          name: agent.agent_name,
          email: agent.agent_email,
          tickets_count: agent.total_tickets,
          averageCSAT: agent.average_csat,
          satisfaction_rate: agent.satisfaction_rate,
          response_rate: agent.response_rate,
          tickets_with_feedback: agent.tickets_with_feedback
        }))
      } catch (error) {
        console.error('Failed to fetch agent performance:', error)
        this.agentPerformanceError = error.message || 'Failed to load agent performance'
      } finally {
        this.agentPerformanceLoading = false
      }
    },

    // Fetch Active Surveys
    async fetchActiveSurveys() {
      this.loading.surveys = true
      this.errors.surveys = null
      
      try {
        const response = await serviceTicketsAPI.getActiveSurveys()
        this.activeSurveys = response.data.data || []
      } catch (error) {
        console.error('Failed to fetch active surveys:', error)
        this.errors.surveys = error.message || 'Failed to load active surveys'
      } finally {
        this.loading.surveys = false
      }
    },

    // Fetch Post-Ticket Surveys
    async fetchPostTicketSurveys() {
      try {
        const response = await serviceTicketsAPI.getPostTicketSurveys()
        this.postTicketSurveys = response.data.data || []
      } catch (error) {
        console.error('Failed to fetch post-ticket surveys:', error)
      }
    },

    // Send Survey Reminder
    async sendSurveyReminder(surveyId) {
      try {
        await serviceTicketsAPI.sendSurveyReminder(surveyId)
        // Refresh surveys after sending reminder
        await this.fetchActiveSurveys()
        return { success: true }
      } catch (error) {
        console.error('Failed to send survey reminder:', error)
        return { success: false, error: error.message }
      }
    },

    // Get Ticket Survey Details
    async getTicketSurvey(ticketId) {
      try {
        const response = await serviceTicketsAPI.getTicketSurvey(ticketId)
        return response.data.data
      } catch (error) {
        console.error('Failed to fetch ticket survey:', error)
        return null
      }
    },

    // Get Ticket Survey Responses
    async getTicketSurveyResponses(ticketId) {
      try {
        const response = await serviceTicketsAPI.getTicketSurveyResponses(ticketId)
        return response.data.data
      } catch (error) {
        console.error('Failed to fetch ticket survey responses:', error)
        return []
      }
    },

    // Get Ticket Survey Status
    async getTicketSurveyStatus(ticketId) {
      try {
        const response = await serviceTicketsAPI.getTicketSurveyStatus(ticketId)
        return response.data.data
      } catch (error) {
        console.error('Failed to fetch ticket survey status:', error)
        return null
      }
    },

    // Refresh All Data
    async refreshAll() {
      await Promise.all([
        this.fetchSurveySummary(),
        this.fetchCSATTrends(),
        this.fetchTicketsWithCSAT(),
        this.fetchAgentPerformance(),
        this.fetchActiveSurveys(),
        this.fetchPostTicketSurveys()
      ])
    },

    // Clear Errors
    clearErrors() {
      this.errors = {
        summary: null,
        trends: null,
        tickets: null,
        agents: null,
        surveys: null
      }
    }
  }
})
