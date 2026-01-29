import { defineStore } from 'pinia'
import { commerceAPI } from '@/services/api'
import { useCommerceOrdersStore } from './useCommerceOrdersStore'
import { useCommerceLinksStore } from './useCommerceLinksStore'

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
    // Calculate overview from actual data (orders, payment links, etc.)
    calculateOverviewFromData(ordersStore, linksStore) {
      const orders = ordersStore?.orders || []
      const stats = ordersStore?.stats || { total_orders: 0, total_revenue: 0, average_order_value: 0 }
      
      // Use stats from orders store if available
      const totalOrders = stats.total_orders || orders.length || 0
      const totalRevenue = stats.total_revenue || 0
      const averageOrderValue = stats.average_order_value || 0
      
      // Calculate conversion rate from payment links
      // This is a simplified calculation - you may need to adjust based on your business logic
      const paymentLinks = linksStore?.paymentLinks || []
      const totalViews = paymentLinks.reduce((sum, link) => sum + (link.views || 0), 0)
      const totalConversions = paymentLinks.reduce((sum, link) => sum + (link.conversions || 0), 0)
      const conversionRate = totalViews > 0 ? (totalConversions / totalViews) * 100 : 0
      
      this.overview = {
        total_revenue: parseFloat(totalRevenue.toFixed(2)),
        total_orders: totalOrders,
        conversion_rate: parseFloat(conversionRate.toFixed(2)),
        average_order_value: parseFloat(averageOrderValue.toFixed(2)),
        revenue_growth: 0, // Growth calculations require historical data
        orders_growth: 0,
        conversion_growth: 0,
        aov_growth: 0
      }
      
      console.log('Overview calculated from actual data:', this.overview)
    },

    async fetchOverview() {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.getCommerceAnalytics({ type: 'overview' })
        if (response?.data?.data) {
          this.overview = response.data.data
        } else {
          // If API returns empty data, calculate from actual data
          const ordersStore = useCommerceOrdersStore()
          const linksStore = useCommerceLinksStore()
          this.calculateOverviewFromData(ordersStore, linksStore)
        }
      } catch (error) {
        console.warn('Analytics API not available, calculating from actual data:', error)
        // Calculate from actual data instead of using mock data
        const ordersStore = useCommerceOrdersStore()
        const linksStore = useCommerceLinksStore()
        this.calculateOverviewFromData(ordersStore, linksStore)
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
        console.warn('Revenue API not available, using empty data:', error)
        // Return empty array instead of mock data
        this.revenueData = []
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
        console.warn('Conversion API not available, using empty data:', error)
        // Return empty array instead of mock data
        this.conversionData = []
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
        console.warn('Transaction API not available, using empty data:', error)
        // Return empty array instead of mock data
        this.transactionData = []
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
        console.warn('Payment link analytics API not available, using empty data:', error)
        // Return empty array instead of mock data
        this.paymentLinkAnalytics = []
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
        console.warn('Recent transactions API not available, calculating from orders:', error)
        // Calculate from actual orders data
        const ordersStore = useCommerceOrdersStore()
        const orders = ordersStore.orders || []
        
        // Transform orders to recent transactions format
        this.recentTransactions = orders.slice(0, limit).map(order => ({
          id: order.id,
          order_number: order.order_number || order.id?.toString() || `ORD-${order.id}`,
          customer_name: order.customer_name || order.customer?.name || 'Unknown',
          amount: parseFloat(order.total || order.amount || order.total_amount || 0),
          status: order.status || 'pending',
          payment_provider: order.payment_provider || order.payment_method || 'unknown',
          created_at: order.created_at || new Date().toISOString()
        }))
        
        console.log('Recent transactions calculated from orders:', this.recentTransactions)
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
