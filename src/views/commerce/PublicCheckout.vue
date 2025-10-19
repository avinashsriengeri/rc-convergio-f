<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Success Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Success Icon -->
        <div class="text-center mb-6">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Subscription Successful!</h2>
          <p class="text-gray-600">Thank you for subscribing to our service.</p>
        </div>

        <!-- Subscription Details -->
        <div v-if="checkoutSession" class="space-y-4 mb-6">
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-900 mb-3">Subscription Details</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Plan:</span>
                <span class="text-sm font-medium text-gray-900">{{ checkoutSession.plan_name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Price:</span>
                <span class="text-sm font-medium text-gray-900">${{ formatPrice(checkoutSession.amount) }} {{ checkoutSession.currency?.toUpperCase() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Billing:</span>
                <span class="text-sm font-medium text-gray-900 capitalize">{{ checkoutSession.interval }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Next billing:</span>
                <span class="text-sm font-medium text-gray-900">{{ formatDate(checkoutSession.next_billing_date) }}</span>
              </div>
            </div>
          </div>

          <!-- Customer Info -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-900 mb-3">Account Information</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Email:</span>
                <span class="text-sm font-medium text-gray-900">{{ checkoutSession.customer_email }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Status:</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-else-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading subscription details...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button
            @click="loadCheckoutSession"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>

        <!-- Action Buttons -->
        <div v-if="checkoutSession" class="space-y-3">
          <button
            @click="openBillingPortal"
            :disabled="portalLoading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <svg v-if="portalLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {{ portalLoading ? 'Opening...' : 'Manage Billing' }}
          </button>
          
          <button
            @click="goToDashboard"
            class="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
            Go to Dashboard
          </button>
        </div>

        <!-- Support Info -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="text-center">
            <p class="text-xs text-gray-500">
              Need help? Contact our support team at 
              <a href="mailto:support@example.com" class="text-blue-600 hover:text-blue-500">support@example.com</a>
            </p>
          </div>
        </div>
      </div>

      <!-- Company Branding -->
      <div class="text-center">
        <div class="flex items-center justify-center space-x-2 text-gray-600">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
          </svg>
          <span class="text-sm">Secured by Stripe</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCommerceSubscriptionsStore } from '@/stores/useCommerceSubscriptionsStore'

const route = useRoute()
const router = useRouter()
const subscriptionsStore = useCommerceSubscriptionsStore()

const loading = ref(true)
const portalLoading = ref(false)
const error = ref('')
const checkoutSession = ref(null)

const formatPrice = (price) => {
  if (!price) return '0.00'
  return (parseFloat(price) / 100).toFixed(2) // Convert from cents
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadCheckoutSession = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const sessionId = route.params.sessionId
    if (!sessionId) {
      throw new Error('No session ID provided')
    }
    
    const session = await subscriptionsStore.getCheckoutSession(sessionId)
    checkoutSession.value = session
  } catch (err) {
    console.error('Error loading checkout session:', err)
    error.value = err.response?.data?.message || 'Failed to load subscription details'
  } finally {
    loading.value = false
  }
}

const openBillingPortal = async () => {
  if (!checkoutSession.value?.subscription_id) {
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No subscription ID available for billing portal',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
    return
  }

  portalLoading.value = true
  try {
    await subscriptionsStore.openPortal(checkoutSession.value.subscription_id)
  } catch (err) {
    console.error('Error opening billing portal:', err)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Failed to open billing portal',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  } finally {
    portalLoading.value = false
  }
}

const goToDashboard = () => {
  // Redirect to main application or dashboard
  window.location.href = '/'
}

onMounted(() => {
  loadCheckoutSession()
})
</script>
