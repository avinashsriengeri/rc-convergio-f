<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {{ label || 'Condition' }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      
      <div class="mt-1 relative">
        <!-- Condition Input -->
        <div class="flex rounded-md shadow-sm">
          <div class="relative flex-grow">
            <textarea
              ref="conditionInput"
              v-model="conditionText"
              :class="[
                'focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md sm:text-sm border-gray-300',
                { 'border-red-300': validationError, 'border-green-300': isValid && conditionText }
              ]"
              :rows="rows"
              :placeholder="placeholder || 'Enter condition in JSON format'"
              @input="onInput"
            ></textarea>
            
            <!-- Loading Indicator -->
            <div v-if="isValidating" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            
            <!-- Validation Icons -->
            <div v-else class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg v-if="validationError" class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              <svg v-else-if="isValid && conditionText" class="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <svg v-else class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="mt-2 flex items-center justify-between">
          <div class="flex space-x-2">
            <button
              type="button"
              @click="formatCondition"
              class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Format
            </button>
            <button
              type="button"
              @click="validateCondition"
              :disabled="!conditionText || isValidating"
              class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Validate
            </button>
          </div>
          
          <div v-if="lastValidated" class="text-xs text-gray-500">
            Last validated: {{ formatTime(lastValidated) }}
          </div>
        </div>
        
        <!-- Error Message -->
        <div v-if="validationError" class="mt-2 text-sm text-red-600">
          <p>{{ validationError }}</p>
          <p v-if="validationDetails" class="mt-1 text-xs text-red-500">{{ validationDetails }}</p>
        </div>
        
        <!-- Help Text -->
        <div v-if="hint && !validationError" class="mt-1 text-xs text-gray-500">
          {{ hint }}
        </div>
      </div>
    </div>
    
    <!-- Condition Builder (Optional) -->
    <div v-if="showBuilder" class="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
      <h4 class="text-sm font-medium text-gray-700 mb-3">Condition Builder</h4>
      <!-- Add your condition builder UI here -->
      <p class="text-sm text-gray-500">Condition builder coming soon. For now, enter your condition in JSON format.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { leadScoringService } from '@/services/leadScoring'

const props = defineProps({
  modelValue: {
    type: [String, Object],
    default: ''
  },
  label: {
    type: String,
    default: 'Condition'
  },
  placeholder: {
    type: String,
    default: 'Enter condition in JSON format (e.g., {"event_type": "form_submitted", "operator": "equals", "value": "contact_form"})'
  },
  hint: {
    type: String,
    default: 'Enter a valid JSON condition or use the builder below.'
  },
  required: {
    type: Boolean,
    default: false
  },
  rows: {
    type: Number,
    default: 4
  },
  validateOnInput: {
    type: Boolean,
    default: true
  },
  debounce: {
    type: Number,
    default: 500
  },
  showBuilder: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'validated', 'error'])

const conditionText = ref('')
const isValid = ref(false)
const isValidating = ref(false)
const validationError = ref('')
const validationDetails = ref('')
const lastValidated = ref(null)
const validationTimeout = ref(null)
const conditionInput = ref(null)

// Initialize with modelValue
onMounted(() => {
  if (props.modelValue) {
    if (typeof props.modelValue === 'string') {
      conditionText.value = props.modelValue
    } else {
      conditionText.value = JSON.stringify(props.modelValue, null, 2)
    }
  }
})

// Watch for modelValue changes from parent
watch(() => props.modelValue, (newVal) => {
  if (newVal && typeof newVal === 'object') {
    conditionText.value = JSON.stringify(newVal, null, 2)
  } else if (newVal !== conditionText.value) {
    conditionText.value = newVal || ''
  }
})

// Handle input with debounce
const onInput = () => {
  // Clear previous timeout
  if (validationTimeout.value) {
    clearTimeout(validationTimeout.value)
  }
  
  // Update parent
  emitUpdate()
  
  // Validate on input if enabled
  if (props.validateOnInput) {
    isValidating.value = true
    validationTimeout.value = setTimeout(() => {
      validateCondition()
    }, props.debounce)
  }
}

// Format the JSON condition
const formatCondition = () => {
  try {
    if (!conditionText.value.trim()) return
    
    const parsed = JSON.parse(conditionText.value)
    conditionText.value = JSON.stringify(parsed, null, 2)
    emitUpdate()
  } catch (error) {
    validationError.value = 'Invalid JSON format'
    validationDetails.value = error.message
    isValid.value = false
    emit('validated', { valid: false, error: error.message })
  }
}

// Validate the condition
const validateCondition = async () => {
  if (!conditionText.value.trim()) {
    resetValidation()
    return
  }
  
  try {
    isValidating.value = true
    validationError.value = ''
    validationDetails.value = ''
    
    // First, check if it's valid JSON
    let parsed
    try {
      parsed = JSON.parse(conditionText.value)
    } catch (error) {
      throw new Error('Invalid JSON format')
    }
    
    // Then validate with the API
    const result = await leadScoringService.validateCondition(parsed)
    
    if (result.valid) {
      isValid.value = true
      validationError.value = ''
      lastValidated.value = new Date()
      emit('validated', { valid: true, data: result.data })
    } else {
      throw new Error(result.errors?.[0] || 'Invalid condition')
    }
  } catch (error) {
    isValid.value = false
    validationError.value = error.message || 'Validation failed'
    emit('validated', { valid: false, error: error.message })
  } finally {
    isValidating.value = false
  }
}

// Reset validation state
const resetValidation = () => {
  isValid.value = false
  validationError.value = ''
  validationDetails.value = ''
  emit('validated', { valid: false })
}

// Emit update to parent
const emitUpdate = () => {
  try {
    const value = conditionText.value.trim() ? JSON.parse(conditionText.value) : null
    emit('update:modelValue', value)
  } catch (error) {
    emit('update:modelValue', conditionText.value)
  }
}

// Format time for display
const formatTime = (date) => {
  if (!date) return ''
  
  const d = new Date(date)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Focus the input
const focus = () => {
  if (conditionInput.value) {
    conditionInput.value.focus()
  }
}

// Expose methods
defineExpose({
  validate: validateCondition,
  format: formatCondition,
  focus
})
</script>

<style scoped>
/* Add any custom styles here */
</style>
