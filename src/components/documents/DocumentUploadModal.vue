<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="handleCancel"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form @submit.prevent="handleSubmit">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Add Document
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Upload a new document or attach an existing one from your library.
                  </p>
                </div>

                <!-- Tab Navigation -->
                <div class="mt-4">
                  <div class="border-b border-gray-200">
                    <nav class="-mb-px flex space-x-8">
                      <button
                        @click="activeTab = 'upload'"
                        :class="[
                          'py-2 px-1 border-b-2 font-medium text-sm',
                          activeTab === 'upload'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        ]"
                      >
                        <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Upload New
                      </button>
                      <button
                        @click="activeTab = 'attach'"
                        :class="[
                          'py-2 px-1 border-b-2 font-medium text-sm',
                          activeTab === 'attach'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        ]"
                      >
                        <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        Attach Existing
                      </button>
                    </nav>
                  </div>
                </div>

                <!-- Upload New Tab Content -->
                <div v-if="activeTab === 'upload'" class="mt-4">
                  <div
                    @click="triggerFileInput"
                    @dragover.prevent
                    @drop.prevent="handleDrop"
                    :class="[
                      'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                      dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    ]"
                  >
                    <input
                      ref="fileInput"
                      type="file"
                      @change="handleFileSelect"
                      class="hidden"
                      :accept="acceptedFileTypes"
                    />
                    <div v-if="!selectedFile">
                      <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <div class="mt-2">
                        <p class="text-sm text-gray-600">
                          <span class="font-medium text-blue-600 hover:text-blue-500">Click to upload</span>
                          or drag and drop
                        </p>
                        <p class="text-xs text-gray-500 mt-1">
                          PDF, DOC, XLS, PPT, JPG, PNG, ZIP and more
                        </p>
                      </div>
                    </div>
                    <div v-else class="text-left">
                      <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div class="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                            {{ helpers.getFileTypeIcon(selectedFile.type.split('/').pop()) }}
                          </div>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 truncate">
                            {{ selectedFile.name }}
                          </p>
                          <p class="text-sm text-gray-500">
                            {{ helpers.formatFileSize(selectedFile.size) }}
                          </p>
                        </div>
                        <button
                          type="button"
                          @click.stop="removeFile"
                          class="flex-shrink-0 p-1 text-gray-400 hover:text-red-500"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- File Validation Errors -->
                  <div v-if="fileErrors.length > 0" class="mt-2">
                    <div v-for="error in fileErrors" :key="error" class="text-sm text-red-600">
                      {{ error }}
                    </div>
                  </div>
                </div>

                <!-- Attach Existing Tab Content -->
                <div v-else-if="activeTab === 'attach'" class="mt-4">
                  <div class="space-y-4">
                    <!-- Search/Filter -->
                    <div>
                      <label for="document-search" class="block text-sm font-medium text-gray-700 mb-2">
                        Search Documents
                      </label>
                      <div class="relative">
                        <input
                          v-model="documentSearch"
                          type="text"
                          id="document-search"
                          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Search by title, description, or file type..."
                          @input="searchDocuments"
                        />
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <!-- Documents List -->
                    <div class="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
                      <div v-if="loadingDocuments" class="p-4 text-center">
                        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                        <p class="text-sm text-gray-500 mt-2">Loading documents...</p>
                      </div>
                      
                      <div v-else-if="filteredDocuments.length === 0" class="p-4 text-center text-gray-500">
                        <svg class="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p class="text-sm">No documents found</p>
                        <p class="text-xs text-gray-400 mt-1">Try adjusting your search or upload a new document</p>
                      </div>

                      <div v-else class="divide-y divide-gray-200">
                        <div
                          v-for="document in filteredDocuments"
                          :key="document.id"
                          @click="selectExistingDocument(document)"
                          :class="[
                            'p-3 cursor-pointer hover:bg-gray-50 transition-colors',
                            selectedExistingDocument?.id === document.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                          ]"
                        >
                          <div class="flex items-center space-x-3">
                            <div class="flex-shrink-0">
                              <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm">
                                {{ helpers.getFileTypeIcon(document.file_type?.split('/').pop()) }}
                              </div>
                            </div>
                            <div class="flex-1 min-w-0">
                              <p class="text-sm font-medium text-gray-900 truncate">
                                {{ document.title || document.file_name }}
                              </p>
                              <div class="flex items-center space-x-2 text-xs text-gray-500">
                                <span>{{ helpers.formatFileSize(document.file_size) }}</span>
                                <span>•</span>
                                <span>{{ document.file_type?.toUpperCase() }}</span>
                                <span>•</span>
                                <span>{{ helpers.formatDate(document.created_at) }}</span>
                              </div>
                            </div>
                            <div v-if="selectedExistingDocument?.id === document.id" class="flex-shrink-0">
                              <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Document Metadata -->
                <div class="mt-6 space-y-4">
                  <!-- Title -->
                  <div>
                    <label for="title" class="block text-sm font-medium text-gray-700">
                      Title <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.title"
                      type="text"
                      id="title"
                      required
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': !form.title.trim() && selectedFile }"
                      placeholder="Enter a title for this document"
                    />
                    <p v-if="!form.title.trim() && selectedFile" class="mt-1 text-sm text-red-600">
                      Please enter a title before uploading
                    </p>
                  </div>

                  <!-- Description -->
                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      v-model="form.description"
                      id="description"
                      rows="3"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter document description (optional)"
                    />
                  </div>

                  <!-- Visibility -->
                  <div>
                    <label for="visibility" class="block text-sm font-medium text-gray-700">
                      Visibility
                    </label>
                    <select
                      v-model="form.visibility"
                      id="visibility"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="private">Private</option>
                      <option value="team">Team</option>
                      <option value="tenant">Tenant</option>
                      <option value="public">Public</option>
                    </select>
                  </div>

                  <!-- Owner (if admin) -->
                  <div v-if="isAdmin">
                    <label for="owner_id" class="block text-sm font-medium text-gray-700">
                      Owner
                    </label>
                    <select
                      v-model="form.owner_id"
                      id="owner_id"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select owner</option>
                      <option v-for="user in users" :key="user.id" :value="user.id">
                        {{ user.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div v-if="uploading" class="px-4 pb-4">
            <div class="bg-gray-200 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
            </div>
            <p class="text-sm text-gray-600 mt-2 text-center">
              Uploading... {{ uploadProgress }}%
            </p>
          </div>

          <!-- Modal Actions -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <BaseButton
              type="submit"
              :loading="uploading"
              :disabled="!canSubmit"
              :title="!canSubmit && activeTab === 'upload' && !form.title.trim() ? 'Please enter a title' : ''"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ activeTab === 'upload' ? 'Upload' : 'Attach' }}
            </BaseButton>
            <BaseButton
              type="button"
              variant="outline"
              @click="handleCancel"
              :disabled="uploading"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useDocuments } from '@/composables/useDocuments'
