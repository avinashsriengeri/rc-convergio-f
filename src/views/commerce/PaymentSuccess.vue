<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <!-- Success Header -->
      <div class="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-center">
        <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
        <p class="text-green-50">Your payment has been processed successfully</p>
      </div>

      <!-- Content -->
      <div class="px-6 py-8">
        <div class="text-center mb-6">
          <p class="text-gray-600 mb-4">
            Thank you for your payment. Your transaction has been completed successfully.
          </p>
          <div v-if="paymentLinkId" class="bg-gray-50 rounded-lg p-4 mb-4">
            <p class="text-sm text-gray-500">Payment Link ID</p>
            <p class="text-lg font-semibold text-gray-900">{{ paymentLinkId }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="space-y-3">
          <button
            @click="goToHome"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Go to Home
          </button>
          <button
            @click="viewOrder"
            v-if="paymentLinkId"
            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            View Order Details
          </button>
        </div>

        <!-- Additional Info -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <p class="text-xs text-center text-gray-500">
            A confirmation email has been sent to your registered email address.
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const paymentLinkId = ref(null)

const goToHome = () => {
  window.location.href = '/'
}

const viewOrder = () => {
  // Navigate to order details if authenticated, otherwise show message
  const token = localStorage.getItem('access_token')
  if (token) {
    router.push(`/commerce/orders`)
  } else {
    alert('Please log in to view your order details.')
    router.push('/login')
  }
}

onMounted(() => {
  // Get payment_link_id from query params
  paymentLinkId.value = route.query.payment_link_id || null
})
</script>

