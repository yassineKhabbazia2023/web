import { apiGatewayMock } from '../../__mocks__/vitest'
import { getMockedPennylaneRole, getMockedPennylaneAvailableRole, getMockedPennylaneDocument, getMockedPennylaneDocumentsQueryResult, getMockedPennylaneAccessResponse } from '../../__mocks__'
import { API_PREFIXES } from '../../constants/api-prefixes'

import { PennylaneService } from './pennylane.service'

vi.mock('@pulse/common/api', () => ({
  api: ({
    gateway: apiGatewayMock,
  }),
}))

vi.mock('env-vars', () => ({
  VITE_API_GATEWAY: 'https://api.mock.com',
}))

const roleMock = getMockedPennylaneRole()
const documentMock = getMockedPennylaneDocument()
const documentsMock = [documentMock]

describe('PennylaneService', () => {
  describe('getAvailableRoles', () => {
    it('should call properly api.gateway.get only once when several call', async () => {
      const rolesMock = [
        getMockedPennylaneAvailableRole(),
        getMockedPennylaneAvailableRole({
          code: 'compta',
          label: 'comptable',
          description: 'comptable',
        }),
      ]
      const companyId = '1'
      const accountId = 123
      const contactId = 456
      const expectedUrl = `${API_PREFIXES.PENNYLANE}/roles`
      const expectedParams = {
        params: {
          companyId,
          accountId,
          contactId,
        },
      }
      apiGatewayMock.get.mockResolvedValue({
        data: rolesMock,
      })
      const roles = await PennylaneService.getAvailableRoles(companyId, accountId, contactId)

      expect(roles).toStrictEqual(rolesMock)
      expect(apiGatewayMock.get).toHaveBeenCalledExactlyOnceWith(expectedUrl, expectedParams)
    })
  })

  describe('getAccountContactRole', () => {
    it('should call properly api.gateway.get only once when several call', async () => {
      const accountIdMock = 23
      const contactIdMock = 756
      const expectedUrl = `${API_PREFIXES.PENNYLANE}/role/accounts/${accountIdMock}/contacts/${contactIdMock}`

      apiGatewayMock.get.mockResolvedValue({
        data: roleMock,
      })
      const role = await PennylaneService.getAccountContactRole(accountIdMock, contactIdMock)

      expect(role).toStrictEqual(roleMock)
      expect(apiGatewayMock.get).toHaveBeenCalledExactlyOnceWith(expectedUrl)
    })
  })

  describe('getDocuments', () => {
    it('should call properly api.gateway.get without pagination params', async () => {
      const accountNumberMock = '2025546345'
      const accountIdMock = 26
      const expectedUrl = `${API_PREFIXES.PENNYLANE}/accounts/${accountIdMock}/documents/currentuser`
      const queryParams = {
        accountNumber: accountNumberMock,
        page: undefined,
        pageSize: undefined,
      }
      const expectedParams = {
        params: queryParams,
      }
      const documentsResultMock = getMockedPennylaneDocumentsQueryResult({
        items: documentsMock,
      })

      apiGatewayMock.get.mockResolvedValue({
        data: documentsResultMock,
      })
      const documents = await PennylaneService.getDocuments(accountNumberMock, accountIdMock)

      expect(documents).toStrictEqual(documentsResultMock)
      expect(apiGatewayMock.get).toHaveBeenCalledExactlyOnceWith(expectedUrl, expectedParams)
    })

    it('should call properly api.gateway.get with pagination params', async () => {
      const accountNumberMock = '2025546345'
      const accountIdMock = 26
      const pageMock = 2
      const pageSizeMock = 25
      const expectedUrl = `${API_PREFIXES.PENNYLANE}/accounts/${accountIdMock}/documents/currentuser`
      const queryParams = {
        accountNumber: accountNumberMock,
        page: pageMock,
        pageSize: pageSizeMock,
      }
      const expectedParams = {
        params: queryParams,
      }
      const documentsResultMock = getMockedPennylaneDocumentsQueryResult({
        items: documentsMock,
      })

      apiGatewayMock.get.mockResolvedValue({
        data: documentsResultMock,
      })
      const documents = await PennylaneService.getDocuments(accountNumberMock, accountIdMock, pageMock, pageSizeMock)

      expect(documents).toStrictEqual(documentsResultMock)
      expect(apiGatewayMock.get).toHaveBeenCalledExactlyOnceWith(expectedUrl, expectedParams)
    })
  })

  describe('getDocumentContent', () => {
    it('should call properly api.gateway.get', async () => {
      const documentContentMock = 'document content mock'
      const accountNumberMock = '2025546345'
      const accountIdMock = 26
      const documentIdMock = 23
      const expectedUrl = `${API_PREFIXES.PENNYLANE}/accounts/${accountIdMock}/documents/${documentIdMock}/content/currentuser`
      const queryParams = {
        accountNumber: accountNumberMock,
      }
      const expectedParams = {
        params: queryParams,
        responseType: 'arraybuffer',
      }
      apiGatewayMock.get.mockResolvedValue({
        data: documentContentMock,
      })
      const documentContent = await PennylaneService.getDocumentContent(accountNumberMock, accountIdMock, documentIdMock)

      expect(documentContent).toStrictEqual(documentContentMock)
      expect(apiGatewayMock.get).toHaveBeenCalledExactlyOnceWith(expectedUrl, expectedParams)
    })
  })

  describe('createRole', () => {
    it('should call properly api.gateway.post', async () => {
      const expectedUrl = `${API_PREFIXES.PENNYLANE}/role`

      await PennylaneService.createRole(roleMock)

      expect(apiGatewayMock.post).toHaveBeenCalledExactlyOnceWith(
        expectedUrl,
        roleMock,
        { params: { accountId: roleMock.accountId, contactId: roleMock.contactId } },
      )
    })
  })

  describe('checkPennylaneAccess', () => {
    it('should call properly api.gateway.get with account number', async () => {
      const accountIdMock = 602
      const expectedUrl = `${API_PREFIXES.PENNYLANE}/accounts/${accountIdMock}/access/currentuser`
      const accessResponseMock = getMockedPennylaneAccessResponse()

      apiGatewayMock.get.mockResolvedValue({
        data: accessResponseMock,
      })
      const accessResponse = await PennylaneService.checkPennylaneAccess(accountIdMock)

      expect(accessResponse).toStrictEqual(accessResponseMock)
      expect(apiGatewayMock.get).toHaveBeenCalledExactlyOnceWith(expectedUrl)
    })

    it('should handle response when isPennylaneSignatory and details are undefined', async () => {
      const accountIdMock = 602
      const expectedUrl = `${API_PREFIXES.PENNYLANE}/accounts/${accountIdMock}/access/currentuser`
      const minimalResponseMock = getMockedPennylaneAccessResponse({
        isPennylaneSignatory: undefined,
        details: undefined,
      })

      apiGatewayMock.get.mockResolvedValue({
        data: minimalResponseMock,
      })
      const accessResponse = await PennylaneService.checkPennylaneAccess(accountIdMock)

      expect(accessResponse.canAccess).toBeDefined()
      expect(accessResponse.isPennylaneSignatory).toBeUndefined()
      expect(accessResponse.details).toBeUndefined()
      expect(apiGatewayMock.get).toHaveBeenCalledExactlyOnceWith(expectedUrl)
    })
  })

  describe('getTermsContent', () => {
    it('should call properly api.gateway.get without accountId', async () => {
      const termsContentMock = new ArrayBuffer(8)
      const expectedUrl = `${API_PREFIXES.PENNYLANE}/terms/content`
      const expectedParams = {
        responseType: 'arraybuffer',
      }

      apiGatewayMock.get.mockResolvedValue({
        data: termsContentMock,
      })
      const termsContent = await PennylaneService.getTermsContent()

      expect(termsContent).toStrictEqual(termsContentMock)
      expect(apiGatewayMock.get).toHaveBeenCalledExactlyOnceWith(expectedUrl, expectedParams)
    })
  })

  describe('validatePennylaneAmendment', () => {
    it('should call properly api.gateway.post with details', async () => {
      const detailsMock = {
        accountNumbers: ['123456', '789012'],
        status: true,
      }
      const expectedUrl = `${API_PREFIXES.PENNYLANE}/validation/currentuser`

      apiGatewayMock.post.mockResolvedValue({ data: undefined })

      await PennylaneService.validatePennylaneAmendment(detailsMock)

      expect(apiGatewayMock.post).toHaveBeenCalledExactlyOnceWith(expectedUrl, detailsMock)
    })
  })
})
