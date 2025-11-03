<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-xl font-bold text-gray-900">Commerce Settings</h1>
              <p class="text-sm text-gray-600">Configure your Stripe payment settings and preferences</p>
            </div>
            <div class="flex items-center space-x-3">
              <button
                @click="sendTestEmail"
                :disabled="loading"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Test Email
              </button>
              <button
                @click="testConnection"
                :disabled="loading || !isConfigured"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Test Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Connection Test Result -->
      <div v-if="connectionTest" class="mb-8">
        <div
          :class="[
            'rounded-md p-4',
            connectionTest.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          ]"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                v-if="connectionTest.success"
                class="h-5 w-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <svg
                v-else
                class="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3
                :class="[
                  'text-sm font-medium',
                  connectionTest.success ? 'text-green-800' : 'text-red-800'
                ]"
              >
                {{ connectionTest.success ? 'Connection Successful' : 'Connection Failed' }}
              </h3>
              <div
                :class="[
                  'mt-2 text-sm',
                  connectionTest.success ? 'text-green-700' : 'text-red-700'
                ]"
              >
                <p>{{ connectionTest.message }}</p>
                <p v-if="connectionTest.account_name" class="mt-1">
                  Account: {{ connectionTest.account_name }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Configuration Status -->
      <div class="mb-6 bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Configuration Status</h3>
        </div>
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div :class="[
                'w-3 h-3 rounded-full mr-3',
                isConfigured ? 'bg-green-400' : 'bg-gray-300'
              ]"></div>
              <div>
                <p class="text-sm font-medium text-gray-900">
                  {{ isConfigured ? 'Stripe Configured' : 'Stripe Not Configured' }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ isConfigured ? 'Your Stripe integration is ready to use' : 'Please configure your Stripe API keys below' }}
                </p>
              </div>
            </div>
            <div v-if="isConfigured" class="flex items-center text-sm text-green-600">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              Ready
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Form -->
      <div class="bg-white shadow rounded-lg">
        <form @submit.prevent="saveSettings">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Stripe Configuration</h3>
            <p class="mt-1 text-sm text-gray-500">
              Configure your Stripe API keys and payment settings
            </p>
          </div>

          <div class="px-6 py-6 space-y-6">
            <!-- Mode Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Environment Mode
              </label>
              <div class="space-y-3">
                <div class="flex items-center">
                  <input
                    id="test-mode"
                    v-model="formData.mode"
                    type="radio"
                    value="test"
                    class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <label for="test-mode" class="ml-3 block text-sm font-medium text-gray-700">
                    Test Mode
                    <span class="text-gray-500">- Use test API keys for development</span>
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    id="live-mode"
                    v-model="formData.mode"
                    type="radio"
                    value="live"
                    class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <label for="live-mode" class="ml-3 block text-sm font-medium text-gray-700">
                    Live Mode
                    <span class="text-gray-500">- Use live API keys for production</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- API Keys -->
            <div class="grid grid-cols-1 gap-6">
              <!-- Public Key -->
              <div>
                <label for="public-key" class="block text-sm font-medium text-gray-700">
                  Stripe Public Key
                </label>
                <div class="mt-1 relative">
                  <input
                    id="public-key"
                    v-model="formData.stripe_public_key"
                    type="text"
                    placeholder="pk_test_..."
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    :class="{ 'border-red-300': !isValidPublicKey && formData.stripe_public_key }"
                  />
                  <div v-if="!isValidPublicKey && formData.stripe_public_key" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p v-if="!isValidPublicKey && formData.stripe_public_key" class="mt-2 text-sm text-red-600 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  Public key should start with "pk_test_" or "pk_live_"
                </p>
                <p v-else class="mt-2 text-sm text-gray-500">
                  Your Stripe publishable key (starts with pk_test_ or pk_live_)
                </p>
              </div>

              <!-- Secret Key -->
              <div>
                <label for="secret-key" class="block text-sm font-medium text-gray-700">
                  Stripe Secret Key
                </label>
                <div class="mt-1 relative">
                  <input
                    id="secret-key"
                    v-model="formData.stripe_secret_key"
                    :type="showSecretKey ? 'text' : 'password'"
                    placeholder="sk_test_..."
                    class="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    :class="{ 'border-red-300': !isValidSecretKey && formData.stripe_secret_key }"
                  />
                  <button
                    type="button"
                    @click="showSecretKey = !showSecretKey"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg v-if="showSecretKey" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                    <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
                <p v-if="!isValidSecretKey && formData.stripe_secret_key" class="mt-2 text-sm text-red-600 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  Secret key should start with "sk_test_" or "sk_live_"
                </p>
                <p v-else class="mt-2 text-sm text-gray-500">
                  Your Stripe secret key (starts with sk_test_ or sk_live_)
                </p>
              </div>

              <!-- Webhook Secret (Optional) -->
              <div>
                <label for="webhook-secret" class="block text-sm font-medium text-gray-700">
                  Webhook Secret (Optional)
                </label>
                <div class="mt-1 relative">
                  <input
                    id="webhook-secret"
                    v-model="formData.stripe_webhook_secret"
                    :type="showWebhookSecret ? 'text' : 'password'"
                    placeholder="whsec_..."
                    class="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    @click="showWebhookSecret = !showWebhookSecret"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg v-if="showWebhookSecret" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                    <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
                <p class="mt-2 text-sm text-gray-500">
                  Webhook endpoint secret for verifying Stripe webhooks (starts with whsec_)
                </p>
              </div>
            </div>

            <!-- Currency -->
            <div>
              <label for="currency" class="block text-sm font-medium text-gray-700">
                Default Currency
              </label>
              <select
                id="currency"
                v-model="formData.currency"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="usd">USD - US Dollar</option>
                <option value="eur">EUR - Euro</option>
                <option value="gbp">GBP - British Pound</option>
                <option value="cad">CAD - Canadian Dollar</option>
                <option value="aud">AUD - Australian Dollar</option>
              </select>
            </div>

            <!-- Payment Methods -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Accepted Payment Methods
              </label>
              <div class="space-y-2">
                <div class="flex items-center">
                  <input
                    id="card"
                    v-model="formData.payment_methods"
                    type="checkbox"
                    value="card"
                    class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label for="card" class="ml-3 block text-sm font-medium text-gray-700">
                    Credit/Debit Cards
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    id="bank_transfer"
                    v-model="formData.payment_methods"
                    type="checkbox"
                    value="bank_transfer"
                    class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label for="bank_transfer" class="ml-3 block text-sm font-medium text-gray-700">
                    Bank Transfer
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    id="paypal"
                    v-model="formData.payment_methods"
                    type="checkbox"
                    value="paypal"
                    class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label for="paypal" class="ml-3 block text-sm font-medium text-gray-700">
                    PayPal
                  </label>
                </div>
              </div>
            </div>

            <!-- Preferences -->
            <div class="space-y-4">
              <h4 class="text-sm font-medium text-gray-900">Order Preferences</h4>
              
              <div class="flex items-center">
                <input
                  id="auto_fulfill"
                  v-model="formData.auto_fulfill_orders"
                  type="checkbox"
                  class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label for="auto_fulfill" class="ml-3 block text-sm font-medium text-gray-700">
                  Auto-fulfill orders when payment is received
                </label>
              </div>

              <div class="flex items-center">
                <input
                  id="send_confirmations"
                  v-model="formData.send_order_confirmations"
                  type="checkbox"
                  class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label for="send_confirmations" class="ml-3 block text-sm font-medium text-gray-700">
                  Send order confirmation emails
                </label>
              </div>

              <div class="flex items-center">
                <input
                  id="send_receipts"
                  v-model="formData.send_payment_receipts"
                  type="checkbox"
                  class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label for="send_receipts" class="ml-3 block text-sm font-medium text-gray-700">
                  Send payment receipt emails
                </label>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div class="flex items-center">
              <div v-if="isDirty" class="text-sm text-gray-500">
                You have unsaved changes
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <button
                v-if="isDirty"
                type="button"
                @click="resetForm"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset
              </button>
              <button
                type="submit"
                :disabled="loading || !isFormValid"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Save Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCommerceSettingsStore } from '@/stores/useCommerceSettingsStore'

