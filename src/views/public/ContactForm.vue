<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
            </svg>
          </div>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Get Support</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          We're here to help! Submit your support request and our team will get back to you as soon as possible.
        </p>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-2">
          <!-- Left Side - Form -->
          <div class="p-8 lg:p-12">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">Submit a Support Request</h2>
            
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Contact Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="contact_name" class="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="contact_name"
                    v-model="form.contact_name"
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label for="contact_email" class="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="contact_email"
                    v-model="form.contact_email"
                    type="email"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <!-- Company Information -->
              <div>
                <label for="company_name" class="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  id="company_name"
                  v-model="form.company_name"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your company name (optional)"
                />
              </div>

              <!-- Subject -->
              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  id="subject"
                  v-model="form.subject"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Brief description of your issue"
                />
              </div>

              <!-- Priority -->
              <div>
                <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  id="priority"
                  v-model="form.priority"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="medium" selected>Medium - Standard support</option>
                  <option value="high">High - Urgent issue</option>
                  <option value="urgent">Urgent - Critical problem</option>
                </select>
              </div>

              <!-- Description -->
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  v-model="form.description"
                  rows="5"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Please provide detailed information about your issue or question..."
                ></textarea>
              </div>

              <!-- Submit Button -->
              <div class="pt-4">
                <button
                  type="submit"
                  :disabled="submitting"
                  class="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  <span v-if="!submitting" class="flex items-center justify-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Submit Support Request
                  </span>
                  <span v-else class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                </button>
              </div>
            </form>
          </div>

          <!-- Right Side - Information -->
          <div class="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 lg:p-12 text-white">
            <h3 class="text-2xl font-semibold mb-6">How We Can Help</h3>
            
            <div class="space-y-6">
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold mb-2">Quick Response</h4>
                  <p class="text-blue-100">We typically respond within 2-4 hours during business hours.</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold mb-2">Expert Support</h4>
                  <p class="text-blue-100">Our experienced team is here to solve your technical issues.</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold mb-2">24/7 Monitoring</h4>
                  <p class="text-blue-100">Critical issues are monitored around the clock.</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold mb-2">Email Updates</h4>
                  <p class="text-blue-100">You'll receive email notifications about your ticket status.</p>
                </div>
              </div>
            </div>

            <!-- Contact Info -->
            <div class="mt-8 pt-6 border-t border-blue-500">
              <h4 class="font-semibold mb-3">Need Immediate Help?</h4>
              <div class="space-y-2 text-blue-100">
                <p>📧 support@rcconvergio.com</p>
                <p>📞 +1 (555) 123-4567</p>
                <p>💬 Live Chat Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    <!-- Notification -->
    <div
      v-if="notification.show"
      class="fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 p-4"
      :class="{
        'border-yellow-400 bg-yellow-50': notification.type === 'warning',
        'border-red-400 bg-red-50': notification.type === 'error',
        'border-green-400 bg-green-50': notification.type === 'success',
        'border-blue-400 bg-blue-50': notification.type === 'info'
      }"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            v-if="notification.type === 'warning'"
            class="h-5 w-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-else-if="notification.type === 'error'"
            class="h-5 w-5 text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-else-if="notification.type === 'success'"
            class="h-5 w-5 text-green-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-else
            class="h-5 w-5 text-blue-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-800">{{ notification.message }}</p>
        </div>
        <div class="ml-auto pl-3">
          <div class="-mx-1.5 -my-1.5">
            <button
              @click="notification.show = false"
              class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
              :class="{
                'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600': notification.type === 'warning',
                'text-red-500 hover:bg-red-100 focus:ring-red-600': notification.type === 'error',
                'text-green-500 hover:bg-green-100 focus:ring-green-600': notification.type === 'success',
                'text-blue-500 hover:bg-blue-100 focus:ring-blue-600': notification.type === 'info'
              }"
            >
              <span class="sr-only">Dismiss</span>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tenant Selector Modal -->
    <TenantSelector
      v-if="showTenantSelector"
      :form-data="form"
      @close="showTenantSelector = false"
      @submit="handleSubmitWithTenant"
      @contact-support="handleContactSupport"
    />

    <!-- Success Message -->
    <div
      v-if="showSuccess"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="showSuccess = false"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white"
        @click.stop
      >
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Request Submitted Successfully!</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500 mb-4">
              Your support request has been submitted. We'll get back to you soon!
            </p>
            <p class="text-sm font-medium text-gray-900 mb-2">Ticket ID: #{{ ticketId }}</p>
            <p class="text-xs text-gray-500">
              You'll receive a confirmation email shortly.
            </p>
          </div>
          <div class="items-center px-4 py-3">
            <button
              @click="showSuccess = false; resetForm()"
              class="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'
