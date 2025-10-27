<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form @submit.prevent="handleSubmit">
          <!-- Header -->
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">Edit Order</h3>
              <button
                type="button"
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Form Fields -->
            <div class="space-y-4">
              <!-- Order Status -->
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                <select
                  id="status"
                  v-model="formData.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <!-- Payment Status -->
              <div>
                <label for="payment_status" class="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select
                  id="payment_status"
                  v-model="formData.payment_status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <!-- Customer Name -->
              <div>
                <label for="customer_name" class="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  id="customer_name"
                  v-model="formData.customer_name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <!-- Customer Email -->
              <div>
                <label for="customer_email" class="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
                <input
                  type="email"
                  id="customer_email"
                  v-model="formData.customer_email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <!-- Total Amount -->
              <div>
                <label for="total" class="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                <input
                  type="number"
                  id="total"
                  v-model="formData.total"
                  step="0.01"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <!-- Payment Method -->
              <div>
                <label for="payment_method" class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <input
                  type="text"
                  id="payment_method"
                  v-model="formData.payment_method"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Credit Card, PayPal, etc."
                />
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              :disabled="loading"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Updating...' : 'Update Order' }}
            </button>
            <button
              type="button"
              @click="closeModal"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useCommerceOrdersStore } from '@/stores/useCommerceOrdersStore'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  order: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'updated'])

const ordersStore = useCommerceOrdersStore()

const loading = ref(false)
const formData = ref({
  status: '',
  payment_status: '',
  customer_name: '',
  customer_email: '',
  total: 0,
  payment_method: ''
})

// Watch for order changes to populate form
watch(() => props.order, (newOrder) => {
  if (newOrder) {
    formData.value = {
      status: newOrder.status || '',
      payment_status: newOrder.payment_status || '',
      customer_name: newOrder.customer_name || '',
      customer_email: newOrder.customer_email || '',
      total: newOrder.total || 0,
      payment_method: newOrder.payment_method || ''
    }
  }
}, { immediate: true })

const closeModal = () => {
  emit('close')
}

const handleSubmit = async () => {
  if (!props.order?.id) return

  loading.value = true
  try {
    await ordersStore.updateOrder(props.order.id, formData.value)
    
    // Show success message
    if (window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: 'Order Updated',
        text: 'Order has been updated successfully.',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
    
    emit('updated')
    closeModal()
  } catch (error) {
    console.error('Error updating order:', error)
    
    // Show error message
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.message || 'Failed to update order. Please try again.',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  } finally {
    loading.value = false
  }
}
</script>
