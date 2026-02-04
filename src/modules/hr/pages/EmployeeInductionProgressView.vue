<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Employee Induction Progress</h1>
        <p class="mt-2 text-lg text-gray-600">View detailed induction progress for {{ employeeName }}</p>
      </div>
      <button
        @click="$router.back()"
        class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>
    </div>

    <!-- Employee Info Card -->
    <div v-if="employeeProgress" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center space-x-4">
        <div class="flex-shrink-0">
          <div class="w-16 h-16 bg-primary-purple rounded-full flex items-center justify-center text-white text-xl font-bold">
            {{ employeeProgress.employee_name?.charAt(0) || 'E' }}
          </div>
        </div>
        <div class="flex-1">
          <h2 class="text-xl font-semibold text-gray-900">{{ employeeProgress.employee_name }}</h2>
          <p class="text-sm text-gray-500">{{ employeeProgress.employee_id_code }}</p>
          <p class="text-sm text-gray-600 mt-1">{{ employeeProgress.department }}</p>
        </div>
      </div>
    </div>

    <!-- Progress Summary -->
    <div v-if="employeeProgress" class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-blue-100 rounded-lg p-3">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total</p>
            <p class="text-2xl font-bold text-gray-900">{{ employeeProgress.progress?.total || 0 }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-green-100 rounded-lg p-3">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Completed</p>
            <p class="text-2xl font-bold text-gray-900">{{ employeeProgress.progress?.completed || 0 }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Pending</p>
            <p class="text-2xl font-bold text-gray-900">{{ employeeProgress.progress?.pending || 0 }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-red-100 rounded-lg p-3">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Overdue</p>
            <p class="text-2xl font-bold text-gray-900">{{ employeeProgress.progress?.overdue || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div v-if="employeeProgress" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Overall Progress</h2>
        <div class="text-right">
          <div class="text-3xl font-bold text-primary-purple">{{ employeeProgress.progress?.percentage || 0 }}%</div>
        </div>
      </div>
      <ProgressBar
        :percentage="employeeProgress.progress?.percentage || 0"
        :subtitle="`${employeeProgress.progress?.completed || 0} of ${employeeProgress.progress?.total || 0} items completed`"
        :color="getProgressColor(employeeProgress.progress?.percentage || 0)"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-purple border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading progress...</p>
      </div>
    </div>

    <!-- Items Table -->
    <div v-else-if="employeeProgress && employeeProgress.items" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Date</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in employeeProgress.items" :key="item.assignment_id || item.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">{{ item.content_title || item.title }}</div>
              <div v-if="item.is_mandatory" class="text-xs text-red-600 font-medium mt-1">Mandatory</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getCategoryBadgeClass(item.category)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ getCategoryLabel(item.category) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <StatusBadge :status="item.status" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(item.due_date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ item.completed_at ? formatDate(item.completed_at) : '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="viewDetails(item)"
                class="text-primary-purple hover:text-primary-pink transition-colors"
              >
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHrInductionStore } from '../store/hrInduction'
import { useAuth } from '@/composables/useAuth'
import ProgressBar from '../components/ProgressBar.vue'
import StatusBadge from '../components/StatusBadge.vue'
import { error as showError } from '@/utils/notifications'

const route = useRoute()
const router = useRouter()
const { user } = useAuth()
const inductionStore = useHrInductionStore()

// Check if user is HR Admin
const isHrAdmin = computed(() => {
  if (!user.value?.roles) return false
  const roles = Array.isArray(user.value.roles) ? user.value.roles : [user.value.roles]
  return roles.some(r => {
    const roleName = typeof r === 'object' ? r.name : r
    return roleName === 'hr_admin' || roleName === 'system_admin'
  })
})

// Redirect employees to their own induction page if trying to view another employee
onMounted(() => {
  if (!isHrAdmin.value) {
    // Employees can only view their own progress
    const employeeId = parseInt(route.params.id)
    if (user.value?.id && employeeId !== user.value.id) {
      router.replace({ name: 'MyInduction' })
    }
  }
})

// route, router, and inductionStore are already declared above

const loading = ref(false)
const employeeProgress = ref(null)

const employeeName = computed(() => employeeProgress.value?.employee_name || 'Employee')
const employeeId = computed(() => route.params.id)

const loadEmployeeProgress = async () => {
  loading.value = true
  try {
    employeeProgress.value = await inductionStore.fetchEmployeeProgress(employeeId.value)
  } catch (err) {
    showError(err.message || 'Failed to load employee progress')
  } finally {
    loading.value = false
  }
}

const getCategoryLabel = (category) => {
  const labels = {
    induction: 'Induction',
    policy: 'Policy',
    training: 'Training'
  }
  return labels[category] || category
}

const getCategoryBadgeClass = (category) => {
  const classes = {
    induction: 'bg-blue-100 text-blue-800',
    policy: 'bg-purple-100 text-purple-800',
    training: 'bg-green-100 text-green-800'
  }
  return classes[category] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const getProgressColor = (percentage) => {
  if (percentage >= 80) return 'green'
  if (percentage >= 50) return 'blue'
  if (percentage >= 25) return 'yellow'
  return 'red'
}

const viewDetails = (item) => {
  // Could open a modal or navigate to content viewer
  console.log('View details for:', item)
}

onMounted(() => {
  // Role check is already done above in onMounted
  if (isHrAdmin.value || (user.value?.id && employeeId.value === user.value.id)) {
    loadEmployeeProgress()
  }
})
</script>

