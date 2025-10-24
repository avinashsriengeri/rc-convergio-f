<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading quote...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center max-w-md mx-auto p-6">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <h3 class="text-lg font-medium text-red-800 mb-2">Quote Not Found</h3>
          <p class="text-red-600">This quote may have expired or the link is invalid.</p>
        </div>
      </div>
    </div>

    <!-- Quote Content -->
    <div v-else-if="quote" class="max-w-4xl mx-auto p-6">
      <!-- Header -->
      <div class="bg-white shadow-sm rounded-lg p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900 mb-2">
              Quote #{{ quote.quote_number }}
            </h1>
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Created {{ formatDate(quote.created_at) }}
              </div>
              <div v-if="quote.valid_until" class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Valid until {{ formatDate(quote.valid_until) }}
              </div>
            </div>
          </div>
          <div class="text-right">
            <span :class="getStatusBadgeClass(quote.status)" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
              {{ quote.status }}
            </span>
          </div>
        </div>

        <!-- Status Messages -->
        <div v-if="quote.status === 'accepted'" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <p class="text-green-800 font-medium">✅ Quote accepted successfully!</p>
          </div>
        </div>

        <div v-else-if="quote.status === 'rejected'" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <p class="text-red-800 font-medium">❌ Quote rejected</p>
          </div>
        </div>

        <div v-else-if="isExpired" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <p class="text-yellow-800 font-medium">⚠️ Quote expired</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Client Information -->
        <div class="lg:col-span-1">
          <div class="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Client Information</h3>
            <div class="space-y-3">
              <div>
                <label class="text-sm font-medium text-gray-500">Contact Name</label>
                <p class="text-gray-900">{{ quote.contact_name || 'N/A' }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Email</label>
                <p class="text-gray-900">{{ quote.contact_email || 'N/A' }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Company</label>
                <p class="text-gray-900">{{ quote.company_name || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Terms & Conditions -->
          <div v-if="quote.terms" class="bg-white shadow-sm rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Terms & Conditions</h3>
            <div class="text-sm text-gray-700 whitespace-pre-line">{{ quote.terms }}</div>
          </div>
        </div>

        <!-- Quote Details -->
        <div class="lg:col-span-2">
          <!-- Line Items -->
          <div class="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Quote Items</h3>
            
            <!-- Desktop Table -->
            <div class="hidden md:block overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                    <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                    <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tax</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(item, index) in quote.items" :key="index">
                    <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ item.name }}
                    </td>
                    <td class="px-4 py-4 text-sm text-gray-500">
                      {{ item.description }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {{ item.quantity }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      ${{ formatCurrency(item.unit_price) }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      ${{ formatCurrency(item.discount) }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {{ item.tax_rate }}%
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      ${{ formatCurrency(item.total) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile Cards -->
            <div class="md:hidden space-y-4">
              <div v-for="(item, index) in quote.items" :key="index" class="border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium text-gray-900">{{ item.name }}</h4>
                  <span class="text-sm font-medium text-gray-900">${{ formatCurrency(item.total) }}</span>
                </div>
                <p v-if="item.description" class="text-sm text-gray-600 mb-2">{{ item.description }}</p>
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span class="text-gray-500">Qty:</span>
                    <span class="ml-1">{{ item.quantity }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Unit Price:</span>
                    <span class="ml-1">${{ formatCurrency(item.unit_price) }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Discount:</span>
                    <span class="ml-1">${{ formatCurrency(item.discount) }}</span>
                  </div>
                  <div>
                    <span class="text-gray-500">Tax:</span>
                    <span class="ml-1">{{ item.tax_rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Totals Summary -->
          <div class="bg-white shadow-sm rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Quote Summary</h3>
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal:</span>
                <span class="font-medium text-gray-900">${{ formatCurrency(quote.subtotal) }}</span>
              </div>
              <div v-if="quote.discount > 0" class="flex justify-between text-sm">
                <span class="text-gray-600">Discount:</span>
                <span class="font-medium text-red-600">-${{ formatCurrency(quote.discount) }}</span>
              </div>
              <div v-if="quote.tax > 0" class="flex justify-between text-sm">
                <span class="text-gray-600">Tax:</span>
                <span class="font-medium text-gray-900">${{ formatCurrency(quote.tax) }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold border-t border-gray-300 pt-3 mt-3">
                <span class="text-gray-900">Total:</span>
                <span class="text-blue-600">${{ formatCurrency(quote.total) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="showActionButtons" class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="handleAccept"
          :disabled="actionLoading"
          class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <svg v-if="!actionLoading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <div v-if="actionLoading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          {{ actionLoading ? 'Processing...' : 'Accept Quote' }}
        </button>

        <button
          @click="handleReject"
          :disabled="actionLoading"
          class="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <svg v-if="!actionLoading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <div v-if="actionLoading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          {{ actionLoading ? 'Processing...' : 'Reject Quote' }}
        </button>
      </div>
    </div>

    <!-- Confirmation Modals -->
    <div v-if="showAcceptModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Accept Quote</h3>
        <p class="text-gray-600 mb-6">Are you sure you want to accept this quote? This action cannot be undone.</p>
        <div class="flex space-x-3">
          <button
            @click="showAcceptModal = false"
            class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmAccept"
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Accept Quote
          </button>
        </div>
      </div>
    </div>

    <div v-if="showRejectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Reject Quote</h3>
        <p class="text-gray-600 mb-6">Are you sure you want to reject this quote? This action cannot be undone.</p>
        <div class="flex space-x-3">
          <button
            @click="showRejectModal = false"
            class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmReject"
            class="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Reject Quote
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { publicQuotesAPI } from '@/services/publicQuotesAPI'
import { success, error as showError } from '@/utils/notifications'

const route = useRoute()

// Reactive data
const quote = ref(null)
const loading = ref(true)
const error = ref(false)
const actionLoading = ref(false)
const showAcceptModal = ref(false)
const showRejectModal = ref(false)

// Computed properties
const isExpired = computed(() => {
  if (!quote.value?.valid_until) return false
  return new Date(quote.value.valid_until) < new Date()
})

const showActionButtons = computed(() => {
  if (!quote.value) return false
  return quote.value.status === 'sent' && !isExpired.value
})

// Methods
const loadQuote = async () => {
  try {
    const { uuid } = route.params
    const response = await publicQuotesAPI.get(uuid)
    quote.value = response.data.data || response.data
  } catch (err) {
    console.error('Error loading quote:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

const handleAccept = () => {
  showAcceptModal.value = true
}

const handleReject = () => {
  showRejectModal.value = true
}

const confirmAccept = async () => {
  actionLoading.value = true
  showAcceptModal.value = false
  
  try {
    await publicQuotesAPI.accept(quote.value.uuid)
    success('✅ Quote accepted successfully!')
    quote.value.status = 'accepted'
  } catch (err) {
    console.error('Error accepting quote:', err)
    showError('Failed to accept quote.')
  } finally {
    actionLoading.value = false
  }
}

const confirmReject = async () => {
  actionLoading.value = true
  showRejectModal.value = false
  
  try {
    await publicQuotesAPI.reject(quote.value.uuid)
    success('❌ Quote rejected.')
    quote.value.status = 'rejected'
  } catch (err) {
    console.error('Error rejecting quote:', err)
    showError('Failed to reject quote.')
  } finally {
    actionLoading.value = false
  }
}

const formatCurrency = (amount) => {
  if (!amount) return '0.00'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStatusBadgeClass = (status) => {
  const classes = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    expired: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Lifecycle
onMounted(() => {
  loadQuote()
})
</script>

<style scoped>
/* Additional custom styles if needed */
</style>





