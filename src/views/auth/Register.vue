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
              Create your account
            </h1>
            <p class="text-xl text-gray-300 leading-relaxed drop-shadow-md">
              Join RC Convergio to securely manage your business data.
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
                src="@/assets/RC Sign.png" 
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
          <h2 class="text-2xl font-bold text-white">Create your account</h2>
          <p class="text-gray-300 mt-2">Join us to get started</p>
        </div>
        
        <!-- Register Form with Dark Theme -->
        <form class="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl shadow-2xl p-8 border border-white/10" @submit.prevent="handleRegister">
          <div class="space-y-6">
            <!-- First Name -->
            <div>
              <label for="first_name" class="block text-sm font-medium text-gray-300 mb-2">First Name</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="first_name"
                  v-model="form.first_name"
                  type="text"
                  class="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl bg-[#1e293b] text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2596be] focus:border-transparent transition-all duration-200"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <p v-if="errors.first_name" class="mt-1 text-sm text-red-400">{{ errors.first_name }}</p>
            </div>

            <!-- Last Name -->
            <div>
              <label for="last_name" class="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="last_name"
                  v-model="form.last_name"
                  type="text"
                  class="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl bg-[#1e293b] text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2596be] focus:border-transparent transition-all duration-200"
                  placeholder="Enter your last name"
                  required
                />
              </div>
              <p v-if="errors.last_name" class="mt-1 text-sm text-red-400">{{ errors.last_name }}</p>
            </div>

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

            <!-- Phone -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl bg-[#1e293b] text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2596be] focus:border-transparent transition-all duration-200"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <p v-if="errors.phone" class="mt-1 text-sm text-red-400">{{ errors.phone }}</p>
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
                  placeholder="Create a password"
                  required
                />
              </div>
              <p v-if="errors.password" class="mt-1 text-sm text-red-400">{{ errors.password }}</p>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="password_confirmation" class="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password_confirmation"
                  v-model="form.password_confirmation"
                  type="password"
                  class="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl bg-[#1e293b] text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2596be] focus:border-transparent transition-all duration-200"
                  placeholder="Confirm your password"
                  required
                />
              </div>
              <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-400">{{ errors.password_confirmation }}</p>
            </div>

            <!-- Terms and Conditions -->
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="terms"
                  v-model="form.terms"
                  type="checkbox"
                  class="h-4 w-4 text-[#2596be] focus:ring-[#2596be] border-gray-600 rounded bg-[#1e293b]"
                  required
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="terms" class="text-gray-300">
                  I agree to the
                  <a href="#" class="text-white hover:text-gray-200 transition-colors hover:underline">Terms of Service</a>
                  and
                  <a href="#" class="text-white hover:text-gray-200 transition-colors hover:underline">Privacy Policy</a>
                </label>
                <p v-if="errors.terms" class="text-red-400 text-xs mt-1">{{ errors.terms }}</p>
              </div>
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
              {{ loading ? 'Creating Account...' : 'Create Account' }}
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

            <!-- Login link -->
            <div class="text-center">
              <p class="text-sm text-gray-300">
                Already have an account?
                <router-link
                  to="/login"
                  class="font-medium text-white hover:text-gray-200 transition-colors hover:underline"
                >
                  Sign in
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
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const { register, loading } = useAuth()
const { success, error } = useNotifications()

const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  terms: false
})

const errors = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  terms: ''
})

const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => errors[key] = '')
  
  let isValid = true
  
  if (!form.first_name) {
    errors.first_name = 'First name is required'
    isValid = false
  }
  
  if (!form.last_name) {
    errors.last_name = 'Last name is required'
    isValid = false
  }
  
  if (!form.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }
  
  if (form.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(form.phone.replace(/\s/g, ''))) {
    errors.phone = 'Please enter a valid phone number'
    isValid = false
  }
  
  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    isValid = false
  }
  
  if (!form.password_confirmation) {
    errors.password_confirmation = 'Please confirm your password'
    isValid = false
  } else if (form.password !== form.password_confirmation) {
    errors.password_confirmation = 'Passwords do not match'
    isValid = false
  }
  
  if (!form.terms) {
    errors.terms = 'Please accept the terms and conditions'
    isValid = false
  }
  
  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return
  
  try {
    const result = await register({
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone || '',
      password: form.password,
      password_confirmation: form.password_confirmation,
    })
    
    if (result.success) {
      success('Account created successfully! Please check your email to verify your account.')
      router.push('/login')
    } else {
      error(result.message)
    }
  } catch (err) {
    if (err.response?.data?.errors) {
      // Handle validation errors from backend
      const backendErrors = err.response.data.errors
      Object.keys(backendErrors).forEach(key => {
        if (errors.hasOwnProperty(key)) {
          errors[key] = backendErrors[key][0]
        }
      })
    } else {
      error('Registration failed. Please try again.')
    }
  }
}
</script>

