import { useUserStore, useTokenStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { FeatureFlagManager } from '../feature-flag/feature-flag.manager'

import { GigyaManager } from './gigya.manager'

const loggerMock = vi.hoisted(() => ({ error: vi.fn() }))

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))
vi.mock('../feature-flag/feature-flag.manager')

const userStoreMock = getStoreMock(useUserStore)
const tokenStoreMock = getStoreMock(useTokenStore)

const gigyaLoginMock = vi.fn()
const tokenMock = 'mock-token'

describe('GigyaManager', () => {
  describe('setStoreGigyaUserId', () => {
    it('should not set gigyaUserId given that the token is not available', () => {
      tokenStoreMock.getToken.mockReturnValue('')
      const mockGigyaUserId = 'gigya-user-id'

      GigyaManager.setStoreGigyaUserId(mockGigyaUserId)

      expect(userStoreMock.setGigyaUserId).not.toHaveBeenCalled()
    })

    it('should set gigyaUserId given that the token is available', () => {
      tokenStoreMock.getToken.mockReturnValue(tokenMock)
      const mockGigyaUserId = 'gigya-user-id'

      GigyaManager.setStoreGigyaUserId(mockGigyaUserId)

      expect(userStoreMock.setGigyaUserId).toHaveBeenCalledExactlyOnceWith(mockGigyaUserId)
    })
  })

  describe('loginSSO', () => {
    beforeEach(() => {
      ;(window as any).gigya = { accounts: { login: gigyaLoginMock } }
    })

    it('should call gigya login when feature flag is activated', () => {
      vi.mocked(FeatureFlagManager.isGigyaSsoActivated).mockReturnValue(true)

      GigyaManager.loginSSO('test@email.com', 'password123')

      expect(gigyaLoginMock).toHaveBeenCalledWith({
        loginID: 'test@email.com',
        password: 'password123',
      })
    })

    it('should not call gigya login when feature flag is deactivated', () => {
      vi.mocked(FeatureFlagManager.isGigyaSsoActivated).mockReturnValue(false)

      GigyaManager.loginSSO('test@email.com', 'password123')

      expect(gigyaLoginMock).not.toHaveBeenCalled()
    })

    it('should log error when gigya login throws', () => {
      vi.mocked(FeatureFlagManager.isGigyaSsoActivated).mockReturnValue(true)
      const error = new Error('Gigya error')
      gigyaLoginMock.mockImplementation(() => {
        throw error
      })

      GigyaManager.loginSSO('test@email.com', 'password123')

      expect(loggerMock.error).toHaveBeenCalledWith('Error during Gigya SSO login: ', error)
    })
  })
})
