<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ isEditing ? 'Edit Form' : 'Create Form' }}
            </h1>
            <p class="text-sm text-gray-600 mt-1">
              {{ isEditing ? 'Update your lead capture form' : 'Build a new lead capture form' }}
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="outline"
              @click="previewForm"
              class="flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </BaseButton>
            <BaseButton
              variant="secondary"
              @click="goBack"
            >
              Cancel
            </BaseButton>
            <BaseButton
              variant="primary"
              @click="saveForm"
              :loading="saving"
              :disabled="!isFormValid"
            >
              {{ isEditing ? 'Update Form' : 'Create Form' }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Form Builder -->
        <div class="space-y-6">
          <!-- Basic Settings -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Form Settings</h3>
            <div class="space-y-4">
              <!-- Form Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Form Name <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <BaseInput
                    v-model="form.name"
                    placeholder="Enter form name"
                    :error="errors.name || duplicateNameError"
                    @input="onFormNameChange"
                  />
                  <!-- Checking indicator -->
                  <div
                    v-if="checkingDuplicate"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <svg class="animate-spin h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <!-- Success indicator -->
                  <div
                    v-if="!checkingDuplicate && form.name.trim() && !duplicateNameError && !errors.name"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <svg class="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                <p v-if="duplicateNameError" class="mt-1 text-sm text-red-600 flex items-center">
                  <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  {{ duplicateNameError }}
                </p>
              </div>

              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  v-model="form.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <!-- Consent Required -->
              <div class="flex items-center">
                <input
                  id="consent-required"
                  type="checkbox"
                  v-model="form.consent_required"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="consent-required" class="ml-2 block text-sm text-gray-900">
                  Require consent checkbox
                </label>
              </div>
            </div>
          </div>

          <!-- Form Fields -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">Form Fields</h3>
              <BaseButton
                variant="outline"
                size="sm"
                @click="addField"
                class="flex items-center"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Field
              </BaseButton>
            </div>

            <div v-if="form.fields.length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No fields added</h3>
              <p class="mt-1 text-sm text-gray-500">Add fields to your form to start collecting information.</p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="(field, index) in form.fields"
                :key="field.id"
                class="border border-gray-200 rounded-lg p-4"
              >
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-sm font-medium text-gray-900">Field {{ index + 1 }}</h4>
                  <button
                    @click="removeField(index)"
                    class="text-red-500 hover:text-red-700 p-1"
                    title="Remove field"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Field Label -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Label <span class="text-red-500">*</span>
                    </label>
                    <BaseInput
                      v-model="field.label"
                      placeholder="e.g., First Name"
                      @input="updateFieldName(field)"
                    />
                  </div>

                  <!-- Field Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Field Name <span class="text-red-500">*</span>
                    </label>
                    <BaseInput
                      v-model="field.name"
                      placeholder="e.g., first_name"
                      :error="getFieldNameError(field)"
                    />
                    <p v-if="getFieldNameError(field)" class="mt-1 text-sm text-red-600">
                      {{ getFieldNameError(field) }}
                    </p>
                  </div>

                  <!-- Field Type -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Type <span class="text-red-500">*</span>
                    </label>
                    <select
                      v-model="field.type"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="textarea">Text Area</option>
                      <option value="select">Dropdown</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="radio">Radio Buttons</option>
                    </select>
                  </div>

                  <!-- Required -->
                  <div class="flex items-center">
                    <input
                      :id="`required-${field.id}`"
                      type="checkbox"
                      v-model="field.required"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label :for="`required-${field.id}`" class="ml-2 block text-sm text-gray-900">
                      Required field
                    </label>
                  </div>
                </div>

                <!-- Options for select/radio -->
                <div v-if="field.type === 'select' || field.type === 'radio'" class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Options</label>
                  <div class="space-y-2">
                    <div
                      v-for="(option, optionIndex) in field.options"
                      :key="optionIndex"
                      class="flex items-center space-x-2"
                    >
                      <BaseInput
                        v-model="field.options[optionIndex]"
                        placeholder="Option text"
                        class="flex-1"
                      />
                      <button
                        @click="removeOption(field, optionIndex)"
                        class="text-red-500 hover:text-red-700 p-1"
                        title="Remove option"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <BaseButton
                      variant="outline"
                      size="sm"
                      @click="addOption(field)"
                      class="flex items-center"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Option
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Preview -->
        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Form Preview</h3>
            <div class="space-y-4">
              <div v-if="form.fields.length === 0" class="text-center py-8 text-gray-500">
                <svg class="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="mt-2 text-sm">Add fields to see preview</p>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="field in form.fields"
                  :key="field.id"
                  class="space-y-2"
                >
                  <label class="block text-sm font-medium text-gray-700">
                    {{ field.label }}
                    <span v-if="field.required" class="text-red-500">*</span>
                  </label>
                  
                  <!-- Text Input -->
                  <BaseInput
                    v-if="field.type === 'text' || field.type === 'email' || field.type === 'phone'"
                    :type="field.type"
                    :placeholder="`Enter ${field.label.toLowerCase()}`"
                    disabled
                  />
                  
                  <!-- Textarea -->
                  <textarea
                    v-else-if="field.type === 'textarea'"
                    :placeholder="`Enter ${field.label.toLowerCase()}`"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    rows="3"
                    disabled
                  ></textarea>
                  
                  <!-- Select -->
                  <select
                    v-else-if="field.type === 'select'"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    disabled
                  >
                    <option value="">Select an option</option>
                    <option
                      v-for="option in field.options"
                      :key="option"
                      :value="option"
                    >
                      {{ option }}
                    </option>
                  </select>
                  
                  <!-- Checkbox -->
                  <div v-else-if="field.type === 'checkbox'" class="flex items-center">
                    <input
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100"
                      disabled
                    />
                    <label class="ml-2 block text-sm text-gray-900">{{ field.label }}</label>
                  </div>
                  
                  <!-- Radio -->
                  <div v-else-if="field.type === 'radio'" class="space-y-2">
                    <div
                      v-for="option in field.options"
                      :key="option"
                      class="flex items-center"
                    >
                      <input
                        type="radio"
                        :name="field.name"
                        :value="option"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:bg-gray-100"
                        disabled
                      />
                      <label class="ml-2 block text-sm text-gray-900">{{ option }}</label>
                    </div>
                  </div>
                </div>

                <!-- Consent Checkbox -->
                <div v-if="form.consent_required" class="flex items-center pt-4 border-t border-gray-200">
                  <input
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100"
                    disabled
                  />
                  <label class="ml-2 block text-sm text-gray-900">
                    I agree to the terms and conditions
                  </label>
                </div>

                <!-- Submit Button -->
                <div class="pt-4 border-t border-gray-200">
                  <BaseButton
                    variant="primary"
                    class="w-full"
                    disabled
                  >
                    Submit Form
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { formsAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

interface FormField {
  id: string
  name: string
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio'
  label: string
  required: boolean
  options?: string[]
}

interface Form {
  name: string
  status: 'active' | 'inactive' | 'draft'
  fields: FormField[]
  consent_required: boolean
}

const route = useRoute()
const router = useRouter()
const { success, error: showError } = useNotifications()

// Reactive data
const saving = ref(false)
const errors = ref<Record<string, string>>({})
const checkingDuplicate = ref(false)
const duplicateNameError = ref<string | null>(null)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Form data
const form = ref<Form>({
  name: '',
  status: 'draft',
  fields: [],
  consent_required: false
})

// Computed
const isEditing = computed(() => route.path.includes('/edit'))

const isFormValid = computed(() => {
  // Check if form name exists and is not empty
  if (!form.value.name || !form.value.name.trim()) {
    return false
  }
  
  // Check if there's a duplicate name error
  if (duplicateNameError.value) {
    return false
  }
  
  // Check if there's at least one field
  if (form.value.fields.length === 0) {
    return false
  }
  
  // Check if all fields have valid names and labels
  for (const field of form.value.fields) {
    if (!field.label || !field.label.trim()) {
      return false
    }
    if (!field.name || !field.name.trim()) {
      return false
    }
    // Check for duplicate names
    const duplicateCount = form.value.fields.filter(f => f.name === field.name).length
    if (duplicateCount > 1) {
      return false
    }
  }
  
  return true
})

// Methods
const generateFieldId = () => `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// Check for duplicate form name with debouncing
const checkDuplicateName = async (name: string) => {
  if (!name || !name.trim()) {
    duplicateNameError.value = null
    return
  }
  
  checkingDuplicate.value = true
  duplicateNameError.value = null
  
  try {
    const excludeId = isEditing.value ? route.params.id : null
    const response = await formsAPI.checkDuplicateName(name.trim(), excludeId)
    
    if (response.data.exists) {
      duplicateNameError.value = 'Form name already in use. Please use a different form name.'
    } else {
      duplicateNameError.value = null
    }
  } catch (err: any) {
    console.error('Failed to check duplicate name:', err)
    // Don't show error to user, just log it
    duplicateNameError.value = null
  } finally {
    checkingDuplicate.value = false
  }
}

// Handle form name change with debouncing
const onFormNameChange = () => {
  // Clear any existing timer
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  // Clear previous error
  errors.value.name = ''
  duplicateNameError.value = null
  
  // Set new timer for debouncing (wait 500ms after user stops typing)
  debounceTimer = setTimeout(() => {
    checkDuplicateName(form.value.name)
  }, 500)
}

const addField = () => {
  const newField: FormField = {
    id: generateFieldId(),
    name: '',
    type: 'text',
    label: '',
    required: false,
    options: []
  }
  form.value.fields.push(newField)
}

const removeField = (index: number) => {
  form.value.fields.splice(index, 1)
}

const addOption = (field: FormField) => {
  if (!field.options) {
    field.options = []
  }
  field.options.push('')
}

const removeOption = (field: FormField, optionIndex: number) => {
  field.options?.splice(optionIndex, 1)
}

const updateFieldName = (field: FormField) => {
  if (field.label && !field.name) {
    // Auto-generate name from label
    field.name = field.label
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
  }
}

const getFieldNameError = (field: FormField): string | null => {
  if (!field.name) {
    return 'Field name is required'
  }
  
  if (!/^[a-z][a-z0-9_]*$/.test(field.name)) {
    return 'Field name must start with a letter and contain only lowercase letters, numbers, and underscores'
  }
  
  // Check for duplicate names
  const duplicateCount = form.value.fields.filter(f => f.name === field.name).length
  if (duplicateCount > 1) {
    return 'Field name must be unique'
  }
  
  return null
}

const validateForm = (): boolean => {
  errors.value = {}
  
  if (!form.value.name.trim()) {
    errors.value.name = 'Form name is required'
    return false
  }
  
  if (form.value.fields.length === 0) {
    errors.value.fields = 'At least one field is required'
    return false
  }
  
  for (const field of form.value.fields) {
    if (getFieldNameError(field)) {
      return false
    }
  }
  
  return true
}

const saveForm = async () => {
  if (!validateForm()) {
    return
  }
  
  // Check for duplicate form name one final time before saving
  if (duplicateNameError.value) {
    showError('Form name already in use. Please use a different form name.')
    return
  }
  
  // Do a final check to be absolutely sure
  try {
    const excludeId = isEditing.value ? route.params.id : null
    const response = await formsAPI.checkDuplicateName(form.value.name, excludeId)
    
    if (response.data.exists) {
      duplicateNameError.value = 'Form name already in use. Please use a different form name.'
      showError('Form name already in use. Please use a different form name.')
      return
    }
  } catch (err: any) {
    console.error('Failed to check duplicate name:', err)
    // Continue with save if duplicate check fails
  }
  
  saving.value = true
  
  try {
    if (isEditing.value) {
      await formsAPI.updateForm(route.params.id as string, form.value)
      success('Form updated successfully')
    } else {
      await formsAPI.createForm(form.value)
      success('Form created successfully')
    }
    
    // Navigate back to forms list
    router.push('/forms')
  } catch (err: any) {
    console.error('Failed to save form:', err)
    showError(err.response?.data?.message || 'Failed to save form')
  } finally {
    saving.value = false
  }
}

const previewForm = () => {
  // Open preview in new tab (would be the public form URL)
  const previewUrl = `/public/forms/preview?data=${encodeURIComponent(JSON.stringify(form.value))}`
  window.open(previewUrl, '_blank')
}

const goBack = () => {
  router.push('/forms')
}

const loadForm = async () => {
  if (isEditing.value) {
    const formId = route.params.id
    
    try {
      const response = await formsAPI.getForm(formId as string)
      // Handle nested data structure: response.data.data
      const formData = response.data.data || response.data
      
      // Clear existing form data
      form.value.name = ''
      form.value.fields = []
      form.value.consent_required = false
      
      // Assign new form data - preserve status from API
      Object.assign(form.value, {
        name: formData.name || '',
        status: formData.status || 'draft',
        consent_required: formData.consent_required || false,
        fields: (formData.fields || []).map(field => ({
          ...field,
          id: field.id || generateFieldId(), // Ensure each field has an ID
          name: field.name || '', // Ensure name property exists
          options: field.options || [] // Ensure options array exists
        }))
      })
    } catch (err: any) {
      console.error('Failed to load form:', err)
      showError('Failed to load form')
    }
  }
}

// Lifecycle
onMounted(() => {
  if (isEditing.value) {
    loadForm()
  }
})
</script>
