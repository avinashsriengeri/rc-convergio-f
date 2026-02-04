<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Induction & Training Tracking</h1>
        <p class="mt-2 text-lg text-gray-600">Track employee completion and progress</p>
      </div>
      <div class="flex items-center space-x-3">
        <router-link
          :to="{ name: 'HrInductionContents' }"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Content Manager
        </router-link>
        <button
          @click="showReminderModal = true"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          Send Reminder
        </button>
        <button
          @click="exportReport"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink transition-colors shadow-sm"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Report
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-blue-100 rounded-lg p-3">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total</p>
            <p class="text-2xl font-bold text-gray-900">{{ summary.total_assignments }}</p>
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
            <p class="text-2xl font-bold text-gray-900">{{ summary.completed }}</p>
            <p class="text-xs text-gray-500">{{ summary.completion_rate.toFixed(1) }}%</p>
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
            <p class="text-2xl font-bold text-gray-900">{{ summary.pending }}</p>
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
            <p class="text-2xl font-bold text-gray-900">{{ summary.overdue }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Completion Chart -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Overall Completion Rate</h2>
      <div class="flex items-center justify-center">
        <div class="relative w-48 h-48">
          <svg class="transform -rotate-90 w-48 h-48">
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              stroke-width="16"
              fill="transparent"
              class="text-gray-200"
            />
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              stroke-width="16"
              fill="transparent"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="offset"
              class="text-primary-purple transition-all duration-500"
              stroke-linecap="round"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <div class="text-3xl font-bold text-gray-900">{{ summary.completion_rate.toFixed(0) }}%</div>
              <div class="text-sm text-gray-500">Completed</div>
            </div>
          </div>
        </div>
        <div class="ml-8 space-y-3">
          <div class="flex items-center space-x-3">
            <div class="w-4 h-4 rounded-full bg-primary-purple"></div>
            <span class="text-sm text-gray-700">Completed: {{ summary.completed }}</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span class="text-sm text-gray-700">Pending: {{ summary.pending }}</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-4 h-4 rounded-full bg-red-500"></div>
            <span class="text-sm text-gray-700">Overdue: {{ summary.overdue }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Employee Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Employee</label>
          <input
            v-model="employeeSearch"
            type="text"
            placeholder="Search employee..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @input="handleEmployeeSearch"
          />
        </div>

        <!-- Department Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
          <select
            v-model="trackingFilters.department_id"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @change="applyFilters"
          >
            <option :value="null">All Departments</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>

        <!-- Content Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <select
            v-model="trackingFilters.content_id"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @change="applyFilters"
          >
            <option :value="null">All Content</option>
            <option v-for="content in contents" :key="content.id" :value="content.id">
              {{ content.title }}
            </option>
          </select>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="trackingFilters.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @change="applyFilters"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="inductionStore.loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-purple border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading tracking data...</p>
      </div>
    </div>

    <!-- Tracking Table -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Date</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in inductionStore.tracking" :key="item.assignment_id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ item.employee_name }}</div>
                  <div class="text-sm text-gray-500">{{ item.employee_id_code }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ item.department }}
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900">{{ item.content_title }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getCategoryBadgeClass(item.category)" class="px-2 py-1 text-xs font-medium rounded-full">
                {{ getCategoryLabel(item.category) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <StatusBadge :status="item.status" />
              <span v-if="item.is_overdue && item.status !== 'completed'" class="ml-2 text-xs text-red-600 font-medium">
                Overdue
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(item.due_date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ item.completed_at ? formatDate(item.completed_at) : '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <router-link
                :to="`/hr/induction/employees/${item.employee_id}/progress`"
                class="text-primary-purple hover:text-primary-pink transition-colors"
              >
                View Details
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="inductionStore.meta.last_page > 1" class="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Showing {{ (inductionStore.meta.current_page - 1) * inductionStore.meta.per_page + 1 }} to
          {{ Math.min(inductionStore.meta.current_page * inductionStore.meta.per_page, inductionStore.meta.total) }} of
          {{ inductionStore.meta.total }} results
        </div>
        <div class="flex space-x-2">
          <button
            @click="changePage(inductionStore.meta.current_page - 1)"
            :disabled="inductionStore.meta.current_page === 1"
            class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            @click="changePage(inductionStore.meta.current_page + 1)"
            :disabled="inductionStore.meta.current_page === inductionStore.meta.last_page"
            class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Send Reminder Modal -->
    <div
      v-if="showReminderModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="showReminderModal = false"
    >
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Send Reminders</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Reminder Type</label>
                <select
                  v-model="reminderType"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                >
                  <option value="pending">All Pending Assignments</option>
                  <option value="overdue">All Overdue Assignments</option>
                  <option value="content">Specific Content</option>
                  <option value="employee">Specific Employees</option>
                </select>
              </div>
              <div v-if="reminderType === 'content'">
                <label class="block text-sm font-medium text-gray-700 mb-2">Select Content</label>
                <select
                  v-model="reminderContentId"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                >
                  <option :value="null">Select Content</option>
                  <option v-for="content in contents" :key="content.id" :value="content.id">
                    {{ content.title }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Custom Message (Optional)</label>
                <textarea
                  v-model="reminderMessage"
                  rows="3"
                  placeholder="Please complete your mandatory induction content..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="sendReminders"
              :disabled="sendingReminders"
              class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-primary-purple text-base font-medium text-white hover:bg-primary-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              {{ sendingReminders ? 'Sending...' : 'Send Reminders' }}
            </button>
            <button
              @click="showReminderModal = false"
              class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHrInductionStore } from '../store/hrInduction'
import { useHrDepartmentsStore } from '../store/hrDepartments'
import { useAuth } from '@/composables/useAuth'
import StatusBadge from '../components/StatusBadge.vue'
import { success as showSuccess, error as showError } from '@/utils/notifications'

const router = useRouter()
const { user } = useAuth()
const inductionStore = useHrInductionStore()
const departmentsStore = useHrDepartmentsStore()

// Check if user is HR Admin
const isHrAdmin = computed(() => {
  if (!user.value?.roles) return false
  const roles = Array.isArray(user.value.roles) ? user.value.roles : [user.value.roles]
  return roles.some(r => {
    const roleName = typeof r === 'object' ? r.name : r
    return roleName === 'hr_admin' || roleName === 'system_admin'
  })
})

// Redirect employees to their induction page
onMounted(() => {
  if (!isHrAdmin.value) {
    router.replace({ name: 'MyInduction' })
    return
  }
  
  // Load data only if HR Admin
  Promise.all([
    loadTracking(),
    loadDepartments(),
    loadContents()
  ])
})

const employeeSearch = ref('')
const showReminderModal = ref(false)
const reminderType = ref('pending')
const reminderContentId = ref(null)
const reminderMessage = ref('')
const sendingReminders = ref(false)

const summary = computed(() => inductionStore.summary)
const trackingFilters = computed(() => inductionStore.trackingFilters)
const departments = computed(() => departmentsStore.activeDepartments)
const contents = computed(() => inductionStore.contents)

const circumference = computed(() => 2 * Math.PI * 80)
const offset = computed(() => {
  const percentage = summary.value.completion_rate / 100
  return circumference.value * (1 - percentage)
})

const loadTracking = async () => {
  await inductionStore.fetchTracking()
}

const loadDepartments = async () => {
  await departmentsStore.fetchDepartments({ per_page: 100, is_active: true })
}

const loadContents = async () => {
  await inductionStore.fetchContents({ per_page: 100 })
}

const handleEmployeeSearch = () => {
  // This would filter by employee name - backend should handle this
  applyFilters()
}

const applyFilters = () => {
  inductionStore.setTrackingFilters({ ...trackingFilters.value, page: 1 })
  loadTracking()
}

const changePage = (page) => {
  if (page >= 1 && page <= inductionStore.meta.last_page) {
    inductionStore.setTrackingFilters({ page })
    loadTracking()
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

const sendReminders = async () => {
  sendingReminders.value = true
  try {
    let data = {}
    
    if (reminderType.value === 'content' && reminderContentId.value) {
      data.content_id = reminderContentId.value
    } else if (reminderType.value === 'pending') {
      // Backend will handle filtering pending
      data.status = 'pending'
    } else if (reminderType.value === 'overdue') {
      data.overdue = true
    }
    
    if (reminderMessage.value) {
      data.message = reminderMessage.value
    }
    
    const result = await inductionStore.sendReminders(data)
    showSuccess(`Reminders sent to ${result.sentCount} employees`)
    showReminderModal.value = false
    reminderMessage.value = ''
  } catch (err) {
    showError(err.message || 'Failed to send reminders')
  } finally {
    sendingReminders.value = false
  }
}

const exportReport = () => {
  // TODO: Implement export functionality
  showSuccess('Export functionality will be implemented')
}

// onMounted is already handled above with role check
</script>

