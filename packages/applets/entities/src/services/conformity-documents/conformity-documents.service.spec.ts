import { apiGatewayMock } from '@pulse/common/mocks/vitest'
import { API_PREFIXES } from '@pulse/common/constants'
import { ConformityDocumentType } from '@entities/enums'
import { ConformityDocumentsService } from './conformity-documents.service'

vi.mock('@pulse/common/api', () => ({
  api: {
    gateway: apiGatewayMock,
  },
}))

const prospectId = 602

describe('ConformityDocumentsService', () => {
  describe('getConformityDocuments', () => {
    it('should GET the documents of the prospect and return the data', async () => {
      const responseData = { status: 'InProgress', isComplete: false, requiredDocs: [] }
      apiGatewayMock.get.mockResolvedValueOnce({ data: responseData })

      const result = await ConformityDocumentsService.getConformityDocuments(prospectId)

      expect(apiGatewayMock.get).toHaveBeenCalledWith(`${API_PREFIXES.PROSPECT}/prospects/${prospectId}/documents`)
      expect(result).toEqual(responseData)
    })
  })

  describe('uploadConformityDocument', () => {
    it('should POST a multipart form with the document type and file', async () => {
      const file = new File(['content'], 'kbis.pdf', { type: 'application/pdf' })

      await ConformityDocumentsService.uploadConformityDocument(prospectId, ConformityDocumentType.KBIS, file)

      expect(apiGatewayMock.post).toHaveBeenCalledWith(
        `${API_PREFIXES.PROSPECT}/prospects/${prospectId}/documents`,
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      const [, formData] = apiGatewayMock.post.mock.calls[0]
      expect(formData.get('documentType')).toBe('KBIS')
      expect(formData.get('file')).toBe(file)
    })
  })

  describe('markConformityDocumentsAsCompleted', () => {
    it('should PUT the justificatifs complete endpoint', async () => {
      await ConformityDocumentsService.markConformityDocumentsAsCompleted(prospectId)

      expect(apiGatewayMock.put).toHaveBeenCalledWith(
        `${API_PREFIXES.PROSPECT}/prospects/${prospectId}/justificatifs/complete`,
      )
    })
  })

  describe('getConformityDocumentContent', () => {
    it('should GET the document content as a blob and return it', async () => {
      const blob = new Blob(['binary'], { type: 'application/pdf' })
      apiGatewayMock.get.mockResolvedValueOnce({ data: blob })

      const result = await ConformityDocumentsService.getConformityDocumentContent(prospectId, 42)

      expect(apiGatewayMock.get).toHaveBeenCalledWith(
        `${API_PREFIXES.PROSPECT}/prospects/${prospectId}/documents/42/content`,
        { responseType: 'blob' },
      )
      expect(result).toBe(blob)
    })
  })
})
