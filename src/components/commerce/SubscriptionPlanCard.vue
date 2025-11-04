<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden group relative">
    <!-- Plan Header -->
    <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h3 class="text-xl font-bold text-gray-900 mb-1">{{ plan.name }}</h3>
          <p class="text-sm text-gray-600">{{ plan.metadata?.description || plan.description || 'Professional subscription plan' }}</p>
        </div>
        <div class="flex flex-col items-end space-y-2">
          <span v-if="plan.active !== false" class="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
            <div class="w-1.5 h-1.5 bg-green-600 rounded-full mr-1.5"></div>
            Active
          </span>
          <span v-else class="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
            <div class="w-1.5 h-1.5 bg-red-600 rounded-full mr-1.5"></div>
            Inactive
          </span>
          <div v-if="plan.stripe_price_id" class="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-200" title="Synced with Stripe">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="text-xs font-medium">Synced</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pricing Section -->
    <div class="px-6 py-6 text-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-100">
      <div class="inline-flex items-baseline">
        <span class="text-4xl font-bold text-gray-900">${{ formatPrice(plan.amount_cents ? plan.amount_cents / 100 : plan.price) }}</span>
        <span class="text-lg text-gray-600 ml-1">/ {{ plan.interval }}</span>
      </div>
      <p class="text-sm text-gray-500 mt-1">{{ plan.currency?.toUpperCase() }} billing</p>
    </div>

    <!-- Plan Details -->
    <div class="px-6 py-5 flex-1">
      <div class="space-y-4">
        <!-- Key Features -->
        <div class="grid grid-cols-2 gap-4">
          <div class="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Billing Cycle</p>
            <p class="text-sm font-bold text-gray-900 capitalize">{{ plan.interval }}</p>
          </div>

          <div class="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Free Trial</p>
            <p class="text-sm font-bold text-gray-900">{{ plan.trial_days || 0 }} days</p>
          </div>
        </div>

        <!-- Integration Status -->
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">Stripe Integration</p>
                <p class="text-xs text-gray-500">{{ plan.stripe_price_id ? 'Connected & Synchronized' : 'Not Connected' }}</p>
              </div>
            </div>
            <div class="flex items-center">
              <div v-if="plan.stripe_price_id" class="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
              <div v-else class="w-3 h-3 bg-gray-300 rounded-full border-2 border-white shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Footer -->
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div class="space-y-3">
        <!-- Primary Action -->
        <button
          @click="createCheckoutLink"
          :disabled="isCreatingCheckout"
          class="w-full inline-flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="!isCreatingCheckout" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <svg v-else class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isCreatingCheckout ? 'Creating Checkout...' : 'Create Checkout Link' }}
        </button>

        <!-- Secondary Actions -->
        <div class="flex space-x-2">
          <button
            @click="$emit('edit', plan)"
            class="flex-1 inline-flex items-center justify-center px-3 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Plan
          </button>
          <button
            @click="deletePlan"
            class="flex-1 inline-flex items-center justify-center px-3 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Plan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCommerceSubscriptionsStore } from '@/stores/useCommerceSubscriptionsStore'
import Swal from 'sweetalert2'

// defineProps and defineEmits are compiler macros, no need to import

const props = defineProps({
  plan: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'checkout-created'])

const subscriptionsStore = useCommerceSubscriptionsStore()
const isCreatingCheckout = ref(false)

const formatPrice = (price) => {
  if (!price) return '0.00'
  return parseFloat(price).toFixed(2)
}

const createCheckoutLink = async () => {
  if (isCreatingCheckout.value) return
  
  isCreatingCheckout.value = true
  
  try {
    console.log('Creating checkout link for plan:', props.plan.name)
    
    // Show customer info modal
    const { value: formValues } = await Swal.fire({
        title: 'Customer Information',
        html: `
          <div class="text-left space-y-4">
            <div>
              <label for="customerName" class="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input type="text" id="customerName" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe">
            </div>
            <div>
              <label for="customerEmail" class="block text-sm font-medium text-gray-700 mb-1">Customer Email</label>
              <input type="email" id="customerEmail" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="customer@example.com" required>
            </div>
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Create Checkout',
        cancelButtonText: 'Cancel',
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'bg-blue-600 hover:bg-blue-700',
          cancelButton: 'bg-gray-300 hover:bg-gray-400'
        },
        preConfirm: () => {
          const customerName = document.getElementById('customerName').value
          const customerEmail = document.getElementById('customerEmail').value
          
          if (!customerName.trim()) {
            Swal.showValidationMessage('Customer name is required')
            return false
          }
          
          if (!customerEmail.trim()) {
            Swal.showValidationMessage('Customer email is required')
            return false
          }
          
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
            Swal.showValidationMessage('Please enter a valid email address')
            return false
          }
          
          return { customerName, customerEmail }
        }
      })

      if (formValues) {
        // Create checkout session - pass separate parameters as expected by store
        const response = await subscriptionsStore.createCheckoutSession(
          props.plan.id,  // planId
          formValues.customerEmail,  // customerEmail
          formValues.customerName  // customerName
        )

        // Store returns result directly, not wrapped in response.data
        if (response && response.checkout_url) {
          // Emit event with checkout data
          emit('checkout-created', {
            plan: props.plan,
            checkoutUrl: response.checkout_url,
            customer: formValues
          })

          // Show success message and redirect
          Swal.fire({
            icon: 'success',
            title: 'Checkout Created!',
            text: 'Redirecting to Stripe checkout...',
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          })

          // Redirect to checkout
          setTimeout(() => {
            window.open(response.checkout_url, '_blank')
          }, 1000)
        } else {
          throw new Error('Invalid checkout response')
        }
      }
  } catch (error) {
    console.error('Error creating checkout link:', error)
    
    Swal.fire({
      icon: 'error',
      title: 'Checkout Failed',
      text: error.response?.data?.message || 'Failed to create checkout link',
      timer: 3000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    })
  } finally {
    isCreatingCheckout.value = false
  }
}

const deletePlan = async () => {
  const result = await Swal.fire({
      title: 'Delete Plan?',
      text: `Are you sure you want to delete "${props.plan.name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-xl'
      }
    })

  if (result.isConfirmed) {
    emit('delete', props.plan.id)
  }
}
</script>