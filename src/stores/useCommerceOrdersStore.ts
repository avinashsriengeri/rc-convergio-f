import { defineStore } from 'pinia'
import { commerceAPI } from '@/services/api'

export const useCommerceOrdersStore = defineStore('commerceOrders', {
  state: () => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    // Aggregate stats used by CommerceOverview
    stats: {
      total_orders: 0,
      total_revenue: 0,
      average_order_value: 0
    },
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    },
    filters: {
      status: '',
      search: '',
      date_from: '',
      date_to: ''
    }
  }),

  getters: {
    totalOrders: (state) => state.pagination.total,
    hasOrders: (state) => state.orders.length > 0,
    ordersByStatus: (state) => (status) => {
      return state.orders.filter(order => order.status === status)
    },
    recentOrders: (state) => {
      return state.orders.slice(0, 5)
    }
  },

  actions: {
    // Fetch orders with pagination and filters
    async fetchOrders(pageOrParams: any = 1, filters: any = {}) {
      this.loading = true
      this.error = null
      
      try {
        // Support both signatures:
        // 1) fetchOrders(page, filters)
        // 2) fetchOrders(paramsObject)
        const params = typeof pageOrParams === 'object'
          ? { per_page: this.pagination.per_page, ...pageOrParams }
          : { page: pageOrParams, per_page: this.pagination.per_page, ...filters }
        
        const response = await commerceAPI.getOrders(params)
        
        if (response.data?.data) {
          this.orders = response.data.data
          this.pagination = {
            current_page: response.data.current_page,
            last_page: response.data.last_page,
            per_page: response.data.per_page,
            total: response.data.total
          }
        }
        
        // Recalculate stats after fetching orders
        this.calculateStatsFromOrders()
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch orders'
        console.error('Error fetching orders:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Calculate stats from actual orders data
    calculateStatsFromOrders() {
      const orders = this.orders || []
      
      if (orders.length === 0) {
        this.stats = {
          total_orders: 0,
          total_revenue: 0,
          average_order_value: 0
        }
        return this.stats
      }
      
      // Calculate total orders
      const totalOrders = orders.length
      
      // Calculate total revenue (sum of all order amounts)
      const totalRevenue = orders.reduce((sum, order) => {
        // Handle different possible field names for amount
        const amount = order.total || order.amount || order.total_amount || 0
        return sum + parseFloat(amount || 0)
      }, 0)
      
      // Calculate average order value
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
      
      this.stats = {
        total_orders: totalOrders,
        total_revenue: parseFloat(totalRevenue.toFixed(2)),
        average_order_value: parseFloat(averageOrderValue.toFixed(2))
      }
      
      console.log('Stats calculated from orders:', this.stats)
      return this.stats
    },

    // Fetch order stats used by the overview cards
    async fetchStats() {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.getOrderStats()
        const payload = response?.data?.data || response?.data || {}
        this.stats = {
          total_orders: Number(payload.total_orders || 0),
          total_revenue: Number(payload.total_revenue || 0),
          average_order_value: Number(payload.average_order_value || 0)
        }
        return this.stats
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch order stats'
        console.error('Error fetching order stats:', error)
        // Calculate from actual orders data as fallback
        this.calculateStatsFromOrders()
        return this.stats
      } finally {
        this.loading = false
      }
    },

    // Fetch single order by ID
    async fetchOrder(orderId) {
      this.loading = true
      this.error = null
      
      try {
        const response = await commerceAPI.getOrder(orderId)
        
        if (response.data?.data) {
          this.currentOrder = response.data.data
        }
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch order'
        console.error('Error fetching order:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Create new order
    async createOrder(orderData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await commerceAPI.createOrder(orderData)
        
        if (response.data?.data) {
          this.orders.unshift(response.data.data)
        }
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create order'
        console.error('Error creating order:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Update order
    async updateOrder(orderId, orderData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await commerceAPI.updateOrder(orderId, orderData)
        
        if (response.data?.data) {
          const index = this.orders.findIndex(order => order.id === orderId)
          if (index !== -1) {
            this.orders[index] = response.data.data
          }
          
          if (this.currentOrder?.id === orderId) {
            this.currentOrder = response.data.data
          }
        }
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update order'
        console.error('Error updating order:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Update order status
    async updateOrderStatus(orderId, status) {
      this.loading = true
      this.error = null
      
      try {
        const response = await commerceAPI.updateOrderStatus(orderId, { status })
        
        if (response.data?.data) {
          const index = this.orders.findIndex(order => order.id === orderId)
          if (index !== -1) {
            this.orders[index].status = status
          }
          
          if (this.currentOrder?.id === orderId) {
            this.currentOrder.status = status
          }
        }
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update order status'
        console.error('Error updating order status:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Delete order
    async deleteOrder(orderId) {
      this.loading = true
      this.error = null
      
      try {
        const response = await commerceAPI.deleteOrder(orderId)
        
        this.orders = this.orders.filter(order => order.id !== orderId)
        
        if (this.currentOrder?.id === orderId) {
          this.currentOrder = null
        }
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete order'
        console.error('Error deleting order:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Set filters
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    // Clear filters
    clearFilters() {
      this.filters = {
        status: '',
        search: '',
        date_from: '',
        date_to: ''
      }
    },

    // Clear error
    clearError() {
      this.error = null
    },

    // Set current order
    setCurrentOrder(order) {
      this.currentOrder = order
    },

    // Clear current order
    clearCurrentOrder() {
      this.currentOrder = null
    }
  }
})