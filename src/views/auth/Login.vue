<template>
  <div class="min-h-screen flex bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
    <!-- Left Panel - Branding & Image -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-[#2596be] to-[#973894] rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-[#655997] to-[#cc3266] rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      </div>
      
      <!-- Content Card -->
      <div class="relative z-10 flex flex-col justify-center px-12 py-12 w-full">
        <div class="bg-gradient-to-br from-[#0f172a]/80 to-[#1e293b]/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          <!-- Logo -->
          <div class="mb-8">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-br from-[#2596be] to-[#973894] rounded-xl flex items-center justify-center shadow-lg">
                <span class="text-2xl font-bold text-white">
                  RC
                </span>
              </div>
              <span class="text-2xl font-bold text-white drop-shadow-lg">RC Convergio</span>
            </div>
          </div>
          
          <!-- Welcome Text -->
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Welcome back 👋
            </h1>
            <p class="text-xl text-gray-300 leading-relaxed drop-shadow-md">
              Securely access your customer data, pipelines, and insights.
            </p>
          </div>
          
          <!-- Feature Badges -->
          <div class="flex flex-wrap gap-3 mb-8">
            <div class="flex items-center space-x-2 bg-gradient-to-r from-[#2596be]/20 to-[#973894]/20 backdrop-blur-md rounded-full px-4 py-2 border border-gradient-to-r from-[#2596be]/30 to-[#973894]/30">
              <svg class="w-4 h-4 text-[#2596be]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span class="text-sm text-white font-medium">SSO Ready</span>
            </div>
            <div class="flex items-center space-x-2 bg-gradient-to-r from-[#973894]/20 to-[#655997]/20 backdrop-blur-md rounded-full px-4 py-2 border border-gradient-to-r from-[#973894]/30 to-[#655997]/30">
              <svg class="w-4 h-4 text-[#973894]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span class="text-sm text-white font-medium">Encrypted</span>
            </div>
            <div class="flex items-center space-x-2 bg-gradient-to-r from-[#655997]/20 to-[#cc3266]/20 backdrop-blur-md rounded-full px-4 py-2 border border-gradient-to-r from-[#655997]/30 to-[#cc3266]/30">
              <svg class="w-4 h-4 text-[#655997]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span class="text-sm text-white font-medium">2FA Supported</span>
            </div>
            <div class="flex items-center space-x-2 bg-gradient-to-r from-[#cc3266]/20 to-[#2596be]/20 backdrop-blur-md rounded-full px-4 py-2 border border-gradient-to-r from-[#cc3266]/30 to-[#2596be]/30">
              <svg class="w-4 h-4 text-[#cc3266]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span class="text-sm text-white font-medium">Email Verification</span>
            </div>
          </div>
          
          <!-- Convergio Business Transformation Suite Image -->
          <div class="flex-1 flex items-center justify-center">
            <div class="w-full max-w-md">
              <img 
                src="@/assets/Naceerz.png" 
                alt="Convergio Business Transformation Suite" 
                class="w-full h-auto object-contain rounded-lg shadow-lg"
                style="max-height: 300px;"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Right Panel - Form -->
    <div class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div class="w-full max-w-md">
        <!-- Mobile Logo (hidden on desktop) -->
        <div class="lg:hidden text-center mb-8">
          <div class="flex items-center justify-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-gradient-to-br from-[#2596be] to-[#973894] rounded-lg flex items-center justify-center">
              <span class="text-xl font-bold text-white">RC</span>
            </div>
            <span class="text-xl font-bold text-white">RC Convergio</span>
          </div>
          <h2 class="text-2xl font-bold text-white">Welcome back</h2>
          <p class="text-gray-300 mt-2">Sign in to your account to continue</p>
        </div>
        
        <!-- Login Form with Dark Theme -->
        <form class="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl shadow-2xl p-8 border border-white/10" @submit.prevent="handleLogin">
          <div class="space-y-6">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl bg-[#1e293b] text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2596be] focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <p v-if="errors.email" class="mt-1 text-sm text-red-400">{{ errors.email }}</p>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  class="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl bg-[#1e293b] text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2596be] focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <p v-if="errors.password" class="mt-1 text-sm text-red-400">{{ errors.password }}</p>
            </div>

            <!-- Remember me & Forgot password -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember-me"
                  v-model="form.remember"
                  type="checkbox"
                  class="h-4 w-4 text-[#2596be] focus:ring-[#2596be] border-gray-600 rounded bg-[#1e293b]"
                />
                <label for="remember-me" class="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              <router-link
                to="/forgot-password"
                class="text-sm text-gray-300 hover:text-white transition-colors font-medium hover:underline"
              >
                Forgot password?
              </router-link>
            </div>

            <!-- Submit button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-[#2596be] via-[#973894] via-[#655997] to-[#cc3266] hover:from-[#1f7a9e] hover:via-[#7e2f7a] hover:via-[#4a3f7a] hover:to-[#b02a5a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2596be] transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>

            <!-- Divider -->
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-600" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-gray-400">Or continue with</span>
              </div>
            </div>

            <!-- Register link -->
            <div class="text-center">
              <p class="text-sm text-gray-300">
                Don't have an account?
                <router-link
                  to="/register"
                  class="font-medium text-white hover:text-gray-200 transition-colors hover:underline"
                >
                  Sign up
                </router-link>
              </p>
            </div>
          </div>
        </form>
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
    } else {
      error(result.message)
    }
  } catch (err) {
    error('Login failed. Please try again.')
  }
}
</script>

