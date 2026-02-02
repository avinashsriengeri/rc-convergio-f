<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModal">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeModal"></div>
      
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
        <div class="bg-white">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-medium text-gray-900">
                  {{ document?.title || document?.file_name || 'Document Preview' }}
                </h3>
                <p v-if="document?.file_size" class="text-sm text-gray-500">
                  {{ formatFileSize(document.file_size) }}
                  <span v-if="document?.file_type"> • {{ document.file_type.toUpperCase() }}</span>
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                v-if="document?.download_url"
                @click="handleDownload"
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
          <div class="p-6">
            <div v-if="loading" class="flex flex-col items-center justify-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p class="text-sm text-gray-500">Loading preview...</p>
            </div>

            <div v-else-if="error" class="text-center py-12">
              <div class="bg-red-50 border border-red-200 rounded-lg p-8">
                <div class="text-red-400 mb-4">
                  <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-red-900 mb-2">Preview Unavailable</h3>
                <p class="text-red-700 mb-6">{{ error }}</p>
                <button
                  v-if="document?.download_url"
                  @click="handleDownload"
                  class="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Document
                </button>
              </div>
            </div>

            <div v-else class="preview-container">
              <!-- PDF Preview -->
              <div v-if="isPdf" class="w-full">
                <div class="bg-gray-50 border border-gray-300 rounded-lg p-4">
                  <iframe
                    :src="previewUrl"
                    class="w-full h-[600px] border border-gray-200 rounded"
                    frameborder="0"
                    title="Document Preview"
                  ></iframe>
                </div>
              </div>

              <!-- Image Preview -->
              <div v-else-if="isImage" class="text-center">
                <div class="bg-gray-50 border border-gray-300 rounded-lg p-4">
                  <img
                    :src="previewUrl"
                    :alt="document?.title || document?.file_name"
                    class="max-w-full max-h-[600px] mx-auto rounded-lg shadow-lg border border-gray-200"
                  />
                </div>
              </div>

              <!-- Text Preview -->
              <div v-else-if="isText" class="w-full">
                <div class="bg-gray-50 border border-gray-300 rounded-lg p-4">
                  <div class="bg-white border border-gray-200 rounded p-4 max-h-[600px] overflow-y-auto">
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
                    This file type ({{ document?.file_type?.toUpperCase() }}) cannot be previewed in the browser.
                  </p>
                  <button
                    v-if="document?.download_url"
                    @click="handleDownload"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Document
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { hrAPI } from '../api/hrAPI'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  document: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'download'])

const previewUrl = ref('')
const error = ref('')
const textContent = ref('')
const loading = ref(false)

const isPdf = computed(() => {
  if (!props.document?.file_type) return false
  const fileType = props.document.file_type.toLowerCase()
  return fileType === 'application/pdf' || fileType === 'pdf'
})

const isImage = computed(() => {
  if (!props.document?.file_type) return false
  const fileType = props.document.file_type.toLowerCase()
  const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'jpeg', 'jpg', 'png', 'gif', 'webp']
  return imageTypes.includes(fileType)
})

const isText = computed(() => {
  if (!props.document?.file_type) return false
  const fileType = props.document.file_type.toLowerCase()
  return fileType === 'text/plain' || fileType === 'txt'
})

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const loadPreview = async () => {
  if (!props.document) {
    error.value = 'No document provided'
    return
  }

  const docId = props.document.document_id || props.document.id
  const employeeId = props.document.employee_id

  if (!docId || !employeeId) {
    error.value = 'Document ID or Employee ID not found'
    return
  }

  // Follow the same pattern as download: use Axios API call with Authorization header
  // This ensures same authentication flow as download
  try {
    loading.value = true
    error.value = ''
    
    // Use hrAPI.previewDocument (same pattern as downloadDocument)
    // This uses Axios with Authorization header automatically
    const response = await hrAPI.previewDocument(employeeId, docId)
    
    // Create blob from response (same as download)
    const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' })
    
    // Create object URL from blob (same pattern as download)
    previewUrl.value = URL.createObjectURL(blob)
    error.value = ''
  } catch (err) {
    console.error('Error loading preview:', err)
    error.value = err.response?.data?.message || err.message || 'Failed to load document preview'
    previewUrl.value = ''
  } finally {
    loading.value = false
  }
}

const handleDownload = () => {
  if (props.document?.download_url) {
    emit('download', props.document)
  }
}

const closeModal = () => {
  // Clean up blob URL to prevent memory leaks
  if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = ''
  error.value = ''
  textContent.value = ''
  loading.value = false
  emit('close')
}

// Watch for document and show prop changes
watch([() => props.document, () => props.show], ([newDoc, isShowing]) => {
  if (isShowing && newDoc) {
    loadPreview()
  } else {
    // Clean up blob URL when modal closes
    if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl.value)
    }
    previewUrl.value = ''
    error.value = ''
    textContent.value = ''
    loading.value = false
  }
}, { immediate: true, deep: true })

onUnmounted(() => {
  // Clean up blob URL to prevent memory leaks
  if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = ''
  error.value = ''
  textContent.value = ''
  loading.value = false
})
</script>

