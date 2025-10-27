<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeModal">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-2xl bg-white" @click.stop>
      <!-- Modal Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Add Email Integration</h3>
            <p class="text-sm text-gray-500">Connect your email account to automatically create tickets</p>
          </div>
        </div>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Support Email Address -->
        <div>
          <label for="support_email" class="block text-sm font-medium text-gray-700 mb-2">
            Support Email Address *
          </label>
          <input
            id="support_email"
            v-model="form.support_email"
            type="email"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="support@yourcompany.com"
          />
          <p class="text-sm text-gray-500 mt-1">This is the email address customers will send support requests to</p>
        </div>

        <!-- Email Provider -->
        <div>
          <label for="email_provider" class="block text-sm font-medium text-gray-700 mb-2">
            Email Provider *
          </label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="provider in emailStore.emailProviders"
              :key="provider.id"
              @click="form.email_provider = provider.id"
              :class="[
                'p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md',
                form.email_provider === provider.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <div class="flex items-center space-x-3">
                <div :class="[
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  provider.color === 'red' ? 'bg-red-100' : 
                  provider.color === 'blue' ? 'bg-blue-100' : 'bg-gray-100'
                ]">
                  <svg class="w-4 h-4" :class="[
                    provider.color === 'red' ? 'text-red-600' : 
                    provider.color === 'blue' ? 'text-blue-600' : 'text-gray-600'
                  ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ provider.name }}</p>
                  <p class="text-sm text-gray-500">
                    {{ provider.id === 'gmail' ? 'Google Workspace' : 
                       provider.id === 'outlook' ? 'Microsoft 365' : 'Custom IMAP' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Default Priority -->
        <div>
          <label for="default_priority" class="block text-sm font-medium text-gray-700 mb-2">
            Default Priority
          </label>
          <select
            id="default_priority"
            v-model="form.default_priority"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <!-- Auto-Assign To -->
        <div>
          <label for="auto_assign_to" class="block text-sm font-medium text-gray-700 mb-2">
            Auto-Assign To
          </label>
          <select
            id="auto_assign_to"
            v-model="form.auto_assign_to"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <option value="">No Auto-Assignment</option>
            <option value="1">Agent 1</option>
            <option value="2">Agent 2</option>
            <option value="3">Agent 3</option>
          </select>
          <p class="text-sm text-gray-500 mt-1">Automatically assign new tickets to a specific agent</p>
        </div>

        <!-- Team Assignment -->
        <div>
          <label for="team_assignment" class="block text-sm font-medium text-gray-700 mb-2">
            Team Assignment
          </label>
          <select
            id="team_assignment"
            v-model="form.team_assignment"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <option value="">No Team Assignment</option>
            <option value="support">Support Team</option>
            <option value="technical">Technical Team</option>
            <option value="sales">Sales Team</option>
          </select>
        </div>

        <!-- Auto-create Tickets -->
        <div class="flex items-center">
          <input
            id="auto_create_tickets"
            v-model="form.auto_create_tickets"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="auto_create_tickets" class="ml-3 text-sm font-medium text-gray-700">
            Automatically create tickets from incoming emails
          </label>
        </div>

        <!-- Additional Settings -->
        <div class="border-t border-gray-200 pt-6">
          <h4 class="text-sm font-medium text-gray-900 mb-4">Additional Settings</h4>
          
          <!-- Email Subject Prefix -->
          <div class="mb-4">
            <label for="subject_prefix" class="block text-sm font-medium text-gray-700 mb-2">
              Email Subject Prefix
            </label>
            <input
              id="subject_prefix"
              v-model="form.subject_prefix"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="[Support]"
            />
            <p class="text-sm text-gray-500 mt-1">Prefix to add to outgoing email subjects</p>
          </div>

          <!-- Auto-Reply -->
          <div class="flex items-center mb-4">
            <input
              id="auto_reply"
              v-model="form.auto_reply"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="auto_reply" class="ml-3 text-sm font-medium text-gray-700">
              Send auto-reply to customers
            </label>
          </div>

          <!-- Auto-Reply Message -->
          <div v-if="form.auto_reply" class="mb-4">
            <label for="auto_reply_message" class="block text-sm font-medium text-gray-700 mb-2">
              Auto-Reply Message
            </label>
            <textarea
              id="auto_reply_message"
              v-model="form.auto_reply_message"
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Thank you for contacting us. We have received your message and will respond within 24 hours."
            ></textarea>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="closeModal"
            class="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="emailStore.loading.creating"
            class="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span v-if="emailStore.loading.creating" class="flex items-center">
              <svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Creating...
            </span>
            <span v-else>Create Integration</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useEmailIntegrationStore } from '../store/emailIntegration'

// Props
const props = defineProps({
  integration: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'created'])

// Store
const emailStore = useEmailIntegrationStore()

// Form data
const form = reactive({
  support_email: '',
  email_provider: 'gmail',
  default_priority: 'medium',
  auto_assign_to: '',
  team_assignment: '',
  auto_create_tickets: true,
  subject_prefix: '[Support]',
  auto_reply: false,
  auto_reply_message: 'Thank you for contacting us. We have received your message and will respond within 24 hours.'
})

// Methods
const closeModal = () => {
  emit('close')
}

const submitForm = async () => {
  // Map frontend form fields to backend expected fields
  const integrationData = {
    email_address: form.support_email,
    provider: form.email_provider,
    default_priority: form.default_priority,
    auto_assign_to: form.auto_assign_to || null,
    team_assignment: form.team_assignment || null,
    auto_create_tickets: form.auto_create_tickets,
    subject_prefix: form.subject_prefix,
    auto_reply: form.auto_reply,
    auto_reply_message: form.auto_reply_message
  }
  
  const result = await emailStore.createIntegration(integrationData)
  
  if (result.success) {
    emit('created', result.data)
  } else {
    // Handle error - show validation errors if available
    if (result.error && typeof result.error === 'object' && result.error.errors) {
      // Handle validation errors from backend
      console.error('Validation errors:', result.error.errors)
      // You can show these errors in the UI here
    } else {
      console.error('Failed to create integration:', result.error)
    }
  }
}
</script>
