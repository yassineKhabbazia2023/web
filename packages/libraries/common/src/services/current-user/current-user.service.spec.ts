import { describe, it, expect, vi } from 'vitest'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import { apiGatewayMock, apiGatewayGetMock } from '../../__mocks__/api-gateway.mocks'
import { getMockedUser, getMockedUserContext } from '../../__mocks__'

import { CurrentUserService } from './current-user.service'

vi.mock('../../api', () => ({
  default: () => ({
    gateway: apiGatewayMock,
  }),
}))

vi.mock('@pulse/core', () => ({ logger: loggerMock }))

describe('test current-user.service', () => {
  describe('fetchUserPermissions', () => {
    it('should return current-user', async () => {
      const expectedUrl = 'contact/me'
      const userMock = getMockedUser()
      apiGatewayGetMock.mockResolvedValueOnce({
        data: userMock,
      })
      await CurrentUserService.getCurrentUser()

      expect(apiGatewayGetMock).toHaveBeenCalledOnce()
      expect(apiGatewayGetMock).toHaveBeenNthCalledWith(1, expectedUrl)
    })

    it('should call logger when api throws an error', async () => {
      const errorMock = 'error mock'
      const expectedErrorMessage = 'Unable to retrieve current-user'
      apiGatewayGetMock.mockRejectedValueOnce(errorMock)
      const currentUser = await CurrentUserService.getCurrentUser()

      expect(currentUser).toBeUndefined()
      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, expectedErrorMessage, errorMock)
    })
  })
  describe('getCurrentUserContext', () => {
    it('should return context-current-user', async () => {
      const expectedUrl = 'connect/api/get-user-information'
      const userMock = getMockedUserContext()
      apiGatewayGetMock.mockResolvedValueOnce({
        data: userMock,
      })
      await CurrentUserService.getCurrentUserContext()

      expect(apiGatewayGetMock).toHaveBeenCalledOnce()
      expect(apiGatewayGetMock).toHaveBeenNthCalledWith(1, expectedUrl)
    })

    it('should call logger when api throws an error', async () => {
      const errorMock = 'error mock'
      const expectedErrorMessage = 'Unable to retrieve current-user'
      apiGatewayGetMock.mockRejectedValueOnce(errorMock)
      const currentUser = await CurrentUserService.getCurrentUserContext()

      expect(currentUser).toBeUndefined()
      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, expectedErrorMessage, errorMock)
    })
  })
})
