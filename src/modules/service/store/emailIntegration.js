import { defineStore } from 'pinia'
import { emailIntegrationAPI } from '../api/emailIntegration'

export const useEmailIntegrationStore = defineStore('emailIntegration', {
  state: () => ({
    integrations: [],
    emailProviders: [
      { id: 'gmail', name: 'Gmail', icon: 'gmail', color: 'red' },
      { id: 'outlook', name: 'Outlook', icon: 'outlook', color: 'blue' },
      { id: 'imap', name: 'IMAP', icon: 'mail', color: 'gray' }
    ],
    loading: {
      integrations: false,
      creating: false,
      testing: false,
      connecting: false,
      syncing: false
    },
    errors: {
      integrations: null,
      creating: null,
      testing: null,
      connecting: null,
      syncing: null
    },
    selectedIntegration: null,
    showCreateModal: false,
    showTestModal: false
  }),

  getters: {
    activeIntegrations: (state) => state.integrations.filter(integration => integration.status === 'active'),
    connectedIntegrations: (state) => state.integrations.filter(integration => integration.is_connected),
    totalIntegrations: (state) => state.integrations.length,
    totalTicketsFromEmail: (state) => state.integrations.reduce((total, integration) => total + (integration.tickets_count || 0), 0),
    
    getIntegrationById: (state) => (id) => {
      return state.integrations.find(integration => integration.id === id)
    },

    getIntegrationStatus: (state) => (integration) => {
      if (!integration.is_connected) return { status: 'disconnected', color: 'red', text: 'Disconnected' }
      if (integration.status === 'active') return { status: 'active', color: 'green', text: 'Active' }
      if (integration.status === 'error') return { status: 'error', color: 'red', text: 'Error' }
      return { status: 'inactive', color: 'yellow', text: 'Inactive' }
    },

    getProviderInfo: (state) => (providerId) => {
      return state.emailProviders.find(provider => provider.id === providerId) || { id: providerId, name: providerId, icon: 'mail', color: 'gray' }
    }
  },

  actions: {
    // Fetch all email integrations
    async fetchIntegrations() {
      this.loading.integrations = true
      this.errors.integrations = null
      
      try {
        const response = await emailIntegrationAPI.getIntegrations()
        const integrations = response.data.data || []
        
        // Map backend response fields to frontend expected fields
        this.integrations = integrations.map(integration => ({
          id: integration.id,
          support_email: integration.email_address || integration.support_email,
          email_provider: integration.provider || integration.email_provider,
          default_priority: integration.default_priority,
          auto_assign_to: integration.auto_assign_to,
          team_assignment: integration.team_assignment,
          auto_create_tickets: integration.auto_create_tickets,
          subject_prefix: integration.subject_prefix,
          auto_reply: integration.auto_reply,
          auto_reply_message: integration.auto_reply_message,
          status: integration.status || 'inactive',
          is_connected: integration.is_connected || false,
          tickets_count: integration.tickets_count || 0,
          emails_processed: integration.emails_processed || 0,
          last_synced_at: integration.last_synced_at,
          created_at: integration.created_at,
          updated_at: integration.updated_at
        }))
      } catch (error) {
        console.error('Failed to fetch email integrations:', error)
        this.errors.integrations = error.message || 'Failed to load email integrations'
      } finally {
        this.loading.integrations = false
      }
    },

    // Create new email integration
    async createIntegration(integrationData) {
      this.loading.creating = true
      this.errors.creating = null
      
      try {
        const response = await emailIntegrationAPI.createIntegration(integrationData)
        const newIntegration = response.data.data
        
        // Map backend response fields to frontend expected fields
        const mappedIntegration = {
          id: newIntegration.id,
          support_email: newIntegration.email_address || newIntegration.support_email,
          email_provider: newIntegration.provider || newIntegration.email_provider,
          default_priority: newIntegration.default_priority,
          auto_assign_to: newIntegration.auto_assign_to,
          team_assignment: newIntegration.team_assignment,
          auto_create_tickets: newIntegration.auto_create_tickets,
          subject_prefix: newIntegration.subject_prefix,
          auto_reply: newIntegration.auto_reply,
          auto_reply_message: newIntegration.auto_reply_message,
          status: newIntegration.status || 'inactive',
          is_connected: newIntegration.is_connected || false,
          tickets_count: newIntegration.tickets_count || 0,
          emails_processed: newIntegration.emails_processed || 0,
          last_synced_at: newIntegration.last_synced_at,
          created_at: newIntegration.created_at,
          updated_at: newIntegration.updated_at
        }
        
        // Add to integrations list
        this.integrations.unshift(mappedIntegration)
        
        return { success: true, data: mappedIntegration }
      } catch (error) {
        console.error('Failed to create email integration:', error)
        
        // Handle validation errors from backend
        if (error.response && error.response.data && error.response.data.errors) {
          this.errors.creating = error.response.data.message || 'Validation failed'
          return { success: false, error: error.response.data }
        }
        
        this.errors.creating = error.message || 'Failed to create email integration'
        return { success: false, error: this.errors.creating }
      } finally {
        this.loading.creating = false
      }
    },

    // Update email integration
    async updateIntegration(id, updateData) {
      try {
        const response = await emailIntegrationAPI.updateIntegration(id, updateData)
        const updatedIntegration = response.data.data
        
        // Update in integrations list
        const index = this.integrations.findIndex(integration => integration.id === id)
        if (index !== -1) {
          this.integrations[index] = updatedIntegration
        }
        
        return { success: true, data: updatedIntegration }
      } catch (error) {
        console.error('Failed to update email integration:', error)
        return { success: false, error: error.message || 'Failed to update email integration' }
      }
    },

    // Delete email integration
    async deleteIntegration(id) {
      try {
        await emailIntegrationAPI.deleteIntegration(id)
        
        // Remove from integrations list
        this.integrations = this.integrations.filter(integration => integration.id !== id)
        
        return { success: true }
      } catch (error) {
        console.error('Failed to delete email integration:', error)
        return { success: false, error: error.message || 'Failed to delete email integration' }
      }
    },

    // Connect Gmail account
    async connectGmail(id) {
      this.loading.connecting = true
      this.errors.connecting = null
      
      try {
        const response = await emailIntegrationAPI.connectGmail(id)
        
        // If response contains OAuth URL, redirect to Gmail
        if (response.data.oauth_url) {
          window.location.href = response.data.oauth_url
          return { success: true, redirect: true }
        }
        
        // If response contains updated integration data
        if (response.data.data) {
          const index = this.integrations.findIndex(integration => integration.id === id)
          if (index !== -1) {
            this.integrations[index] = response.data.data
          }
        }
        
        return { success: true, data: response.data }
      } catch (error) {
        console.error('Failed to connect Gmail:', error)
        this.errors.connecting = error.message || 'Failed to connect Gmail account'
        return { success: false, error: this.errors.connecting }
      } finally {
        this.loading.connecting = false
      }
    },

    // Test email integration
    async testIntegration(id) {
      this.loading.testing = true
      this.errors.testing = null
      
      try {
        const response = await emailIntegrationAPI.testIntegration(id)
        const testResult = response.data
        
        // Update integration status if test was successful
        if (testResult.success) {
          const index = this.integrations.findIndex(integration => integration.id === id)
          if (index !== -1) {
            this.integrations[index].last_tested_at = new Date().toISOString()
            this.integrations[index].test_status = 'success'
          }
        }
        
        return { success: true, data: testResult }
      } catch (error) {
        console.error('Failed to test email integration:', error)
        this.errors.testing = error.message || 'Failed to test email integration'
        return { success: false, error: this.errors.testing }
      } finally {
        this.loading.testing = false
      }
    },

    // Sync emails manually
    async syncEmails(id) {
      this.loading.syncing = true
      this.errors.syncing = null
      
      try {
        const response = await emailIntegrationAPI.syncEmails(id)
        const syncResult = response.data
        
        // Update integration with sync results
        if (syncResult.success) {
          const index = this.integrations.findIndex(integration => integration.id === id)
          if (index !== -1) {
            this.integrations[index].last_synced_at = new Date().toISOString()
            this.integrations[index].tickets_count = (this.integrations[index].tickets_count || 0) + (syncResult.tickets_created || 0)
          }
        }
        
        return { success: true, data: syncResult }
      } catch (error) {
        console.error('Failed to sync emails:', error)
        this.errors.syncing = error.message || 'Failed to sync emails'
        return { success: false, error: this.errors.syncing }
      } finally {
        this.loading.syncing = false
      }
    },

    // Get integration logs
    async getIntegrationLogs(id, params = {}) {
      try {
        const response = await emailIntegrationAPI.getIntegrationLogs(id, params)
        return { success: true, data: response.data.data || [] }
      } catch (error) {
        console.error('Failed to fetch integration logs:', error)
        return { success: false, error: error.message || 'Failed to fetch integration logs' }
      }
    },

    // Disconnect integration
    async disconnectIntegration(id) {
      try {
        await emailIntegrationAPI.disconnectIntegration(id)
        
        // Update integration status
        const index = this.integrations.findIndex(integration => integration.id === id)
        if (index !== -1) {
          this.integrations[index].is_connected = false
          this.integrations[index].status = 'inactive'
        }
        
        return { success: true }
      } catch (error) {
        console.error('Failed to disconnect integration:', error)
        return { success: false, error: error.message || 'Failed to disconnect integration' }
      }
    },

    // Get integration statistics
    async getIntegrationStats(id) {
      try {
        const response = await emailIntegrationAPI.getIntegrationStats(id)
        return { success: true, data: response.data.data }
      } catch (error) {
        console.error('Failed to fetch integration stats:', error)
        return { success: false, error: error.message || 'Failed to fetch integration statistics' }
      }
    },

    // Set selected integration
    setSelectedIntegration(integration) {
      this.selectedIntegration = integration
    },

    // Toggle create modal
    toggleCreateModal(show = null) {
      this.showCreateModal = show !== null ? show : !this.showCreateModal
    },

    // Toggle test modal
    toggleTestModal(show = null) {
      this.showTestModal = show !== null ? show : !this.showTestModal
    },

    // Clear errors
    clearErrors() {
      this.errors = {
        integrations: null,
        creating: null,
        testing: null,
        connecting: null,
        syncing: null
      }
    },

    // Refresh all data
    async refreshData() {
      await this.fetchIntegrations()
    }
  }
})
