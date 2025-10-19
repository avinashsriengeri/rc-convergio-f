<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Change Subscription Plan</h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Current Plan Info -->
        <div v-if="subscription" class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Current Plan</h4>
          <div class="flex items-center justify-between">
            <span class="text-lg font-semibold text-gray-900">{{ subscription.plan?.name || 'Unknown Plan' }}</span>
            <span class="text-sm text-gray-600">{{ formatCurrency(subscription.plan?.amount_cents / 100) }}/{{ subscription.plan?.interval || 'month' }}</span>
          </div>
        </div>

        <!-- Plan Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Select New Plan</label>
          <select 
            v-model="selectedPlanId" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :disabled="loading"
          >
            <option value="">Choose a plan...</option>
            <option 
              v-for="plan in availablePlans" 
              :key="plan.id" 
              :value="plan.id"
              :disabled="plan.id === subscription?.plan?.id"
            >
              {{ plan.name }} - {{ formatCurrency(plan.amount_cents / 100) }}/{{ plan.interval }}
            </option>
          </select>
        </div>

        <!-- Selected Plan Details -->
        <div v-if="selectedPlan" class="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 class="text-sm font-medium text-blue-700 mb-2">New Plan Details</h4>
          <div class="space-y-1">
            <div class="flex justify-between">
              <span class="text-sm text-blue-600">Plan:</span>
              <span class="text-sm font-medium text-blue-900">{{ selectedPlan.name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-blue-600">Price:</span>
              <span class="text-sm font-medium text-blue-900">{{ formatCurrency(selectedPlan.amount_cents / 100) }}/{{ selectedPlan.interval }}</span>
            </div>
            <div v-if="selectedPlan.metadata?.description" class="flex justify-between">
              <span class="text-sm text-blue-600">Description:</span>
              <span class="text-sm text-blue-900">{{ selectedPlan.metadata.description }}</span>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div class="flex">
            <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Error</h3>
              <p class="text-sm text-red-700 mt-1">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end space-x-3">
          <button
            @click="$emit('close')"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            @click="handleChangePlan"
            :disabled="!selectedPlanId || loading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Changing Plan...
            </span>
            <span v-else>Change Plan</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCommerceSubscriptionsStore } from '@/stores/useCommerceSubscriptionsStore'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  subscription: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'plan-changed'])

const subscriptionsStore = useCommerceSubscriptionsStore()
const selectedPlanId = ref('')
const loading = ref(false)
const error = ref('')

// Get available plans (excluding current plan)
const availablePlans = computed(() => {
  if (!subscriptionsStore.plans) return []
  return subscriptionsStore.plans.filter(plan => plan.id !== props.subscription?.plan?.id)
})

// Get selected plan details
const selectedPlan = computed(() => {
  if (!selectedPlanId.value || !subscriptionsStore.plans) return null
  return subscriptionsStore.plans.find(plan => plan.id === selectedPlanId.value)
})

// Format currency
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Watch for modal open/close
watch(() => props.show, (newValue) => {
  if (newValue) {
    selectedPlanId.value = ''
    error.value = ''
    loading.value = false
  }
})

// Handle change plan
const handleChangePlan = async () => {
  if (!selectedPlanId.value || !props.subscription) return
  
  loading.value = true
  error.value = ''
  
  try {
    await subscriptionsStore.changePlan(props.subscription.id, selectedPlanId.value)
    
    // Show success message
    if (window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: 'Plan Changed!',
        text: 'Subscription plan has been changed successfully',
        timer: 3000,
        showConfirmButton: false
      })
    }
    
    emit('plan-changed')
    emit('close')
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to change subscription plan'
    console.error('Error changing plan:', err)
  } finally {
    loading.value = false
  }
}
</script>
