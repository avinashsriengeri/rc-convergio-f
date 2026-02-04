<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Documents</h1>
        <p class="mt-2 text-lg text-gray-600">Manage employee documents and document types</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          v-if="canUpload && selectedEmployeeId"
          @click="showUploadModal = true"
          class="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all shadow-sm hover:shadow-md"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Upload Document
        </button>
      </div>
    </div>

    <!-- Action Bar -->
    <div class="bg-white rounded-xl shadow-md border border-gray-200 p-5">
      <div class="flex items-center gap-3">
        <button
          @click="showDocumentTypesModal = true"
          class="inline-flex items-center px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all shadow-sm hover:shadow-md"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Document Types
        </button>
        <button
          v-if="canUpload && selectedEmployeeId"
          @click="showUploadModal = true"
          class="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all shadow-sm hover:shadow-md"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Upload Document
        </button>
      </div>
    </div>

    <!-- Employee Selector (HR Admin only) -->
    <div v-if="canUpload && !selectedEmployeeId" class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
      <select
        v-model="selectedEmployeeId"
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
        @change="loadDocuments"
      >
        <option value="">Select an employee</option>
        <option v-for="emp in employees" :key="emp.id" :value="emp.id">
          {{ emp.full_name }} ({{ emp.employee_id }})
        </option>
      </select>
    </div>

    <!-- Quick Stats Cards (when employee selected) -->
    <div v-if="selectedEmployeeId && documentsStore.documents.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-blue-100 rounded-xl p-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Documents</p>
            <p class="text-2xl font-bold text-gray-900">{{ documentsStore.documents.length }}</p>
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
            <p class="text-sm font-medium text-gray-500">Verified</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.verified }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-yellow-100 rounded-xl p-4">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Pending</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.pending }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-red-100 rounded-xl p-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Rejected</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.rejected }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Documents List -->
    <div v-if="selectedEmployeeId" class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 class="text-lg font-semibold text-gray-900">Employee Documents</h2>
      </div>
      <div class="p-6">
        <div v-if="documentsStore.loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-purple border-t-transparent mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading documents...</p>
        </div>
        <div v-else-if="documentsStore.documents.length" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span v-if="document.document_type" class="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    {{ document.document_type.name }}
                  </span>
                  <span v-else class="text-gray-400 text-xs">-</span>
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

    <!-- Empty State (no employee selected) -->
    <div v-if="canUpload && !selectedEmployeeId" class="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
      <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-6 text-lg font-semibold text-gray-900">Select an Employee</h3>
      <p class="mt-2 text-sm text-gray-500">Please select an employee to view their documents</p>
    </div>

    <!-- Upload Document Modal -->
    <div
      v-if="showUploadModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="showUploadModal = false"
    >
      <div
        class="relative top-20 mx-auto p-8 border w-full max-w-2xl shadow-xl rounded-xl bg-white"
        @click.stop
      >
        <div>
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900">Upload Document</h3>
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
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                  @change="onCategoryChange"
                >
                  <option value="">Select category</option>
                  <option value="contract">Contract</option>
                  <option value="id_document">ID Document</option>
                  <option value="qualification">Qualification</option>
                  <option value="performance">Performance</option>
                  <option value="disciplinary">Disciplinary</option>
                  <option value="onboarding">Onboarding</option>
                  <option value="payslip">Payslip</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Document Type (Optional)
                </label>
                <select
                  v-model="newDocument.document_type_id"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                >
                  <option :value="null">Select document type (optional)</option>
                  <option
                    v-for="docType in filteredDocumentTypes"
                    :key="docType.id"
                    :value="docType.id"
                  >
                    {{ docType.name }} {{ docType.code ? `(${docType.code})` : '' }}
                  </option>
                </select>
                <p class="mt-1 text-xs text-gray-500">Link to a document type for better organization</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  v-model="newDocument.description"
                  rows="2"
                  placeholder="Add a description for this document..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Document File *</label>
                <input
                  ref="fileInput"
                  type="file"
                  required
                  @change="handleFileSelect"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                />
              </div>

              <div>
                <label class="flex items-center">
                  <input
                    v-model="newDocument.is_hr_only"
                    type="checkbox"
                    class="rounded border-gray-300 text-primary-purple focus:ring-primary-purple"
                  />
                  <span class="ml-2 text-sm text-gray-700">HR Only (not visible to employee)</span>
                </label>
              </div>
            </div>
            
            <div class="flex justify-end gap-3 mt-8">
              <button
                type="button"
                @click="showUploadModal = false"
                class="px-5 py-2.5 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="uploading"
                class="px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all shadow-sm hover:shadow-md disabled:opacity-50"
              >
                {{ uploading ? 'Uploading...' : 'Upload Document' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Document Types Modal -->
    <div
      v-if="showDocumentTypesModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="showDocumentTypesModal = false"
    >
      <div
        class="relative top-10 mx-auto p-8 border w-full max-w-6xl shadow-xl rounded-xl bg-white mb-10"
        @click.stop
      >
        <DocumentTypesModalContent @close="showDocumentTypesModal = false" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHrDocumentsStore } from '../store/hrDocuments'
import { useHrEmployeesStore } from '../store/hrEmployees'
import { useHrDocumentTypesStore } from '../store/hrDocumentTypes'
import { useAuth } from '@/composables/useAuth'
import { success as showSuccess, error as showError } from '@/utils/notifications'
import StatusBadge from '../components/StatusBadge.vue'
import DocumentTypesModalContent from '../components/DocumentTypesModalContent.vue'

const route = useRoute()
const router = useRouter()
const documentsStore = useHrDocumentsStore()
const employeesStore = useHrEmployeesStore()
const documentTypesStore = useHrDocumentTypesStore()
const { user } = useAuth()

const showUploadModal = ref(false)
const showDocumentTypesModal = ref(false)
const uploading = ref(false)
const fileInput = ref(null)
const employees = ref([])
const selectedEmployeeId = ref(null)

const newDocument = ref({
  category: '',
  document_type_id: null,
  description: '',
  is_hr_only: false,
  file: null
})

const canUpload = computed(() => {
  // Only HR Admin and System Admin can upload
  if (!user.value?.roles) return false
  const roles = Array.isArray(user.value.roles) ? user.value.roles : [user.value.roles]
  return roles.includes('hr_admin') || roles.includes('system_admin')
})

const stats = computed(() => {
  const docs = documentsStore.documents
  return {
    verified: docs.filter(d => d.verification_status === 'verified').length,
    pending: docs.filter(d => d.verification_status === 'pending').length,
    rejected: docs.filter(d => d.verification_status === 'rejected').length
  }
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

const filteredDocumentTypes = computed(() => {
  if (!newDocument.value.category) {
    return documentTypesStore.activeDocumentTypes
  }
  return documentTypesStore.activeDocumentTypes.filter(
    dt => dt.category === newDocument.value.category
  )
})

const onCategoryChange = () => {
  // Reset document_type_id if category changes and selected type doesn't match
  if (newDocument.value.document_type_id) {
    const selectedType = documentTypesStore.documentTypes.find(
      dt => dt.id === newDocument.value.document_type_id
    )
    if (selectedType && selectedType.category !== newDocument.value.category) {
      newDocument.value.document_type_id = null
    }
  }
}

const handleUpload = async () => {
  uploading.value = true
  
  try {
    const uploadData = {
      category: newDocument.value.category,
      is_hr_only: newDocument.value.is_hr_only,
      file: newDocument.value.file
    }
    
    // Add optional fields if provided
    if (newDocument.value.document_type_id) {
      uploadData.document_type_id = newDocument.value.document_type_id
    }
    if (newDocument.value.description) {
      uploadData.description = newDocument.value.description
    }
    
    await documentsStore.uploadDocument(selectedEmployeeId.value, uploadData)
    
    showSuccess('Document uploaded successfully')
    showUploadModal.value = false
    
    // Reset form
    newDocument.value = {
      category: '',
      document_type_id: null,
      description: '',
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

onMounted(async () => {
  // Route guard: Redirect employees to My Documents
  if (!canUpload.value) {
    router.push({ name: 'MyDocuments' })
    return
  }

  // Check if employee_id is in query params
  if (route.query.employee_id) {
    selectedEmployeeId.value = parseInt(route.query.employee_id)
    loadDocuments()
  }
  
  // Load employees and document types for dropdowns
  await Promise.all([
    loadEmployees(),
    documentTypesStore.fetchDocumentTypes({ per_page: 100, is_active: true })
  ])
})
</script>