const settingsStore = useCommerceSettingsStore()

const loading = ref(false)
const showSecretKey = ref(false)
const showWebhookSecret = ref(false)

const formData = ref({
  stripe_public_key: '',
  stripe_secret_key: '',
  stripe_webhook_secret: '',
  mode: 'test',
  currency: 'usd',
  payment_methods: ['card'],
  auto_fulfill_orders: true,
  send_order_confirmations: true,
  send_payment_receipts: true
})

const settings = computed(() => settingsStore.settings)
const connectionTest = computed(() => settingsStore.connectionTest)
const isDirty = computed(() => settingsStore.isDirty)

const isValidPublicKey = computed(() => {
  const key = formData.value.stripe_public_key
  return !key || key.startsWith('pk_test_') || key.startsWith('pk_live_')
})

const isValidSecretKey = computed(() => {
  const key = formData.value.stripe_secret_key
  return !key || key.startsWith('sk_test_') || key.startsWith('sk_live_')
})

const isFormValid = computed(() => {
  // Check if we have valid API keys
  const hasValidKeys = isValidPublicKey.value && 
                       isValidSecretKey.value && 
                       formData.value.stripe_public_key && 
                       formData.value.stripe_secret_key
  
  // Check if we have at least one payment method selected
  const hasPaymentMethods = formData.value.payment_methods && 
                           Array.isArray(formData.value.payment_methods) && 
                           formData.value.payment_methods.length > 0
  
  return hasValidKeys && hasPaymentMethods
})

