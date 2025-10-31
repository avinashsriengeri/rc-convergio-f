<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out min-h-[320px] h-full flex flex-col overflow-hidden group">
    <!-- Professional Header Section -->
    <div class="bg-white p-5 pb-3 relative border-b border-gray-200">
      <div class="relative">
        <div class="flex items-center justify-between mb-3">
          <div class="flex-1">
            <h3 class="text-lg font-bold text-gray-900 group-hover:text-primary-purple transition-colors duration-200">{{ plan.name }}</h3>
            <p class="text-xs text-gray-500 mt-1 line-clamp-1">{{ plan.metadata?.description || plan.description || 'No description provided' }}</p>
          </div>
          <div class="flex items-center space-x-2 ml-3">
            <span v-if="plan.active !== false" class="inline-flex items-center px-2.5 py-1 text-xs rounded-full font-semibold bg-primary-purple text-white">
              <div class="w-1.5 h-1.5 bg-white rounded-full mr-1"></div>
              Active
            </span>
            <span v-else class="inline-flex items-center px-2.5 py-1 text-xs rounded-full font-semibold bg-gray-100 text-gray-600">
              Inactive
            </span>
            <div v-if="plan.stripe_price_id" class="flex items-center text-gray-600 bg-gray-100 p-1 rounded-full" title="Synced with Stripe">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Professional Body Section -->
    <div class="p-5 flex-1 flex flex-col">
      <!-- Price Section -->
      <div class="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-primary-purple rounded-lg flex items-center justify-center mr-3">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Price</p>
              <p class="text-2xl font-bold text-gray-900">${{ formatPrice(plan.amount_cents ? plan.amount_cents / 100 : plan.price) }}</p>
              <p class="text-xs text-gray-600 font-medium">{{ plan.currency?.toUpperCase() }} / {{ plan.interval }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Details Grid -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <div class="w-8 h-8 bg-primary-purple/10 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-4 h-4 text-primary-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Interval</p>
            <p class="text-sm font-semibold text-gray-900 capitalize">{{ plan.interval }}</p>
          </div>
        </div>

        <div class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <div class="w-8 h-8 bg-primary-purple/10 rounded-lg flex items-center justify-center mr-3">
            <svg class="w-4 h-4 text-primary-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Trial</p>
            <p class="text-sm font-semibold text-gray-900">{{ plan.trial_days || 0 }}d</p>
          </div>
        </div>
      </div>

      <!-- Stripe Status -->
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-primary-purple rounded-lg flex items-center justify-center mr-3">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Payment</p>
            <p class="text-sm font-semibold text-gray-900">{{ plan.stripe_price_id ? 'Synced' : 'Not synced' }}</p>
          </div>
        </div>
        <div v-if="plan.stripe_price_id" class="w-2 h-2 bg-primary-purple rounded-full"></div>
        <div v-else class="w-2 h-2 bg-primary-purple/30 rounded-full"></div>
      </div>
    </div>

    <!-- Professional Footer Section (Action Buttons) -->
    <div class="mt-auto border-t border-gray-100 pt-4 px-5 pb-5 bg-gradient-to-r from-gray-50/50 to-white">
      <div class="flex flex-col space-y-3">
        <!-- Primary Action Button -->
        <button
          @click="createCheckoutLink"
          :disabled="isCreatingCheckout"
          class="w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg text-sm font-semibold text-white bg-primary-purple hover:bg-primary-purple/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
          title="Create Checkout Link"
        >
          <svg v-if="!isCreatingCheckout" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <svg v-else class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isCreatingCheckout ? 'Creating...' : 'Checkout' }}
        </button>
        
        <!-- Secondary Action Buttons -->
        <div class="flex items-center space-x-2">
          <button
            @click="$emit('edit', plan)"
            class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-200"
            title="Edit Plan"
          >
            <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            @click="deletePlan"
            class="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-300 hover:shadow-md transition-all duration-200"
            title="Delete Plan"
          >
            <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  
  // Check if SweetAlert2 is available, fallback to prompt if not
  let customerEmail, customerName
  if (window.Swal && window.Swal.fire) {
    try {
      const result = await window.Swal.fire({
        title: 'Create Checkout Link',
        html: `
          <div class="text-left">
            <p class="mb-3">Enter customer details for "${props.plan.name}" checkout:</p>
            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">Customer Name (Optional)</label>
              <input type="text" id="customerName" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-purple" placeholder="John Doe">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Customer Email *</label>
              <input type="email" id="customerEmail" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-purple" placeholder="customer@example.com" required>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Create Checkout Link',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#7A2FF0',
        cancelButtonColor: '#6b7280',
        preConfirm: () => {
          const email = document.getElementById('customerEmail').value
          const name = document.getElementById('customerName').value
          
          if (!email) {
            window.Swal.showValidationMessage('Email is required!')
            return false
          }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            window.Swal.showValidationMessage('Please enter a valid email address!')
            return false
          }
          
          return { email, name }
        }
      })
      
      if (result.value) {
        customerEmail = result.value.email
        customerName = result.value.name || customerEmail.split('@')[0]
      }
    } catch (error) {
      console.warn('SweetAlert2 error, falling back to prompt:', error)
      customerEmail = prompt(`Enter customer email for "${props.plan.name}" checkout:`)
      customerName = customerEmail ? customerEmail.split('@')[0] : ''
    }
  } else {
    // Fallback to native prompt if SweetAlert2 is not available
    customerEmail = prompt(`Enter customer email for "${props.plan.name}" checkout:`)
    customerName = customerEmail ? customerEmail.split('@')[0] : ''
  }

  if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    if (window.Swal && window.Swal.fire) {
      window.Swal.fire({
        title: 'Invalid Email',
        text: 'Please enter a valid email address',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    } else {
      alert('Please enter a valid email address')
    }
    return
  }

  isCreatingCheckout.value = true

  try {
    console.log('=== COMPONENT CHECKOUT DEBUG ===')
    console.log('Calling createCheckoutSession with:', { planId: props.plan.id, customerEmail, customerName })
    
    const result = await subscriptionsStore.createCheckoutSession(props.plan.id, customerEmail, customerName)
    
    console.log('Store returned result:', result)
    console.log('Result type:', typeof result)
    console.log('Result checkout_url:', result?.checkout_url)
    console.log('Result success:', result?.success)
    
    if (result && result.checkout_url) {
      // Show success message with checkout URL
      const isDemoMode = result.demo_mode || false
      const title = isDemoMode ? 'Demo Checkout Link Created!' : 'Checkout Link Created!'
      const subtitle = isDemoMode ? 'Demo checkout link created successfully' : 'Checkout link created successfully'
      
      if (window.Swal && window.Swal.fire) {
        try {
          await window.Swal.fire({
            title: title,
            html: `
              <div class="text-left">
                <p class="mb-3">${subtitle} for <strong>${props.plan.name}</strong></p>
                ${isDemoMode ? '<p class="mb-3 text-sm text-primary-purple bg-primary-purple/10 p-2 rounded border">🎯 <strong>Demo Mode:</strong> This is a demo checkout link for testing purposes.</p>' : ''}
                <div class="bg-gray-100 p-3 rounded border">
                  <p class="text-sm text-gray-600 mb-2">Checkout URL:</p>
                  <code class="text-xs break-all">${result.checkout_url}</code>
                </div>
              </div>
            `,
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Open Checkout',
            cancelButtonText: 'Copy Link',
            confirmButtonColor: '#7A2FF0',
            cancelButtonColor: '#6b7280'
          }).then((result) => {
            if (result.isConfirmed) {
              // Open checkout in new tab
              window.open(result.checkout_url, '_blank')
            } else if (result.dismiss === window.Swal.DismissReason.cancel) {
              // Copy to clipboard
              navigator.clipboard.writeText(result.checkout_url).then(() => {
                window.Swal.fire({
                  title: 'Copied!',
                  text: 'Checkout link copied to clipboard',
                  icon: 'success',
                  timer: 2000,
                  showConfirmButton: false
                })
              })
            }
          })
        } catch (error) {
          console.warn('SweetAlert2 success modal error:', error)
          // Fallback to native alert
          const demoText = isDemoMode ? '\n\n🎯 Demo Mode: This is a demo checkout link for testing purposes.' : ''
          const shouldOpen = confirm(`Checkout link created!${demoText}\n\nURL: ${result.checkout_url}\n\nClick OK to open checkout, Cancel to copy link.`)
          if (shouldOpen) {
            window.open(result.checkout_url, '_blank')
          } else {
            navigator.clipboard.writeText(result.checkout_url)
            alert('Link copied to clipboard!')
          }
        }
      } else {
        // Fallback to native alert
        const demoText = isDemoMode ? '\n\n🎯 Demo Mode: This is a demo checkout link for testing purposes.' : ''
        const shouldOpen = confirm(`Checkout link created!${demoText}\n\nURL: ${result.checkout_url}\n\nClick OK to open checkout, Cancel to copy link.`)
        if (shouldOpen) {
          window.open(result.checkout_url, '_blank')
        } else {
          navigator.clipboard.writeText(result.checkout_url)
          alert('Link copied to clipboard!')
        }
      }

      emit('checkout-created', { plan: props.plan, checkoutUrl: result.checkout_url, demoMode: isDemoMode })
    } else {
      console.error('No checkout URL in result:', result)
      throw new Error('No checkout URL received from server')
    }
  } catch (error) {
    console.error('=== CHECKOUT ERROR DEBUG ===')
    console.error('Error creating checkout session:', error)
    console.error('Error message:', error.message)
    console.error('Error response:', error.response)
    
    if (window.Swal && window.Swal.fire) {
      try {
        await window.Swal.fire({
          title: 'Error',
          text: error.response?.data?.message || 'Failed to create checkout link. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#ef4444'
        })
      } catch (swalError) {
        console.warn('SweetAlert2 error modal failed:', swalError)
        alert(`Error: ${error.response?.data?.message || 'Failed to create checkout link. Please try again.'}`)
      }
    } else {
      alert(`Error: ${error.response?.data?.message || 'Failed to create checkout link. Please try again.'}`)
    }
  } finally {
    isCreatingCheckout.value = false
  }
}

const deletePlan = () => {
  if (window.Swal && window.Swal.fire) {
    try {
      window.Swal.fire({
        title: 'Delete Plan?',
        text: `Are you sure you want to delete "${props.plan.name}"? This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7A2FF0',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          emit('delete', props.plan.id)
        }
      })
    } catch (error) {
      console.warn('SweetAlert2 error, falling back to confirm:', error)
      if (confirm(`Are you sure you want to delete "${props.plan.name}"?`)) {
        emit('delete', props.plan.id)
      }
    }
  } else {
    if (confirm(`Are you sure you want to delete "${props.plan.name}"?`)) {
      emit('delete', props.plan.id)
    }
  }
}
</script>
