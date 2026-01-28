<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
        <p class="mt-6 text-lg font-medium text-gray-700">Loading payment details...</p>
        <p class="mt-2 text-sm text-gray-500">Please wait while we prepare your payment</p>
      </div>
    </div>

    <!-- Processing State (Form submitting) -->
    <div v-else-if="processing" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
        <p class="mt-6 text-lg font-medium text-gray-700">Redirecting to payment gateway...</p>
        <p class="mt-2 text-sm text-gray-500">You will be redirected shortly</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen px-4">
      <div class="text-center max-w-lg mx-auto">
        <div class="bg-white rounded-2xl shadow-xl border border-red-100 p-8">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Payment Link Not Available</h3>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <button 
            @click="loadPaymentLink"
            class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    </div>

    <!-- Hidden Form for PayFast (auto-submits) -->
    <!-- Keep form in DOM even when processing (remove !processing condition) -->
    <form
      v-if="payfastFormData"
      ref="payfastForm"
      :action="payfastUrl"
      method="POST"
      style="display: none;"
    >
      <input
        v-for="(value, key) in payfastFormData"
        :key="key"
        :name="key"
        :value="value"
        type="hidden"
      />
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { commerceAPI } from '@/services/api'

const route = useRoute()
const loading = ref(true)
const processing = ref(false)
const error = ref('')
const payfastFormData = ref(null)
const payfastUrl = ref('')
const payfastForm = ref(null)

const loadPaymentLink = async () => {
  loading.value = true
  processing.value = false
  error.value = ''
  payfastFormData.value = null
  payfastUrl.value = ''
  
  try {
    const linkId = route.params.id
    if (!linkId) {
      throw new Error('Payment link ID is required')
    }
    
    // Fetch payment link from public API
    const response = await commerceAPI.getPublicPaymentLink(linkId)
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to load payment link')
    }
    
    const paymentLink = response.data.data
    
    // Check if payment link exists
    if (!paymentLink) {
      throw new Error('Payment link not found')
    }
    
    // Detect payment gateway
    const gateway = paymentLink.metadata?.payment_gateway
    
    if (gateway === 'payfast') {
      // Handle PayFast payment
      await handlePayFastPayment(paymentLink)
    } else if (gateway === 'stripe') {
      // Handle Stripe payment - redirect directly
      if (paymentLink.public_url) {
        window.location.href = paymentLink.public_url
      } else {
        throw new Error('Stripe payment URL not available')
      }
    } else {
      throw new Error(`Unsupported payment gateway: ${gateway || 'unknown'}`)
    }
  } catch (err) {
    console.error('Error loading payment link:', err)
    error.value = err.response?.data?.message || err.message || 'Payment link not found or expired'
    loading.value = false
  }
}

const handlePayFastPayment = async (paymentLink) => {
  try {
    // Extract payment data from metadata
    const paymentData = paymentLink.metadata?.payment_data
    
    if (!paymentData) {
      throw new Error('PayFast payment data not found')
    }
    
    // Extract PayFast URL
    const payfastUrlValue = paymentLink.public_url || paymentLink.url
    
    if (!payfastUrlValue) {
      throw new Error('PayFast payment URL not found')
    }
    
    // Validate payment data has required fields
    if (!paymentData.merchant_id || !paymentData.merchant_key || !paymentData.amount) {
      console.error('Payment data received:', paymentData)
      throw new Error('PayFast payment data is incomplete. Missing required fields (merchant_id, merchant_key, or amount).')
    }
    
    // Filter form data: Remove null, undefined, and empty string values
    const filteredPaymentData = {}
    Object.keys(paymentData).forEach(key => {
      const value = paymentData[key]
      // Only include valid values (not null, undefined, or empty string)
      if (value !== null && value !== undefined && value !== '') {
        filteredPaymentData[key] = value
      }
    })
    
    console.log('Filtered payment data:', filteredPaymentData)
    console.log('PayFast URL:', payfastUrlValue)
    
    // Store filtered form data and URL
    payfastFormData.value = filteredPaymentData
    payfastUrl.value = payfastUrlValue
    
    // Hide loading state first
    loading.value = false
    
    // Wait for form to be rendered in DOM
    await nextTick()
    
    // Additional wait to ensure form is fully rendered and ready (increased to 250ms)
    await new Promise(resolve => setTimeout(resolve, 250))
    
    // Verify form exists in DOM before submitting
    if (payfastForm.value) {
      // Verify form is actually in the DOM
      const formInDOM = document.body.contains(payfastForm.value) || 
                       document.querySelector('form[method="POST"]')
      
      if (!formInDOM) {
        console.warn('Form not found in DOM, waiting a bit more...')
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      // Explicitly set form attributes to ensure they're applied
      payfastForm.value.method = 'POST'
      payfastForm.value.action = payfastUrl.value
      
      // Verify form attributes are set correctly
      console.log('Form method:', payfastForm.value.method)
      console.log('Form action:', payfastForm.value.action)
      console.log('Form inputs count:', payfastForm.value.querySelectorAll('input').length)
      
      // Show processing state AFTER form is ready
      processing.value = true
      
      // Submit form using submit() directly (more reliable across browsers)
      try {
        console.log('Submitting PayFast form...')
        payfastForm.value.submit()
        console.log('Form submitted successfully')
      } catch (submitError) {
        console.error('Form submission error:', submitError)
        // Try one more time with a small delay
        setTimeout(() => {
          if (payfastForm.value) {
            payfastForm.value.submit()
          }
        }, 100)
      }
    } else {
      throw new Error('Failed to create payment form - form element not found')
    }
  } catch (err) {
    console.error('Error handling PayFast payment:', err)
    error.value = err.message || 'Failed to process PayFast payment'
    loading.value = false
    processing.value = false
  }
}

onMounted(() => {
  loadPaymentLink()
})
</script>

