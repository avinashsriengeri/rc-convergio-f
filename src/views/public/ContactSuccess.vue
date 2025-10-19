<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <!-- Success Card -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="p-8 lg:p-12 text-center">
          <!-- Success Icon -->
          <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <svg class="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <!-- Success Message -->
          <h1 class="text-3xl font-bold text-gray-900 mb-4">Request Submitted Successfully!</h1>
          <p class="text-lg text-gray-600 mb-8">
            Thank you for contacting us. We've received your support request and will get back to you as soon as possible.
          </p>

          <!-- Ticket Information -->
          <div v-if="ticketId" class="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Your Ticket Details</h3>
            <div class="text-center">
              <p class="text-2xl font-bold text-blue-600 mb-2">Ticket #{{ ticketId }}</p>
              <p class="text-sm text-gray-500">Keep this number for your records</p>
            </div>
          </div>

          <!-- What's Next -->
          <div class="text-left mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span class="text-xs font-semibold text-blue-600">1</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Confirmation Email</p>
                  <p class="text-sm text-gray-600">You'll receive a confirmation email with your ticket details.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span class="text-xs font-semibold text-blue-600">2</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Team Assignment</p>
                  <p class="text-sm text-gray-600">Our support team will review and assign your ticket to the appropriate specialist.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span class="text-xs font-semibold text-blue-600">3</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Response</p>
                  <p class="text-sm text-gray-600">You'll receive a response within 2-4 hours during business hours.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Need Immediate Help?</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div class="text-center">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p class="font-medium text-gray-900">Email</p>
                <p class="text-gray-600">support@rcconvergio.com</p>
              </div>
              
              <div class="text-center">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <p class="font-medium text-gray-900">Phone</p>
                <p class="text-gray-600">+1 (555) 123-4567</p>
              </div>
              
              <div class="text-center">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p class="font-medium text-gray-900">Live Chat</p>
                <p class="text-gray-600">Available 24/7</p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              @click="submitAnother"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              Submit Another Request
            </button>
            
            <button
              @click="goHome"
              class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Router
const router = useRouter()
const route = useRoute()

// State
const ticketId = ref(null)

// Methods
const submitAnother = () => {
  router.push('/contact')
}

const goHome = () => {
  router.push('/')
}

// Lifecycle
onMounted(() => {
  // Get ticket ID from route params or query
  ticketId.value = route.params.ticketId || route.query.ticketId
})
</script>

