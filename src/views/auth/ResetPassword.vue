<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2596be] via-[#973894] to-[#655997] py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-12 w-12 bg-white rounded-xl flex items-center justify-center mb-4">
          <span class="text-2xl font-bold bg-gradient-to-r from-[#2596be] to-[#973894] bg-clip-text text-transparent">
            RC
          </span>
        </div>
        <h2 class="text-3xl font-extrabold text-white">
          Set new password
        </h2>
        <p class="mt-2 text-sm text-white/80">
          Enter your new password below
        </p>
      </div>

      <!-- Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="bg-white rounded-xl shadow-2xl p-8">
          <div class="space-y-4">
            <!-- Password -->
            <BaseInput
              v-model="form.password"
              type="password"
              label="New Password"
              placeholder="Enter your new password"
              icon="lock"
              required
              :error="errors.password"
              help-text="Must be at least 8 characters"
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
            >
              Reset Password
            </BaseButton>

            <!-- Back to login -->
            <div class="text-center">
              <router-link
                to="/login"
                class="text-sm text-[#2596be] hover:text-[#973894] transition-colors"
              >
                Back to login
              </router-link>
            </div>
          </div>
        </div>
      </form>
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
  // Get token from URL query parameter
  form.token = route.query.token || ''
  if (!form.token) {
    error('Invalid reset token')
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

const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    const result = await resetPassword({
      token: form.token,
      password: form.password,
      password_confirmation: form.password_confirmation
    })
    
    if (result.success) {
      success(result.message)
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
      error('Failed to reset password. Please try again.')
    }
  }
}
</script>

