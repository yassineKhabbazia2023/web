import { vi, describe, it, expect } from 'vitest'
import { setTokenMock, tokenServiceMock } from '@common/__mocks__/token.service.mocks'
import { refreshClientToken, createNewPassword, isInvitationTokenValid, login } from './authentication.service'
import type { CreateNewPasswordPayload, LoginPayload, LoginData } from './authentication.service.types'

const gatewayPostMock = vi.fn()
const gatewayGetMock = vi.fn()

vi.mock('../api', () => ({
  default: () => ({
    gateway: {
      post: gatewayPostMock,
      get: gatewayGetMock,
    },
  }),
}))

vi.mock('../token', () => tokenServiceMock)

describe('test authentication.service', () => {
  describe('refreshClientToken', () => {
    it('should call gateway properly', async () => {
      const mockedToken = 'mocked-token'
      const mockedSub = 'mocked-sub'
      const expectedGatewayPostArgument = `authentication/api/refreshToken?userId=${mockedSub}`

      gatewayPostMock.mockResolvedValue({
        data: mockedToken,
      })
      await refreshClientToken(mockedSub)

      expect(gatewayPostMock).toHaveBeenCalledOnce()
      expect(gatewayPostMock).toHaveBeenCalledWith(expectedGatewayPostArgument)

      expect(setTokenMock).toHaveBeenCalledOnce()
      expect(setTokenMock).toHaveBeenCalledWith(mockedToken)
    })
  })

  describe('createNewPassword', () => {
    it('should call gateway properly', async () => {
      const payload: CreateNewPasswordPayload = {
        contactId: 'contact-id',
        newPassword: 'new-password',
        resetPasswordToken: 'token',
        isCreatePasswordAction: false,
      }
      const expectedUrl = 'authentication/api/createNewPassword'
      const gatewayResponseMock = {}

      gatewayPostMock.mockResolvedValue(gatewayResponseMock)

      const response = await createNewPassword(payload)

      expect(response).toStrictEqual(gatewayResponseMock)
      expect(gatewayPostMock).toHaveBeenCalledOnce()
      expect(gatewayPostMock).toHaveBeenCalledWith(expectedUrl, payload)
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

      gatewayGetMock.mockResolvedValue(gatewayResponseMock)

      const response = await isInvitationTokenValid(invitationToken)

      expect(response).toStrictEqual(isValidMock)
      expect(gatewayGetMock).toHaveBeenCalledOnce()
      expect(gatewayGetMock).toHaveBeenCalledWith(expectedUrl, expectedQueryParams)
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
        userId: 123456,
        webToken: 'webToken',
      }
      const gatewayResponseMock = {
        data: loginResponseMock,
      }

      gatewayPostMock.mockResolvedValue(gatewayResponseMock)

      const response = await login(loginPayload)

      expect(response).toStrictEqual(loginResponseMock)
      expect(gatewayPostMock).toHaveBeenCalledOnce()
      expect(gatewayPostMock).toHaveBeenCalledWith(expectedUrl, loginPayload)
    })
  })
})
