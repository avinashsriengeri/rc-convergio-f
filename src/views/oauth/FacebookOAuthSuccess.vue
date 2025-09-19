<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
    <div class="max-w-2xl w-full">
      <!-- Success Card -->
      <div class="bg-white rounded-2xl shadow-2xl p-8 text-center border border-gray-100">
        <!-- Success Icon -->
        <div class="mb-8">
          <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 shadow-lg">
            <svg class="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>

        <!-- Success Message -->
        <h1 class="text-4xl font-bold text-gray-900 mb-4">{{ $t('marketing.ads.oauth.success_page.title') }}</h1>
        <p class="text-gray-600 text-lg mb-8">{{ $t('marketing.ads.oauth.success_page.subtitle') }}</p>

        <!-- User Information -->
        <div v-if="userInfo" class="bg-blue-50 rounded-xl p-6 mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Connected Account Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="text-left">
              <p class="text-sm text-gray-600">User Name</p>
              <p class="font-medium text-gray-900">{{ userInfo.name || 'N/A' }}</p>
            </div>
            <div class="text-left">
              <p class="text-sm text-gray-600">Email</p>
              <p class="font-medium text-gray-900">{{ userInfo.email || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <!-- Ad Accounts Information -->
        <div v-if="adAccounts && adAccounts.length > 0" class="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Ad Accounts Found</h3>
          <div class="space-y-3">
            <div v-for="account in adAccounts" :key="account.id" class="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ account.name || 'Unnamed Account' }}</p>
                  <p class="text-sm text-gray-500">ID: {{ account.id }}</p>
                </div>
              </div>
              <span class="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
          <p class="text-sm text-gray-600 mt-4 text-center">
            <span class="font-semibold">{{ adAccounts.length }}</span> ad account{{ adAccounts.length !== 1 ? 's' : '' }} found and connected
          </p>
        </div>

        <!-- Auto-redirect countdown -->
        <div v-if="redirectCountdown > 0" class="bg-green-50 rounded-lg p-4 mb-6">
          <div class="flex items-center justify-center text-green-700">
            <svg class="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span class="text-sm font-medium">Redirecting to Ads Dashboard in {{ redirectCountdown }}s...</span>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="goToAdsDashboard"
            class="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { adsService } from '@/services/ads'
import { success as showSuccess } from '@/utils/notifications'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()

const userInfo = ref(null)
const adAccounts = ref([])
const redirectCountdown = ref(5)
let countdownInterval = null

const loadSuccessData = async () => {
  try {
    // Show success toast
    showSuccess('Facebook Ads account connected successfully!')
    
    // Try to load user info and ad accounts
    try {
      const accountsResponse = await adsService.getFacebookAdAccounts()
      if (accountsResponse.data) {
        adAccounts.value = accountsResponse.data
      }
    } catch (err) {
      console.log('Could not load ad accounts:', err)
      // This is not critical, continue with success page
    }
    
    // Start countdown for auto-redirect
    startCountdown()
  } catch (err) {
    console.error('Error loading success data:', err)
  }
}

// Start countdown for auto-redirect
const startCountdown = () => {
  countdownInterval = setInterval(() => {
    redirectCountdown.value--
    
    if (redirectCountdown.value <= 0) {
      clearInterval(countdownInterval)
      goToAdsDashboard()
    }
  }, 1000)
}

const goToAdsDashboard = () => {
  // Clear countdown if user manually clicks
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
  router.push('/marketing/ads')
}

const goToDashboard = () => {
  // Clear countdown if user manually clicks
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
  router.push('/dashboard')
}

// Clean up interval on component unmount
onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})

onMounted(() => {
  loadSuccessData()
})
</script>
