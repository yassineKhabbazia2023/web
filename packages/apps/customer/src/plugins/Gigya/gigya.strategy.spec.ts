import { CurrentUserManager } from '@pulse/common/managers'
import { getMockedUser } from '@pulse/common/mocks'
import { AmplitudeServiceMock, getStoreMock } from '@pulse/common/mocks/vitest'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { login, refreshClientToken } from '@pulse/common/services/authentication'
import { CurrentUserService } from '@pulse/common/services/current-user'
import { tokenIsValid, useUserStore } from '@pulse/common/stores'

import { GigyaManager } from './gigya.manager'
import { GigyaLoginStrategy, GigyaLogoutStrategy, GigyaTokenStrategy } from './gigya.strategy'

const envVarsMock = vi.hoisted(() => ({
  VITE_GIGYA_SSO_ACTIVATED: 'true',
  VITE_TOKEN_EXPIRATION_BUFFER: '5',
  VITE_API_GATEWAY: 'https://api.example.com/gateway',
}))

vi.mock('env-vars', () => envVarsMock)
vi.mock('@pulse/toolbox')
vi.mock('@pulse/common/managers')
vi.mock('@pulse/common/services/amplitude', () => ({
  AmplitudeService: AmplitudeServiceMock,
}))
vi.mock('@pulse/common/services/authentication')
vi.mock('@pulse/common/services/current-user')
vi.mock('@pulse/common/stores', async () => {
  const actual = await vi.importActual<typeof import('@pulse/common/stores')>('@pulse/common/stores')
  return {
    ...actual,
    tokenIsValid: vi.fn(),
  }
})
vi.mock('./gigya.manager')

const userStoreMock = getStoreMock(useUserStore)
const userMock = getMockedUser()

describe('GigyaLoginStrategy', () => {
  it('should login, persist token, fetch user, track amplitude, set Gigya user id and login SSO', async () => {
    vi.mocked(login).mockResolvedValue({ webToken: 'web-token', userId: 'gigya-user-id' })
    vi.mocked(CurrentUserService.getCurrentUser).mockResolvedValue(userMock)
    userStoreMock.getUserId.mockReturnValue(userMock.id)
    userStoreMock.getUserEmail.mockReturnValue(userMock.email)

    await new GigyaLoginStrategy().authenticate('a@b.com', 'pwd')

    expect(login).toHaveBeenCalledExactlyOnceWith({ email: 'a@b.com', password: 'pwd' })
    expect(CurrentUserManager.persistToken).toHaveBeenCalledExactlyOnceWith('web-token')
    expect(CurrentUserService.getCurrentUser).toHaveBeenCalledOnce()
    expect(userStoreMock.setUser).toHaveBeenCalledExactlyOnceWith(userMock)
    expect(AmplitudeService.identifyCustomer).toHaveBeenCalledOnce()
    expect(AmplitudeService.setUserId).toHaveBeenCalledExactlyOnceWith(userMock.id.toString())
    expect(AmplitudeService.setUserEmail).toHaveBeenCalledExactlyOnceWith(userMock.email)
    expect(AmplitudeService.track).toHaveBeenCalledExactlyOnceWith('Sign In Completed', {
      sign_in_method: 'email',
      sign_in_result: 'succeeded',
    })
    expect(GigyaManager.setStoreGigyaUserId).toHaveBeenCalledExactlyOnceWith('gigya-user-id')
    expect(GigyaManager.loginSSO).toHaveBeenCalledExactlyOnceWith('a@b.com', 'pwd')
  })

  it('should roll back the persisted token and user store and skip Gigya SSO when userId is invalid', async () => {
    vi.mocked(login).mockResolvedValue({ webToken: 'web-token', userId: 'gigya-user-id' })
    vi.mocked(CurrentUserService.getCurrentUser).mockResolvedValue(userMock)
    userStoreMock.getUserId.mockReturnValue(0)

    await expect(new GigyaLoginStrategy().authenticate('a@b.com', 'pwd'))
      .rejects.toThrow('GigyaLoginStrategy: invalid user id from getCurrentUser')

    expect(userStoreMock.setUser).toHaveBeenCalledOnce()
    expect(AmplitudeService.identifyCustomer).not.toHaveBeenCalled()
    expect(AmplitudeService.track).not.toHaveBeenCalled()
    expect(GigyaManager.setStoreGigyaUserId).not.toHaveBeenCalled()
    expect(GigyaManager.loginSSO).not.toHaveBeenCalled()
    expect(CurrentUserManager.persistToken).toHaveBeenCalledExactlyOnceWith('web-token')
    expect(CurrentUserManager.clearUser).toHaveBeenCalledOnce()
  })

  it('should throw when no token is received', async () => {
    vi.mocked(login).mockResolvedValue({ webToken: '', userId: 'gigya-user-id' })

    await expect(new GigyaLoginStrategy().authenticate('a@b.com', 'pwd'))
      .rejects.toThrow('No token received')
    expect(CurrentUserManager.persistToken).not.toHaveBeenCalled()
  })

  it('should roll back the persisted token and user store when getCurrentUser throws', async () => {
    vi.mocked(login).mockResolvedValue({ webToken: 'web-token', userId: 'gigya-user-id' })
    const fetchError = new Error('Network down')
    vi.mocked(CurrentUserService.getCurrentUser).mockRejectedValue(fetchError)

    await expect(new GigyaLoginStrategy().authenticate('a@b.com', 'pwd'))
      .rejects.toThrow(fetchError)

    expect(CurrentUserManager.persistToken).toHaveBeenCalledExactlyOnceWith('web-token')
    expect(CurrentUserManager.clearUser).toHaveBeenCalledOnce()
    expect(GigyaManager.loginSSO).not.toHaveBeenCalled()
  })
})

describe('GigyaLogoutStrategy', () => {
  it('should delegate to GigyaManager.logoutSSO', () => {
    new GigyaLogoutStrategy().cleanup()

    expect(GigyaManager.logoutSSO).toHaveBeenCalledOnce()
  })
})

describe('GigyaTokenStrategy', () => {
  it('should return refreshed token when valid', async () => {
    vi.mocked(refreshClientToken).mockResolvedValue('new-token')
    vi.mocked(tokenIsValid).mockReturnValue(true)

    const result = await new GigyaTokenStrategy().refreshToken()

    expect(result).toBe('new-token')
    expect(refreshClientToken).toHaveBeenCalledOnce()
    expect(tokenIsValid).toHaveBeenCalledExactlyOnceWith('new-token')
  })

  it('should throw when refreshed token is invalid', async () => {
    vi.mocked(refreshClientToken).mockResolvedValue('bad-token')
    vi.mocked(tokenIsValid).mockReturnValue(false)

    await expect(new GigyaTokenStrategy().refreshToken())
      .rejects.toThrow('Invalid token received from Gigya refresh')
  })
})
