<template>
  <div v-if="requiresVerification" class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo -->
      <div class="flex justify-center">
        <div class="w-16 h-16 bg-gradient-to-r from-[#2596be] to-[#973894] rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-2xl">RC</span>
        </div>
      </div>
      
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Email Verification Required
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Please verify your email address before accessing this page
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Email Verification Status -->
        <div class="text-center mb-6">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
            <svg class="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Verify Your Email
          </h3>
          
          <p class="text-sm text-gray-600 mb-4">
            We've sent a verification link to:<br>
            <span class="font-medium text-gray-900">{{ userEmail }}</span>
          </p>
          
          <p class="text-sm text-gray-500">
            Click the verification link in your email to activate your account and continue.
          </p>
        </div>

        <!-- Resend Verification Section -->
        <div class="border-t border-gray-200 pt-6">
          <div class="text-center">
            <p class="text-sm text-gray-600 mb-4">
              Didn't receive the verification email?
            </p>
            
            <button
              @click="handleResendVerification"
              :disabled="verificationLoading || resendCooldown > 0"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#2596be] to-[#973894] hover:from-[#1f7a9a] hover:to-[#7a2f75] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2596be] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg v-if="verificationLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="resendCooldown > 0">
                Resend in {{ resendCooldown }}s
              </span>
              <span v-else>
                {{ verificationLoading ? 'Sending...' : 'Resend Verification Email' }}
              </span>
            </button>
            
            <p v-if="resendCooldown > 0" class="mt-2 text-xs text-gray-500">
              Please wait before requesting another verification email
            </p>
          </div>
        </div>

        <!-- Alternative Actions -->
        <div class="mt-6 text-center">
          <div class="space-y-3">
            <button
              @click="goToVerificationPage"
              class="w-full flex justify-center py-2 px-4 border border-[#2596be] rounded-md shadow-sm text-sm font-medium text-[#2596be] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2596be] transition-colors"
            >
              Go to Verification Page
            </button>
            
            <button
              @click="goToLogin"
              class="text-sm text-[#2596be] hover:text-[#1f7a9a] font-medium transition-colors"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success/Error Toast -->
    <div
      v-if="toastMessage"
      class="fixed top-4 right-4 z-50 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg
              v-if="toastType === 'success'"
              class="h-6 w-6 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg
              v-else
              class="h-6 w-6 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900">
              {{ toastMessage }}
            </p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="clearToast"
              class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2596be]"
            >
              <span class="sr-only">Close</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Render protected content if email is verified -->
  <slot v-else />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, verificationLoading, resendVerification, requiresEmailVerification } = useAuth()

// Local state
const resendCooldown = ref(0)
const toastMessage = ref('')
const toastType = ref('success')
let cooldownTimer = null

// Computed
const userEmail = computed(() => user.value?.email || '')
const requiresVerification = computed(() => requiresEmailVerification.value)

// Methods
const handleResendVerification = async () => {
  if (verificationLoading.value || resendCooldown.value > 0) return
  
  try {
    const result = await resendVerification({ email: userEmail.value })
    
    if (result.success) {
      showToast(result.message, 'success')
      startCooldown()
    } else {
      showToast(result.message, 'error')
    }
  } catch (error) {
    showToast('Failed to resend verification email. Please try again.', 'error')
  }
}

const startCooldown = () => {
  resendCooldown.value = 60 // 60 seconds cooldown
  cooldownTimer = setInterval(() => {
    if (resendCooldown.value > 0) {
      resendCooldown.value--
    } else {
      clearInterval(cooldownTimer)
    }
  }, 1000)
}

const showToast = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  
  // Auto-hide toast after 5 seconds
  setTimeout(() => {
    clearToast()
  }, 5000)
}

const clearToast = () => {
  toastMessage.value = ''
}

const goToVerificationPage = () => {
  router.push('/verify-notification')
}

const goToLogin = () => {
  router.push('/login')
}

// Lifecycle
onMounted(() => {
  // If user is already verified, redirect to dashboard
  if (user.value && user.value.email_verified_at) {
    router.push('/dashboard')
  }
})

onUnmounted(() => {
  if (cooldownTimer) {
    clearInterval(cooldownTimer)
  }
})
</script>
