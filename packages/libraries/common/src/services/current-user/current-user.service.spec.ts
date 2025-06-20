import { describe, it, expect, vi } from 'vitest'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import { apiGatewayMock, apiGatewayGetMock } from '../../__mocks__/api-gateway.mocks'
import { getMockedUser } from '../../__mocks__'
import type { UserInfo } from '../../stores/types'

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
      const expectedUser: UserInfo = {
        id: 123,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        isCollab: true,
        gigyaUserId: '',
        occupation: '',
        officeMobile: 'johnd-mobile-phone',
        oldId: 'johnd-guid',
        persona: {
          id: 1,
          description: '',
          name: 'Collaborator GS',
        },
        entities: {
          default: undefined,
        },
      }
      apiGatewayGetMock.mockResolvedValueOnce({
        data: userMock,
      })
      const currentUser = await CurrentUserService.getCurrentUser()

      expect(apiGatewayGetMock).toHaveBeenCalledOnce()
      expect(apiGatewayGetMock).toHaveBeenNthCalledWith(1, expectedUrl)
      expect(currentUser).toStrictEqual(expectedUser)
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
})
