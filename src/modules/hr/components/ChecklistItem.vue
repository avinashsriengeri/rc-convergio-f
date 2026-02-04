<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4 hover:border-primary-purple transition-colors">
    <div class="flex items-start space-x-4">
      <!-- Checkbox/Status Icon -->
      <div class="flex-shrink-0 pt-1">
        <div v-if="item.status === 'completed'" class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
          <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
        <div v-else-if="item.status === 'in_progress'" class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
          <div class="w-3 h-3 rounded-full bg-blue-600"></div>
        </div>
        <div v-else class="w-6 h-6 rounded-full border-2 border-gray-300"></div>
      </div>
      
      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h4 class="text-sm font-semibold text-gray-900">{{ item.template?.name || item.name || 'Onboarding Item' }}</h4>
            <p v-if="item.template?.description || item.description" class="text-sm text-gray-600 mt-1">{{ item.template?.description || item.description }}</p>
            
            <div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <!-- Template Name Badge with Category Color -->
              <div class="flex items-center">
                <span :class="categoryBadgeClass" class="px-2 py-0.5 rounded text-xs font-medium">
                  {{ item.template?.name || item.name || 'Onboarding Item' }}
                </span>
              </div>
              
              <!-- Due Date -->
              <div v-if="item.due_date" class="flex items-center" :class="dueDateClass">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatDueDate(item.due_date) }}
              </div>
              
              <!-- Status Badge -->
              <StatusBadge :status="item.status" />
            </div>
          </div>
        </div>
        
        <!-- Uploaded Documents Display -->
        <div v-if="documents.length > 0" class="mt-4 pt-4 border-t border-gray-200">
          <p class="text-xs font-medium text-gray-700 mb-2">Uploaded Documents:</p>
          <div class="space-y-3">
            <div
              v-for="doc in sortedDocuments"
              :key="doc.id || doc.document_id"
              class="bg-gray-50 rounded-lg p-3"
              :class="{ 
                'border-2 border-red-200': doc.verification_status === 'rejected',
                'border-2 border-blue-300 bg-blue-50': isLatestDocument(doc) && shouldShowLatestBadge()
              }"
            >
              <!-- Document Header -->
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2 flex-1 min-w-0">
                  <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span class="text-xs font-medium text-gray-700 truncate">{{ doc.name || doc.title || doc.file_name || 'Document' }}</span>
                  <span v-if="doc.size || doc.file_size" class="text-xs text-gray-500">({{ formatFileSize(doc.size || doc.file_size) }})</span>
                  <!-- Latest Badge (only show when multiple docs exist and document is NOT verified) -->
                  <span 
                    v-if="isLatestDocument(doc) && shouldShowLatestBadge() && doc.verification_status !== 'verified'" 
                    class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-600 text-white"
                  >
                    Latest
                  </span>
                  <!-- Verification Status Badge -->
                  <StatusBadge 
                    v-if="doc.verification_status" 
                    :status="doc.verification_status === 'pending' ? 'pending' : doc.verification_status"
                    :show-dot="true"
                  />
                </div>
                <div class="flex items-center space-x-2 flex-shrink-0">
                  <button
                    @click="$emit('view-document', doc)"
                    class="text-blue-600 hover:text-blue-700 text-xs font-medium"
                  >
                    View
                  </button>
                  <button
                    @click="$emit('download-document', doc)"
                    class="text-green-600 hover:text-green-700 text-xs font-medium"
                  >
                    Download
                  </button>
                  <!-- HR Actions: Verify/Reject (only for pending documents) -->
                  <template v-if="canVerifyDocuments && (doc.verification_status === 'pending' || !doc.verification_status)">
                    <button
                      @click="$emit('verify-document', doc)"
                      class="text-green-600 hover:text-green-700 text-xs font-medium px-2 py-1 bg-green-50 rounded hover:bg-green-100 transition-colors"
                      title="Verify Document"
                    >
                      Verify
                    </button>
                    <button
                      @click="$emit('reject-document', doc)"
                      class="text-red-600 hover:text-red-700 text-xs font-medium px-2 py-1 bg-red-50 rounded hover:bg-red-100 transition-colors"
                      title="Reject Document"
                    >
                      Reject
                    </button>
                  </template>
                  <!-- Employee Action: Re-upload if rejected -->
                  <button
                    v-if="canUploadDocuments && doc.verification_status === 'rejected'"
                    @click="$emit('re-upload-document', doc)"
                    class="text-blue-600 hover:text-blue-700 text-xs font-medium px-2 py-1 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                  >
                    Re-upload
                  </button>
                  <button
                    v-if="canDeleteDocument"
                    @click="$emit('delete-document', doc)"
                    class="text-red-600 hover:text-red-700 text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <!-- Verification Info -->
              <div v-if="doc.verification_status && doc.verification_status !== 'pending'" class="mt-2 pt-2 border-t border-gray-200">
                <!-- Verified Info -->
                <div v-if="doc.verification_status === 'verified'" class="text-xs text-gray-600">
                  <span class="font-medium text-green-700">Verified</span>
                  <span v-if="doc.verified_by"> by {{ doc.verified_by?.name || 'HR' }}</span>
                  <span v-if="doc.verified_at"> on {{ formatDate(doc.verified_at) }}</span>
                </div>
                
                <!-- Rejected Info -->
                <div v-if="doc.verification_status === 'rejected'" class="text-xs">
                  <div class="font-medium text-red-700 mb-1">
                    Rejected
                    <span v-if="doc.rejected_by"> by {{ doc.rejected_by?.name || 'HR' }}</span>
                    <span v-if="doc.rejected_at"> on {{ formatDate(doc.rejected_at) }}</span>
                  </div>
                  <div v-if="doc.rejection_reason" class="text-red-600 bg-red-50 rounded p-2 mt-1">
                    <span class="font-medium">Reason:</span> {{ doc.rejection_reason }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div v-if="item.status !== 'completed' && showActions" class="mt-6 flex items-center space-x-3">
          <!-- Upload Documents Button (for employees when pending) -->
          <button
            v-if="item.status === 'pending' && canUploadDocuments"
            @click="$emit('upload-documents')"
            class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Documents
          </button>
          
          <!-- Verify & Complete Button (for HR Admins when in_progress) -->
          <button
            v-if="item.status === 'in_progress' && canVerifyDocuments"
            @click="$emit('verify-documents')"
            class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Verify & Complete
          </button>
          
          <!-- Mark Complete Button (generic) -->
          <button
            v-if="!canUploadDocuments && !canVerifyDocuments"
            @click="$emit('mark-complete')"
            class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Mark Complete
          </button>
        </div>
        
        <!-- Completed Info -->
        <div v-if="item.status === 'completed' && item.completed_at" class="mt-4 pt-4 border-t border-gray-200">
          <div class="flex items-center text-xs text-gray-500">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Completed on {{ formatDate(item.completed_at) }}
            <span v-if="item.completed_by_name"> by {{ item.completed_by_name }}</span>
          </div>
          <p v-if="item.notes" class="text-xs text-gray-600 mt-1 italic">{{ item.notes }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  showActions: {
    type: Boolean,
    default: true
  },
  documents: {
    type: Array,
    default: () => []
  },
  canUploadDocuments: {
    type: Boolean,
    default: false
  },
  canVerifyDocuments: {
    type: Boolean,
    default: false
  },
  canDeleteDocument: {
    type: Boolean,
    default: false
  }
})

