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
            <li>• Required fields: Company Name *, Website *, Industry *</li>
            <li>• Optional: Enter a domain to auto-fill company details</li>
            <li>• Optional fields: Phone, Email, Address, Status, Description</li>
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
              <!-- Domain -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Domain (auto-fill details)
                </label>
                <BaseInput
                  v-model="company.domain"
                  type="text"
                  placeholder="e.g. example.com"
                  :error="!!errors[`companies.${index}.domain`]"
                  @blur="handleDomainEnrichment(company, index)"
                  @keyup.enter="handleDomainEnrichment(company, index)"
                />
                <p class="mt-1 text-xs text-gray-500">
                  Enter a valid domain to auto-fill company details, or leave blank to enter manually.
                </p>
                <p v-if="errors[`companies.${index}.domain`]" class="mt-1 text-sm text-red-600">{{ errors[`companies.${index}.domain`] }}</p>
              </div>

              <!-- Company Name -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <BaseInput
                  v-model="company.name"
                  type="text"
                  placeholder="e.g. Acme Corporation"
                  :error="!!errors[`companies.${index}.name`]"
                />
                <p v-if="errors[`companies.${index}.name`]" class="mt-1 text-sm text-red-600">{{ errors[`companies.${index}.name`] }}</p>
              </div>

              <!-- Website -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Website *
                </label>
                <BaseInput
                  v-model="company.website"
                  type="url"
                  placeholder="https://example.com"
                  :error="!!errors[`companies.${index}.website`]"
                />
                <p v-if="errors[`companies.${index}.website`]" class="mt-1 text-sm text-red-600">{{ errors[`companies.${index}.website`] }}</p>
              </div>

              <!-- Industry -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Industry *
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
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Employees
                </label>
                <BaseInput
                  v-model="company.size"
                  type="number"
                  placeholder="e.g. 150"
                  :error="!!errors[`companies.${index}.size`]"
                />
                <p v-if="errors[`companies.${index}.size`]" class="mt-1 text-sm text-red-600">{{ errors[`companies.${index}.size`] }}</p>
              </div>

              <!-- Annual Revenue -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Revenue
                </label>
                <BaseInput
                  v-model="company.annual_revenue"
                  type="number"
                  placeholder="e.g. 5000000"
                  :error="!!errors[`companies.${index}.annual_revenue`]"
                />
                <p v-if="errors[`companies.${index}.annual_revenue`]" class="mt-1 text-sm text-red-600">{{ errors[`companies.${index}.annual_revenue`] }}</p>
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <BaseInput
                  v-model="company.phone"
                  type="tel"
                  placeholder="e.g. +1-555-123-4567"
                  :error="!!errors[`companies.${index}.phone`]"
                />
                <p v-if="errors[`companies.${index}.phone`]" class="mt-1 text-sm text-red-600">{{ errors[`companies.${index}.phone`] }}</p>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <BaseInput
                  v-model="company.email"
                  type="email"
                  placeholder="e.g. contact@company.com"
                  :error="!!errors[`companies.${index}.email`]"
                />
                <p v-if="errors[`companies.${index}.email`]" class="mt-1 text-sm text-red-600">{{ errors[`companies.${index}.email`] }}</p>
              </div>

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
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn URL
                </label>
                <BaseInput
                  v-model="company.linkedin_page"
                  type="url"
                  placeholder="e.g. https://linkedin.com/company/..."
                  :error="!!errors[`companies.${index}.linkedin_page`]"
                />
                <p v-if="errors[`companies.${index}.linkedin_page`]" class="mt-1 text-sm text-red-600">{{ errors[`companies.${index}.linkedin_page`] }}</p>
              </div>

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
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <BaseInput
                    v-model="company.address.street"
                    type="text"
                    placeholder="e.g. 123 Main Street"
                  />
                </div>
                
                <!-- City and State -->
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <BaseInput
                      v-model="company.address.city"
                      type="text"
                      placeholder="e.g. New York"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <BaseInput
                      v-model="company.address.state"
                      type="text"
                      placeholder="e.g. NY"
                    />
                  </div>
                </div>
                
                <!-- Postal Code and Country -->
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <BaseInput
                      v-model="company.address.postal_code"
                      type="text"
                      placeholder="e.g. 10001"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <BaseInput
                      v-model="company.address.country"
                      type="text"
                      placeholder="e.g. United States"
                    />
                  </div>
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
                  placeholder="e.g. Leading technology company specializing in..."
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

// Company type normalization function
const normalizeCompanyType = (type) => {
  const typeMap = {
    'corporation': 'Corporation',
    'corp': 'Corporation',
    'inc': 'Corporation',
    'incorporated': 'Corporation',
    'llc': 'LLC',
    'limited liability company': 'LLC',
    'partnership': 'Partnership',
    'lp': 'Partnership',
    'llp': 'Partnership',
    'startup': 'Startup',
    'non-profit': 'Non-Profit',
    'nonprofit': 'Non-Profit',
    'npo': 'Non-Profit',
    'other': 'Other'
  }
  
  const normalized = typeMap[type.toLowerCase()] || 'Other'
  return normalized
}

// Domain enrichment function
const handleDomainEnrichment = async (company, index) => {
  const domain = company.domain.trim()
  
  if (!domain) {
    return
  }

  // Basic domain validation
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
  if (!domainRegex.test(domain)) {
    error('Please enter a valid domain (e.g., example.com)')
    return
  }

  try {
    const response = await companiesAPI.enrichCompany(domain)
    const companyData = response.data

    // Auto-fill company fields with enrichment data
    if (companyData.company_name) company.name = companyData.company_name
    if (companyData.website) company.website = companyData.website
    if (companyData.industry) company.industry = companyData.industry
    
    // Handle company type mapping with normalization
    if (companyData.company_type) {
      const normalizedType = normalizeCompanyType(companyData.company_type)
      company.type = normalizedType
    }
    
    if (companyData.employees) company.size = companyData.employees
    if (companyData.revenue) company.annual_revenue = companyData.revenue
    if (companyData.phone) company.phone = companyData.phone
    if (companyData.email) company.email = companyData.email
    if (companyData.linkedin_url) company.linkedin_page = companyData.linkedin_url
    if (companyData.timezone) company.timezone = companyData.timezone

    // Handle address data
    if (companyData.address) company.address.street = companyData.address
    if (companyData.city) company.address.city = companyData.city
    if (companyData.state) company.address.state = companyData.state
    if (companyData.postal_code) company.address.postal_code = companyData.postal_code
    if (companyData.country) company.address.country = companyData.country

    success('Company details auto-filled successfully.')
  } catch (err) {
    console.error('Enrichment error:', err)
    error('Could not fetch details for this domain. Please enter manually.')
  }
}

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
    // Required field validation
    if (!company.name?.trim()) {
      errors[`companies.${index}.name`] = 'Company name is required'
      isValid = false
    }
    
    if (!company.website?.trim()) {
      errors[`companies.${index}.website`] = 'Website is required'
      isValid = false
    }
    
    if (!company.industry?.trim()) {
      errors[`companies.${index}.industry`] = 'Industry is required'
      isValid = false
    }
    
    // Format validation
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
