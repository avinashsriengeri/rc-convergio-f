import { defineStore } from 'pinia'
import { commerceAPI } from '@/services/api'

export interface CommerceSettings {
  id?: string | number
  stripe_public_key: string
  stripe_secret_key: string
  stripe_webhook_secret?: string
  mode: 'test' | 'live'
  currency: string
  payment_methods: string[]
  auto_fulfill_orders: boolean
  send_order_confirmations: boolean
  send_payment_receipts: boolean
  created_at?: string
  updated_at?: string
}

export interface ConnectionTest {
  success: boolean
  message: string
  mode: 'test' | 'live'
  account_id?: string
  account_name?: string
}

export const useCommerceSettingsStore = defineStore('commerceSettings', {
  state: () => ({
    settings: {} as CommerceSettings,
    connectionTest: null as ConnectionTest | null,
    loading: false,
    error: null as string | null,
    isDirty: false
  }),

  getters: {
    isConfigured: (state) => {
      return !!(state.settings.stripe_public_key && state.settings.stripe_secret_key)
    },
    
    isLiveMode: (state) => {
      return state.settings.mode === 'live'
    },
    
    isTestMode: (state) => {
      return state.settings.mode === 'test'
    },
    
    hasValidKeys: (state) => {
      return !!(state.settings.stripe_public_key?.startsWith('pk_') && 
                state.settings.stripe_secret_key?.startsWith('sk_'))
    }
  },

  actions: {
    async fetchSettings() {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.getSettings()
        this.settings = response.data.data
        this.isDirty = false
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch settings'
        console.error('Error fetching settings:', error)
      } finally {
        this.loading = false
      }
    },

    async updateSettings(payload: Partial<CommerceSettings>) {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.updateSettings(payload)
        this.settings = { ...this.settings, ...response.data.data }
        this.isDirty = false
        return response.data.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to update settings'
        console.error('Error updating settings:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async testConnection() {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.testConnection()
        this.connectionTest = response.data.data
        return response.data.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to test connection'
        this.connectionTest = {
          success: false,
          message: error.response?.data?.message || 'Connection test failed',
          mode: this.settings.mode
        }
        console.error('Error testing connection:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    updateLocalSettings(updates: Partial<CommerceSettings>) {
      this.settings = { ...this.settings, ...updates }
      this.isDirty = true
    },

    resetToSaved() {
      this.isDirty = false
      // This would typically reload from the server
      this.fetchSettings()
    },

    async sendTestEmail(emailData?: { email?: string; customer_name?: string }) {
      this.loading = true
      this.error = null
      try {
        // Use provided data or default test values
        const data = emailData || {
          email: 'test@example.com',
          customer_name: 'Test Customer'
        }
        const response = await commerceAPI.sendTestEmail(data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to send test email'
        console.error('Error sending test email:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async resetSettings() {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.resetSettings()
        // Reset local state to default values
        this.settings = {
          stripe_public_key: '',
          stripe_secret_key: '',
          stripe_webhook_secret: '',
          mode: 'test',
          currency: 'usd',
          payment_methods: ['card'],
          auto_fulfill_orders: true,
          send_order_confirmations: true,
          send_payment_receipts: true
        }
        this.isDirty = false
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to reset settings'
        console.error('Error resetting settings:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    },

    clearConnectionTest() {
      this.connectionTest = null
    }
  }
})
