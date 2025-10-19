<template>
  <div class="h-full bg-gray-50 flex flex-col">
    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Support Form -->
      <div class="p-3">
        <div class="max-w-md mx-auto">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-1">Submit a Support Ticket</h2>
              <p class="text-xs text-gray-600">
                Describe your issue and we'll get back to you as soon as possible.
              </p>
            </div>
            <button
              @click="closeWidget"
              class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Close"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitTicket" class="space-y-3">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Enter your full name"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Enter your email address"
              />
            </div>

            <!-- Subject -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                v-model="form.subject"
                type="text"
                required
                class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Brief description of your issue"
              />
            </div>

            <!-- Message -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                v-model="form.message"
                required
                rows="3"
                class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                placeholder="Please provide detailed information about your issue..."
              ></textarea>
            </div>

            <!-- Priority -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                v-model="form.priority"
                class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="low">Low</option>
                <option value="medium" selected>Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="submitting"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-sm"
            >
              <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span>{{ submitting ? 'Submitting...' : 'Submit Ticket' }}</span>
            </button>
          </form>

          <!-- Success Message -->
          <div v-if="success" class="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 class="text-sm font-medium text-green-800">Ticket Submitted Successfully!</h3>
                <p class="text-sm text-green-700 mt-1">
                  Your ticket #{{ ticketId }} has been created. We'll get back to you soon.
                </p>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 class="text-sm font-medium text-red-800">Submission Failed</h3>
                <p class="text-sm text-red-700 mt-1">{{ error }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'

// Route
const route = useRoute()

// State
const submitting = ref(false)
const success = ref(false)
const error = ref(null)
const ticketId = ref(null)

// Form data
const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
  priority: 'medium'
})


// Methods
const submitTicket = async () => {
  submitting.value = true
  error.value = null
  success.value = false

  try {
    const ticketData = {
      contact_name: form.value.name,
      contact_email: form.value.email,
      subject: form.value.subject,
      description: form.value.message,
      priority: form.value.priority,
      tenant_id: route.query.tenant
    }

    console.log('Submitting ticket:', ticketData)
    const response = await api.post('/public/tickets', ticketData)

    if (response.data.data) {
      ticketId.value = response.data.data.id
      success.value = true
      
      // Reset form
      form.value = {
        name: '',
        email: '',
        subject: '',
        message: '',
        priority: 'medium'
      }

      // Switch to FAQ tab after success
      setTimeout(() => {
        activeTab.value = 'faq'
        success.value = false
      }, 3000)
    }
  } catch (err) {
    console.error('Error submitting ticket:', err)
    error.value = err.response?.data?.message || 'Failed to submit ticket. Please try again.'
  } finally {
    submitting.value = false
  }
}


const closeWidget = () => {
  // Send message to parent window to close widget
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'RC_WIDGET_CLOSE' }, '*')
  }
}

// Handle messages from parent window
const handleMessage = (event) => {
  if (event.data.type === 'RC_WIDGET_CLOSE') {
    closeWidget()
  }
}

// Lifecycle
onMounted(() => {
  // Listen for messages from parent window
  window.addEventListener('message', handleMessage)
  
  // Debug log to verify correct component is loaded
  console.log('✅ WidgetView.vue loaded - Simplified support form without RC Convergio branding')
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Ensure proper iframe sizing */
:deep(body) {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

/* Make sure the widget fits in iframe */
.h-full {
  height: 100vh;
  max-height: 100vh;
}
</style>

