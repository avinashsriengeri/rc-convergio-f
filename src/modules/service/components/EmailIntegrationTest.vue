<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeModal">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-2xl bg-white" @click.stop>
      <!-- Modal Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Test Email Integration</h3>
            <p class="text-sm text-gray-500">{{ integration.support_email }}</p>
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

      <!-- Test Content -->
      <div class="space-y-6">
        <!-- Test Status -->
        <div v-if="testResult" class="p-4 rounded-lg" :class="testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
          <div class="flex items-center">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center mr-3',
              testResult.success ? 'bg-green-100' : 'bg-red-100'
            ]">
              <svg v-if="testResult.success" class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h4 :class="[
                'font-medium',
                testResult.success ? 'text-green-900' : 'text-red-900'
              ]">
                {{ testResult.success ? 'Test Successful' : 'Test Failed' }}
              </h4>
              <p :class="[
                'text-sm mt-1',
                testResult.success ? 'text-green-700' : 'text-red-700'
              ]">
                {{ testResult.message }}
              </p>
            </div>
          </div>
        </div>

        <!-- Test Details -->
        <div v-if="testResult" class="bg-gray-50 rounded-lg p-4">
          <h4 class="font-medium text-gray-900 mb-3">Test Details</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Connection Status:</span>
              <span :class="[
                'font-medium',
                testResult.connection_status === 'connected' ? 'text-green-600' : 'text-red-600'
              ]">
                {{ testResult.connection_status || 'Unknown' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Email Provider:</span>
              <span class="font-medium text-gray-900">{{ integration.email_provider }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Last Tested:</span>
              <span class="font-medium text-gray-900">{{ new Date().toLocaleString() }}</span>
            </div>
            <div v-if="testResult.response_time" class="flex justify-between">
              <span class="text-gray-500">Response Time:</span>
              <span class="font-medium text-gray-900">{{ testResult.response_time }}ms</span>
            </div>
          </div>
        </div>

        <!-- Test Actions -->
        <div class="flex items-center justify-between pt-6 border-t border-gray-200">
          <div class="flex items-center space-x-4">
            <button
              @click="runTest"
              :disabled="emailStore.loading.testing"
              class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span v-if="emailStore.loading.testing">Testing...</span>
              <span v-else>Run Test Again</span>
            </button>
            
            <button
              v-if="testResult && testResult.success"
              @click="syncEmails"
              :disabled="emailStore.loading.syncing"
              class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span v-if="emailStore.loading.syncing">Syncing...</span>
              <span v-else>Sync Emails</span>
            </button>
          </div>
          
          <button
            @click="closeModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useEmailIntegrationStore } from '../store/emailIntegration'

// Props
const props = defineProps({
  integration: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['close'])

// Store
const emailStore = useEmailIntegrationStore()

// Local state
const testResult = ref(null)

// Methods
const closeModal = () => {
  emit('close')
}

const runTest = async () => {
  const result = await emailStore.testIntegration(props.integration.id)
  testResult.value = result.data
}

const syncEmails = async () => {
  const result = await emailStore.syncEmails(props.integration.id)
  if (result.success) {
    console.log('Emails synced successfully:', result.data)
  } else {
    console.error('Failed to sync emails:', result.error)
  }
}

// Lifecycle
onMounted(async () => {
  await runTest()
})
</script>
