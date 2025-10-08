<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click.self="$emit('close')">
    <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
      <!-- Modal Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">
          {{ step ? 'Edit Step' : 'Add Step' }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Modal Content -->
      <form @submit.prevent="saveStep" class="space-y-6">
        <!-- Action Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Action Type *</label>
          <select
            v-model="form.action_type"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            :class="{ 'border-red-300': errors.action_type }"
            @change="onActionTypeChange"
          >
            <option value="">Select action type</option>
            <option value="email">Email</option>
            <option value="task">Task</option>
            <option value="wait">Wait</option>
          </select>
          <p v-if="errors.action_type" class="mt-1 text-sm text-red-600">{{ errors.action_type }}</p>
        </div>

        <!-- Delay Configuration -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Delay Duration *</label>
          <div class="grid grid-cols-3 gap-3">
            <!-- Days -->
            <div>
              <label class="block text-xs text-gray-500 mb-1">Days</label>
              <input
                v-model.number="delayInput.days"
                type="number"
                min="0"
                placeholder="0"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                @input="updateDelayHours"
              />
            </div>
            
            <!-- Hours -->
            <div>
              <label class="block text-xs text-gray-500 mb-1">Hours</label>
              <input
                v-model.number="delayInput.hours"
                type="number"
                min="0"
                max="23"
                placeholder="0"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                @input="updateDelayHours"
              />
            </div>
            
            <!-- Minutes -->
            <div>
              <label class="block text-xs text-gray-500 mb-1">Minutes</label>
              <input
                v-model.number="delayInput.minutes"
                type="number"
                min="0"
                max="59"
                placeholder="0"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                @input="updateDelayHours"
              />
            </div>
          </div>
          
          <!-- Display total hours -->
          <div class="mt-2 text-xs text-gray-500">
            Total: {{ formatTotalDelay() }}
            <span v-if="delayInput.minutes > 0" class="text-amber-600 ml-1">
              (Minutes will be rounded to nearest hour)
            </span>
          </div>
          
          <p v-if="errors.delay_hours" class="mt-1 text-sm text-red-600">{{ errors.delay_hours }}</p>
        </div>

        <!-- Template Preview Component (for email type) -->
        <div v-if="form.action_type === 'email'">
          <SequenceStepFormWithTemplatePreview
            v-model="form.email_template_id"
            :errors="errors"
            @template-selected="onTemplateSelected"
          />
        </div>

        <!-- Task Title (for task type) -->
        <div v-if="form.action_type === 'task'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
          <input
            v-model="form.task_title"
            type="text"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            :class="{ 'border-red-300': errors.task_title }"
            placeholder="Enter task title"
          />
          <p v-if="errors.task_title" class="mt-1 text-sm text-red-600">{{ errors.task_title }}</p>
        </div>

        <!-- Task Description (for task type) -->
        <div v-if="form.action_type === 'task'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Task Description</label>
          <textarea
            v-model="form.task_description"
            rows="3"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Enter task description"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            @click="$emit('close')"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Saving...' : (step ? 'Update Step' : 'Add Step') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import SequenceStepFormWithTemplatePreview from './SequenceStepFormWithTemplatePreview.vue'

const props = defineProps({
  step: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['save', 'close'])

// Reactive data
const form = ref({
  action_type: '',
  delay_hours: 0,
  email_template_id: '',
  task_title: '',
  task_description: ''
})

const delayInput = ref({
  days: 0,
  hours: 0,
  minutes: 0
})

const errors = ref({})
const loading = ref(false)

// Methods
const updateDelayHours = () => {
  const totalHours = (delayInput.value.days * 24) + delayInput.value.hours + (delayInput.value.minutes / 60)
  form.value.delay_hours = Math.round(totalHours)
  
  if (form.value.delay_hours === 0 && (delayInput.value.minutes > 0 || delayInput.value.hours > 0 || delayInput.value.days > 0)) {
    form.value.delay_hours = 1
  }
}

const formatTotalDelay = () => {
  const totalHours = form.value.delay_hours
  if (totalHours === 0) return '0 hours'
  
  const days = Math.floor(totalHours / 24)
  const hours = Math.floor(totalHours % 24)
  const minutes = Math.round((totalHours % 1) * 60)
  
  let result = []
  if (days > 0) result.push(`${days} day${days > 1 ? 's' : ''}`)
  if (hours > 0) result.push(`${hours} hour${hours > 1 ? 's' : ''}`)
  if (minutes > 0) result.push(`${minutes} minute${minutes > 1 ? 's' : ''}`)
  
  return result.join(', ') || '0 hours'
}

const parseDelayFromHours = (hours) => {
  const totalHours = Math.floor(hours)
  const days = Math.floor(totalHours / 24)
  const remainingHours = totalHours % 24
  
  return {
    days: days,
    hours: remainingHours,
    minutes: 0
  }
}

const onActionTypeChange = () => {
  form.value.email_template_id = ''
  form.value.task_title = ''
  form.value.task_description = ''
  errors.value = {}
}

const onTemplateSelected = (templateId) => {
  form.value.email_template_id = templateId
}

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.action_type) {
    errors.value.action_type = 'Action type is required'
  }
  
  const hasDelay = delayInput.value.days > 0 || delayInput.value.hours > 0 || delayInput.value.minutes > 0
  if (!hasDelay) {
    errors.value.delay_hours = 'Please specify a delay duration'
  }
  
  if (form.value.action_type === 'email' && !form.value.email_template_id) {
    errors.value.email_template_id = 'Email template is required'
  }
  
  if (form.value.action_type === 'task' && !form.value.task_title.trim()) {
    errors.value.task_title = 'Task title is required'
  }
  
  return Object.keys(errors.value).length === 0
}

const saveStep = async () => {
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  
  try {
    const stepData = {
      action_type: form.value.action_type,
      delay_hours: form.value.delay_hours,
      email_template_id: form.value.email_template_id || null,
      task_title: form.value.task_title || null,
      task_description: form.value.task_description || null
    }
    
    emit('save', stepData)
  } catch (error) {
    console.error('Error saving step:', error)
  } finally {
    loading.value = false
  }
}

// Watch for step prop changes
watch(() => props.step, (newStep) => {
  if (newStep) {
    form.value = {
      action_type: newStep.action_type || '',
      delay_hours: newStep.delay_hours || 0,
      email_template_id: newStep.email_template_id || '',
      task_title: newStep.task_title || '',
      task_description: newStep.task_description || ''
    }
    
    const parsedDelay = parseDelayFromHours(newStep.delay_hours || 0)
    delayInput.value = parsedDelay
  } else {
    form.value = {
      action_type: '',
      delay_hours: 0,
      email_template_id: '',
      task_title: '',
      task_description: ''
    }
    
    delayInput.value = {
      days: 0,
      hours: 0,
      minutes: 0
    }
  }
}, { immediate: true })
</script>
