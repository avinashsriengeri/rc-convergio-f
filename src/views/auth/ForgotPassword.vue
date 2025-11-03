<template>
  <div class="h-screen flex bg-white overflow-hidden relative">
    <!-- Home Icon -->
    <router-link 
      to="/" 
      class="absolute top-4 left-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 group"
      title="Go to Home"
    >
      <svg class="w-6 h-6 text-gray-600 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    </router-link>
    
    <!-- Left Panel - Form -->
    <div class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4">
      <div class="w-full max-w-xs">
        <!-- RC Logo - Centered -->
        <div class="text-center mb-4">
          <div class="w-12 h-12 flex items-center justify-center mx-auto mb-2">
            <img src="/src/assets/logo.png" alt="RC Convergio" class="w-12 h-12 object-contain" />
          </div>
          <h1 class="text-lg font-bold text-gray-900 mb-1">Reset Password</h1>
          <p class="text-sm text-gray-600">Enter your email to receive reset instructions</p>
        </div>
        
        <!-- Forgot Password Form -->
        <form class="space-y-3" @submit.prevent="handleForgotPassword">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4418e] focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  placeholder="Enter your email address"
                  required
                />
              <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
            </div>

            <!-- Submit button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#d4418e] to-[#0652c5] hover:from-[#c23a7f] hover:to-[#0548a8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4418e] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Sending...' : 'Send Reset Link' }}
            </button>

            <!-- Back to login -->
            <div class="text-center">
              <p class="text-sm text-gray-600">
                Remember your password?
                <router-link
                  to="/login"
                  class="font-medium text-[#d4418e] hover:text-[#c23a7f] transition-colors hover:underline"
                >
                  Sign in
                </router-link>
              </p>
            </div>
        </form>
      </div>
    </div>
    
    <!-- Right Panel - Company Branding with save6.png Background -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#f8fafc] via-white to-[#e2e8f0]">
      <!-- Background Image with Bold Visibility -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="relative responsive-image-container">
          <img 
            src="@/assets/rot-1.png" 
            alt="RC Convergio Business Suite" 
            class="responsive-rotating-image object-contain animate-spin-slow"

          />
          <!-- RC Logo Overlay in Center -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="responsive-logo-overlay flex items-center justify-center">
           <img src="/src/assets/logo.png" alt="RC Logo" class="responsive-logo-image object-contain" />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Professional Logo Color Gradient Overlay -->
      <div class="absolute inset-0">
        <!-- Top-left gradient -->
        <div class="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-[#d4418e]/20 via-[#d4418e]/10 to-transparent"></div>
        <!-- Top-right gradient -->
        <div class="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-[#0652c5]/20 via-[#0652c5]/10 to-transparent"></div>
        <!-- Bottom-left gradient -->
        <div class="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-[#0652c5]/15 via-[#0652c5]/8 to-transparent"></div>
        <!-- Bottom-right gradient -->
        <div class="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-[#d4418e]/15 via-[#d4418e]/8 to-transparent"></div>
        <!-- Center overlay for text readability -->
        <div class="absolute inset-0 bg-gradient-radial from-transparent via-white/10 to-white/20"></div>
      </div>
      
      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-between px-6 py-6 w-full h-full">
        <!-- Company Title at Very Top -->
        <div class="text-center pt-2">
          <h2 class="text-4xl font-bold text-gray-900 mb-3">RC Convergio</h2>
          <p class="text-xl text-gray-600">Business Transformation Suite</p>
        </div>
        
        <!-- Feature Highlights at Bottom -->
        <div class="text-center pb-4">
          <div class="flex justify-center items-center gap-4 flex-wrap">
            <div class="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-5 py-3 shadow-lg hover:shadow-xl transition-shadow">
              <svg class="w-5 h-5 text-[#d4418e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span class="text-sm font-semibold text-gray-700">Secure</span>
            </div>
            <div class="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-5 py-3 shadow-lg hover:shadow-xl transition-shadow">
              <svg class="w-5 h-5 text-[#0652c5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l4-4m0 0l4 4m-4-4v12" />
              </svg>
              <span class="text-sm font-semibold text-gray-700">Email</span>
            </div>
            <div class="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-5 py-3 shadow-lg hover:shadow-xl transition-shadow">
              <svg class="w-5 h-5 text-[#d4418e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span class="text-sm font-semibold text-gray-700">Recovery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'

const { forgotPassword, loading } = useAuth()
const { success, error } = useNotifications()

const form = reactive({
  email: ''
})

const errors = reactive({
  email: ''
})

const validateForm = () => {
  errors.email = ''
  
  if (!form.email) {
    errors.email = 'Email is required'
    return false
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    return false
  }
  
  return true
}

const handleForgotPassword = async () => {
  if (!validateForm()) return
  
  try {
    const result = await forgotPassword(form.email)
    
    if (result.success) {
      success('If the email exists, a reset link has been sent to your Gmail')
      form.email = ''
    } else {
      error(result.message)
    }
  } catch (err) {
    error('Failed to send reset link. Please try again.')
  }
}
</script>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

.bg-gradient-radial {
  background: radial-gradient(circle at center, transparent 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.2) 100%);
}

.responsive-image-container {
  width: clamp(500px, 80vmin, 850px);
  height: clamp(500px, 80vmin, 850px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.responsive-rotating-image {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}

/* Responsive logo overlay that scales with the image */
.responsive-logo-overlay {
  width: clamp(140px, 22vmin, 230px);
  height: clamp(140px, 22vmin, 230px);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.responsive-logo-image {
  width: clamp(120px, 18vmin, 190px);
  height: clamp(120px, 18vmin, 190px);
  position: absolute;
  top: 51%;
  left: 48%;
  transform: translate(-50%, -50%);
}   


</style>

