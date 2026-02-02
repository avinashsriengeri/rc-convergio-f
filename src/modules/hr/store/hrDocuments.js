import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { hrAPI } from '../api/hrAPI'

// Document interface
const createDocument = (data = {}) => ({
  id: null,
  document_id: null,
  employee_id: null,
  category: '',
  is_hr_only: false,
  title: '',
  file_type: '',
  file_size: 0,
  created_at: null,
  created_by: null,
  ...data
})

// Performance Note interface
const createPerformanceNote = (data = {}) => ({
  id: null,
  employee_id: null,
  employee: null,
  note: '',
  visibility: 'employee', // hr_only, manager, employee
  created_by: null,
  created_at: null,
  updated_at: null,
  ...data
})

// Filters interface
const createFilters = (data = {}) => ({
  category: 'all',
  sortBy: 'created_at',
  sortOrder: 'desc',
  page: 1,
  per_page: 15,
  ...data
})

export const useHrDocumentsStore = defineStore('hrDocuments', () => {
  // State
  const state = ref({
    loading: false,
    error: null,
    documents: [],
    performanceNotes: [],
    selectedDocument: null,
    selectedPerformanceNote: null,
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    },
    filters: createFilters()
  })

  // Getters
  const documents = computed(() => state.value.documents)
  const performanceNotes = computed(() => state.value.performanceNotes)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const selectedDocument = computed(() => state.value.selectedDocument)
  const selectedPerformanceNote = computed(() => state.value.selectedPerformanceNote)
  const meta = computed(() => state.value.meta)
  const filters = computed(() => state.value.filters)

  const documentsByCategory = computed(() => {
    const grouped = {}
    state.value.documents.forEach(doc => {
      const category = doc.category || 'other'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(doc)
    })
    return grouped
  })

  // Actions
  const fetchDocuments = async (employeeId, params = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const mergedParams = { ...state.value.filters, ...params }
      const response = await hrAPI.getEmployeeDocuments(employeeId, mergedParams)
      
      if (response.data.success) {
        state.value.documents = response.data.data || []
        state.value.meta = response.data.meta || state.value.meta
      } else {
        throw new Error(response.data.message || 'Failed to fetch documents')
      }
    } catch (err) {
      console.error('Error fetching documents:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch documents'
      state.value.documents = []
    } finally {
      state.value.loading = false
    }
  }

  const uploadDocument = async (employeeId, documentData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.uploadEmployeeDocument(employeeId, documentData)
      
      if (response.data.success) {
        const newDocument = response.data.data
        
        // Validate document response structure
        if (!newDocument) {
          throw new Error('Document upload failed: Invalid response data')
        }
        
        // Ensure document has required fields
        if (!newDocument.id && !newDocument.document_id) {
          console.error('Document response missing ID:', newDocument)
          throw new Error('Document upload failed: Missing document ID in response')
        }
        
        state.value.documents.unshift(newDocument)
        return newDocument
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

  const downloadDocument = async (employeeId, documentId) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.downloadDocument(employeeId, documentId)
      
      // Create blob and download
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Get filename from response headers or use default
      const contentDisposition = response.headers['content-disposition']
      let filename = 'document'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i)
        if (filenameMatch) {
          filename = filenameMatch[1]
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

  const deleteDocument = async (employeeId, documentId) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.deleteDocument(employeeId, documentId)
      
      if (response.data.success) {
        const index = state.value.documents.findIndex(doc => doc.id === documentId)
        if (index !== -1) {
          state.value.documents.splice(index, 1)
        }
        if (state.value.selectedDocument?.id === documentId) {
          state.value.selectedDocument = null
        }
        return true
      } else {
        throw new Error(response.data.message || 'Failed to delete document')
      }
    } catch (err) {
      console.error('Error deleting document:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to delete document'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const fetchPerformanceNotes = async (employeeId, params = {}) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const mergedParams = { ...state.value.filters, ...params }
      const response = await hrAPI.getPerformanceNotes(employeeId, mergedParams)
      
      if (response.data.success) {
        state.value.performanceNotes = response.data.data || []
        state.value.meta = response.data.meta || state.value.meta
      } else {
        throw new Error(response.data.message || 'Failed to fetch performance notes')
      }
    } catch (err) {
      console.error('Error fetching performance notes:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch performance notes'
      state.value.performanceNotes = []
    } finally {
      state.value.loading = false
    }
  }

  const fetchPerformanceNote = async (employeeId, noteId) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.getPerformanceNote(employeeId, noteId)
      
      if (response.data.success) {
        state.value.selectedPerformanceNote = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Performance note not found')
      }
    } catch (err) {
      console.error('Error fetching performance note:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to fetch performance note'
      state.value.selectedPerformanceNote = null
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const createPerformanceNote = async (employeeId, noteData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.createPerformanceNote(employeeId, noteData)
      
      if (response.data.success) {
        const newNote = response.data.data
        state.value.performanceNotes.unshift(newNote)
        return newNote
      } else {
        throw new Error(response.data.message || 'Failed to create performance note')
      }
    } catch (err) {
      console.error('Error creating performance note:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to create performance note'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const updatePerformanceNote = async (employeeId, noteId, noteData) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.updatePerformanceNote(employeeId, noteId, noteData)
      
      if (response.data.success) {
        const updatedNote = response.data.data
        const index = state.value.performanceNotes.findIndex(note => note.id === noteId)
        if (index !== -1) {
          state.value.performanceNotes[index] = updatedNote
        }
        if (state.value.selectedPerformanceNote?.id === noteId) {
          state.value.selectedPerformanceNote = updatedNote
        }
        return updatedNote
      } else {
        throw new Error(response.data.message || 'Failed to update performance note')
      }
    } catch (err) {
      console.error('Error updating performance note:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to update performance note'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const deletePerformanceNote = async (employeeId, noteId) => {
    state.value.loading = true
    state.value.error = null
    
    try {
      const response = await hrAPI.deletePerformanceNote(employeeId, noteId)
      
      if (response.data.success) {
        const index = state.value.performanceNotes.findIndex(note => note.id === noteId)
        if (index !== -1) {
          state.value.performanceNotes.splice(index, 1)
        }
        if (state.value.selectedPerformanceNote?.id === noteId) {
          state.value.selectedPerformanceNote = null
        }
        return true
      } else {
        throw new Error(response.data.message || 'Failed to delete performance note')
      }
    } catch (err) {
      console.error('Error deleting performance note:', err)
      state.value.error = err.response?.data?.message || err.message || 'Failed to delete performance note'
      throw err
    } finally {
      state.value.loading = false
    }
  }

  const setFilters = (newFilters) => {
    state.value.filters = { ...state.value.filters, ...newFilters }
  }

  const resetFilters = () => {
    state.value.filters = createFilters()
  }

  const clearSelectedDocument = () => {
    state.value.selectedDocument = null
  }

  const clearSelectedPerformanceNote = () => {
    state.value.selectedPerformanceNote = null
  }

  return {
    // State
    documents,
    performanceNotes,
    loading,
    error,
    selectedDocument,
    selectedPerformanceNote,
    meta,
    filters,
    // Getters
    documentsByCategory,
    // Actions
    fetchDocuments,
    uploadDocument,
    downloadDocument,
    deleteDocument,
    fetchPerformanceNotes,
    fetchPerformanceNote,
    createPerformanceNote,
    updatePerformanceNote,
    deletePerformanceNote,
    setFilters,
    resetFilters,
    clearSelectedDocument,
    clearSelectedPerformanceNote
  }
})

