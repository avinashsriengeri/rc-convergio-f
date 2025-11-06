import api from './api'

// Documents Management API wrappers
export const documentsService = {
  // Get documents with filters
  async getDocuments(params = {}) {
    try {
      const response = await api.get('/documents', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching documents:', error)
      throw error
    }
  },

  // Get document details
  async getDocument(id) {
    try {
      const response = await api.get(`/documents/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching document details:', error)
      throw error
    }
  },

  // Upload document
  async uploadDocument(file, metadata = {}) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      // Add metadata fields
      Object.keys(metadata).forEach(key => {
        if (metadata[key] !== null && metadata[key] !== undefined) {
          formData.append(key, metadata[key])
        }
      })

      const response = await api.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error uploading document:', error)
      throw error
    }
  },

  // Update document metadata
  async updateDocument(id, data) {
    try {
      const response = await api.put(`/documents/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating document:', error)
      throw error
    }
  },

  // Delete document
  async deleteDocument(id) {
    try {
      const response = await api.delete(`/documents/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting document:', error)
      throw error
    }
  },

  // Download document
  async downloadDocument(id) {
    try {
      const response = await api.get(`/documents/${id}/download`, {
        responseType: 'blob'
      })
      return response
    } catch (error) {
      console.error('Error downloading document:', error)
      throw error
    }
  },

  // Get documents analytics
  async getDocumentsAnalytics(params = {}) {
    try {
      const response = await api.get('/documents/analytics', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching documents analytics:', error)
      throw error
    }
  },

  // Get documents by related object
  async getDocumentsByRelated(relatedType, relatedId, params = {}) {
    try {
      const response = await api.get(`/documents`, {
        params: {
          related_type: relatedType,
          related_id: relatedId,
          ...params
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching documents by related object:', error)
      throw error
    }
  },

  // Link document to related object
  async linkDocument(documentId, relatedType, relatedId) {
    try {
      const response = await api.post(`/documents/${documentId}/link`, {
        related_type: relatedType,
        related_id: relatedId
      })
      return response.data
    } catch (error) {
      console.error('Error linking document:', error)
      throw error
    }
  },

  // Unlink document from related object
  async unlinkDocument(documentId, relatedType, relatedId) {
    try {
      const response = await api.delete(`/documents/${documentId}/link`, {
        data: {
          related_type: relatedType,
          related_id: relatedId
        }
      })
      return response.data
    } catch (error) {
      console.error('Error unlinking document:', error)
      throw error
    }
  },

  // Get document preview URL
  async getDocumentPreviewUrl(id) {
    try {
      const response = await api.get(`/documents/${id}/preview`)
      return response.data
    } catch (error) {
      console.error('Error fetching document preview URL:', error)
      throw error
    }
  },

  // Bulk operations
  async bulkDelete(documentIds) {
    try {
      const response = await api.delete('/documents/bulk-delete', {
        data: { document_ids: documentIds }
      })
      return response.data
    } catch (error) {
      console.error('Error bulk deleting documents:', error)
      throw error
    }
  },

  async bulkUpdate(documentIds, data) {
    try {
      const response = await api.patch('/documents/bulk-update', {
        document_ids: documentIds,
        ...data
      })
      return response.data
    } catch (error) {
      console.error('Error bulk updating documents:', error)
      throw error
    }
  }
}

// Helper functions for documents data processing
export const documentsHelpers = {
  // Get file type icon
  getFileTypeIcon(fileType) {
    // Extract file extension from MIME type or file type
    let extension = fileType?.toLowerCase()
    if (extension?.includes('/')) {
      extension = extension.split('/')[1]
    }
    
    const icons = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      xls: '📊',
      xlsx: '📊',
      ppt: '📋',
      pptx: '📋',
      txt: '📄',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      gif: '🖼️',
      svg: '🖼️',
      mp4: '🎥',
      avi: '🎥',
      mov: '🎥',
      zip: '📦',
      rar: '📦',
      '7z': '📦'
    }
    return icons[extension] || '📄'
  },

  // Get file type color
  getFileTypeColor(fileType) {
    // Extract file extension from MIME type or file type
    let extension = fileType?.toLowerCase()
    if (extension?.includes('/')) {
      extension = extension.split('/')[1]
    }
    
    const colors = {
      pdf: 'bg-purple-100 text-purple-800',
      doc: 'bg-blue-100 text-blue-800',
      docx: 'bg-blue-100 text-blue-800',
      xls: 'bg-green-100 text-green-800',
      xlsx: 'bg-green-100 text-green-800',
      ppt: 'bg-orange-100 text-orange-800',
      pptx: 'bg-orange-100 text-orange-800',
      txt: 'bg-gray-100 text-gray-800',
      jpg: 'bg-purple-100 text-purple-800',
      jpeg: 'bg-purple-100 text-purple-800',
      png: 'bg-purple-100 text-purple-800',
      gif: 'bg-purple-100 text-purple-800',
      svg: 'bg-purple-100 text-purple-800',
      mp4: 'bg-indigo-100 text-indigo-800',
      avi: 'bg-indigo-100 text-indigo-800',
      mov: 'bg-indigo-100 text-indigo-800',
      zip: 'bg-yellow-100 text-yellow-800',
      rar: 'bg-yellow-100 text-yellow-800',
      '7z': 'bg-yellow-100 text-yellow-800'
    }
    return colors[extension] || 'bg-gray-100 text-gray-800'
  },

  // Get visibility level color
  getVisibilityColor(visibility) {
    const colors = {
      private: 'bg-amber-100 text-amber-800',
      team: 'bg-blue-100 text-blue-800',
      tenant: 'bg-green-100 text-green-800',
      public: 'bg-purple-100 text-purple-800'
    }
    return colors[visibility] || 'bg-gray-100 text-gray-800'
  },

  // Format file size
  formatFileSize(bytes) {
    if (!bytes) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  // Format date
  formatDate(dateString) {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },

  // Get allowed file types
  getAllowedFileTypes() {
    return [
      'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt',
      'jpg', 'jpeg', 'png', 'gif', 'svg', 'mp4', 'avi', 'mov',
      'zip', 'rar', '7z'
    ]
  },

  // Check if file type is allowed
  isFileTypeAllowed(fileType) {
    const allowedTypes = this.getAllowedFileTypes()
    return allowedTypes.includes(fileType?.toLowerCase())
  },

  // Get max file size (in bytes)
  getMaxFileSize() {
    return 50 * 1024 * 1024 // 50MB
  },

  // Check if file size is within limit
  isFileSizeAllowed(fileSize) {
    return fileSize <= this.getMaxFileSize()
  },

  // Generate download filename
  generateDownloadFilename(document) {
    const extension = document.file_type || ''
    const title = document.title || 'document'
    return `${title}${extension ? '.' + extension : ''}`
  },

  // Check if file is previewable
  isPreviewable(fileType) {
    // Extract file extension from MIME type or file type
    let extension = fileType?.toLowerCase()
    if (extension?.includes('/')) {
      extension = extension.split('/')[1]
    }
    
    const previewableTypes = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'svg', 'txt']
    return previewableTypes.includes(extension)
  },

  // Get team badge color
  getTeamBadgeColor(teamId, teamName) {
    if (!teamId) return 'bg-gray-100 text-gray-800'
    
    // Generate consistent color based on team ID
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-yellow-100 text-yellow-800',
      'bg-red-100 text-red-800'
    ]
    
    const index = teamId % colors.length
    return colors[index]
  }
}

export default documentsService
