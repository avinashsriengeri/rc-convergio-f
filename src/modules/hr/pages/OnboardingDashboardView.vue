<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Onboarding Dashboard</h1>
        <p class="mt-2 text-lg text-gray-600">Track and manage employee onboarding progress</p>
      </div>
      <div class="flex items-center space-x-3">
        <router-link
          to="/hr/onboarding/my-tasks"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          My Tasks
        </router-link>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or email..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="handleSearch"
          />
        </div>

        <!-- Department Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
          <select
            v-model="filters.department_id"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="applyFilters"
          >
            <option value="">All Departments</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>

        <!-- Manager Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Manager</label>
          <select
            v-model="filters.manager_id"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="applyFilters"
          >
            <option value="">All Managers</option>
            <option v-for="manager in managers" :key="manager.id" :value="manager.id">
              {{ manager.full_name }}
            </option>
          </select>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="applyFilters"
          >
            <option value="onboarding">Onboarding</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="onboardingStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div class="h-2 bg-gray-200 rounded w-full"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="onboardingStore.error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-red-800">Error loading onboarding employees</h3>
          <p class="mt-1 text-sm text-red-700">{{ onboardingStore.error }}</p>
        </div>
        <button
          @click="loadOnboardingEmployees"
          class="ml-4 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="onboardingStore.onboardingEmployees.length === 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No onboarding employees</h3>
      <p class="mt-2 text-sm text-gray-500">There are no employees currently in the onboarding process.</p>
    </div>

    <!-- Employee Cards Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <EmployeeCard
        v-for="employee in onboardingStore.onboardingEmployees"
        :key="employee.id"
        :employee="employee"
        :progress-percentage="employee.onboarding_progress ? (employee.onboarding_progress.percentage || 0) : 0"
        :progress-subtitle="employee.onboarding_progress ? `${employee.onboarding_progress.completed_items || 0} of ${employee.onboarding_progress.total_items || 0} items completed` : 'Loading progress...'"
        :progress-color="getProgressColor(employee.onboarding_progress ? (employee.onboarding_progress.percentage || 0) : 0)"
        @view-details="viewEmployeeDetails(employee.id)"
        @send-reminder="sendReminder(employee.id)"
      />
    </div>

    <!-- Pagination -->
    <div v-if="onboardingStore.meta.last_page > 1" class="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6 rounded-lg shadow-sm">
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          @click="changePage(onboardingStore.meta.current_page - 1)"
          :disabled="onboardingStore.meta.current_page === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          @click="changePage(onboardingStore.meta.current_page + 1)"
          :disabled="onboardingStore.meta.current_page === onboardingStore.meta.last_page"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ (onboardingStore.meta.current_page - 1) * onboardingStore.meta.per_page + 1 }}</span>
            to
            <span class="font-medium">{{ Math.min(onboardingStore.meta.current_page * onboardingStore.meta.per_page, onboardingStore.meta.total) }}</span>
            of
            <span class="font-medium">{{ onboardingStore.meta.total }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              @click="changePage(onboardingStore.meta.current_page - 1)"
              :disabled="onboardingStore.meta.current_page === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                page === onboardingStore.meta.current_page
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
            <button
              @click="changePage(onboardingStore.meta.current_page + 1)"
              :disabled="onboardingStore.meta.current_page === onboardingStore.meta.last_page"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHrOnboardingStore } from '../store/hrOnboarding'
import { useHrDepartmentsStore } from '../store/hrDepartments'
import { useHrEmployeesStore } from '../store/hrEmployees'
import EmployeeCard from '../components/EmployeeCard.vue'
import { success as showSuccess, error as showError } from '@/utils/notifications'

const router = useRouter()
const onboardingStore = useHrOnboardingStore()
const departmentsStore = useHrDepartmentsStore()
const employeesStore = useHrEmployeesStore()

// Local state
const searchQuery = ref('')
const departments = ref([])
const managers = ref([])

// Filters
const filters = computed(() => onboardingStore.filters)

// Computed
const visiblePages = computed(() => {
  const current = onboardingStore.meta.current_page
  const last = onboardingStore.meta.last_page
  const pages = []
  
  if (last <= 7) {
    for (let i = 1; i <= last; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(last)
    } else if (current >= last - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = last - 4; i <= last; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(last)
    }
  }
  
  return pages
})

// Methods
const loadOnboardingEmployees = async () => {
  await onboardingStore.fetchOnboardingEmployees()
  
  // Fetch onboarding progress for each employee
  if (onboardingStore.onboardingEmployees.length > 0) {
    await Promise.all(
      onboardingStore.onboardingEmployees.map(async (employee) => {
        try {
          const progress = await onboardingStore.fetchEmployeeOnboardingProgress(employee.id)
          if (progress) {
            // Add progress to employee object
            employee.onboarding_progress = progress
          }
        } catch (err) {
          console.error(`Failed to fetch progress for employee ${employee.id}:`, err)
          // Set default progress if fetch fails
          employee.onboarding_progress = {
            percentage: 0,
            completed_items: 0,
            total_items: 0
          }
        }
      })
    )
  }
}

const loadDepartments = async () => {
  try {
    await departmentsStore.fetchDepartments({ is_active: true, per_page: 100 })
    departments.value = departmentsStore.departments
  } catch (err) {
    console.error('Error loading departments:', err)
  }
}

const loadManagers = async () => {
  try {
    // Load employees who are managers
    await employeesStore.fetchEmployees({ per_page: 100 })
    managers.value = employeesStore.employees.filter(emp => emp.is_manager || emp.manager_id === null)
  } catch (err) {
    console.error('Error loading managers:', err)
  }
}

const handleSearch = () => {
  onboardingStore.setFilters({ search: searchQuery.value, page: 1 })
  loadOnboardingEmployees()
}

const applyFilters = () => {
  onboardingStore.setFilters({ ...filters.value, page: 1 })
  loadOnboardingEmployees()
}

const changePage = (page) => {
  if (typeof page === 'number' && page >= 1 && page <= onboardingStore.meta.last_page) {
    onboardingStore.setFilters({ page })
    loadOnboardingEmployees()
  }
}

const viewEmployeeDetails = (employeeId) => {
  router.push(`/hr/employees/${employeeId}/onboarding`)
}

const sendReminder = async (employeeId) => {
  try {
    await onboardingStore.sendOnboardingReminder(employeeId)
    showSuccess('Reminder sent successfully')
  } catch (err) {
    showError(err.message || 'Failed to send reminder')
  }
}

const getProgressColor = (percentage) => {
  if (percentage >= 80) return 'green'
  if (percentage >= 50) return 'blue'
  if (percentage >= 25) return 'yellow'
  return 'red'
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadOnboardingEmployees(),
    loadDepartments(),
    loadManagers()
  ])
})
</script>

