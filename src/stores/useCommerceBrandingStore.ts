import { defineStore } from 'pinia'
import { commerceAPI } from '@/services/api'

export const useCommerceBrandingStore = defineStore('commerceBranding', {
  state: () => ({
    branding: {
      id: null,
      tenant_id: null,
      company_name: '',
      logo_url: '',
      primary_color: '#3b82f6',
      secondary_color: '#1f2937',
      company_address: '',
      company_phone: '',
      company_email: '',
      company_website: '',
      invoice_footer: '',
      email_signature: '',
      active: true,
      created_at: null,
      updated_at: null
    },
    loading: false,
    error: null,
    uploadProgress: 0
  }),

  getters: {
    isBrandingLoaded: (state) => !!state.branding.id,
    hasLogo: (state) => !!state.branding.logo_url,
    primaryColorHex: (state) => state.branding.primary_color,
    secondaryColorHex: (state) => state.branding.secondary_color
  },

  actions: {
    // Fetch current branding
    async fetchBranding() {
      this.loading = true
      this.error = null
      try {
        const response = await commerceAPI.getBranding()
        console.log('Branding response:', response)
        
        if (response.data?.data) {
          this.branding = { ...this.branding, ...response.data.data }
          console.log('Branding loaded:', this.branding)
        } else if (response.data) {
          this.branding = { ...this.branding, ...response.data }
          console.log('Branding loaded (direct):', this.branding)
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch branding settings'
        console.error('Error fetching branding:', error)
        // Don't throw error, just log it - user can still use the form
      } finally {
        this.loading = false
      }
    },

    // Update branding
    async updateBranding(formData) {
      this.loading = true
      this.error = null
      this.uploadProgress = 0
      
      try {
        console.log('=== BRANDING UPDATE DEBUG ===')
        console.log('Received formData:', formData)
        console.log('formData.logo:', formData.logo)
        console.log('formData.logo type:', typeof formData.logo)
        console.log('formData.logo instanceof File:', formData.logo instanceof File)
        
        // Create FormData for file upload
        const data = new FormData()
        
        // Add all form fields except logo
        Object.keys(formData).forEach(key => {
          if (key !== 'logo' && formData[key] !== null && formData[key] !== undefined) {
            data.append(key, formData[key])
            console.log(`Added ${key} to FormData:`, formData[key])
          }
        })

        // Only add logo if it's a valid File object
        if (formData.logo && formData.logo instanceof File) {
          data.append('logo', formData.logo)
          console.log('Adding logo file to FormData:', formData.logo.name, formData.logo.size)
        } else {
          console.log('No logo file to upload, skipping logo field')
          console.log('Logo value was:', formData.logo)
          console.log('Logo field exists in formData:', 'logo' in formData)
        }

        console.log('FormData contents:')
        for (let [key, value] of data.entries()) {
          console.log(`${key}:`, value)
        }
        
        console.log('Sending FormData to API...')
        const response = await commerceAPI.updateBranding(data)
        console.log('Branding update response:', response)
        
        if (response.data?.data) {
          this.branding = { ...this.branding, ...response.data.data }
          console.log('Branding updated successfully:', this.branding)
        } else if (response.data) {
          this.branding = { ...this.branding, ...response.data }
          console.log('Branding updated successfully (direct):', this.branding)
        }

        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update branding settings'
        console.error('Error updating branding:', error)
        console.error('Error response:', error.response?.data)
        throw error
      } finally {
        this.loading = false
        this.uploadProgress = 0
      }
    },

    // Reset branding to defaults
    async resetBranding() {
      this.loading = true
      this.error = null
      
      try {
        const response = await commerceAPI.resetBranding()
        console.log('Branding reset response:', response)
        
        if (response.data?.data) {
          this.branding = { ...this.branding, ...response.data.data }
          console.log('Branding reset successfully:', this.branding)
        } else if (response.data) {
          this.branding = { ...this.branding, ...response.data }
          console.log('Branding reset successfully (direct):', this.branding)
        }

        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to reset branding settings'
        console.error('Error resetting branding:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Clear error
    clearError() {
      this.error = null
    },

    // Set upload progress
    setUploadProgress(progress) {
      this.uploadProgress = progress
    }
  }
})
