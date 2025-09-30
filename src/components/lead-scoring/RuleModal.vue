<template>
  <div class="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
        <!-- Modal header -->
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {{ isEditing ? 'Edit Scoring Rule' : 'Create New Scoring Rule' }}
              </h3>
              
              <!-- Form -->
              <form @submit.prevent="handleSubmit" class="mt-5 space-y-6">
                <!-- Rule Name -->
                <div>
                  <label for="rule-name" class="block text-sm font-medium text-gray-700">
                    Rule Name <span class="text-red-500">*</span>
                  </label>
                  <div class="mt-1">
                    <input
                      type="text"
                      id="rule-name"
                      v-model="formData.name"
                      required
                      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g. Form Submission"
                    />
                  </div>
                </div>

                <!-- Description -->
                <div>
                  <label for="rule-description" class="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div class="mt-1">
                    <textarea
                      id="rule-description"
                      v-model="formData.description"
                      rows="2"
                      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="What does this rule do?"
                    ></textarea>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Event Type -->
                  <div>
                    <label for="event-type" class="block text-sm font-medium text-gray-700">
                      Event Type <span class="text-red-500">*</span>
                    </label>
                    <div class="mt-1">
                      <select
                        id="event-type"
                        v-model="formData.event_type"
                        required
                        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        @change="handleEventTypeChange"
                      >
                        <option value="" disabled>Select an event type</option>
                        <option v-for="event in eventTypes" :key="event.id" :value="event.id">
                          {{ event.name }}
                        </option>
                      </select>
                    </div>
                    <p v-if="selectedEventType?.description" class="mt-1 text-xs text-gray-500">
                      {{ selectedEventType.description }}
                    </p>
                  </div>

                  <!-- Points -->
                  <div>
                    <label for="points" class="block text-sm font-medium text-gray-700">
                      Points <span class="text-red-500">*</span>
                    </label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="number"
                        id="points"
                        v-model.number="formData.points"
                        required
                        min="1"
                        max="1000"
                        class="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="10"
                      />
                      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span class="text-gray-500 sm:text-sm"> points </span>
                      </div>
                    </div>
                    <p class="mt-1 text-xs text-gray-500">
                      Points to award when this rule is triggered (1-1000)
                    </p>
                  </div>
                </div>

                <!-- Condition Builder -->
                <div class="pt-2">
                  <div class="flex items-center justify-between">
                    <label class="block text-sm font-medium text-gray-700">
                      Condition <span class="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      @click="showAdvanced = !showAdvanced"
                      class="text-xs text-blue-600 hover:text-blue-800"
                    >
                      {{ showAdvanced ? 'Hide Advanced' : 'Show Advanced' }}
                    </button>
                  </div>
                  
                  <div v-if="!showAdvanced" class="mt-1 space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <!-- Operator -->
                      <div>
                        <select
                          v-model="formData.condition.operator"
                          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          <option v-for="op in filteredOperators" :key="op.id" :value="op.id">
                            {{ op.name }}
                          </option>
                        </select>
                      </div>
                      
                      <!-- Value -->
                      <div class="col-span-2">
                        <input
                          v-model="formData.condition.value"
                          type="text"
                          class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Enter value..."
                        />
                      </div>
                    </div>
                    
                    <!-- Time Window -->
                    <div>
                      <label class="block text-xs font-medium text-gray-500 mb-1">Time Window</label>
                      <TimeWindowSelector v-model="formData.condition.time_window" />
                    </div>
                  </div>
                  
                  <!-- Advanced JSON Editor -->
                  <div v-else class="mt-2">
                    <ConditionValidator
                      v-model="formData.condition"
                      :label="'Advanced Condition (JSON)'"
                      :hint="'Enter a valid JSON condition that matches the event data structure'"
                      :rows="6"
                      :validate-on-input="false"
                      class="mt-1"
                      @validated="handleConditionValidation"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <!-- Priority -->
                  <div>
                    <label for="priority" class="block text-sm font-medium text-gray-700">
                      Priority
                    </label>
                    <div class="mt-1">
                      <select
                        id="priority"
                        v-model.number="formData.priority"
                        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option v-for="p in 5" :key="p" :value="p">
                          {{ getPriorityName(p) }}
                        </option>
                      </select>
                    </div>
                    <p class="mt-1 text-xs text-gray-500">
                      Higher priority rules are evaluated first
                    </p>
                  </div>

                  <!-- Status -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Status</label>
                    <div class="mt-2">
                      <label class="inline-flex items-center">
                        <input
                          type="checkbox"
                          v-model="formData.is_active"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span class="ml-2 text-sm text-gray-700">Active</span>
                      </label>
                    </div>
                    <p class="mt-1 text-xs text-gray-500">
                      Inactive rules won't be evaluated
                    </p>
                  </div>
                </div>

                <!-- Preview Section -->
                <div v-if="showPreview" class="mt-6 pt-4 border-t border-gray-200">
                  <h4 class="text-sm font-medium text-gray-700 mb-3">Rule Preview</h4>
                  <div class="bg-gray-50 p-4 rounded-md text-sm">
                    <p class="font-medium">When a contact's <span class="text-blue-600">{{ selectedEventType?.name || 'event' }}</span> matches:</p>
                    <pre class="mt-2 p-3 bg-white rounded text-xs overflow-auto">{{ formatConditionPreview }}</pre>
                    <p class="mt-2">Add <span class="font-semibold">{{ formData.points }} points</span> to their lead score.</p>
                    <p v-if="formData.condition.time_window" class="text-xs text-gray-500 mt-1">
                      Only applies to events within the last {{ formatTimeWindow(formData.condition.time_window) }}
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Modal footer -->
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="handleSubmit"
            :disabled="isSubmitting"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
            <span v-else>
              {{ isEditing ? 'Update Rule' : 'Create Rule' }}
            </span>
          </button>
          <button
            type="button"
            @click="$emit('close')"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
          
          <!-- Delete button (only shown when editing) -->
          <button
            v-if="isEditing"
            type="button"
            @click="confirmDelete"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto"
          >
            Delete Rule
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteConfirm" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Delete Rule
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Are you sure you want to delete this rule? This action cannot be undone and will remove all associated scoring history.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="deleteRule"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Delete
          </button>
          <button
            type="button"
            @click="showDeleteConfirm = false"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { leadScoringService } from '@/services/leadScoring'
