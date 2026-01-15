import { apiGatewayMock } from '../../__mocks__/vitest'
import { getMockedPennylaneRole, getMockedPennylaneAvailableRole, getMockedPennylaneDocument, getMockedPennylaneDocumentsQueryResult, getMockedPennylaneAccessResponse } from '../../__mocks__'
import { API_PREFIXES } from '../../constants/api-prefixes'

import { PennylaneService } from './pennylane.service'

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: apiGatewayMock,
  }),
}))

const roleMock = getMockedPennylaneRole()
const documentMock = getMockedPennylaneDocument()
const documentsMock = [documentMock]

describe('PennylaneService', () => {
  describe('getAvailableRoles', () => {
    it('should call properly commonApi.gateway.get only once when several call', async () => {
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
    it('should call properly commonApi.gateway.get only once when several call', async () => {
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
    it('should call properly commonApi.gateway.get without pagination params', async () => {
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

    it('should call properly commonApi.gateway.get with pagination params', async () => {
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
    it('should call properly commonApi.gateway.get', async () => {
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
    it('should call properly commonApi.gateway.post', async () => {
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
    it('should call properly commonApi.gateway.get with account number', async () => {
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
})
