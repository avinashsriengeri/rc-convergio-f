<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEdit ? 'Edit Step' : 'Add Step' }}
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

        <!-- Form -->
        <form @submit.prevent="saveStep" class="space-y-4">
          <!-- Action Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Action Type *</label>
            <select
              v-model="form.action_type"
              @change="onActionTypeChange"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              :class="{ 'border-red-300': errors.action_type }"
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

          <!-- Email Template (for email type) -->
          <div v-if="form.action_type === 'email'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Email Template *</label>
            <select
              v-model="form.email_template_id"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              :class="{ 'border-red-300': errors.email_template_id }"
              :disabled="isLoadingTemplates"
              @change="onTemplateChange"
            >
              <option value="">
                {{ isLoadingTemplates ? 'Loading templates...' : 'Select email template' }}
              </option>
              <option v-for="template in emailTemplates" :key="template.id" :value="template.id">
                {{ template.name }}
              </option>
            </select>
            <p v-if="errors.email_template_id" class="mt-1 text-sm text-red-600">{{ errors.email_template_id }}</p>
            
            <!-- Template Preview Section (appears when template is selected) -->
            <div v-if="form.email_template_id && templatePreview" class="mt-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <!-- Preview Header -->
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Template Preview</h3>
                <div class="flex items-center space-x-2">
                  <span v-if="templatePreview.is_prebuilt" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    🚀 Prebuilt
                  </span>
                  <button
                    @click="toggleEditMode"
                    class="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    {{ editMode ? 'Cancel Edit' : 'Edit Template' }}
                  </button>
                </div>
              </div>

              <!-- Edit Mode -->
              <div v-if="editMode" class="space-y-4">
                <!-- Subject Field -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
                  <input
                    v-model="editForm.subject"
                    type="text"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter email subject"
                  />
                </div>

                <!-- Content Field -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email Content</label>
                  <textarea
                    v-model="editForm.content"
                    rows="6"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Enter email content (HTML supported)"
                  ></textarea>
                  <p class="mt-1 text-xs text-gray-500">HTML tags are supported for rich formatting</p>
                </div>

                <!-- Save Actions -->
                <div class="flex items-center justify-end space-x-3 pt-4 border-t">
                  <button
                    @click="cancelEdit"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    @click="saveTemplate"
                    :disabled="isSaving"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isSaving ? 'Saving...' : 'Save Template' }}
                  </button>
                </div>
              </div>

              <!-- Preview Mode -->
              <div v-else>
                <!-- Subject Preview -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium text-gray-900">
                    {{ templatePreview.subject }}
                  </div>
                </div>

                <!-- Content Preview -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Content Preview</label>
                  <div class="border border-gray-200 rounded-md p-4 bg-white min-h-[150px]">
                    <div v-html="templatePreview.content" class="prose prose-sm max-w-none"></div>
                  </div>
                </div>

                <!-- Available Variables -->
                <div v-if="templatePreview.available_variables && Object.keys(templatePreview.available_variables).length > 0" class="border-t pt-4">
                  <h4 class="text-sm font-medium text-gray-900 mb-2">Available Variables</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div v-for="(description, variable) in templatePreview.available_variables" :key="variable" class="flex items-start space-x-2">
                      <code class="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-gray-100 text-gray-800">{{ variable }}</code>
                      <span class="text-xs text-gray-600">{{ description }}</span>
                    </div>
                  </div>
                  <p class="mt-2 text-xs text-gray-500">Use these variables in your template content (e.g., {{ variableExample }})</p>
                </div>
              </div>
            </div>

            <!-- Loading State for Preview -->
            <div v-if="isLoadingPreview" class="mt-4 bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p class="text-sm text-gray-600">Loading template preview...</p>
            </div>
          </div>

          <!-- Task Title (for task type) -->
          <div v-if="form.action_type === 'task'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
            <input
              v-model="form.task_title"
              type="text"
              placeholder="Enter task title"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              :class="{ 'border-red-300': errors.task_title }"
            />
            <p v-if="errors.task_title" class="mt-1 text-sm text-red-600">{{ errors.task_title }}</p>
          </div>

          <!-- Task Description (for task type) -->
          <div v-if="form.action_type === 'task'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Task Description</label>
            <textarea
              v-model="form.task_description"
              rows="3"
              placeholder="Enter task description"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            ></textarea>
          </div>

          <!-- Wait Duration (for wait type) -->
          <div v-if="form.action_type === 'wait'">
            <div class="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-blue-700">
                    This step will wait for {{ form.delay_hours || 0 }} hours before proceeding to the next step.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-3 pt-4">
            <BaseButton
              type="button"
              variant="outline"
              @click="$emit('close')"
            >
              Cancel
            </BaseButton>
            <BaseButton
              type="submit"
              variant="primary"
              :loading="loading"
            >
              {{ isEdit ? 'Update Step' : 'Add Step' }}
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { campaignsAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  step: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'close'])

// Reactive data
const form = ref({
  action_type: '',
  delay_hours: 0,
  email_template_id: '',
  task_title: '',
  task_description: '',
  email_template: null
})

const delayInput = ref({
  days: 0,
  hours: 0,
  minutes: 0
})