import ConditionValidator from './ConditionValidator.vue'
import TimeWindowSelector from './TimeWindowSelector.vue'

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false
  },
  rule: {
    type: Object,
    default: () => ({
      name: '',
      description: '',
      event_type: '',
      condition: {},
      points: 10,
      priority: 3,
      is_active: true,
      time_window: '30d'
    })
  },
  eventTypes: {
    type: Array,
    default: () => []
  },
  operators: {
    type: Array,
    default: () => [
      { id: 'equals', name: 'Equals' },
      { id: 'not_equals', name: 'Not Equals' },
      { id: 'contains', name: 'Contains' },
      { id: 'not_contains', name: 'Does Not Contain' },
      { id: 'starts_with', name: 'Starts With' },
      { id: 'ends_with', name: 'Ends With' },
      { id: 'greater_than', name: 'Greater Than' },
      { id: 'less_than', name: 'Less Than' },
      { id: 'is_set', name: 'Is Set' },
      { id: 'is_not_set', name: 'Is Not Set' }
    ]
  },
  timeWindows: {
    type: Array,
    default: () => [
      { value: '1h', label: '1 Hour' },
      { value: '24h', label: '24 Hours' },
      { value: '7d', label: '7 Days' },
      { value: '30d', label: '30 Days' },
      { value: '90d', label: '90 Days' },
      { value: 'lifetime', label: 'Lifetime' }
    ]
  }
})

const emit = defineEmits(['save', 'close', 'delete'])

