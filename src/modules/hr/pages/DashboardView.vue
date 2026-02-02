<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">HR Dashboard</h1>
      <p class="mt-2 text-lg text-gray-600">Overview of your HR metrics and activities</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
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
          class="ml-4 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else-if="dashboardData" class="space-y-6">
      <!-- HR Admin Dashboard -->
      <div v-if="userRole === 'hr_admin' || userRole === 'system_admin'">
        <!-- Headcount Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Employees</p>
                <p class="text-3xl font-bold text-gray-900">{{ dashboardData.headcount?.total || 0 }}</p>
              </div>
              <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Active</p>
                <p class="text-3xl font-bold text-gray-900">{{ dashboardData.headcount?.active || 0 }}</p>
              </div>
              <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Onboarding</p>
                <p class="text-3xl font-bold text-gray-900">{{ dashboardData.headcount?.onboarding || 0 }}</p>
              </div>
              <div class="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Offboarded (This Month)</p>
                <p class="text-3xl font-bold text-gray-900">{{ dashboardData.headcount?.offboarded_this_month || 0 }}</p>
              </div>
              <div class="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Leave Utilization -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Leave Utilization</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Days Used (This Month)</p>
              <p class="text-2xl font-bold text-gray-900">{{ dashboardData.leave_utilization?.total_days_used_this_month || 0 }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Average per Employee</p>
              <p class="text-2xl font-bold text-gray-900">{{ (dashboardData.leave_utilization?.average_per_employee || 0).toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div v-if="dashboardData.recent_activity" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- New Hires -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">New Hires</h3>
            <div v-if="dashboardData.recent_activity.new_hires?.length" class="space-y-3">
              <div v-for="hire in dashboardData.recent_activity.new_hires" :key="hire.id" class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ hire.name }}</p>
                  <p class="text-xs text-gray-500">{{ hire.department }}</p>
                </div>
                <span class="text-xs text-gray-500">{{ formatDate(hire.start_date) }}</span>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500">No new hires</p>
          </div>

          <!-- Offboarded -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Recently Offboarded</h3>
            <div v-if="dashboardData.recent_activity.offboarded?.length" class="space-y-3">
              <div v-for="offboard in dashboardData.recent_activity.offboarded" :key="offboard.id" class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ offboard.name }}</p>
                  <p class="text-xs text-gray-500">{{ offboard.employee_id }}</p>
                </div>
                <span class="text-xs text-gray-500">{{ formatDate(offboard.archived_at) }}</span>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500">No recent offboardings</p>
          </div>

          <!-- Recent Leave -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-4">Recent Leave</h3>
            <div v-if="dashboardData.recent_activity.recent_leave?.length" class="space-y-3">
              <div v-for="leave in dashboardData.recent_activity.recent_leave" :key="leave.id" class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ leave.employee }}</p>
                  <p class="text-xs text-gray-500">{{ leave.days }} days</p>
                </div>
                <span class="text-xs text-gray-500">{{ formatDate(leave.start_date) }}</span>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500">No recent leave</p>
          </div>
        </div>
      </div>

      <!-- Manager Dashboard -->
      <div v-else-if="userRole === 'line_manager'">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Team Overview</h2>
          <p class="text-sm text-gray-600">Team size: {{ dashboardData.team?.size || 0 }}</p>
          <!-- Team members and leave calendar would go here -->
        </div>
      </div>

      <!-- Employee Dashboard -->
      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Leave Balance -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Leave Balance</h2>
            <div v-if="dashboardData.leave_balance?.length" class="space-y-3">
              <div v-for="balance in dashboardData.leave_balance" :key="balance.leave_type" class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">{{ balance.leave_type }}</span>
                <span class="text-sm font-bold text-gray-900">{{ balance.balance }} days</span>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500">No leave balance data</p>
          </div>

          <!-- Recent Payslips -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Payslips</h2>
            <div v-if="dashboardData.documents?.recent_payslips?.length" class="space-y-3">
              <div v-for="payslip in dashboardData.documents.recent_payslips" :key="payslip.id" class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ payslip.payslip_number }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(payslip.pay_period_start) }} - {{ formatDate(payslip.pay_period_end) }}</p>
                </div>
                <router-link
                  :to="`/hr/payslips`"
                  class="text-sm text-blue-600 hover:text-blue-700"
                >
                  View
                </router-link>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500">No payslips available</p>
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