import TenantSelector from './TenantSelector.vue'

// Router
const router = useRouter()
const route = useRoute()

// State
const submitting = ref(false)
const showSuccess = ref(false)
const showTenantSelector = ref(false)
const ticketId = ref(null)
const urlTenantId = ref(null)
const notification = ref({ show: false, message: '', type: 'info' })

// Form data
const form = reactive({
  contact_name: '',
  contact_email: '',
  company_name: '',
  subject: '',
  description: '',
  priority: 'medium'
  // tenant_id will be set by tenant selector
})

// Methods
const handleSubmit = async () => {
  if (!form.contact_name.trim() || !form.contact_email.trim() || !form.subject.trim() || !form.description.trim()) {
    alert('Please fill in all required fields.')
    return
  }
  
  // If tenant ID is provided in URL, submit directly
  if (urlTenantId.value) {
    await handleSubmitWithTenant({
      ...form,
      tenant_id: urlTenantId.value
    })
  } else {
    // Show tenant selector for manual selection
    showTenantSelector.value = true
  }
}

const handleSubmitWithTenant = async (formDataWithTenant) => {
  submitting.value = true
  
  try {
    console.log('Submitting public ticket with tenant:', formDataWithTenant)
    
    // Submit to public API endpoint
    const response = await api.post('/public/tickets', formDataWithTenant)
    
    console.log('Public ticket response:', response)
    
    if (response.data && response.data.data) {
      ticketId.value = response.data.data.id
      showTenantSelector.value = false
      showSuccess.value = true
      
      // Redirect to success page after 3 seconds
      setTimeout(() => {
        router.push(`/contact/success/${ticketId.value}`)
      }, 3000)
    } else {
      throw new Error('Invalid response format')
    }
  } catch (error) {
    console.error('Error submitting public ticket:', error)
    
    // Check if it's a tenant validation error
    if (error.response?.status === 422 && error.response?.data?.errors?.tenant_id) {
      console.log('Tenant validation error, falling back to tenant selector')
      
      // If tenant ID from URL is invalid, show tenant selector instead
      if (urlTenantId.value) {
        urlTenantId.value = null // Clear invalid tenant ID
        showTenantSelector.value = true
        
        // Show a brief message to user
        notification.value = {
          show: true,
          message: 'The organization link appears to be invalid. Please select your organization from the list below.',
          type: 'warning'
        }
        
        // Hide notification after 5 seconds
        setTimeout(() => {
          notification.value.show = false
        }, 5000)
        return
      }
    }
    
    // Show error message for other errors
    alert('There was an error submitting your request. Please try again or contact us directly.')
  } finally {
    submitting.value = false
  }
}

const handleContactSupport = () => {
  showTenantSelector.value = false
  // You can add direct contact support functionality here
  alert('Please contact support directly at support@rcconvergio.com or call +1 (555) 123-4567')
}

const resetForm = () => {
  form.contact_name = ''
  form.contact_email = ''
  form.company_name = ''
  form.subject = ''
  form.description = ''
  form.priority = 'medium'
  showSuccess.value = false
  showTenantSelector.value = false
  ticketId.value = null
}

// Lifecycle
onMounted(() => {
  // Check if tenant ID is provided in URL
  const tenantParam = route.query.tenant
  if (tenantParam) {
    urlTenantId.value = parseInt(tenantParam)
    console.log('Tenant ID from URL:', urlTenantId.value)
  }
})
</script>
