<template>
  <div
    class="fixed inset-0 z-50 overflow-y-auto"
    @click="$emit('close')"
  >
    <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6" @click.stop>
        <div class="sm:flex sm:items-start">
          <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Bulk Recalculate Scores
            </h3>
            
            <form @submit.prevent="handleBulkRecalculate" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Contact Emails</label>
                <textarea
                  v-model="contactEmails"
                  placeholder="john@company.com&#10;jane@company.com&#10;mike@company.com"
                  rows="4"
                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
                <p class="mt-1 text-xs text-gray-500">Enter one email address per line or separate with commas</p>
              </div>

              <!-- Progress Display -->
              <Transition
                enter-active-class="transition ease-out duration-300"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-200"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-if="isProcessing && progress.total > 0" class="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-blue-900">Processing...</span>
                    <span class="text-sm text-blue-700">{{ progress.processed }} / {{ progress.total }}</span>
                  </div>
                  <div class="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${(progress.processed / progress.total) * 100}%` }"
                    ></div>
                  </div>
                  <p class="mt-2 text-xs text-blue-600">
                    {{ progress.successful }} successful, {{ progress.failed }} failed
                  </p>
                </div>
              </Transition>

              <!-- Result Display -->
              <Transition
                enter-active-class="transition ease-out duration-300"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-200"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-if="result" class="bg-green-50 border border-green-200 rounded-md p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-green-800">Bulk Recalculation Complete</h3>
                      <div class="mt-2 text-sm text-green-700">
                        <p><strong>Total processed:</strong> {{ result.total }}</p>
                        <p><strong>Successful:</strong> {{ result.successful }}</p>
                        <p v-if="result.failed > 0"><strong>Failed:</strong> {{ result.failed }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>

              <!-- Error Display -->
              <Transition
                enter-active-class="transition ease-out duration-300"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-200"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-red-800">Error</h3>
                      <div class="mt-2 text-sm text-red-700">
                        <p>{{ error }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>

              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  :disabled="isProcessing || !hasValidEmails"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400"
                >
                  <svg v-if="isProcessing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isProcessing ? 'Processing...' : 'Recalculate Scores' }}
                </button>
                <button
                  type="button"
                  @click="$emit('close')"
                  :disabled="isProcessing"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {{ isProcessing ? 'Please wait...' : 'Cancel' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['close', 'recalculate'])

const contactEmails = ref('')
const isProcessing = ref(false)
const result = ref(null)
const error = ref(null)
const progress = ref({
  total: 0,
  processed: 0,
  successful: 0,
  failed: 0
})

const hasValidEmails = computed(() => {
  if (!contactEmails.value.trim()) return false
  
  const emails = contactEmails.value
    .split(/[,\n]/)
    .map(email => email.trim())
    .filter(email => email !== '' && email.includes('@'))
  
  return emails.length > 0
})

const handleBulkRecalculate = async () => {
  if (!hasValidEmails.value) return
  
  isProcessing.value = true
  error.value = null
  result.value = null
  
  // Parse emails
  const emails = contactEmails.value
    .split(/[,\n]/)
    .map(email => email.trim())
    .filter(email => email !== '' && email.includes('@'))
  
  progress.value = {
    total: emails.length,
    processed: 0,
    successful: 0,
    failed: 0
  }
  
  try {
    // Emit the recalculate event and let the parent handle the actual processing
    await emit('recalculate', contactEmails.value)
    
    // The parent will update the result through other means
    result.value = {
      total: emails.length,
      successful: emails.length, // This should be updated by parent
      failed: 0
    }
  } catch (err) {
    error.value = err.message || 'Failed to bulk recalculate scores'
  } finally {
    isProcessing.value = false
  }
}

// Method to update progress from parent
const updateProgress = (processed, successful, failed) => {
  progress.value.processed = processed
  progress.value.successful = successful
  progress.value.failed = failed
}

// Expose methods to parent if needed
defineExpose({
  updateProgress
})
</script>
