<template>
  <div class="rule-builder">
    <!-- Rule Builder Header -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">Rule Builder</h3>
            <p class="text-sm text-gray-600">Create intelligent lead scoring rules with our visual builder</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="previewRule"
            class="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Preview
          </button>
          <button
            @click="testRule"
            class="px-4 py-2 text-sm font-medium text-green-600 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Test Rule
          </button>
        </div>
      </div>
    </div>

    <!-- Rule Configuration -->
    <div class="space-y-6">
      <!-- Basic Information -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Basic Information
        </h4>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Rule Name *</label>
            <input
              v-model="ruleData.name"
              type="text"
              required
              placeholder="e.g., Email Open Rule"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Points Awarded *</label>
            <input
              v-model="ruleData.points"
              type="number"
              min="1"
              max="100"
              required
              placeholder="e.g., 10"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>
        
        <div class="mt-6">
          <label class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            v-model="ruleData.description"
            placeholder="Describe what this rule does and when it triggers..."
            rows="3"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          ></textarea>
        </div>
      </div>

      <!-- Visual Rule Builder -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          When This Happens
        </h4>
        
        <!-- Event Type Selection -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 mb-3">Event Type *</label>
          <div v-if="Object.keys(eventTypes).length === 0" class="text-center py-8 text-gray-500">
            <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
            Loading event types...
          </div>
          <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <button
              v-for="(label, eventType) in eventTypes"
              :key="eventType"
              @click="selectEventType(eventType)"
              :class="[
                'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                selectedEventType === eventType
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              ]"
            >
              <div class="flex items-center">
                <div :class="[
                  'w-8 h-8 rounded-lg flex items-center justify-center mr-3',
                  selectedEventType === eventType ? 'bg-blue-100' : 'bg-gray-100'
                ]">
                  <svg :class="[
                    'w-4 h-4',
                    selectedEventType === eventType ? 'text-blue-600' : 'text-gray-600'
                  ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div class="font-medium text-sm">{{ label }}</div>
                  <div class="text-xs text-gray-500">{{ getEventDescription(eventType) }}</div>
                </div>
              </div>
            </button>
          </div>
          
          <!-- Selected Event Type Indicator -->
          <div v-if="selectedEventType" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm font-medium text-green-800">
                Selected: {{ eventTypes[selectedEventType] || selectedEventType }}
              </span>
            </div>
          </div>
        </div>

        <!-- Condition Builder -->
        <div v-if="selectedEventType" class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <h5 class="text-sm font-semibold text-gray-700 mb-3">Add Conditions (Optional)</h5>
            
            <div v-for="(condition, index) in conditions" :key="index" class="flex items-center space-x-3 mb-3">
              <span v-if="index > 0" class="text-sm text-gray-500 font-medium">AND</span>
              
              <select
                v-model="condition.field"
                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Field</option>
                <option v-for="field in getAvailableFields(selectedEventType)" :key="field.value" :value="field.value">
                  {{ field.label }}
                </option>
              </select>
              
              <select
                v-model="condition.operator"
                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Operator</option>
                <option v-for="(label, operator) in operators" :key="operator" :value="operator">
                  {{ label }}
                </option>
              </select>
              
              <input
                v-model="condition.value"
                type="text"
                placeholder="Value"
                class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <button
                @click="removeCondition(index)"
                class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            <button
              @click="addCondition"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Condition
            </button>
          </div>

          <!-- Time Window -->
          <div class="bg-blue-50 rounded-lg p-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Time Window (Optional)</label>
            <select
              v-model="ruleData.timeWindow"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No time restriction</option>
              <option value="1_hour">Last 1 hour</option>
              <option value="24_hours">Last 24 hours</option>
              <option value="7_days">Last 7 days</option>
              <option value="30_days">Last 30 days</option>
              <option value="90_days">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Rule Settings -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Rule Settings
        </h4>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Priority Level *</label>
            <select
              v-model="ruleData.priority"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="">Select Priority</option>
              <option value="1">Critical (1) - Highest Priority</option>
              <option value="2">High (2) - Very Important</option>
              <option value="3">Medium (3) - Standard</option>
              <option value="4">Low (4) - Less Important</option>
              <option value="5">Minimal (5) - Lowest Priority</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Rule Status</label>
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input
                  v-model="ruleData.is_active"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">Active Rule</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Generated JSON Preview -->
      <div v-if="generatedCondition" class="bg-gray-50 rounded-lg border border-gray-200 p-6">
        <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg class="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Generated Condition
        </h4>
        
        <div class="bg-white rounded-lg p-4 border border-gray-200">
          <pre class="text-sm text-gray-700 font-mono overflow-x-auto">{{ JSON.stringify(generatedCondition, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { leadScoringService } from '@/services/leadScoring'

// Props
const props = defineProps({
  ruleData: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['update:ruleData', 'preview', 'test'])

// Reactive data
const eventTypes = ref({})
const operators = ref({})
const selectedEventType = ref('')
const conditions = ref([])
const timeWindow = ref('')

// Computed
const generatedCondition = computed(() => {
  if (!selectedEventType.value) {
    // Return a default condition if no event type is selected
    return {
      event: 'contact_created', // Default event
      criteria: [],
      time_window: null
    }
  }
  
  const condition = {
    event: selectedEventType.value
  }
  
  if (conditions.value.length > 0) {
    condition.criteria = conditions.value.filter(c => c.field && c.operator && c.value)
  }
  
  if (timeWindow.value) {
    condition.time_window = timeWindow.value
  }
  
  return condition
})

// Methods
const loadEventTypes = async () => {
  try {
    const response = await leadScoringService.getEventTypes()
    eventTypes.value = response.data || {}
  } catch (error) {
    console.error('Failed to load event types:', error)
  }
}

const loadOperators = async () => {
  try {
    const response = await leadScoringService.getOperators()
    operators.value = response.data || {}
  } catch (error) {
    console.error('Failed to load operators:', error)
  }
}

const selectEventType = (eventType) => {
  selectedEventType.value = eventType
  conditions.value = []
}

const addCondition = () => {
  conditions.value.push({
    field: '',
    operator: '',
    value: ''
  })
}

const removeCondition = (index) => {
  conditions.value.splice(index, 1)
}

const getEventDescription = (eventType) => {
  const descriptions = {
    email_open: 'When someone opens an email',
    email_click: 'When someone clicks a link in an email',
    form_submission: 'When someone submits a form',
    page_visit: 'When someone visits a page',
    file_download: 'When someone downloads a file',
    event_attendance: 'When someone attends an event',
    deal_created: 'When a deal is created',
    deal_updated: 'When a deal is updated',
    deal_closed: 'When a deal is closed'
  }
  return descriptions[eventType] || 'Custom event trigger'
}

const getAvailableFields = (eventType) => {
  const fieldMappings = {
    email_open: [
      { value: 'email_type', label: 'Email Type' },
      { value: 'campaign_id', label: 'Campaign ID' },
      { value: 'subject', label: 'Subject' }
    ],
    form_submission: [
      { value: 'form_type', label: 'Form Type' },
      { value: 'form_id', label: 'Form ID' },
      { value: 'source', label: 'Source' }
    ],
    page_visit: [
      { value: 'page_url', label: 'Page URL' },
      { value: 'page_title', label: 'Page Title' },
      { value: 'referrer', label: 'Referrer' }
    ]
  }
  return fieldMappings[eventType] || []
}

const previewRule = () => {
  emit('preview', {
    ...props.ruleData,
    condition: generatedCondition.value
  })
}

const testRule = () => {
  emit('test', {
    ...props.ruleData,
    condition: generatedCondition.value
  })
}

// Watch for changes
watch(generatedCondition, (newCondition) => {
  if (newCondition) {
    emit('update:ruleData', {
      ...props.ruleData,
      condition: newCondition
    })
  }
}, { immediate: true })

// Watch for changes in ruleData
watch(() => props.ruleData, (newRuleData) => {
  if (newRuleData.condition && typeof newRuleData.condition === 'object') {
    // If we have a condition object, extract the event type
    if (newRuleData.condition.event) {
      selectedEventType.value = newRuleData.condition.event
    }
  }
}, { deep: true })

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadEventTypes(),
    loadOperators()
  ])
  
  // Set a default event type if none is selected
  if (!selectedEventType.value && Object.keys(eventTypes.value).length > 0) {
    selectedEventType.value = 'contact_created' // Default to contact created
  }
})
</script>

<style scoped>
.rule-builder {
  @apply space-y-6;
}

/* Custom scrollbar for code blocks */
pre::-webkit-scrollbar {
  height: 6px;
}

pre::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded;
}

pre::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded;
}

pre::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}
</style>
