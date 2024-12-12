import { vi, describe, it, expect } from 'vitest'
import { getToken } from '.'

const amplitudeServiceTrackMocked = vi.hoisted(() => vi.fn())
const setTokenMocked = vi.hoisted(() => vi.fn())
const loggerDebugSpy = vi.hoisted(() => vi.fn())
const loggerWarnSpy = vi.hoisted(() => vi.fn())
const loggerErrorSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', () => ({
  logger: {
    debug: loggerDebugSpy,
    warn: loggerWarnSpy,
    error: loggerErrorSpy,
  },
}))

vi.mock('@pulse/common', () => ({
  amplitudeService: {
    track: amplitudeServiceTrackMocked,
    reset: vi.fn(),
    setNewUserProperty: vi.fn(),
  },
  tokenService: {
    getToken: vi.fn(),
    setToken: setTokenMocked,
  },
}))

vi.mock('env-vars', () => ({
  VITE_API_MSAL_CLIENT_ID: '',
  VITE_API_MSAL_TENANT: '',
  VITE_API_MSAL_AUTHORITY: 'given-token',
  VITE_API_MSAL_REDIRECT_URI: '',
  VITE_API_MSAL_POST_LOGOUT_REDIRECT_URI: '',
  VITE_API_MSAL_SCOPE: '',
}))
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

const UserAgentApplicationMock = vi.hoisted(() => vi.fn(() => (msalInstanceMock)))

vi.mock('msal', () => ({
  UserAgentApplication: UserAgentApplicationMock,
}))

describe('msalService', () => {
  describe('getToken', () => {
    it('should return proper token msalInstance has no error', async () => {
      const userNameMocked = 'userName mocked'
      const accessTokenMocked = 'accessToken mocked'
      getAccountMock.mockReturnValue({
        userName: userNameMocked,
      })
      acquireTokenSilentMocked.mockResolvedValue({
        accessToken: accessTokenMocked,
      })
      const expectedToken = accessTokenMocked

      const token = await getToken()

      expect(token).toBe(expectedToken)
      expect(amplitudeServiceTrackMocked).toHaveBeenCalledOnce()
      expect(amplitudeServiceTrackMocked).toHaveBeenNthCalledWith(1,
        'Sign In Completed', {
          sign_in_method: 'SSO',
          sign_in_result: 'succeeded',
        })

      expect(setTokenMocked).toHaveBeenCalledOnce()
      expect(setTokenMocked).toHaveBeenNthCalledWith(1, expectedToken)

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

      const token = await getToken()

      expect(token).toBeUndefined()
      expect(loggerWarnSpy).toHaveBeenCalledOnce()
      expect(loggerWarnSpy).toHaveBeenNthCalledWith(1, error)

      expect(amplitudeServiceTrackMocked).toHaveBeenCalledOnce()
      expect(amplitudeServiceTrackMocked).toHaveBeenNthCalledWith(1,
        'Sign In Completed', {
          sign_in_method: 'SSO',
          sign_in_result: 'failed',
        })

      expect(setTokenMocked).not.toHaveBeenCalled()

      expect(loginRedirectMocked).toHaveBeenCalledOnce()
      expect(loginRedirectMocked).toHaveBeenCalledWith(/* nothing */)
    })

    it('should return null when msalInstance has not account', async () => {
      getAccountMock.mockReturnValue(undefined)
      const token = await getToken()

      expect(token).toBeNull()
      expect(loggerWarnSpy).not.toHaveBeenCalled()

      expect(amplitudeServiceTrackMocked).not.toHaveBeenCalled()
      expect(setTokenMocked).not.toHaveBeenCalled()

      expect(loginRedirectMocked).not.toHaveBeenCalled()
    })
  })
})
