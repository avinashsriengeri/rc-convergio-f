<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click.self="close">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="close"></div>
      
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Upload Documents</h3>
            <button
              @click="close"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <!-- Checklist Item Info -->
              <div v-if="checklistItem" class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p class="text-sm font-medium text-blue-900">{{ checklistItem.name }}</p>
                <p v-if="checklistItem.description" class="text-xs text-blue-700 mt-1">{{ checklistItem.description }}</p>
              </div>
              
              <!-- Required Documents List -->
              <div v-if="requiredDocuments && requiredDocuments.length > 0">
                <label class="block text-sm font-medium text-gray-700 mb-2">Required Documents</label>
                <ul class="list-disc list-inside text-sm text-gray-600 space-y-1 mb-4">
                  <li v-for="doc in requiredDocuments" :key="doc">{{ doc }}</li>
                </ul>
              </div>
              
              <!-- File Uploads -->
              <div class="space-y-3">
                <div v-for="(file, index) in files" :key="index" class="border border-gray-300 rounded-lg p-3">
                  <div class="flex items-center justify-between mb-2">
                    <label class="block text-sm font-medium text-gray-700">
                      Document {{ index + 1 }}
                      <span v-if="requiredDocuments && index < requiredDocuments.length" class="text-red-500">*</span>
                    </label>
                    <button
                      v-if="files.length > 1"
                      type="button"
                      @click="removeFile(index)"
                      class="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    :ref="el => fileInputs[index] = el"
                    type="file"
                    :required="requiredDocuments && index < requiredDocuments.length"
                    @change="handleFileChange(index, $event)"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <div v-if="file.name" class="mt-2 flex items-center text-sm text-gray-600">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {{ file.name }} ({{ formatFileSize(file.size) }})
                  </div>
                </div>
              </div>
              
              <!-- Add More Files Button -->
              <button
                type="button"
                @click="addFileInput"
                class="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Another Document
              </button>
              
              <!-- Notes -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  v-model="notes"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any notes about these documents..."
                ></textarea>
              </div>
            </div>
            
            <div class="mt-6 flex items-center justify-end space-x-3">
              <button
                type="button"
                @click="close"
                class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="uploading || !hasFiles"
                class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ uploading ? 'Uploading...' : 'Upload Documents' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  checklistItem: {
    type: Object,
    default: null
  },
  requiredDocuments: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'upload'])

const files = ref([{ name: null, file: null }])
const fileInputs = ref([])
const notes = ref('')
const uploading = ref(false)

const hasFiles = computed(() => {
  return files.value.some(f => f.file !== null)
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    // Reset form when modal opens
    files.value = [{ name: null, file: null }]
    notes.value = ''
    uploading.value = false
  }
})

const handleFileChange = (index, event) => {
  const file = event.target.files[0]
  if (file) {
    files.value[index] = {
      name: file.name,
      file: file,
      size: file.size
    }
  }
}

const addFileInput = () => {
  files.value.push({ name: null, file: null })
}

const removeFile = (index) => {
  files.value.splice(index, 1)
  if (files.value.length === 0) {
    files.value = [{ name: null, file: null }]
  }
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const handleSubmit = async () => {
  if (!hasFiles.value) return
  
  uploading.value = true
  try {
    const fileList = files.value.filter(f => f.file !== null).map(f => f.file)
    await emit('upload', {
      files: fileList,
      notes: notes.value
    })
    close()
  } catch (err) {
    console.error('Upload error:', err)
  } finally {
    uploading.value = false
  }
}

const close = () => {
  emit('close')
}
</script>


