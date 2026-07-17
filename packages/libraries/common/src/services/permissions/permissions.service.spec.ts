import { loggerErrorSpy } from '@pulse/toolbox/mocks'
import { apiGatewayGetMock } from '../../__mocks__/vitest'
import {
  fetchUserPermissions,
  fetchUserAccountPermissions,
} from './permissions.service'
import { getPermissionsMock } from '@common/__mocks__'

const permissionsMock = getPermissionsMock()
const accountId = 123456

describe('test permissions.service', () => {
  describe('fetchUserPermissions', () => {
    it('should return permissions', async () => {
      const expectedUrl = 'authorization/api/authorization/currentuser'
      apiGatewayGetMock.mockResolvedValue({
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
      apiGatewayGetMock.mockRejectedValue(errorMock)
      const permissions = await fetchUserPermissions()

      expect(permissions).toBeUndefined()
      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, expectedErrorMessage, errorMock)
    })
  })

  describe('fetchUserAccountPermissions', () => {
    it('should return permissions for given account', async () => {
      const expectedUrl = `authorization/api/authorization/currentuser?accountId=${accountId}`
      apiGatewayGetMock.mockResolvedValue({
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
      apiGatewayGetMock.mockRejectedValue(errorMock)

      const permissions = await fetchUserAccountPermissions(accountId)

      expect(permissions).toBeUndefined()
      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, expectedErrorMessage, errorMock)
    })
  })
})
