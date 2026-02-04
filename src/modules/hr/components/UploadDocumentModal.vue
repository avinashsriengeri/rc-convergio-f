<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click="$emit('close')"
  >
    <div
      class="relative top-20 mx-auto p-8 border w-full max-w-2xl shadow-xl rounded-xl bg-white"
      @click.stop
    >
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-bold text-gray-900">Upload Document</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-500 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="space-y-6">
          <!-- Document Type Selection -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Document Type *
            </label>
            <select
              v-model="formData.document_type_id"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            >
              <option :value="null">Select document type</option>
              <option
                v-for="docType in documentTypes"
                :key="docType.id"
                :value="docType.id"
                :selected="docType.id === preselectedType"
              >
                {{ docType.name }}
                <span v-if="docType.is_mandatory"> (Mandatory)</span>
              </option>
            </select>
            
            <!-- Document Type Info -->
            <div
              v-if="selectedDocumentType"
              class="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <p v-if="selectedDocumentType.description" class="text-sm text-gray-700 mb-2">
                {{ selectedDocumentType.description }}
              </p>
              <div class="flex flex-wrap gap-4 text-xs text-gray-600">
                <span v-if="selectedDocumentType.allowed_file_types && selectedDocumentType.allowed_file_types.length > 0">
                  <strong>Allowed:</strong> {{ selectedDocumentType.allowed_file_types.join(', ').toUpperCase() }}
                </span>
                <span v-if="selectedDocumentType.max_file_size_mb">
                  <strong>Max Size:</strong> {{ selectedDocumentType.max_file_size_mb }} MB
                </span>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              v-model="formData.description"
              rows="2"
              placeholder="Add any notes about this document..."
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-purple focus:border-transparent"
            ></textarea>
          </div>

          <!-- File Upload -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Document File *
            </label>
            <div
              class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-purple transition-colors"
              :class="{ 'border-primary-purple bg-purple-50': isDragging }"
              @drop="handleDrop"
              @dragover.prevent="isDragging = true"
              @dragleave="isDragging = false"
            >
              <input
                ref="fileInput"
                type="file"
                required
                :accept="fileAccept"
                @change="handleFileSelect"
                class="hidden"
              />
              <svg
                v-if="!formData.file"
                class="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div v-if="!formData.file" class="mt-4">
                <button
                  type="button"
                  @click="fileInput?.click()"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink transition-colors"
                >
                  Select File
                </button>
                <p class="mt-2 text-sm text-gray-500">
                  or drag and drop
                </p>
                <p v-if="selectedDocumentType" class="mt-1 text-xs text-gray-400">
                  {{ fileAcceptText }}
                </p>
              </div>
              <div v-else class="mt-4">
                <div class="flex items-center justify-center">
                  <svg class="h-8 w-8 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div class="text-left">
                    <p class="text-sm font-medium text-gray-900">{{ formData.file.name }}</p>
                    <p class="text-xs text-gray-500">{{ formatFileSize(formData.file.size) }}</p>
                  </div>
                  <button
                    type="button"
                    @click="formData.file = null"
                    class="ml-4 text-red-600 hover:text-red-800"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Validation Error -->
          <div v-if="validationError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-800">{{ validationError }}</p>
          </div>
        </div>
        
        <div class="flex justify-end gap-3 mt-8">
          <button
            type="button"
            @click="$emit('close')"
            class="px-5 py-2.5 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="uploading || !formData.file"
            class="px-5 py-2.5 text-sm font-medium rounded-lg text-white bg-primary-purple hover:bg-primary-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-purple transition-all shadow-sm hover:shadow-md disabled:opacity-50"
          >
            {{ uploading ? 'Uploading...' : 'Upload Document' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useHrEmployeeDocumentsStore } from '../store/hrEmployeeDocuments'
import { success as showSuccess, error as showError } from '@/utils/notifications'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  documentTypes: {
    type: Array,
    default: () => []
  },
  preselectedType: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['close', 'uploaded'])

const employeeDocumentsStore = useHrEmployeeDocumentsStore()

const uploading = ref(false)
const isDragging = ref(false)
const fileInput = ref(null)
const validationError = ref('')

const formData = ref({
  document_type_id: null,
  description: '',
  file: null
})

const selectedDocumentType = computed(() => {
  if (!formData.value.document_type_id) return null
  return props.documentTypes.find(dt => dt.id === formData.value.document_type_id)
})

const fileAccept = computed(() => {
  if (!selectedDocumentType.value?.allowed_file_types || selectedDocumentType.value.allowed_file_types.length === 0) {
    return '*/*'
  }
  return selectedDocumentType.value.allowed_file_types.map(ext => `.${ext}`).join(',')
})

const fileAcceptText = computed(() => {
  if (!selectedDocumentType.value) return ''
  const types = selectedDocumentType.value.allowed_file_types
  if (!types || types.length === 0) return 'All file types allowed'
  return `Allowed: ${types.join(', ').toUpperCase()}, Max: ${selectedDocumentType.value.max_file_size_mb}MB`
})

watch(() => props.preselectedType, (newVal) => {
  if (newVal) {
    formData.value.document_type_id = newVal
  }
}, { immediate: true })

watch(() => props.show, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})

const resetForm = () => {
  formData.value = {
    document_type_id: props.preselectedType || null,
    description: '',
    file: null
  }
  validationError.value = ''
  isDragging.value = false
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const validateFile = (file) => {
  validationError.value = ''
  
  if (!selectedDocumentType.value) {
    return true
  }

  // Check file type
  if (selectedDocumentType.value.allowed_file_types && selectedDocumentType.value.allowed_file_types.length > 0) {
    const fileExt = file.name.split('.').pop().toLowerCase()
    if (!selectedDocumentType.value.allowed_file_types.includes(fileExt)) {
      validationError.value = `Invalid file type. Allowed types: ${selectedDocumentType.value.allowed_file_types.join(', ').toUpperCase()}`
      return false
    }
  }

  // Check file size
  if (selectedDocumentType.value.max_file_size_mb) {
    const maxSizeBytes = selectedDocumentType.value.max_file_size_mb * 1024 * 1024
    if (file.size > maxSizeBytes) {
      validationError.value = `File size exceeds maximum allowed size of ${selectedDocumentType.value.max_file_size_mb}MB`
      return false
    }
  }

  return true
}

const handleFileSelect = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    if (validateFile(file)) {
      formData.value.file = file
    } else {
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  event.preventDefault()
  const file = event.dataTransfer.files?.[0]
  if (file) {
    if (validateFile(file)) {
      formData.value.file = file
    }
  }
}

const handleSubmit = async () => {
  if (!formData.value.file) {
    validationError.value = 'Please select a file'
    return
  }

  if (!validateFile(formData.value.file)) {
    return
  }

  uploading.value = true
  validationError.value = ''
  
  try {
    const uploadData = {
      document_type_id: formData.value.document_type_id,
      file: formData.value.file
    }
    
    if (formData.value.description) {
      uploadData.description = formData.value.description
    }
    
    await employeeDocumentsStore.uploadDocument(uploadData)
    
    showSuccess('Document uploaded successfully. It will be reviewed by HR.')
    emit('uploaded')
    resetForm()
    emit('close')
  } catch (err) {
    validationError.value = err.response?.data?.message || err.message || 'Failed to upload document'
    showError(validationError.value)
  } finally {
    uploading.value = false
  }
}
</script>

