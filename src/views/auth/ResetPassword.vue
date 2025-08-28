<template>
  <div class="min-h-screen flex bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
    <div class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-white">Reset your password</h2>
          <p class="text-gray-300 mt-2">Enter your new password</p>
        </div>
        
        <form class="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl shadow-2xl p-8 border border-white/10" @submit.prevent="handleResetPassword">
          <div class="space-y-6">
            <!-- Email Display (read-only) -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                :value="email"
                class="block w-full px-3 py-3 border border-gray-600 rounded-xl bg-[#1e293b] text-gray-300"
                readonly
              />
            </div>

            <!-- New Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-300 mb-2">New Password</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                class="block w-full px-3 py-3 border border-gray-600 rounded-xl bg-[#1e293b] text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2596be] focus:border-transparent"
                placeholder="Enter your new password"
                required
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-400">{{ errors.password }}</p>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="password_confirmation" class="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
              <input
                id="password_confirmation"
                v-model="form.password_confirmation"
                type="password"
                class="block w-full px-3 py-3 border border-gray-600 rounded-xl bg-[#1e293b] text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2596be] focus:border-transparent"
                placeholder="Confirm your new password"
                required
              />
              <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-400">{{ errors.password_confirmation }}</p>
            </div>

            <!-- Submit button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-[#2596be] to-[#973894] hover:from-[#1f7a9e] hover:to-[#7e2f7a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2596be] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Resetting Password...' : 'Reset Password' }}
            </button>

            <div class="text-center">
              <p class="text-sm text-gray-300">
                Remember your password?
                <router-link to="/login" class="font-medium text-white hover:text-gray-200 transition-colors hover:underline">
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
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const route = useRoute()
const { resetPassword, loading } = useAuth()
const { success, error } = useNotifications()

const email = ref('')
const token = ref('')

const form = reactive({
  password: '',
  password_confirmation: ''
})

const errors = reactive({
  password: '',
  password_confirmation: ''
})

onMounted(() => {
  email.value = route.query.email || ''
  token.value = route.query.token || ''
  
  if (!email.value || !token.value) {
    error('Invalid reset link. Please request a new password reset.')
    router.push('/forgot-password')
  }
})

const validateForm = () => {
  Object.keys(errors).forEach(key => errors[key] = '')
  
  let isValid = true
  
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
  
  return isValid
}

const handleResetPassword = async () => {
  if (!validateForm()) return
  
  try {
    const result = await resetPassword({
      email: email.value,
      token: token.value,
      password: form.password,
      password_confirmation: form.password_confirmation
    })
    
    if (result.success) {
      success('Password reset successful. Please login.')
      form.password = ''
      form.password_confirmation = ''
      router.push('/login')
    } else {
      error(result.message)
    }
  } catch (err) {
    if (err.response?.data?.errors) {
      const backendErrors = err.response.data.errors
      Object.keys(backendErrors).forEach(key => {
        if (errors.hasOwnProperty(key)) {
          errors[key] = backendErrors[key][0]
        }
      })
    } else {
      error('Password reset failed. Please try again.')
    }
  }
}
</script>
