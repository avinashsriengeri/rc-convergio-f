<template>
  <div
    class="fixed inset-0 z-50 overflow-y-auto"
    @click="$emit('close')"
  >
    <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6" @click.stop>
        <div class="sm:flex sm:items-start">
          <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              Import Scoring Rules
            </h3>
            
            <form @submit.prevent="handleImport" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Select File</label>
                <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div class="space-y-1 text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="flex text-sm text-gray-600">
                      <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          class="sr-only"
                          @change="handleFileSelect"
                          accept=".json,.csv"
                          required
                        >
                      </label>
                      <p class="pl-1">or drag and drop</p>
                    </div>
                    <p class="text-xs text-gray-500">JSON or CSV up to 10MB</p>
                  </div>
                </div>
                
                <!-- File Info -->
                <div v-if="selectedFile" class="mt-3 p-3 bg-gray-50 rounded-md">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <svg class="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ selectedFile.name }}</p>
                        <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      @click="removeFile"
                      class="text-gray-400 hover:text-gray-600"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <p class="mt-1 text-xs text-gray-500">Supported formats: JSON, CSV</p>
              </div>

              <!-- Preview/Validation -->
              <div v-if="filePreview" class="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 class="text-sm font-medium text-blue-900 mb-2">File Preview</h4>
                <div class="text-xs text-blue-800">
                  <p><strong>Format:</strong> {{ filePreview.format }}</p>
                  <p><strong>Rules detected:</strong> {{ filePreview.rulesCount }}</p>
                  <p v-if="filePreview.errors.length > 0" class="text-red-600 mt-1">
                    <strong>Validation errors:</strong> {{ filePreview.errors.join(', ') }}
                  </p>
                </div>
              </div>

              <!-- Import Options -->
              <div v-if="selectedFile" class="space-y-3">
                <div class="flex items-center">
                  <input
                    id="overwrite-existing"
                    v-model="importOptions.overwriteExisting"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="overwrite-existing" class="ml-2 block text-sm text-gray-900">
                    Overwrite existing rules with same name
                  </label>
                </div>
                
                <div class="flex items-center">
                  <input
                    id="activate-imported"
                    v-model="importOptions.activateImported"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="activate-imported" class="ml-2 block text-sm text-gray-900">
                    Activate imported rules automatically
                  </label>
                </div>
              </div>

              <!-- Import Progress -->
              <Transition
                enter-active-class="transition ease-out duration-300"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-200"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-if="importing" class="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span class="text-sm font-medium text-blue-900">Importing rules...</span>
                  </div>
                </div>
              </Transition>

              <!-- Import Result -->
              <Transition
                enter-active-class="transition ease-out duration-300"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-200"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-if="importResult" class="bg-green-50 border border-green-200 rounded-md p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-green-800">Import Successful</h3>
                      <div class="mt-2 text-sm text-green-700">
                        <p><strong>Rules imported:</strong> {{ importResult.imported }}</p>
                        <p v-if="importResult.updated"><strong>Rules updated:</strong> {{ importResult.updated }}</p>
                        <p v-if="importResult.skipped"><strong>Rules skipped:</strong> {{ importResult.skipped }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>

              <!-- Error Display -->
              <Transition
                enter-active-class="transition ease-out duration-300"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-200"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-red-800">Import Failed</h3>
                      <div class="mt-2 text-sm text-red-700">
                        <p>{{ error }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>

              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  :disabled="importing || !selectedFile || (filePreview && filePreview.errors.length > 0)"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400"
                >
                  {{ importing ? 'Importing...' : 'Import Rules' }}
                </button>
                <button
                  type="button"
                  @click="$emit('close')"
                  :disabled="importing"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'import'])

const selectedFile = ref(null)
const importing = ref(false)
const importResult = ref(null)
const error = ref(null)
const filePreview = ref(null)

const importOptions = ref({
  overwriteExisting: false,
  activateImported: true
})

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    validateFile(file)
  }
}

const removeFile = () => {
  selectedFile.value = null
  filePreview.value = null
  error.value = null
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const validateFile = async (file) => {
  try {
    const text = await file.text()
    let data
    let format
    let rulesCount = 0
    const errors = []

    if (file.name.endsWith('.json')) {
      format = 'JSON'
      try {
        data = JSON.parse(text)
        if (Array.isArray(data)) {
          rulesCount = data.length
          // Basic validation
          data.forEach((rule, index) => {
            if (!rule.name) errors.push(`Rule ${index + 1}: Missing name`)
            if (!rule.points) errors.push(`Rule ${index + 1}: Missing points`)
            if (!rule.condition) errors.push(`Rule ${index + 1}: Missing condition`)
          })
        } else {
          errors.push('JSON must be an array of rules')
        }
      } catch (e) {
        errors.push('Invalid JSON format')
      }
    } else if (file.name.endsWith('.csv')) {
      format = 'CSV'
      const lines = text.split('\n').filter(line => line.trim())
      rulesCount = Math.max(0, lines.length - 1) // Exclude header
      
      if (lines.length < 2) {
        errors.push('CSV must have at least one data row')
      } else {
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
        const requiredHeaders = ['name', 'points', 'condition']
        requiredHeaders.forEach(header => {
          if (!headers.includes(header)) {
            errors.push(`Missing required column: ${header}`)
          }
        })
      }
    } else {
      errors.push('Unsupported file format')
    }

    filePreview.value = {
      format,
      rulesCount,
      errors
    }
  } catch (e) {
    error.value = 'Failed to read file'
  }
}

const handleImport = async () => {
  if (!selectedFile.value) return
  
  importing.value = true
  error.value = null
  importResult.value = null
  
  try {
    const result = await emit('import', selectedFile.value)
    importResult.value = result || { imported: 1 }
  } catch (err) {
    error.value = err.message || 'Failed to import rules'
  } finally {
    importing.value = false
  }
}
</script>