// Form state
const formData = ref({
  name: '',
  description: '',
  event_type: '',
  condition: {
    operator: 'equals',
    value: '',
    time_window: '30d'
  },
  points: 10,
  priority: 3,
  is_active: true
})

// UI State
const isSubmitting = ref(false)
const showAdvanced = ref(false)
const showPreview = ref(true)
const showDeleteConfirm = ref(false)
const validationError = ref('')

// Initialize form with prop data
onMounted(() => {
  if (props.isEditing && props.rule) {
    formData.value = {
      ...formData.value,
      ...props.rule,
      // Ensure condition is an object
      condition: typeof props.rule.condition === 'string' 
        ? JSON.parse(props.rule.condition) 
        : props.rule.condition
    }
  }
})

// Computed properties
const selectedEventType = computed(() => {
  return props.eventTypes.find(et => et.id === formData.value.event_type) || {}
})

const filteredOperators = computed(() => {
  // Filter operators based on selected event type
  return props.operators
})

const formatConditionPreview = computed(() => {
  try {
    if (showAdvanced.value) {
      return JSON.stringify(formData.value.condition, null, 2)
    }
    
    const { operator, value, time_window } = formData.value.condition
    let conditionStr = `${operator} "${value}"`
    
    if (time_window && time_window !== 'lifetime') {
      conditionStr += ` (within ${formatTimeWindow(time_window)})`
    }
    
    return conditionStr
  } catch (e) {
    return 'Invalid condition format'
  }
})

// Methods
const handleEventTypeChange = () => {
  // Reset condition when event type changes
  formData.value.condition = {
    operator: 'equals',
    value: '',
    time_window: '30d'
  }
}

const formatTimeWindow = (window) => {
  const windowMap = {
    '1h': '1 hour',
    '24h': '24 hours',
    '7d': '7 days',
    '30d': '30 days',
    '90d': '90 days',
    'lifetime': 'all time'
  }
  return windowMap[window] || window
}

const getPriorityName = (priority) => {
  const priorities = {
    1: 'Critical',
    2: 'High',
    3: 'Medium',
    4: 'Low',
    5: 'Lowest'
  }
  return priorities[priority] || `Priority ${priority}`
}

const handleConditionValidation = (result) => {
  if (!result.valid) {
    validationError.value = result.error || 'Invalid condition format'
  } else {
    validationError.value = ''
  }
}

const validateForm = () => {
  if (!formData.value.name) {
    return 'Rule name is required'
  }
  
  if (!formData.value.event_type) {
    return 'Event type is required'
  }
  
  if (!formData.value.points || formData.value.points < 0) {
    return 'Points must be a positive number'
  }
  
  if (showAdvanced.value && validationError.value) {
    return validationError.value
  }
  
  if (!showAdvanced.value && !formData.value.condition.operator) {
    return 'Condition operator is required'
  }
  
  return ''
}

const handleSubmit = async () => {
  const error = validateForm()
  if (error) {
    alert(error)
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Prepare the rule data
    const ruleData = {
      ...formData.value,
      // Stringify condition if it's an object
      condition: typeof formData.value.condition === 'string' 
        ? formData.value.condition 
        : JSON.stringify(formData.value.condition)
    }
    
    emit('save', ruleData)
  } catch (error) {
    console.error('Error saving rule:', error)
    alert(`Failed to save rule: ${error.message || 'Unknown error'}`)
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const deleteRule = async () => {
  try {
    emit('delete', formData.value.id)
    showDeleteConfirm.value = false
  } catch (error) {
    console.error('Error deleting rule:', error)
    alert(`Failed to delete rule: ${error.message || 'Unknown error'}`)
  }
}

// Watch for changes to the rule prop
watch(() => props.rule, (newRule) => {
  if (newRule) {
    formData.value = {
      ...formData.value,
      ...newRule,
      condition: typeof newRule.condition === 'string' 
        ? JSON.parse(newRule.condition) 
        : newRule.condition
    }
  }
}, { deep: true })
</script>

<style scoped>
/* Add any custom styles here */
</style>