const errors = ref({})
const loading = ref(false)
const emailTemplates = ref([])

// Preview-related data
const templatePreview = ref(null)
const editMode = ref(false)
const isLoadingPreview = ref(false)
const isSaving = ref(false)

const editForm = ref({
  subject: '',
  content: ''
})

// Computed
const isLoadingTemplates = ref(false)
const variableExample = computed(() => '{{contact_name}}')

// Methods
const updateDelayHours = () => {
  // Convert days, hours, and minutes to total hours
  const totalHours = (delayInput.value.days * 24) + delayInput.value.hours + (delayInput.value.minutes / 60)
  
  // Backend expects integer hours, so we need to round to the nearest hour
  // This ensures we always send an integer value
  form.value.delay_hours = Math.round(totalHours)
  
  // If the result is 0 but user specified minutes, set to 1 hour minimum
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
  // Since backend stores integer hours, we need to parse them back
  const totalHours = Math.floor(hours) // Ensure we're working with integer hours
  const days = Math.floor(totalHours / 24)
  const remainingHours = totalHours % 24
  
  return {
    days: days,
    hours: remainingHours,
    minutes: 0 // Backend doesn't store minutes, so we set to 0
  }
}

const loadEmailTemplates = async () => {
  if (emailTemplates.value.length > 0) return // Already loaded
  
  isLoadingTemplates.value = true
  try {
    const response = await campaignsAPI.getTemplates()
    emailTemplates.value = response.data.data || response.data || []
  } catch (error) {
    console.error('Error loading email templates:', error)
    emailTemplates.value = []
  } finally {
    isLoadingTemplates.value = false
  }
}

const onActionTypeChange = () => {
  // Reset form fields when action type changes
  form.value.email_template_id = ''
  form.value.task_title = ''
  form.value.task_description = ''
  form.value.email_template = null
  templatePreview.value = null
  editMode.value = false
  errors.value = {}
}

const onTemplateChange = async () => {
  if (form.value.email_template_id) {
    await loadTemplatePreview(form.value.email_template_id)
  } else {
    templatePreview.value = null
    editMode.value = false
  }
}

const loadTemplatePreview = async (templateId) => {
  if (!templateId) {
    templatePreview.value = null
    return
  }

  isLoadingPreview.value = true
  try {
    const response = await campaignsAPI.previewTemplate({
      template_id: templateId,
      target_type: 'deal',
      target_id: null
    })

    templatePreview.value = response.data.data || response.data
    
    // Initialize edit form with current values
    editForm.value = {
      subject: templatePreview.value.subject || '',
      content: templatePreview.value.content || ''
    }
  } catch (error) {
    console.error('Error loading template preview:', error)
    templatePreview.value = null
  } finally {
    isLoadingPreview.value = false
  }
}

const toggleEditMode = () => {
  editMode.value = !editMode.value
  if (editMode.value && templatePreview.value) {
    editForm.value = {
      subject: templatePreview.value.subject || '',
      content: templatePreview.value.content || ''
    }
  }
}

const cancelEdit = () => {
  editMode.value = false
  if (templatePreview.value) {
    editForm.value = {
      subject: templatePreview.value.subject || '',
      content: templatePreview.value.content || ''
    }
  }
}

const saveTemplate = async () => {
  if (!form.value.email_template_id) return

  isSaving.value = true
  try {
    await campaignsAPI.updateTemplateContent({
      template_id: form.value.email_template_id,
      subject: editForm.value.subject,
      content: editForm.value.content,
      is_custom: true
    })

    // Reload preview after saving
    await loadTemplatePreview(form.value.email_template_id)
    editMode.value = false
  } catch (error) {
    console.error('Error saving template:', error)
  } finally {
    isSaving.value = false
  }
}

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.action_type) {
    errors.value.action_type = 'Action type is required'
  }
  
  // Check if any delay is specified
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
    // Find email template if selected
    if (form.value.action_type === 'email' && form.value.email_template_id) {
      const template = emailTemplates.value.find(t => t.id == form.value.email_template_id)
      form.value.email_template = template
    }
    
    emit('save', { ...form.value })
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
      task_description: newStep.task_description || '',
      email_template: newStep.email_template || null
    }
    
    // Parse existing delay_hours into days, hours, minutes
    const parsedDelay = parseDelayFromHours(newStep.delay_hours || 0)
    delayInput.value = parsedDelay
  } else {
    form.value = {
      action_type: '',
      delay_hours: 0,
      email_template_id: '',
      task_title: '',
      task_description: '',
      email_template: null
    }
    
    delayInput.value = {
      days: 0,
      hours: 0,
      minutes: 0
    }
  }
}, { immediate: true })

// Lifecycle
onMounted(async () => {
  await loadEmailTemplates()
})
</script>

<style scoped>
.prose {
  color: inherit;
}

.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  color: inherit;
  font-weight: 600;
}

.prose p {
  margin-bottom: 1rem;
}

.prose a {
  color: #3b82f6;
  text-decoration: underline;
}

.prose ul, .prose ol {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.prose li {
  margin-bottom: 0.25rem;
}
</style>
