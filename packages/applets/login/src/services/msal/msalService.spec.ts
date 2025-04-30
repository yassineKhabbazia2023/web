import { vi, describe, it, expect } from 'vitest'
import { loggerMock, loggerWarnSpy , envVarsMock } from '@pulse/core/mocks'
import { getStoreMock } from '@pulse/common/mocks'
import { useTokenStore } from '@pulse/common/stores'

import { getMSALToken } from '.'

const tokenStoreMock = getStoreMock(useTokenStore)

const amplitudeServiceTrackMock = vi.hoisted(() => vi.fn())

const getAccountMock = vi.hoisted(() => vi.fn())
const loginRedirectMocked = vi.hoisted(() => vi.fn())
const acquireTokenPopupMocked = vi.hoisted(() => vi.fn())
const acquireTokenSilentMocked = vi.hoisted(() => vi.fn())

const msalInstanceMock = vi.hoisted(() => ({
  getAccount: getAccountMock,
  loginRedirect: loginRedirectMocked,
  acquireTokenPopup: acquireTokenPopupMocked,
  acquireTokenSilent: acquireTokenSilentMocked,
}))

vi.mock('@pulse/core', () => ({ logger: loggerMock }))

vi.mock('@pulse/common', () => ({
  amplitudeService: {
    track: amplitudeServiceTrackMock,
    reset: vi.fn(),
    setNewUserProperty: vi.fn(),
  },
  msalInstance: msalInstanceMock,
}))

vi.mock('env-vars', () => envVarsMock)

const UserAgentApplicationMock = vi.hoisted(() => vi.fn(() => (msalInstanceMock)))

vi.mock('msal', () => ({
  UserAgentApplication: UserAgentApplicationMock,
}))

describe('msalService', () => {
  describe('getMSALToken', () => {
    it.skip('should return proper token msalInstance has no error', async () => {
      const userNameMocked = 'userName mocked'
      const accessTokenMocked = 'accessToken mocked'
      getAccountMock.mockReturnValue({
        userName: userNameMocked,
      })
      acquireTokenSilentMocked.mockResolvedValue({
        accessToken: accessTokenMocked,
      })
      const expectedToken = accessTokenMocked

      const token = await getMSALToken()

      expect(token).toBe(expectedToken)
      expect(amplitudeServiceTrackMock).toHaveBeenCalledOnce()
      expect(amplitudeServiceTrackMock).toHaveBeenNthCalledWith(1,
        'Sign In Completed', {
          sign_in_method: 'SSO',
          sign_in_result: 'succeeded',
        })

      expect(tokenStoreMock.setTokenExpiration).toHaveBeenCalledOnce()
      expect(tokenStoreMock.setTokenExpiration).toHaveBeenNthCalledWith(1, expectedToken)

      expect(loginRedirectMocked).not.toHaveBeenCalled()
    })

    it('should redirect when msalInstance throws an error', async () => {
      const userNameMocked = 'userName mocked'
      getAccountMock.mockReturnValue({
        userName: userNameMocked,
      })
      const errorMessage = 'error-message'
      const error = new Error(errorMessage)
      acquireTokenSilentMocked.mockRejectedValue(error)

      const token = await getMSALToken()

      expect(token).toBeUndefined()
      expect(loggerWarnSpy).toHaveBeenCalledOnce()
      expect(loggerWarnSpy).toHaveBeenNthCalledWith(1, error)

      expect(tokenStoreMock.setTokenExpiration).not.toHaveBeenCalled()

      expect(loginRedirectMocked).toHaveBeenCalledOnce()
      expect(loginRedirectMocked).toHaveBeenCalledWith(/* nothing */)
    })

    it('should return null when msalInstance has no account', async () => {
      getAccountMock.mockReturnValue(undefined)
      const token = await getMSALToken()

      expect(token).toBeNull()
      expect(loggerWarnSpy).not.toHaveBeenCalled()

      expect(amplitudeServiceTrackMock).not.toHaveBeenCalled()
      expect(tokenStoreMock.setTokenExpiration).not.toHaveBeenCalled()

      expect(loginRedirectMocked).not.toHaveBeenCalled()
    })
  })
})
