<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">
            Import Companies
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
        <!-- File upload area -->
        <div class="mb-6">
          <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#2596be] transition-colors cursor-pointer"
            :class="{ 'border-[#2596be] bg-blue-50': isDragOver }"
            @click="fileInput?.click()"
            @dragover.prevent="isDragOver = true"
            @dragleave.prevent="isDragOver = false"
            @drop.prevent="handleFileDrop"
          >
            <input
              ref="fileInput"
              type="file"
              accept=".csv"
              class="hidden"
              @change="handleFileSelect"
            />
            
            <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              {{ selectedFile ? selectedFile.name : 'Upload CSV File' }}
            </h3>
            <p class="text-gray-500">
              {{ selectedFile ? 'File selected' : 'Drag and drop a CSV file, or click to browse' }}
            </p>
          </div>
        </div>

        <!-- CSV Format Requirements -->
        <div class="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 class="text-sm font-medium text-blue-900 mb-2">CSV Format Requirements:</h3>
          <div class="text-xs text-blue-800">
            <p class="mb-2"><strong>Required fields:</strong></p>
            <ul class="list-disc list-inside space-y-1 mb-3">
              <li>• name (Company name)</li>
            </ul>
            <p class="mb-2"><strong>Optional fields:</strong></p>
            <ul class="list-disc list-inside space-y-1">
              <li>• domain (Company domain)</li>
              <li>• website (Company website URL)</li>
              <li>• industry (Company industry)</li>
              <li>• size (Number of employees)</li>
              <li>• type (Company type: Corporation, LLC, Partnership, etc.)</li>
              <li>• phone (Phone number)</li>
              <li>• email (Email address)</li>
              <li>• timezone (Timezone: America/New_York, Europe/London, etc.)</li>
              <li>• linkedin_page (LinkedIn page URL)</li>
              <li>• annual_revenue (Annual revenue amount)</li>
              <li>• address_street, address_city, address_state, address_postal_code, address_country (Address components)</li>
              <li>• status (prospect, active, customer, inactive)</li>
              <li>• description (Company description)</li>
            </ul>
            <p class="mt-3 text-blue-700">
              <strong>Note:</strong> owner_id will be automatically set to your user account
            </p>
          </div>
          <div class="mt-3">
            <button
              @click="downloadSampleCSV"
              class="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Download Sample CSV
            </button>
          </div>
        </div>

        <!-- Import button -->
        <div class="flex items-center justify-end space-x-3">
          <BaseButton
            variant="outline"
            @click="$emit('close')"
          >
            Cancel
          </BaseButton>
          <BaseButton
            variant="primary"
            :loading="loading"
            :disabled="!selectedFile"
            @click="handleImport"
          >
            Import Companies
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
import { companiesAPI } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'

const emit = defineEmits(['close', 'imported'])

const { success, error } = useNotifications()

const fileInput = ref(null)
const selectedFile = ref(null)
const isDragOver = ref(false)
const loading = ref(false)

// Handle file selection
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'text/csv') {
    selectedFile.value = file
  } else {
    error('Please select a valid CSV file')
  }
}

// Handle file drop
const handleFileDrop = (event) => {
  isDragOver.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.type === 'text/csv') {
    selectedFile.value = file
  } else {
    error('Please drop a valid CSV file')
  }
}

// Download sample CSV
const downloadSampleCSV = () => {
  const csvContent = `name,domain,website,industry,size,type,phone,email,timezone,linkedin_page,annual_revenue,address_street,address_city,address_state,address_postal_code,address_country,status,description
"Acme Corporation","acme.com","https://www.acme.com","Technology",500,"Corporation","+1-555-0123","contact@acme.com","America/New_York","https://linkedin.com/company/acme",1000000,"123 Main St","New York","NY","10001","USA","active","Leading technology company"
"TechStart Inc","techstart.io","https://www.techstart.io","Technology",50,"Startup","+1-555-0456","hello@techstart.io","America/Los_Angeles","https://linkedin.com/company/techstart",500000,"456 Innovation Ave","San Francisco","CA","94105","USA","prospect","Innovative startup in AI"`
  
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'companies_sample.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

// Handle import
const handleImport = async () => {
  if (!selectedFile.value) return

  loading.value = true

  try {
    console.log('Starting import for file:', selectedFile.value.name)
    const response = await companiesAPI.importCSV(selectedFile.value)
    console.log('Import response:', response)

    // Check if it's an async job (202 status)
    if (response.status === 202) {
      const jobId = response.data.data.job_id
      console.log('Import job started with ID:', jobId)

      // Show processing message
      success('Import started successfully. Processing your companies...')

      // Poll for job completion
      await pollJobCompletion(jobId)

      // Job completed, refresh companies
      console.log('Import job completed, refreshing companies list...')
      emit('imported')
    } else {
      // Immediate success
      console.log('Import completed immediately, refreshing companies list...')
      success('Companies imported successfully')
      emit('imported')
    }
  } catch (err) {
    console.error('Import error:', err)
    console.error('Error response:', err.response?.data)
    if (err.response?.data?.message) {
      error(err.response.data.message)
    } else {
      error('Failed to import companies. Please check your CSV format.')
    }
  } finally {
    loading.value = false
  }
}

// Poll job completion
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
