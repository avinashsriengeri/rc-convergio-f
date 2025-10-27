import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDocuments } from '@/composables/useDocuments'

// Mock dependencies
vi.mock('@/services/documents', () => ({
  documentsService: {
    getDocuments: vi.fn(),
    getDocument: vi.fn(),
    uploadDocument: vi.fn(),
    updateDocument: vi.fn(),
    deleteDocument: vi.fn(),
    downloadDocument: vi.fn(),
    linkDocument: vi.fn(),
    unlinkDocument: vi.fn(),
    getDocumentsAnalytics: vi.fn(),
    getDocumentsByRelated: vi.fn(),
    bulkDelete: vi.fn(),
    bulkUpdate: vi.fn()
  },
  documentsHelpers: {
    getFileTypeIcon: vi.fn(() => '📄'),
    getFileTypeColor: vi.fn(() => 'bg-gray-100 text-gray-800'),
    getVisibilityColor: vi.fn(() => 'bg-gray-100 text-gray-800'),
    formatFileSize: vi.fn((bytes) => `${bytes} B`),
    formatDate: vi.fn((date) => new Date(date).toLocaleDateString()),
    getAllowedFileTypes: vi.fn(() => ['pdf', 'doc', 'txt']),
    isFileTypeAllowed: vi.fn(() => true),
    isFileSizeAllowed: vi.fn(() => true),
    generateDownloadFilename: vi.fn((doc) => `${doc.title}.${doc.file_type}`),
    isPreviewable: vi.fn(() => true),
    getTeamBadgeColor: vi.fn(() => 'bg-blue-100 text-blue-800')
  }
}))

vi.mock('@/composables/useContext', () => ({
  useContext: vi.fn(() => ({
    tenantId: { value: 1 },
    teamId: { value: 2 },
    isAdmin: { value: false }
  }))
}))

vi.mock('@/composables/usePermission', () => ({
  usePermission: vi.fn(() => ({
    canView: vi.fn(() => true),
    canEdit: vi.fn(() => true),
    canDelete: vi.fn(() => true),
    canCreate: vi.fn(() => true)
  }))
}))

vi.mock('@/composables/useNotifications', () => ({
  useNotifications: vi.fn(() => ({
    showNotification: vi.fn()
  }))
}))

// Mock environment variable
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_TEAM_ACCESS_ENABLED: 'true'
  }
})

