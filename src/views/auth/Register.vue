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
    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="w-full max-w-md mx-auto">
          <!-- RC Logo - Centered -->
          <div class="text-center mb-6">
            <div class="w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <img src="/src/assets/logo.png" alt="RC Convergio" class="w-16 h-16 object-contain" />
            </div>
            <h1 class="text-xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p class="text-sm text-gray-600">Sign up to get started with RC Convergio</p>
        </div>
        
          <!-- Register Form -->
          <form class="space-y-4" @submit.prevent="handleRegister">
            <!-- First Name -->
            <div>
              <label for="first_name" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  id="first_name"
                  v-model="form.first_name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4418e] focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  placeholder="Enter your first name"
                  required
                />
              <p v-if="errors.first_name" class="mt-1 text-sm text-red-500">{{ errors.first_name }}</p>
            </div>

                         <!-- Last Name -->
             <div>
               <label for="last_name" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                 <input
                   id="last_name"
                   v-model="form.last_name"
                   type="text"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4418e] focus:border-transparent transition-all duration-200 hover:border-gray-400"
                   placeholder="Enter your last name"
                   required
                 />
               <p v-if="errors.last_name" class="mt-1 text-sm text-red-500">{{ errors.last_name }}</p>
             </div>

             

             <!-- Organization Name -->
             <div>
               <label for="organization_name" class="block text-sm font-medium text-gray-700 mb-1">Organization Name *</label>
                 <input
                   id="organization_name"
                   v-model="form.organization_name"
                   type="text"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4418e] focus:border-transparent transition-all duration-200 hover:border-gray-400"
                   placeholder="Enter your organization name"
                   required
                 />
               <p v-if="errors.organization_name" class="mt-1 text-sm text-red-500">{{ errors.organization_name }}</p>
             </div>

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
                  placeholder="Create a password"
                  required
                />
              <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  id="password_confirmation"
                  v-model="form.password_confirmation"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4418e] focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  placeholder="Confirm your password"
                  required
                />
              <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-500">{{ errors.password_confirmation }}</p>
            </div>

            <!-- Terms and Conditions -->
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="terms"
                  v-model="form.terms"
                  type="checkbox"
                  class="h-4 w-4 text-[#d4418e] focus:ring-[#d4418e] border-gray-300 rounded"
                  required
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="terms" class="text-gray-700 text-sm">
                  I agree to the
                  <a href="#" class="text-[#d4418e] hover:text-[#c23a7f] transition-colors hover:underline">Terms of Service</a>
                  and
                  <a href="#" class="text-[#d4418e] hover:text-[#c23a7f] transition-colors hover:underline">Privacy Policy</a>
                </label>
                <p v-if="errors.terms" class="text-red-500 text-xs mt-1">{{ errors.terms }}</p>
              </div>
            </div>

            <!-- Submit button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#d4418e] to-[#0652c5] hover:from-[#c23a7f] hover:to-[#0548a8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4418e] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                <span class="px-1.5 bg-white text-gray-500 text-xs">Or continue with</span>
              </div>
            </div>

            <!-- Login link -->
            <div class="text-center">
              <p class="text-sm text-gray-600">
                Already have an account?
                <router-link
                  to="/login"
                  class="font-medium text-[#d4418e] hover:text-[#c23a7f] transition-colors hover:underline text-xs"
                >
                  Sign in
                </router-link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Right Panel - Company Branding with save2.png Background -->
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
      <div class="relative z-10 flex flex-col justify-center px-6 py-4 w-full">
        <div class="text-center">
          <!-- Company Logo -->
          <div class="mb-6">
            <div class="w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <img src="/src/assets/logo.png" alt="RC Convergio" class="w-16 h-16 object-contain" />
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-1">RC Convergio</h2>
            <p class="text-base text-gray-600">Business Transformation Suite</p>
          </div>
          
          <!-- Feature Highlights -->
          <div class="space-y-3">
            <div class="flex items-center justify-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <svg class="w-4 h-4 text-[#d4418e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span class="text-xs font-medium text-gray-700">Secure Registration</span>
            </div>
            <div class="flex items-center justify-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <svg class="w-4 h-4 text-[#0652c5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span class="text-xs font-medium text-gray-700">Quick Setup</span>
            </div>
            <div class="flex items-center justify-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <svg class="w-4 h-4 text-[#d4418e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              <span class="text-xs font-medium text-gray-700">Join Our Community</span>
            </div>
          </div>
        </div>
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
  organization_name: '',
  email: '',
  password: '',
  password_confirmation: '',
  terms: false
})

const errors = reactive({
  first_name: '',
  last_name: '',
  organization_name: '',
  email: '',
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
  
  if (!form.organization_name) {
    errors.organization_name = 'Organization name is required'
    isValid = false
  }
  
  if (!form.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
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
      name: `${form.first_name} ${form.last_name}`,
      organization_name: form.organization_name,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
    })
    
    if (result.success) {
      success('Check your Gmail inbox to verify your email')
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

