<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <router-link
              to="/companies"
              class="text-[#2596be] hover:text-[#973894] transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </router-link>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Deleted Companies</h1>
              <p class="text-sm text-gray-600">View and restore soft-deleted companies</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <BaseButton
              variant="outline"
              size="sm"
              icon="refresh"
              @click="fetchDeletedCompanies"
            >
              Refresh
            </BaseButton>
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
          <h3 class="text-lg font-medium text-gray-900 mb-2">No deleted companies found</h3>
          <p class="text-gray-500 mb-6">All companies are active or have been permanently deleted.</p>
          <router-link
            to="/companies"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#2596be] hover:bg-[#973894] transition-colors"
          >
            Back to Companies
          </router-link>
        </div>

        <!-- Companies grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="company in companies"
            :key="company.id"
            class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div class="p-6">
              <!-- Company header -->
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <span class="text-white font-medium text-lg">
                    {{ company.name.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">{{ company.name }}</h3>
                  <p class="text-sm text-gray-500">{{ company.industry || 'No industry' }}</p>
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
              </div>

              <!-- Deleted date and actions -->
              <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div class="text-xs text-gray-500">
                  Deleted: {{ formatDate(company.deleted_at) }}
                </div>
                <div class="flex items-center space-x-2">
                  <BaseButton
                    variant="primary"
                    size="sm"
                    icon="refresh"
                    @click="restoreCompany(company.id)"
                    :loading="restoringCompany === company.id"
                  >
                    Restore
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.total > pagination.per_page" class="mt-8 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} results
          </div>
          <div class="flex items-center space-x-2">
            <BaseButton
              variant="outline"
              size="sm"
              :disabled="pagination.current_page === 1"
              @click="changePage(pagination.current_page - 1)"
            >
              Previous
            </BaseButton>
            <span class="px-3 py-2 text-sm text-gray-700">
              Page {{ pagination.current_page }} of {{ pagination.last_page }}
            </span>
            <BaseButton
              variant="outline"
              size="sm"
              :disabled="pagination.current_page === pagination.last_page"
              @click="changePage(pagination.current_page + 1)"
            >
              Next
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { companiesAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const { success, error } = useNotifications()

// Reactive data
const loading = ref(false)
const companies = ref([])
const pagination = ref(null)
const restoringCompany = ref(null)

// Fetch deleted companies
const fetchDeletedCompanies = async (page = 1) => {
  loading.value = true
  try {
    const params = {
      page,
      per_page: 12
    }

    const response = await companiesAPI.getDeletedCompanies(params)
    companies.value = response.data.data
    pagination.value = response.data.meta
  } catch (err) {
    error('Failed to load deleted companies')
    console.error('Deleted companies error:', err)
  } finally {
    loading.value = false
  }
}

// Pagination
const changePage = (page) => {
  fetchDeletedCompanies(page)
}

// Restore company
const restoreCompany = async (companyId) => {
  if (!confirm('Are you sure you want to restore this company?')) return

  restoringCompany.value = companyId
  
  try {
    await companiesAPI.restoreCompany(companyId)
    success('Company restored successfully')
    
    // Remove from list
    companies.value = companies.value.filter(company => company.id !== companyId)
    
    // Update pagination
    if (pagination.value) {
      pagination.value.total--
      if (pagination.value.total === 0) {
        companies.value = []
      }
    }
  } catch (err) {
    error('Failed to restore company')
    console.error('Restore company error:', err)
  } finally {
    restoringCompany.value = null
  }
}

// Utility functions
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

// Initialize
onMounted(() => {
  fetchDeletedCompanies()
})
</script>
