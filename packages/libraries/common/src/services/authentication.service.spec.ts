import { loggerErrorSpy } from '@pulse/toolbox/mocks'
import { apiGatewayPostMock } from '../__mocks__/vitest'
import { refreshClientToken, createNewPassword, updatePassword, login, logoutUser } from './authentication.service'

import type { CreateNewPasswordPayload, UpdatePasswordPayload, LoginPayload, LoginData } from './authentication.service.types'

describe('test authentication.service', () => {
  describe('refreshClientToken', () => {
    it('should call gateway properly', async () => {
      const mockedToken = 'mocked-token'
      const expectedGatewayPostArgument = 'authentication/api/refreshToken'

      apiGatewayPostMock.mockResolvedValue({
        data: mockedToken,
      })
      await refreshClientToken()

      expect(apiGatewayPostMock).toHaveBeenCalledExactlyOnceWith(expectedGatewayPostArgument, undefined, {
        skipTokenRefresh: true,
      })
    })
  })

  describe('createNewPassword', () => {
    it('should call gateway properly', async () => {
      const payload: CreateNewPasswordPayload = {
        token: 'fake-token',
        newPassword: 'new-password',
        contactId: 'fake-contact-id',
        isCreatePasswordAction: false,
      }
      const expectedUrl = 'password-experience/api/createNewPassword'
      const gatewayResponseMock = {}

      apiGatewayPostMock.mockResolvedValue(gatewayResponseMock)

      const response = await createNewPassword(payload)

      expect(response).toStrictEqual(gatewayResponseMock)
      expect(apiGatewayPostMock).toHaveBeenCalledExactlyOnceWith(expectedUrl, payload)
    })
  })

  describe('updatePassword', () => {
    it('should call gateway properly', async () => {
      const payload: UpdatePasswordPayload = {
        oldPassword: 'old-password',
        newPassword: 'new-password',
      }
      const contactId = 123456
      const expectedUrl = 'authentication/api/update-password'
      const gatewayResponseMock = {}

      apiGatewayPostMock.mockResolvedValue(gatewayResponseMock)

      const response = await updatePassword(payload, contactId)

      expect(response).toStrictEqual(gatewayResponseMock)
      expect(apiGatewayPostMock).toHaveBeenCalledExactlyOnceWith(expectedUrl, payload, {
        params: { contactId },
      })
    })
  })

  describe('login', () => {
    it('should call gateway properly', async () => {
      const loginPayload: LoginPayload = {
        email: 'email',
        password: 'password',
      }
      const expectedUrl = 'authentication/api/login'
      const loginResponseMock: LoginData = {
        userId: '123456',
        webToken: 'webToken',
      }
      const gatewayResponseMock = {
        data: loginResponseMock,
      }

      apiGatewayPostMock.mockResolvedValue(gatewayResponseMock)

      const response = await login(loginPayload)

      expect(response).toStrictEqual(loginResponseMock)
      expect(apiGatewayPostMock).toHaveBeenCalledExactlyOnceWith(expectedUrl, loginPayload)
    })
  })
  describe('logoutUser', () => {
    it('should call gateway with skipUnauthorizedCallback to prevent the 401-from-logout loop', async () => {
      const expectedUrl = 'authentication/api/logout'

      apiGatewayPostMock.mockResolvedValue(undefined as any)

      await logoutUser()

      expect(apiGatewayPostMock).toHaveBeenCalledExactlyOnceWith(expectedUrl, undefined, {
        skipUnauthorizedCallback: true,
      })
    })

    it('should log an error when the API call fails', async () => {
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      apiGatewayPostMock.mockRejectedValue(expectedErrorMessage)

      await logoutUser()

      expect(loggerErrorSpy).toHaveBeenCalledExactlyOnceWith('Error during client logout: ', expectedErrorMessage)
    })
  })
})
