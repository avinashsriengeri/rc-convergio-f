<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">HR Dashboard</h1>
      <p class="text-lg text-gray-600">Overview of your HR metrics and activities</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-purple border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-red-800">Error loading dashboard</h3>
          <p class="mt-1 text-sm text-red-700">{{ error }}</p>
        </div>
        <button
          @click="loadDashboard"
          class="ml-4 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else-if="dashboardData" class="space-y-10">
      <!-- HR Admin Dashboard -->
      <div v-if="userRole === 'hr_admin' || userRole === 'system_admin'">
        <!-- Headcount Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="bg-white rounded-xl shadow-md border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between mb-5">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600 mb-2">Total Employees</p>
                <p class="text-3xl font-bold text-gray-900">{{ dashboardData.headcount?.total || 0 }}</p>
              </div>
              <div class="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg ml-4">
                <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div class="pt-5 border-t border-gray-100 mt-5">
              <p class="text-xs text-gray-500">All employees in system</p>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-md border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between mb-5">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600 mb-2">Active</p>
                <p class="text-3xl font-bold text-gray-900">{{ dashboardData.headcount?.active || 0 }}</p>
              </div>
              <div class="h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg ml-4">
                <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="pt-5 border-t border-gray-100 mt-5">
              <p class="text-xs text-gray-500">Currently active employees</p>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-md border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between mb-5">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600 mb-2">Onboarding</p>
                <p class="text-3xl font-bold text-gray-900">{{ dashboardData.headcount?.onboarding || 0 }}</p>
              </div>
              <div class="h-16 w-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg ml-4">
                <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="pt-5 border-t border-gray-100 mt-5">
              <p class="text-xs text-gray-500">In onboarding process</p>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-md border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between mb-5">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600 mb-2">Offboarded (This Month)</p>
                <p class="text-3xl font-bold text-gray-900">{{ dashboardData.headcount?.offboarded_this_month || 0 }}</p>
              </div>
              <div class="h-16 w-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg ml-4">
                <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
            </div>
            <div class="pt-5 border-t border-gray-100 mt-5">
              <p class="text-xs text-gray-500">Offboarded this month</p>
            </div>
          </div>
        </div>

        <!-- Leave Utilization -->
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 mt-10">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Leave Utilization</h2>
              <p class="text-sm text-gray-500 mt-1">Monthly leave statistics</p>
            </div>
            <div class="h-12 w-12 bg-gradient-to-br from-primary-purple to-primary-pink rounded-xl flex items-center justify-center shadow-lg">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8 border border-blue-200">
              <p class="text-sm font-medium text-blue-700 mb-3">Total Days Used (This Month)</p>
              <p class="text-3xl font-bold text-blue-900">{{ dashboardData.leave_utilization?.total_days_used_this_month || 0 }}</p>
              <p class="text-xs text-blue-600 mt-3">Days</p>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-8 border border-purple-200">
              <p class="text-sm font-medium text-purple-700 mb-3">Average per Employee</p>
              <p class="text-3xl font-bold text-purple-900">{{ (dashboardData.leave_utilization?.average_per_employee || 0).toFixed(2) }}</p>
              <p class="text-xs text-purple-600 mt-3">Days per employee</p>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div v-if="dashboardData.recent_activity" class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          <!-- New Hires -->
          <div class="bg-white rounded-xl shadow-md border border-gray-200 p-8 hover:shadow-lg transition-all duration-300">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-bold text-gray-900">New Hires</h3>
              <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
            <div v-if="dashboardData.recent_activity.new_hires?.length" class="space-y-4 mt-6">
              <div v-for="hire in dashboardData.recent_activity.new_hires" :key="hire.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-900">{{ hire.name }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ hire.department }}</p>
                </div>
                <span class="text-xs font-medium text-gray-600 bg-white px-3 py-1 rounded-full">{{ formatDate(hire.start_date) }}</span>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <p class="mt-3 text-sm text-gray-500">No new hires</p>
            </div>
          </div>

          <!-- Offboarded -->
          <div class="bg-white rounded-xl shadow-md border border-gray-200 p-8 hover:shadow-lg transition-all duration-300">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-bold text-gray-900">Recently Offboarded</h3>
              <div class="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg class="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
            </div>
            <div v-if="dashboardData.recent_activity.offboarded?.length" class="space-y-4 mt-6">
              <div v-for="offboard in dashboardData.recent_activity.offboarded" :key="offboard.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-900">{{ offboard.name }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ offboard.employee_id }}</p>
                </div>
                <span class="text-xs font-medium text-gray-600 bg-white px-3 py-1 rounded-full">{{ formatDate(offboard.archived_at) }}</span>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <p class="mt-3 text-sm text-gray-500">No recent offboardings</p>
            </div>
          </div>

          <!-- Recent Leave -->
          <div class="bg-white rounded-xl shadow-md border border-gray-200 p-8 hover:shadow-lg transition-all duration-300">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-bold text-gray-900">Recent Leave</h3>
              <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div v-if="dashboardData.recent_activity.recent_leave?.length" class="space-y-4 mt-6">
              <div v-for="leave in dashboardData.recent_activity.recent_leave" :key="leave.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-900">{{ leave.employee }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ leave.days }} days</p>
                </div>
                <span class="text-xs font-medium text-gray-600 bg-white px-3 py-1 rounded-full">{{ formatDate(leave.start_date) }}</span>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p class="mt-3 text-sm text-gray-500">No recent leave</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Manager Dashboard -->
      <div v-else-if="userRole === 'line_manager'">
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-8 hover:shadow-lg transition-all duration-300">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Team Overview</h2>
              <p class="text-sm text-gray-500 mt-1">Manage your team</p>
            </div>
            <div class="h-12 w-12 bg-gradient-to-br from-primary-purple to-primary-pink rounded-xl flex items-center justify-center shadow-lg">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <p class="text-sm font-medium text-blue-700 mb-2">Team Size</p>
            <p class="text-3xl font-bold text-blue-900">{{ dashboardData.team?.size || 0 }}</p>
            <p class="text-xs text-blue-600 mt-2">Team members</p>
          </div>
          <!-- Team members and leave calendar would go here -->
        </div>
      </div>

      <!-- Employee Dashboard -->
      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Leave Balance -->
          <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-bold text-gray-900">Leave Balance</h2>
              <div class="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div v-if="dashboardData.leave_balance?.length" class="space-y-3">
              <div v-for="balance in dashboardData.leave_balance" :key="balance.leave_type" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span class="text-sm font-semibold text-gray-700">{{ balance.leave_type }}</span>
                <span class="text-sm font-bold text-gray-900 bg-white px-4 py-2 rounded-lg">{{ balance.balance }} days</span>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p class="mt-3 text-sm text-gray-500">No leave balance data</p>
            </div>
          </div>

          <!-- Recent Payslips -->
          <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-bold text-gray-900">Recent Payslips</h2>
              <div class="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div v-if="dashboardData.documents?.recent_payslips?.length" class="space-y-3">
              <div v-for="payslip in dashboardData.documents.recent_payslips" :key="payslip.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-900">{{ payslip.payslip_number }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ formatDate(payslip.pay_period_start) }} - {{ formatDate(payslip.pay_period_end) }}</p>
                </div>
                <router-link
                  :to="`/hr/payslips`"
                  class="text-sm font-medium text-primary-purple hover:text-primary-pink transition-colors"
                >
                  View →
                </router-link>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="mt-3 text-sm text-gray-500">No payslips available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { hrAPI } from '../api/hrAPI'
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()
const loading = ref(true)
const error = ref(null)
const dashboardData = ref(null)

const userRole = ref('employee') // Default role, should be fetched from user data

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const loadDashboard = async () => {
  loading.value = true
  error.value = null

  try {
    // Determine which dashboard to load based on user role
    // This should be determined from user data or permissions
    let response
    
    if (userRole.value === 'hr_admin' || userRole.value === 'system_admin') {
      response = await hrAPI.getHrAdminDashboard()
    } else if (userRole.value === 'line_manager') {
      response = await hrAPI.getManagerDashboard()
    } else {
      response = await hrAPI.getEmployeeDashboard()
    }

    if (response.data.success) {
      dashboardData.value = response.data.data
    } else {
      throw new Error(response.data.message || 'Failed to load dashboard')
    }
  } catch (err) {
    console.error('Error loading dashboard:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to load dashboard'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Determine user role from user data
  if (user.value?.roles) {
    const roles = Array.isArray(user.value.roles) ? user.value.roles : [user.value.roles]
    if (roles.includes('hr_admin') || roles.includes('system_admin')) {
      userRole.value = 'hr_admin'
    } else if (roles.includes('line_manager')) {
      userRole.value = 'line_manager'
    }
  }
  
  loadDashboard()
})
</script>


