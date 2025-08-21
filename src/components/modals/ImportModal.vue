<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl max-w-md w-full">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">
            Import Contacts
          </h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="space-y-4">
          <!-- File upload area -->
          <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#2596be] transition-colors cursor-pointer"
            :class="{ 'border-[#2596be] bg-[#2596be]/5': isDragOver }"
            @click="fileInput?.click()"
            @drop.prevent="handleDrop"
            @dragover.prevent="isDragOver = true"
            @dragleave.prevent="isDragOver = false"
          >
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p class="text-sm text-gray-600 mb-2">
              <span class="font-medium text-[#2596be]">Click to upload</span> or drag and drop
            </p>
            <p class="text-xs text-gray-500">CSV file (max 10MB)</p>
            <input
              ref="fileInput"
              type="file"
              accept=".csv"
              class="hidden"
              @change="handleFileSelect"
            />
          </div>

          <!-- Selected file info -->
          <div v-if="selectedFile" class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ selectedFile.name }}</p>
                  <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
                </div>
              </div>
              <button
                @click="removeFile"
                class="text-red-500 hover:text-red-700 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Instructions -->
          <div class="bg-blue-50 rounded-lg p-4">
            <h3 class="text-sm font-medium text-blue-900 mb-2">CSV Format Requirements:</h3>
            <ul class="text-xs text-blue-800 space-y-1">
              <li>• Required columns: first_name, last_name, email</li>
              <li>• Optional columns: phone, lifecycle_stage, source, tags</li>
              <li>• Lifecycle stage values: lead, prospect, customer, inactive</li>
              <li>• Tags should be comma-separated values</li>
              <li>• Note: owner_id will be automatically set to your user account</li>
              <li>• Maximum file size: 10MB</li>
            </ul>
            <div class="mt-3">
              <button
                @click="downloadSampleCSV"
                class="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Download Sample CSV
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-3 pt-4">
            <BaseButton
              type="button"
              variant="outline"
              @click="$emit('close')"
            >
              Cancel
            </BaseButton>
            <BaseButton
              type="button"
              variant="primary"
              :loading="loading"
              :disabled="!selectedFile"
              @click="handleImport"
            >
              Import Contacts
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
import { contactsAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'

const emit = defineEmits(['close', 'imported'])

const { success, error } = useNotifications()

const loading = ref(false)
const isDragOver = ref(false)
const selectedFile = ref(null)
const fileInput = ref(null)

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const handleDrop = (event) => {
  isDragOver.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const validateAndSetFile = (file) => {
  // Check file type
  if (!file.name.toLowerCase().endsWith('.csv')) {
    error('Please select a CSV file')
    return
  }

  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    error('File size must be less than 10MB')
    return
  }

  selectedFile.value = file
}

const removeFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const downloadSampleCSV = () => {
  const csvContent = `first_name,last_name,email,phone,lifecycle_stage,source,tags
John,Doe,john.doe@example.com,+1234567890,lead,website,"lead,new"
Jane,Smith,jane.smith@example.com,+1987654321,prospect,referral,"prospect,hot"
Mike,Johnson,mike.johnson@example.com,+1122334455,customer,email,"customer,vip"`

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'sample_contacts.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

const handleImport = async () => {
  if (!selectedFile.value) return

  loading.value = true

  try {
    console.log('Starting import for file:', selectedFile.value.name)
    const response = await contactsAPI.importCSV(selectedFile.value)
    console.log('Import response:', response)
    
    // Check if it's an async job (202 status)
    if (response.status === 202) {
      const jobId = response.data.data.job_id
      console.log('Import job started with ID:', jobId)
      
      // Show processing message
      success('Import started successfully. Processing your contacts...')
      
      // Poll for job completion
      await pollJobCompletion(jobId)
      
      // Job completed, refresh contacts
      emit('imported')
    } else {
      // Immediate success
      success('Contacts imported successfully')
      emit('imported')
    }
  } catch (err) {
    console.error('Import error:', err)
    console.error('Error response:', err.response?.data)
    if (err.response?.data?.message) {
      error(err.response.data.message)
    } else {
      error('Failed to import contacts. Please check your CSV format.')
    }
  } finally {
    loading.value = false
  }
}

const pollJobCompletion = async (jobId) => {
  const maxAttempts = 30 // 30 seconds max
  let attempts = 0
  
  while (attempts < maxAttempts) {
    try {
      console.log(`Checking job status (attempt ${attempts + 1})...`)
      
      // For now, just wait and assume job completes
      // In a real implementation, you'd check job status via API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // If we reach here, assume job is complete
      console.log('Job appears to be complete')
      return true
      
    } catch (error) {
      console.error('Error checking job status:', error)
      attempts++
      
      if (attempts >= maxAttempts) {
        throw new Error('Job processing timeout')
      }
    }
  }
}
</script>