defineEmits(['mark-complete', 'upload-documents', 'verify-documents', 'view-document', 'download-document', 'delete-document', 'verify-document', 'reject-document', 're-upload-document'])

// Sort documents by created_at (newest first) to identify latest
const sortedDocuments = computed(() => {
  if (!props.documents || props.documents.length === 0) return []
  
  return [...props.documents].sort((a, b) => {
    const dateA = new Date(a.created_at || 0)
    const dateB = new Date(b.created_at || 0)
    return dateB - dateA // Newest first
  })
})

// Check if document is the latest (newest) one
const isLatestDocument = (doc) => {
  if (!sortedDocuments.value || sortedDocuments.value.length === 0) return false
  const latestDoc = sortedDocuments.value[0]
  return (doc.id || doc.document_id) === (latestDoc.id || latestDoc.document_id)
}

// Only show "Latest" badge when there are multiple documents (more than 1)
// This helps identify which document is the newest when there are multiple documents
// (especially useful when there are rejected documents that need re-uploading)
// Note: The template also checks that document is NOT verified before showing badge
const shouldShowLatestBadge = () => {
  // Only show if there are multiple documents
  return props.documents && props.documents.length > 1
}

const categoryBadgeClass = computed(() => {
  // Use template category for color, fallback to assigned_role or 'hr'
  const category = (props.item.template?.category || props.item.assigned_role || 'hr').toLowerCase()
  const classes = {
    hr: 'bg-blue-100 text-blue-800',
    it: 'bg-purple-100 text-purple-800',
    finance: 'bg-green-100 text-green-800',
    manager: 'bg-orange-100 text-orange-800',
    legal: 'bg-indigo-100 text-indigo-800',
    operations: 'bg-yellow-100 text-yellow-800',
    admin: 'bg-pink-100 text-pink-800',
    sales: 'bg-cyan-100 text-cyan-800',
    marketing: 'bg-teal-100 text-teal-800'
  }
  return classes[category] || 'bg-gray-100 text-gray-800'
})

const formatDueDate = (dateString) => {
  if (!dateString) return 'No due date'
  
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(date)
  dueDate.setHours(0, 0, 0, 0)
  
  const diffTime = dueDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Due today'
  if (diffDays === 1) return 'Due tomorrow'
  if (diffDays === -1) return 'Overdue by 1 day'
  if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`
  return `${diffDays} days left`
}

const dueDateClass = computed(() => {
  if (!props.item.due_date) return ''
  
  const date = new Date(props.item.due_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(date)
  dueDate.setHours(0, 0, 0, 0)
  
  const diffTime = dueDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'text-red-600 font-medium'
  if (diffDays === 0) return 'text-yellow-600 font-medium'
  if (diffDays <= 3) return 'text-yellow-600'
  return ''
})

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

