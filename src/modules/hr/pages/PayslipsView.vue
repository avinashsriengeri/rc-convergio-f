<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Payslips</h1>
        <p class="mt-2 text-lg text-gray-600">View and manage employee payslips</p>
      </div>
      <button
        v-if="canUpload"
        @click="showUploadModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Upload Payslip
      </button>
    </div>

    <!-- Payslips List -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 class="text-lg font-semibold text-gray-900">Payslip History</h2>
      </div>
      <div class="p-6">
        <div v-if="payslipsStore.loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading payslips...</p>
        </div>
        <div v-else-if="payslipsStore.payslips.length" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payslip Number</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pay Period</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="payslip in payslipsStore.payslips" :key="payslip.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ payslip.payslip_number }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ payslip.employee?.full_name || 'N/A' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(payslip.pay_period_start) }} - {{ formatDate(payslip.pay_period_end) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(payslip.uploaded_at) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="handleDownload(payslip.id)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Download
                  </button>
                  <button
                    v-if="canUpload"
                    @click="handleDelete(payslip.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-center py-12 text-sm text-gray-500">No payslips found</p>
      </div>
    </div>

    <!-- Upload Payslip Modal -->
    <div
      v-if="showUploadModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="showUploadModal = false"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white"
        @click.stop
      >
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Upload Payslip</h3>
            <button
              @click="showUploadModal = false"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="handleUpload">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Employee *</label>
                <select
                  v-model="newPayslip.employee_id"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select employee</option>
                  <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                    {{ emp.full_name }} ({{ emp.employee_id }})
                  </option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Pay Period Start *</label>
                  <input
                    v-model="newPayslip.pay_period_start"
                    type="date"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Pay Period End *</label>
                  <input
                    v-model="newPayslip.pay_period_end"
                    type="date"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Payslip File (PDF) *</label>
                <input
                  ref="fileInput"
                  type="file"
                  accept=".pdf"
                  required
                  @change="handleFileSelect"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                @click="showUploadModal = false"
                class="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="uploading"
                class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {{ uploading ? 'Uploading...' : 'Upload Payslip' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHrPayslipsStore } from '../store/hrPayslips'
import { useHrEmployeesStore } from '../store/hrEmployees'
import { useAuth } from '@/composables/useAuth'
import { success as showSuccess, error as showError } from '@/utils/notifications'

const route = useRoute()
const payslipsStore = useHrPayslipsStore()
const employeesStore = useHrEmployeesStore()
const { user } = useAuth()

const showUploadModal = ref(false)
const uploading = ref(false)
const fileInput = ref(null)
const employees = ref([])

const newPayslip = ref({
  employee_id: null,
  pay_period_start: '',
  pay_period_end: '',
  file: null
})

const canUpload = computed(() => {
  // Only HR Admin and System Admin can upload
  if (!user.value?.roles) return false
  const roles = Array.isArray(user.value.roles) ? user.value.roles : [user.value.roles]
  return roles.includes('hr_admin') || roles.includes('system_admin')
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    newPayslip.value.file = file
  }
}

const loadData = async () => {
  const employeeId = route.query.employee_id || null
  
  if (employeeId) {
    await payslipsStore.fetchEmployeePayslips(employeeId)
  } else {
    await payslipsStore.fetchPayslips()
  }

  // Load employees for dropdown (if can upload)
  if (canUpload.value) {
    await employeesStore.fetchEmployees({ per_page: 100 })
    employees.value = employeesStore.employees
  }
}

const handleUpload = async () => {
  uploading.value = true
  
  try {
    await payslipsStore.uploadPayslip({
      employee_id: newPayslip.value.employee_id,
      pay_period_start: newPayslip.value.pay_period_start,
      pay_period_end: newPayslip.value.pay_period_end,
      file: newPayslip.value.file
    })
    
    showSuccess('Payslip uploaded successfully')
    showUploadModal.value = false
    
    // Reset form
    newPayslip.value = {
      employee_id: null,
      pay_period_start: '',
      pay_period_end: '',
      file: null
    }
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    
    // Reload data
    await loadData()
  } catch (err) {
    showError(err.message || 'Failed to upload payslip')
  } finally {
    uploading.value = false
  }
}

const handleDownload = async (payslipId) => {
  try {
    await payslipsStore.downloadPayslip(payslipId)
    showSuccess('Payslip downloaded successfully')
  } catch (err) {
    showError(err.message || 'Failed to download payslip')
  }
}

const handleDelete = async (payslipId) => {
  if (!confirm('Are you sure you want to delete this payslip?')) {
    return
  }

  try {
    await payslipsStore.deletePayslip(payslipId)
    showSuccess('Payslip deleted successfully')
    await loadData()
  } catch (err) {
    showError(err.message || 'Failed to delete payslip')
  }
}

onMounted(() => {
  loadData()
})
</script>

