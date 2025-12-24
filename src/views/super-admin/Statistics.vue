<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <h1 class="text-2xl font-bold text-gray-900">System Statistics</h1>
          <p class="text-sm text-gray-600 mt-1">Comprehensive system-wide analytics and insights</p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-purple"></div>
      </div>

      <!-- Content -->
      <div v-else class="space-y-8">
        <!-- System-wide Statistics -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">System-wide Statistics</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="text-sm font-medium text-gray-600">Total Tenants</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.total_tenants || 0 }}</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="text-sm font-medium text-gray-600">Total Users</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.total_users || 0 }}</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="text-sm font-medium text-gray-600">Total Contacts</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.total_contacts || 0 }}</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="text-sm font-medium text-gray-600">Total Companies</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.total_companies || 0 }}</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="text-sm font-medium text-gray-600">Total Deals</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.total_deals || 0 }}</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="text-sm font-medium text-gray-600">Total Teams</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.total_teams || 0 }}</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="text-sm font-medium text-gray-600">Active Tenants</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.active_tenants || 0 }}</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="text-sm font-medium text-gray-600">Inactive Tenants</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ (stats.total_tenants || 0) - (stats.active_tenants || 0) }}</p>
            </div>
          </div>
        </div>

        <!-- Tenant-specific Statistics -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900">Tenant-specific Statistics</h2>
            <div class="flex items-center space-x-2">
              <select
                v-model="selectedTenantId"
                @change="fetchTenantStats"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-primary-purple"
              >
                <option value="">Select a tenant</option>
                <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
                  {{ tenant.organization_name || tenant.name }}
                </option>
              </select>
            </div>
          </div>

          <div v-if="selectedTenantId && tenantStats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <p class="text-sm font-medium text-blue-600">Users</p>
              <p class="text-3xl font-bold text-blue-900 mt-2">{{ tenantStats.users_count || 0 }}</p>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <p class="text-sm font-medium text-green-600">Contacts</p>
              <p class="text-3xl font-bold text-green-900 mt-2">{{ tenantStats.contacts_count || 0 }}</p>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <p class="text-sm font-medium text-purple-600">Companies</p>
              <p class="text-3xl font-bold text-purple-900 mt-2">{{ tenantStats.companies_count || 0 }}</p>
            </div>
            <div class="text-center p-4 bg-indigo-50 rounded-lg">
              <p class="text-sm font-medium text-indigo-600">Deals</p>
              <p class="text-3xl font-bold text-indigo-900 mt-2">{{ tenantStats.deals_count || 0 }}</p>
            </div>
            <div class="text-center p-4 bg-pink-50 rounded-lg">
              <p class="text-sm font-medium text-pink-600">Teams</p>
              <p class="text-3xl font-bold text-pink-900 mt-2">{{ tenantStats.teams_count || 0 }}</p>
            </div>
          </div>
          <div v-else-if="selectedTenantId && loadingTenantStats" class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-purple"></div>
          </div>
          <div v-else class="text-center py-12 text-gray-500">
            <p>Select a tenant to view detailed statistics</p>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Average Users per Tenant</p>
                <p class="text-2xl font-bold text-gray-900 mt-2">
                  {{ stats.total_tenants > 0 ? Math.round((stats.total_users || 0) / stats.total_tenants) : 0 }}
                </p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Tenant Activity Rate</p>
                <p class="text-2xl font-bold text-gray-900 mt-2">
                  {{ stats.total_tenants > 0 ? Math.round((stats.active_tenants || 0) / stats.total_tenants * 100) : 0 }}%
                </p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Data Points</p>
                <p class="text-2xl font-bold text-gray-900 mt-2">
                  {{ (stats.total_contacts || 0) + (stats.total_companies || 0) + (stats.total_deals || 0) }}
                </p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3v18h18M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { superAdminAPI } from '@/services/api'
import { useNotifications } from '@/composables/useNotifications'

const { error } = useNotifications()

const loading = ref(true)
const loadingTenantStats = ref(false)
const stats = ref({})
const tenants = ref([])
const selectedTenantId = ref('')
const tenantStats = ref(null)

const fetchStats = async () => {
  loading.value = true
  try {
    const response = await superAdminAPI.getStats()
    stats.value = response.data.data || response.data
  } catch (err) {
    console.error('Failed to fetch statistics:', err)
    error('Failed to load statistics. Please try again.')
  } finally {
    loading.value = false
  }
}

const fetchTenants = async () => {
  try {
    const response = await superAdminAPI.getTenants({ per_page: 100 })
    const data = response.data
    tenants.value = data.data || data || []
  } catch (err) {
    console.error('Failed to fetch tenants:', err)
  }
}

const fetchTenantStats = async () => {
  if (!selectedTenantId.value) {
    tenantStats.value = null
    return
  }

  loadingTenantStats.value = true
  try {
    const response = await superAdminAPI.getTenantStats(selectedTenantId.value)
    tenantStats.value = response.data.data || response.data
  } catch (err) {
    console.error('Failed to fetch tenant statistics:', err)
    error('Failed to load tenant statistics. Please try again.')
    tenantStats.value = null
  } finally {
    loadingTenantStats.value = false
  }
}

onMounted(async () => {
  await Promise.all([fetchStats(), fetchTenants()])
})
</script>

