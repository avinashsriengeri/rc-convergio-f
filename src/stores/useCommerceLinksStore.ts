import { defineStore } from 'pinia'
import { commerceAPI } from '@/services/api'

export interface PaymentLink {
  id: string | number
  link_id: string
  quote_id?: string | number
  quote_title?: string
  status: 'active' | 'inactive' | 'expired'
  amount: number
  currency: string
  created_at: string
  expires_at?: string
  click_count: number
  conversion_count: number
  last_accessed_at?: string
  metadata?: Record<string, any>
}

export const useCommerceLinksStore = defineStore('commerceLinks', {
  state: () => ({
    paymentLinks: [] as PaymentLink[],
    currentLink: null as PaymentLink | null,
    loading: false,
    error: null as string | null,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    }
  }),

  getters: {
    getLinkById: (state) => (id: string | number) => {
      return state.paymentLinks.find(link => link.id === id)
    },
    
    getActiveLinks: (state) => {
      return state.paymentLinks.filter(link => link.status === 'active')
    },
    
    getInactiveLinks: (state) => {
      return state.paymentLinks.filter(link => link.status === 'inactive')
    },
    
    getExpiredLinks: (state) => {
      return state.paymentLinks.filter(link => link.status === 'expired')
    },
    
    totalActiveLinks: (state) => {
      return state.paymentLinks.filter(link => link.status === 'active').length
    }
  },

  actions: {
    async fetchPaymentLinks(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.getPaymentLinks(params)
        this.paymentLinks = response.data.data
        this.pagination = response.data.meta
      } catch (error: any) {
        // For development, add mock data when API fails
        console.warn('API not available, using mock payment links:', error)
        this.paymentLinks = [
          {
            id: 1,
            link_id: 'pl_abc123',
            quote_id: 1,
            quote_title: 'Website Development Quote',
            amount: 2999.99,
            currency: 'USD',
            status: 'active',
            created_at: '2025-10-15T02:18:00Z',
            expires_at: '2025-11-15T02:18:00Z',
            click_count: 45,
            conversion_count: 3,
            public_url: 'https://checkout.example.com/pl_abc123'
          },
          {
            id: 2,
            link_id: 'pl_def456',
            quote_id: 2,
            quote_title: 'Mobile App Development',
            amount: 4999.99,
            currency: 'USD',
            status: 'inactive',
            created_at: '2025-10-14T15:30:00Z',
            expires_at: '2025-11-14T15:30:00Z',
            click_count: 23,
            conversion_count: 1,
            public_url: 'https://checkout.example.com/pl_def456'
          },
          {
            id: 3,
            link_id: 'pl_ghi789',
            quote_id: 3,
            quote_title: 'E-commerce Platform',
            amount: 7999.99,
            currency: 'USD',
            status: 'expired',
            created_at: '2025-10-10T10:00:00Z',
            expires_at: '2025-10-12T10:00:00Z',
            click_count: 67,
            conversion_count: 2,
            public_url: 'https://checkout.example.com/pl_ghi789'
          }
        ]
        this.pagination = {
          current_page: 1,
          last_page: 1,
          per_page: 12,
          total: 3
        }
      } finally {
        this.loading = false
      }
    },

    async fetchPaymentLink(id: string | number) {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.getPaymentLink(id)
        this.currentLink = response.data.data
        return response.data.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to fetch payment link'
        console.error('Error fetching payment link:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createPaymentLink(payload: any) {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.createPaymentLink(payload)
        const newLink = response.data.data
        this.paymentLinks.unshift(newLink)
        return newLink
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to create payment link'
        console.error('Error creating payment link:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updatePaymentLink(id: string | number, payload: any) {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.updatePaymentLink(id, payload)
        const updatedLink = response.data.data
        const index = this.paymentLinks.findIndex(link => link.id === id)
        if (index !== -1) {
          this.paymentLinks[index] = updatedLink
        }
        return updatedLink
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to update payment link'
        console.error('Error updating payment link:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deletePaymentLink(id: string | number) {
      this.loading = true
      this.error = null
      try {
        await commerceAPI.deletePaymentLink(id)
        this.paymentLinks = this.paymentLinks.filter(link => link.id !== id)
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to delete payment link'
        console.error('Error deleting payment link:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async activatePaymentLink(id: string | number) {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.activatePaymentLink(id)
        const updatedLink = response.data.data
        const index = this.paymentLinks.findIndex(link => link.id === id)
        if (index !== -1) {
          this.paymentLinks[index] = updatedLink
        }
        return updatedLink
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to activate payment link'
        console.error('Error activating payment link:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deactivatePaymentLink(id: string | number) {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.deactivatePaymentLink(id)
        const updatedLink = response.data.data
        const index = this.paymentLinks.findIndex(link => link.id === id)
        if (index !== -1) {
          this.paymentLinks[index] = updatedLink
        }
        return updatedLink
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Failed to deactivate payment link'
        console.error('Error deactivating payment link:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async sendEmail(id: string | number, customerEmail?: string) {
      this.loading = true
      this.error = null
      try {
        const data = customerEmail ? { customer_email: customerEmail } : {}
        const response = await commerceAPI.sendPaymentLinkEmail(id, data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to send email'
        console.error('Error sending email:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async sendBulkEmail(payload) {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.sendBulkPaymentLinkEmails(payload)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to send bulk emails'
        console.error('Error sending bulk emails:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    },

    clearCurrentLink() {
      this.currentLink = null
    }
  }
})
