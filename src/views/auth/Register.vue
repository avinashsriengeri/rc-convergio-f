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
                <div class="relative">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4418e] focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    placeholder="Create a password"
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

            <!-- Confirm Password -->
            <div>
              <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div class="relative">
                  <input
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4418e] focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
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

            <!-- License Agreement -->
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="license"
                  v-model="form.license"
                  type="checkbox"
                  class="h-4 w-4 text-[#d4418e] focus:ring-[#d4418e] border-gray-300 rounded"
                  required
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="license" class="text-gray-700 text-sm">
                  I acknowledge and accept the
                  <a href="#" class="text-[#d4418e] hover:text-[#c23a7f] transition-colors hover:underline">Software License Agreement</a>
                </label>
                <p v-if="errors.license" class="text-red-500 text-xs mt-1">{{ errors.license }}</p>
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span class="text-sm font-semibold text-gray-700">Quick</span>
            </div>
            <div class="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-5 py-3 shadow-lg hover:shadow-xl transition-shadow">
              <svg class="w-5 h-5 text-[#d4418e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              <span class="text-sm font-semibold text-gray-700">Community</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
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
  terms: false,
  license: false
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const errors = reactive({
  first_name: '',
  last_name: '',
  organization_name: '',
  email: '',
  password: '',
  password_confirmation: '',
  terms: '',
  license: ''
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
  
  if (!form.license) {
    errors.license = 'Please accept the software license agreement'
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

