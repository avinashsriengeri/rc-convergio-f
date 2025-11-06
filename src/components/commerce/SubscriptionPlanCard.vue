<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col overflow-hidden">
    <!-- Plan Header -->
    <div class="px-4 py-3 border-b border-gray-100">
      <div class="flex items-start justify-between">
        <div class="flex-1 pr-3">
          <h3 class="text-base font-bold text-gray-900 mb-0.5">{{ plan.name }}</h3>
          <p class="text-xs text-gray-600 line-clamp-2">{{ plan.metadata?.description || plan.description || 'Professional subscription plan' }}</p>
        </div>
        
        <!-- Status Badges -->
        <div class="flex flex-col items-end space-y-1.5">
          <span v-if="plan.active !== false" class="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-green-50 text-green-700 border border-green-200">
            <div class="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
            Active
          </span>
          <span v-else class="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-red-50 text-red-700 border border-red-200">
            <div class="w-1.5 h-1.5 bg-red-400 rounded-full mr-1"></div>
            Inactive
          </span>
          <div v-if="plan.stripe_price_id" class="flex items-center text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200" title="Synced with Stripe">
            <svg class="w-2.5 h-2.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-xs font-medium">Synced</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pricing Section -->
    <div class="px-4 py-4 text-center bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
      <div class="mb-1">
        <span class="text-xs text-gray-600 font-medium uppercase tracking-wide">{{ plan.interval }}</span>
      </div>
      <div class="flex items-baseline justify-center">
        <span class="text-gray-900 text-lg font-semibold mr-1">R</span>
        <span class="text-gray-900 text-3xl font-bold">{{ formatPrice(plan.amount_cents ? plan.amount_cents / 100 : plan.price) }}</span>
      </div>
      <p class="text-xs text-gray-500 mt-1">ZAR</p>
    </div>

    <!-- Plan Details -->
    <div class="px-4 py-3 flex-1">
      <div class="space-y-2.5">
        <!-- Key Features -->
        <div class="grid grid-cols-2 gap-2">
          <!-- Billing Cycle Card -->
          <div class="text-center p-2.5 bg-gray-50 rounded-lg border border-gray-200">
            <div class="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-1.5">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p class="text-xs font-medium text-gray-500 mb-0.5">Billing</p>
            <p class="text-xs font-bold text-gray-900 capitalize">{{ plan.interval }}</p>
          </div>

          <!-- Free Trial Card -->
          <div class="text-center p-2.5 bg-gray-50 rounded-lg border border-gray-200">
            <div class="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-1.5">
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-xs font-medium text-gray-500 mb-0.5">Trial</p>
            <p class="text-xs font-bold text-gray-900">{{ plan.trial_days || 0 }} days</p>
          </div>
        </div>

        <!-- Integration Status -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-2.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center mr-2">
                <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-900">Stripe</p>
                <p class="text-xs text-gray-600">{{ plan.stripe_price_id ? 'Connected' : 'Not Connected' }}</p>
              </div>
            </div>
            <div class="flex items-center">
              <div v-if="plan.stripe_price_id" class="w-2 h-2 bg-green-500 rounded-full"></div>
              <div v-else class="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Footer -->
    <div class="px-4 py-3 bg-gray-50 border-t border-gray-100">
      <div class="space-y-2">
        <!-- Primary Action -->
        <button
          @click="createCheckoutLink"
          :disabled="isCreatingCheckout"
          class="w-full inline-flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="!isCreatingCheckout" class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <svg v-else class="w-3.5 h-3.5 mr-1.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isCreatingCheckout ? 'Creating...' : 'Create Checkout' }}
        </button>

        <!-- Secondary Actions -->
        <div class="flex gap-2">
          <button
            @click="$emit('edit', plan)"
            class="flex-1 inline-flex items-center justify-center px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            @click="deletePlan"
            class="flex-1 inline-flex items-center justify-center px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-md hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200"
          >
            <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
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
  // Format South African Rand with proper spacing
  return new Intl.NumberFormat('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(parseFloat(price))
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
