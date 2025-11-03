<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-gray-900">Branding Management</h1>
            <p class="text-sm text-gray-600">Customize your company branding for invoices and communications</p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="resetBranding"
              :disabled="brandingStore.loading"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Error Alert -->
      <div v-if="brandingStore.error" class="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error</h3>
            <div class="mt-2 text-sm text-red-700">{{ brandingStore.error }}</div>
          </div>
          <div class="ml-auto pl-3">
            <button @click="brandingStore.clearError()" class="text-red-400 hover:text-red-600">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="brandingStore.loading && !brandingStore.isBrandingLoaded" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Branding Form -->
      <div v-else class="space-y-6">
        <form @submit.prevent="submitForm" class="space-y-8">
          <!-- Company Information Section -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Company Information</h3>
              <p class="mt-1 text-sm text-gray-500">Basic company details for invoices and communications</p>
            </div>
            <div class="px-6 py-6 space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="company_name" class="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    id="company_name"
                    v-model="formData.company_name"
                    type="text"
                    required
                    maxlength="255"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label for="company_email" class="block text-sm font-medium text-gray-700 mb-2">
                    Company Email *
                  </label>
                  <input
                    id="company_email"
                    v-model="formData.company_email"
                    type="email"
                    required
                    maxlength="255"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="billing@company.com"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="company_phone" class="block text-sm font-medium text-gray-700 mb-2">
                    Company Phone
                  </label>
                  <input
                    id="company_phone"
                    v-model="formData.company_phone"
                    type="tel"
                    maxlength="50"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1-555-0123"
                  />
                </div>
                <div>
                  <label for="company_website" class="block text-sm font-medium text-gray-700 mb-2">
                    Company Website
                  </label>
                  <input
                    id="company_website"
                    v-model="formData.company_website"
                    type="url"
                    maxlength="255"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://company.com"
                  />
                </div>
              </div>

              <div>
                <label for="company_address" class="block text-sm font-medium text-gray-700 mb-2">
                  Company Address
                </label>
                <textarea
                  id="company_address"
                  v-model="formData.company_address"
                  rows="3"
                  maxlength="1000"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123 Main St, City, State, ZIP Code"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Visual Branding Section -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Visual Branding</h3>
              <p class="mt-1 text-sm text-gray-500">Logo and color scheme for your brand</p>
            </div>
            <div class="px-6 py-6 space-y-6">
              <!-- Logo Upload -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Company Logo
                </label>
                <div class="flex items-center space-x-6">
                  <div class="flex-shrink-0">
                    <div v-if="logoPreview" class="h-20 w-20 rounded-lg overflow-hidden border border-gray-300">
                      <img :src="logoPreview" alt="Logo preview" class="h-full w-full object-contain" />
                    </div>
                    <div v-else-if="brandingStore.hasLogo" class="h-20 w-20 rounded-lg overflow-hidden border border-gray-300">
                      <img :src="brandingStore.branding.logo_url" alt="Current logo" class="h-full w-full object-contain" />
                    </div>
                    <div v-else class="h-20 w-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div class="flex-1">
                    <input
                      id="logo"
                      ref="logoInput"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
                      @change="handleLogoChange"
                      class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p class="mt-1 text-xs text-gray-500">PNG, JPG, GIF, SVG up to 2MB</p>
                  </div>
                </div>
              </div>

              <!-- Color Scheme -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="primary_color" class="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div class="flex items-center space-x-3">
                    <input
                      id="primary_color"
                      v-model="formData.primary_color"
                      type="color"
                      class="h-10 w-16 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                      v-model="formData.primary_color"
                      type="text"
                      maxlength="7"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
                <div>
                  <label for="secondary_color" class="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <div class="flex items-center space-x-3">
                    <input
                      id="secondary_color"
                      v-model="formData.secondary_color"
                      type="color"
                      class="h-10 w-16 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                      v-model="formData.secondary_color"
                      type="text"
                      maxlength="7"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="#1f2937"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Communication Templates Section -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Communication Templates</h3>
              <p class="mt-1 text-sm text-gray-500">Customize messages for invoices and emails</p>
            </div>
            <div class="px-6 py-6 space-y-6">
              <div>
                <label for="invoice_footer" class="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Footer Message
                </label>
                <textarea
                  id="invoice_footer"
                  v-model="formData.invoice_footer"
                  rows="3"
                  maxlength="1000"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Thank you for your business!"
                ></textarea>
              </div>

              <div>
                <label for="email_signature" class="block text-sm font-medium text-gray-700 mb-2">
                  Email Signature
                </label>
                <textarea
                  id="email_signature"
                  v-model="formData.email_signature"
                  rows="4"
                  maxlength="1000"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Best regards,&#10;Your Company Name&#10;Phone: +1-555-0123&#10;Email: billing@company.com"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="resetForm"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset Form
            </button>
            <button
              type="submit"
              :disabled="brandingStore.loading"
              class="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="brandingStore.loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ brandingStore.loading ? 'Saving...' : 'Save Branding' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useCommerceBrandingStore } from '@/stores/useCommerceBrandingStore'

