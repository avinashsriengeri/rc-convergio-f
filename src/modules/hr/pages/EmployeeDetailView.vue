<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading employee details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-medium text-red-800">Error loading employee</h3>
          <p class="mt-1 text-sm text-red-700">{{ error }}</p>
        </div>
        <button
          @click="loadEmployee"
          class="ml-4 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Employee Details -->
    <div v-else-if="employee" class="space-y-6">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Profile Picture -->
            <div v-if="employee.profile_picture" class="flex-shrink-0">
              <img
                :src="employee.profile_picture.url"
                :alt="employee.full_name"
                class="h-20 w-20 rounded-full object-cover border-4 border-gray-200"
              />
            </div>
            <div v-else class="flex-shrink-0">
              <div class="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200">
                <span class="text-gray-500 text-2xl font-medium">
                  {{ employee.first_name?.[0] }}{{ employee.last_name?.[0] }}
                </span>
              </div>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ employee.full_name }}</h1>
              <p class="mt-2 text-lg text-gray-600">{{ employee.employee_id }}</p>
              <div v-if="employee.department_detail || employee.designation_detail" class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span v-if="employee.department_detail">
                  <span class="font-medium">{{ employee.department_detail.name }}</span>
                  <span v-if="employee.designation_detail"> • </span>
                </span>
                <span v-if="employee.designation_detail" class="font-medium">
                  {{ employee.designation_detail.name }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex space-x-3">
            <button
              @click="showEditModal = true"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              v-if="employee.employment_status === 'onboarding'"
              @click="handleActivate"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Activate
            </button>
          </div>
        </div>
      </div>

      <!-- Employee Information -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Basic Information -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <dl class="space-y-3">
            <div>
              <dt class="text-sm font-medium text-gray-500">Work Email</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ employee.work_email }}</dd>
            </div>
            <div v-if="employee.personal_email">
              <dt class="text-sm font-medium text-gray-500">Personal Email</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ employee.personal_email }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Phone</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ employee.phone_number || 'N/A' }}</dd>
            </div>
            <div v-if="employee.work_phone">
              <dt class="text-sm font-medium text-gray-500">Work Phone</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ employee.work_phone }}</dd>
            </div>
            <div v-if="employee.office_address">
              <dt class="text-sm font-medium text-gray-500">Office Address</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ employee.office_address }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Department</dt>
              <dd class="mt-1 text-sm text-gray-900">
                <span v-if="employee.department_detail" class="font-medium">
                  {{ employee.department_detail.name }}
                  <span class="text-gray-500">({{ employee.department_detail.code }})</span>
                </span>
                <span v-else>{{ employee.department || 'N/A' }}</span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Designation</dt>
              <dd class="mt-1 text-sm text-gray-900">
                <span v-if="employee.designation_detail" class="font-medium">
                  {{ employee.designation_detail.name }}
                  <span class="text-gray-500">({{ employee.designation_detail.code }})</span>
                </span>
                <span v-else>{{ employee.job_title || 'N/A' }}</span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Employment Type</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ employee.employment_type || 'N/A' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Status</dt>
              <dd class="mt-1">
                <span
                  :class="{
                    'bg-green-100 text-green-800': employee.employment_status === 'active',
                    'bg-amber-100 text-amber-800': employee.employment_status === 'onboarding',
                    'bg-blue-100 text-blue-800': employee.employment_status === 'on_leave',
                    'bg-red-100 text-red-800': employee.employment_status === 'suspended',
                    'bg-gray-100 text-gray-800': employee.employment_status === 'offboarded'
                  }"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ employee.employment_status }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Start Date</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ formatDate(employee.start_date) }}</dd>
            </div>
            <div v-if="employee.end_date">
              <dt class="text-sm font-medium text-gray-500">End Date</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ formatDate(employee.end_date) }}</dd>
            </div>
          </dl>
        </div>

        <!-- Manager & Team -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Manager & Team</h2>
          <dl class="space-y-3">
            <div v-if="employee.manager">
              <dt class="text-sm font-medium text-gray-500">Manager</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ employee.manager.full_name }}</dd>
            </div>
            <div v-else>
              <dt class="text-sm font-medium text-gray-500">Manager</dt>
              <dd class="mt-1 text-sm text-gray-500">No Manager Assigned</dd>
            </div>
            <div v-if="employee.team">
              <dt class="text-sm font-medium text-gray-500">Team</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ employee.team.name }}</dd>
            </div>
            <div v-if="employee.user">
              <dt class="text-sm font-medium text-gray-500">User Account</dt>
              <dd class="mt-1 text-sm text-gray-900">
                <span class="font-medium">{{ employee.user.name }}</span>
                <span class="text-gray-500"> ({{ employee.user.email }})</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Personal Information Section -->
      <div v-if="employee.preferred_name || employee.date_of_birth || employee.gender || employee.nationality || employee.marital_status || employee.id_number || employee.passport_number" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
        <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="employee.preferred_name">
            <dt class="text-sm font-medium text-gray-500">Preferred Name</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ employee.preferred_name }}</dd>
          </div>
          <div v-if="employee.date_of_birth">
            <dt class="text-sm font-medium text-gray-500">Date of Birth</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ formatDate(employee.date_of_birth) }}</dd>
          </div>
          <div v-if="employee.gender">
            <dt class="text-sm font-medium text-gray-500">Gender</dt>
            <dd class="mt-1 text-sm text-gray-900 capitalize">{{ employee.gender }}</dd>
          </div>
          <div v-if="employee.nationality">
            <dt class="text-sm font-medium text-gray-500">Nationality</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ employee.nationality }}</dd>
          </div>
          <div v-if="employee.marital_status">
            <dt class="text-sm font-medium text-gray-500">Marital Status</dt>
            <dd class="mt-1 text-sm text-gray-900 capitalize">{{ employee.marital_status }}</dd>
          </div>
          <div v-if="employee.id_number">
            <dt class="text-sm font-medium text-gray-500">ID Number</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ employee.id_number }}</dd>
          </div>
          <div v-if="employee.passport_number">
            <dt class="text-sm font-medium text-gray-500">Passport Number</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ employee.passport_number }}</dd>
          </div>
        </dl>
      </div>

      <!-- Contact Details Section -->
      <div v-if="employee.address || employee.emergency_contact" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Contact Details</h2>
        
        <!-- Home Address -->
        <div v-if="employee.address && (employee.address.street || employee.address.city || employee.address.state || employee.address.zip || employee.address.country)" class="mb-6">
          <h3 class="text-sm font-medium text-gray-700 mb-3">Home Address</h3>
          <div class="text-sm text-gray-900">
            <p v-if="employee.address.street">{{ employee.address.street }}</p>
            <p v-if="employee.address.city || employee.address.state || employee.address.zip">
              <span v-if="employee.address.city">{{ employee.address.city }}</span><span v-if="employee.address.city && employee.address.state">, </span>
              <span v-if="employee.address.state">{{ employee.address.state }}</span>
              <span v-if="employee.address.zip"> {{ employee.address.zip }}</span>
            </p>
            <p v-if="employee.address.country">{{ employee.address.country }}</p>
          </div>
        </div>

        <!-- Emergency Contact -->
        <div v-if="employee.emergency_contact && (employee.emergency_contact.name || employee.emergency_contact.relationship || employee.emergency_contact.phone || employee.emergency_contact.email)">
          <h3 class="text-sm font-medium text-gray-700 mb-3">Emergency Contact</h3>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-if="employee.emergency_contact.name">
              <dt class="text-sm font-medium text-gray-500">Name</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ employee.emergency_contact.name }}</dd>
            </div>
            <div v-if="employee.emergency_contact.relationship">
              <dt class="text-sm font-medium text-gray-500">Relationship</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ employee.emergency_contact.relationship }}</dd>
            </div>
            <div v-if="employee.emergency_contact.phone">
              <dt class="text-sm font-medium text-gray-500">Phone</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ employee.emergency_contact.phone }}</dd>
            </div>
            <div v-if="employee.emergency_contact.email">
              <dt class="text-sm font-medium text-gray-500">Email</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ employee.emergency_contact.email }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Job Information Section -->
      <div v-if="employee.work_schedule || employee.probation_end_date || employee.contract_end_date" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Job Information</h2>
        <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="employee.work_schedule">
            <dt class="text-sm font-medium text-gray-500">Work Schedule</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ employee.work_schedule }}</dd>
          </div>
          <div v-if="employee.probation_end_date">
            <dt class="text-sm font-medium text-gray-500">Probation End Date</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ formatDate(employee.probation_end_date) }}</dd>
          </div>
          <div v-if="employee.contract_end_date">
            <dt class="text-sm font-medium text-gray-500">Contract End Date</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ formatDate(employee.contract_end_date) }}</dd>
          </div>
        </dl>
      </div>

      <!-- Tabs for Leave, Payslips, Documents -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              @click="activeTab = 'leave'"
              :class="activeTab === 'leave' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="px-6 py-4 text-sm font-medium border-b-2 transition-colors"
            >
              Leave
            </button>
            <button
              @click="activeTab = 'payslips'"
              :class="activeTab === 'payslips' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="px-6 py-4 text-sm font-medium border-b-2 transition-colors"
            >
              Payslips
            </button>
            <button
              @click="activeTab = 'documents'"
              :class="activeTab === 'documents' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="px-6 py-4 text-sm font-medium border-b-2 transition-colors"
            >
              Documents
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Leave Tab -->
          <div v-if="activeTab === 'leave'">
            <router-link :to="`/hr/leave?employee_id=${employee.id}`" class="text-blue-600 hover:text-blue-700">
              View Leave Details →
            </router-link>
          </div>

          <!-- Payslips Tab -->
          <div v-if="activeTab === 'payslips'">
            <router-link :to="`/hr/payslips?employee_id=${employee.id}`" class="text-blue-600 hover:text-blue-700">
              View Payslips →
            </router-link>
          </div>

          <!-- Documents Tab -->
          <div v-if="activeTab === 'documents'">
            <router-link :to="`/hr/documents?employee_id=${employee.id}`" class="text-blue-600 hover:text-blue-700">
              View Documents →
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHrEmployeesStore } from '../store/hrEmployees'
import { success as showSuccess, error as showError } from '@/utils/notifications'

const route = useRoute()
const router = useRouter()
const employeesStore = useHrEmployeesStore()

const loading = ref(true)
const error = ref(null)
const employee = ref(null)
const activeTab = ref('leave')
const showEditModal = ref(false)

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const loadEmployee = async () => {
  loading.value = true
  error.value = null

  try {
    const employeeId = route.params.id
    if (!employeeId) {
      throw new Error('Employee ID is required')
    }
    console.log('Loading employee with ID:', employeeId)
    const employeeData = await employeesStore.fetchEmployee(employeeId)
    employee.value = employeeData
  } catch (err) {
    console.error('Error loading employee:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to load employee'
  } finally {
    loading.value = false
  }
}

const handleActivate = async () => {
  try {
    await employeesStore.activateEmployee(route.params.id)
    showSuccess('Employee activated successfully')
    await loadEmployee()
  } catch (err) {
    showError(err.message || 'Failed to activate employee')
  }
}

onMounted(() => {
  loadEmployee()
})
</script>

