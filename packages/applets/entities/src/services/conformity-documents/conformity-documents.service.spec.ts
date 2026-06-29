import { apiGatewayMock } from '@pulse/common/mocks/vitest'
import { API_PREFIXES } from '@pulse/common/constants'
import { SupportingDocumentType } from '@entities/enums'
import { getConformityDocumentsResponseMock, getSupportingDocumentsResponseMock } from '@entities/__mocks__'
import { ConformityDocumentsService } from './conformity-documents.service'

vi.mock('@pulse/common/api', () => ({
  api: {
    gateway: apiGatewayMock,
  },
}))

const prospectId = 602
const accountId = 602

describe('ConformityDocumentsService', () => {
  describe('getConformityDocuments', () => {
    it('should GET the documents of the prospect and return the data', async () => {
      const responseData = getConformityDocumentsResponseMock()
      apiGatewayMock.get.mockResolvedValueOnce({ data: responseData })

      const result = await ConformityDocumentsService.getConformityDocuments(prospectId)

      expect(apiGatewayMock.get).toHaveBeenCalledWith(`${API_PREFIXES.PROSPECT}/onboarding/${prospectId}/documents`)
      expect(result).toEqual(responseData)
    })
  })

  describe('getSupportingDocuments', () => {
    it('should GET the supporting documents of the prospect and return the data', async () => {
      const responseData = getSupportingDocumentsResponseMock()
      apiGatewayMock.get.mockResolvedValueOnce({ data: responseData })

      const result = await ConformityDocumentsService.getSupportingDocuments(accountId)

      expect(apiGatewayMock.get).toHaveBeenCalledWith(
        `${API_PREFIXES.PROSPECT}/onboarding/${accountId}/supporting-documents`,
      )
      expect(result).toEqual(responseData)
    })
  })

  describe('uploadConformityDocument', () => {
    it('should POST a multipart form with the document type and file', async () => {
      const file = new File(['content'], 'kbis.pdf', { type: 'application/pdf' })

      await ConformityDocumentsService.uploadConformityDocument(prospectId, SupportingDocumentType.KBIS, file)

      expect(apiGatewayMock.post).toHaveBeenCalledWith(
        `${API_PREFIXES.PROSPECT}/onboarding/${prospectId}/supporting-documents/upload`,
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      const [, formData] = apiGatewayMock.post.mock.calls[0]
      expect(formData.get('documentType')).toBe('KBIS')
      expect(formData.get('file')).toBe(file)
    })
  })

  describe('getConformityDocumentContent', () => {
    it('should GET the document content as a blob and return it', async () => {
      const blob = new Blob(['binary'], { type: 'application/pdf' })
      apiGatewayMock.get.mockResolvedValueOnce({ data: blob })

      const result = await ConformityDocumentsService.getConformityDocumentContent(prospectId, 42)

      expect(apiGatewayMock.get).toHaveBeenCalledWith(
        `${API_PREFIXES.PROSPECT}/onboarding/${prospectId}/documents/42/content`,
        { responseType: 'blob' },
      )
      expect(result).toBe(blob)
    })
  })
})
