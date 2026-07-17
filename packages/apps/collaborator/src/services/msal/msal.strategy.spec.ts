import { loggerMock } from '@pulse/toolbox/mocks'
import { AmplitudeServiceMock, getStoreMock } from '@pulse/common/mocks/vitest'
import { CurrentUserManager } from '@pulse/common/managers'
import { CurrentUserService } from '@pulse/common/services/current-user'
import { tokenIsValid, useUserStore } from '@pulse/common/stores'
import type { UserInfo } from '@pulse/common/types'

import { MsalService } from './msal.service'
import { MsalLoginStrategy, MsalLogoutStrategy, MsalTokenStrategy } from './msal.strategy'

const userStoreMock = getStoreMock(useUserStore)

beforeEach(() => {
  vi.spyOn(MsalService, 'logout').mockResolvedValue(undefined)
  vi.spyOn(MsalService, 'getFreshMSALToken').mockResolvedValue(undefined)
  vi.spyOn(MsalService, 'getMSALToken').mockResolvedValue(undefined)
  vi.spyOn(MsalService, 'loginRedirect').mockResolvedValue(undefined)
  vi.spyOn(CurrentUserManager, 'persistToken').mockImplementation(() => undefined)
  vi.spyOn(CurrentUserManager, 'clearUser').mockImplementation(() => undefined)
  vi.spyOn(CurrentUserService, 'getCurrentUser').mockResolvedValue(undefined)
})

describe('MsalLoginStrategy', () => {
  describe('redirect', () => {
    it('should trigger the MSAL login redirect', async () => {
      await new MsalLoginStrategy().redirect()

      expect(MsalService.loginRedirect).toHaveBeenCalledOnce()
    })
  })

  describe('handleRedirectResult', () => {
    it('should persist token, fetch user, track amplitude success and return true when auth succeeds', async () => {
      vi.spyOn(MsalService, 'getMSALToken').mockResolvedValue('msal-token')
      vi.spyOn(CurrentUserService, 'getCurrentUser').mockResolvedValue({ id: 42 } as unknown as UserInfo)
      userStoreMock.getUserId.mockReturnValue(42)
      userStoreMock.getUserEmail.mockReturnValue('collab@example.com')

      const result = await new MsalLoginStrategy().handleRedirectResult()

      expect(result).toBe(true)
      expect(CurrentUserManager.persistToken).toHaveBeenCalledExactlyOnceWith('msal-token')
      expect(CurrentUserService.getCurrentUser).toHaveBeenCalledOnce()
      expect(userStoreMock.setUser).toHaveBeenCalledExactlyOnceWith({ id: 42 })
      expect(AmplitudeServiceMock.identifyCollaborator).toHaveBeenCalledOnce()
      expect(AmplitudeServiceMock.setUserId).toHaveBeenCalledExactlyOnceWith('42')
      expect(AmplitudeServiceMock.setUserEmail).toHaveBeenCalledExactlyOnceWith('collab@example.com')
      expect(AmplitudeServiceMock.track).toHaveBeenCalledExactlyOnceWith('Sign In Completed', {
        sign_in_method: 'SSO',
        sign_in_result: 'succeeded',
      })
    })

    it('should persist empty token, skip user fetch and return false when MSAL returns undefined', async () => {
      vi.spyOn(MsalService, 'getMSALToken').mockResolvedValue(undefined)

      const result = await new MsalLoginStrategy().handleRedirectResult()

      expect(result).toBe(false)
      expect(CurrentUserManager.persistToken).toHaveBeenCalledExactlyOnceWith('')
      expect(CurrentUserService.getCurrentUser).not.toHaveBeenCalled()
      expect(AmplitudeServiceMock.track).not.toHaveBeenCalled()
    })

    it('should roll back, skip amplitude and return false when userId is invalid', async () => {
      vi.spyOn(MsalService, 'getMSALToken').mockResolvedValue('msal-token')
      vi.spyOn(CurrentUserService, 'getCurrentUser').mockResolvedValue({ id: 0 } as unknown as UserInfo)
      userStoreMock.getUserId.mockReturnValue(0)

      const result = await new MsalLoginStrategy().handleRedirectResult()

      expect(result).toBe(false)
      expect(userStoreMock.setUser).toHaveBeenCalledOnce()
      expect(AmplitudeServiceMock.identifyCollaborator).not.toHaveBeenCalled()
      expect(AmplitudeServiceMock.track).not.toHaveBeenCalled()
      expect(CurrentUserManager.clearUser).toHaveBeenCalledOnce()
      expect(loggerMock.error).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'MsalLoginStrategy: invalid user id from getCurrentUser' }),
      )
    })

    it('should roll back and return false when getCurrentUser throws', async () => {
      vi.spyOn(MsalService, 'getMSALToken').mockResolvedValue('msal-token')
      const fetchError = new Error('Network down')
      vi.spyOn(CurrentUserService, 'getCurrentUser').mockRejectedValue(fetchError)

      const result = await new MsalLoginStrategy().handleRedirectResult()

      expect(result).toBe(false)
      expect(CurrentUserManager.persistToken).toHaveBeenCalledExactlyOnceWith('msal-token')
      expect(CurrentUserManager.clearUser).toHaveBeenCalledOnce()
      expect(AmplitudeServiceMock.track).not.toHaveBeenCalled()
      expect(loggerMock.error).toHaveBeenCalledWith(fetchError)
    })
  })
})

describe('MsalLogoutStrategy', () => {
  it('should call MsalService.logout', async () => {
    await new MsalLogoutStrategy().cleanup()

    expect(MsalService.logout).toHaveBeenCalledOnce()
  })
})

describe('MsalTokenStrategy', () => {
  it('should return refreshed token when valid', async () => {
    vi.spyOn(MsalService, 'getFreshMSALToken').mockResolvedValue('msal-fresh')
    vi.mocked(tokenIsValid).mockReturnValue(true)

    const result = await new MsalTokenStrategy().refreshToken()

    expect(result).toBe('msal-fresh')
    expect(MsalService.getFreshMSALToken).toHaveBeenCalledOnce()
    expect(tokenIsValid).toHaveBeenCalledExactlyOnceWith('msal-fresh')
  })

  it('should throw when refreshed token is invalid', async () => {
    vi.spyOn(MsalService, 'getFreshMSALToken').mockResolvedValue('msal-bad')
    vi.mocked(tokenIsValid).mockReturnValue(false)

    await expect(new MsalTokenStrategy().refreshToken())
      .rejects.toThrow('Invalid token received from MSAL refresh')
  })
})
