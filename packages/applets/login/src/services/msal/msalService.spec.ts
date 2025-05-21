import { vi, describe, it, expect } from 'vitest'
import { loggerMock, loggerWarnSpy, envVarsMock } from '@pulse/core/mocks'
import { getStoreMock } from '@pulse/common/mocks'
import { useTokenStore } from '@pulse/common/stores'

import { getMSALToken } from '.'

const tokenStoreMock = getStoreMock(useTokenStore)

const getAccountMock = vi.hoisted(() => vi.fn())
const loginRedirectMocked = vi.hoisted(() => vi.fn())
const acquireTokenSilentMocked = vi.hoisted(() => vi.fn())

const msalInstanceMock = vi.hoisted(() => ({
  getAccount: getAccountMock,
  loginRedirect: loginRedirectMocked,
  acquireTokenSilent: acquireTokenSilentMocked,
}))

vi.mock('@pulse/core', () => ({ logger: loggerMock }))
vi.mock('env-vars', () => envVarsMock)

const UserAgentApplicationMock = vi.hoisted(() => vi.fn(() => (msalInstanceMock)))

vi.mock('msal', () => ({
  UserAgentApplication: UserAgentApplicationMock,
}))

describe('msalService', () => {
  describe('getMSALToken', () => {
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

      const token = await getMSALToken()

      expect(token).toBe(expectedToken)
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
      expect(loginRedirectMocked).not.toHaveBeenCalled()
    })
  })
})
