<template>
  <div class="documents-tab bg-white border border-gray-200 rounded-lg p-6">
    <!-- Clean Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-gray-100 rounded-lg">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Documents</h3>
          <p class="text-sm text-gray-500">
            {{ documents.length }} document{{ documents.length !== 1 ? 's' : '' }} attached to this {{ relatedType }}
          </p>
        </div>
      </div>
      <BaseButton
        v-if="canUpload"
        @click="showUploadModal = true"
        :loading="uploading"
        class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Upload Document
      </BaseButton>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
      <p class="text-gray-500 mt-2 text-sm">Loading documents...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="documents.length === 0" class="text-center py-8">
      <div class="w-12 h-12 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
        <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h4 class="text-base font-medium text-gray-900 mb-2">No documents attached</h4>
      <p class="text-gray-500 mb-4 text-sm">Upload documents related to this {{ relatedType }} to keep everything organized and accessible.</p>
      <BaseButton
        v-if="canUpload"
        @click="showUploadModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Upload Document
      </BaseButton>
    </div>

    <!-- Documents List -->
    <div v-else class="space-y-3">
      <div
        v-for="document in documents"
        :key="document.id"
        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
      >
        <div class="flex items-center space-x-3 flex-1 min-w-0">
          <!-- File Icon -->
          <div class="flex-shrink-0 h-10 w-10">
            <div class="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-lg border border-gray-200">
              {{ helpers.getFileTypeIcon(document.file_type) }}
            </div>
          </div>

          <!-- Document Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2">
              <h4 class="text-sm font-medium text-gray-900 truncate">
                {{ document.title || document.file_name }}
              </h4>
              <span :class="helpers.getFileTypeColor(document.file_type)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ document.file_type?.toUpperCase() || 'Unknown' }}
              </span>
            </div>
            <div class="flex items-center space-x-3 mt-1 text-xs text-gray-500">
              <span>{{ helpers.formatFileSize(document.file_size) }}</span>
              <span>{{ document.view_count || 0 }} views</span>
              <span>{{ helpers.formatDate(document.created_at) }}</span>
            </div>
            <div v-if="document.description" class="text-xs text-gray-600 mt-1 truncate">
              {{ document.description }}
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-2 flex-shrink-0">
          <button
            v-if="helpers.isPreviewable(document.file_type)"
            @click="previewDocument(document)"
            class="text-blue-600 hover:text-blue-900"
            title="Preview"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            @click="handleDownload(document)"
            :disabled="downloading"
            class="text-green-600 hover:text-green-900 disabled:opacity-50"
            title="Download"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          <button
            v-if="canEditDocument(document)"
            @click="editDocument(document)"
            class="text-yellow-600 hover:text-yellow-900"
            title="Edit"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            v-if="canDeleteDocument(document)"
            @click="confirmDelete(document)"
            class="text-red-600 hover:text-red-900"
            title="Delete"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <DocumentUploadModal
      v-if="showUploadModal"
      :relatedType="relatedType"
      :relatedId="relatedId"
      @close="showUploadModal = false"
      @uploaded="handleDocumentUploaded"
    />

    <!-- Edit Modal -->
    <DocumentEditModal
      v-if="showEditModal && selectedDocument"
      :document="selectedDocument"
      @close="showEditModal = false"
      @updated="handleDocumentUpdated"
    />

    <!-- Delete Confirmation Modal -->
    <DocumentDeleteModal
      v-if="showDeleteModal && selectedDocument"
      :document="selectedDocument"
      @close="showDeleteModal = false"
      @deleted="handleDocumentDeleted"
    />

    <!-- Preview Modal -->
    <DocumentPreviewModal
      v-if="showPreviewModal && selectedDocument"
      :document="selectedDocument"
      @close="showPreviewModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useDocuments } from '@/composables/useDocuments'
import BaseButton from '@/components/ui/BaseButton.vue'
import DocumentUploadModal from './DocumentUploadModal.vue'
import DocumentEditModal from './DocumentEditModal.vue'
import DocumentDeleteModal from './DocumentDeleteModal.vue'
import DocumentPreviewModal from './DocumentPreviewModal.vue'

