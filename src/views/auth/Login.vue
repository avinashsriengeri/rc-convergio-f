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
    
    <!-- Left Panel - Login Form -->
    <div class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6">
      <div class="w-full max-w-sm">
        <!-- RC Logo - Centered -->
        <div class="text-center mb-6">
          <div class="w-16 h-16 flex items-center justify-center mx-auto mb-3">
            <img src="/src/assets/logo.png" alt="RC Convergio" class="w-16 h-16 object-contain" />
          </div>
          <h1 class="text-xl font-bold text-gray-900 mb-1">Welcome Back</h1>
          <p class="text-sm text-gray-600">Sign in to your account to continue</p>
        </div>
        
        <!-- Error Banner -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center justify-between">
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm font-medium">{{ errorMessage }}</span>
          </div>
          <button @click="clearError" class="text-red-500 hover:text-red-700">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Login Form -->
        <form class="space-y-4" @submit.prevent="handleLogin">
            <!-- Email -->
            <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4418e] focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  placeholder="Enter your email"
                  required
                />
            <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
            </div>

            <!-- Password -->
            <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div class="relative">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4418e] focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
            </div>

            <!-- Remember me & Forgot password -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember-me"
                  v-model="form.remember"
                  type="checkbox"
                class="h-4 w-4 text-[#d4418e] focus:ring-[#d4418e] border-gray-300 rounded"
                />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <router-link
                to="/forgot-password"
              class="text-sm text-[#d4418e] hover:text-[#0652c5] transition-colors font-medium"
              >
                Forgot password?
              </router-link>
            </div>

          <!-- Sign In Button -->
            <button
              type="submit"
              :disabled="loading"
            class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#d4418e] to-[#0652c5] hover:from-[#c23a7f] hover:to-[#0548a8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4418e] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>


            <!-- Register link -->
            <div class="text-center">
            <p class="text-sm text-gray-600">
                Don't have an account?
                <router-link
                  to="/register"
                  class="font-medium text-[#d4418e] hover:text-[#0652c5] transition-colors"
                >
                  Sign up
                </router-link>
            </p>
            </div>
        </form>

        <!-- Copyright -->
        <div class="mt-8 text-center">
          <p class="text-xs text-gray-500">© 2020-2025 Reliance Corporation. All Rights Reserved.</p>
        </div>
      </div>
    </div>
    
    <!-- Right Panel - Company Branding & Food Images -->
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span class="text-sm font-semibold text-gray-700">Fast</span>
            </div>
            <div class="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-5 py-3 shadow-lg hover:shadow-xl transition-shadow">
              <svg class="w-5 h-5 text-[#d4418e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              <span class="text-sm font-semibold text-gray-700">Complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'
import Swal from 'sweetalert2'

const router = useRouter()
const { login, loading } = useAuth()
const { success, error } = useNotifications()

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const showPassword = ref(false)
const errorMessage = ref('')

const errors = reactive({
  email: '',
  password: ''
})

const validateForm = () => {
  errors.email = ''
  errors.password = ''
  
  if (!form.email) {
    errors.email = 'Email is required'
    return false
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    return false
  }
  
  if (!form.password) {
    errors.password = 'Password is required'
    return false
  }
  
  if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    return false
  }
  
  return true
}

const clearError = () => {
  errorMessage.value = ''
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  // Clear any previous error messages
  errorMessage.value = ''
  
  try {
    const result = await login({
      email: form.email,
      password: form.password
    })
    
    if (result.success) {
      try {
        // Show professional SweetAlert2 toast notification
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        // Show toast notification (don't await it)
        Toast.fire({
          icon: 'success',
          title: `Login Successful! Welcome back ${result.user?.name || 'User'}! 👋`,
          background: '#ffffff',
          color: '#1f2937',
          iconColor: '#d4418e'
        })
        
      } catch (swalError) {
        console.error('SweetAlert2 error:', swalError)
        // Fallback to simple notification if SweetAlert2 fails
        success('Welcome back!')
      }
      
      // Redirect to dashboard immediately (don't wait for toast)
      await router.replace('/dashboard')
    } else if (result.requiresVerification) {
      // Handle email verification requirement
      error('Please verify your email before logging in.')
      // Store user data temporarily for verification page
      if (result.user) {
        localStorage.setItem('temp_user', JSON.stringify(result.user))
      }
      router.push('/verify-notification')
    } else {
      // Show error message in banner
      errorMessage.value = result.message
    }
  } catch (err) {
    errorMessage.value = 'Login failed. Please try again.'
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