import { useContext } from '@/composables/useContext'
import { useNotifications } from '@/composables/useNotifications'
import { fetchUsersForDropdown } from '@/helpers/fetchUsersForDropdown'
import BaseButton from '@/components/ui/BaseButton.vue'

// Props
const props = defineProps({
  relatedType: {
    type: String,
    default: ''
  },
  relatedId: {
    type: [Number, String],
    default: null
  }
})

// Emits
const emit = defineEmits(['close', 'uploaded'])

// Composables
const { uploadDocument, linkDocument, fetchDocuments, helpers } = useDocuments()
const { isAdmin } = useContext()
const { success, error: showError } = useNotifications()

// State
const activeTab = ref('upload')
const selectedFile = ref(null)
const dragOver = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const fileInput = ref(null)
const users = ref([])

// Attach existing document state
const documents = ref([])
const filteredDocuments = ref([])
const loadingDocuments = ref(false)
const documentSearch = ref('')
const selectedExistingDocument = ref(null)

const form = ref({
  title: '',
  description: '',
  visibility: 'private',
  owner_id: ''
})

// Computed
const acceptedFileTypes = computed(() => {
  const types = helpers.getAllowedFileTypes()
  return types.map(type => `.${type}`).join(',')
})

const fileErrors = computed(() => {
  const errors = []
  
  if (selectedFile.value) {
    const fileType = selectedFile.value.type.split('/').pop()
    
    if (!helpers.isFileTypeAllowed(fileType)) {
      errors.push('File type not allowed')
    }
    
    if (!helpers.isFileSizeAllowed(selectedFile.value.size)) {
      errors.push('File size exceeds 50MB limit')
    }
  }
  
  return errors
})

