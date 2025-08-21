<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">
            Bulk Create Companies
          </h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6">
        <!-- Instructions -->
        <div class="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 class="text-sm font-medium text-blue-900 mb-2">Instructions:</h3>
          <ul class="text-xs text-blue-800 space-y-1">
            <li>• Add multiple companies at once</li>
            <li>• Required fields: Company Name</li>
            <li>• Optional fields: Industry, Website, Phone, Email, Address, Status, Description</li>
            <li>• Use the "Add Another Company" button to add more entries</li>
          </ul>
        </div>

        <!-- Companies list -->
        <div class="space-y-6">
          <div
            v-for="(company, index) in companies"
            :key="index"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">Company {{ index + 1 }}</h3>
              <button
                v-if="companies.length > 1"
                type="button"
                @click="removeCompany(index)"
                class="text-red-500 hover:text-red-700 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Company Name -->
              <div class="md:col-span-2">
                <BaseInput
                  v-model="company.name"
                  type="text"
                  label="Company Name *"
                  placeholder="Enter company name"
                  required
                  :error="errors[`companies.${index}.name`]"
                />
              </div>

              <!-- Domain -->
              <BaseInput
                v-model="company.domain"
                type="text"
                label="Domain"
                placeholder="example.com"
                :error="errors[`companies.${index}.domain`]"
              />

              <!-- Website -->
              <BaseInput
                v-model="company.website"
                type="url"
                label="Website"
                placeholder="https://example.com"
                :error="errors[`companies.${index}.website`]"
              />

              <!-- Industry -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <select
                  v-model="company.industry"
                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2596be] focus:ring-[#2596be]"
                >
                  <option value="">Select Industry</option>
                  <option v-for="industry in industries" :key="industry.id" :value="industry.name">
                    {{ industry.name }}
                  </option>
                </select>
              </div>

              <!-- Company Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Company Type
                </label>
                <select
                  v-model="company.type"
                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2596be] focus:ring-[#2596be]"
                >
                  <option value="">Select Type</option>
                  <option v-for="type in companyTypes" :key="type.id" :value="type.name">
                    {{ type.name }}
                  </option>
                </select>
              </div>

              <!-- Size -->
              <BaseInput
                v-model="company.size"
                type="number"
                label="Company Size"
                placeholder="Number of employees"
                :error="errors[`companies.${index}.size`]"
              />

              <!-- Annual Revenue -->
              <BaseInput
                v-model="company.annual_revenue"
                type="number"
                label="Annual Revenue"
                placeholder="Revenue amount"
                :error="errors[`companies.${index}.annual_revenue`]"
              />

              <!-- Phone -->
              <BaseInput
                v-model="company.phone"
                type="tel"
                label="Phone Number"
                placeholder="Enter phone number"
                :error="errors[`companies.${index}.phone`]"
              />

              <!-- Email -->
              <BaseInput
                v-model="company.email"
                type="email"
                label="Email Address"
                placeholder="Enter email address"
                :error="errors[`companies.${index}.email`]"
              />

              <!-- Timezone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  v-model="company.timezone"
                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2596be] focus:ring-[#2596be]"
                >
                  <option value="">Select Timezone</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Paris">Paris (CET)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                  <option value="Asia/Shanghai">Shanghai (CST)</option>
                  <option value="Asia/Kolkata">Mumbai (IST)</option>
                  <option value="Australia/Sydney">Sydney (AEDT)</option>
                </select>
              </div>

              <!-- LinkedIn Page -->
              <BaseInput
                v-model="company.linkedin_page"
                type="url"
                label="LinkedIn Page"
                placeholder="https://linkedin.com/company/..."
                :error="errors[`companies.${index}.linkedin_page`]"
              />

              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  v-model="company.status"
                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2596be] focus:ring-[#2596be]"
                >
                  <option value="prospect">Prospect</option>
                  <option value="active">Active</option>
                  <option value="customer">Customer</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <!-- Address -->
              <div class="md:col-span-2 space-y-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                
                <!-- Street -->
                <BaseInput
                  v-model="company.address.street"
                  type="text"
                  label="Street Address"
                  placeholder="Enter street address"
                />
                
                <!-- City and State -->
                <div class="grid grid-cols-2 gap-3">
                  <BaseInput
                    v-model="company.address.city"
                    type="text"
                    label="City"
                    placeholder="Enter city"
                  />
                  <BaseInput
                    v-model="company.address.state"
                    type="text"
                    label="State/Province"
                    placeholder="Enter state"
                  />
                </div>
                
                <!-- Postal Code and Country -->
                <div class="grid grid-cols-2 gap-3">
                  <BaseInput
                    v-model="company.address.postal_code"
                    type="text"
                    label="Postal Code"
                    placeholder="Enter postal code"
                  />
                  <BaseInput
                    v-model="company.address.country"
                    type="text"
                    label="Country"
                    placeholder="Enter country"
                  />
                </div>
              </div>

              <!-- Description -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  v-model="company.description"
                  rows="2"
                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2596be] focus:ring-[#2596be]"
                  placeholder="Enter company description..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Add another company button -->
        <div class="mt-6">
          <BaseButton
            type="button"
            variant="outline"
            @click="addCompany"
            class="w-full"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Another Company
          </BaseButton>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
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
            Create {{ companies.length }} Companies
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
import { useAuth } from '@/composables/useAuth'
import { companiesAPI, metadataAPI } from '@/services/api'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const emit = defineEmits(['close', 'created'])

const { success, error } = useNotifications()
const { user } = useAuth()

const loading = ref(false)
const industries = ref([
  { id: 1, name: 'Technology' },
  { id: 2, name: 'Healthcare' },
  { id: 3, name: 'Finance' },
  { id: 4, name: 'Education' },
  { id: 5, name: 'Manufacturing' },
  { id: 6, name: 'Retail' },
  { id: 7, name: 'Consulting' },
  { id: 8, name: 'Other' }
])
const companyTypes = ref([
  { id: 1, name: 'Corporation' },
  { id: 2, name: 'LLC' },
  { id: 3, name: 'Partnership' },
  { id: 4, name: 'Startup' },
  { id: 5, name: 'Non-Profit' },
  { id: 6, name: 'Other' }
])
const companies = ref([createEmptyCompany()])
const errors = reactive({})

// Create empty company object
function createEmptyCompany() {
  return {
    name: '',
    domain: '',
    website: '',
    industry: '',
    size: '',
    type: '',
    phone: '',
    email: '',
    timezone: '',
    linkedin_page: '',
    owner_id: user.value?.id || 1,
    address: {
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: ''
    },
    status: 'prospect',
    description: '',
    annual_revenue: ''
  }
}

// Add new company
const addCompany = () => {
  companies.value.push(createEmptyCompany())
}

// Remove company
const removeCompany = (index) => {
  companies.value.splice(index, 1)
}

// Load metadata
const loadMetadata = async () => {
  try {
    const [industriesResponse, typesResponse] = await Promise.all([
      metadataAPI.getIndustries(),
      metadataAPI.getCompanyTypes()
    ])
    
    // Only update if we get valid data from the API
    if (industriesResponse.data && industriesResponse.data.length > 0) {
      industries.value = industriesResponse.data.map((industry, index) => ({
        id: index + 1,
        name: industry
      }))
    }
    
    if (typesResponse.data && typesResponse.data.length > 0) {
      companyTypes.value = typesResponse.data.map((type, index) => ({
        id: index + 1,
        name: type
      }))
    }
  } catch (err) {
    console.error('Error loading metadata:', err)
    // Keep the fallback values if API fails
  }
}

// Validate form
const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key])
  
  let isValid = true
  
  companies.value.forEach((company, index) => {
    if (!company.name.trim()) {
      errors[`companies.${index}.name`] = 'Company name is required'
      isValid = false
    }
    
    if (company.website && !/^https?:\/\/.+/.test(company.website)) {
      errors[`companies.${index}.website`] = 'Please enter a valid website URL'
      isValid = false
    }

    if (company.linkedin_page && !/^https?:\/\/.+/.test(company.linkedin_page)) {
      errors[`companies.${index}.linkedin_page`] = 'Please enter a valid LinkedIn page URL'
      isValid = false
    }
    
    if (company.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(company.phone.replace(/\s/g, ''))) {
      errors[`companies.${index}.phone`] = 'Please enter a valid phone number'
      isValid = false
    }
    
    if (company.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(company.email)) {
      errors[`companies.${index}.email`] = 'Please enter a valid email address'
      isValid = false
    }

    if (company.size && (isNaN(company.size) || company.size < 1)) {
      errors[`companies.${index}.size`] = 'Company size must be a positive number'
      isValid = false
    }

    if (company.annual_revenue && (isNaN(company.annual_revenue) || company.annual_revenue < 0)) {
      errors[`companies.${index}.annual_revenue`] = 'Annual revenue must be a positive number'
      isValid = false
    }
  })
  
  return isValid
}

// Handle submit
const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    // Filter out empty companies
    const validCompanies = companies.value.filter(company => company.name.trim())
    
    if (validCompanies.length === 0) {
      error('Please add at least one company')
      return
    }
    
    const response = await companiesAPI.bulkCreate({ companies: validCompanies })
    
    success(`Successfully created ${validCompanies.length} companies`)
    emit('created')
  } catch (err) {
    if (err.response?.data?.errors) {
      // Handle validation errors from backend
      const backendErrors = err.response.data.errors
      Object.keys(backendErrors).forEach(key => {
        errors[key] = backendErrors[key][0]
      })
    } else {
      error('Failed to create companies')
    }
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(() => {
  loadMetadata()
})
</script>