const brandingStore = useCommerceBrandingStore()

// Form data
const formData = reactive({
  company_name: '',
  company_email: '',
  company_phone: '',
  company_website: '',
  company_address: '',
  logo: null,
  primary_color: '#3b82f6',
  secondary_color: '#1f2937',
  invoice_footer: '',
  email_signature: ''
})

// Logo preview
const logoPreview = ref(null)
const logoInput = ref(null)

// Initialize form data from store
const initializeForm = () => {
  if (brandingStore.isBrandingLoaded) {
    formData.company_name = brandingStore.branding.company_name || ''
    formData.company_email = brandingStore.branding.company_email || ''
    formData.company_phone = brandingStore.branding.company_phone || ''
    formData.company_website = brandingStore.branding.company_website || ''
    formData.company_address = brandingStore.branding.company_address || ''
    formData.primary_color = brandingStore.branding.primary_color || '#3b82f6'
    formData.secondary_color = brandingStore.branding.secondary_color || '#1f2937'
    formData.invoice_footer = brandingStore.branding.invoice_footer || ''
    formData.email_signature = brandingStore.branding.email_signature || ''
  }
}

// Watch for store changes
watch(() => brandingStore.branding, () => {
  initializeForm()
}, { deep: true })

// Handle logo file change
const handleLogoChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB')
      logoInput.value.value = ''
      formData.logo = null
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, JPG, GIF, SVG)')
      logoInput.value.value = ''
      formData.logo = null
      return
    }

    formData.logo = file
    console.log('Logo file selected:', file.name, file.size, file.type)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      logoPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    // No file selected, clear the logo
    formData.logo = null
    logoPreview.value = null
    console.log('No logo file selected')
  }
}

// Reset form to current store values
const resetForm = () => {
  initializeForm()
  logoPreview.value = null
  formData.logo = null
  if (logoInput.value) {
    logoInput.value.value = ''
  }
}

// Submit form
const submitForm = async () => {
  try {
    console.log('Submitting form data:', formData)
    console.log('Logo file:', formData.logo)
    console.log('Logo file type:', typeof formData.logo)
    console.log('Logo file instanceof File:', formData.logo instanceof File)
    
    // Create a clean form data object without the logo field if it's null
    const cleanFormData = { ...formData }
    if (!cleanFormData.logo || !(cleanFormData.logo instanceof File)) {
      delete cleanFormData.logo
      console.log('Removed logo field from form data')
    }
    
    console.log('Clean form data:', cleanFormData)
    
    await brandingStore.updateBranding(cleanFormData)
    
    // Show success message
    if (window.Swal && window.Swal.fire) {
      window.Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Branding settings have been updated successfully',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    } else {
      alert('Branding settings updated successfully!')
    }

    // Clear logo input after successful upload
    logoPreview.value = null
    formData.logo = null
    if (logoInput.value) {
      logoInput.value.value = ''
    }
  } catch (error) {
    console.error('Error updating branding:', error)
    console.error('Error response:', error.response?.data)
    
    // Show error message
    if (window.Swal && window.Swal.fire) {
      window.Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update branding settings',
        timer: 5000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      })
    } else {
      alert(`Error: ${error.response?.data?.message || 'Failed to update branding settings'}`)
    }
  }
}

// Reset branding to defaults
const resetBranding = async () => {
  if (window.Swal && window.Swal.fire) {
    const result = await window.Swal.fire({
      title: 'Reset Branding?',
      text: 'This will reset all branding settings to default values. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, reset it!',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await brandingStore.resetBranding()
        initializeForm()
        
        window.Swal.fire({
          icon: 'success',
          title: 'Reset!',
          text: 'Branding settings have been reset to defaults',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
      } catch (error) {
        console.error('Error resetting branding:', error)
        window.Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to reset branding settings',
          timer: 5000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        })
      }
    }
  } else {
    if (confirm('Reset all branding settings to defaults?')) {
      try {
        await brandingStore.resetBranding()
        initializeForm()
        alert('Branding settings reset successfully!')
      } catch (error) {
        console.error('Error resetting branding:', error)
        alert(`Error: ${error.response?.data?.message || 'Failed to reset branding settings'}`)
      }
    }
  }
}

// Initialize on mount
onMounted(async () => {
  await brandingStore.fetchBranding()
  initializeForm()
})
</script>
