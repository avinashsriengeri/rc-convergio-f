<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">My Documents</h1>
        <p class="mt-2 text-lg text-gray-600">View and manage your documents</p>
      </div>
      <button
        @click="showUploadModal = true"
        class="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all shadow-sm hover:shadow-md"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Upload Document
      </button>
    </div>

    <!-- Missing Mandatory Documents Alert -->
    <div
      v-if="employeeDocumentsStore.missingMandatory.length > 0"
      class="bg-red-50 border-l-4 border-red-400 rounded-lg p-6"
    >
      <div class="flex items-start">
        <svg class="w-6 h-6 text-red-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-red-800 mb-2">Missing Mandatory Documents</h3>
          <p class="text-sm text-red-700 mb-3">
            You need to upload the following mandatory documents:
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="docType in employeeDocumentsStore.missingMandatory"
              :key="docType.document_type_id"
              @click="uploadMissingDocument(docType)"
              class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
            >
              {{ docType.name }}
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div v-if="!employeeDocumentsStore.loading && employeeDocumentsStore.myDocuments.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-blue-100 rounded-xl p-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Documents</p>
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
          <div class="flex-shrink-0 bg-purple-100 rounded-xl p-4">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Mandatory</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.mandatoryComplete }}/{{ stats.mandatoryTotal }}</p>
            <p class="text-xs text-gray-500 mt-1">Complete</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="employeeDocumentsStore.loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-purple border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading your documents...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="employeeDocumentsStore.myDocuments.length === 0" class="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
      <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-6 text-lg font-semibold text-gray-900">No documents</h3>
      <p class="mt-2 text-sm text-gray-500">You don't have any documents yet.</p>
      <button
        @click="showUploadModal = true"
        class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink transition-colors"
      >
        Upload Your First Document
      </button>
    </div>

    <!-- Documents by Category -->
    <div v-else class="space-y-8">
      <div
        v-for="(documents, category) in employeeDocumentsStore.documentsByCategory"
        :key="category"
        class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
      >
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ formatCategory(category) }} ({{ documents.length }})
          </h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="document in documents"
              :key="document.id"
              class="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-300"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h3 class="text-sm font-semibold text-gray-900 mb-1">
                    {{ document.document_type?.name || document.title }}
                  </h3>
                  <p v-if="document.document_type?.description" class="text-xs text-gray-500 mb-2">
                    {{ document.document_type.description }}
                  </p>
                  <div class="flex items-center gap-2 mb-2">
                    <StatusBadge
                      v-if="document.verification_status"
                      :status="document.verification_status === 'pending' ? 'pending' : document.verification_status"
                      :show-dot="true"
                    />
                    <span v-if="document.document_type?.is_mandatory" class="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      Mandatory
                    </span>
                  </div>
                </div>
                <div class="ml-3">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              
              <div class="text-xs text-gray-500 mb-4">
                <p>Uploaded: {{ formatDate(document.created_at) }}</p>
                <p v-if="document.verified_at">Verified: {{ formatDate(document.verified_at) }}</p>
                <p v-if="document.verified_by">By: {{ document.verified_by?.name }}</p>
              </div>

              <div class="flex items-center gap-2">
                <button
                  @click="handleDownload(document)"
                  class="flex-1 px-3 py-2 text-xs font-medium rounded-lg text-primary-purple bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  Download
                </button>
                <button
                  v-if="document.preview_url"
                  @click="handlePreview(document)"
                  class="px-3 py-2 text-xs font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Document Modal -->
    <UploadDocumentModal
      :show="showUploadModal"
      :document-types="employeeDocumentsStore.documentTypes"
      :preselected-type="preselectedDocumentType"
      @close="closeUploadModal"
      @uploaded="handleDocumentUploaded"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useHrEmployeeDocumentsStore } from '../store/hrEmployeeDocuments'
import { success as showSuccess, error as showError } from '@/utils/notifications'
import StatusBadge from '../components/StatusBadge.vue'
import UploadDocumentModal from '../components/UploadDocumentModal.vue'

const employeeDocumentsStore = useHrEmployeeDocumentsStore()

const showUploadModal = ref(false)
const preselectedDocumentType = ref(null)

const stats = computed(() => {
  const docs = employeeDocumentsStore.myDocuments
  const mandatoryTotal = employeeDocumentsStore.missingMandatory.length + docs.filter(d => d.document_type?.is_mandatory).length
  const mandatoryComplete = docs.filter(d => d.document_type?.is_mandatory && d.verification_status === 'verified').length
  
  return {
    total: docs.length,
    verified: docs.filter(d => d.verification_status === 'verified').length,
    pending: docs.filter(d => d.verification_status === 'pending' || !d.verification_status).length,
    mandatoryTotal,
    mandatoryComplete
  }
})

const formatCategory = (category) => {
  const categories = {
    contract: 'Contracts & Letters',
    id_document: 'ID Documents',
    qualification: 'Qualifications',
    performance: 'Performance',
    disciplinary: 'Disciplinary',
    onboarding: 'Onboarding',
    profile_picture: 'Profile Pictures',
    payslip: 'Payslips',
    other: 'Other Documents'
  }
  return categories[category] || category
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const uploadMissingDocument = (docType) => {
  preselectedDocumentType.value = docType.document_type_id
  showUploadModal.value = true
}

const closeUploadModal = () => {
  showUploadModal.value = false
  preselectedDocumentType.value = null
}

const handleDocumentUploaded = async () => {
  await Promise.all([
    employeeDocumentsStore.fetchMyDocuments(),
    employeeDocumentsStore.fetchMissingMandatory()
  ])
  showSuccess('Document uploaded successfully. It will be reviewed by HR.')
}

const handleDownload = async (document) => {
  try {
    const documentId = document.id || document.document_id
    if (!documentId) {
      showError('Document ID not found')
      return
    }
    await employeeDocumentsStore.downloadDocument(documentId)
    showSuccess('Document downloaded successfully')
  } catch (err) {
    showError(err.message || 'Failed to download document')
  }
}

const handlePreview = (document) => {
  if (document.preview_url) {
    window.open(document.preview_url, '_blank')
  }
}

onMounted(async () => {
  await Promise.all([
    employeeDocumentsStore.fetchMyDocuments(),
    employeeDocumentsStore.fetchDocumentTypes(),
    employeeDocumentsStore.fetchMissingMandatory()
  ])
})
</script>

