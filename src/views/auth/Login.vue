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
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4418e] focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  placeholder="Enter your password"
                  required
                />
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
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0]">
      <!-- Background Image with Light Transparency -->
      <div class="absolute inset-0">
        <img 
          src="@/assets/save2.png" 
          alt="RC Convergio Business Suite" 
          class="w-full h-full object-contain opacity-20"
        />
      </div>
      
      <!-- Gradient Overlay for Better Text Readability -->
      <div class="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
      
      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center px-8 py-8 w-full">
        <div class="text-center">
          <!-- Company Logo -->
          <div class="mb-8">
            <div class="w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <img src="/src/assets/logo.png" alt="RC Convergio" class="w-20 h-20 object-contain" />
            </div>
            <h2 class="text-3xl font-bold text-gray-900 mb-2">RC Convergio</h2>
            <p class="text-lg text-gray-600">Business Transformation Suite</p>
          </div>
          
          <!-- Feature Highlights -->
          <div class="space-y-4">
            <div class="flex items-center justify-center space-x-3 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              <svg class="w-5 h-5 text-[#d4418e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span class="text-sm font-medium text-gray-700">Secure & Reliable Platform</span>
            </div>
            <div class="flex items-center justify-center space-x-3 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              <svg class="w-5 h-5 text-[#0652c5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span class="text-sm font-medium text-gray-700">Fast & Efficient Solutions</span>
            </div>
            <div class="flex items-center justify-center space-x-3 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
              <svg class="w-5 h-5 text-[#d4418e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              <span class="text-sm font-medium text-gray-700">Complete Business Suite</span>
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

const router = useRouter()
const { login, loading } = useAuth()
const { success, error } = useNotifications()

const form = reactive({
  email: '',
  password: '',
  remember: false
})

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

const handleLogin = async () => {
  if (!validateForm()) return
  
  try {
    const result = await login({
      email: form.email,
      password: form.password
    })
    
    if (result.success) {
      success('Welcome back!')
      router.push('/dashboard')
    } else if (result.requiresVerification) {
      // Handle email verification requirement
      error('Please verify your email before logging in.')
      // Store user data temporarily for verification page
      if (result.user) {
        localStorage.setItem('temp_user', JSON.stringify(result.user))
      }
      router.push('/verify-notification')
    } else {
      error(result.message)
    }
  } catch (err) {
    error('Login failed. Please try again.')
  }
}
</script>

