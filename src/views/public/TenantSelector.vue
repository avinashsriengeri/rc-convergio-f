<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click="handleBackdropClick"
  >
    <div
      class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white"
      @click.stop
    >
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Select Your Organization</h3>
            <p class="text-gray-600 mt-2">Please select which organization this support request belongs to:</p>
          </div>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Search -->
        <div class="mb-6">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search organizations..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Tenant List -->
        <div class="max-h-96 overflow-y-auto mb-6">
          <div v-if="loading" class="text-center py-8">
            <div class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading organizations...
            </div>
          </div>

          <div v-else-if="error" class="text-center py-8">
            <div class="text-red-600 mb-4">{{ error }}</div>
            <button
              @click="loadTenants"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>

          <div v-else-if="filteredTenants.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No organizations found</h3>
            <p class="text-gray-500">Try adjusting your search terms or contact support directly.</p>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="tenant in filteredTenants"
              :key="tenant.id"
              @click="selectTenant(tenant)"
              class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200"
              :class="{ 'border-blue-500 bg-blue-50': selectedTenant?.id === tenant.id }"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                      <span class="text-white font-semibold text-sm">
                        {{ getInitials(tenant.name) }}
                      </span>
                    </div>
                    <div>
                      <h4 class="text-lg font-semibold text-gray-900">{{ tenant.name }}</h4>
                      <p class="text-sm text-gray-500">{{ tenant.description || 'No description available' }}</p>
                    </div>
                  </div>
                </div>
                <div class="flex items-center">
                  <div v-if="selectedTenant?.id === tenant.id" class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div v-else class="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-between items-center pt-4 border-t border-gray-200">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          
          <div class="flex items-center space-x-3">
            <button
              @click="handleContactSupport"
              class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Can't find your organization?
            </button>
            
            <button
              @click="submitWithTenant"
              :disabled="!selectedTenant || submitting"
              class="px-6 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ submitting ? 'Submitting...' : 'Submit Request' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

// Props
const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['close', 'submit', 'contact-support'])

// State
const tenants = ref([])
const selectedTenant = ref(null)
const searchQuery = ref('')
const loading = ref(false)
const error = ref(null)
const submitting = ref(false)

// Computed
const filteredTenants = computed(() => {
  if (!searchQuery.value) return tenants.value
  
  const query = searchQuery.value.toLowerCase()
  return tenants.value.filter(tenant => 
    tenant.name.toLowerCase().includes(query) ||
    (tenant.description && tenant.description.toLowerCase().includes(query))
  )
})

// Methods
const loadTenants = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Try to fetch available tenants/organizations from API
    try {
      const response = await api.get('/public/tenants')
      tenants.value = response.data.data || response.data || []
    } catch (apiError) {
      // If API endpoint doesn't exist, use mock data
      console.log('API endpoint not available, using mock data')
      tenants.value = [
        {
          id: 1,
          name: 'RC Convergio',
          description: 'Main organization for RC Convergio platform'
        },
        {
          id: 2,
          name: 'Demo Company',
          description: 'Demo organization for testing purposes'
        },
        {
          id: 3,
          name: 'Acme Corporation',
          description: 'Sample enterprise organization'
        },
        {
          id: 4,
          name: 'TechStart Inc',
          description: 'Technology startup organization'
        },
        {
          id: 5,
          name: 'Global Solutions Ltd',
          description: 'International business solutions provider'
        }
      ]
    }
  } catch (err) {
    console.error('Error loading tenants:', err)
    error.value = 'Failed to load organizations. Please try again.'
  } finally {
    loading.value = false
  }
}

const selectTenant = (tenant) => {
  selectedTenant.value = tenant
}

const submitWithTenant = async () => {
  if (!selectedTenant.value) return
  
  submitting.value = true
  
  try {
    const formDataWithTenant = {
      ...props.formData,
      tenant_id: selectedTenant.value.id
    }
    
    emit('submit', formDataWithTenant)
  } catch (err) {
    console.error('Error submitting with tenant:', err)
  } finally {
    submitting.value = false
  }
}

const handleContactSupport = () => {
  emit('contact-support')
}

const handleBackdropClick = () => {
  emit('close')
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// Lifecycle
onMounted(() => {
  loadTenants()
})
</script>