// Props
const props = defineProps({
  relatedType: {
    type: String,
    required: true
  },
  relatedId: {
    type: [Number, String],
    required: true
  },
  // Optional: documents passed from parent component
  initialDocuments: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['document-linked', 'document-updated'])

// Composables
const {
  documents: allDocuments,
  loading,
  uploading,
  downloading,
  canUpload,
  canEditDocument,
  canDeleteDocument,
  helpers,
  uploadDocument,
  updateDocument,
  deleteDocument,
  downloadDocument,
  fetchDocuments,
  fetchDocument,
  fetchDocumentsByRelated
} = useDocuments()

// Filter documents for this related object
const documents = computed(() => {
  // First, check if we have initial documents from parent (contact API response)
  if (props.initialDocuments.length > 0) {
    console.log(`DocumentsTab: Using ${props.initialDocuments.length} documents from contact API response`)
    return props.initialDocuments
  }
  
  // Otherwise, use global documents array which gets updated when we link documents
  const filtered = allDocuments.value.filter(doc => {
    // Ensure document exists and has required properties
    if (!doc || !doc.id) {
      return false
    }

    // Check if the document has a relationship matching the current relatedType and relatedId
    if (doc.relationships && Array.isArray(doc.relationships)) {
      const hasRelationship = doc.relationships.some(rel => 
        rel.related_type === props.relatedType && 
        rel.related_id == props.relatedId
      )
      console.log(`Document ${doc.id} relationships check:`, {
        docId: doc.id,
        relatedType: props.relatedType,
        relatedId: props.relatedId,
        relationships: doc.relationships,
        hasRelationship
      })
      return hasRelationship
    }
    
    // Fallback: if no relationships array, use the direct related_type/id (less reliable based on current backend)
    const fallbackMatch = doc.related_type === props.relatedType && 
           doc.related_id == props.relatedId
    console.log(`Document ${doc.id} fallback check:`, {
      docId: doc.id,
      docRelatedType: doc.related_type,
      docRelatedId: doc.related_id,
      expectedType: props.relatedType,
      expectedId: props.relatedId,
      fallbackMatch
    })
    return fallbackMatch
  })
  
  console.log(`DocumentsTab: Filtered ${filtered.length} documents for ${props.relatedType} ${props.relatedId}`)
  return filtered
})

// State
const showUploadModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showPreviewModal = ref(false)
const selectedDocument = ref(null)

// Methods

const previewDocument = (document) => {
  selectedDocument.value = document
  showPreviewModal.value = true
}

const editDocument = (document) => {
  selectedDocument.value = document
  showEditModal.value = true
}

const confirmDelete = (document) => {
  selectedDocument.value = document
  showDeleteModal.value = true
}

const handleDownload = async (document) => {
  console.log('DocumentsTab: Download button clicked for document:', document)
  try {
    await downloadDocument(document)
    console.log('DocumentsTab: Download completed successfully')
  } catch (error) {
    console.error('DocumentsTab: Download failed:', error)
  }
}

const handleDocumentUploaded = async (document) => {
  showUploadModal.value = false
  
  console.log('DocumentsTab: Document uploaded/linked:', document)
  
  // Immediately add the document to the global documents list
  if (document && document.id) {
    // Check if document already exists in the list
    const existingIndex = allDocuments.value.findIndex(doc => doc.id === document.id)
    if (existingIndex !== -1) {
      // Update existing document with the new data (includes relationships array)
      allDocuments.value[existingIndex] = document
      console.log('DocumentsTab: Updated existing document in global list')
    } else {
      // Add new document to the list
      allDocuments.value.push(document)
      console.log('DocumentsTab: Added new document to global list')
    }
    
    // Emit event to parent to update initialDocuments
    emit('document-linked', document)
  }
  
  console.log('DocumentsTab: Documents count after update:', documents.value.length)
}

const handleDocumentUpdated = (updatedDocument) => {
  console.log('DocumentsTab: Document updated, refreshing UI:', updatedDocument)
  
  // Update the global documents array
  const globalIndex = allDocuments.value.findIndex(doc => doc.id === updatedDocument.id)
  if (globalIndex !== -1) {
    allDocuments.value[globalIndex] = updatedDocument
    console.log('DocumentsTab: Updated document in global documents array')
  }
  
  // Emit event to parent component to update its local documents array
  emit('document-updated', updatedDocument)
  
  showEditModal.value = false
  selectedDocument.value = null
}

const handleDocumentDeleted = () => {
  showDeleteModal.value = false
  selectedDocument.value = null
  // Documents will automatically update via computed property
}

// Lifecycle
onMounted(async () => {
  // Only load documents if we don't have initial documents from parent
  if (props.relatedType && props.relatedId && props.initialDocuments.length === 0) {
    try {
      console.log(`DocumentsTab: Loading documents for ${props.relatedType} ID ${props.relatedId}`)
      await fetchDocumentsByRelated(props.relatedType, props.relatedId)
      console.log(`DocumentsTab: Loaded ${allDocuments.value.length} total documents`)
      console.log(`DocumentsTab: Filtered documents for ${props.relatedType} ${props.relatedId}:`, documents.value)
    } catch (error) {
      console.error('Error loading documents on mount:', error)
    }
  } else if (props.initialDocuments.length > 0) {
    console.log(`DocumentsTab: Using ${props.initialDocuments.length} initial documents from parent`)
  }
})

// Watchers
watch(() => [props.relatedType, props.relatedId], async (newValues, oldValues) => {
  // Only load documents if we don't have initial documents from parent
  const [newRelatedType, newRelatedId] = newValues
  const [oldRelatedType, oldRelatedId] = oldValues || []
  
  if (newRelatedType && newRelatedId && 
      (newRelatedType !== oldRelatedType || newRelatedId !== oldRelatedId) &&
      props.initialDocuments.length === 0) {
    try {
      await fetchDocumentsByRelated(newRelatedType, newRelatedId)
    } catch (error) {
      console.error('Error loading documents on prop change:', error)
    }
  }
}, { immediate: true })
</script>

<script>
export default {
  name: 'DocumentsTab'
}
</script>
