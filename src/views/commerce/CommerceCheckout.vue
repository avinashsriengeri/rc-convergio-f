<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary-purple border-t-transparent mx-auto"></div>
        <p class="mt-6 text-lg font-medium text-gray-700">Loading your checkout...</p>
        <p class="mt-2 text-sm text-gray-500">Please wait while we prepare your order</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen px-4">
      <div class="text-center max-w-lg mx-auto">
        <div class="bg-white rounded-2xl shadow-xl border border-red-100 p-8">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Payment Link Not Available</h3>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <button 
            @click="loadPaymentLink"
            class="inline-flex items-center px-6 py-3 bg-primary-purple text-white font-medium rounded-lg hover:bg-primary-purple-600 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    </div>

    <!-- Checkout Content -->
    <div v-else-if="paymentLink" class="min-h-screen">
      <!-- Header with Branding -->
      <div class="bg-white shadow-sm border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-purple to-blue-600 rounded-xl flex items-center justify-center">
                <span class="text-white font-bold text-lg">RC</span>
              </div>
              <div>
                <h1 class="text-xl font-bold text-gray-900">RC Convergio</h1>
                <p class="text-sm text-gray-500">Business Transformation Suite</p>
              </div>
            </div>
            <div class="flex items-center space-x-2 text-sm text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Page Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Complete Your Purchase</h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">Review your order details and proceed with secure payment. Your transaction is protected with enterprise-grade security.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Order Summary -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <!-- Header -->
              <div class="bg-gradient-to-r from-primary-purple to-blue-600 px-8 py-6">
                <h2 class="text-2xl font-bold text-white flex items-center">
                  <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Order Summary
                </h2>
              </div>
              
              <div class="p-8">
                <!-- Quote Information -->
                <div v-if="paymentLink.quote" class="mb-8">
                  <div class="flex items-center justify-between mb-6">
                    <div>
                      <h3 class="text-xl font-semibold text-gray-900">{{ paymentLink.quote.title || 'Professional Services' }}</h3>
                      <p class="text-sm text-gray-500 mt-1">Quote #{{ paymentLink.quote.quote_number }}</p>
                    </div>
                    <div class="text-right">
                      <div class="text-sm text-gray-500">Valid Until</div>
                      <div class="font-medium text-gray-900">{{ formatDate(paymentLink.quote.valid_until) }}</div>
                    </div>
                  </div>
                  
                  <!-- Quote Items -->
                  <div class="space-y-4">
                    <div v-for="item in paymentLink.quote.items" :key="item.id" class="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0">
                      <div class="flex-1">
                        <p class="font-medium text-gray-900">{{ item.name }}</p>
                        <p class="text-sm text-gray-500 mt-1">{{ item.description || 'Professional service' }}</p>
                        <div class="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                          <span>Qty: {{ item.quantity }}</span>
                          <span>Rate: ${{ formatCurrency(item.unit_price || item.price) }}</span>
                        </div>
                      </div>
                      <div class="text-right">
                        <p class="text-lg font-semibold text-primary-purple">${{ formatCurrency((item.unit_price || item.price) * item.quantity) }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Payment Link Information -->
                <div class="bg-gray-50 rounded-xl p-6">
                  <h4 class="font-semibold text-gray-900 mb-4">Payment Details</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span class="text-sm text-gray-500">Payment Link ID</span>
                      <p class="font-medium text-gray-900">{{ paymentLink.payment_link?.id || 'N/A' }}</p>
                    </div>
                    <div>
                      <span class="text-sm text-gray-500">Status</span>
                      <div class="mt-1">
                        <span :class="getStatusBadgeClass(paymentLink.payment_link?.status)" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                          {{ paymentLink.payment_link?.status || 'N/A' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Information -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-8">
              <!-- Header -->
              <div class="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
                <h2 class="text-xl font-bold text-white flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Payment
                </h2>
              </div>
              
              <div class="p-6">
                <!-- Total Amount -->
                <div class="text-center mb-6">
                  <div class="text-sm text-gray-500 mb-2">Total Amount</div>
                  <div class="text-4xl font-bold text-gray-900">${{ formatCurrency(getTotalAmount()) }}</div>
                  <div class="text-sm text-gray-500 mt-1">USD</div>
                </div>

                <!-- Payment Button -->
                <button
                  @click="proceedToPayment"
                  :disabled="processing"
                  class="w-full bg-gradient-to-r from-primary-purple to-blue-600 hover:from-primary-purple-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg v-if="processing" class="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span class="text-lg">{{ processing ? 'Processing...' : 'Pay Now' }}</span>
                </button>

                <!-- Security Features -->
                <div class="mt-6 space-y-4">
                  <!-- Security Notice -->
                  <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div class="flex items-start space-x-3">
                      <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <h4 class="text-sm font-semibold text-blue-900">Bank-Level Security</h4>
                        <p class="text-sm text-blue-700 mt-1">Your payment is processed securely through Stripe with 256-bit SSL encryption.</p>
                      </div>
                    </div>
                  </div>

                  <!-- Trust Badges -->
                  <div class="flex items-center justify-center space-x-6 py-4">
                    <div class="text-center">
                      <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p class="text-xs text-gray-500">SSL Secured</p>
                    </div>
                    <div class="text-center">
                      <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p class="text-xs text-gray-500">Fast Processing</p>
                    </div>
                    <div class="text-center">
                      <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <svg class="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <p class="text-xs text-gray-500">Trusted</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const loading = ref(true)
const processing = ref(false)
const error = ref('')
const paymentLink = ref(null)

const loadPaymentLink = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const linkId = route.params.id
    // Use the public checkout endpoint
    const response = await fetch(`/api/commerce/payment-links/${linkId}/checkout`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    paymentLink.value = data.data
  } catch (err) {
    console.error('Error loading payment link:', err)
    error.value = err.message || 'Payment link not found or expired'
  } finally {
    loading.value = false
  }
}

const proceedToPayment = async () => {
  if (!paymentLink.value) return
  
  processing.value = true
  
  try {
    // In a real implementation, this would redirect to Stripe Checkout
    // For now, we'll simulate the payment process
    const response = await fetch(`/api/commerce/payment-links/${paymentLink.value.payment_link.id}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      // Redirect to success page or show success message
      if (data.checkout_url) {
        window.location.href = data.checkout_url
      } else {
        alert('Payment successful! Thank you for your purchase.')
      }
    } else {
      throw new Error('Payment processing failed')
    }
  } catch (err) {
    console.error('Error processing payment:', err)
    error.value = err.message || 'Payment processing failed'
  } finally {
    processing.value = false
  }
}

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '0.00'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(parseFloat(amount))
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusBadgeClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-800 border border-green-200',
    completed: 'bg-blue-100 text-blue-800 border border-blue-200',
    expired: 'bg-red-100 text-red-800 border border-red-200',
    inactive: 'bg-yellow-100 text-yellow-800 border border-yellow-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 border border-gray-200'
}

const getTotalAmount = () => {
  // Check for total_amount first (backend response format)
  if (paymentLink.value?.quote?.total_amount) {
    return parseFloat(paymentLink.value.quote.total_amount)
  }
  // Fallback to total (legacy format)
  if (paymentLink.value?.quote?.total) {
    return parseFloat(paymentLink.value.quote.total)
  }
  // Fallback calculation from items
  if (paymentLink.value?.quote?.items) {
    return paymentLink.value.quote.items.reduce((total, item) => {
      // Use unit_price (backend format) or price (legacy format)
      const price = parseFloat(item.unit_price || item.price || 0)
      const quantity = parseInt(item.quantity || 0)
      return total + (price * quantity)
    }, 0)
  }
  return 0
}

onMounted(() => {
  loadPaymentLink()
})
</script>