<template>
  <div class="sequence-step-form">
    <!-- Template Selection -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Email Template *</label>
      <select
        v-model="selectedTemplateId"
        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
        :class="{ 'border-red-300': errors.email_template_id }"
        :disabled="isLoadingTemplates"
        @change="handleTemplateSelect"
      >
        <option value="">
          {{ isLoadingTemplates ? 'Loading templates...' : 'Select email template' }}
        </option>
        <option v-for="template in templates" :key="template.id" :value="template.id">
          {{ template.name }} 
          <span v-if="template.is_prebuilt">🚀</span>
        </option>
      </select>
      <p v-if="errors.email_template_id" class="mt-1 text-sm text-red-600">{{ errors.email_template_id }}</p>
    </div>

    <!-- Template Preview Section -->
    <div v-if="previewData" class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <!-- Preview Header -->
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Template Preview</h3>
        <div class="flex items-center space-x-2">
          <span v-if="previewData.is_prebuilt" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
            rows="8"
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
            {{ previewData.subject }}
          </div>
        </div>

        <!-- Content Preview -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Content Preview</label>
          <div class="border border-gray-200 rounded-md p-4 bg-white min-h-[200px]">
            <div v-html="previewData.content" class="prose prose-sm max-w-none"></div>
          </div>
        </div>

        <!-- Available Variables -->
        <div v-if="previewData.available_variables && Object.keys(previewData.available_variables).length > 0" class="border-t pt-4">
          <h4 class="text-sm font-medium text-gray-900 mb-2">Available Variables</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div v-for="(description, variable) in previewData.available_variables" :key="variable" class="flex items-start space-x-2">
              <code class="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-gray-100 text-gray-800">{{ variable }}</code>
              <span class="text-xs text-gray-600">{{ description }}</span>
            </div>
          </div>
          <p class="mt-2 text-xs text-gray-500">Use these variables in your template content (e.g., {{ variableExample }})</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoadingPreview" class="bg-white border border-gray-200 rounded-lg p-8 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-sm text-gray-600">Loading template preview...</p>
    </div>

    <!-- Empty State -->
    <div v-if="!previewData && !isLoadingPreview && selectedTemplateId" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div class="flex">
        <svg class="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-yellow-800">Preview Unavailable</h3>
          <p class="mt-1 text-sm text-yellow-700">Unable to load template preview. Please try again.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { campaignsAPI } from '@/services/api'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'template-selected'])

// Stores
const authStore = useAuthStore()

// Reactive data
const templates = ref([])
const selectedTemplateId = ref(props.modelValue)
const previewData = ref(null)
const editMode = ref(false)
const isLoadingTemplates = ref(false)
const isLoadingPreview = ref(false)
const isSaving = ref(false)

const editForm = ref({
  subject: '',
  content: ''
})

// Computed
const variableExample = computed(() => '{{contact_name}}')

// Methods
const loadTemplates = async () => {
  if (templates.value.length > 0) return // Already loaded
  
  isLoadingTemplates.value = true
  try {
    const response = await campaignsAPI.getTemplates()
    templates.value = response.data.data || response.data || []
  } catch (error) {
    console.error('Error loading templates:', error)
    templates.value = []
  } finally {
    isLoadingTemplates.value = false
  }
}

const loadTemplatePreview = async (templateId) => {
  if (!templateId) {
    previewData.value = null
    return
  }

  isLoadingPreview.value = true
  try {
    const response = await fetch('/api/templates/preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`,
        'X-Tenant-ID': authStore.tenantId
      },
      body: JSON.stringify({
        template_id: templateId,
        target_type: 'deal',
        target_id: null
      })
    })

    if (!response.ok) {
      throw new Error('Failed to load template preview')
    }

    const data = await response.json()
    previewData.value = data.data || data
    
    // Initialize edit form with current values
    editForm.value = {
      subject: previewData.value.subject || '',
      content: previewData.value.content || ''
    }
  } catch (error) {
    console.error('Error loading template preview:', error)
    previewData.value = null
  } finally {
    isLoadingPreview.value = false
  }
}

const handleTemplateSelect = async () => {
  emit('update:modelValue', selectedTemplateId.value)
  emit('template-selected', selectedTemplateId.value)
  
  if (selectedTemplateId.value) {
    await loadTemplatePreview(selectedTemplateId.value)
  } else {
    previewData.value = null
  }
}

const toggleEditMode = () => {
  editMode.value = !editMode.value
  if (editMode.value && previewData.value) {
    editForm.value = {
      subject: previewData.value.subject || '',
      content: previewData.value.content || ''
    }
  }
}

const cancelEdit = () => {
  editMode.value = false
  if (previewData.value) {
    editForm.value = {
      subject: previewData.value.subject || '',
      content: previewData.value.content || ''
    }
  }
}

const saveTemplate = async () => {
  if (!selectedTemplateId.value) return

  isSaving.value = true
  try {
    const response = await fetch('/api/templates/update-content', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`,
        'X-Tenant-ID': authStore.tenantId
      },
      body: JSON.stringify({
        template_id: selectedTemplateId.value,
        subject: editForm.value.subject,
        content: editForm.value.content,
        is_custom: true
      })
    })

    if (!response.ok) {
      throw new Error('Failed to save template')
    }

    // Reload preview after saving
    await loadTemplatePreview(selectedTemplateId.value)
    editMode.value = false
  } catch (error) {
    console.error('Error saving template:', error)
    // You could add a toast notification here
  } finally {
    isSaving.value = false
  }
}

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
  selectedTemplateId.value = newValue
  if (newValue) {
    loadTemplatePreview(newValue)
  }
}, { immediate: true })

// Lifecycle
onMounted(async () => {
  await loadTemplates()
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