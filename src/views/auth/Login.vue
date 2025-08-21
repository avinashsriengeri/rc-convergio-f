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
          Welcome back
        </h2>
        <p class="mt-2 text-sm text-white/80">
          Sign in to your account to continue
        </p>
      </div>

      <!-- Login Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
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

            <!-- Password -->
            <BaseInput
              v-model="form.password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              icon="lock"
              required
              :error="errors.password"
            />

            <!-- Remember me & Forgot password -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember-me"
                  v-model="form.remember"
                  type="checkbox"
                  class="h-4 w-4 text-[#2596be] focus:ring-[#2596be] border-gray-300 rounded"
                />
                <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <router-link
                to="/forgot-password"
                class="text-sm text-[#2596be] hover:text-[#973894] transition-colors"
              >
                Forgot password?
              </router-link>
            </div>

            <!-- Submit button -->
            <BaseButton
              type="submit"
              variant="primary"
              size="lg"
              :loading="loading"
              full-width
            >
              Sign in
            </BaseButton>

            <!-- Divider -->
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <!-- Register link -->
            <div class="text-center">
              <p class="text-sm text-gray-600">
                Don't have an account?
                <router-link
                  to="/register"
                  class="font-medium text-[#2596be] hover:text-[#973894] transition-colors"
                >
                  Sign up
                </router-link>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

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

