<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="text-center">
            <h1 class="text-3xl font-bold text-gray-900">Choose Your License Plan</h1>
            <p class="mt-2 text-sm text-gray-600">Select a plan to renew your license and continue using the platform</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 3" :key="n" class="bg-white border border-gray-200 rounded-lg shadow-sm p-6 animate-pulse">
          <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div class="space-y-2 mb-6">
            <div class="h-3 bg-gray-200 rounded"></div>
            <div class="h-3 bg-gray-200 rounded w-5/6"></div>
            <div class="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
          <div class="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-medium text-red-800 mb-2">Failed to Load Plans</h3>
          <p class="text-sm text-red-600 mb-4">{{ error }}</p>
          <button
            @click="fetchPlans"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>

      <!-- Plans Grid -->
      <div v-else-if="plans.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
        >
          <!-- Plan Header -->
          <div class="px-6 py-5 border-b border-gray-200">
            <div class="text-center">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ plan.name }}</h3>
              <p class="text-sm text-gray-600">{{ plan.description }}</p>
            </div>
          </div>

          <!-- Pricing Section -->
          <div class="px-6 py-5 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
            <div class="text-center">
              <div class="flex items-baseline justify-center">
                <span class="text-gray-900 text-2xl font-semibold mr-1">$</span>
                <span class="text-gray-900 text-4xl font-bold">{{ formatPrice(plan.price) }}</span>
              </div>
              <p class="text-sm text-gray-600 mt-2">{{ plan.duration_days }} days</p>
            </div>
          </div>

          <!-- Features List -->
          <div class="px-6 py-5 flex-1">
            <h4 class="text-sm font-semibold text-gray-900 mb-4">Features:</h4>
            <ul class="space-y-3">
              <li
                v-for="(feature, index) in plan.features"
                :key="index"
                class="flex items-start"
              >
                <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-sm text-gray-700">{{ feature }}</span>
              </li>
            </ul>
          </div>

          <!-- Action Footer -->
          <div class="px-6 py-5 bg-gray-50 border-t border-gray-200">
            <button
              @click="handlePayNow(plan)"
              :disabled="processingPlanId === plan.id"
              class="w-full inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="processingPlanId !== plan.id" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <svg v-else class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ processingPlanId === plan.id ? 'Processing...' : 'Pay Now' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No plans available</h3>
        <p class="mt-1 text-sm text-gray-500">Please contact support for assistance.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { licenseAPI } from '@/services/api'
import { useAuth } from '@/composables/useAuth'
import { submitPayFastForm } from '@/utils/payfast'

const router = useRouter()
const { user } = useAuth()

const loading = ref(false)
const error = ref(null)
const plans = ref([])
const processingPlanId = ref(null)

const formatPrice = (price) => {
  if (!price) return '0.00'
  const numPrice = parseFloat(price)
  return numPrice.toFixed(2)
}

const fetchPlans = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await licenseAPI.getPlans()
    if (response.data.success && response.data.data) {
      // Sort plans by sort_order if available
      plans.value = response.data.data
        .filter(plan => plan.is_active)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    } else {
      plans.value = []
    }
  } catch (err) {
    console.error('Error fetching plans:', err)
    error.value = err.response?.data?.message || 'Failed to load license plans. Please try again.'
    plans.value = []
  } finally {
    loading.value = false
  }
}

const handlePayNow = async (plan) => {
  if (!user.value || !user.value.email) {
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'User email not found. Please log in again.',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
    return
  }

  processingPlanId.value = plan.id

  try {
    const response = await licenseAPI.renew({
      plan_id: plan.id,
      customer_email: user.value.email
    })

    if (response.data.success) {
      // Check if payment_data exists (PayFast)
      if (response.data.payment_data) {
        // PayFast: Create POST form and auto-submit
        const paymentUrl = response.data.payment_url
        const paymentData = response.data.payment_data
        
        if (!paymentUrl) {
          throw new Error('Payment URL not received')
        }
        
        if (!paymentData) {
          throw new Error('Payment data not received')
        }
        
        // Validate required fields
        if (!paymentData.merchant_id || !paymentData.merchant_key || !paymentData.amount) {
          throw new Error('Payment data is incomplete. Missing required fields.')
        }
        
        // Show processing message
        if (window.Swal) {
          window.Swal.fire({
            icon: 'info',
            title: 'Redirecting to PayFast...',
            text: 'You will be redirected to complete your payment',
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          })
        }
        
        // Small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Submit PayFast form using shared utility
        submitPayFastForm(paymentUrl, paymentData)
      } else if (response.data.payment_url) {
        // Fallback: If no payment_data, redirect (shouldn't happen for PayFast)
        window.location.href = response.data.payment_url
      } else {
        throw new Error('Payment URL not received')
      }
    } else {
      throw new Error(response.data?.message || 'Payment URL not received')
    }
  } catch (err) {
    console.error('Error creating payment:', err)
    processingPlanId.value = null
    
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: err.response?.data?.message || err.message || 'Failed to create payment link. Please try again.',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  }
}

onMounted(() => {
  fetchPlans()
})
</script>

