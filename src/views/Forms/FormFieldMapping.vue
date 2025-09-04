<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900">Field Mapping</h3>
        <div class="flex items-center space-x-3">
          <BaseButton
            variant="secondary"
            size="sm"
            @click="resetMappings"
            :disabled="!hasChanges"
          >
            Reset
          </BaseButton>
          <BaseButton
            variant="primary"
            size="sm"
            @click="saveMappings"
            :loading="saving"
            :disabled="!hasChanges"
          >
            Save Mappings
          </BaseButton>
        </div>
      </div>
      <p class="text-sm text-gray-600 mt-2">
        Map form fields to contact and company properties. This determines how form data is processed when creating or updating CRM records.
      </p>
    </div>

    <!-- Field Mapping Form -->
    <div class="p-6 space-y-8">
      <!-- Contact Field Mappings -->
      <div class="space-y-6">
        <h4 class="text-lg font-medium text-gray-900">Contact Field Mappings</h4>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="space-y-4">
            <h5 class="font-medium text-gray-700">Basic Information</h5>
            
            <!-- First Name -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">First Name</label>
              <div class="flex space-x-2">
                <BaseSelect
                  v-model="mappings.contact.first_name"
                  :options="formFields"
                  placeholder="Select form field"
                  class="flex-1"
                />
                <BaseSelect
                  v-model="mappings.contact.first_name_type"
                  :options="mappingTypes"
                  placeholder="Type"
                  class="w-24"
                />
              </div>
            </div>

            <!-- Last Name -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Last Name</label>
              <div class="flex space-x-2">
                <BaseSelect
                  v-model="mappings.contact.last_name"
                  :options="formFields"
                  placeholder="Select form field"
                  class="flex-1"
                />
                <BaseSelect
                  v-model="mappings.contact.last_name_type"
                  :options="mappingTypes"
                  placeholder="Type"
                  class="w-24"
                />
              </div>
            </div>

            <!-- Email -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <div class="flex space-x-2">
                <BaseSelect
                  v-model="mappings.contact.email"
                  :options="formFields"
                  placeholder="Select form field"
                  class="flex-1"
                />
                <BaseSelect
                  v-model="mappings.contact.email_type"
                  :options="mappingTypes"
                  placeholder="Type"
                  class="w-24"
                />
              </div>
            </div>

            <!-- Phone -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Phone</label>
              <div class="flex space-x-2">
                <BaseSelect
                  v-model="mappings.contact.phone"
                  :options="formFields"
                  placeholder="Select form field"
                  class="flex-1"
                />
                <BaseSelect
                  v-model="mappings.contact.phone_type"
                  :options="mappingTypes"
                  placeholder="Type"
                  class="w-24"
                />
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h5 class="font-medium text-gray-700">Additional Information</h5>
            
            <!-- Job Title -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Job Title</label>
              <div class="flex space-x-2">
                <BaseSelect
                  v-model="mappings.contact.job_title"
                  :options="formFields"
                  placeholder="Select form field"
                  class="flex-1"
                />
                <BaseSelect
                  v-model="mappings.contact.job_title_type"
                  :options="mappingTypes"
                  placeholder="Type"
                  class="w-24"
                />
              </div>
            </div>

            <!-- Department -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Department</label>
              <div class="flex space-x-2">
                <BaseSelect
                  v-model="mappings.contact.department"
                  :options="formFields"
                  placeholder="Select form field"
                  class="flex-1"
                />
                <BaseSelect
                  v-model="mappings.contact.department_type"
                  :options="mappingTypes"
                  placeholder="Type"
                  class="w-24"
                />
              </div>
            </div>

            <!-- Source -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Source</label>
              <div class="flex space-x-2">
                <BaseSelect
                  v-model="mappings.contact.source"
                  :options="formFields"
                  placeholder="Select form field"
                  class="flex-1"
                />
                <BaseSelect
                  v-model="mappings.contact.source_type"
                  :options="mappingTypes"
                  placeholder="Type"
                  class="w-24"
                />
              </div>
            </div>

            <!-- Lifecycle Stage -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Lifecycle Stage</label>
              <div class="flex space-x-2">
                <BaseSelect
                  v-model="mappings.contact.lifecycle_stage"
                  :options="formFields"
                  placeholder="Select form field"
                  class="flex-1"
                />
                <BaseSelect
                  v-model="mappings.contact.lifecycle_stage_type"
                  :options="mappingTypes"
                  placeholder="Type"
                  class="w-24"
                />
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h5 class="font-medium text-gray-700">Custom Fields</h5>
            
            <!-- Custom Field 1 -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Custom Field 1</label>
              <div class="flex space-x-2">
                <BaseSelect
                  v-model="mappings.contact.custom_field_1"
                  :options="formFields"
                  placeholder="Select form field"
                  class="flex-1"
                />
                <BaseSelect
                  v-model="mappings.contact.custom_field_1_type"
                  :options="mappingTypes"
                  placeholder="Type"
                  class="w-24"
                />
              </div>
            </div>

            <!-- Custom Field 2 -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Custom Field 2</label>
              <div class="flex space-x-2">
                <BaseSelect
                  v-model="mappings.contact.custom_field_2"
                  :options="formFields"
                  placeholder="Select form field"
                  class="flex-1"
                />
                <BaseSelect
                  v-model="mappings.contact.custom_field_2_type"
                  :options="mappingTypes"
                  placeholder="Type"
                  class="w-24"
                />
              </div>
            </div>

            <!-- Tags -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Tags</label>
              <div class="flex space-x-2">
                <BaseSelect
                  v-model="mappings.contact.tags"
                  :options="formFields"
                  placeholder="Select form field"
                  class="flex-1"
                />
                <BaseSelect
                  v-model="mappings.contact.tags_type"
                  :options="mappingTypes"
                  placeholder="Type"
                  class="w-24"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Company Field Mappings -->
      <div class="space-y-6">
        <h4 class="text-lg font-medium text-gray-900">Company Field Mappings</h4>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="space-y-4">
            <h5 class="font-medium text-gray-700">Basic Information</h5>
            
            <!-- Company Name -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Company Name</label>
              <div class="flex space-x-2">
                <BaseSelect
                  v-model="mappings.company.name"
                  :options="formFields"
                  placeholder="Select form field"
                  class="flex-1"
                />
                <BaseSelect
                  v-model="mappings.company.name_type"
                  :options="mappingTypes"
                  placeholder="Type"
                  class="w-24"
                />
              </div>
            </div>

            <!-- Domain -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Domain</label>
              <div class="flex space-x-2">
                <BaseSelect
                  v-model="mappings.company.domain"
                  :options="formFields"
                  placeholder="Select form field"
                  class="flex-1"
                />
                <BaseSelect
                  v-model="mappings.company.domain_type"
                  :options="mappingTypes"
                  placeholder="Type"
                  class="w-24"
                />
              </div>
            </div>

            <!-- Industry -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Industry</label>
              <div class="flex space-x-2">
                <BaseSelect
                  v-model="mappings.company.industry"
                  :options="formFields"
                  placeholder="Select form field"
                  class="flex-1"
                />
                <BaseSelect
                  v-model="mappings.company.industry_type"
                  :options="mappingTypes"
                  placeholder="Type"
                  class="w-24"
                />
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h5 class="font-medium text-gray-700">Additional Information</h5>
            
            <!-- Company Size -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Company Size</label>
              <div class="flex space-x-2">
                <BaseSelect
                  v-model="mappings.company.size"
                  :options="formFields"
                  placeholder="Select form field"
                  class="flex-1"
                />
                <BaseSelect
                  v-model="mappings.company.size_type"
                  :options="mappingTypes"
                  placeholder="Type"
                  class="w-24"
                />
              </div>
            </div>

            <!-- Website -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Website</label>
              <div class="flex space-x-2">
                <BaseSelect
                  v-model="mappings.company.website"
                  :options="formFields"
                  placeholder="Select form field"
                  class="flex-1"
                />
                <BaseSelect
                  v-model="mappings.company.website_type"
                  :options="mappingTypes"
                  placeholder="Type"
                  class="w-24"
                />
              </div>
            </div>

            <!-- Description -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <div class="flex space-x-2">
                <BaseSelect
                  v-model="mappings.company.description"
                  :options="formFields"
                  placeholder="Select form field"
                  class="flex-1"
                />
                <BaseSelect
                  v-model="mappings.company.description_type"
                  :options="mappingTypes"
                  placeholder="Type"
                  class="w-24"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mapping Type Legend -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h5 class="font-medium text-gray-700 mb-3">Mapping Types</h5>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <strong>Direct:</strong> Use the form field value directly
          </div>
          <div>
            <strong>Static:</strong> Use a predefined static value
          </div>
          <div>
            <strong>Derived:</strong> Calculate value from other fields (e.g., email domain)
          </div>
          <div>
            <strong>Conditional:</strong> Set value based on conditions
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { formsAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'

interface FieldMapping {
  [key: string]: string
}

interface Mappings {
  contact: FieldMapping
  company: FieldMapping
}

const route = useRoute()
const { success, error: showError } = useNotifications()

const formId = computed(() => parseInt(route.params.id as string))
const saving = ref(false)
const loading = ref(false)

// Default mappings
const defaultMappings: Mappings = {
  contact: {
    first_name: '',
    first_name_type: 'direct',
    last_name: '',
    last_name_type: 'direct',
    email: '',
    email_type: 'direct',
    phone: '',
    phone_type: 'direct',
    job_title: '',
    job_title_type: 'direct',
    department: '',
    department_type: 'direct',
    source: '',
    source_type: 'static',
    lifecycle_stage: '',
    lifecycle_stage_type: 'static',
    custom_field_1: '',
    custom_field_1_type: 'direct',
    custom_field_2: '',
    custom_field_2_type: 'direct',
    tags: '',
    tags_type: 'static'
  },
  company: {
    name: '',
    name_type: 'derived',
    domain: '',
    domain_type: 'derived',
    industry: '',
    industry_type: 'direct',
    size: '',
    size_type: 'direct',
    website: '',
    website_type: 'direct',
    description: '',
    description_type: 'direct'
  }
}

const mappings = ref<Mappings>({ ...defaultMappings })
const originalMappings = ref<Mappings>({ ...defaultMappings })

// Form fields (will be loaded from form) - FIXED: Added fallback fields
const formFields = ref([
  { value: '', label: 'No mapping' },
  { value: 'first_name', label: 'First Name' },
  { value: 'last_name', label: 'Last Name' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'company', label: 'Company' },
  { value: 'company_name', label: 'Company Name' },
  { value: 'job_title', label: 'Job Title' },
  { value: 'department', label: 'Department' },
  { value: 'message', label: 'Message' },
  { value: 'source', label: 'Source' },
  { value: 'country', label: 'Country' }
])

// Mapping types
const mappingTypes = [
  { value: 'direct', label: 'Direct' },
  { value: 'static', label: 'Static' },
  { value: 'derived', label: 'Derived' },
  { value: 'conditional', label: 'Conditional' }
]

// Computed properties - FIXED: Use deep comparison for proper change detection
const hasChanges = computed(() => {
  return JSON.stringify(mappings.value) !== JSON.stringify(originalMappings.value)
})

// Load mappings - CRITICAL FIX: Handle backend response structure correctly
const loadMappings = async () => {
  loading.value = true
  try {
    console.log('Loading field mappings for form:', formId.value)
    const response = await formsAPI.getFormFieldMapping(formId.value)
    console.log('API Response:', response)
    
    // CRITICAL FIX: Extract the correct data structure from the response
    // The backend returns: { data: { field_mapping: { contact: {...}, company: {...} } } }
    let loadedMappings = {}
    
    if (response.data && response.data.data && response.data.data.field_mapping) {
      loadedMappings = response.data.data.field_mapping
      console.log('Found field_mapping in response.data.data.field_mapping:', loadedMappings)
    } else if (response.data && response.data.field_mapping) {
      loadedMappings = response.data.field_mapping
      console.log('Found field_mapping in response.data.field_mapping:', loadedMappings)
    } else if (response.data && response.data.data) {
      loadedMappings = response.data.data
      console.log('Using response.data.data as fallback:', loadedMappings)
    } else if (response.data) {
      loadedMappings = response.data
      console.log('Using response.data as fallback:', loadedMappings)
    } else {
      loadedMappings = response
      console.log('Using response as fallback:', loadedMappings)
    }
    
    console.log('Final extracted mappings:', loadedMappings)
    
    // CRITICAL FIX: Always start with default mappings and then override with backend data
    const mergedMappings = {
      contact: { ...defaultMappings.contact },
      company: { ...defaultMappings.company }
    }
    
    // Check if we have the field_mapping structure
    if (loadedMappings.field_mapping) {
      console.log('Found field_mapping structure:', loadedMappings.field_mapping)
      
      // The backend now returns the exact structure we need
      const backendMappings = loadedMappings.field_mapping
      
      // Map contact fields from backend - CRITICAL: Override all fields
      if (backendMappings.contact) {
        console.log('Processing contact mappings:', backendMappings.contact)
        Object.keys(backendMappings.contact).forEach(fieldName => {
          if (mergedMappings.contact.hasOwnProperty(fieldName)) {
            mergedMappings.contact[fieldName] = backendMappings.contact[fieldName]
            console.log(`Set contact.${fieldName} = ${backendMappings.contact[fieldName]}`)
          }
        })
      }
      
      // Map company fields from backend - CRITICAL: Override all fields
      if (backendMappings.company) {
        console.log('Processing company mappings:', backendMappings.company)
        Object.keys(backendMappings.company).forEach(fieldName => {
          if (mergedMappings.company.hasOwnProperty(fieldName)) {
            mergedMappings.company[fieldName] = backendMappings.company[fieldName]
            console.log(`Set company.${fieldName} = ${backendMappings.company[fieldName]}`)
          }
        })
      }
      
      console.log('Final merged mappings:', mergedMappings)
      
      // CRITICAL: Update reactive state with all mappings
      mappings.value = mergedMappings
      originalMappings.value = JSON.parse(JSON.stringify(mergedMappings))
      
    } else if (loadedMappings.contact || loadedMappings.company) {
      // Direct contact/company structure
      console.log('Found direct contact/company structure:', loadedMappings)
      
      // Map contact fields from backend - CRITICAL: Override all fields
      if (loadedMappings.contact) {
        console.log('Processing direct contact mappings:', loadedMappings.contact)
        Object.keys(loadedMappings.contact).forEach(fieldName => {
          if (mergedMappings.contact.hasOwnProperty(fieldName)) {
            mergedMappings.contact[fieldName] = loadedMappings.contact[fieldName]
            console.log(`Set contact.${fieldName} = ${loadedMappings.contact[fieldName]}`)
          }
        })
      }
      
      // Map company fields from backend - CRITICAL: Override all fields
      if (loadedMappings.company) {
        console.log('Processing direct company mappings:', loadedMappings.company)
        Object.keys(loadedMappings.company).forEach(fieldName => {
          if (mergedMappings.company.hasOwnProperty(fieldName)) {
            mergedMappings.company[fieldName] = loadedMappings.company[fieldName]
            console.log(`Set company.${fieldName} = ${loadedMappings.company[fieldName]}`)
          }
        })
      }
      
      console.log('Final merged mappings from direct structure:', mergedMappings)
      
      // CRITICAL: Update reactive state with all mappings
      mappings.value = mergedMappings
      originalMappings.value = JSON.parse(JSON.stringify(mergedMappings))
      
    } else {
      // Fallback to old transformation logic for backward compatibility
      console.log('Using fallback transformation logic')
      
      // Transform backend data structure to frontend structure
      const transformedMappings = {
        contact: {},
        company: {}
      }
      
      // Transform contact fields
      if (loadedMappings.contact_fields) {
        Object.keys(loadedMappings.contact_fields).forEach(fieldName => {
          const fieldData = loadedMappings.contact_fields[fieldName]
          transformedMappings.contact[fieldName] = fieldData.source_field || ''
          transformedMappings.contact[`${fieldName}_type`] = fieldData.mapping_type || 'direct'
        })
      }
      
      // Transform company fields
      if (loadedMappings.company_fields) {
        Object.keys(loadedMappings.company_fields).forEach(fieldName => {
          const fieldData = loadedMappings.company_fields[fieldName]
          transformedMappings.company[fieldName] = fieldName
          transformedMappings.company[`${fieldName}_type`] = 'direct'
        })
      }
      
      console.log('Transformed mappings (fallback):', transformedMappings)
      
      // Merge with defaults
      mappings.value = { ...defaultMappings, ...transformedMappings }
      originalMappings.value = JSON.parse(JSON.stringify(mappings.value))
    }
    
    // CRITICAL: Log the final state to verify all values are set
    console.log('Final mappings state after processing:', mappings.value)
    console.log('Original mappings stored:', originalMappings.value)
    
    // CRITICAL: Verify key fields are set
    console.log('Verification - Contact fields:')
    console.log('  first_name:', mappings.value.contact.first_name)
    console.log('  last_name:', mappings.value.contact.last_name)
    console.log('  email:', mappings.value.contact.email)
    console.log('  phone:', mappings.value.contact.phone)
    console.log('  job_title:', mappings.value.contact.job_title)
    
    console.log('Verification - Company fields:')
    console.log('  name:', mappings.value.company.name)
    console.log('  domain:', mappings.value.company.domain)
    
  } catch (err) {
    console.error('Failed to load field mappings:', err)
    // Use defaults if loading fails
    mappings.value = { ...defaultMappings }
    originalMappings.value = JSON.parse(JSON.stringify(defaultMappings))
  } finally {
    loading.value = false
  }
}

// Save mappings - FIXED: Wrap mappings in correct format
const saveMappings = async () => {
  saving.value = true
  try {
    // Wrap mappings in the correct format expected by backend
    const payload = {
      mappings: { ...mappings.value }
    }
    
    console.log('Sending field mappings payload to API:', payload)
    
    const response = await formsAPI.updateFormFieldMapping(formId.value, payload)
    
    // Check if the response is successful
    if (response && response.status >= 200 && response.status < 300) {
      success('Field mappings saved successfully!')
      // Update original mappings after successful save
      originalMappings.value = JSON.parse(JSON.stringify(mappings.value))
      console.log('Field mappings saved successfully:', response.data)
    } else {
      throw new Error(`Unexpected response status: ${response?.status}`)
    }
  } catch (err) {
    console.error('Failed to save field mappings:', err)
    showError('Failed to save field mappings')
  } finally {
    saving.value = false
  }
}

// Reset mappings - FIXED: Use deep copy to properly reset
const resetMappings = () => {
  mappings.value = JSON.parse(JSON.stringify(originalMappings.value))
}

// Load form fields - FIXED: Enhanced with better error handling and fallback
const loadFormFields = async () => {
  try {
    console.log('Loading form fields for form:', formId.value)
    const response = await formsAPI.getForm(formId.value)
    console.log('Form API Response:', response)
    
    let form = null
    if (response.data && response.data.data) {
      form = response.data.data
    } else if (response.data) {
      form = response.data
    } else {
      form = response
    }
    
    console.log('Extracted form data:', form)
    
    if (form && form.fields && Array.isArray(form.fields) && form.fields.length > 0) {
      // Use actual form fields from backend
      const backendFields = form.fields.map((field: any) => ({
        value: field.name,
        label: field.label || field.name
      }))
      
      formFields.value = [
        { value: '', label: 'No mapping' },
        ...backendFields
      ]
      
      console.log('Loaded form fields from backend:', formFields.value)
    } else {
      // Use fallback fields if backend doesn't provide them
      console.log('Using fallback form fields - backend fields not available')
      console.log('Form fields from backend:', form?.fields)
      
      // Keep the default fields we already have
      console.log('Current form fields (fallback):', formFields.value)
    }
  } catch (err) {
    console.error('Failed to load form fields from backend:', err)
    console.log('Using fallback form fields due to error')
    // Keep the default fields we already have
  }
}

onMounted(() => {
  loadFormFields()
  loadMappings()
})
</script>
