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
          Create your account
        </h2>
        <p class="mt-2 text-sm text-white/80">
          Join RC Convergio to get started
        </p>
      </div>

      <!-- Registration Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="bg-white rounded-xl shadow-2xl p-8">
          <div class="space-y-4">
            <!-- Name -->
            <BaseInput
              v-model="form.name"
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
              icon="user"
              required
              :error="errors.name"
            />

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

            <!-- Phone -->
            <BaseInput
              v-model="form.phone"
              type="tel"
              label="Phone Number"
              placeholder="Enter your phone number"
              icon="phone"
              :error="errors.phone"
            />

            <!-- Password -->
            <BaseInput
              v-model="form.password"
              type="password"
              label="Password"
              placeholder="Create a password"
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
              placeholder="Confirm your password"
              icon="lock"
              required
              :error="errors.password_confirmation"
            />

            <!-- Organization Name -->
            <BaseInput
              v-model="form.organization_name"
              type="text"
              label="Organization Name"
              placeholder="Enter your organization name"
              required
              :error="errors.organization_name"
            />

            <!-- Terms and conditions -->
            <div class="flex items-center">
              <input
                id="terms"
                v-model="form.terms"
                type="checkbox"
                class="h-4 w-4 text-[#2596be] focus:ring-[#2596be] border-gray-300 rounded"
                required
              />
              <label for="terms" class="ml-2 block text-sm text-gray-700">
                I agree to the
                <a href="#" class="text-[#2596be] hover:text-[#973894] transition-colors">
                  Terms of Service
                </a>
                and
                <a href="#" class="text-[#2596be] hover:text-[#973894] transition-colors">
                  Privacy Policy
                </a>
              </label>
            </div>

            <!-- Submit button -->
            <BaseButton
              type="submit"
              variant="primary"
              size="lg"
              :loading="loading"
              full-width
            >
              Create Account
            </BaseButton>

            <!-- Divider -->
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <!-- Login link -->
            <div class="text-center">
              <router-link
                to="/login"
                class="font-medium text-[#2596be] hover:text-[#973894] transition-colors"
              >
                Sign in instead
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
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const { register, loading } = useAuth()
const { success, error } = useNotifications()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  organization_name: '',
  terms: false
})

const errors = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  organization_name: ''
})

const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => errors[key] = '')
  
  let isValid = true
  
  if (!form.name) {
    errors.name = 'Name is required'
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
  
  if (!form.organization_name) {
    errors.organization_name = 'Organization name is required'
    isValid = false
  }
  
  if (!form.terms) {
    error('Please accept the terms and conditions')
    isValid = false
  }
  
  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return
  
  try {
    const result = await register({
      name: form.name,
      email: form.email,
      phone: form.phone || '',
      password: form.password,
      password_confirmation: form.password_confirmation,
      organization_name: form.organization_name
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

