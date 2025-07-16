import { vi, describe, it, expect } from 'vitest'
import { apiGatewayMock } from '../../__mocks__/api-gateway.mocks'
import { getMockedPennylaneRole, getMockedPennylaneAvailableRole } from '../../__mocks__/pennylane.mocks'
import { API_PREFIXES } from '../../constants/api-prefixes'

import { PennylaneService } from './pennylane.service'

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: apiGatewayMock,
  }),
}))

const roleMock = getMockedPennylaneRole()

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
      const expectedUrl = `${API_PREFIXES.PENNYLANE}/roles`
      const expectedParams = {
        params: {
          companyId,
        },
      }
      apiGatewayMock.get.mockResolvedValue({
        data: rolesMock,
      })
      const roles = await PennylaneService.getAvailableRoles(companyId)

      expect(roles).toStrictEqual(rolesMock)
      expect(apiGatewayMock.get).toHaveBeenCalledOnce()
      expect(apiGatewayMock.get).toHaveBeenCalledWith(expectedUrl, expectedParams)
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
      expect(apiGatewayMock.get).toHaveBeenCalledOnce()
      expect(apiGatewayMock.get).toHaveBeenCalledWith(expectedUrl)
    })
  })

  describe('createRole', () => {
    it('should call properly commonApi.gateway.post', async () => {
      const expectedUrl = `${API_PREFIXES.PENNYLANE}/role`

      await PennylaneService.createRole(roleMock)

      expect(apiGatewayMock.post).toHaveBeenCalledOnce()
      expect(apiGatewayMock.post).toHaveBeenCalledWith(expectedUrl, roleMock)
    })
  })
})
