<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Documents</h1>
        <p class="mt-2 text-lg text-gray-600">Manage employee documents</p>
      </div>
      <button
        v-if="canUpload && selectedEmployeeId"
        @click="showUploadModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Upload Document
      </button>
    </div>

    <!-- Employee Selector (if no employee_id in query) -->
    <div v-if="!selectedEmployeeId" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
      <select
        v-model="selectedEmployeeId"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        @change="loadDocuments"
      >
        <option value="">Select an employee</option>
        <option v-for="emp in employees" :key="emp.id" :value="emp.id">
          {{ emp.full_name }} ({{ emp.employee_id }})
        </option>
      </select>
    </div>

    <!-- Documents List -->
    <div v-if="selectedEmployeeId" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 class="text-lg font-semibold text-gray-900">Employee Documents</h2>
      </div>
      <div class="p-6">
        <div v-if="documentsStore.loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading documents...</p>
        </div>
        <div v-else-if="documentsStore.documents.length" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="document in documentsStore.documents" :key="document.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ document.title }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {{ document.category }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <StatusBadge 
                    v-if="document.verification_status" 
                    :status="document.verification_status === 'pending' ? 'pending' : document.verification_status"
                    :show-dot="true"
                  />
                  <span v-else class="text-gray-400 text-xs">N/A</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ document.file_type }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatFileSize(document.file_size) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(document.created_at) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="handleDownload(document.id)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Download
                  </button>
                  <button
                    v-if="canUpload"
                    @click="handleDelete(document.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-center py-12 text-sm text-gray-500">No documents found</p>
      </div>
    </div>

    <!-- Upload Document Modal -->
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
            <h3 class="text-lg font-medium text-gray-900">Upload Document</h3>
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
                <label class="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  v-model="newDocument.category"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  <option value="contract">Contract</option>
                  <option value="id_document">ID Document</option>
                  <option value="qualification">Qualification</option>
                  <option value="performance">Performance</option>
                  <option value="disciplinary">Disciplinary</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Document File *</label>
                <input
                  ref="fileInput"
                  type="file"
                  required
                  @change="handleFileSelect"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="flex items-center">
                  <input
                    v-model="newDocument.is_hr_only"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">HR Only (not visible to employee)</span>
                </label>
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
                {{ uploading ? 'Uploading...' : 'Upload Document' }}
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
import { useHrDocumentsStore } from '../store/hrDocuments'
import { useHrEmployeesStore } from '../store/hrEmployees'
import { useAuth } from '@/composables/useAuth'
import { success as showSuccess, error as showError } from '@/utils/notifications'
import StatusBadge from '../components/StatusBadge.vue'

const route = useRoute()
const documentsStore = useHrDocumentsStore()
const employeesStore = useHrEmployeesStore()
const { user } = useAuth()

const showUploadModal = ref(false)
const uploading = ref(false)
const fileInput = ref(null)
const employees = ref([])
const selectedEmployeeId = ref(null)

const newDocument = ref({
  category: '',
  is_hr_only: false,
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

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    newDocument.value.file = file
  }
}

const loadDocuments = async () => {
  if (!selectedEmployeeId.value) return
  
  await documentsStore.fetchDocuments(selectedEmployeeId.value)
}

const loadEmployees = async () => {
  await employeesStore.fetchEmployees({ per_page: 100 })
  employees.value = employeesStore.employees
}

const handleUpload = async () => {
  uploading.value = true
  
  try {
    await documentsStore.uploadDocument(selectedEmployeeId.value, {
      category: newDocument.value.category,
      is_hr_only: newDocument.value.is_hr_only,
      file: newDocument.value.file
    })
    
    showSuccess('Document uploaded successfully')
    showUploadModal.value = false
    
    // Reset form
    newDocument.value = {
      category: '',
      is_hr_only: false,
      file: null
    }
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    
    // Reload data
    await loadDocuments()
  } catch (err) {
    showError(err.message || 'Failed to upload document')
  } finally {
    uploading.value = false
  }
}

const handleDownload = async (documentId) => {
  try {
    await documentsStore.downloadDocument(selectedEmployeeId.value, documentId)
    showSuccess('Document downloaded successfully')
  } catch (err) {
    showError(err.message || 'Failed to download document')
  }
}

const handleDelete = async (documentId) => {
  if (!confirm('Are you sure you want to delete this document?')) {
    return
  }

  try {
    await documentsStore.deleteDocument(selectedEmployeeId.value, documentId)
    showSuccess('Document deleted successfully')
    await loadDocuments()
  } catch (err) {
    showError(err.message || 'Failed to delete document')
  }
}

onMounted(() => {
  // Check if employee_id is in query params
  if (route.query.employee_id) {
    selectedEmployeeId.value = parseInt(route.query.employee_id)
    loadDocuments()
  }
  
  // Load employees for dropdown
  loadEmployees()
})
</script>

