<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ mode === 'edit' ? 'Edit Company' : 'Add Company' }}
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
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Domain for Auto-enrichment -->
          <div class="md:col-span-2">
            <BaseInput
              v-model="enrichmentDomain"
              type="text"
              label="Company Domain (auto-fill details)"
              placeholder="e.g. example.com"
              :error="errors.enrichmentDomain"
              @blur="handleDomainEnrichment"
              @keyup.enter="handleDomainEnrichment"
            />
            <p class="mt-1 text-xs text-gray-500">
              Enter a valid domain to auto-fill company details, or leave blank to enter manually.
            </p>
            <div v-if="enrichmentLoading" class="mt-2 flex items-center text-sm text-blue-600">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Fetching company details...
            </div>
          </div>

          <!-- Company Name -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <BaseInput
              v-model="form.name"
              type="text"
              placeholder="e.g. Acme Corporation"
              :error="!!errors.name"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <!-- Domain -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Domain
            </label>
            <BaseInput
              v-model="form.domain"
              type="text"
              placeholder="example.com"
              :error="!!errors.domain"
            />
            <p v-if="errors.domain" class="mt-1 text-sm text-red-600">{{ errors.domain }}</p>
          </div>

          <!-- Website -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Website *
            </label>
            <BaseInput
              v-model="form.website"
              type="url"
              placeholder="https://example.com"
              :error="!!errors.website"
            />
            <p v-if="errors.website" class="mt-1 text-sm text-red-600">{{ errors.website }}</p>
          </div>

          <!-- Industry -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Industry *
            </label>
            <select
              v-model="form.industry"
              :class="[
                'block w-full rounded-lg shadow-sm focus:border-[#2596be] focus:ring-[#2596be]',
                errors.industry ? 'border-red-300' : 'border-gray-300'
              ]"
            >
              <option value="">Select Industry</option>
              <option v-for="industry in industries" :key="industry.id" :value="industry.name">
                {{ industry.name }}
              </option>
            </select>
            <p v-if="errors.industry" class="mt-1 text-sm text-red-600">{{ errors.industry }}</p>
          </div>

          <!-- Company Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Company Type
            </label>
            <select
              v-model="form.type"
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
              v-model="form.size"
              type="number"
              placeholder="e.g. 150"
              :error="!!errors.size"
            />
            <p v-if="errors.size" class="mt-1 text-sm text-red-600">{{ errors.size }}</p>
          </div>

          <!-- Annual Revenue -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Revenue
            </label>
            <BaseInput
              v-model="form.annual_revenue"
              type="number"
              placeholder="e.g. 5000000"
              :error="!!errors.annual_revenue"
            />
            <p v-if="errors.annual_revenue" class="mt-1 text-sm text-red-600">{{ errors.annual_revenue }}</p>
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <BaseInput
              v-model="form.phone"
              type="tel"
              placeholder="e.g. +1-555-123-4567"
              :error="!!errors.phone"
            />
            <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <BaseInput
              v-model="form.email"
              type="email"
              placeholder="e.g. contact@company.com"
              :error="!!errors.email"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Timezone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Timezone
            </label>
            <select
              v-model="form.timezone"
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
              v-model="form.linkedin_page"
              type="url"
              placeholder="e.g. https://linkedin.com/company/..."
              :error="!!errors.linkedin_page"
            />
            <p v-if="errors.linkedin_page" class="mt-1 text-sm text-red-600">{{ errors.linkedin_page }}</p>
          </div>

          <!-- Owner -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Owner *
            </label>
            <select
              v-model="form.owner_id"
              :class="[
                'block w-full rounded-lg shadow-sm focus:border-[#2596be] focus:ring-[#2596be]',
                errors.owner_id ? 'border-red-300' : 'border-gray-300'
              ]"
            >
              <option value="">Select Owner</option>
              <option v-for="owner in owners" :key="owner.id" :value="owner.id">
                {{ owner.name }}
              </option>
            </select>
            <p v-if="errors.owner_id" class="mt-1 text-sm text-red-600">{{ errors.owner_id }}</p>
          </div>
        </div>

        <!-- Address -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          
          <!-- Street -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <BaseInput
              v-model="form.address.street"
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
                v-model="form.address.city"
                type="text"
                placeholder="e.g. New York"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <BaseInput
                v-model="form.address.state"
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
                v-model="form.address.postal_code"
                type="text"
                placeholder="e.g. 10001"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <BaseInput
                v-model="form.address.country"
                type="text"
                placeholder="e.g. United States"
              />
            </div>
          </div>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            v-model="form.status"
            class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2596be] focus:ring-[#2596be]"
          >
            <option value="prospect">Prospect</option>
            <option value="active">Active</option>
            <option value="customer">Customer</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2596be] focus:ring-[#2596be]"
            placeholder="e.g. Leading technology company specializing in..."
          ></textarea>
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
            {{ mode === 'edit' ? 'Update' : 'Create' }}
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
import { companiesAPI, metadataAPI } from '@/services/api'
import { useAuth } from '@/composables/useAuth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  company: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'create',
    validator: (value) => ['create', 'edit'].includes(value)
  }
})

