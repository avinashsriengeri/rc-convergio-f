import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { hrAPI } from '../api/hrAPI'

export const useHrEmployeeDocumentsStore = defineStore('hrEmployeeDocuments', () => {
  // State
  const state = ref({
    loading: false,
    error: null,
    myDocuments: [],
    documentTypes: [],
    missingMandatory: [],
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    }
  })

  // Getters
  const myDocuments = computed(() => state.value.myDocuments)
  const documentTypes = computed(() => state.value.documentTypes)
  const missingMandatory = computed(() => state.value.missingMandatory)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const meta = computed(() => state.value.meta)

  const documentsByCategory = computed(() => {
    const grouped = {}
    state.value.myDocuments.forEach(doc => {
      const category = doc.document_type?.category || doc.category || 'other'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(doc)
    })
    return grouped
  })

  // Actions
  const fetchMyDocuments = async (params = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getMyDocuments(params)
      
      if (response.data.success) {
        state.value.myDocuments = response.data.data || []
        state.value.meta = response.data.meta || state.value.meta
      } else {
        throw new Error(response.data.message || 'Failed to fetch documents')
      }
    } catch (err) {
      console.error('Error fetching my documents:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch documents'
      state.value.myDocuments = []
    } finally {
      state.value.loading = false
    }
  }

  const fetchDocumentTypes = async () => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getMyDocumentTypes()
      
      if (response.data.success) {
        state.value.documentTypes = response.data.data || []
      } else {
        throw new Error(response.data.message || 'Failed to fetch document types')
      }
    } catch (err) {
      console.error('Error fetching document types:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch document types'
      state.value.documentTypes = []
    } finally {
      state.value.loading = false
    }
  }

  const fetchMissingMandatory = async () => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getMissingMandatoryDocuments()
      
      if (response.data.success) {
        state.value.missingMandatory = response.data.data || []
      } else {
        throw new Error(response.data.message || 'Failed to fetch missing mandatory documents')
      }
    } catch (err) {
      console.error('Error fetching missing mandatory documents:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch missing mandatory documents'
      state.value.missingMandatory = []
    } finally {
      state.value.loading = false
    }
  }

  const uploadDocument = async (data) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.uploadMyDocument(data)
      
      if (response.data.success) {
        // Add to list
        state.value.myDocuments.unshift(response.data.data)
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to upload document')
      }
    } catch (err) {
      console.error('Error uploading document:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to upload document'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const downloadDocument = async (documentId) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.downloadMyDocument(documentId)
      
      // Create blob and download
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Get filename from response headers or use default
      const contentDisposition = response.headers['content-disposition']
      let filename = 'document'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i)
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '')
          // Decode URI if needed
          try {
            filename = decodeURIComponent(filename)
          } catch (e) {
            // If decoding fails, use as is
          }
        }
      }
      
      // If no filename from headers, try to get from document data
      if (filename === 'document') {
        const document = state.value.myDocuments.find(d => d.id === documentId || d.document_id === documentId)
        if (document?.title) {
          filename = document.title
          // Add extension if not present
          if (!filename.includes('.')) {
            const fileType = document.file_type || 'pdf'
            filename += `.${fileType.toLowerCase()}`
          }
        }
      }
      
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      return true
    } catch (err) {
      console.error('Error downloading document:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to download document'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  return {
    // State
    myDocuments,
    documentTypes,
    missingMandatory,
    loading,
    error,
    meta,
    // Computed
    documentsByCategory,
    // Actions
    fetchMyDocuments,
    fetchDocumentTypes,
    fetchMissingMandatory,
    uploadDocument,
    downloadDocument
  }
})

