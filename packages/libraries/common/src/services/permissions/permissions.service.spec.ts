import { describe, it, expect, vi } from 'vitest'
import { loggerErrorSpy, loggerMock } from '@pulse/toolbox/mocks'
import { apiGatewayMock, apiGatewayGetMock } from '../../__mocks__/vitest'
import {
  fetchUserPermissions,
  fetchUserAccountPermissions,
} from './permissions.service'
import { getPermissionsMock } from '@common/__mocks__'

vi.mock('../../api', () => ({
  api: {
    gateway: apiGatewayMock,
  },
}))

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

const permissionsMock = getPermissionsMock()
const accountId = 123456

describe('test permissions.service', () => {
  describe('fetchUserPermissions', () => {
    it('should return permissions', async () => {
      const expectedUrl = 'authorization/api/authorization/currentuser'
      apiGatewayGetMock.mockResolvedValueOnce({
        data: permissionsMock,
      })
      const permissions = await fetchUserPermissions()

      expect(apiGatewayGetMock).toHaveBeenCalledOnce()
      expect(apiGatewayGetMock).toHaveBeenNthCalledWith(1, expectedUrl)
      expect(permissions).toStrictEqual(permissionsMock)
    })

    it('should call logger when api throws an error', async () => {
      const errorMock = 'error mock'
      const expectedErrorMessage = 'Unable to retrieve user permissions: '
      apiGatewayGetMock.mockRejectedValueOnce(errorMock)
      const permissions = await fetchUserPermissions()

      expect(permissions).toBeUndefined()
      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, expectedErrorMessage, errorMock)
    })
  })

  describe('fetchUserAccountPermissions', () => {
    it('should return permissions for given account', async () => {
      const expectedUrl = `authorization/api/authorization/currentuser?accountId=${accountId}`
      apiGatewayGetMock.mockResolvedValueOnce({
        data: permissionsMock,
      })

      const permissions = await fetchUserAccountPermissions(accountId)

      expect(apiGatewayGetMock).toHaveBeenCalledOnce()
      expect(apiGatewayGetMock).toHaveBeenNthCalledWith(1, expectedUrl)
      expect(permissions).toStrictEqual(permissionsMock)
    })

    it('should call logger when api throws an error', async () => {
      const errorMock = 'error mock'
      const expectedErrorMessage = `Unable to retrieve permissions for accountId: ${accountId}`
      apiGatewayGetMock.mockRejectedValueOnce(errorMock)

      const permissions = await fetchUserAccountPermissions(accountId)

      expect(permissions).toBeUndefined()
      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, expectedErrorMessage, errorMock)
    })
  })
})