const emit = defineEmits(['close', 'saved'])

const { success, error } = useNotifications()
const { user } = useAuth()

const loading = ref(false)
const enrichmentLoading = ref(false)
const enrichmentDomain = ref('')
const formSubmitted = ref(false)
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
const owners = ref([
  { id: user.value?.id || 1, name: user.value?.name || 'Current User' }
])

const form = reactive({
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
})

const errors = reactive({
  name: '',
  domain: '',
  website: '',
  size: '',
  phone: '',
  email: '',
  linkedin_page: '',
  annual_revenue: '',
  enrichmentDomain: '',
  industry: '',
  owner_id: ''
})

// Load metadata
const loadMetadata = async () => {
  try {
    console.log('Loading metadata...')
    const [industriesResponse, typesResponse, ownersResponse] = await Promise.all([
      metadataAPI.getIndustries(),
      metadataAPI.getCompanyTypes(),
      metadataAPI.getOwners()
    ])
    
    console.log('Industries response:', industriesResponse)
    console.log('Types response:', typesResponse)
    console.log('Owners response:', ownersResponse)
    
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

    if (ownersResponse.data && ownersResponse.data.length > 0) {
      owners.value = ownersResponse.data.map((owner, index) => ({
        id: owner.id || index + 1,
        name: owner.name || owner.email
      }))
    }
    
    console.log('Processed industries:', industries.value)
    console.log('Processed company types:', companyTypes.value)
    console.log('Processed owners:', owners.value)
  } catch (err) {
    console.error('Error loading metadata:', err)
    // Keep the fallback values if API fails
  }
}

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

// Domain enrichment functionality
const handleDomainEnrichment = async () => {
  const domain = enrichmentDomain.value.trim()
  
  if (!domain) {
    return
  }

  // Basic domain validation
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/
  if (!domainRegex.test(domain)) {
    errors.enrichmentDomain = 'Please enter a valid domain (e.g., example.com)'
    return
  }

  errors.enrichmentDomain = ''
  enrichmentLoading.value = true

  try {
    const response = await companiesAPI.enrichCompany(domain)
    const companyData = response.data

    // Auto-fill form fields with enrichment data
    if (companyData.company_name) form.name = companyData.company_name
    if (companyData.website) form.website = companyData.website
    if (companyData.domain) form.domain = companyData.domain
    if (companyData.industry) form.industry = companyData.industry
    
    // Handle company type mapping with normalization
    if (companyData.company_type) {
      const normalizedType = normalizeCompanyType(companyData.company_type)
      form.type = normalizedType
    }
    
    if (companyData.employees) form.size = companyData.employees
    if (companyData.revenue) form.annual_revenue = companyData.revenue
    if (companyData.phone) form.phone = companyData.phone
    if (companyData.email) form.email = companyData.email
    if (companyData.linkedin_url) form.linkedin_page = companyData.linkedin_url
    if (companyData.timezone) form.timezone = companyData.timezone

    // Handle address data
    if (companyData.address) form.address.street = companyData.address
    if (companyData.city) form.address.city = companyData.city
    if (companyData.state) form.address.state = companyData.state
    if (companyData.postal_code) form.address.postal_code = companyData.postal_code
    if (companyData.country) form.address.country = companyData.country

    success('Company details auto-filled successfully!')
  } catch (err) {
    console.error('Enrichment error:', err)
    
    if (err.response?.status === 404) {
      error('Unable to fetch company details, please enter manually.')
    } else {
      error('Unable to fetch company details, please enter manually.')
    }
  } finally {
    enrichmentLoading.value = false
  }
}

