<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <!-- Cancel Header -->
      <div class="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-8 text-center">
        <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-white mb-2">Payment Cancelled</h1>
        <p class="text-yellow-50">Your payment was not completed</p>
      </div>

      <!-- Content -->
      <div class="px-6 py-8">
        <div class="text-center mb-6">
          <p class="text-gray-600 mb-4">
            You have cancelled the payment process. No charges have been made to your account.
          </p>
          <div v-if="paymentLinkId" class="bg-gray-50 rounded-lg p-4 mb-4">
            <p class="text-sm text-gray-500">Payment Link ID</p>
            <p class="text-lg font-semibold text-gray-900">{{ paymentLinkId }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="space-y-3">
          <button
            @click="retryPayment"
            v-if="paymentLinkId"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <button
            @click="goToHome"
            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Go to Home
          </button>
        </div>

        <!-- Additional Info -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <p class="text-xs text-center text-gray-500">
            If you experienced any issues during payment, please contact our support team for assistance.
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

const retryPayment = () => {
  if (paymentLinkId.value) {
    router.push(`/commerce/payment/${paymentLinkId.value}`)
  }
}

onMounted(() => {
  // Get payment_link_id from query params
  paymentLinkId.value = route.query.payment_link_id || null
})
</script>


