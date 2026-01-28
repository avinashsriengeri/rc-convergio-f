<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl w-full">
      <!-- Success Card -->
      <div class="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 text-center">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-white mb-4">
            <svg class="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-white">Payment Successful!</h1>
          <p class="mt-2 text-green-100">Your license renewal payment has been processed</p>
        </div>

        <!-- Content -->
        <div class="px-6 py-8">
          <!-- Loading State -->
          <div v-if="checkingLicense" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p class="text-sm text-gray-600">Verifying your license status...</p>
          </div>

          <!-- License Valid -->
          <div v-else-if="licenseValid" class="text-center py-4">
            <div class="mb-6">
              <svg class="mx-auto h-16 w-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 class="text-xl font-semibold text-gray-900 mb-2">License Activated!</h2>
              <p class="text-sm text-gray-600 mb-4">Your license has been successfully renewed and activated.</p>
              <div class="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                <p class="text-sm text-green-800">
                  <span class="font-medium">Status:</span> Active
                </p>
                <p v-if="licenseInfo.plan_name" class="text-sm text-green-800 mt-1">
                  <span class="font-medium">Plan:</span> {{ licenseInfo.plan_name }}
                </p>
              </div>
            </div>
            <button
              @click="goToDashboard"
              class="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Go to Dashboard
              <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

          <!-- License Still Processing -->
          <div v-else-if="processing" class="text-center py-4">
            <div class="mb-6">
              <svg class="mx-auto h-16 w-16 text-yellow-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 class="text-xl font-semibold text-gray-900 mb-2">Payment Processing</h2>
              <p class="text-sm text-gray-600 mb-4">Your payment is being processed. This may take a few moments.</p>
              <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                <p class="text-sm text-yellow-800">
                  Please wait while we verify your payment and activate your license...
                </p>
              </div>
              <p class="text-xs text-gray-500">This page will automatically refresh in {{ countdown }} seconds</p>
            </div>
          </div>

          <!-- Error State -->
          <div v-else class="text-center py-4">
            <div class="mb-6">
              <svg class="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 class="text-xl font-semibold text-gray-900 mb-2">Unable to Verify License</h2>
              <p class="text-sm text-gray-600 mb-4">{{ errorMessage || 'Please contact support if this issue persists.' }}</p>
            </div>
            <div class="flex justify-center space-x-3">
              <button
                @click="checkLicenseStatus"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
              <button
                @click="goToDashboard"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>

        <!-- Footer Info -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p class="text-xs text-center text-gray-500">
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { licenseAPI } from '@/services/api'

const router = useRouter()

const checkingLicense = ref(true)
const licenseValid = ref(false)
const processing = ref(false)
const errorMessage = ref(null)
const licenseInfo = ref({})
const countdown = ref(10)
let countdownInterval = null
let checkInterval = null
let checkAttempts = 0
const maxAttempts = 10

const checkLicenseStatus = async () => {
  checkingLicense.value = true
  errorMessage.value = null
  checkAttempts++

  try {
    // First check localStorage for license info
    const storedLicense = localStorage.getItem('license')
    
    if (storedLicense) {
      try {
        const license = JSON.parse(storedLicense)
        if (license.is_valid) {
          licenseValid.value = true
          processing.value = false
          licenseInfo.value = license
          checkingLicense.value = false
          clearIntervals()
          return
        }
      } catch (e) {
        console.error('Error parsing stored license:', e)
      }
    }

    // Try to get fresh license status from API
    try {
      const response = await licenseAPI.getStatus()
      if (response.data.success && response.data.data) {
        const license = response.data.data
        if (license.is_valid) {
          // Update localStorage
          localStorage.setItem('license', JSON.stringify(license))
          licenseValid.value = true
          processing.value = false
          licenseInfo.value = license
          checkingLicense.value = false
          clearIntervals()
          return
        }
      }
    } catch (apiError) {
      console.log('License status API not available or failed, using fallback check')
    }

    // If license is still not valid and we haven't exceeded max attempts
    if (checkAttempts < maxAttempts) {
      processing.value = true
      checkingLicense.value = false
      // Will auto-retry via interval
    } else {
      // After max attempts, show message but allow user to proceed
      errorMessage.value = 'License verification is taking longer than expected. Your payment has been processed. Please try logging in again or contact support.'
      checkingLicense.value = false
      processing.value = false
      clearIntervals()
    }
  } catch (error) {
    console.error('Error checking license status:', error)
    if (checkAttempts >= maxAttempts) {
      errorMessage.value = error.response?.data?.message || 'Failed to verify license status. Your payment has been processed. Please try logging in again.'
      checkingLicense.value = false
      processing.value = false
      clearIntervals()
    } else {
      processing.value = true
      checkingLicense.value = false
    }
  }
}

const startCountdown = () => {
  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      countdown.value = 10
      checkLicenseStatus()
    }
  }, 1000)
}

const startAutoCheck = () => {
  checkInterval = setInterval(() => {
    if (!licenseValid.value && checkAttempts < maxAttempts) {
      checkLicenseStatus()
    } else if (checkAttempts >= maxAttempts) {
      clearIntervals()
    }
  }, 5000) // Check every 5 seconds
}

const clearIntervals = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
  if (checkInterval) {
    clearInterval(checkInterval)
    checkInterval = null
  }
}

const goToDashboard = () => {
  router.push('/dashboard')
}

onMounted(() => {
  // Initial check
  checkLicenseStatus()
  
  // Start auto-check if license is not valid
  if (!licenseValid.value) {
    startCountdown()
    startAutoCheck()
  }
})

onUnmounted(() => {
  clearIntervals()
})
</script>

