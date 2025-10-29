import { defineStore } from 'pinia'
import { commerceAPI } from '@/services/api'

export interface AnalyticsOverview {
  total_revenue: number
  total_orders: number
  conversion_rate: number
  average_order_value: number
  revenue_growth: number
  orders_growth: number
  conversion_growth: number
  aov_growth: number
}

export interface RevenueData {
  date: string
  amount: number
  orders: number
}

export interface ConversionData {
  date: string
  rate: number
  views: number
  conversions: number
}

export interface TransactionData {
  date: string
  count: number
  amount: number
  status: string
}

export interface PaymentLinkAnalytics {
  id: number
  name: string
  views: number
  clicks: number
  conversions: number
  conversion_rate: number
  revenue: number
}

export interface RecentTransaction {
  id: number
  order_number: string
  customer_name: string
  amount: number
  status: string
  payment_provider: string
  created_at: string
}

export const useCommerceAnalyticsStore = defineStore('commerceAnalytics', {
  state: () => ({
    overview: null as AnalyticsOverview | null,
    revenueData: [] as RevenueData[],
    conversionData: [] as ConversionData[],
    transactionData: [] as TransactionData[],
    paymentLinkAnalytics: [] as PaymentLinkAnalytics[],
    recentTransactions: [] as RecentTransaction[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    formattedOverview: (state) => {
      if (!state.overview) return null
      return {
        ...state.overview,
        total_revenue: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(state.overview.total_revenue),
        average_order_value: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(state.overview.average_order_value)
      }
    },

    topPerformingLinks: (state) => {
      return state.paymentLinkAnalytics
        .sort((a, b) => b.conversions - a.conversions)
        .slice(0, 5)
    },

    revenueGrowthColor: (state) => {
      if (!state.overview) return 'text-gray-500'
      return state.overview.revenue_growth >= 0 ? 'text-green-600' : 'text-red-600'
    },

    conversionGrowthColor: (state) => {
      if (!state.overview) return 'text-gray-500'
      return state.overview.conversion_growth >= 0 ? 'text-green-600' : 'text-red-600'
    }
  },

  actions: {
    async fetchOverview() {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.getCommerceAnalytics({ type: 'overview' })
        this.overview = response.data.data
      } catch (error) {
        console.warn('Analytics API not available, using mock data:', error)
        // Mock data for development
        this.overview = {
          total_revenue: 45678.90,
          total_orders: 156,
          conversion_rate: 12.5,
          average_order_value: 292.81,
          revenue_growth: 15.2,
          orders_growth: 8.7,
          conversion_growth: -2.1,
          aov_growth: 5.3
        }
      } finally {
        this.loading = false
      }
    },

    async fetchRevenueData(period = '30d') {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.getRevenueChart({ period })
        console.log('Revenue API response:', response.data)
        
        // Transform the API response to match expected format
        const apiData = response.data.data
        if (apiData.monthly_breakdown && Array.isArray(apiData.monthly_breakdown)) {
          // Transform monthly_breakdown to the expected format
          this.revenueData = apiData.monthly_breakdown.map(item => ({
            date: item.month,
            amount: item.revenue,
            orders: 0 // Default value since not provided in API
          }))
        } else {
          // Fallback to original data structure if available
          this.revenueData = apiData.revenue || []
        }
        
        console.log('Transformed revenue data:', this.revenueData)
      } catch (error) {
        console.warn('Revenue API not available, using mock data:', error)
        // Generate mock data for the last 30 days
        this.revenueData = this.generateMockRevenueData(period)
      } finally {
        this.loading = false
      }
    },

    async fetchConversionData(period = '30d') {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.getCommerceAnalytics({ type: 'conversion', period })
        this.conversionData = response.data.data
      } catch (error) {
        console.warn('Conversion API not available, using mock data:', error)
        // Generate mock conversion data
        this.conversionData = this.generateMockConversionData(period)
      } finally {
        this.loading = false
      }
    },

    async fetchTransactionData(period = '30d') {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.getCommerceAnalytics({ type: 'transactions', period })
        this.transactionData = response.data.data
      } catch (error) {
        console.warn('Transaction API not available, using mock data:', error)
        // Generate mock transaction data
        this.transactionData = this.generateMockTransactionData(period)
      } finally {
        this.loading = false
      }
    },

    async fetchPaymentLinkAnalytics() {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.getCommerceAnalytics({ type: 'payment-links' })
        this.paymentLinkAnalytics = response.data.data
      } catch (error) {
        console.warn('Payment link analytics API not available, using mock data:', error)
        // Mock data for development
        this.paymentLinkAnalytics = [
          {
            id: 1,
            name: 'Website Development Quote',
            views: 245,
            clicks: 89,
            conversions: 12,
            conversion_rate: 13.5,
            revenue: 3599.99
          },
          {
            id: 2,
            name: 'Mobile App Development',
            views: 189,
            clicks: 67,
            conversions: 8,
            conversion_rate: 11.9,
            revenue: 4999.99
          },
          {
            id: 3,
            name: 'E-commerce Platform',
            views: 156,
            clicks: 45,
            conversions: 6,
            conversion_rate: 13.3,
            revenue: 7999.99
          }
        ]
      } finally {
        this.loading = false
      }
    },

    async fetchRecentTransactions(limit = 10) {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.getCommerceAnalytics({ type: 'recent-transactions', limit })
        console.log('Recent transactions API response:', response.data)
        this.recentTransactions = response.data.data || []
      } catch (error) {
        console.warn('Recent transactions API not available, using mock data:', error)
        // Mock data for development
        this.recentTransactions = [
          {
            id: 1,
            order_number: 'ORD-2025-001',
            customer_name: 'John Doe',
            amount: 1299.99,
            status: 'completed',
            payment_provider: 'stripe',
            created_at: '2025-10-15T10:30:00Z'
          },
          {
            id: 2,
            order_number: 'ORD-2025-002',
            customer_name: 'Jane Smith',
            amount: 2499.99,
            status: 'pending',
            payment_provider: 'stripe',
            created_at: '2025-10-15T09:15:00Z'
          },
          {
            id: 3,
            order_number: 'ORD-2025-003',
            customer_name: 'Bob Johnson',
            amount: 899.99,
            status: 'failed',
            payment_provider: 'stripe',
            created_at: '2025-10-15T08:45:00Z'
          }
        ]
        console.log('Using mock recent transactions:', this.recentTransactions)
      } finally {
        this.loading = false
      }
    },

    async exportAnalytics(format = 'csv', period = '30d') {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.getCommerceAnalytics({ 
          type: 'export', 
          format, 
          period 
        })
        
        // Create download link
        const blob = new Blob([response.data], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `commerce-analytics-${period}.${format}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        return true
      } catch (error) {
        this.error = 'Failed to export analytics data'
        console.error('Export error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Helper methods for mock data generation
    generateMockRevenueData(period) {
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
      const data = []
      const today = new Date()
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        
        data.push({
          date: date.toISOString().split('T')[0],
          amount: Math.floor(Math.random() * 5000) + 1000,
          orders: Math.floor(Math.random() * 20) + 5
        })
      }
      
      return data
    },

    generateMockConversionData(period) {
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
      const data = []
      const today = new Date()
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        
        data.push({
          date: date.toISOString().split('T')[0],
          rate: Math.floor(Math.random() * 20) + 5,
          views: Math.floor(Math.random() * 200) + 50,
          conversions: Math.floor(Math.random() * 30) + 5
        })
      }
      
      return data
    },

    generateMockTransactionData(period) {
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
      const data = []
      const today = new Date()
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        
        data.push({
          date: date.toISOString().split('T')[0],
          count: Math.floor(Math.random() * 50) + 10,
          amount: Math.floor(Math.random() * 10000) + 2000,
          status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)]
        })
      }
      
      return data
    },

    clearError() {
      this.error = null
    }
  }
})
