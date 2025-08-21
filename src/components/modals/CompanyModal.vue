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
          <!-- Company Name -->
          <div class="md:col-span-2">
            <BaseInput
              v-model="form.name"
              type="text"
              label="Company Name *"
              placeholder="Enter company name"
              required
              :error="errors.name"
            />
          </div>

          <!-- Domain -->
          <BaseInput
            v-model="form.domain"
            type="text"
            label="Domain"
            placeholder="example.com"
            :error="errors.domain"
          />

          <!-- Website -->
          <BaseInput
            v-model="form.website"
            type="url"
            label="Website"
            placeholder="https://example.com"
            :error="errors.website"
          />

          <!-- Industry -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <select
              v-model="form.industry"
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
          <BaseInput
            v-model="form.size"
            type="number"
            label="Company Size"
            placeholder="Number of employees"
            :error="errors.size"
          />

          <!-- Annual Revenue -->
          <BaseInput
            v-model="form.annual_revenue"
            type="number"
            label="Annual Revenue"
            placeholder="Revenue amount"
            :error="errors.annual_revenue"
          />

          <!-- Phone -->
          <BaseInput
            v-model="form.phone"
            type="tel"
            label="Phone Number"
            placeholder="Enter phone number"
            icon="phone"
            :error="errors.phone"
          />

          <!-- Email -->
          <BaseInput
            v-model="form.email"
            type="email"
            label="Email Address"
            placeholder="Enter email address"
            icon="email"
            :error="errors.email"
          />

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
          <BaseInput
            v-model="form.linkedin_page"
            type="url"
            label="LinkedIn Page"
            placeholder="https://linkedin.com/company/..."
            :error="errors.linkedin_page"
          />

          <!-- Owner -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Owner
            </label>
            <select
              v-model="form.owner_id"
              class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#2596be] focus:ring-[#2596be]"
            >
              <option value="">Select Owner</option>
              <option v-for="owner in owners" :key="owner.id" :value="owner.id">
                {{ owner.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Address -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          
          <!-- Street -->
          <BaseInput
            v-model="form.address.street"
            type="text"
            label="Street Address"
            placeholder="Enter street address"
          />
          
          <!-- City and State -->
          <div class="grid grid-cols-2 gap-3">
            <BaseInput
              v-model="form.address.city"
              type="text"
              label="City"
              placeholder="Enter city"
            />
            <BaseInput
              v-model="form.address.state"
              type="text"
              label="State/Province"
              placeholder="Enter state"
            />
          </div>
          
          <!-- Postal Code and Country -->
          <div class="grid grid-cols-2 gap-3">
            <BaseInput
              v-model="form.address.postal_code"
              type="text"
              label="Postal Code"
              placeholder="Enter postal code"
            />
            <BaseInput
              v-model="form.address.country"
              type="text"
              label="Country"
              placeholder="Enter country"
            />
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
            placeholder="Enter company description..."
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
  annual_revenue: ''
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

// Initialize form when company prop changes
watch(() => props.company, (newCompany) => {
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
  }
}, { immediate: true })

const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => errors[key] = '')
  
  let isValid = true
  
  if (!form.name) {
    errors.name = 'Company name is required'
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
    } else {
      await companiesAPI.createCompany(form)
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
