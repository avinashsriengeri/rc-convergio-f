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
          Reset your password
        </h2>
        <p class="mt-2 text-sm text-white/80">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      <!-- Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="bg-white rounded-xl shadow-2xl p-8">
          <div class="space-y-4">
            <!-- Email -->
            <BaseInput
              v-model="form.email"
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              icon="email"
              required
              :error="errors.email"
            />

            <!-- Submit button -->
            <BaseButton
              type="submit"
              variant="primary"
              size="lg"
              :loading="loading"
              full-width
            >
              Send Reset Link
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
import { reactive } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

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

const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    const result = await forgotPassword(form.email)
    
    if (result.success) {
      success(result.message)
      form.email = ''
    } else {
      error(result.message)
    }
  } catch (err) {
    error('Failed to send reset link. Please try again.')
  }
}
</script>

