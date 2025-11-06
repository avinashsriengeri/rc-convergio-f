<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ $t('companies.title') }}</h1>
            <p class="text-sm text-gray-600">{{ $t('companies.subtitle') }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="outline"
              size="sm"
              @click="showImportModal = true"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              {{ $t('companies.import_csv') }}
            </BaseButton>
            <BaseButton
              variant="outline"
              size="sm"
              @click="showBulkCreateModal = true"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              {{ $t('companies.bulk_create') }}
            </BaseButton>
            <BaseButton
              variant="outline"
              size="sm"
              @click="router.push('/companies/deleted')"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ $t('companies.deleted_companies') }}
            </BaseButton>
            <BaseButton
              variant="primary"
              size="sm"
              @click="router.push('/companies/create')"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              {{ $t('companies.add_company') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Search -->
          <div class="flex-1">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="$t('companies.search_placeholder')"
                class="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2596be] focus:border-[#2596be]"
                @input="debouncedSearch"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Filters -->
          <div class="flex items-center space-x-3">
            <select
              v-model="filters.industry"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2596be] focus:border-[#2596be]"
            >
              <option value="">{{ $t('companies.all_industries') }}</option>
              <option v-for="industry in industries" :key="industry.id" :value="industry.name">
                {{ industry.name }}
              </option>
            </select>
            
            <select
              v-model="filters.type"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2596be] focus:border-[#2596be]"
            >
              <option value="">{{ $t('companies.all_types') }}</option>
              <option v-for="type in companyTypes" :key="type.id" :value="type.name">
                {{ type.name }}
              </option>
            </select>
            
            <select
              v-model="filters.sort"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2596be] focus:border-[#2596be]"
            >
              <option value="created_at:desc">{{ $t('companies.newest_first') }}</option>
              <option value="created_at:asc">{{ $t('companies.oldest_first') }}</option>
              <option value="name:asc">{{ $t('companies.name_az') }}</option>
              <option value="name:desc">{{ $t('companies.name_za') }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading state -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2596be]"></div>
      </div>

      <!-- Companies list -->
      <div v-else>
        <!-- Empty state -->
        <div v-if="companies.length === 0" class="text-center py-12">
          <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h12v8H6V6z" clip-rule="evenodd" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('companies.no_companies_found') }}</h3>
          <p class="text-gray-500 mb-6">{{ $t('companies.get_started_message') }}</p>
          <BaseButton
            variant="primary"
            @click="router.push('/companies/create')"
          >
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            {{ $t('companies.add_company') }}
          </BaseButton>
        </div>

        <!-- Companies grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="company in companies"
            :key="company.id"
            class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            @click="viewCompany(company.id)"
          >
            <div class="p-6">
              <!-- Company header -->
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-12 h-12 bg-gradient-to-r from-[#2596be] to-[#973894] rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-white font-medium text-lg">
                    {{ company.name.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div class="flex-1">
                  <h3 
                    class="text-lg font-semibold text-gray-900 cursor-pointer hover:text-[#2596be] transition-colors"
                    @click="viewCompany(company.id)"
                  >
                    {{ company.name }}
                  </h3>
                  <p class="text-sm text-gray-500">{{ company.industry || $t('companies.no_industry') }}</p>
                </div>
                <div class="flex items-center space-x-1 ml-2 flex-shrink-0">
                  <button
                    @click.stop="viewCompany(company.id)"
                    class="p-1.5 text-gray-400 hover:text-[#2596be] hover:bg-gray-100 rounded-lg transition-colors"
                    :title="$t('companies.view_company')"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button
                    v-if="canEdit(company)"
                    @click.stop="editCompany(company)"
                    class="p-1.5 text-gray-400 hover:text-[#2596be] hover:bg-gray-100 rounded-lg transition-colors"
                    :title="$t('companies.edit_company')"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button
                    v-if="canDelete(company)"
                    @click.stop="deleteCompany(company.id)"
                    class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    :title="$t('companies.delete_company')"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Company details -->
              <div class="space-y-2">
                <div v-if="company.website" class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd" />
                  </svg>
                  {{ company.website }}
                </div>
                
                <div v-if="company.phone" class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {{ company.phone }}
                </div>

                <div v-if="company.address" class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  </svg>
                  {{ formatAddress(company.address) }}
                </div>
                
                <div v-if="company.owner" class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                  <strong>Owner:</strong> {{ company.owner.name || '—' }}
                </div>
                
                <div v-if="company.team" class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                  </svg>
                  <strong>Team:</strong> {{ company.team.name || '—' }}
                </div>
              </div>

              <!-- Status and date -->
              <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  :class="getStatusClass(company.status)"
                >
                  {{ company.status }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ formatDate(company.created_at) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.total > pagination.per_page" class="mt-8 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            {{ $t('companies.showing_results', { from: pagination.from, to: pagination.to, total: pagination.total }) }}
          </div>
          <div class="flex items-center space-x-2">
            <BaseButton
              variant="outline"
              size="sm"
              :disabled="pagination.current_page === 1"
              @click="changePage(pagination.current_page - 1)"
            >
              {{ $t('companies.previous') }}
            </BaseButton>
            <span class="px-3 py-2 text-sm text-gray-700">
              {{ $t('companies.page_info', { current: pagination.current_page, last: pagination.last_page }) }}
            </span>
            <BaseButton
              variant="outline"
              size="sm"
              :disabled="pagination.current_page === pagination.last_page"
              @click="changePage(pagination.current_page + 1)"
            >
              {{ $t('companies.next') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <CompanyModal
      v-if="showEditModal"
      :company="editingCompany"
      mode="edit"
      @close="closeModal"
      @saved="handleCompanySaved"
    />

    <CompaniesImportModal
      v-if="showImportModal"
      @close="showImportModal = false"
      @imported="handleImportComplete"
    />

    <BulkCreateModal
      v-if="showBulkCreateModal"
      @close="showBulkCreateModal = false"
      @created="handleBulkCreateComplete"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { useContext } from '@/composables/useContext'
import { usePermission } from '@/composables/usePermission'
import { companiesAPI, metadataAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'
import CompanyModal from '@/components/modals/CompanyModal.vue'
import CompaniesImportModal from '@/components/modals/CompaniesImportModal.vue'
import BulkCreateModal from '@/components/modals/BulkCreateModal.vue'
import { debounce } from 'lodash-es'

const router = useRouter()
const { success, error } = useNotifications()
const { tenantId, teamId, isAdmin } = useContext()
const { canEdit, canDelete, canView } = usePermission()

// Reactive data
const loading = ref(false)
const companies = ref([])
const pagination = ref(null)
const searchQuery = ref('')
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
const filters = reactive({
  industry: '',
  type: '',
  sort: 'created_at:desc'
})

// Modal states
const showEditModal = ref(false)
const showImportModal = ref(false)
const showBulkCreateModal = ref(false)
const editingCompany = ref(null)

// Debounced search
const debouncedSearch = debounce(() => {
  fetchCompanies(1)
}, 300)

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
  fetchCompanies(1)
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

// Fetch companies
const fetchCompanies = async (page = 1) => {
  loading.value = true
  try {
    // Parse sort parameter
    const [sortBy, sortOrder] = filters.sort.split(':')
    
    const params = {
      page,
      per_page: 12,
      sortBy: sortBy || 'created_at',
      sortOrder: sortOrder || 'desc',
      ...(filters.industry && { industry: filters.industry }),
      ...(filters.type && { type: filters.type }),
      ...(searchQuery.value && { q: searchQuery.value })
    }

    console.log('Fetching companies with params:', params)
    console.log('Search query:', searchQuery.value)

    const response = await companiesAPI.getCompanies(params)
    console.log('Companies response:', response.data)
    console.log('Companies found:', response.data.data.length)
    console.log('Companies names:', response.data.data.map(c => c.name))
    
    companies.value = response.data.data
    pagination.value = response.data.meta
  } catch (err) {
    error('Failed to load companies')
    console.error('Companies error:', err)
  } finally {
    loading.value = false
  }
}

// Pagination
const changePage = (page) => {
  fetchCompanies(page)
}

// Company actions
const viewCompany = (companyId) => {
  router.push(`/companies/${companyId}`)
}

const editCompany = (company) => {
  editingCompany.value = company
  showEditModal.value = true
}

const deleteCompany = async (companyId) => {
  if (!confirm('Are you sure you want to delete this company?')) return

  try {
    await companiesAPI.deleteCompany(companyId)
    success('Company deleted successfully')
    fetchCompanies(pagination.value?.current_page || 1)
  } catch (err) {
    error('Failed to delete company')
  }
}

const closeModal = () => {
  showEditModal.value = false
  editingCompany.value = null
}

const handleCompanySaved = () => {
  closeModal()
  fetchCompanies(pagination.value?.current_page || 1)
  success('Company saved successfully')
}

const handleImportComplete = () => {
  showImportModal.value = false
  console.log('Import complete handler triggered, refreshing companies...')
  
  // Add a delay to ensure backend processing is complete
  setTimeout(() => {
    console.log('Fetching companies after import delay...')
    fetchCompanies(1)
  }, 2000) // Increased delay to 2 seconds
  
  success('Companies imported successfully')
}

const handleBulkCreateComplete = () => {
  showBulkCreateModal.value = false
  fetchCompanies(1)
  success('Companies created successfully')
}

// Utility functions
const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    prospect: 'bg-blue-100 text-blue-800',
    customer: 'bg-purple-100 text-purple-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const formatAddress = (address) => {
  if (!address) return 'No address'
  
  const parts = []
  if (address.street) parts.push(address.street)
  if (address.city) parts.push(address.city)
  if (address.state) parts.push(address.state)
  if (address.postal_code) parts.push(address.postal_code)
  if (address.country) parts.push(address.country)
  
  return parts.length > 0 ? parts.join(', ') : 'No address'
}

// Watch for filter changes
watch(filters, () => {
  fetchCompanies(1)
}, { deep: true })

// Initialize
onMounted(async () => {
  // Load companies immediately without waiting for metadata
  fetchCompanies()
  // Load metadata in background (non-blocking)
  loadMetadata()
})
</script>
