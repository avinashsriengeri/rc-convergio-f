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
              Recalculate Contact Score
            </h3>
            
            <form @submit.prevent="handleRecalculate" class="space-y-4">
              <div>
                <label for="contact-email" class="block text-sm font-medium text-gray-700 mb-2">Contact Email or Contact ID</label>
                <input
                  id="contact-email"
                  v-model="contactIdentifier"
                  type="text"
                  required
                  placeholder="john@company.com or contact ID"
                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p class="mt-1 text-xs text-gray-500">Enter the contact's email address or contact ID to recalculate their score</p>
              </div>

              <!-- Result Display -->
              <Transition
                enter-active-class="transition ease-out duration-300"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-200"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-if="recalculateResult" class="bg-green-50 border border-green-200 rounded-md p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div class="ml-3 w-full">
                      <h3 class="text-sm font-medium text-green-800">Score Recalculated Successfully</h3>
                      <div class="mt-2 text-sm text-green-700 space-y-1">
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <p><strong>Contact:</strong> {{ recalculateResult.contact_name || recalculateResult.email }}</p>
                            <p><strong>Email:</strong> {{ recalculateResult.email }}</p>
                          </div>
                          <div>
                            <p class="text-lg font-semibold text-green-800">
                              <strong>Current Score:</strong> 
                              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-1">
                                {{ recalculateResult.score }} points
                              </span>
                            </p>
                            <p v-if="recalculateResult.previous_score !== 'N/A'"><strong>Previous Score:</strong> {{ recalculateResult.previous_score }}</p>
                          </div>
                        </div>
                        
                        <!-- Rules Applied Section -->
                        <div class="mt-3 pt-3 border-t border-green-200">
                          <p class="font-medium text-green-800 mb-2">
                            <strong>Rules Applied:</strong> {{ recalculateResult.rules_count || 0 }} rule(s)
                          </p>
                          <div v-if="recalculateResult.rules_applied && recalculateResult.rules_applied.length > 0" class="space-y-1">
                            <div 
                              v-for="(rule, index) in recalculateResult.rules_applied" 
                              :key="index"
                              class="flex items-center justify-between text-xs bg-green-100 rounded px-2 py-1"
                            >
                              <span>{{ rule.name || `Rule ${index + 1}` }}</span>
                              <span class="font-medium">+{{ rule.points || 0 }} points</span>
                            </div>
                          </div>
                          <div v-else class="text-xs text-green-600 italic">
                            No scoring rules were triggered for this contact.
                          </div>
                        </div>
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
                  :disabled="recalculating || !contactIdentifier.trim()"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400"
                >
                  <svg v-if="recalculating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ recalculating ? 'Recalculating...' : 'Recalculate Score' }}
                </button>
                <button
                  type="button"
                  @click="$emit('close')"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
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
import { ref } from 'vue'

const emit = defineEmits(['close', 'recalculate'])

const contactIdentifier = ref('')
const recalculating = ref(false)
const recalculateResult = ref(null)
const error = ref(null)

const handleRecalculate = () => {
  if (!contactIdentifier.value.trim()) return
  
  recalculating.value = true
  error.value = null
  recalculateResult.value = null
  
  // Emit the recalculate event with the contact identifier
  emit('recalculate', contactIdentifier.value.trim())
}

// Expose methods for parent component to call
const setResult = (result) => {
  recalculateResult.value = result
  recalculating.value = false
}

const setError = (errorMessage) => {
  error.value = errorMessage
  recalculating.value = false
}

// Expose methods to parent
defineExpose({
  setResult,
  setError
})
</script>
