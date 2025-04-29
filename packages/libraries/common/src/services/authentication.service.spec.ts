import { vi, describe, it, expect } from 'vitest'
import { apiGatewayMock, apiGatewayPostMock, apiGatewayGetMock } from '../__mocks__/api-gateway.mocks'
import { refreshClientToken, createNewPassword, isInvitationTokenValid, login } from './authentication.service'
import { useTokenStore } from '../stores/token/token.store'
import { getStoreMock } from '../__mocks__/store.mocks'

import type { CreateNewPasswordPayload, LoginPayload, LoginData } from './authentication.service.types'

const tokenStoreMock = getStoreMock(useTokenStore)

vi.mock('../api', () => ({
  default: () => ({
    gateway: apiGatewayMock,
  }),
}))

describe('test authentication.service', () => {
  describe('refreshClientToken', () => {
    it('should call gateway properly', async () => {
      const mockedToken = 'mocked-token'
      const mockedSub = 'mocked-sub'
      const expectedGatewayPostArgument = `authentication/api/refreshToken?userId=${mockedSub}`

      apiGatewayPostMock.mockResolvedValue({
        data: mockedToken,
      })
      await refreshClientToken(mockedSub)

      expect(apiGatewayPostMock).toHaveBeenCalledOnce()
      expect(apiGatewayPostMock).toHaveBeenCalledWith(expectedGatewayPostArgument)

      expect(tokenStoreMock.setTokenExpiration).toHaveBeenCalledOnce()
      expect(tokenStoreMock.setTokenExpiration).toHaveBeenCalledWith(mockedToken)
    })
  })

  describe('createNewPassword', () => {
    it('should call gateway properly', async () => {
      const payload: CreateNewPasswordPayload = {
        contactId: 'contact-id',
        newPassword: 'new-password',
        isCreatePasswordAction: false,
      }
      const expectedUrl = 'authentication/api/createNewPassword'
      const gatewayResponseMock = {}

      apiGatewayPostMock.mockResolvedValue(gatewayResponseMock)

      const response = await createNewPassword(payload)

      expect(response).toStrictEqual(gatewayResponseMock)
      expect(apiGatewayPostMock).toHaveBeenCalledOnce()
      expect(apiGatewayPostMock).toHaveBeenCalledWith(expectedUrl, payload)
    })
  })

  describe('isInvitationTokenValid', () => {
    it('should call gateway properly', async () => {
      const invitationToken = 'token-mock'
      const expectedUrl = 'authentication/api/IsInvitationTokenValid'
      const expectedQueryParams = {
        params: {
          invitationToken,
        },
      }
      const isValidMock = true
      const gatewayResponseMock = {
        data: isValidMock,
      }

      apiGatewayGetMock.mockResolvedValue(gatewayResponseMock)

      const response = await isInvitationTokenValid(invitationToken)

      expect(response).toStrictEqual(isValidMock)
      expect(apiGatewayGetMock).toHaveBeenCalledOnce()
      expect(apiGatewayGetMock).toHaveBeenCalledWith(expectedUrl, expectedQueryParams)
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
      expect(apiGatewayPostMock).toHaveBeenCalledOnce()
      expect(apiGatewayPostMock).toHaveBeenCalledWith(expectedUrl, loginPayload)
    })
  })
})
