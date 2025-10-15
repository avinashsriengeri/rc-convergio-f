<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <div class="bg-white">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0 h-10 w-10">
                <div class="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                  {{ helpers.getFileTypeIcon(document.file_type) }}
                </div>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900">
                  {{ document.title || document.file_name }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ helpers.formatFileSize(document.file_size) }} • {{ document.file_type?.toUpperCase() }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="downloadDocument"
                class="p-2 text-gray-400 hover:text-green-600 transition-colors"
                title="Download"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
              <button
                @click="closeModal"
                class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Close"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <!-- Loading State -->
            <div v-if="loading" class="flex flex-col items-center justify-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Loading Document Preview</h3>
              <p class="text-sm text-gray-500">Please wait while we prepare your document...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-12">
              <div class="bg-red-50 border border-red-200 rounded-lg p-8">
                <div class="text-red-400 mb-4">
                  <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-red-900 mb-2">Preview Unavailable</h3>
                <p class="text-red-700 mb-6">{{ error }}</p>
                <div class="flex items-center justify-center space-x-4">
                  <BaseButton @click="downloadDocument" variant="outline" class="border-red-300 text-red-700 hover:bg-red-50">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Document
                  </BaseButton>
                  <BaseButton @click="loadPreview" variant="outline" class="border-gray-300 text-gray-700 hover:bg-gray-50">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Try Again
                  </BaseButton>
                </div>
              </div>
            </div>

            <!-- Preview Content -->
            <div v-else class="preview-container">
              <!-- PDF Preview -->
              <div v-if="isPdf" class="w-full">
                <div class="bg-gray-50 border border-gray-300 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="text-sm font-medium text-gray-700">PDF Preview</h4>
                    <div class="flex items-center space-x-2">
                      <span class="text-xs text-gray-500">{{ helpers.formatFileSize(document.file_size) }}</span>
                      <span class="text-xs text-gray-500">•</span>
                      <span class="text-xs text-gray-500">{{ document.file_type?.toUpperCase() }}</span>
                    </div>
                  </div>
                  <iframe
                    :src="previewUrl"
                    class="w-full h-96 border border-gray-200 rounded"
                    frameborder="0"
                    title="Document Preview"
                  ></iframe>
                </div>
              </div>

              <!-- Image Preview -->
              <div v-else-if="isImage" class="text-center">
                <div class="bg-gray-50 border border-gray-300 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="text-sm font-medium text-gray-700">Image Preview</h4>
                    <div class="flex items-center space-x-2">
                      <span class="text-xs text-gray-500">{{ helpers.formatFileSize(document.file_size) }}</span>
                      <span class="text-xs text-gray-500">•</span>
                      <span class="text-xs text-gray-500">{{ document.file_type?.toUpperCase() }}</span>
                    </div>
                  </div>
                  <img
                    :src="previewUrl"
                    :alt="document.title || document.file_name"
                    class="max-w-full max-h-96 mx-auto rounded-lg shadow-lg border border-gray-200"
                  />
                </div>
              </div>

              <!-- Text Preview -->
              <div v-else-if="isText" class="w-full">
                <div class="bg-gray-50 border border-gray-300 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="text-sm font-medium text-gray-700">Text Preview</h4>
                    <div class="flex items-center space-x-2">
                      <span class="text-xs text-gray-500">{{ helpers.formatFileSize(document.file_size) }}</span>
                      <span class="text-xs text-gray-500">•</span>
                      <span class="text-xs text-gray-500">{{ document.file_type?.toUpperCase() }}</span>
                    </div>
                  </div>
                  <div class="bg-white border border-gray-200 rounded p-4 max-h-96 overflow-y-auto">
                    <pre class="text-sm text-gray-800 whitespace-pre-wrap font-mono">{{ textContent }}</pre>
                  </div>
                </div>
              </div>

              <!-- Unsupported Type -->
              <div v-else class="text-center py-12">
                <div class="bg-gray-50 border border-gray-300 rounded-lg p-8">
                  <div class="text-gray-400 mb-4">
                    <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">Preview not supported</h3>
                  <p class="text-gray-500 mb-4">
                    This file type ({{ document.file_type?.toUpperCase() }}) cannot be previewed in the browser.
                  </p>
                  <div class="flex items-center justify-center space-x-4">
                    <BaseButton @click="downloadDocument" variant="outline">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download Document
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <span>Created {{ helpers.formatDate(document.created_at) }}</span>
                <span>{{ document.view_count || 0 }} views</span>
                <span v-if="document.owner">by {{ document.owner.name }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <span :class="helpers.getVisibilityColor(document.visibility)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ document.visibility || 'private' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDocuments } from '@/composables/useDocuments'
import { documentsService } from '@/services/documents'
import BaseButton from '@/components/ui/BaseButton.vue'

// Props
const props = defineProps({
  document: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['close'])

// Composables
const { downloadDocument, helpers } = useDocuments()

// State
const loading = ref(false)
const error = ref('')
const previewUrl = ref('')
const textContent = ref('')

// Computed
const isPdf = computed(() => {
  const fileType = props.document.file_type?.toLowerCase()
  return fileType === 'pdf' || fileType === 'application/pdf'
})

const isImage = computed(() => {
  const fileType = props.document.file_type?.toLowerCase()
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml']
  return imageTypes.includes(fileType)
})

const isText = computed(() => {
  const fileType = props.document.file_type?.toLowerCase()
  return fileType === 'txt' || fileType === 'text/plain'
})

// Methods
const loadPreview = async () => {
  // Reset error state when retrying
  error.value = ''
  // Validate document and ID
  if (!props.document || !props.document.id) {
    error.value = 'Invalid document: missing ID'
    return
  }

  if (!helpers.isPreviewable(props.document.file_type)) {
    error.value = 'This file type cannot be previewed'
    return
  }

  try {
    loading.value = true
    error.value = ''

    if (isText.value) {
      // For text files, we'll need to fetch the content
      // This would typically be done through a separate API endpoint
      textContent.value = 'Text content preview not implemented yet. Download the file to view content.'
    } else if (isPdf.value) {
      // For PDFs, fetch as blob to avoid iframe authentication issues
      try {
        const response = await documentsService.downloadDocument(props.document.id)
        const blob = new Blob([response.data], { type: 'application/pdf' })
        previewUrl.value = URL.createObjectURL(blob)
        console.log('PDF preview loaded as blob URL:', previewUrl.value)
      } catch (previewError) {
        console.error('Error fetching PDF preview:', previewError)
        error.value = 'Failed to load PDF preview. Please try downloading the document.'
      }
    } else if (isImage.value) {
      // For images, fetch as blob
      try {
        const response = await documentsService.downloadDocument(props.document.id)
        const blob = new Blob([response.data])
        previewUrl.value = URL.createObjectURL(blob)
        console.log('Image preview loaded as blob URL:', previewUrl.value)
      } catch (previewError) {
        console.error('Error fetching image preview:', previewError)
        error.value = 'Failed to load image preview. Please try downloading the document.'
      }
    }
  } catch (err) {
    error.value = 'Failed to load preview'
    console.error('Preview error:', err)
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  // Clean up object URL when closing modal
  if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value)
  }
  emit('close')
}

// Lifecycle
onMounted(() => {
  loadPreview()
})

onUnmounted(() => {
  // Clean up object URL to prevent memory leaks
  if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
</script>

<script>
export default {
  name: 'DocumentPreviewModal'
}
</script>
