<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <!-- Header -->
        <div class="bg-white px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              Order Details - #{{ detailedOrder?.order_number || order.order_number }}
            </h3>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="bg-white px-6 py-6">
          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center py-8">
            <div class="flex items-center space-x-2">
              <svg class="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-sm text-gray-600">Loading order details...</span>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="flex items-center justify-center py-8">
            <div class="text-center">
              <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading order</h3>
              <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
            </div>
          </div>

          <!-- Order Details -->
          <div v-else-if="detailedOrder" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Order Information -->
            <div>
              <h4 class="text-lg font-medium text-gray-900 mb-4">Order Information</h4>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Order Number</label>
                  <p class="mt-1 text-sm text-gray-900">#{{ detailedOrder?.order_number || order.order_number }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Status</label>
                  <span
                    :class="getStatusColor(detailedOrder?.status || order.status)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ detailedOrder?.status || order.status }}
                  </span>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Payment Status</label>
                  <span
                    :class="getPaymentStatusColor(detailedOrder?.status || order.payment_status)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ detailedOrder?.status || order.payment_status || 'N/A' }}
                  </span>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Subtotal</label>
                  <p class="mt-1 text-sm text-gray-900">${{ formatCurrency(detailedOrder?.subtotal || 0) }}</p>
                </div>

                <div v-if="detailedOrder?.tax && parseFloat(detailedOrder.tax) > 0">
                  <label class="block text-sm font-medium text-gray-700">Tax</label>
                  <p class="mt-1 text-sm text-gray-900">${{ formatCurrency(detailedOrder.tax) }}</p>
                </div>

                <div v-if="detailedOrder?.discount && parseFloat(detailedOrder.discount) > 0">
                  <label class="block text-sm font-medium text-gray-700">Discount</label>
                  <p class="mt-1 text-sm text-gray-900">-${{ formatCurrency(detailedOrder.discount) }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Total Amount</label>
                  <p class="mt-1 text-lg font-semibold text-gray-900">${{ formatCurrency(detailedOrder?.total_amount || detailedOrder?.total || order.total || 0) }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Created</label>
                  <p class="mt-1 text-sm text-gray-900">{{ formatDate(detailedOrder?.created_at || order.created_at) }}</p>
                </div>

                <div v-if="detailedOrder?.payment_method || order.payment_method">
                  <label class="block text-sm font-medium text-gray-700">Payment Method</label>
                  <p class="mt-1 text-sm text-gray-900">{{ detailedOrder?.payment_method || order.payment_method }}</p>
                </div>

                <div v-if="detailedOrder?.payment_reference">
                  <label class="block text-sm font-medium text-gray-700">Payment Reference</label>
                  <p class="mt-1 text-sm text-gray-900 font-mono">{{ detailedOrder.payment_reference }}</p>
                </div>

                <div v-if="detailedOrder?.currency">
                  <label class="block text-sm font-medium text-gray-700">Currency</label>
                  <p class="mt-1 text-sm text-gray-900">{{ detailedOrder.currency }}</p>
                </div>
              </div>
            </div>

            <!-- Customer Information -->
            <div>
              <h4 class="text-lg font-medium text-gray-900 mb-4">Customer Information</h4>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Deal Title</label>
                  <p class="mt-1 text-sm text-gray-900">{{ detailedOrder?.deal?.title || detailedOrder?.customer_name || order.customer_name || 'N/A' }}</p>
                </div>

                <div v-if="detailedOrder?.deal?.description">
                  <label class="block text-sm font-medium text-gray-700">Description</label>
                  <p class="mt-1 text-sm text-gray-900">{{ detailedOrder.deal.description }}</p>
                </div>

                <div v-if="detailedOrder?.deal?.value">
                  <label class="block text-sm font-medium text-gray-700">Deal Value</label>
                  <p class="mt-1 text-sm text-gray-900">${{ formatCurrency(detailedOrder.deal.value) }}</p>
                </div>

                <div v-if="detailedOrder?.quote?.quote_number">
                  <label class="block text-sm font-medium text-gray-700">Quote Number</label>
                  <p class="mt-1 text-sm text-gray-900 font-mono">{{ detailedOrder.quote.quote_number }}</p>
                </div>

                <div v-if="detailedOrder?.customer_snapshot?.quote_number">
                  <label class="block text-sm font-medium text-gray-700">Customer Quote</label>
                  <p class="mt-1 text-sm text-gray-900">{{ detailedOrder.customer_snapshot.quote_number }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="mt-8">
            <h4 class="text-lg font-medium text-gray-900 mb-4">Order Items</h4>
            
            <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="(detailedOrder?.items || order.items || []).length === 0">
                    <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                      No items found
                    </td>
                  </tr>
                  <tr v-else v-for="item in (detailedOrder?.items || order.items || [])" :key="item.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                      <div v-if="item.product_id" class="text-sm text-gray-500">
                        Product ID: {{ item.product_id }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ item.quantity }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${{ formatCurrency(item.unit_price || item.price || 0) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${{ formatCurrency(item.subtotal || item.total || 0) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td colspan="3" class="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      Total:
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      ${{ formatCurrency(detailedOrder?.total_amount || detailedOrder?.total || order.total || 0) }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button
            @click="$emit('close')"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple"
          >
            Close
          </button>
          <button
            v-if="order.payment_status === 'pending'"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Mark as Paid
          </button>
          <button
            v-if="order.status === 'processing'"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Mark as Completed
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useCommerceOrdersStore } from '@/stores/useCommerceOrdersStore'

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const ordersStore = useCommerceOrdersStore()
const detailedOrder = ref(null)
const loading = ref(false)
const error = ref(null)

// Fetch detailed order data when modal opens
const fetchOrderDetails = async () => {
  if (!props.order?.id) return
  
  loading.value = true
  error.value = null
  
  try {
    const orderData = await ordersStore.fetchOrder(props.order.id)
    detailedOrder.value = orderData
  } catch (err) {
    console.error('Error fetching order details:', err)
    error.value = 'Failed to load order details'
    // Fallback to the passed order data
    detailedOrder.value = props.order
  } finally {
    loading.value = false
  }
}

// Watch for order changes and fetch details
watch(() => props.order, () => {
  if (props.order) {
    fetchOrderDetails()
  }
}, { immediate: true })

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
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
</script>