// Initialize form when company prop changes
watch(() => props.company, (newCompany) => {
  // Reset form submitted flag when opening modal
  formSubmitted.value = false
  enrichmentDomain.value = ''
  
  // Clear all errors
  Object.keys(errors).forEach(key => errors[key] = '')
  
  if (newCompany && props.mode === 'edit') {
    Object.assign(form, {
      name: newCompany.name || '',
      domain: newCompany.domain || '',
      website: newCompany.website || '',
      industry: newCompany.industry || '',
      size: newCompany.size || '',
      type: newCompany.type || '',
      phone: newCompany.phone || '',
      email: newCompany.email || '',
      timezone: newCompany.timezone || '',
      linkedin_page: newCompany.linkedin_page || '',
      owner_id: newCompany.owner_id || user.value?.id || 1,
      address: {
        street: newCompany.address?.street || '',
        city: newCompany.address?.city || '',
        state: newCompany.address?.state || '',
        postal_code: newCompany.address?.postal_code || '',
        country: newCompany.address?.country || ''
      },
      status: newCompany.status || 'prospect',
      description: newCompany.description || '',
      annual_revenue: newCompany.annual_revenue || ''
    })
  } else if (props.mode === 'create') {
    // Reset form for new company creation
    Object.assign(form, {
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
    })
  }
}, { immediate: true })

const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => errors[key] = '')
  
  let isValid = true
  
  // Only show validation errors if form has been submitted
  if (!formSubmitted.value) {
    return true
  }
  
  // Required field validation
  if (!form.name?.trim()) {
    errors.name = 'Company name is required'
    isValid = false
  }
  
  if (!form.website?.trim()) {
    errors.website = 'Website is required'
    isValid = false
  }
  
  if (!form.industry?.trim()) {
    errors.industry = 'Industry is required'
    isValid = false
  }
  
  if (!form.owner_id) {
    errors.owner_id = 'Owner is required'
    isValid = false
  }
  

  
  if (form.website && !/^https?:\/\/.+/.test(form.website)) {
    errors.website = 'Please enter a valid website URL'
    isValid = false
  }

  if (form.linkedin_page && !/^https?:\/\/.+/.test(form.linkedin_page)) {
    errors.linkedin_page = 'Please enter a valid LinkedIn page URL'
    isValid = false
  }
  
  if (form.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(form.phone.replace(/\s/g, ''))) {
    errors.phone = 'Please enter a valid phone number'
    isValid = false
  }
  
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  if (form.size && (isNaN(form.size) || form.size < 1)) {
    errors.size = 'Company size must be a positive number'
    isValid = false
  }

  if (form.annual_revenue && (isNaN(form.annual_revenue) || form.annual_revenue < 0)) {
    errors.annual_revenue = 'Annual revenue must be a positive number'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = async () => {
  formSubmitted.value = true
  
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    // Check for duplicates before creating
    if (props.mode === 'create') {
      try {
        const duplicateCheck = await companiesAPI.checkDuplicates({
          name: form.name,
          email: form.email
        })
        
        if (duplicateCheck.data.has_duplicates) {
          const duplicates = duplicateCheck.data.duplicates
          let message = 'Potential duplicates found:\n'
          duplicates.forEach(dup => {
            message += `• ${dup.name} (${dup.email || 'No email'})\n`
          })
          
          if (!confirm(message + '\nDo you want to continue anyway?')) {
            loading.value = false
            return
          }
        }
      } catch (err) {
        console.error('Duplicate check error:', err)
        // Continue with creation even if duplicate check fails
      }
    }
    
    if (props.mode === 'edit') {
      await companiesAPI.updateCompany(props.company.id, form)
      success('Company updated successfully!')
    } else {
      await companiesAPI.createCompany(form)
      success('Company created successfully!')
    }
    
    emit('saved')
  } catch (err) {
    if (err.response?.data?.errors) {
      // Handle validation errors from backend
      const backendErrors = err.response.data.errors
      Object.keys(backendErrors).forEach(key => {
        if (errors.hasOwnProperty(key)) {
          errors[key] = backendErrors[key][0]
        }
      })
    } else {
      error('Failed to save company')
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