const canSubmit = computed(() => {
  if (activeTab.value === 'upload') {
    return selectedFile.value && fileErrors.value.length === 0 && form.value.title.trim() !== ''
  } else {
    return selectedExistingDocument.value !== null
  }
})

// Methods
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    setSelectedFile(file)
  }
}

const handleDrop = (event) => {
  dragOver.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    setSelectedFile(file)
  }
}

const setSelectedFile = (file) => {
  selectedFile.value = file
  // Don't auto-fill title - user must enter it manually
}

const removeFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleSubmit = async () => {
  if (activeTab.value === 'upload') {
    await handleUpload()
  } else {
    await handleAttach()
  }
}

const handleUpload = async () => {
  if (!selectedFile.value || fileErrors.value.length > 0) {
    return
  }

  try {
    uploading.value = true
    uploadProgress.value = 0

    // Simulate progress (in real app, you'd track actual upload progress)
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 200)

    const metadata = {
      ...form.value,
      related_type: props.relatedType,
      related_id: props.relatedId
    }

    const response = await uploadDocument(selectedFile.value, metadata)
    
    clearInterval(progressInterval)
    uploadProgress.value = 100
    
    // Show success notification
    const fileName = response.data?.title || response.data?.file_name || 'Document'
    success(`📄 ${fileName} uploaded successfully!`, 4000)
    
    // Emit success event and close modal
    emit('uploaded', response.data)
    emit('close')
  } catch (error) {
    console.error('Upload error:', error)
    showError('❌ Failed to upload document. Please try again.', 5000)
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

const handleAttach = async () => {
  if (!selectedExistingDocument.value) {
    return
  }

  try {
    uploading.value = true

    const response = await linkDocument(
      selectedExistingDocument.value.id,
      props.relatedType,
      props.relatedId
    )
    
    // Show success notification
    const documentName = selectedExistingDocument.value.title || selectedExistingDocument.value.file_name
    success(`📎 ${documentName} attached successfully!`, 4000)
    
    // Emit success event with the FULL response data (includes relationships array)
    emit('uploaded', response.data)
    emit('close')
  } catch (error) {
    console.error('Attach error:', error)
    showError('❌ Failed to attach document. Please try again.', 5000)
  } finally {
    uploading.value = false
  }
}

const loadUsers = async () => {
  if (isAdmin.value) {
    try {
      users.value = await fetchUsersForDropdown()
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }
}

// Attach existing document methods
const loadDocuments = async () => {
  try {
    loadingDocuments.value = true
    const response = await fetchDocuments({ 
      per_page: 100, // Load more documents for selection
      sort_by: 'created_at',
      sort_order: 'desc'
    })
    documents.value = response.data || []
    filteredDocuments.value = documents.value
  } catch (error) {
    console.error('Error loading documents:', error)
  } finally {
    loadingDocuments.value = false
  }
}

const searchDocuments = () => {
  const searchTerm = documentSearch.value.toLowerCase()
  if (!searchTerm) {
    filteredDocuments.value = documents.value
    return
  }

  filteredDocuments.value = documents.value.filter(doc => {
    const title = (doc.title || doc.file_name || '').toLowerCase()
    const description = (doc.description || '').toLowerCase()
    const fileType = (doc.file_type || '').toLowerCase()
    
    return title.includes(searchTerm) || 
           description.includes(searchTerm) || 
           fileType.includes(searchTerm)
  })
}

const selectExistingDocument = (document) => {
  selectedExistingDocument.value = document
}

const resetForm = () => {
  selectedFile.value = null
  selectedExistingDocument.value = null
  documentSearch.value = ''
  form.value = {
    title: '',
    description: '',
    visibility: 'private',
    owner_id: ''
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleCancel = () => {
  resetForm()
  emit('close')
}

// Watch for tab changes to load documents when needed
watch(activeTab, (newTab) => {
  if (newTab === 'attach' && documents.value.length === 0) {
    loadDocuments()
  }
  // Reset form when switching tabs
  resetForm()
})

// Lifecycle
onMounted(() => {
  loadUsers()
})
</script>

<script>
export default {
  name: 'DocumentUploadModal'
}
</script>
