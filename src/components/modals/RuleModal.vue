<template>
  <div
    class="fixed inset-0 z-50 overflow-y-auto"
    @click="$emit('close')"
  >
    <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6" @click.stop>
        <div class="sm:flex sm:items-start">
          <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">
              {{ isEditing ? 'Edit Scoring Rule' : 'Create New Scoring Rule' }}
            </h3>
            
            <form @submit.prevent="handleSave" class="space-y-6">
              <!-- Basic Information -->
              <div class="grid grid-cols-1 gap-6">
                <div>
                  <label for="rule-name" class="block text-sm font-medium text-gray-700 mb-2">Rule Name *</label>
                  <input
                    id="rule-name"
                    v-model="ruleForm.name"
                    type="text"
                    required
                    placeholder="e.g., Email Engagement Rule"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label for="rule-description" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    id="rule-description"
                    v-model="ruleForm.description"
                    rows="2"
                    placeholder="Describe when this rule should apply..."
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  ></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="rule-points" class="block text-sm font-medium text-gray-700 mb-2">Points *</label>
                    <input
                      id="rule-points"
                      v-model="ruleForm.points"
                      type="number"
                      min="0"
                      max="100"
                      required
                      placeholder="25"
                      class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label for="rule-priority" class="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
                    <select
                      id="rule-priority"
                      v-model="ruleForm.priority"
                      required
                      class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select priority</option>
                      <option value="1">Critical</option>
                      <option value="2">High</option>
                      <option value="3">Medium</option>
                      <option value="4">Low</option>
                      <option value="5">Minimal</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Condition Builder -->
              <div class="border-t border-gray-200 pt-6">
                <h4 class="text-sm font-medium text-gray-900 mb-4">Scoring Condition</h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label for="event-type" class="block text-sm font-medium text-gray-700 mb-2">Event Type *</label>
                    <select
                      id="event-type"
                      v-model="ruleForm.event_type"
                      required
                      class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select event type</option>
                      <option v-for="eventType in eventTypes" :key="eventType.id" :value="eventType.id">
                        {{ eventType.name }}
                      </option>
                    </select>
                    <p v-if="ruleForm.event_type" class="mt-1 text-xs text-gray-500">
                      {{ eventTypes.find(e => e.id === ruleForm.event_type)?.description }}
                    </p>
                  </div>

                  <div>
                    <label for="operator" class="block text-sm font-medium text-gray-700 mb-2">Operator *</label>
                    <select
                      id="operator"
                      v-model="ruleForm.operator"
                      required
                      class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select operator</option>
                      <option v-for="operator in operators" :key="operator.id" :value="operator.id">
                        {{ operator.name }}
                      </option>
                    </select>
                    <p v-if="ruleForm.operator" class="mt-1 text-xs text-gray-500">
                      {{ operators.find(o => o.id === ruleForm.operator)?.description }}
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label for="threshold-value" class="block text-sm font-medium text-gray-700 mb-2">Threshold Value *</label>
                    <input
                      id="threshold-value"
                      v-model="ruleForm.value"
                      :type="isNumericOperator ? 'number' : 'text'"
                      :min="isNumericOperator ? '0' : undefined"
                      required
                      placeholder="1"
                      class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <p class="mt-1 text-xs text-gray-500">
                      {{ isNumericOperator ? 'Minimum number of times the event must occur' : 'Text value to match' }}
                    </p>
                  </div>

                  <div>
                    <label for="time-window" class="block text-sm font-medium text-gray-700 mb-2">Time Window *</label>
                    <select
                      id="time-window"
                      v-model="ruleForm.time_window"
                      required
                      class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select time window</option>
                      <option v-for="option in timeWindowOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                    <p class="mt-1 text-xs text-gray-500">Time period to evaluate the condition</p>
                  </div>
                </div>

                <!-- Active Toggle -->
                <div class="flex items-center">
                  <input
                    id="rule-active"
                    v-model="ruleForm.is_active"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="rule-active" class="ml-2 block text-sm text-gray-900">
                    Activate this rule immediately
                  </label>
                </div>

                <!-- Tabs for Form and JSON Preview -->
                <div class="mt-6">
                  <div class="border-b border-gray-200">
                    <nav class="-mb-px flex space-x-8">
                      <button
                        type="button"
                        @click="activeTab = 'form'"
                        :class="[
                          activeTab === 'form'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                          'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
                        ]"
                      >
                        Form View
                      </button>
                      <button
                        type="button"
                        @click="activeTab = 'json'"
                        :class="[
                          activeTab === 'json'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                          'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
                        ]"
                      >
                        JSON Preview
                      </button>
                    </nav>
                  </div>

                  <div class="mt-4">
                    <!-- JSON Preview Tab -->
                    <div v-if="activeTab === 'json' && conditionPreview" class="bg-gray-50 rounded-md p-3 border">
                      <pre class="text-xs text-gray-800 whitespace-pre-wrap">{{ JSON.stringify(conditionPreview, null, 2) }}</pre>
                      <p class="mt-2 text-xs text-gray-500">This condition will be sent to the API</p>
                    </div>
                    <div v-else-if="activeTab === 'json'" class="bg-gray-50 rounded-md p-3 border">
                      <p class="text-xs text-gray-500">Complete the form fields to see the JSON preview</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Modal Actions -->
              <div class="mt-6 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  @click="$emit('close')"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="saving || !isFormValid"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ saving 
                    ? (isEditing ? 'Updating...' : 'Creating...') 
                    : (isEditing ? 'Update Rule' : 'Create Rule') 
                  }}
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
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false
  },
  rule: {
    type: Object,
    default: null
  },
  eventTypes: {
    type: Array,
    required: true
  },
  operators: {
    type: Array,
    required: true
  },
  timeWindowOptions: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const saving = ref(false)
