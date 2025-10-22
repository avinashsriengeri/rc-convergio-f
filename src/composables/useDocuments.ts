import { ref, computed, reactive } from 'vue'
import { documentsService, documentsHelpers } from '@/services/documents'
import { useContext } from './useContext'
import { usePermission } from './usePermission'
import { useNotifications } from './useNotifications'

export function useDocuments() {
  const { tenantId, teamId, isAdmin } = useContext()
  const { canView, canEdit, canDelete, canCreate } = usePermission()
  const { addNotification, success, error, warning, info } = useNotifications()

  // State
  const documents = ref([])
  const loading = ref(false)
  const uploading = ref(false)
  const downloading = ref(false)
  const deleting = ref(false)
  const analytics = ref(null)
  const pagination = reactive({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  })

  // Filters
  const filters = reactive({
    search: '',
    file_type: '',
    visibility: '',
    owner_id: '',
    team_id: '',
    related_type: '',
    related_id: '',
    date_from: '',
    date_to: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  })

  // Computed
  const filteredDocuments = computed(() => {
    return documents.value.filter(doc => {
      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          doc.title?.toLowerCase().includes(searchLower) ||
          doc.description?.toLowerCase().includes(searchLower) ||
          doc.file_name?.toLowerCase().includes(searchLower)
        
        if (!matchesSearch) return false
      }

      // Apply file type filter
      if (filters.file_type && doc.file_type !== filters.file_type) {
        return false
      }

      // Apply visibility filter
      if (filters.visibility && doc.visibility !== filters.visibility) {
        return false
      }

      // Apply owner filter
      if (filters.owner_id && doc.owner_id !== parseInt(filters.owner_id)) {
        return false
      }

      // Apply team filter
      if (filters.team_id && doc.team_id !== parseInt(filters.team_id)) {
        return false
      }

      // Apply related object filter
      if (filters.related_type && doc.related_type !== filters.related_type) {
        return false
      }

      if (filters.related_id && doc.related_id !== parseInt(filters.related_id)) {
        return false
      }

      return true
    })
  })

  const canUpload = computed(() => {
    return canCreate('document')
  })

  const teamAccessEnabled = computed(() => {
    return import.meta.env.VITE_TEAM_ACCESS_ENABLED === 'true'
  })

  // Methods
  const fetchDocuments = async (params = {}) => {
    try {
      loading.value = true
      
      // Build request parameters with context
      const requestParams = {
        ...filters,
        ...params
      }

      // Remove tenant_id as backend handles tenant isolation automatically
      delete requestParams.tenant_id

      // Only include team_id if team access is enabled and user is not admin
      if (teamAccessEnabled.value && !isAdmin.value) {
        requestParams.team_id = teamId.value
      }

      const response = await documentsService.getDocuments(requestParams)
      
      documents.value = response.data || []
      
      // Update pagination
      if (response.meta) {
        Object.assign(pagination, response.meta)
      }
      
      return response
    } catch (error) {
      console.error('Error fetching documents:', error)
      error('Failed to fetch documents')
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchDocument = async (id) => {
    try {
      const response = await documentsService.getDocument(id)
      return response.data
    } catch (error) {
      console.error('Error fetching document:', error)
      error('Failed to fetch document')
      throw error
    }
  }

  const uploadDocument = async (file, metadata = {}) => {
    try {
      uploading.value = true
      
      // Validate file
      if (!documentsHelpers.isFileTypeAllowed(file.type.split('/').pop())) {
        throw new Error('File type not allowed')
      }
      
      if (!documentsHelpers.isFileSizeAllowed(file.size)) {
        throw new Error('File size exceeds limit')
      }

      // Add context to metadata
      const uploadMetadata = {
        ...metadata,
        team_id: teamAccessEnabled.value ? teamId.value : null
      }

      const response = await documentsService.uploadDocument(file, uploadMetadata)
      
      // Add to documents list
      if (response.data) {
        documents.value.unshift(response.data)
        // Update pagination total
        pagination.total += 1
      }
      
      success('Document uploaded successfully')
      return response
    } catch (error) {
      console.error('Error uploading document:', error)
      error('Failed to upload document')
      throw error
    } finally {
      uploading.value = false
    }
  }

  const updateDocument = async (id, data) => {
    try {
      const response = await documentsService.updateDocument(id, data)
      
      // Update in documents list
      const index = documents.value.findIndex(doc => doc.id === id)
      if (index !== -1) {
        documents.value[index] = { ...documents.value[index], ...response.data }
      }
      
      success('Document updated successfully')
      return response
    } catch (error) {
      console.error('Error updating document:', error)
      error('Failed to update document')
      throw error
    }
  }

  const deleteDocument = async (id) => {
    try {
      deleting.value = true
      
      await documentsService.deleteDocument(id)
      
      // Remove from documents list
      documents.value = documents.value.filter(doc => doc.id !== id)
      
      success('Document deleted successfully')
    } catch (error) {
      console.error('Error deleting document:', error)
      error('Failed to delete document')
      throw error
    } finally {
      deleting.value = false
    }
  }

  const downloadDocument = async (doc) => {
    try {
      downloading.value = true
      
      // Validate document ID
      if (!doc || !doc.id) {
        console.error('Invalid document for download:', doc)
        throw new Error('Invalid document: missing ID')
      }
      
      // Show loading notification
      info('Preparing download...', 2000)
      
      const response = await documentsService.downloadDocument(doc.id)
      
      // Create blob URL and trigger download
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = documentsHelpers.generateDownloadFilename(doc)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      // Show professional success notification with document name
      const fileName = doc.title || doc.file_name || 'Document'
      success(`📄 ${fileName} downloaded successfully!`, 4000)
      
      console.log('Document downloaded successfully:', fileName)
    } catch (error) {
      console.error('Error downloading document:', error)
      error('❌ Failed to download document. Please try again.', 5000)
      throw error
    } finally {
      downloading.value = false
    }
  }

  const linkDocument = async (documentId, relatedType, relatedId) => {
    try {
      console.log(`linkDocument: Linking document ${documentId} to ${relatedType} ${relatedId}`)
      const response = await documentsService.linkDocument(documentId, relatedType, relatedId)
      
      if (response.data) {
        const updatedDocument = response.data; // The API response contains the updated document with relationships
        console.log('linkDocument: Updated document received:', updatedDocument)
        
        const index = documents.value.findIndex(doc => doc.id === documentId);
        if (index !== -1) {
          // Replace the existing document with the updated one to ensure relationships are current
          documents.value[index] = updatedDocument;
          console.log(`linkDocument: Updated existing document at index ${index}`)
        } else {
          // Add new document to list if not present
          documents.value.push(updatedDocument);
          console.log('linkDocument: Added new document to list')
        }
        
        console.log(`linkDocument: Global documents array now has ${documents.value.length} documents`)
      }
      
      // Return the response data for the modal to use
      return response
    } catch (error) {
      console.error('Error linking document:', error)
      throw error
    }
  }

  const unlinkDocument = async (documentId, relatedType, relatedId) => {
    try {
      await documentsService.unlinkDocument(documentId, relatedType, relatedId)
      
      // Update document in list
      const document = documents.value.find(doc => doc.id === documentId)
      if (document) {
        document.related_type = null
        document.related_id = null
      }
      
      success('Document unlinked successfully')
    } catch (error) {
      console.error('Error unlinking document:', error)
      error('Failed to unlink document')
      throw error
    }
  }

  const fetchAnalytics = async (params = {}) => {
    try {
      const analyticsParams = {
        ...params,
        team_id: teamAccessEnabled.value ? teamId.value : null
      }
      
      // Remove tenant_id as backend handles tenant isolation automatically
      delete analyticsParams.tenant_id
      
      const response = await documentsService.getDocumentsAnalytics(analyticsParams)
      
      analytics.value = response.data
      return response
    } catch (error) {
      console.error('Error fetching analytics:', error)
      throw error
    }
  }

  const fetchDocumentsByRelated = async (relatedType, relatedId, params = {}) => {
    try {
      const relatedParams = {
        ...params,
        team_id: teamAccessEnabled.value ? teamId.value : null
      }
      
      // Remove tenant_id as backend handles tenant isolation automatically
      delete relatedParams.tenant_id
      
      const response = await documentsService.getDocumentsByRelated(relatedType, relatedId, relatedParams)
      
      // Update the global documents array with the fetched documents
      const relatedDocuments = response.data || []
      
      // Remove existing documents for this related object and add the new ones
      // Use relationships array to properly filter documents
      documents.value = documents.value.filter(doc => {
        // Check if document has relationships array
        if (doc.relationships && Array.isArray(doc.relationships)) {
          return !doc.relationships.some(rel => 
            rel.related_type === relatedType && rel.related_id == relatedId
          )
        }
        // Fallback to top-level related_type/id
        return !(doc.related_type === relatedType && doc.related_id == relatedId)
      })
      documents.value.push(...relatedDocuments)
      
      console.log(`fetchDocumentsByRelated: Updated global documents array with ${relatedDocuments.length} documents for ${relatedType} ${relatedId}`)
      return relatedDocuments
    } catch (error) {
      console.error('Error fetching documents by related object:', error)
      throw error
    }
  }

  const bulkDelete = async (documentIds) => {
    try {
      deleting.value = true
      
      await documentsService.bulkDelete(documentIds)
      
      // Remove from documents list
      documents.value = documents.value.filter(doc => !documentIds.includes(doc.id))
      
      success(`${documentIds.length} documents deleted successfully`)
    } catch (error) {
      console.error('Error bulk deleting documents:', error)
      error('Failed to delete documents')
      throw error
    } finally {
      deleting.value = false
    }
  }

  const bulkUpdate = async (documentIds, data) => {
    try {
      await documentsService.bulkUpdate(documentIds, data)
      
      // Update documents in list
      documentIds.forEach(id => {
        const index = documents.value.findIndex(doc => doc.id === id)
        if (index !== -1) {
          documents.value[index] = { ...documents.value[index], ...data }
        }
      })
      
      success(`${documentIds.length} documents updated successfully`)
    } catch (error) {
      console.error('Error bulk updating documents:', error)
      error('Failed to update documents')
      throw error
    }
  }

  const clearFilters = () => {
    Object.keys(filters).forEach(key => {
      filters[key] = ''
    })
    filters.sort_by = 'created_at'
    filters.sort_order = 'desc'
  }

  const resetPagination = () => {
    pagination.current_page = 1
  }

  // Permission helpers
  const canViewDocument = (document) => {
    return canView(document)
  }

  const canEditDocument = (document) => {
    return canEdit(document)
  }

  const canDeleteDocument = (document) => {
    return canDelete(document)
  }

  return {
    // State
    documents,
    loading,
    uploading,
    downloading,
    deleting,
    analytics,
    pagination,
    filters,
    
    // Computed
    filteredDocuments,
    canUpload,
    teamAccessEnabled,
    
    // Methods
    fetchDocuments,
    fetchDocument,
    uploadDocument,
    updateDocument,
    deleteDocument,
    downloadDocument,
    linkDocument,
    unlinkDocument,
    fetchAnalytics,
    fetchDocumentsByRelated,
    bulkDelete,
    bulkUpdate,
    clearFilters,
    resetPagination,
    
    // Permission helpers
    canViewDocument,
    canEditDocument,
    canDeleteDocument,
    
    // Helpers
    helpers: documentsHelpers
  }
}
