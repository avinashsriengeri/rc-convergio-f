<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <!-- Draft Form Error -->
        <div v-if="error.includes('draft mode')" class="bg-white rounded-lg shadow-sm border border-yellow-200 p-8 max-w-md mx-auto">
          <div class="text-4xl mb-4">🚧</div>
          <h3 class="text-lg font-medium text-yellow-800 mb-2">Form in Draft Mode</h3>
          <p class="text-sm text-yellow-700">This form is in draft mode and cannot be accessed publicly.</p>
        </div>
        
        <!-- Inactive Form Error -->
        <div v-else-if="error.includes('inactive')" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
          <div class="text-4xl mb-4">⛔</div>
          <h3 class="text-lg font-medium text-gray-800 mb-2">Form Inactive</h3>
          <p class="text-sm text-gray-700">This form is currently inactive and not available for submissions.</p>
        </div>
        
        <!-- Form Not Found Error -->
        <div v-else-if="error.includes('not found') || error.includes('Form not found')" class="bg-white rounded-lg shadow-sm border border-red-200 p-8 max-w-md mx-auto">
          <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 class="text-lg font-medium text-red-800 mb-2">Form Not Found</h3>
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
        
        <!-- Generic Error -->
        <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-800 mb-2">Error</h3>
          <p class="text-sm text-gray-700">{{ error }}</p>
        </div>
      </div>

      <!-- Success State -->
      <div v-else-if="submitted" class="text-center py-12">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <svg class="mx-auto h-12 w-12 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Thank you!</h3>
          <p class="text-sm text-gray-600">
            Your submission has been received successfully. We'll get back to you soon.
          </p>
        </div>
      </div>

      <!-- Form -->
      <div v-else-if="form" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ form.name }}</h1>
          <p class="text-sm text-gray-600">Please fill out all required fields.</p>
        </div>

        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Render Form Fields -->
          <div v-for="field in form.fields" :key="field.name" class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              {{ field.label }}
              <span v-if="field.required" class="text-red-500">*</span>
            </label>
            
            <!-- Text Input -->
            <input
              v-if="field.type === 'text' || field.type === 'email' || field.type === 'phone'"
              v-model="formData[field.name]"
              :type="field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'"
              :required="field.required"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': fieldErrors[field.name] }"
              :placeholder="`Enter ${field.label.toLowerCase()}`"
            />
            
            <!-- Textarea -->
            <textarea
              v-else-if="field.type === 'textarea'"
              v-model="formData[field.name]"
              :required="field.required"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': fieldErrors[field.name] }"
              :placeholder="`Enter ${field.label.toLowerCase()}`"
            ></textarea>
            
            <!-- Select -->
            <select
              v-else-if="field.type === 'select'"
              v-model="formData[field.name]"
              :required="field.required"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': fieldErrors[field.name] }"
            >
              <option value="">Select {{ field.label.toLowerCase() }}</option>
              <option v-for="option in field.options" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
            
            <!-- Radio -->
            <div v-else-if="field.type === 'radio'" class="space-y-2">
              <div v-for="option in field.options" :key="option" class="flex items-center">
                <input
                  :id="`${field.name}-${option}`"
                  v-model="formData[field.name]"
                  type="radio"
                  :name="field.name"
                  :value="option"
                  :required="field.required"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label :for="`${field.name}-${option}`" class="ml-2 block text-sm text-gray-900">
                  {{ option }}
                </label>
              </div>
            </div>
            
            <!-- Checkbox -->
            <div v-else-if="field.type === 'checkbox'" class="flex items-center">
              <input
                :id="field.name"
                v-model="formData[field.name]"
                type="checkbox"
                :required="field.required"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label :for="field.name" class="ml-2 block text-sm text-gray-900">
                {{ field.label }}
              </label>
            </div>
            
            <!-- Field Error -->
            <p v-if="fieldErrors[field.name]" class="mt-1 text-sm text-red-600">
              {{ fieldErrors[field.name] }}
            </p>
          </div>
         
          <!-- Consent Checkbox -->
          <div v-if="form.consent_required" class="space-y-2">
            <div class="flex items-start">
              <input
                id="consent"
                v-model="consentGiven"
                type="checkbox"
                required
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                :class="{ 'border-red-300 focus:ring-red-500': fieldErrors.consent }"
              />
              <label for="consent" class="ml-2 block text-sm text-gray-900">
                I agree to the 
                <a href="#" class="text-blue-600 hover:text-blue-500 underline">terms and conditions</a>
                and 
                <a href="#" class="text-blue-600 hover:text-blue-500 underline">privacy policy</a>
                <span class="text-red-500">*</span>
              </label>
            </div>
            <p v-if="fieldErrors.consent" class="text-sm text-red-600">
              {{ fieldErrors.consent }}
            </p>
          </div>
          
          <!-- Submit Button -->
          <div class="pt-6">
            <BaseButton
              type="submit"
              variant="primary"
              :loading="submitting"
              :disabled="submitting"
              full-width
              class="text-base py-3"
            >
              {{ submitting ? 'Submitting...' : 'Submit' }}
            </BaseButton>
          </div>
        </form>

        <!-- Powered By -->
        <div class="mt-8 pt-6 border-t border-gray-200 text-center">
          <p class="text-xs text-gray-500">
            Powered by <span class="font-medium">RC ConverJio</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { formsAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'

interface FormField {
  id: string
  name?: string
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio'
  label: string
  required: boolean
  options?: string[]
}

interface Form {
  id: number
  name: string
  status: 'active' | 'inactive' | 'draft'
  fields: FormField[]
  consent_required: boolean
}

const route = useRoute()
const { success, error: showError } = useNotifications()

// Reactive data
const form = ref<Form | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const submitted = ref(false)
const submitting = ref(false)
const formData = reactive<Record<string, any>>({})
const fieldErrors = reactive<Record<string, string>>({})
const consentGiven = ref(false) // Add missing consent variable

// UTM and tracking data
const utmData = reactive({
  utm_source: '',
  utm_medium: '',
  utm_campaign: '',
  utm_term: '',
  utm_content: '',
  referrer_url: '',
  page_url: ''
})

// Methods
const loadForm = async () => {
  try {
    const formId = route.params.id
    const response = await formsAPI.getPublicForm(formId as string)
    const formResponseData = response.data.data || response.data
    
    if (!formResponseData) {
      error.value = 'Form not found'
      return
    }
    
    // Check form status - Block draft forms
    if (formResponseData.status === 'draft') {
      error.value = 'This form is not available. It is currently in draft mode.'
      return
    }
    
    if (formResponseData.status === 'inactive') {
      error.value = 'This form is currently inactive and not available for submissions.'
      return
    }
    
    if (formResponseData.status && formResponseData.status !== 'active') {
      error.value = 'This form is not available for public access.'
      return
    }
    
    form.value = formResponseData
    
    // Initialize form data
    Object.keys(formData).forEach(key => delete formData[key])
    Object.keys(fieldErrors).forEach(key => delete fieldErrors[key])
    
    if (form.value.fields) {
      form.value.fields.forEach(field => {
        // Only initialize if field has a name
        if (field.name) {
          formData[field.name] = field.type === 'checkbox' ? false : ''
          fieldErrors[field.name] = ''
        }
      })
    }
  } catch (err: any) {
    if (err.response?.status === 404) {
      error.value = 'Form not found'
    } else if (err.response?.status === 401) {
      error.value = 'Form not available'
    } else {
      error.value = err.response?.data?.message || 'Failed to load form'
    }
  } finally {
    loading.value = false
  }
}

const validateForm = () => {
  // Clear previous errors
  Object.keys(fieldErrors).forEach(key => {
    delete fieldErrors[key]
  })
  
  let isValid = true
  
  if (!form.value) return false
  
  // Validate required fields
  form.value.fields.forEach(field => {
    // Only validate fields that have names
    if (field.name) {
      if (field.required) {
        const value = formData[field.name]
        
        if (field.type === 'checkbox') {
          if (!value) {
            fieldErrors[field.name] = `${field.label} is required`
            isValid = false
          }
        } else if (!value || (typeof value === 'string' && !value.trim())) {
          fieldErrors[field.name] = `${field.label} is required`
          isValid = false
        }
      }
      
      // Validate email format
      if (field.type === 'email' && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData[field.name])) {
          fieldErrors[field.name] = 'Please enter a valid email address'
          isValid = false
        }
      }
    }
  })
  
  // Validate consent
  if (form.value.consent_required && !consentGiven.value) {
    fieldErrors.consent = 'You must agree to the terms and conditions'
    isValid = false
  }
  
  return isValid
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }
  
  submitting.value = true
  
  try {
    // Create proper submission payload with correct field names
    const submissionData = {
      form_id: form.value.id,
      payload: {},
      consent_given: consentGiven.value
    }

    // Ensure payload keys match backend field names - use field.name only
    form.value.fields.forEach(field => {
      // Always use field.name for the payload key
      if (field.name) {
        const fieldValue = formData[field.name] || ''
        submissionData.payload[field.name] = fieldValue
      }
    })
    
    console.log('Submitting form with payload:', submissionData)
    
    await formsAPI.submitPublicForm(form.value.id, submissionData)
    
    success('Form submitted successfully!')
    submitted.value = true
    
    // Reset form
    Object.keys(formData).forEach(key => {
      formData[key] = typeof formData[key] === 'boolean' ? false : ''
    })
    consentGiven.value = false
    Object.keys(fieldErrors).forEach(key => delete fieldErrors[key])
    
  } catch (err: any) {
    console.error('Form submission error:', err)
    
    if (err.response?.status === 422) {
      // Validation errors - map backend field names to frontend field names
      const validationErrors = err.response.data.errors || {}
      Object.keys(validationErrors).forEach(fieldName => {
        // Find the field by name to get the correct key for error display
        const field = form.value?.fields.find(f => f.name === fieldName)
        if (field && field.name) {
          fieldErrors[field.name] = validationErrors[fieldName][0]
        }
      })
      
      // Also handle payload validation errors
      if (validationErrors.payload) {
        Object.keys(validationErrors.payload).forEach(fieldName => {
          const field = form.value?.fields.find(f => f.name === fieldName)
          if (field && field.name) {
            fieldErrors[field.name] = validationErrors.payload[fieldName][0]
          }
        })
      }
    } else {
      showError(err.response?.data?.message || 'Failed to submit form')
    }
  } finally {
    submitting.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadForm()
})
</script>
