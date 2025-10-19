import { defineStore } from 'pinia'
import { commerceAPI } from '@/services/api'

export interface Order {
  id: string | number
  order_number: string
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'
  customer_name: string
  customer_email: string
  created_at: string
  updated_at: string
  items: OrderItem[]
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method?: string
}

export interface OrderItem {
  id: string | number
  name: string
  quantity: number
  price: number
  total: number
  product_id?: string | number
}

export interface OrderStats {
  total_orders: number
  total_revenue: number
  pending_orders: number
  completed_orders: number
  average_order_value: number
  orders_today: number
  revenue_today: number
}

export const useCommerceOrdersStore = defineStore('commerceOrders', {
  state: () => ({
    orders: [] as Order[],
    currentOrder: null as Order | null,
    stats: {} as OrderStats,
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
    getOrderById: (state) => (id: string | number) => {
      return state.orders.find(order => order.id === id)
    },
    
    getOrdersByStatus: (state) => (status: string) => {
      return state.orders.filter(order => order.status === status)
    },
    
    totalRevenue: (state) => {
      return state.orders.reduce((sum, order) => sum + order.total, 0)
    }
  },

  actions: {
    async fetchOrders(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.getOrders(params)
        this.orders = response.data.data
        this.pagination = response.data.meta
      } catch (error) {
        // For development, add mock data when API fails
        console.warn('API not available, using mock data:', error)
        this.orders = [
          {
            id: 1,
            order_number: 'ORD-2025-68EEB708CF48E',
            customer_name: 'John Doe',
            customer_email: 'john@example.com',
            total: 299.99,
            status: 'paid',
            payment_status: 'completed',
            created_at: '2025-10-15T02:18:00Z',
            items: []
          },
          {
            id: 2,
            order_number: 'ORD-2025-68EEB7088050D',
            customer_name: 'Jane Smith',
            customer_email: 'jane@example.com',
            total: 149.50,
            status: 'pending',
            payment_status: 'pending',
            created_at: '2025-10-15T02:18:00Z',
            items: []
          },
          {
            id: 3,
            order_number: 'ORD-2025-IIEOJV',
            customer_name: 'Bob Johnson',
            customer_email: 'bob@example.com',
            total: 89.99,
            status: 'failed',
            payment_status: 'failed',
            created_at: '2025-10-15T02:18:00Z',
            items: []
          },
          {
            id: 4,
            order_number: 'ORD-2025-68EEB6F468A76',
            customer_name: 'Alice Wilson',
            customer_email: 'alice@example.com',
            total: 450.00,
            status: 'paid',
            payment_status: 'completed',
            created_at: '2025-10-15T02:17:00Z',
            items: []
          },
          {
            id: 5,
            order_number: 'ORD-2025-68EEB6F44BB4C',
            customer_name: 'Charlie Brown',
            customer_email: 'charlie@example.com',
            total: 199.99,
            status: 'pending',
            payment_status: 'pending',
            created_at: '2025-10-15T02:17:00Z',
            items: []
          },
          {
            id: 6,
            order_number: 'ORD-2025-TJGTDK',
            customer_name: 'Diana Prince',
            customer_email: 'diana@example.com',
            total: 750.50,
            status: 'refunded',
            payment_status: 'refunded',
            created_at: '2025-10-15T02:17:00Z',
            items: []
          },
          {
            id: 7,
            order_number: 'ORD-2025-AYVOJT',
            customer_name: 'Eva Martinez',
            customer_email: 'eva@example.com',
            total: 320.00,
            status: 'paid',
            payment_status: 'completed',
            created_at: '2025-10-15T02:17:00Z',
            items: []
          },
          {
            id: 8,
            order_number: 'ORD-2025-TWAXLV',
            customer_name: 'Frank Miller',
            customer_email: 'frank@example.com',
            total: 125.75,
            status: 'refunded',
            payment_status: 'refunded',
            created_at: '2025-10-15T02:17:00Z',
            items: []
          }
        ]
        this.pagination = {
          current_page: 1,
          last_page: 1,
          per_page: 15,
          total: 8
        }
      } finally {
        this.loading = false
      }
    },

    async fetchOrder(id: string | number) {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.getOrder(id)
        this.currentOrder = response.data.data
        return response.data.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch order'
        console.error('Error fetching order:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchStats() {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.getOrderStats()
        this.stats = response.data.data
      } catch (error) {
        // For development, add mock data when API fails
        console.warn('API not available, using mock stats:', error)
        this.stats = {
          total_orders: 156,
          total_revenue: 45678.90,
          pending_orders: 12,
          completed_orders: 134,
          average_order_value: 292.81,
          orders_today: 8,
          revenue_today: 2345.67
        }
      } finally {
        this.loading = false
      }
    },

    async updateOrder(id: string | number, payload: any) {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.updateOrder(id, payload)
        const updatedOrder = response.data.data
        const index = this.orders.findIndex(order => order.id === id)
        if (index !== -1) {
          this.orders[index] = updatedOrder
        }
        return updatedOrder
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update order'
        console.error('Error updating order:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteOrder(id) {
      this.loading = true
      this.error = null
      try {
        await commerceAPI.deleteOrder(id)
        this.orders = this.orders.filter(order => order.id !== id)
        // Update pagination total
        this.pagination.total = Math.max(0, this.pagination.total - 1)
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete order'
        console.error('Error deleting order:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async exportOrders(format = 'csv') {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.exportOrders({ format })
        
        // Create download link
        const blob = new Blob([response.data], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `orders-export.${format}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        return true
      } catch (error) {
        this.error = 'Failed to export orders data'
        console.error('Export error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    },

    clearCurrentOrder() {
      this.currentOrder = null
    }
  }
})
