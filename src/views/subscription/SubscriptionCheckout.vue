<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
        <p class="mt-6 text-lg font-medium text-gray-700">Loading checkout details...</p>
        <p class="mt-2 text-sm text-gray-500">Please wait while we prepare your subscription checkout</p>
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
          <h3 class="text-xl font-bold text-gray-900 mb-2">Checkout Error</h3>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <button 
            @click="loadCheckout"
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { commerceAPI } from '@/services/api'
import { submitPayFastForm } from '@/utils/payfast'

const route = useRoute()
const loading = ref(true)
const processing = ref(false)
const error = ref('')

const loadCheckout = async () => {
  loading.value = true
  processing.value = false
  error.value = ''
  
  try {
    // Extract plan_id and email from URL query params
    const planId = route.query.plan_id
    const email = route.query.email
    
    if (!planId) {
      throw new Error('Plan ID is required in the URL')
    }
    
    if (!email) {
      throw new Error('Customer email is required in the URL')
    }
    
    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email address format')
    }
    
    // Generate return and cancel URLs
    const baseUrl = window.location.origin
    const returnUrl = `${baseUrl}/commerce/subscription-checkout/success`
    const cancelUrl = `${baseUrl}/subscription/checkout?plan_id=${planId}&email=${encodeURIComponent(email)}`
    
    // Prepare API payload
    const payload = {
      plan_id: parseInt(planId),
      customer_email: email,
      customer_name: email.split('@')[0], // Extract name from email
      return_url: returnUrl,
      cancel_url: cancelUrl,
      trial_days: 0
    }
    
    console.log('Creating checkout session with payload:', payload)
    
    // Call API to create checkout session
    const response = await commerceAPI.createCheckoutSession(payload)
    
    if (!response.data?.success) {
      throw new Error(response.data?.message || 'Failed to create checkout session')
    }
    
    const sessionData = response.data.data
    
    if (!sessionData) {
      throw new Error('Invalid checkout session response')
    }
    
    console.log('Checkout session response:', sessionData)
    console.log('Payment data exists:', !!sessionData.payment_data)
    
    // Check if PayFast (has payment_data) or Stripe/Demo
    if (sessionData.payment_data) {
      // PayFast: Submit POST form using shared utility
      await handlePayFastCheckout(sessionData)
    } else if (sessionData.session_url) {
      // Stripe/Demo: Redirect to session URL
      await handleStripeCheckout(sessionData.session_url)
    } else {
      throw new Error('No payment URL or data available')
    }
  } catch (err) {
    console.error('Error loading checkout:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to load checkout session'
    loading.value = false
  }
}

const handlePayFastCheckout = async (sessionData) => {
  try {
    const paymentData = sessionData.payment_data
    const payfastUrl = sessionData.session_url
    
    if (!paymentData) {
      throw new Error('PayFast payment data not found')
    }
    
    if (!payfastUrl) {
      throw new Error('PayFast payment URL not found')
    }
    
    // Validate required fields
    if (!paymentData.merchant_id || !paymentData.merchant_key || !paymentData.amount) {
      console.error('Payment data received:', paymentData)
      throw new Error('PayFast payment data is incomplete. Missing required fields (merchant_id, merchant_key, or amount).')
    }
    
    console.log('PayFast payment data:', paymentData)
    console.log('PayFast URL:', payfastUrl)
    
    // Hide loading state
    loading.value = false
    
    // Show processing state
    processing.value = true
    
    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Submit PayFast form using shared utility
    try {
      submitPayFastForm(payfastUrl, paymentData)
      console.log('PayFast form submitted successfully')
    } catch (submitError) {
      console.error('Error submitting PayFast form:', submitError)
      throw new Error('Failed to submit PayFast payment form')
    }
  } catch (err) {
    console.error('Error handling PayFast checkout:', err)
    error.value = err.message || 'Failed to process PayFast payment'
    loading.value = false
    processing.value = false
  }
}

const handleStripeCheckout = async (sessionUrl) => {
  try {
    loading.value = false
    processing.value = true
    
    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Redirect to Stripe checkout
    if (sessionUrl) {
      window.location.href = sessionUrl
    } else {
      throw new Error('Stripe checkout URL not available')
    }
  } catch (err) {
    console.error('Error handling Stripe checkout:', err)
    error.value = err.message || 'Failed to redirect to Stripe checkout'
    loading.value = false
    processing.value = false
  }
}

onMounted(() => {
  loadCheckout()
})
</script>