const activeTab = ref('form')

const ruleForm = ref({
  name: '',
  description: '',
  points: '',
  priority: '',
  is_active: true,
  // Structured condition fields
  event_type: '',
  operator: '',
  value: '',
  time_window: '30_days'
})

const isNumericOperator = computed(() => {
  const numericOperators = ['greater_than', 'less_than', 'greater_than_or_equal', 'less_than_or_equal']
  return numericOperators.includes(ruleForm.value.operator)
})

const isFormValid = computed(() => {
  return ruleForm.value.name && 
         ruleForm.value.points && 
         ruleForm.value.priority && 
         ruleForm.value.event_type && 
         ruleForm.value.operator && 
         ruleForm.value.value && 
         ruleForm.value.time_window
})

const conditionPreview = computed(() => {
  if (!ruleForm.value.event_type || !ruleForm.value.operator || !ruleForm.value.value || !ruleForm.value.time_window) {
    return null
  }
  
  return {
    event_type: ruleForm.value.event_type,
    operator: ruleForm.value.operator,
    value: isNumericOperator.value
      ? parseInt(ruleForm.value.value) || 0
      : ruleForm.value.value,
    time_window: ruleForm.value.time_window
  }
})

const handleSave = async () => {
  saving.value = true
  
  try {
    // Validate required fields
    if (!ruleForm.value.event_type || !ruleForm.value.operator || !ruleForm.value.value || !ruleForm.value.time_window) {
      throw new Error('Please fill in all condition fields')
    }

    // Build condition object
    const condition = {
      event_type: ruleForm.value.event_type,
      operator: ruleForm.value.operator,
      value: isNumericOperator.value
        ? parseInt(ruleForm.value.value) || 0
        : ruleForm.value.value,
      time_window: ruleForm.value.time_window
    }

    const data = {
      name: ruleForm.value.name,
      description: ruleForm.value.description,
      points: parseInt(ruleForm.value.points),
      priority: parseInt(ruleForm.value.priority),
      is_active: ruleForm.value.is_active,
      condition: condition
    }

    emit('save', data)
  } catch (error) {
    console.error('Validation error:', error)
  } finally {
    saving.value = false
  }
}

// Initialize form when editing
onMounted(() => {
  if (props.isEditing && props.rule) {
    // Parse existing condition
    let condition = props.rule.condition
    if (typeof condition === 'string') {
      try {
        condition = JSON.parse(condition)
      } catch (error) {
        console.error('Invalid condition JSON:', error)
        condition = {}
      }
    }
    
    ruleForm.value = {
      name: props.rule.name,
      description: props.rule.description || '',
      points: props.rule.points.toString(),
      priority: props.rule.priority.toString(),
      is_active: props.rule.is_active,
      event_type: condition.event_type || '',
      operator: condition.operator || '',
      value: condition.value ? condition.value.toString() : '',
      time_window: condition.time_window || '30_days'
    }
  }
})
</script>
