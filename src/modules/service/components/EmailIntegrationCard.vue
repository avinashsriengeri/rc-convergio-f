<template>
  <div class="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center space-x-4">
          <!-- Provider Icon -->
          <div :class="[
            'w-12 h-12 rounded-xl flex items-center justify-center shadow-sm',
            providerInfo.color === 'red' ? 'bg-red-100' : 
            providerInfo.color === 'blue' ? 'bg-blue-100' : 'bg-gray-100'
          ]">
            <svg class="w-6 h-6" :class="[
              providerInfo.color === 'red' ? 'text-red-600' : 
              providerInfo.color === 'blue' ? 'text-blue-600' : 'text-gray-600'
            ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <!-- Integration Info -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ integration.support_email }}</h3>
            <div class="flex items-center space-x-2 mt-1">
              <span class="text-sm text-gray-500">{{ providerInfo.name }}</span>
              <span class="text-gray-300">•</span>
              <span :class="[
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                statusInfo.color === 'green' ? 'bg-green-100 text-green-800' :
                statusInfo.color === 'red' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              ]">
                <div :class="[
                  'w-2 h-2 rounded-full mr-1.5',
                  statusInfo.color === 'green' ? 'bg-green-500' :
                  statusInfo.color === 'red' ? 'bg-red-500' :
                  'bg-yellow-500'
                ]"></div>
                {{ statusInfo.text }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions Dropdown -->
        <div class="relative">
          <button
            @click="showActions = !showActions"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="showActions"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
          >
            <div class="py-1">
              <button
                @click="editIntegration"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Integration
              </button>
              
              <button
                @click="testIntegration"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Test Connection
              </button>
              
              <button
                v-if="integration.is_connected"
                @click="syncEmails"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Sync Emails
              </button>
              
              <div class="border-t border-gray-100 my-1"></div>
              
              <button
                v-if="integration.is_connected"
                @click="disconnectIntegration"
                class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Disconnect
              </button>
              
              <button
                @click="deleteIntegration"
                class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 mb-4">
        <div class="text-center">
          <p class="text-2xl font-bold text-gray-900">{{ integration.tickets_count || 0 }}</p>
          <p class="text-sm text-gray-500">Tickets Created</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-gray-900">{{ integration.emails_processed || 0 }}</p>
          <p class="text-sm text-gray-500">Emails Processed</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-gray-900">{{ integration.last_synced_at ? formatDate(integration.last_synced_at) : 'Never' }}</p>
          <p class="text-sm text-gray-500">Last Synced</p>
        </div>
      </div>

      <!-- Settings -->
      <div class="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 class="text-sm font-medium text-gray-900 mb-3">Configuration</h4>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-500">Priority:</span>
            <span class="ml-2 font-medium text-gray-900 capitalize">{{ integration.default_priority || 'Medium' }}</span>
          </div>
          <div>
            <span class="text-gray-500">Auto-Assign:</span>
            <span class="ml-2 font-medium text-gray-900">{{ integration.auto_assign_to || 'None' }}</span>
          </div>
          <div>
            <span class="text-gray-500">Team:</span>
            <span class="ml-2 font-medium text-gray-900 capitalize">{{ integration.team_assignment || 'None' }}</span>
          </div>
          <div>
            <span class="text-gray-500">Auto-Create:</span>
            <span class="ml-2 font-medium text-gray-900">{{ integration.auto_create_tickets ? 'Yes' : 'No' }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <button
            v-if="!integration.is_connected"
            @click="connectIntegration"
            :disabled="emailStore.loading.connecting"
            class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span v-if="emailStore.loading.connecting">Connecting...</span>
            <span v-else>Connect Account</span>
          </button>
          
          <button
            v-if="integration.is_connected"
            @click="testIntegration"
            :disabled="emailStore.loading.testing"
            class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span v-if="emailStore.loading.testing">Testing...</span>
            <span v-else>Test Connection</span>
          </button>
        </div>

        <div class="text-sm text-gray-500">
          Created {{ formatDate(integration.created_at) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEmailIntegrationStore } from '../store/emailIntegration'

// Props
const props = defineProps({
  integration: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['edit', 'test', 'connect', 'disconnect', 'delete', 'sync'])

// Store
const emailStore = useEmailIntegrationStore()

// Local state
const showActions = ref(false)

// Computed
const providerInfo = computed(() => {
  return emailStore.getProviderInfo(props.integration.email_provider)
})

const statusInfo = computed(() => {
  return emailStore.getIntegrationStatus(props.integration)
})

// Methods
const formatDate = (dateString) => {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleDateString()
}

const editIntegration = () => {
  showActions.value = false
  emit('edit', props.integration)
}

const testIntegration = () => {
  showActions.value = false
  emit('test', props.integration)
}

const connectIntegration = () => {
  showActions.value = false
  emit('connect', props.integration)
}

const disconnectIntegration = () => {
  showActions.value = false
  emit('disconnect', props.integration)
}

const deleteIntegration = () => {
  showActions.value = false
  emit('delete', props.integration)
}

const syncEmails = () => {
  showActions.value = false
  emit('sync', props.integration)
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showActions.value = false
  }
}

// Add event listener
document.addEventListener('click', handleClickOutside)
</script>
