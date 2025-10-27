<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeModal">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEditing ? 'Edit Subscription Plan' : 'Create Subscription Plan' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Plan Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Basic Plan"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe what this plan includes..."
            ></textarea>
          </div>

          <!-- Price and Currency -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                v-model="formData.price"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="29.99"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                v-model="formData.currency"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="gbp">GBP</option>
                <option value="cad">CAD</option>
                <option value="aud">AUD</option>
              </select>
            </div>
          </div>

          <!-- Interval -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Billing Interval</label>
            <select
              v-model="formData.interval"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
              <option value="week">Weekly</option>
              <option value="day">Daily</option>
            </select>
          </div>

          <!-- Trial Days -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Trial Days</label>
            <input
              v-model="formData.trial_days"
              type="number"
              min="0"
              max="365"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="7"
            />
            <p class="text-xs text-gray-500 mt-1">Number of free trial days (0 for no trial)</p>
          </div>

          <!-- Stripe Price ID -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stripe Price ID</label>
            <input
              v-model="formData.stripe_price_id"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="price_1234567890abcdef"
            />
            <p class="text-xs text-gray-500 mt-1">Optional: Stripe price ID for integration</p>
          </div>

          <!-- Active Status -->
          <div class="flex items-center">
            <input
              v-model="formData.is_active"
              type="checkbox"
              id="is_active"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="is_active" class="ml-2 block text-sm text-gray-700">
              Active (plan is available for subscription)
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {{ error }}
          </div>

          <!-- Form Actions -->
          <div class="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isEditing ? 'Update Plan' : 'Create Plan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  plan: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

const isEditing = ref(false)
const error = ref('')

const formData = ref({
  name: '',
  description: '',
  price: '',
  currency: 'usd',
  interval: 'month',
  trial_days: 0,
  stripe_price_id: '',
  is_active: true
})

const resetForm = () => {
  formData.value = {
    name: '',
    description: '',
    price: '',
    currency: 'usd',
    interval: 'month',
    trial_days: 0,
    stripe_price_id: '',
    is_active: true
  }
  isEditing.value = false
  error.value = ''
}

// Watch for plan changes to populate form
watch(() => props.plan, (newPlan) => {
  if (newPlan) {
    isEditing.value = true
    formData.value = {
      name: newPlan.name || '',
      description: newPlan.metadata?.description || newPlan.description || '',
      price: newPlan.amount_cents ? (newPlan.amount_cents / 100).toString() : '',
      currency: newPlan.currency || 'usd',
      interval: newPlan.interval === 'monthly' ? 'month' : newPlan.interval || 'month',
      trial_days: newPlan.trial_days || 0,
      stripe_price_id: newPlan.stripe_price_id || '',
      is_active: newPlan.active !== false
    }
  } else {
    isEditing.value = false
    resetForm()
  }
}, { immediate: true })

// Watch for modal show/hide to reset form
watch(() => props.show, (show) => {
  if (!show) {
    resetForm()
    error.value = ''
  }
})

const closeModal = () => {
  emit('close')
}

const submitForm = () => {
  error.value = ''
  
  // Basic validation
  if (!formData.value.name.trim()) {
    error.value = 'Plan name is required'
    return
  }
  
  if (!formData.value.price || parseFloat(formData.value.price) <= 0) {
    error.value = 'Price must be greater than 0'
    return
  }

  // Transform data to match backend expectations
  const payload = {
    name: formData.value.name,
    slug: formData.value.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    description: formData.value.description,
    amount_cents: Math.round(parseFloat(formData.value.price) * 100), // Convert to cents
    currency: formData.value.currency,
    interval: formData.value.interval === 'month' ? 'monthly' : formData.value.interval, // Backend expects 'monthly'
    trial_days: parseInt(formData.value.trial_days) || 0,
    stripe_price_id: formData.value.stripe_price_id || null,
    active: formData.value.is_active,
    metadata: {
      description: formData.value.description
    }
  }

  emit('submit', payload)
}
</script>