const isConfigured = computed(() => {
  return !!(formData.value.stripe_public_key && formData.value.stripe_secret_key)
})


const saveSettings = async () => {
  loading.value = true
  try {
    await settingsStore.updateSettings(formData.value)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: 'Settings Saved!',
        text: 'Your Stripe configuration has been saved successfully',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  } catch (error) {
    console.error('Error saving settings:', error)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: error?.response?.data?.message || 'Failed to save settings',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  } finally {
    loading.value = false
  }
}

const testConnection = async () => {
  loading.value = true
  try {
    await settingsStore.testConnection()
    if (window.Swal) {
      window.Swal.fire({
        icon: connectionTest.value?.success ? 'success' : 'error',
        title: connectionTest.value?.success ? 'Connection Successful!' : 'Connection Failed',
        text: connectionTest.value?.message || 'Connection test completed',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  } catch (error) {
    console.error('Error testing connection:', error)
    if (window.Swal) {
      window.Swal.fire({
        icon: 'error',
        title: 'Connection Test Failed',
        text: error?.response?.data?.message || 'Failed to test Stripe connection',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    }
  } finally {
    loading.value = false
  }
}

const sendTestEmail = async () => {
  if (window.Swal) {
    const { value: formValues } = await window.Swal.fire({
      title: 'Send Test Email',
      html: `
        <div class="text-left">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
            <input id="customer_name" class="swal2-input" placeholder="Enter customer name" value="Test Customer">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input id="email" class="swal2-input" placeholder="Enter email address" value="test@example.com">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Send Test Email',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const customerName = document.getElementById('customer_name').value
        const email = document.getElementById('email').value
        
        if (!customerName.trim()) {
          window.Swal.showValidationMessage('Customer name is required')
          return false
        }
        
        if (!email.trim()) {
          window.Swal.showValidationMessage('Email address is required')
          return false
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          window.Swal.showValidationMessage('Please enter a valid email address')
          return false
        }
        
        return { customer_name: customerName, email: email }
      }
    })

    if (formValues) {
      loading.value = true
      try {
        await settingsStore.sendTestEmail(formValues)
        if (window.Swal) {
          window.Swal.fire({
            icon: 'success',
            title: 'Test Email Sent!',
            text: `Test email has been sent to ${formValues.email}`,
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          })
        }
      } catch (error) {
        console.error('Error sending test email:', error)
        if (window.Swal) {
          window.Swal.fire({
            icon: 'error',
            title: 'Email Failed',
            text: error?.response?.data?.message || 'Failed to send test email',
            timer: 3000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          })
        }
      } finally {
        loading.value = false
      }
    }
  } else {
    // Fallback to simple prompt if SweetAlert2 is not available
    const customerName = prompt('Enter customer name:', 'Test Customer')
    const email = prompt('Enter email address:', 'test@example.com')
    
    if (customerName && email) {
      loading.value = true
      try {
        await settingsStore.sendTestEmail({ customer_name: customerName, email: email })
        alert('Test email sent successfully!')
      } catch (error) {
        console.error('Error sending test email:', error)
        alert('Failed to send test email: ' + (error?.response?.data?.message || 'Unknown error'))
      } finally {
        loading.value = false
      }
    }
  }
}

const resetForm = async () => {
  if (window.Swal) {
    const result = await window.Swal.fire({
      title: 'Reset Settings?',
      text: 'This will reset all your Stripe configuration to default values. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, reset settings!',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        loading.value = true
        await settingsStore.resetSettings()
        await settingsStore.fetchSettings()
        formData.value = { ...settings.value }
        if (window.Swal) {
          window.Swal.fire({
            icon: 'success',
            title: 'Settings Reset!',
            text: 'Your Stripe configuration has been reset to default values',
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          })
        }
      } catch (error) {
        console.error('Error resetting settings:', error)
        if (window.Swal) {
          window.Swal.fire({
            icon: 'error',
            title: 'Reset Failed',
            text: error?.response?.data?.message || 'Failed to reset settings',
            timer: 3000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          })
        }
      } finally {
        loading.value = false
      }
    }
  } else {
    // Fallback to simple confirm
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      try {
        loading.value = true
        await settingsStore.resetSettings()
        await settingsStore.fetchSettings()
        formData.value = { ...settings.value }
      } catch (error) {
        console.error('Error resetting settings:', error)
        alert('Failed to reset settings: ' + (error?.response?.data?.message || error?.message || 'Unknown error'))
      } finally {
        loading.value = false
      }
    }
  }
}

const loadSettings = async () => {
  loading.value = true
  try {
    await settingsStore.fetchSettings()
    formData.value = { ...settings.value }
  } catch (error) {
    console.error('Error loading settings:', error)
  } finally {
    loading.value = false
  }
}

// Watch for form changes to mark as dirty
watch(formData, (newData) => {
  settingsStore.updateLocalSettings(newData)
}, { deep: true })

onMounted(() => {
  loadSettings()
})
</script>
