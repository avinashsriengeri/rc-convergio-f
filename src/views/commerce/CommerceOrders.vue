<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-xl font-bold text-gray-900">Orders</h1>
              <p class="text-sm text-gray-600">Manage and track all customer orders</p>
            </div>
            <div class="flex items-center space-x-3">
              <button
                @click="exportOrders"
                :disabled="loading"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Export Orders
              </button>
              <button
                @click="refreshOrders"
                :disabled="loading"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction Analytics Cards -->
    <div class="bg-gray-50 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <!-- Total Paid -->
          <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-3">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Paid</p>
                <p class="text-xl font-bold text-gray-900">${{ formatCurrency(transactionStats.totalPaid) }}</p>
              </div>
            </div>
          </div>

          <!-- Failed Transactions -->
          <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <div class="ml-3">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Failed</p>
                <p class="text-xl font-bold text-gray-900">{{ transactionStats.failedCount }}</p>
              </div>
            </div>
          </div>

          <!-- Refunded -->
          <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>
              <div class="ml-3">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Refunded</p>
                <p class="text-xl font-bold text-gray-900">${{ formatCurrency(transactionStats.totalRefunded) }}</p>
              </div>
            </div>
          </div>

          <!-- Success Rate -->
          <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div class="ml-3">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</p>
                <p class="text-xl font-bold text-gray-900">{{ transactionStats.successRate }}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search orders..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <!-- Status Filter -->
          <div class="sm:w-48">
            <select
              v-model="statusFilter"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <!-- Date Range -->
          <div class="sm:w-48">
            <select
              v-model="dateFilter"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Orders Table -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div v-if="loading" class="p-8">
          <div class="animate-pulse space-y-4">
            <div v-for="i in 5" :key="i" class="flex space-x-4">
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>

        <div v-else-if="filteredOrders.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating your first payment link.</p>
          <div class="mt-6">
            <router-link to="/commerce/payment-links">
              <BaseButton variant="primary" size="md">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Payment Link
              </BaseButton>
            </router-link>
          </div>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="order in paginatedOrders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">#{{ order.order_number }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ getCustomerName(order) }}</div>
                  <div class="text-sm text-gray-500">{{ getCustomerEmail(order) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">${{ formatCurrency(order.total_amount || 0) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusColor(order.status)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getPaymentStatusColor(order.status)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-6 w-6">
                      <img v-if="getPaymentProvider(order) === 'stripe'" class="h-6 w-6" src="https://js.stripe.com/v3/fingerprinted/img/stripe-logo-192x192.png" alt="Stripe" />
                      <div v-else class="h-6 w-6 bg-gray-200 rounded flex items-center justify-center">
                        <span class="text-xs font-medium text-gray-600">{{ getPaymentProvider(order).charAt(0).toUpperCase() }}</span>
                      </div>
                    </div>
                    <div class="ml-2">
                      <div class="text-sm font-medium text-gray-900">{{ getPaymentProvider(order) }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="viewOrderDetails(order)"
                      class="text-blue-600 hover:text-blue-700"
                    >
                      View Details
                    </button>
                    <button
                      @click="editOrder(order)"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteOrder(order)"
                      class="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredOrders.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                to
                <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredOrders.length) }}</span>
                of
                <span class="font-medium">{{ filteredOrders.length }}</span>
                results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    page === currentPage
                      ? 'z-10 bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <OrderDetailModal
      v-if="selectedOrder"
      :order="selectedOrder"
      @close="selectedOrder = null"
    />

    <!-- Order Edit Modal -->
    <OrderEditModal
      :show="showEditModal"
      :order="editingOrder"
      @close="closeEditModal"
      @updated="handleOrderUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCommerceOrdersStore } from '@/stores/useCommerceOrdersStore'
import OrderDetailModal from '@/components/commerce/OrderDetailModal.vue'
import OrderEditModal from '@/components/commerce/OrderEditModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const ordersStore = useCommerceOrdersStore()

const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const dateFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(15)
const selectedOrder = ref(null)
const showEditModal = ref(false)
const editingOrder = ref(null)
const transactionStats = ref({
  totalPaid: 0,
  failedCount: 0,
  totalRefunded: 0,
  successRate: 0
})

const orders = computed(() => ordersStore.orders)

