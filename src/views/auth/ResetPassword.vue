<template>
  <div class="min-h-screen flex bg-gradient-to-br from-[#2596be] via-[#973894] via-[#655997] to-[#cc3266]">
    <!-- Left Panel - Branding & Image -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <!-- Content Card -->
      <div class="relative z-10 flex flex-col justify-center px-12 py-12 w-full">
        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          <!-- Logo -->
          <div class="mb-8">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <span class="text-2xl font-bold bg-gradient-to-r from-[#2596be] to-[#973894] bg-clip-text text-transparent">
                  RC
                </span>
              </div>
              <span class="text-2xl font-bold text-white drop-shadow-lg">RC Convergio</span>
            </div>
          </div>
          
          <!-- Welcome Text -->
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Set new password
            </h1>
            <p class="text-xl text-white/90 leading-relaxed drop-shadow-md">
              Enter your new password below to complete the reset process.
            </p>
          </div>
          
          <!-- Feature Badges -->
          <div class="flex flex-wrap gap-3 mb-8">
            <div class="flex items-center space-x-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/30">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span class="text-sm text-white font-medium">Secure Reset</span>
            </div>
            <div class="flex items-center space-x-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/30">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm text-white font-medium">Verified</span>
            </div>
            <div class="flex items-center space-x-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/30">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm text-white font-medium">Quick Setup</span>
            </div>
          </div>
          
          <!-- Business Transformation Suite Image -->
          <div class="flex-1 flex items-center justify-center">
            <div class="w-full max-w-md">
              <!-- Professional Dashboard Analytics Illustration -->
              <div class="relative">
                <!-- Central Large Chart -->
                <div class="absolute top-8 left-8 w-32 h-24 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div class="text-xs text-white/80 mb-2">CRM</div>
                  <div class="flex items-end space-x-1 h-12">
                    <div class="w-3 bg-blue-300 rounded-t"></div>
                    <div class="w-3 bg-blue-400 rounded-t" style="height: 60%"></div>
                    <div class="w-3 bg-blue-500 rounded-t" style="height: 80%"></div>
                    <div class="w-3 bg-blue-600 rounded-t" style="height: 40%"></div>
                    <div class="w-3 bg-blue-700 rounded-t" style="height: 90%"></div>
                  </div>
                </div>
                
                <!-- Main Area Chart -->
                <div class="absolute top-16 left-20 w-48 h-32 bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div class="relative h-full">
                    <!-- Area Chart Lines -->
                    <svg class="w-full h-full" viewBox="0 0 200 100">
                      <path d="M0 80 L40 60 L80 40 L120 70 L160 30 L200 50" stroke="rgba(255,255,255,0.8)" stroke-width="2" fill="none"/>
                      <path d="M0 70 L40 50 L80 30 L120 60 L160 20 L200 40" stroke="rgba(255,255,255,0.6)" stroke-width="2" fill="none"/>
                    </svg>
                  </div>
                </div>
                
                <!-- Line Chart -->
                <div class="absolute top-4 right-8 w-32 h-20 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <svg class="w-full h-full" viewBox="0 0 120 60">
                    <path d="M0 50 L20 40 L40 30 L60 45 L80 20 L100 35 L120 25" stroke="rgba(255,255,255,0.8)" stroke-width="2" fill="none"/>
                  </svg>
                </div>
                
                <!-- User Icons -->
                <div class="absolute top-32 right-4 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg p-2">
                  <div class="w-full h-full bg-gradient-to-br from-pink-300 to-pink-500 rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                </div>
                
                <div class="absolute top-48 right-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg p-2">
                  <div class="w-full h-full bg-gradient-to-br from-pink-300 to-pink-500 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                </div>
                
                <div class="absolute top-40 left-4 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-lg p-2">
                  <div class="w-full h-full bg-gradient-to-br from-pink-300 to-pink-500 rounded-full flex items-center justify-center">
                    <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                </div>
                
                <!-- Bar Charts -->
                <div class="absolute bottom-8 left-4 w-24 h-16 bg-white/20 backdrop-blur-sm rounded-lg p-2">
                  <div class="flex items-end space-x-1 h-10">
                    <div class="w-2 bg-blue-300 rounded-t"></div>
                    <div class="w-2 bg-blue-400 rounded-t" style="height: 70%"></div>
                    <div class="w-2 bg-blue-500 rounded-t" style="height: 50%"></div>
                    <div class="w-2 bg-blue-600 rounded-t" style="height: 90%"></div>
                    <div class="w-2 bg-blue-700 rounded-t" style="height: 30%"></div>
                  </div>
                </div>
                
                <div class="absolute bottom-8 right-4 w-32 h-20 bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div class="flex items-end space-x-1 h-12">
                    <div class="flex-1 flex flex-col space-y-1">
                      <div class="w-full bg-blue-300 rounded-t" style="height: 60%"></div>
                      <div class="w-full bg-blue-400 rounded-t" style="height: 80%"></div>
                    </div>
                    <div class="flex-1 flex flex-col space-y-1">
                      <div class="w-full bg-purple-300 rounded-t" style="height: 40%"></div>
                      <div class="w-full bg-purple-400 rounded-t" style="height: 70%"></div>
                    </div>
                    <div class="flex-1 flex flex-col space-y-1">
                      <div class="w-full bg-pink-300 rounded-t" style="height: 90%"></div>
                      <div class="w-full bg-pink-400 rounded-t" style="height: 50%"></div>
                    </div>
                  </div>
                </div>
                
                <!-- Indicators -->
                <div class="absolute bottom-20 left-32 flex items-center space-x-2">
                  <div class="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div class="w-8 h-0.5 bg-white/60"></div>
                </div>
                <div class="absolute bottom-16 left-32 flex items-center space-x-2">
                  <div class="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <div class="w-8 h-0.5 bg-white/60"></div>
                </div>
              </div>
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
            <div class="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <span class="text-xl font-bold bg-gradient-to-r from-[#2596be] to-[#973894] bg-clip-text text-transparent">RC</span>
            </div>
            <span class="text-xl font-bold text-white">RC Convergio</span>
          </div>
          <h2 class="text-2xl font-bold text-white">Set new password</h2>
          <p class="text-white/80 mt-2">Enter your new password below</p>
        </div>
        
        <!-- Reset Password Form with Glassmorphism -->
        <form class="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20" @submit.prevent="handleResetPassword">
          <div class="space-y-6">
            <!-- Password -->
            <BaseInput
              v-model="form.password"
              type="password"
              label="New Password"
              placeholder="Enter your new password"
              icon="lock"
              required
              :error="errors.password"
            />

            <!-- Confirm Password -->
            <BaseInput
              v-model="form.password_confirmation"
              type="password"
              label="Confirm Password"
              placeholder="Confirm your new password"
              icon="lock"
              required
              :error="errors.password_confirmation"
            />

            <!-- Submit button -->
            <BaseButton
              type="submit"
              variant="primary"
              size="lg"
              :loading="loading"
              full-width
              class="bg-gradient-to-r from-[#2596be] to-[#973894] hover:from-[#1f7a9e] hover:to-[#7e2f7a] shadow-lg"
            >
              Reset Password
            </BaseButton>

            <!-- Feature Pills -->
            <div class="flex flex-wrap gap-2 justify-center pt-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
                Secure Reset
              </span>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
                Verified
              </span>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
                Quick Setup
              </span>
            </div>

            <!-- Back to login -->
            <div class="text-center">
              <p class="text-sm text-white/80">
                Remember your password?
                <router-link
                  to="/login"
                  class="font-medium text-white hover:text-white/80 transition-colors"
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
import { reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const { resetPassword, loading } = useAuth()
const { success, error } = useNotifications()

const form = reactive({
  token: '',
  password: '',
  password_confirmation: ''
})

const errors = reactive({
  password: '',
  password_confirmation: ''
})

onMounted(() => {
  // Get token from URL params
  form.token = route.query.token || ''
  
  if (!form.token) {
    error('Invalid or missing reset token')
    router.push('/forgot-password')
  }
})

const validateForm = () => {
  errors.password = ''
  errors.password_confirmation = ''
  
  if (!form.password) {
    errors.password = 'Password is required'
    return false
  }
  
  if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    return false
  }
  
  if (!form.password_confirmation) {
    errors.password_confirmation = 'Please confirm your password'
    return false
  }
  
  if (form.password !== form.password_confirmation) {
    errors.password_confirmation = 'Passwords do not match'
    return false
  }
  
  return true
}

const handleResetPassword = async () => {
  if (!validateForm()) return
  
  try {
    const result = await resetPassword(form)
    
    if (result.success) {
      success('Password reset successfully! You can now sign in with your new password.')
      router.push('/login')
    } else {
      error(result.message)
    }
  } catch (err) {
    error('Failed to reset password. Please try again.')
  }
}
</script>

