<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Document Types</h1>
        <p class="mt-2 text-lg text-gray-600">Manage document types and their rules</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all shadow-sm hover:shadow-md"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Document Type
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-blue-100 rounded-xl p-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Types</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
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
            <p class="text-sm font-medium text-gray-500">Active</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.active }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-red-100 rounded-xl p-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Mandatory</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.mandatory }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-purple-100 rounded-xl p-4">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Employee Upload</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.employeeUpload }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search document types..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @input="handleSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            v-model="filters.category"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @change="handleFilterChange"
          >
            <option value="">All Categories</option>
            <option value="contract">Contract</option>
            <option value="id_document">ID Document</option>
            <option value="qualification">Qualification</option>
            <option value="performance">Performance</option>
            <option value="disciplinary">Disciplinary</option>
            <option value="onboarding">Onboarding</option>
            <option value="profile_picture">Profile Picture</option>
            <option value="payslip">Payslip</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.is_active"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @change="handleFilterChange"
          >
            <option :value="true">Active</option>
            <option :value="false">Inactive</option>
            <option value="">All</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Mandatory</label>
          <select
            v-model="filters.is_mandatory"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            @change="handleFilterChange"
          >
            <option value="">All</option>
            <option :value="true">Mandatory</option>
            <option :value="false">Optional</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Document Types Table -->
    <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 class="text-lg font-semibold text-gray-900">Document Types</h2>
      </div>
      <div class="p-6">
        <div v-if="documentTypesStore.loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-purple border-t-transparent mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading document types...</p>
        </div>
        <div v-else-if="documentTypesStore.documentTypes.length" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mandatory</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Upload</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="docType in documentTypesStore.documentTypes" :key="docType.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">{{ docType.name }}</div>
                  <div v-if="docType.description" class="text-xs text-gray-500 mt-1">{{ docType.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ docType.code || '-' }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {{ formatCategory(docType.category) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="docType.is_mandatory" class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    Yes
                  </span>
                  <span v-else class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    No
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="docType.employee_can_upload" class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Yes
                  </span>
                  <span v-else class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    No
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="docType.is_active" class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                  <span v-else class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    Inactive
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="editDocumentType(docType)"
                    class="text-primary-purple hover:text-primary-pink mr-4"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteDocumentType(docType)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-center py-12 text-sm text-gray-500">No document types found</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <DocumentTypeFormModal
      :show="showCreateModal || showEditModal"
      :document-type="editingDocumentType"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useHrDocumentTypesStore } from '../store/hrDocumentTypes'
import { useHrDepartmentsStore } from '../store/hrDepartments'
import { useHrDesignationsStore } from '../store/hrDesignations'
import { success as showSuccess, error as showError } from '@/utils/notifications'
import DocumentTypeFormModal from '../components/DocumentTypeFormModal.vue'

const documentTypesStore = useHrDocumentTypesStore()
const departmentsStore = useHrDepartmentsStore()
const designationsStore = useHrDesignationsStore()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingDocumentType = ref(null)
const searchQuery = ref('')

const filters = computed(() => documentTypesStore.filters)

const stats = computed(() => {
  const types = documentTypesStore.documentTypes
  return {
    total: types.length,
    active: types.filter(t => t.is_active).length,
    mandatory: types.filter(t => t.is_mandatory && t.is_active).length,
    employeeUpload: types.filter(t => t.employee_can_upload && t.is_active).length
  }
})

const formatCategory = (category) => {
  const categories = {
    contract: 'Contract',
    id_document: 'ID Document',
    qualification: 'Qualification',
    performance: 'Performance',
    disciplinary: 'Disciplinary',
    onboarding: 'Onboarding',
    profile_picture: 'Profile Picture',
    payslip: 'Payslip',
    other: 'Other'
  }
  return categories[category] || category
}

const handleSearch = () => {
  documentTypesStore.setFilters({ search: searchQuery.value, page: 1 })
  loadDocumentTypes()
}

const handleFilterChange = () => {
  documentTypesStore.setFilters({ page: 1 })
  loadDocumentTypes()
}

const loadDocumentTypes = async () => {
  await documentTypesStore.fetchDocumentTypes()
}

const editDocumentType = (docType) => {
  editingDocumentType.value = docType
  showEditModal.value = true
}

const deleteDocumentType = async (docType) => {
  if (!confirm(`Are you sure you want to delete "${docType.name}"?`)) {
    return
  }

  try {
    await documentTypesStore.deleteDocumentType(docType.id)
    showSuccess('Document type deleted successfully')
    await loadDocumentTypes()
  } catch (err) {
    showError(err.message || 'Failed to delete document type')
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingDocumentType.value = null
}

const handleSave = async () => {
  await loadDocumentTypes()
  closeModal()
}

onMounted(async () => {
  await Promise.all([
    loadDocumentTypes(),
    departmentsStore.fetchDepartments({ per_page: 100, is_active: true }),
    designationsStore.fetchDesignations({ per_page: 100, is_active: true })
  ])
})
</script>

