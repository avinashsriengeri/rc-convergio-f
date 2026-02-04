<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header with Breadcrumbs and Actions -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Breadcrumb Navigation -->
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-4">
              <li>
                <div class="flex items-center">
                  <router-link to="/dashboard" class="text-gray-400 hover:text-gray-500">
                    <svg class="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span class="sr-only">Home</span>
                  </router-link>
                </div>
              </li>
              <li>
                <div class="flex items-center">
                  <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                  <router-link to="/hr" class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">HR</router-link>
                </div>
              </li>
              <li v-if="currentPageName">
                <div class="flex items-center">
                  <svg class="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="ml-4 text-sm font-medium text-gray-900">{{ currentPageName }}</span>
                </div>
              </li>
            </ol>
          </nav>
          
          <!-- Action Buttons -->
          <div class="flex items-center space-x-4">
            <!-- Refresh button -->
            <button
              @click="refreshData"
              class="p-2 text-gray-400 hover:text-gray-500 transition-colors"
              title="Refresh data"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHrEmployeesStore } from '../store/hrEmployees'

// Router
const router = useRouter()
const route = useRoute()

// Computed - Current page name for breadcrumb
const currentPageName = computed(() => {
  const path = route.path
  
  // Check for specific paths first (more specific to less specific)
  if (path.match(/\/hr\/employees\/\d+/) || route.params.id) {
    return `Employee Details`
  }
  if (path === '/hr/employees' || path === '/hr/employees/') {
    return 'Employees'
  }
  if (path === '/hr/leave' || path === '/hr/leave/') {
    return 'Leave Management'
  }
  if (path === '/hr/payslips' || path === '/hr/payslips/') {
    return 'Payslips'
  }
  if (path === '/hr/documents' || path === '/hr/documents/') {
    return 'Documents'
  }
  if (path === '/hr/document-types' || path === '/hr/document-types/') {
    return 'Document Types'
  }
  if (path === '/hr/my-documents' || path === '/hr/my-documents/') {
    return 'My Documents'
  }
  if (path === '/hr/departments' || path === '/hr/departments/') {
    return 'Departments'
  }
  if (path === '/hr/designations' || path === '/hr/designations/') {
    return 'Designations'
  }
  if (path === '/hr/onboarding' || path === '/hr/onboarding/') {
    return 'Onboarding'
  }
  if (path.match(/\/hr\/onboarding\/my-tasks/)) {
    return 'My Onboarding Tasks'
  }
  if (path.match(/\/hr\/employees\/\d+\/onboarding/)) {
    return 'Employee Onboarding'
  }
  if (path === '/hr/onboarding/templates' || path === '/hr/onboarding/templates/') {
    return 'Onboarding Templates'
  }
  if (path === '/hr/induction/contents' || path === '/hr/induction/contents/') {
    return 'Induction & Training'
  }
  if (path === '/hr/induction/tracking' || path === '/hr/induction/tracking/') {
    return 'Induction Tracking'
  }
  if (path.match(/\/hr\/induction\/employees\/\d+\/progress/)) {
    return 'Employee Induction Progress'
  }
  if (path === '/hr/induction/my-training' || path === '/hr/induction/my-training/') {
    return 'My Induction & Training'
  }
  if (path === '/hr' || path === '/hr/') {
    return 'Dashboard'
  }
  
  // Fallback for any other HR sub-paths
  if (path.startsWith('/hr/')) {
    const parts = path.split('/').filter(Boolean)
    if (parts.length > 1) {
      const pageName = parts[parts.length - 1]
      return pageName.charAt(0).toUpperCase() + pageName.slice(1).replaceAll('-', ' ')
    }
  }
  
  return null
})

// Store
const employeesStore = useHrEmployeesStore()

// Methods
const refreshData = () => {
  // Refresh employees if on employees page
  if (route.path.includes('/employees')) {
    employeesStore.fetchEmployees()
  }
}

// Lifecycle
onMounted(() => {
  // Initial setup if needed
})
</script>

