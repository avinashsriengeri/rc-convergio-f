<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
    <div class="max-w-2xl w-full">
      <!-- Error Card -->
      <div class="bg-white rounded-2xl shadow-2xl p-8 text-center border border-gray-100">
        <!-- Error Icon -->
        <div class="mb-8">
          <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-red-100 to-pink-100 shadow-lg">
            <svg class="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        </div>

        <!-- Error Message -->
        <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ $t('marketing.ads.oauth.error_page.title') }}</h1>
        <p class="text-gray-600 text-lg mb-8">{{ errorMessage || $t('marketing.ads.oauth.error_page.subtitle') }}</p>

        <!-- Error Details -->
        <div v-if="errorDetails" class="bg-red-50 rounded-xl p-6 mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Error Details</h3>
          <div class="text-left">
            <p class="text-sm text-gray-600 mb-2">Error Code:</p>
            <p class="font-mono text-sm bg-white rounded p-2 mb-4">{{ errorDetails.code || 'Unknown' }}</p>
            
            <p class="text-sm text-gray-600 mb-2">Description:</p>
            <p class="text-sm text-gray-900 bg-white rounded p-2">{{ errorDetails.description || 'No additional details available.' }}</p>
          </div>
        </div>

        <!-- Common Solutions -->
        <div class="bg-blue-50 rounded-xl p-6 mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Common Solutions</h3>
          <div class="space-y-3 text-left">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-sm text-gray-700">Make sure you have granted all required permissions for Facebook Ads access</p>
            </div>
            <div class="flex items-start">
              <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-sm text-gray-700">Check that your Facebook account has access to Facebook Ads Manager</p>
            </div>
            <div class="flex items-start">
              <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-sm text-gray-700">Try refreshing the page and attempting the connection again</p>
            </div>
            <div class="flex items-start">
              <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-sm text-gray-700">Contact support if the issue persists</p>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="retryConnection"
            class="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Try Again
          </button>
          <button
            @click="goToAdsDashboard"
            class="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors"
          >
            <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Back to Ads Dashboard
          </button>
          <button
            @click="goToDashboard"
            class="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors"
          >
            <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
            </svg>
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { error as showError } from '@/utils/notifications'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()

const errorMessage = ref('')
const errorDetails = ref(null)

const loadErrorData = () => {
  try {
    // Show error toast
    showError('Facebook Ads connection failed. Please try again.')
    
    // Try to get error details from route query parameters
    if (route.query.message) {
      errorMessage.value = route.query.message
    }
    
    if (route.query.code || route.query.description) {
      errorDetails.value = {
        code: route.query.code || 'Unknown',
        description: route.query.description || 'No additional details available.'
      }
    }
  } catch (err) {
    console.error('Error loading error data:', err)
  }
}

const retryConnection = () => {
  // Redirect back to ads management to try again
  router.push('/marketing/ads')
}

const goToAdsDashboard = () => {
  router.push('/marketing/ads')
}

const goToDashboard = () => {
  router.push('/dashboard')
}

onMounted(() => {
  loadErrorData()
})
</script>
