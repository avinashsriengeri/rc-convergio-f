<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <h1 class="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p class="text-sm text-gray-600 mt-1">System-wide overview and management</p>
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
        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Tenants</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.total_tenants || 0 }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Users</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.total_users || 0 }}</p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Contacts</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.total_contacts || 0 }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Active Tenants</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.active_tenants || 0 }}</p>
              </div>
              <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p class="text-sm font-medium text-gray-600">Total Companies</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.total_companies || 0 }}</p>
          </div>
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p class="text-sm font-medium text-gray-600">Total Deals</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.total_deals || 0 }}</p>
          </div>
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p class="text-sm font-medium text-gray-600">Total Teams</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.total_teams || 0 }}</p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <router-link
              to="/super-admin/tenants"
              class="flex items-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-purple transition-colors"
            >
              <svg class="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/>
              </svg>
              <span class="text-sm font-medium text-gray-700">Manage Tenants</span>
            </router-link>
            <router-link
              to="/super-admin/users"
              class="flex items-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-purple transition-colors"
            >
              <svg class="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span class="text-sm font-medium text-gray-700">Manage Users</span>
            </router-link>
            <router-link
              to="/super-admin/statistics"
              class="flex items-center px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-purple transition-colors"
            >
              <svg class="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3v18h18M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
              </svg>
              <span class="text-sm font-medium text-gray-700">View Statistics</span>
            </router-link>
          </div>
        </div>

        <!-- Recent Tenants -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Recent Tenants</h2>
            <router-link
              to="/super-admin/tenants"
              class="text-sm text-primary-purple hover:text-primary-pink font-medium"
            >
              View All
            </router-link>
          </div>
          <div v-if="recentTenants.length > 0" class="divide-y divide-gray-200">
            <div
              v-for="tenant in recentTenants"
              :key="tenant.id"
              class="px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ tenant.organization_name || tenant.name }}</p>
                  <p class="text-sm text-gray-600 mt-1">{{ tenant.email }}</p>
                </div>
                <div class="flex items-center space-x-4">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                  >
                    {{ tenant.status }}
                  </span>
                  <router-link
                    :to="`/super-admin/tenants/${tenant.id}`"
                    class="text-sm text-primary-purple hover:text-primary-pink font-medium"
                  >
                    View
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="px-6 py-8 text-center text-gray-500">
            <p>No tenants found</p>
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
const stats = ref({})
const recentTenants = ref([])

const fetchDashboardData = async () => {
  loading.value = true
  try {
    const [statsResponse, tenantsResponse] = await Promise.all([
      superAdminAPI.getStats(),
      superAdminAPI.getTenants({ per_page: 5 })
    ])
    
    stats.value = statsResponse.data.data || statsResponse.data
    recentTenants.value = tenantsResponse.data.data || tenantsResponse.data || []
  } catch (err) {
    console.error('Failed to fetch dashboard data:', err)
    error('Failed to load dashboard data. Please try again.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

