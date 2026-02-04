<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">KPI Analytics Dashboard</h1>
        <p class="mt-2 text-lg text-gray-600">Performance metrics and insights</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="exportPDF"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export PDF
        </button>
        <button
          @click="exportExcel"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Excel
        </button>
        <button
          @click="sendReminder"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink transition-all shadow-sm hover:shadow-md"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          Send Reminder
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-md border border-gray-200 p-5">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Review Period</label>
          <input
            v-model="filters.review_period_value"
            type="text"
            placeholder="e.g. Q1 2026"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @input="handleFilterChange"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
          <select
            v-model="filters.department_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @change="handleFilterChange"
          >
            <option :value="null">All</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Manager</label>
          <select
            v-model="filters.manager_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @change="handleFilterChange"
          >
            <option :value="null">All</option>
            <!-- Managers would be loaded from API -->
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @change="handleFilterChange"
          >
            <option value="">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div v-if="analytics" class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-blue-100 rounded-xl p-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Employees</p>
            <p class="text-2xl font-bold text-gray-900">{{ analytics.total_employees || 0 }}</p>
            <p class="text-xs text-gray-500 mt-1">— No change from last month</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-green-100 rounded-xl p-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Completed Reviews</p>
            <p class="text-2xl font-bold text-gray-900">{{ analytics.completed_reviews || 0 }}</p>
            <p class="text-xs text-green-600 mt-1">↗ {{ analytics.completion_rate?.toFixed(1) || 0 }}% Completion Rate</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-yellow-100 rounded-xl p-4">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Pending Reviews</p>
            <p class="text-2xl font-bold text-gray-900">{{ analytics.pending_reviews || 0 }}</p>
            <p class="text-xs text-yellow-600 mt-1">↘ {{ ((analytics.pending_reviews / analytics.total_employees) * 100).toFixed(1) || 0 }}% Remaining</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-purple-100 rounded-xl p-4">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Average Score</p>
            <p class="text-2xl font-bold text-gray-900">{{ analytics.average_score?.toFixed(1) || 0 }}</p>
            <p class="text-xs text-gray-500 mt-1">Scale: 0 - 10</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div v-if="analytics" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Review Status Chart -->
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Review Status</h3>
        <div class="flex items-center justify-center h-64">
          <div class="text-center">
            <div class="relative w-48 h-48 mx-auto mb-4">
              <!-- Simplified donut chart representation -->
              <div class="absolute inset-0 rounded-full border-8 border-green-500" style="clip-path: polygon(0 0, 100% 0, 100% 72%, 0 72%)"></div>
              <div class="absolute inset-0 rounded-full border-8 border-orange-500" style="clip-path: polygon(0 72%, 100% 72%, 100% 100%, 0 100%)"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <p class="text-3xl font-bold text-gray-900">{{ analytics.completion_rate?.toFixed(0) || 0 }}%</p>
                  <p class="text-sm text-gray-500">Completed</p>
                </div>
              </div>
            </div>
            <div class="flex justify-center gap-4 text-sm">
              <div class="flex items-center">
                <span class="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                <span>Completed ({{ analytics.completed_reviews || 0 }})</span>
              </div>
              <div class="flex items-center">
                <span class="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                <span>Pending ({{ analytics.pending_reviews || 0 }})</span>
              </div>
              <div v-if="analytics.overdue_reviews > 0" class="flex items-center">
                <span class="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                <span>Overdue ({{ analytics.overdue_reviews || 0 }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Average Score by Department -->
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Average Score by Department</h3>
        <div class="space-y-4">
          <div v-for="dept in analytics.by_department" :key="dept.department" class="flex items-center">
            <div class="w-24 text-sm text-gray-600">{{ dept.department }}</div>
            <div class="flex-1 mx-4">
              <div class="w-full bg-gray-200 rounded-full h-6">
                <div
                  class="h-6 rounded-full bg-primary-purple flex items-center justify-end pr-2"
                  :style="{ width: `${(dept.average_score / 10) * 100}%` }"
                >
                  <span class="text-xs font-medium text-white">{{ dept.average_score.toFixed(1) }}</span>
                </div>
              </div>
            </div>
            <div class="w-16 text-sm text-gray-600 text-right">{{ dept.count }} employees</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="analyticsStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-purple border-t-transparent mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading analytics...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!analytics" class="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
      <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <h3 class="mt-6 text-lg font-semibold text-gray-900">No analytics data available</h3>
      <p class="mt-2 text-sm text-gray-500">Analytics will appear here once KPI assignments are created and reviews are completed.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useHrKpiAnalyticsStore } from '../store/hrKpiAnalytics'
import { useHrDepartmentsStore } from '../store/hrDepartments'
import { success as showSuccess, error as showError } from '@/utils/notifications'

const analyticsStore = useHrKpiAnalyticsStore()
const departmentsStore = useHrDepartmentsStore()

const filters = ref({
  review_period_value: '',
  department_id: null,
  manager_id: null,
  status: ''
})

const analytics = computed(() => analyticsStore.analytics)
const departments = computed(() => departmentsStore.activeDepartments)

const handleFilterChange = () => {
  loadAnalytics()
}

const loadAnalytics = async () => {
  try {
    const params = {}
    if (filters.value.review_period_value) params.review_period_value = filters.value.review_period_value
    if (filters.value.department_id) params.department_id = filters.value.department_id
    if (filters.value.manager_id) params.manager_id = filters.value.manager_id
    if (filters.value.status) params.status = filters.value.status
    
    await analyticsStore.fetchAnalytics(params)
  } catch (err) {
    showError(err.message || 'Failed to load analytics')
  }
}

const exportPDF = () => {
  showSuccess('PDF export functionality will be implemented')
}

const exportExcel = () => {
  showSuccess('Excel export functionality will be implemented')
}

const sendReminder = () => {
  showSuccess('Reminder functionality will be implemented')
}

onMounted(async () => {
  await Promise.all([
    loadAnalytics(),
    departmentsStore.fetchDepartments({ per_page: 100, is_active: true })
  ])
})
</script>

