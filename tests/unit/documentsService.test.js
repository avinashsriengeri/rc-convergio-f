import { describe, it, expect, vi, beforeEach } from 'vitest'
import { documentsService } from '@/services/documents'

// Mock axios
const mockAxios = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  patch: vi.fn()
}

vi.mock('@/services/api', () => ({
  default: mockAxios
}))

describe('DocumentsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getDocuments', () => {
    it('should fetch documents with default parameters', async () => {
      const mockResponse = {
        data: {
          data: [
            { id: 1, title: 'Test Document', file_type: 'pdf' }
          ],
          meta: { total: 1, current_page: 1 }
        }
      }
      mockAxios.get.mockResolvedValue(mockResponse)

      const result = await documentsService.getDocuments()

      expect(mockAxios.get).toHaveBeenCalledWith('/documents', { params: {} })
      expect(result).toEqual(mockResponse.data)
    })

    it('should fetch documents with custom parameters', async () => {
      const params = { search: 'test', file_type: 'pdf' }
      const mockResponse = { data: { data: [], meta: {} } }
      mockAxios.get.mockResolvedValue(mockResponse)

      await documentsService.getDocuments(params)

      expect(mockAxios.get).toHaveBeenCalledWith('/documents', { params })
    })

    it('should handle errors gracefully', async () => {
      const error = new Error('Network error')
      mockAxios.get.mockRejectedValue(error)

      await expect(documentsService.getDocuments()).rejects.toThrow('Network error')
    })
  })

  describe('uploadDocument', () => {
    it('should upload document with file and metadata', async () => {
      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      const metadata = { title: 'Test Document', visibility: 'private' }
      const mockResponse = { data: { data: { id: 1, title: 'Test Document' } } }
      mockAxios.post.mockResolvedValue(mockResponse)

      const result = await documentsService.uploadDocument(file, metadata)

      expect(mockAxios.post).toHaveBeenCalledWith('/documents', expect.any(FormData), {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      expect(result).toEqual(mockResponse.data)
    })

    it('should handle upload errors', async () => {
      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      const error = new Error('Upload failed')
      mockAxios.post.mockRejectedValue(error)

      await expect(documentsService.uploadDocument(file)).rejects.toThrow('Upload failed')
    })
  })

  describe('updateDocument', () => {
    it('should update document metadata', async () => {
      const id = 1
      const data = { title: 'Updated Title', visibility: 'team' }
      const mockResponse = { data: { data: { id: 1, title: 'Updated Title' } } }
      mockAxios.put.mockResolvedValue(mockResponse)

      const result = await documentsService.updateDocument(id, data)

      expect(mockAxios.put).toHaveBeenCalledWith('/documents/1', data)
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('deleteDocument', () => {
    it('should delete document', async () => {
      const id = 1
      const mockResponse = { data: { message: 'Document deleted' } }
      mockAxios.delete.mockResolvedValue(mockResponse)

      const result = await documentsService.deleteDocument(id)

      expect(mockAxios.delete).toHaveBeenCalledWith('/documents/1')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('downloadDocument', () => {
    it('should download document as blob', async () => {
      const id = 1
      const mockResponse = { data: new Blob(['test content']) }
      mockAxios.get.mockResolvedValue(mockResponse)

      const result = await documentsService.downloadDocument(id)

      expect(mockAxios.get).toHaveBeenCalledWith('/documents/1/download', {
        responseType: 'blob'
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getDocumentsByRelated', () => {
    it('should fetch documents by related object', async () => {
      const relatedType = 'deal'
      const relatedId = 123
      const params = { page: 1 }
      const mockResponse = { data: { data: [] } }
      mockAxios.get.mockResolvedValue(mockResponse)

      const result = await documentsService.getDocumentsByRelated(relatedType, relatedId, params)

      expect(mockAxios.get).toHaveBeenCalledWith('/documents', {
        params: {
          related_type: 'deal',
          related_id: 123,
          page: 1
        }
      })
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('linkDocument', () => {
    it('should link document to related object', async () => {
      const documentId = 1
      const relatedType = 'deal'
      const relatedId = 123
      const mockResponse = { data: { message: 'Document linked' } }
      mockAxios.post.mockResolvedValue(mockResponse)

      const result = await documentsService.linkDocument(documentId, relatedType, relatedId)

      expect(mockAxios.post).toHaveBeenCalledWith('/documents/1/link', {
        related_type: 'deal',
        related_id: 123
      })
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('bulkDelete', () => {
    it('should bulk delete documents', async () => {
      const documentIds = [1, 2, 3]
      const mockResponse = { data: { message: 'Documents deleted' } }
      mockAxios.delete.mockResolvedValue(mockResponse)

      const result = await documentsService.bulkDelete(documentIds)

      expect(mockAxios.delete).toHaveBeenCalledWith('/documents/bulk-delete', {
        data: { document_ids: [1, 2, 3] }
      })
      expect(result).toEqual(mockResponse.data)
    })
  })
})