describe('useDocuments', () => {
  let documentsService
  let documentsHelpers

  beforeEach(async () => {
    vi.clearAllMocks()
    const { documentsService: service, documentsHelpers: helpers } = await import('@/services/documents')
    documentsService = service
    documentsHelpers = helpers
  })

  describe('initial state', () => {
    it('should initialize with default state', () => {
      const { documents, loading, uploading, downloading, deleting } = useDocuments()

      expect(documents.value).toEqual([])
      expect(loading.value).toBe(false)
      expect(uploading.value).toBe(false)
      expect(downloading.value).toBe(false)
      expect(deleting.value).toBe(false)
    })

    it('should initialize filters with default values', () => {
      const { filters } = useDocuments()

      expect(filters.search).toBe('')
      expect(filters.file_type).toBe('')
      expect(filters.visibility).toBe('')
      expect(filters.sort_by).toBe('created_at')
      expect(filters.sort_order).toBe('desc')
    })
  })

  describe('fetchDocuments', () => {
    it('should fetch documents successfully', async () => {
      const mockDocuments = [
        { id: 1, title: 'Test Document', file_type: 'pdf' }
      ]
      const mockResponse = {
        data: mockDocuments,
        meta: { total: 1, current_page: 1, last_page: 1, per_page: 15 }
      }
      documentsService.getDocuments.mockResolvedValue(mockResponse)

      const { fetchDocuments, documents, pagination } = useDocuments()
      await fetchDocuments()

      expect(documentsService.getDocuments).toHaveBeenCalledWith({
        search: '',
        file_type: '',
        visibility: '',
        owner_id: '',
        team_id: 2,
        related_type: '',
        related_id: '',
        date_from: '',
        date_to: '',
        sort_by: 'created_at',
        sort_order: 'desc'
      })
      expect(documents.value).toEqual(mockDocuments)
      expect(pagination.total).toBe(1)
    })

    it('should handle fetch errors', async () => {
      const error = new Error('Fetch failed')
      documentsService.getDocuments.mockRejectedValue(error)

      const { fetchDocuments } = useDocuments()
      
      await expect(fetchDocuments()).rejects.toThrow('Fetch failed')
    })
  })

  describe('uploadDocument', () => {
    it('should upload document successfully', async () => {
      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      const metadata = { title: 'Test Document' }
      const mockResponse = { data: { id: 1, title: 'Test Document' } }
      documentsService.uploadDocument.mockResolvedValue(mockResponse)

      const { uploadDocument, documents } = useDocuments()
      await uploadDocument(file, metadata)

      expect(documentsService.uploadDocument).toHaveBeenCalledWith(file, {
        ...metadata,
        team_id: 2
      })
      expect(documents.value).toContain(mockResponse.data)
    })

    it('should validate file type', async () => {
      const file = new File(['test content'], 'test.exe', { type: 'application/exe' })
      documentsHelpers.isFileTypeAllowed.mockReturnValue(false)

      const { uploadDocument } = useDocuments()
      
      await expect(uploadDocument(file)).rejects.toThrow('File type not allowed')
    })

    it('should validate file size', async () => {
      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      documentsHelpers.isFileSizeAllowed.mockReturnValue(false)

      const { uploadDocument } = useDocuments()
      
      await expect(uploadDocument(file)).rejects.toThrow('File size exceeds limit')
    })
  })

  describe('updateDocument', () => {
    it('should update document successfully', async () => {
      const id = 1
      const data = { title: 'Updated Title' }
      const mockResponse = { data: { id: 1, title: 'Updated Title' } }
      documentsService.updateDocument.mockResolvedValue(mockResponse)

      const { updateDocument, documents } = useDocuments()
      documents.value = [{ id: 1, title: 'Old Title' }]
      
      await updateDocument(id, data)

      expect(documentsService.updateDocument).toHaveBeenCalledWith(id, data)
      expect(documents.value[0]).toEqual({ id: 1, title: 'Updated Title' })
    })
  })

  describe('deleteDocument', () => {
    it('should delete document successfully', async () => {
      const id = 1
      documentsService.deleteDocument.mockResolvedValue({})

      const { deleteDocument, documents } = useDocuments()
      documents.value = [{ id: 1, title: 'Test Document' }, { id: 2, title: 'Another Document' }]
      
      await deleteDocument(id)

      expect(documentsService.deleteDocument).toHaveBeenCalledWith(id)
      expect(documents.value).toEqual([{ id: 2, title: 'Another Document' }])
    })
  })

  describe('downloadDocument', () => {
    it('should download document successfully', async () => {
      const document = { id: 1, title: 'Test Document', file_type: 'pdf' }
      const mockResponse = { data: new Blob(['test content']) }
      documentsService.downloadDocument.mockResolvedValue(mockResponse)

      // Mock DOM methods
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn()
      }
      const mockCreateElement = vi.fn(() => mockLink)
      const mockAppendChild = vi.fn()
      const mockRemoveChild = vi.fn()
      const mockRevokeObjectURL = vi.fn()
      
      global.document.createElement = mockCreateElement
      global.document.body.appendChild = mockAppendChild
      global.document.body.removeChild = mockRemoveChild
      global.URL.createObjectURL = vi.fn(() => 'blob:url')
      global.URL.revokeObjectURL = mockRevokeObjectURL

      const { downloadDocument } = useDocuments()
      await downloadDocument(document)

      expect(documentsService.downloadDocument).toHaveBeenCalledWith(document.id)
      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockLink.download).toBe('Test Document.pdf')
      expect(mockLink.click).toHaveBeenCalled()
    })
  })

  describe('fetchDocumentsByRelated', () => {
    it('should fetch documents by related object', async () => {
      const relatedType = 'deal'
      const relatedId = 123
      const params = { page: 1 }
      const mockResponse = { data: [{ id: 1, title: 'Deal Document' }] }
      documentsService.getDocumentsByRelated.mockResolvedValue(mockResponse)

      const { fetchDocumentsByRelated } = useDocuments()
      const result = await fetchDocumentsByRelated(relatedType, relatedId, params)

      expect(documentsService.getDocumentsByRelated).toHaveBeenCalledWith(relatedType, relatedId, {
        ...params,
        team_id: 2
      })
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('permission helpers', () => {
    it('should check view permissions', () => {
      const { canViewDocument } = useDocuments()
      const document = { id: 1, owner_id: 1, team_id: 2, tenant_id: 1 }

      expect(canViewDocument(document)).toBe(true)
    })

    it('should check edit permissions', () => {
      const { canEditDocument } = useDocuments()
      const document = { id: 1, owner_id: 1, team_id: 2, tenant_id: 1 }

      expect(canEditDocument(document)).toBe(true)
    })

    it('should check delete permissions', () => {
      const { canDeleteDocument } = useDocuments()
      const document = { id: 1, owner_id: 1, team_id: 2, tenant_id: 1 }

      expect(canDeleteDocument(document)).toBe(true)
    })
  })

  describe('filteredDocuments', () => {
    it('should filter documents by search term', () => {
      const { documents, filters, filteredDocuments } = useDocuments()
      documents.value = [
        { id: 1, title: 'Test Document', description: 'A test document' },
        { id: 2, title: 'Another File', description: 'Different content' }
      ]
      filters.search = 'test'

      expect(filteredDocuments.value).toHaveLength(1)
      expect(filteredDocuments.value[0].title).toBe('Test Document')
    })

    it('should filter documents by file type', () => {
      const { documents, filters, filteredDocuments } = useDocuments()
      documents.value = [
        { id: 1, title: 'Test Document', file_type: 'pdf' },
        { id: 2, title: 'Another File', file_type: 'doc' }
      ]
      filters.file_type = 'pdf'

      expect(filteredDocuments.value).toHaveLength(1)
      expect(filteredDocuments.value[0].file_type).toBe('pdf')
    })

    it('should filter documents by visibility', () => {
      const { documents, filters, filteredDocuments } = useDocuments()
      documents.value = [
        { id: 1, title: 'Private Doc', visibility: 'private' },
        { id: 2, title: 'Team Doc', visibility: 'team' }
      ]
      filters.visibility = 'private'

      expect(filteredDocuments.value).toHaveLength(1)
      expect(filteredDocuments.value[0].visibility).toBe('private')
    })
  })

  describe('clearFilters', () => {
    it('should reset all filters to default values', () => {
      const { filters, clearFilters } = useDocuments()
      filters.search = 'test'
      filters.file_type = 'pdf'
      filters.visibility = 'private'

      clearFilters()

      expect(filters.search).toBe('')
      expect(filters.file_type).toBe('')
      expect(filters.visibility).toBe('')
      expect(filters.sort_by).toBe('created_at')
      expect(filters.sort_order).toBe('desc')
    })
  })
})
