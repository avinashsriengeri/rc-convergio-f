<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
    <div class="max-w-lg w-full">
      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-2xl shadow-2xl p-8 text-center border border-gray-100">
        <div class="mb-6">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Connecting Facebook Ads Account</h2>
        <p class="text-gray-600 text-lg">Please wait while we securely connect your account...</p>
        <div class="mt-6 bg-blue-50 rounded-lg p-4">
          <div class="flex items-center justify-center text-blue-700">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <span class="text-sm font-medium">Secure OAuth Connection</span>
          </div>
        </div>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="bg-white rounded-2xl shadow-2xl p-8 text-center border border-gray-100">
        <div class="mb-6">
          <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 shadow-lg">
            <svg class="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-3">Facebook Ads Connected Successfully!</h2>
        <p class="text-gray-600 text-lg mb-6">Your Facebook Ads account has been securely connected and is ready to use.</p>
        
        <!-- Auto-redirect countdown -->
        <div class="bg-green-50 rounded-lg p-4 mb-6">
          <div class="flex items-center justify-center text-green-700">
            <svg class="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span class="text-sm font-medium">Redirecting to Ads Dashboard in {{ redirectCountdown }}s...</span>
          </div>
        </div>
        
        <button
          @click="redirectToAds"
          class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          Go to Ads Management
        </button>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-2xl shadow-2xl p-8 text-center border border-gray-100">
        <div class="mb-6">
          <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-red-100 to-pink-100 shadow-lg">
            <svg class="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-3">Connection Failed</h2>
        <p class="text-gray-600 text-lg mb-6">{{ errorMessage }}</p>
        
        <div class="space-y-3">
          <button
            @click="retryConnection"
            class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            Try Again
          </button>
          <button
            @click="redirectToAds"
            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go to Ads Management
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adsService } from '@/services/ads'
import { success as showSuccess, error as showError } from '@/utils/notifications'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const success = ref(false)
const error = ref(false)
const errorMessage = ref('')
const redirectCountdown = ref(3)
let countdownInterval = null

const handleCallback = async () => {
  try {
    loading.value = true
    error.value = false
    
    // Get code and state from URL parameters
    const code = route.query.code
    const state = route.query.state
    
    if (!code || !state) {
      throw new Error('Missing authorization code or state parameter')
    }
    
    // Handle the OAuth callback
    const response = await adsService.handleFacebookOAuthCallback(code, state)
    
    if (response.success) {
      success.value = true
      await handleOAuthSuccess()
    } else {
      throw new Error(response.message || 'Failed to connect Facebook Ads account')
    }
    
  } catch (err) {
    console.error('Facebook OAuth callback error:', err)
    error.value = true
    errorMessage.value = err.message || 'An unexpected error occurred'
    showError(errorMessage.value)
  } finally {
    loading.value = false
  }
}

const retryConnection = () => {
  // Redirect back to ads management to try again
  router.push('/marketing/ads')
}

const redirectToAds = () => {
  // Clear countdown if user manually clicks
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
  router.push('/marketing/ads')
}

// Handle successful OAuth connection
const handleOAuthSuccess = async () => {
  try {
    // Refresh the accounts list and analytics
    // This will be handled by the Ads.vue component when it mounts
    showSuccess('Facebook Ads account connected successfully!')
    
    // Start countdown for auto-redirect
    startCountdown()
  } catch (err) {
    console.error('Error handling OAuth success:', err)
  }
}

// Start countdown for auto-redirect
const startCountdown = () => {
  countdownInterval = setInterval(() => {
    redirectCountdown.value--
    
    if (redirectCountdown.value <= 0) {
      clearInterval(countdownInterval)
      router.push('/marketing/ads')
    }
  }, 1000)
}

// Clean up interval on component unmount
onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})

onMounted(() => {
  handleCallback()
})
</script>