const filteredOrders = computed(() => {
  let filtered = orders.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(order =>
      order.order_number.toLowerCase().includes(query) ||
      getCustomerName(order).toLowerCase().includes(query) ||
      getCustomerEmail(order).toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value)
  }

  // Date filter
  if (dateFilter.value) {
    const now = new Date()
    const orderDate = new Date()
    
    switch (dateFilter.value) {
      case 'today':
        filtered = filtered.filter(order => {
          orderDate.setTime(new Date(order.created_at).getTime())
          return orderDate.toDateString() === now.toDateString()
        })
        break
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(order => new Date(order.created_at) >= weekAgo)
        break
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(order => new Date(order.created_at) >= monthAgo)
        break
      case 'quarter':
        const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(order => new Date(order.created_at) >= quarterAgo)
        break
    }
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage.value))

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredOrders.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const refreshOrders = async () => {
  loading.value = true
  try {
    await Promise.all([
      ordersStore.fetchOrders(),
      fetchTransactionStats()
    ])
  } catch (error) {
    console.error('Error refreshing orders:', error)
} finally {
    loading.value = false
  }
}

const fetchTransactionStats = async () => {
  try {
    // Calculate transaction stats from actual order data
    const orders = ordersStore.orders
    const totalPaid = orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0)
    const failedCount = orders.filter(o => o.status === 'failed').length
    const totalRefunded = orders.filter(o => o.status === 'refunded').reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0)
    const successRate = orders.length > 0 ? ((orders.filter(o => o.status === 'paid').length / orders.length) * 100).toFixed(1) : 0

    transactionStats.value = {
      totalPaid,
      failedCount,
      totalRefunded,
      successRate
    }
  } catch (error) {
    console.error('Error fetching transaction stats:', error)
  }
}

const exportOrders = async () => {
  try {
    await ordersStore.exportOrders('csv')
    if (window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: 'Export Successful!',
        text: 'Orders data has been exported successfully',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  } catch (error) {
    console.error('Error exporting orders:', error)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Export Failed',
        text: 'Failed to export orders data',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  }
}

const viewOrderDetails = (order) => {
  selectedOrder.value = order
}

const editOrder = (order) => {
  editingOrder.value = order
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingOrder.value = null
}

const handleOrderUpdated = () => {
  // Refresh orders after update
  refreshOrders()
}

const deleteOrder = async (order) => {
  // Use SweetAlert2 for better confirmation dialog
  if (window.Swal) {
    const result = await window.Swal.fire({
      title: 'Are you sure?',
      text: `You won't be able to revert this! Order ${order.order_number} will be permanently deleted.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        await ordersStore.deleteOrder(order.id)
        window.Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `Order ${order.order_number} has been deleted successfully`,
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
        // Refresh the orders list
        refreshOrders()
      } catch (error) {
        console.error('Error deleting order:', error)
        window.Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: error.response?.data?.message || 'Failed to delete order',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
      }
    }
  } else {
    // Fallback to confirm dialog
    if (confirm(`Are you sure you want to delete order ${order.order_number}?`)) {
      try {
        await ordersStore.deleteOrder(order.id)
        console.log('Order deleted successfully')
        refreshOrders()
      } catch (error) {
        console.error('Error deleting order:', error)
        alert('Failed to delete order: ' + (error.response?.data?.message || error.message))
      }
    }
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const getCustomerName = (order) => {
  // Try to get customer name from contact, deal, or quote
  if (order.contact && order.contact.name) {
    return order.contact.name
  }
  if (order.deal && order.deal.contact && order.deal.contact.name) {
    return order.deal.contact.name
  }
  if (order.customer_snapshot && order.customer_snapshot.customer_name) {
    return order.customer_snapshot.customer_name
  }
  return 'N/A'
}

const getCustomerEmail = (order) => {
  // Try to get customer email from contact, deal, or quote
  if (order.contact && order.contact.email) {
    return order.contact.email
  }
  if (order.deal && order.deal.contact && order.deal.contact.email) {
    return order.deal.contact.email
  }
  if (order.customer_snapshot && order.customer_snapshot.customer_email) {
    return order.customer_snapshot.customer_email
  }
  return 'N/A'
}

const getPaymentProvider = (order) => {
  // Determine payment provider from payment method
  if (order.payment_method === 'card' && order.payment_reference && order.payment_reference.includes('stripe')) {
    return 'stripe'
  }
  if (order.payment_method === 'test_card') {
    return 'test'
  }
  if (order.payment_method) {
    return order.payment_method
  }
  return 'N/A'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getPaymentStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page) => {
  currentPage.value = page
}

// Reset to first page when filters change
watch([searchQuery, statusFilter, dateFilter], () => {
  currentPage.value = 1
})

onMounted(() => {
  refreshOrders()
})
</script>
